// Сквозной тест автопересборки в ИЗОЛИРОВАННОМ окружении (ничего боевого не затрагивается):
//   • настоящий backend (BE/dist) + временная локальная MongoDB (mongod на 127.0.0.1, tmp-каталог);
//   • настоящие сборки frontend (react-router build) с адресом API на этот backend;
//   • mock «Vercel»: принимает Deploy Hook (ответ 200 = «принято»), запускает сборку, публикует
//     сайт только при её успехе; умеет падать и отменять предыдущую сборку (как Vercel);
//   • локальный «сайт» с 404.html (HTTP 404 для неизвестных URL).
// Запуск: BE_NODE_MODULES=<путь к BE/node_modules> node e2e/rebuild-e2e.mjs
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BE = `${ROOT}/BE`;
const FE = `${ROOT}/FE`;
const { objectsFingerprint } = await import(`${FE}/scripts/fingerprint.mjs`);
const P = { mongo: 27199, be: 39001, hook: 39002, site: 39003, dead: 39099 };
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'immo-e2e-'));
const SITE = `${TMP}/site`;
const MONGO_URI = `mongodb://127.0.0.1:${P.mongo}/immo_e2e`;
const JWT_SECRET = 'e2e-secret';
const T0 = Date.now();
const ts = () => `${((Date.now() - T0) / 1000).toFixed(1).padStart(6)}s`;
const log = (...a) => console.log(ts(), ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const waitFor = async (fn, what, timeout = 120_000, step = 400) => {
  const t = Date.now();
  while (Date.now() - t < timeout) { try { const v = await fn(); if (v) return v; } catch {} await sleep(step); }
  throw new Error(`таймаут: ${what}`);
};
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); log(ok ? '✅' : '❌', name, detail); };

// ---------- подготовка ----------
let linked = false;
if (!fs.existsSync(`${BE}/node_modules`)) {
  if (!process.env.BE_NODE_MODULES) throw new Error('нужен BE_NODE_MODULES (путь к установленным зависимостям BE)');
  fs.symlinkSync(process.env.BE_NODE_MODULES, `${BE}/node_modules`); linked = true;
}
const children = [];
const cleanup = async () => {
  for (const c of children) { try { process.kill(-c.pid, 'SIGKILL'); } catch { try { c.kill('SIGKILL'); } catch {} } }
  await sleep(300);
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
  try { fs.rmSync(`${BE}/dist`, { recursive: true, force: true }); } catch {}
  if (linked) try { fs.unlinkSync(`${BE}/node_modules`); } catch {}
};
process.on('exit', () => { try { if (linked) fs.unlinkSync(`${BE}/node_modules`); } catch {} });

const run = (cmd, args, opts) => spawnSync(cmd, args, { encoding: 'utf8', ...opts });
const cleanEnv = extra => ({ PATH: process.env.PATH, HOME: process.env.HOME, ...extra }); // боевые переменные не наследуются

try {
  log('компиляция backend…');
  const tsc = run(`${BE}/node_modules/.bin/tsc`, ['-p', BE], { cwd: BE, env: cleanEnv({}) });
  if (tsc.status !== 0) throw new Error('tsc backend: ' + tsc.stdout);

  log(`временная MongoDB на 127.0.0.1:${P.mongo} (${TMP}/db)`);
  fs.mkdirSync(`${TMP}/db`);
  const mongod = spawn('mongod', ['--dbpath', `${TMP}/db`, '--port', String(P.mongo), '--bind_ip', '127.0.0.1', '--nounixsocket', '--quiet'], { detached: true, stdio: 'ignore' });
  children.push(mongod);
  const portOpen = port => new Promise(r => { const s = net.connect(port, '127.0.0.1'); s.on('connect', () => { s.destroy(); r(true); }); s.on('error', () => r(false)); });
  await waitFor(() => portOpen(P.mongo), 'mongod');

  const nodeEval = (code) => run('node', ['-e', code], { cwd: BE, env: cleanEnv({ MONGO_URI }) });
  const seed = nodeEval(`(async()=>{const m=require('mongoose');await m.connect(process.env.MONGO_URI);const {AdminModel}=require('./dist/models');const a=await AdminModel.create({email:'e2e@test.local',fullName:'E2E Tester',username:'e2e',password:'e2e-password-123'});console.log(String(a._id));await m.disconnect()})().catch(e=>{console.error(e.message);process.exit(1)})`);
  if (seed.status !== 0) throw new Error('seed admin: ' + seed.stderr);
  const adminId = seed.stdout.trim();
  const token = run('node', ['-e', `console.log(require('jsonwebtoken').sign({id:'${adminId}'},'${JWT_SECRET}',{expiresIn:'1h'}))`], { cwd: BE, env: cleanEnv({}) }).stdout.trim();

  // ---------- mock Vercel ----------
  const vercel = { running: null, failNext: 0, cancelMode: true, hookCalls: 0, builds: [] };
  const publish = () => {
    fs.rmSync(`${TMP}/site_new`, { recursive: true, force: true });
    fs.cpSync(`${FE}/build/client`, `${TMP}/site_new`, { recursive: true });
    fs.rmSync(`${TMP}/site_old`, { recursive: true, force: true });
    if (fs.existsSync(SITE)) fs.renameSync(SITE, `${TMP}/site_old`);
    fs.renameSync(`${TMP}/site_new`, SITE);
  };
  const startBuild = () => {
    const failing = vercel.failNext > 0; if (failing) vercel.failNext--;
    const api = failing ? `http://127.0.0.1:${P.dead}/api` : `http://127.0.0.1:${P.be}/api`;
    const b = { id: vercel.builds.length + 1, startedAt: Date.now(), state: 'running', failing };
    vercel.builds.push(b);
    const buildLog = fs.openSync(`${TMP}/build-${b.id}.log`, 'w');
    const child = spawn('npm', ['run', 'build'], { cwd: FE, detached: true, stdio: ['ignore', buildLog, buildLog], env: cleanEnv({ API_BASE_URL: api, VITE_API_BASE_URL: api, VITE_RECAPTCHA_SITE_KEY: 'e2e-dummy' }) });
    b.child = child; vercel.running = b;
    log(`🏗  сборка #${b.id} запущена${failing ? ' (будет неудачной: API недоступен)' : ''}`);
    child.on('exit', code => {
      if (b.state === 'cancelled') return;
      if (code === 0) { publish(); b.state = 'published'; log(`📦 сборка #${b.id} УСПЕШНА → сайт опубликован`); }
      else {
        b.state = 'failed';
        const tail = fs.readFileSync(`${TMP}/build-${b.id}.log`, 'utf8').split('\n').filter(l => /rror|failed|ECONN|status/i.test(l)).slice(-3).join(' | ').slice(0, 260);
        log(`💥 сборка #${b.id} УПАЛА (код ${code}) → сайт не изменён${b.failing ? ' [запланированный сбой]' : ' ' + tail}`);
      }
      if (vercel.running === b) vercel.running = null;
    });
  };
  const hookSrv = http.createServer((req, res) => {
    vercel.hookCalls++;
    log(`🪝 Deploy Hook вызван (#${vercel.hookCalls}) → отвечаю 200 «принято» (сборка ещё не готова)`);
    if (vercel.running && vercel.cancelMode) { vercel.running.state = 'cancelled'; try { process.kill(-vercel.running.child.pid, 'SIGKILL'); } catch {} log(`🛑 предыдущая сборка #${vercel.running.id} отменена (как делает Vercel для того же хука)`); }
    if (!vercel.running || vercel.cancelMode) startBuild();
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ job: { id: `job_${vercel.hookCalls}`, state: 'PENDING' } }));
  });
  await new Promise(r => hookSrv.listen(P.hook, '127.0.0.1', r));

  // ---------- «сайт»: статика с 404.html ----------
  const types = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.js': 'text/javascript', '.css': 'text/css' };
  const siteSrv = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(SITE, p);
    if (!fs.existsSync(SITE)) return res.writeHead(404).end('no site yet');
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    let status = 200;
    if (!fs.existsSync(f)) { f = path.join(SITE, '404.html'); status = 404; }
    res.writeHead(status, { 'content-type': types[path.extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => siteSrv.listen(P.site, '127.0.0.1', r));
  const site = async (p) => { const r = await fetch(`http://127.0.0.1:${P.site}${p}`); return { status: r.status, text: await r.text() }; };

  // ---------- backend ----------
  let be = null;
  const startBE = (extra = {}) => {
    be = spawn('node', ['dist/app.js'], { cwd: BE, detached: true, stdio: ['ignore', 'pipe', 'pipe'], env: cleanEnv({
      MONGO_URI, JWT_SECRET, PORT: String(P.be), NODE_ENV: 'test',
      FRONTEND_DEPLOY_HOOK_URL: `http://127.0.0.1:${P.hook}/v1/integrations/deploy/E2E-SECRET`,
      FRONTEND_BUILD_INFO_URL: `http://127.0.0.1:${P.site}/build-info.json`,
      REBUILD_DEBOUNCE_MS: '700', REBUILD_RECONCILE_INTERVAL_MS: '3000', REBUILD_RECONCILE_STARTUP_DELAY_MS: '2000',
      REBUILD_RECONCILE_COOLDOWN_MS: '14000', REBUILD_RECONCILE_MAX_ATTEMPTS: '4', ...extra }) });
    children.push(be);
    const onData = d => String(d).split('\n').filter(l => l.includes('[rebuild]')).forEach(l => log('   BE', l.replace(/^.*\[rebuild\]/, '[rebuild]').slice(0, 170)));
    be.stdout.on('data', onData); be.stderr.on('data', onData);
    return waitFor(async () => (await fetch(`http://127.0.0.1:${P.be}/api/objects`)).ok, 'backend');
  };
  const killBE = async () => { try { process.kill(-be.pid, 'SIGKILL'); } catch {} await sleep(500); };
  const api = async (method, p, body) => {
    const r = await fetch(`http://127.0.0.1:${P.be}/api${p}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, json: await r.json().catch(() => null) };
  };
  let seq = 0;
  const mkObj = (title, price = 250000) => ({ number: `E2E-${++seq}`, type: 'Residential Houses', title, description: `Beschreibung für ${title}`, address: { country: 'Deutschland', city: 'Teststadt', zip: 12345, district: 'Mitte', street: 'Teststraße', houseNumber: '1' }, price, status: 'active' });
  const dbUpdate = (id, title) => nodeEval(`(async()=>{const m=require('mongoose');await m.connect(process.env.MONGO_URI);const {RealEstateObjectsModel}=require('./dist/models');await RealEstateObjectsModel.updateOne({_id:'${id}'},{title:'${title}'});await m.disconnect()})()`);
  const currentFp = async () => objectsFingerprint(await (await fetch(`http://127.0.0.1:${P.be}/api/objects`)).json());
  const published = async () => { const r = await site('/build-info.json'); return r.status === 200 ? JSON.parse(r.text).fingerprint : null; };
  const waitPublished = (what, timeout) => waitFor(async () => (await published()) === (await currentFp()), `публикация: ${what}`, timeout);
  const inList = async t => (await site('/immobilien')).text.includes(t);
  const objPage = async id => site(`/immobilien/${id}`);
  const inSitemap = async id => (await site('/sitemap.xml')).text.includes(`/immobilien/${id}<`);
  const inBuilt = async id => JSON.parse((await site('/built-objects.json')).text).includes(id);
  const h1 = html => (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim();

  // ======================= СЦЕНАРИИ =======================
  await startBE();
  log('backend запущен, сайт ещё не опубликован, объектов нет');

  // A. Первая публикация: сайта нет → сверка сама запускает сборку
  await waitPublished('первая сборка (сверка)', 150_000);
  check('A. первая публикация: сайт без build-info получил сборку от сверки', (await published()) === (await currentFp()) && vercel.hookCalls >= 1, `хуков: ${vercel.hookCalls}`);

  // B. СОЗДАНИЕ
  let hooksBefore = vercel.hookCalls;
  const c1 = await api('POST', '/objects', mkObj('E2E Haus Alpha'));
  const O1 = c1.json?._id; const tSaved = Date.now();
  check('B. создание: API сохранил объект (201)', c1.status === 201 && !!O1, `id ${O1}`);
  check('B. до окончания сборки новый объект даёт HTTP 404 и не в списке', (await objPage(O1)).status === 404 && !(await inList('E2E Haus Alpha')));
  await waitFor(() => vercel.hookCalls > hooksBefore, 'вызов хука после создания', 20_000);
  const tAccepted = Date.now();
  await waitPublished('создание', 150_000);
  const tPublished = Date.now();
  const pg = await objPage(O1);
  check('B. создание → HTML карточки: 200, H1, title', pg.status === 200 && h1(pg.text) === 'E2E Haus Alpha' && pg.text.includes('<title>E2E Haus Alpha | Immo Tonn'), `H1=${h1(pg.text)}`);
  check('B. создание → список, sitemap, built-objects', (await inList('E2E Haus Alpha')) && (await inSitemap(O1)) && (await inBuilt(O1)));
  log(`   ⏱ сохранено → хук принят: ${((tAccepted - tSaved) / 1000).toFixed(1)}s → опубликовано: ${((tPublished - tSaved) / 1000).toFixed(1)}s`);

  // C. ИЗМЕНЕНИЕ
  hooksBefore = vercel.hookCalls;
  const u1 = await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha NEU', price: 260000 });
  check('C. изменение: API сохранил (200)', u1.status === 200);
  check('C. до окончания сборки в HTML ещё прежнее название', h1((await objPage(O1)).text) === 'E2E Haus Alpha');
  await waitFor(() => vercel.hookCalls > hooksBefore, 'хук после изменения', 20_000);
  await waitPublished('изменение', 150_000);
  const pg2 = await objPage(O1);
  check('C. изменение → HTML: новое название в H1 и title, объект в sitemap', h1(pg2.text) === 'E2E Haus Alpha NEU' && pg2.text.includes('<title>E2E Haus Alpha NEU | Immo Tonn') && (await inSitemap(O1)));
  check('C. изменение → список показывает новое название', (await inList('E2E Haus Alpha NEU')) && !(await inList('>E2E Haus Alpha<')));

  // D. СОЗДАНИЕ + УДАЛЕНИЕ второго объекта
  hooksBefore = vercel.hookCalls;
  const c2 = await api('POST', '/objects', mkObj('E2E Haus Beta', 310000)); const O2 = c2.json?._id;
  check('D. создание второго объекта: API сохранил (201)', c2.status === 201 && !!O2, `status ${c2.status}`);
  await waitFor(() => vercel.hookCalls > hooksBefore, 'хук после создания O2', 20_000);
  await waitPublished('создание O2', 150_000);
  check('D. второй объект опубликован', (await objPage(O2)).status === 200 && (await inSitemap(O2)));
  hooksBefore = vercel.hookCalls;
  const d2 = await api('DELETE', `/objects/${O2}`);
  check('D. удаление: API удалил объект (200)', d2.status === 200);
  check('D. до окончания сборки удалённый объект ещё отдаёт старый HTML (200)', (await objPage(O2)).status === 200);
  await waitFor(() => vercel.hookCalls > hooksBefore, 'хук после удаления', 20_000);
  await waitPublished('удаление', 150_000);
  check('D. удаление → URL объекта: HTTP 404', (await objPage(O2)).status === 404);
  check('D. удаление → нет в списке, sitemap, built-objects', !(await inList('E2E Haus Beta')) && !(await inSitemap(O2)) && !(await inBuilt(O2)));
  check('D. остальной объект на месте', (await objPage(O1)).status === 200 && (await inSitemap(O1)));

  // E. ПЕРЕЗАПУСК backend в паузе: запуск терялся
  hooksBefore = vercel.hookCalls;
  await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha RESTART' });
  await killBE(); // SIGKILL раньше, чем истёк debounce (700 мс): запуск «потерян»
  await sleep(1500);
  check('E. перезапуск: отложенный запуск потерян (хук не вызван, сайт со старым названием)', vercel.hookCalls === hooksBefore && h1((await objPage(O1)).text) === 'E2E Haus Alpha NEU', `хуков: ${vercel.hookCalls - hooksBefore}`);
  await startBE();
  log('   backend перезапущен; ждём сверку при старте…');
  await waitPublished('восстановление после перезапуска', 150_000);
  check('E. перезапуск: сверка при старте запустила сборку, сайт обновился', h1((await objPage(O1)).text) === 'E2E Haus Alpha RESTART' && vercel.hookCalls > hooksBefore);

  // F. ИЗМЕНЕНИЯ ВО ВРЕМЯ СБОРКИ
  //  F1: правка по событию во время сборки → Vercel отменяет прежнюю сборку, публикуется последняя
  hooksBefore = vercel.hookCalls; const buildsBefore = vercel.builds.length;
  await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha F1-eins' });
  await waitFor(() => vercel.builds.length > buildsBefore && fs.existsSync(`${FE}/.react-router/prerender-objects.json`) && fs.statSync(`${FE}/.react-router/prerender-objects.json`).mtimeMs > vercel.builds.at(-1).startedAt, 'сборка прочитала данные', 60_000, 100);
  await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha F1-zwei' }); // уже ПОСЛЕ чтения данных сборкой
  await waitPublished('F1', 200_000);
  check('F1. изменение после чтения данных сборкой: итог — последняя версия', h1((await objPage(O1)).text) === 'E2E Haus Alpha F1-zwei', `сборок: ${vercel.builds.length - buildsBefore}, отменено: ${vercel.builds.filter(b => b.state === 'cancelled').length}`);
  //  F2: правка БЕЗ события (потерянный хук) во время сборки, сборка без отмены → публикуется устаревшее, затем сверка исправляет
  vercel.cancelMode = false;
  hooksBefore = vercel.hookCalls; const b2 = vercel.builds.length;
  await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha F2-eins' });
  // ждём, пока сборка прочитала и список, и карточки (все страницы отрендерены) — правим только после этого
  await waitFor(() => vercel.builds.length > b2 && fs.readFileSync(`${TMP}/build-${vercel.builds.at(-1).id}.log`, 'utf8').includes('SPA Fallback'), 'сборка прочитала все данные', 60_000, 50);
  dbUpdate(O1, 'E2E Haus Alpha F2-zwei'); // меняем напрямую в БД: события нет
  await waitFor(() => vercel.builds[b2]?.state === 'published', 'сборка F2 завершилась', 120_000);
  check('F2. сборка опубликовала устаревшие данные (старое название на сайте)', h1((await objPage(O1)).text) === 'E2E Haus Alpha F2-eins');
  await waitPublished('F2 (сверка исправила)', 200_000);
  check('F2. сверка заметила расхождение и запустила новую сборку → актуальная версия', h1((await objPage(O1)).text) === 'E2E Haus Alpha F2-zwei', `сборок: ${vercel.builds.length - b2}`);
  vercel.cancelMode = true;

  // G. НЕУДАЧНАЯ СБОРКА VERCEL: хук принят, сайт не обновился → повтор
  hooksBefore = vercel.hookCalls; const b3 = vercel.builds.length;
  vercel.failNext = 1;
  await api('PUT', `/objects/${O1}`, { title: 'E2E Haus Alpha G-final' });
  await waitFor(() => vercel.builds[b3]?.state === 'failed', 'неудачная сборка', 120_000);
  check('G. хук ПРИНЯТ (200), но сборка упала: сайт не обновлён', vercel.hookCalls > hooksBefore && h1((await objPage(O1)).text) === 'E2E Haus Alpha F2-zwei');
  await waitPublished('G (повтор после неудачной сборки)', 200_000);
  check('G. после неудачной сборки сверка повторила запуск → опубликовано', h1((await objPage(O1)).text) === 'E2E Haus Alpha G-final', `хуков всего после правки: ${vercel.hookCalls - hooksBefore}`);

  // Итог: что БЕЗ ручного вмешательства
  check('Итог: отпечаток сайта совпадает с данными', (await published()) === (await currentFp()));
} catch (e) {
  check('сквозной тест завершился без исключения', false, e.message);
} finally {
  await cleanup();
}
const failed = results.filter(r => !r.ok);
console.log(`\n=== ИТОГ: ${results.length - failed.length}/${results.length} проверок пройдено ===`);
failed.forEach(f => console.log('❌', f.name, f.detail));
process.exit(failed.length ? 1 : 0);
