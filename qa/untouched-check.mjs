// Home, Header/Footer и админка не должны измениться: сравнение скриншотов «до» (чистая ветка Home) и «после».
// Запуск: PLAYWRIGHT_CORE=... A=http://localhost:5393 B=http://localhost:5392 node qa/untouched-check.mjs
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const A = process.env.A, B = process.env.B;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ID = process.env.OBJ_ID ?? '689de19cb584c92052d81afb';
const ROUTES = ['/', '/add-property', '/register', '/forgot-password', '/change-password', '/create-object', `/edit-object/${ID}`, `/preview-object/${ID}`];
const browser = await chromium.launch();
const shot = async (base, path, width) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { localStorage.setItem('immoTonnLanguage', 'de'); sessionStorage.setItem('adminToken', 'qa-fake-token'); sessionStorage.setItem('adminInfo', JSON.stringify({ fullName: 'QA' })); });
  const p = await ctx.newPage();
  await p.route('**/immo-tonn.de/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })); // данные не нужны: сравниваем оформление
  await p.goto(base + path, { waitUntil: 'networkidle' }); await sleep(1200);
  const buf = await p.screenshot({ fullPage: true });
  const size = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
  await ctx.close();
  return { hash: crypto.createHash('sha1').update(buf).digest('hex'), size };
};
let bad = 0;
for (const path of ROUTES) for (const w of [1440, 390]) {
  const a = await shot(A, path, w), b = await shot(B, path, w);
  const same = a.hash === b.hash;
  if (!same) bad++;
  console.log(same ? '✓ одинаково' : '✗ ОТЛИЧАЕТСЯ', path.replace(ID, ':id'), w, same ? '' : `размер ${a.size} → ${b.size}`);
}
await browser.close();
console.log(bad ? `\nОТЛИЧИЙ: ${bad}` : '\n✓ Home, Header/Footer и админка не изменились');
process.exit(bad ? 1 : 0);
