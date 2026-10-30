// Проверка механизма автопересборки на mock-сервере (реальный Deploy Hook не используется).
// Запуск: npm run test:rebuild   (сначала собирает TypeScript в dist/)
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const hook = require('../dist/utils/rebuildHook.js');

const SECRET = 'SECRET-TOKEN-123';
let server, port, requests, statusPlan, logs;

const origLog = { log: console.log, warn: console.warn, error: console.error };
const capture = () => {
  logs = [];
  for (const k of ['log', 'warn', 'error']) console[k] = (...a) => logs.push(a.join(' '));
};
const restore = () => Object.assign(console, origLog);
const sleep = ms => new Promise(r => setTimeout(r, ms));

server = http.createServer((req, res) => {
  requests.push({ method: req.method, url: req.url });
  const status = statusPlan.shift() ?? 200;
  res.writeHead(status).end('{}');
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
port = server.address().port;

const url = () => `http://127.0.0.1:${port}/v1/integrations/deploy/${SECRET}`;

beforeEach(() => {
  hook.__resetRebuildState();
  requests = [];
  statusPlan = [];
  process.env.FRONTEND_DEPLOY_HOOK_URL = url();
  Object.assign(hook.rebuildConfig, { debounceMs: 40, maxWaitMs: 5000, retryDelaysMs: [15, 15], timeoutMs: 500 });
  capture();
});
after(() => { restore(); server.close(); });

test('успех: один POST после паузы', async () => {
  hook.requestFrontendRebuild('object:create');
  assert.equal(requests.length, 0, 'хук не вызывается синхронно');
  await sleep(150);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, 'POST');
});

test('серия изменений сливается в один запуск', async () => {
  for (const r of ['object:create', 'object:update', 'object:update', 'object:update', 'object:delete']) {
    hook.requestFrontendRebuild(r);
    await sleep(10);
  }
  await sleep(200);
  assert.equal(requests.length, 1);
});

test('временный сбой: 500, 500, затем 200 → 3 попытки, успех', async () => {
  statusPlan = [500, 500, 200];
  assert.equal(await hook.callDeployHook(url(), ['t']), true);
  assert.equal(requests.length, 3);
});

test('постоянный сбой: ровно 3 попытки, без исключения', async () => {
  statusPlan = [500, 500, 500, 500, 500];
  assert.equal(await hook.callDeployHook(url(), ['t']), false);
  assert.equal(requests.length, 3);
});

test('сервер недоступен: 3 попытки, без исключения', async () => {
  const dead = http.createServer(); await new Promise(r => dead.listen(0, '127.0.0.1', r));
  const p = dead.address().port; dead.close();
  assert.equal(await hook.callDeployHook(`http://127.0.0.1:${p}/x/${SECRET}`, ['t']), false);
  assert.ok(logs.filter(l => l.includes('попытка')).length >= 3);
});

test('не задана переменная или недопустимый адрес → запроса нет', async () => {
  delete process.env.FRONTEND_DEPLOY_HOOK_URL;
  hook.requestFrontendRebuild('object:create');
  process.env.FRONTEND_DEPLOY_HOOK_URL = 'http://example.com/hook';
  hook.requestFrontendRebuild('object:create');
  process.env.FRONTEND_DEPLOY_HOOK_URL = 'not a url';
  hook.requestFrontendRebuild('object:create');
  await sleep(150);
  assert.equal(requests.length, 0);
});

test('maxWait: непрерывные изменения не откладывают запуск бесконечно', async () => {
  Object.assign(hook.rebuildConfig, { debounceMs: 100, maxWaitMs: 200 });
  const t0 = Date.now();
  while (Date.now() - t0 < 320) { hook.requestFrontendRebuild('object:update'); await sleep(30); }
  assert.ok(requests.length >= 1, 'запуск произошёл несмотря на постоянные изменения');
});

test('секретный адрес не попадает в логи', async () => {
  statusPlan = [500, 500, 500];
  await hook.callDeployHook(url(), ['t']);
  hook.requestFrontendRebuild('object:create');
  await sleep(150);
  assert.ok(logs.length > 0);
  assert.ok(logs.every(l => !l.includes(SECRET) && !l.includes('127.0.0.1')), logs.join('\n'));
});

// --- контроллер: хук вызывается ПОСЛЕ успешного сохранения и не влияет на ответ ---
const stubModels = () => {
  const path = n => require.resolve(`../dist/models/${n}.js`);
  const doc = { _id: 'obj1', images: [], videos: [], title: 't', save: async function () { return this; } };
  class RealEstate {
    constructor(body) { Object.assign(this, body); }
    async save() { if (this.fail) throw new Error('db down'); return { _id: 'new1', ...this }; }
    static async findById(id) { return id === 'missing' ? null : { ...doc, lean: () => ({ ...doc }) , then: undefined }; }
    static async findByIdAndUpdate(id) { return id === 'missing' ? null : doc; }
    static async findByIdAndDelete() { return {}; }
  }
  RealEstate.findById = id => { const p = Promise.resolve(id === 'missing' ? null : doc); p.lean = () => Promise.resolve(doc); return p; };
  const Other = { find: async () => [], findById: async () => null, findByIdAndDelete: async () => ({}) };
  const set = (n, M) => { const p = path(n); require.cache[p] = { id: p, filename: p, loaded: true, exports: { __esModule: true, default: M } }; };
  set('RealEstateObjectsModel', RealEstate);
  for (const n of ['ImagesModel', 'VideoModel', 'ApartmentsModel', 'ResidentialHousesModel', 'LandPlotsModel', 'Commercial_NonResidentialBuildingsModel']) set(n, Other);
};
stubModels();
const ctrl = require('../dist/controllers/realEstateObjectsController.js');
const mkRes = () => { const r = { code: 200, sentAt: 0, body: null, status(c) { r.code = c; return r; }, json(b) { r.body = b; r.sentAt = Date.now(); return r; }, set() { return r; } }; return r; };

test('контроллер: create/update/delete после успеха ставят пересборку; ответ не зависит от хука', async () => {
  Object.assign(hook.rebuildConfig, { debounceMs: 30 });
  const r1 = mkRes(); await ctrl.createObject({ body: { title: 'x' } }, r1);
  const r2 = mkRes(); await ctrl.updateObject({ params: { id: 'obj1' }, body: { title: 'y' } }, r2);
  const r3 = mkRes(); await ctrl.deleteObject({ params: { id: 'obj1' } }, r3);
  assert.deepEqual([r1.code, r2.code, r3.code], [201, 200, 200]);
  assert.equal(requests.length, 0, 'до паузы хук не вызван');
  await sleep(150);
  assert.equal(requests.length, 1, 'три изменения → один запуск');
});

test('контроллер: сбой сохранения (400) и «не найден» (404) пересборку не запускают', async () => {
  const r1 = mkRes(); await ctrl.createObject({ body: { fail: true } }, r1);
  const r2 = mkRes(); await ctrl.updateObject({ params: { id: 'missing' }, body: {} }, r2);
  const r3 = mkRes(); await ctrl.deleteObject({ params: { id: 'missing' } }, r3);
  assert.deepEqual([r1.code, r2.code, r3.code], [400, 404, 404]);
  await sleep(150);
  assert.equal(requests.length, 0);
});

test('контроллер: недоступный хук не отменяет успешное сохранение', async () => {
  const dead = http.createServer(); await new Promise(r => dead.listen(0, '127.0.0.1', r));
  const p = dead.address().port; dead.close();
  process.env.FRONTEND_DEPLOY_HOOK_URL = `http://127.0.0.1:${p}/x`;
  Object.assign(hook.rebuildConfig, { debounceMs: 20 });
  const r = mkRes(); await ctrl.createObject({ body: { title: 'x' } }, r);
  assert.equal(r.code, 201);
  assert.equal(r.body.title, 'x');
  await sleep(250); // повторы закончились, ответ уже был отправлен и не изменился
  assert.equal(r.code, 201);
});
