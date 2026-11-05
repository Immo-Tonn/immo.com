// Сверка «данные ↔ опубликованный сайт»: восстановление пропущенных обновлений.
// Всё на mock-серверах (API, сайт, Deploy Hook); реальный хук/сайт не используются.
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const hook = require('../dist/utils/rebuildHook.js');
const rec = require('../dist/utils/rebuildReconciler.js');
const { objectsFingerprint: beFp } = require('../dist/utils/fingerprint.js');
const { objectsFingerprint: feFp } = await import('../../FE/scripts/fingerprint.mjs');

const origLog = { log: console.log, warn: console.warn, error: console.error };
let logs;
const capture = () => { logs = []; for (const k of ['log', 'warn', 'error']) console[k] = (...a) => logs.push(a.join(' ')); };
after(() => { Object.assign(console, origLog); srv.closeAllConnections?.(); srv.close(); });

// --- mock-сервисы ---
let objects, siteInfo, siteMode, apiDown, hookCalls, hookStatus;
const srv = http.createServer((req, res) => {
  if (req.url.startsWith('/api/objects')) { if (apiDown) return res.writeHead(500).end(); return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(objects)); }
  if (req.url.startsWith('/build-info.json')) {
    if (siteMode === 'down') return req.socket.destroy();
    if (siteMode === '404') return res.writeHead(404).end();
    return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ fingerprint: siteInfo }));
  }
  if (req.url.startsWith('/hook')) { hookCalls++; return res.writeHead(hookStatus).end(JSON.stringify({ job: { id: 'job_' + hookCalls, state: 'PENDING' } })); }
  res.writeHead(404).end();
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
const base = `http://127.0.0.1:${port}`;

const A = { _id: 'a1', title: 'Haus A', price: 100 };
const B = { _id: 'b2', title: 'Haus B', price: 200 };
const T0 = 1_000_000_000;
// reconcileOnce с заданным «текущим временем» (часы общие с хуком)
const at = t => { hook.clock.now = () => t; return rec.reconcileOnce(); };
const MIN = 60_000;

beforeEach(() => {
  hook.clock.now = () => Date.now();
  hook.__resetRebuildState(); rec.__resetReconcilerState();
  objects = [A, B]; siteInfo = beFp([A, B]); siteMode = 'ok'; apiDown = false; hookCalls = 0; hookStatus = 200;
  process.env.FRONTEND_DEPLOY_HOOK_URL = `${base}/hook/SECRET-TOKEN`;
  process.env.FRONTEND_BUILD_INFO_URL = `${base}/build-info.json`;
  process.env.REBUILD_RECONCILE_API_URL = `${base}/api/objects`;
  Object.assign(hook.rebuildConfig, { debounceMs: 30, maxWaitMs: 5000, retryDelaysMs: [5, 5], timeoutMs: 500 });
  Object.assign(rec.reconcileConfig, { cooldownMs: 10 * MIN, maxAttempts: 3 });
  capture();
});

test('отпечаток: алгоритм FE и BE даёт одинаковый результат (порядок ключей и объектов не важен)', () => {
  const x = [{ _id: 'b', z: 1, a: { y: [1, { q: 2, p: 1 }], x: null }, s: 'ü' }, { _id: 'a', k: [] }];
  const y = [{ k: [], _id: 'a' }, { a: { x: null, y: [1, { p: 1, q: 2 }] }, s: 'ü', z: 1, _id: 'b' }];
  assert.equal(beFp(x), feFp(x));
  assert.equal(beFp(x), beFp(y));
  assert.notEqual(beFp(x), beFp([...x, { _id: 'c' }]));
});

test('сайт актуален → хук не вызывается', async () => {
  assert.equal(await at(T0), 'in-sync');
  assert.equal(hookCalls, 0);
});

test('восстановление после перезапуска: изменение пропущено, при старте сверка запускает сборку', async () => {
  // объект изменили, а запуск пропал (перезапуск backend в паузе): состояние памяти пусто
  objects = [A, { ...B, title: 'Haus B (neu)' }];
  hook.__resetRebuildState(); rec.__resetReconcilerState(); // «перезапуск»
  assert.equal(await at(T0), 'triggered');
  assert.equal(hookCalls, 1);
});

test('«принято» ≠ «опубликовано»: до обновления build-info сайт считается отстающим', async () => {
  objects = [A, B, { _id: 'c3', title: 'neu' }];
  assert.equal(await at(T0), 'triggered');
  assert.ok(logs.some(l => l.includes('ПРИНЯТ') && l.includes('не публикация')), 'лог говорит, что это ещё не публикация');
  assert.ok(!logs.some(l => l.includes('ОПУБЛИКОВАНО')));
  // сборка идёт: сайт ещё прежний → ждём, повторно не запускаем
  assert.equal(await at(T0 + 2 * MIN), 'waiting');
  assert.equal(hookCalls, 1);
  // сборка завершилась успешно: build-info обновился
  siteInfo = beFp(objects);
  assert.equal(await at(T0 + 3 * MIN), 'in-sync');
  assert.ok(logs.some(l => l.includes('ОПУБЛИКОВАНО')));
});

test('изменение во время сборки: сборка завершилась со старыми данными → запускается новая', async () => {
  objects = [A, B, { _id: 'c3', title: 'neu' }];
  assert.equal(await at(T0), 'triggered'); // сборка 1 принята, прочитала данные [A,B,C]
  const built1 = beFp(objects);
  objects = [A, B, { _id: 'c3', title: 'neu (исправлено)' }]; // правка уже после чтения данных сборкой
  siteInfo = built1; // сборка 1 опубликована — но с устаревшими данными
  assert.equal(await at(T0 + 11 * MIN), 'triggered');
  assert.equal(hookCalls, 2);
  siteInfo = beFp(objects);
  assert.equal(await at(T0 + 12 * MIN), 'in-sync');
});

test('повтор после неудачной сборки Vercel: хук принят, сайт не обновился → повтор с растущим интервалом и пределом', async () => {
  objects = [A, B, { _id: 'c3', title: 'neu' }]; // siteInfo не меняется: сборки падают
  assert.equal(await at(T0), 'triggered');                 // попытка 1
  assert.equal(await at(T0 + 5 * MIN), 'waiting');
  assert.equal(await at(T0 + 11 * MIN), 'triggered');      // попытка 2 (после 10 мин)
  assert.equal(await at(T0 + 25 * MIN), 'waiting');        // следующая не раньше 20 мин
  assert.equal(await at(T0 + 32 * MIN), 'triggered');      // попытка 3 (после 20 мин)
  assert.equal(await at(T0 + 80 * MIN), 'stalled');        // предел: больше не запускаем
  assert.equal(await at(T0 + 200 * MIN), 'stalled');
  assert.equal(hookCalls, 3);
  assert.equal(logs.filter(l => l.includes('СВЕРКА ОСТАНОВЛЕНА')).length, 1, 'ошибка в логе один раз');
  // данные изменились → серия начинается заново
  objects = [A, B];
  objects.push({ _id: 'd4', title: 'ещё' });
  assert.equal(await at(T0 + 201 * MIN), 'triggered');
  assert.equal(hookCalls, 4);
});

test('сайт без build-info.json (404) → первая сборка запускается; сетевая ошибка → нет', async () => {
  siteMode = '404';
  assert.equal(await at(T0), 'triggered');
  hook.__resetRebuildState(); rec.__resetReconcilerState(); hookCalls = 0;
  siteMode = 'down';
  assert.equal(await at(T0), 'site-unavailable');
  assert.equal(hookCalls, 0);
});

test('API недоступен → не запускаем (нельзя сравнить)', async () => {
  apiDown = true; siteInfo = 'old';
  assert.equal(await at(T0), 'api-unavailable');
  assert.equal(hookCalls, 0);
});

test('есть отложенный запуск по событию → сверка не вмешивается', async () => {
  objects = [A, B, { _id: 'c3' }];
  hook.rebuildConfig.debounceMs = 200;
  hook.requestFrontendRebuild('object:create');
  assert.equal(await at(T0), 'pending-event');
  assert.equal(hookCalls, 0);
  await new Promise(r => setTimeout(r, 400));
  assert.equal(hookCalls, 1, 'сработал отложенный запуск');
  assert.equal(await at(T0 + 1000), 'waiting', 'сразу после принятого запуска сверка ждёт');
});

test('без переменных сверка выключена; хук недоступен → trigger-failed без исключения', async () => {
  delete process.env.FRONTEND_BUILD_INFO_URL;
  assert.equal(await at(T0), 'disabled');
  process.env.FRONTEND_BUILD_INFO_URL = `${base}/build-info.json`;
  objects = [A]; hookStatus = 500;
  assert.equal(await at(T0), 'trigger-failed');
  assert.ok(logs.every(l => !l.includes('SECRET-TOKEN')));
});
