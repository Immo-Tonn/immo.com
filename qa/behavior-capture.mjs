// Фиксация поведения сайта (КРОМЕ админки) для сравнения «до/после» визуального редизайна.
// Запуск: PLAYWRIGHT_CORE=<путь к playwright-core> BASE=http://localhost:5392 node qa/behavior-capture.mjs <out.json>
// Ничего не отправляется наружу: запросы формы перехватываются в браузере (route.fulfill),
// список/карточки объектов читаются боевым API только методом GET.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core');
const BASE = process.env.BASE ?? 'http://localhost:5392';
const OUT = process.argv[2] ?? 'qa/behavior.json';
const API = 'https://immo-tonn.de/api';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => s.replace(/\s+/g, ' ').trim();
const R = { meta: { base: BASE, capturedAt: new Date().toISOString() } };

const browser = await chromium.launch();
const newPage = async (lang = 'de', viewport = { width: 1280, height: 900 }) => {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  // язык задаётся один раз; дальше его хранит само приложение (проверка сохранения после обновления)
  await ctx.addInitScript(l => { if (!localStorage.getItem('immoTonnLanguage')) localStorage.setItem('immoTonnLanguage', l); }, lang);
  const page = await ctx.newPage();
  page.ctx = ctx;
  return page;
};
const go = async (p, path) => { await p.goto(BASE + path, { waitUntil: 'networkidle' }); await sleep(900); };
// ждём, пока значения полей перестанут меняться (в калькуляторе годы ↔ погашение пересчитываются эффектами)
const settle = async p => {
  let prev = '', same = 0;
  for (let i = 0; i < 60 && same < 5; i++) {
    const cur = await p.evaluate(() => [...document.querySelectorAll('main input,main select')].map(e => e.value).join('|'));
    same = cur === prev ? same + 1 : 0; prev = cur; await sleep(150);
  }
};
const safe = async (name, fn) => { if (process.env.ONLY && !process.env.ONLY.split(',').includes(name.split(' ')[0])) return; try { R[name] = await fn(); } catch (e) { R[name] = { ERROR: String(e.message).slice(0, 200) }; } console.log('✓', name); };

const objects = await (await fetch(`${API}/objects`)).json();
const ids = objects.map(o => o._id);

// ---------- 1. Тексты, ссылки, поля форм всех страниц (RU/EN/DE) ----------
const PAGES = ['/wertermittlung', '/immobilien', `/immobilien/${ids[0]}`, `/immobilien/${ids[1]}`, '/finanzierung', '/rechner', '/kontakt', '/kontakt/danke', '/verkaufssupport', '/recht-und-rat', '/objectstyling', '/legalnotice', '/privacypolicy', '/cancellationpolicy', '/zzz-nope'];
await safe('pages', async () => {
  const out = {};
  for (const lang of ['de', 'en', 'ru']) {
    const p = await newPage(lang);
    for (const path of PAGES) {
      await go(p, path);
      const grab = () => p.evaluate(() => {
        const main = document.querySelector('main');
        // сырой текст узлов: не зависит от CSS (text-transform, display) — сравниваются сами тексты
        const lines = [];
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (['SCRIPT', 'STYLE'].includes(n.parentElement?.tagName)) continue;
          const t = n.textContent.replace(/\s+/g, ' ').trim();
          if (t) lines.push(t);
        }
        const controls = [...main.querySelectorAll('input,select,textarea,button')].map(e => ({
          tag: e.tagName, type: e.type || '', id: e.id, name: e.name, ph: e.placeholder || '', ro: !!e.readOnly,
          text: e.tagName === 'BUTTON' ? e.textContent.replace(/\s+/g, ' ').trim() : '',
          opts: e.tagName === 'SELECT' ? [...e.options].map(o => o.value + '=' + o.text) : undefined,
        }));
        const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('#'));
        return { lines, controls, links: [...new Set(links)].sort(), images: main.querySelectorAll('img').length, h1: [...main.querySelectorAll('h1')].map(h => h.textContent.trim()) };
      });
      let snap;
      for (let k = 0; k < 4 && !snap; k++) { try { snap = await grab(); } catch (e) { if (!/context was destroyed|navigation/.test(e.message)) throw e; await sleep(1500); } }
      out[`${lang} ${path.replace(/[0-9a-f]{24}/, ':id')}`] = snap;
    }
    await p.ctx.close();
  }
  // длинные юридические тексты: хранить хэш и длину, не весь текст
  for (const k of Object.keys(out)) if (/privacypolicy/.test(k)) {
    const joined = out[k].lines.join('\n');
    out[k].lines = [`[${joined.length} знаков]`, ...out[k].lines.slice(0, 5)];
    out[k].hash = [...joined].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  }
  return out;
});

// ---------- 2. Калькулятор: матрица входных данных → результаты ----------
const CASES = [
  { n: 'по умолчанию, расчёт', price: '', equity: '', calc: true },
  { n: 'типовой', price: '500000', equity: '100000', interest: '3,5', calc: true },
  { n: 'без капитала (0)', price: '300000', equity: '0', interest: '4', calc: true },
  { n: 'капитал = цене', price: '200000', equity: '200000', interest: '3', calc: true },
  { n: 'капитал > цены', price: '100000', equity: '200000', interest: '3', calc: true },
  { n: 'пустой капитал', price: '400000', equity: '', interest: '3', calc: true },
  { n: 'ставка 3,555 (лишняя цифра)', price: '400000', equity: '50000', interest: '3,555', calc: true },
  { n: 'ставка 15 (вне диапазона)', price: '400000', equity: '50000', interest: '15', calc: true },
  { n: 'ставка 0', price: '400000', equity: '50000', interest: '0', calc: true },
  { n: 'ставка 13,9', price: '400000', equity: '50000', interest: '13,9', calc: true },
  { n: 'срок 1 год, погашение 4,1', price: '250000', equity: '50000', interest: '2,5', years: '1', repayment: '4,1', calc: true },
  { n: 'срок 40 лет, погашение 1,0', price: '750000', equity: '150000', interest: '5', years: '40', repayment: '1,0', calc: true },
  { n: 'налог 3,5, нотариус 1,0, комиссия 1,0', price: '480000', equity: '96000', interest: '3,2', tax: '3,5', notary: '1,0', broker: '1,0', calc: true },
  { n: 'комиссия 3,57 (по умолчанию) нотариус 2,0', price: '480000', equity: '96000', interest: '3,2', notary: '2,0', calc: true },
  { n: 'свой налог 5,55', price: '480000', equity: '96000', interest: '3,2', tax: 'custom', custom: '5,55', calc: true },
  { n: 'свой налог 55 (ошибка)', price: '480000', equity: '96000', interest: '3,2', tax: 'custom', custom: '55', calc: true },
  { n: 'свой налог пустой', price: '480000', equity: '96000', interest: '3,2', tax: 'custom', custom: '', calc: true },
  { n: 'своя комиссия 0', price: '480000', equity: '96000', interest: '3,2', broker: 'custom', custom: '0', calc: true },
  { n: 'ввод цены с буквами abc1234567', price: 'abc1234567', equity: '1000', interest: '3', calc: false },
  { n: 'капитал 1000,555 (лишние знаки)', price: '300000', equity: '1000,555', interest: '3', calc: false },
  { n: 'цена 999999999999', price: '999999999999', equity: '1', interest: '3', calc: true },
];
const runCalc = async (path, lang) => {
  const p = await newPage(lang);
  await go(p, path);
  const res = {};
  for (const c of CASES) {
    await go(p, path); // чистое состояние
    const sels = p.locator('main select');
    const setSel = async (idx, v) => { await sels.nth(idx).selectOption(v); };
    if (c.tax) await setSel(0, c.tax);
    if (c.notary) await setSel(1, c.notary);
    if (c.broker) await setSel(2, c.broker);
    if (c.price !== undefined) await p.locator('#price').fill(c.price);
    if (c.equity !== undefined) await p.locator('#equity').fill(c.equity);
    if (c.repayment) await p.locator('#repayment').selectOption(c.repayment);
    if (c.years) await p.locator('#years').selectOption(c.years);
    if (c.interest !== undefined) await p.locator('main input[inputmode=decimal]').last().fill(c.interest);
    if (c.custom !== undefined) await p.locator('main input[inputmode=decimal]').first().fill(c.custom);
    await settle(p);
    if (c.calc) { await p.locator('main button').first().click(); await sleep(300); await settle(p); }
    res[c.n] = await p.evaluate(() => {
      const main = document.querySelector('main');
      const controls = [...main.querySelectorAll('input,select')].map((e, i) => `${e.id || e.name || 'ctl' + i}=${e.value}`);
      let text = main.textContent.replace(/\s+/g, '');
      // «Monatliche Rate / Monthly installment / Ежемесячный платёж» плавает между прогонами в самом приложении → отдельно
      let monthly = null;
      text = text.replace(/(MonatlicheRate|Monthlyinstallment|Ежемесячныйплатёж):?([\d.,]+)/, (m, label, num) => { monthly = parseFloat(num.replace(/\./g, '').replace(',', '.')); return label + ':<M>'; });
      const errors = [...main.querySelectorAll('[class*=error]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
      return { controls, errors, text, monthly };
    });
  }
  await p.ctx.close();
  return res;
};
await safe('calc /finanzierung de', () => runCalc('/finanzierung', 'de'));
await safe('calc /rechner de', () => runCalc('/rechner', 'de'));
await safe('calc /rechner en', () => runCalc('/rechner', 'en'));
await safe('calc /rechner ru', () => runCalc('/rechner', 'ru'));

// PDF-экспорт калькулятора: текстовое содержимое файла
await safe('pdf', async () => {
  const out = {};
  for (const lang of ['de', 'en', 'ru']) {
    const p = await newPage(lang);
    await go(p, '/rechner');
    await p.locator('#price').fill('500000'); await p.locator('#equity').fill('100000');
    await p.locator('main input[inputmode=decimal]').last().fill('3,5');
    await settle(p); await p.locator('main button').first().click(); await sleep(300); await settle(p);
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), p.locator('main button').nth(1).click()]);
    const path = await dl.path();
    const bytes = fs.readFileSync(path).toString('latin1');
    const texts = [...bytes.matchAll(/\(([^)]*)\)\s*Tj/g)].map(m => m[1].replace(/\x00/g, '').replace(/\d{1,2}\.\d{1,2}\.\d{4}/g, 'DATE'));
    out[lang] = { name: dl.suggestedFilename().replace(/\d{4}-\d{2}-\d{2}/, 'DATE'), texts };
    await p.ctx.close();
  }
  return out;
});

// ---------- 3. Форма контакта ----------
const GOOD_KEY = process.env.RECAPTCHA_OK === '1';
await safe('contact validation', async () => {
  const out = {};
  for (const lang of ['de', 'en', 'ru']) {
    const p = await newPage(lang); let posts = 0; p.on('request', r => { if (r.method() === 'POST') posts++; });
    const errs = async () => p.evaluate(() => [...document.querySelectorAll('main [class*=error]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean));
    await go(p, '/kontakt');
    await p.locator('form button[type=submit]').click(); await sleep(400);
    const empty = await errs();
    await p.locator('input[name=name]').fill('A'); await p.locator('input[name=surname]').fill('B');
    await p.locator('input[name=email]').fill('abc'); await p.locator('input[name=phone]').fill('abc'); await p.locator('textarea[name=message]').fill('x');
    await p.locator('form button[type=submit]').click(); await sleep(400);
    const invalid = await errs();
    await p.locator('input[name=email]').fill('a@b.de'); await p.locator('input[name=phone]').fill('+491743454419'); await p.locator('textarea[name=message]').fill('Testnachricht mit genug Zeichen 123456789');
    await p.locator('form button[type=submit]').click(); await sleep(400);
    const noConsentNoCaptcha = await errs();
    await p.locator('#consent').check(); await p.locator('form button[type=submit]').click(); await sleep(400);
    const noCaptcha = await errs();
    out[lang] = { empty, invalid, noConsentNoCaptcha, noCaptcha, postsSent: posts };
    await p.ctx.close();
  }
  return out;
});


// reCAPTCHA: вместо сети Google подставляем детерминированный скрипт (токен выдаётся сразу)
const stubRecaptcha = p => p.route('**/recaptcha/api.js*', route => {
  const cb = new URL(route.request().url()).searchParams.get('onload');
  route.fulfill({ status: 200, contentType: 'application/javascript', body: `
    window.grecaptcha = { ready: f => f(), render: (el, o) => { setTimeout(() => o.callback && o.callback('TEST-TOKEN'), 120); return 0; },
      getResponse: () => 'TEST-TOKEN', reset: () => {}, execute: () => {}, };
    ${cb ? `window['${cb}'] && window['${cb}']();` : ''}` });
});
// отправка заявки с перехватом: запрос НЕ покидает браузер
const submitScenario = async (mode) => {
  const p = await newPage('de'); const seen = [];
  await p.route('**/api/email', async route => {
    const req = route.request(); seen.push({ method: req.method(), url: new URL(req.url()).pathname, body: JSON.parse(req.postData() || '{}') });
    if (mode === 'ok') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    return route.fulfill({ status: mode === 'err500' ? 500 : 400, contentType: 'application/json', body: JSON.stringify({ message: 'TEST-FEHLER' }) });
  });
  await go(p, '/kontakt');
  await p.locator('input[name=name]').fill('Max'); await p.locator('input[name=surname]').fill('Muster');
  await p.locator('input[name=email]').fill('max@example.com'); await p.locator('input[name=phone]').fill('+491743454419');
  await p.locator('textarea[name=message]').fill('Testnachricht mit genug Zeichen 123456789'); await p.locator('#consent').check();
  const frame = p.frameLocator('iframe[title="reCAPTCHA"]');
  for (let attempt = 0; attempt < 3; attempt++) {
    await frame.locator('#recaptcha-anchor').click({ timeout: 15000 }).catch(() => {});
    for (let i = 0; i < 24; i++) { if (await p.locator('#g-recaptcha-response').inputValue().catch(() => '')) break; await sleep(500); }
    if (await p.locator('#g-recaptcha-response').inputValue().catch(() => '')) break;
  }
  await p.locator('form button[type=submit]').click(); await sleep(1500);
  const payload = seen.map(s => ({ ...s, body: { ...s.body, 'g-recaptcha-response': s.body['g-recaptcha-response'] || s.body.captchaToken ? '[token]' : s.body['g-recaptcha-response'], captchaToken: s.body.captchaToken ? '[token]' : undefined, recaptchaToken: s.body.recaptchaToken ? '[token]' : undefined, token: s.body.token ? '[token]' : undefined } }));
  const out = { requests: payload, url: new URL(p.url()).pathname, errors: await p.evaluate(() => [...document.querySelectorAll('main [class*=error]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean)) };
  await p.ctx.close();
  return out;
};
if (GOOD_KEY) for (const m of ['ok', 'err500', 'err400']) await safe(`contact submit ${m}`, () => submitScenario(m));

// ---------- 4. Объекты: порядок, карточки, переходы, действия ----------
await safe('listing', async () => {
  const p = await newPage('de'); await go(p, '/immobilien');
  const cards = await p.evaluate(() => [...document.querySelectorAll('main a[href^="/immobilien/"]')].map(a => ({ href: a.getAttribute('href'), text: a.textContent.replace(/\s+/g, ' ').trim(), imgs: a.querySelectorAll('img').length })));
  const apiOrder = ids;
  await p.locator('main a[href^="/immobilien/"]').first().click(); await sleep(1200);
  const afterClick = new URL(p.url()).pathname;
  await p.ctx.close();
  return { cards, apiOrder, afterClick };
});
await safe('detail actions', async () => {
  const out = {};
  for (const id of ids.slice(0, 2)) {
    const p = await newPage('de'); await go(p, `/immobilien/${id}`); await sleep(1200);
    const info = await p.evaluate(() => ({
      buttons: [...document.querySelectorAll('main button')].map(b => b.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean),
      imgs: document.querySelectorAll('main img').length,
      links: [...document.querySelectorAll('main a[href]')].map(a => a.getAttribute('href')),
    }));
    // галерея: клик по первой картинке
    const imgClick = await p.locator('main img').first().click({ timeout: 2500 }).then(() => true).catch(() => false);
    await sleep(600);
    info.afterImageClick = await p.evaluate(() => ({ dialog: !!document.querySelector('[role=dialog],[class*=modal],[class*=Modal]'), imgs: document.querySelectorAll('img').length }));
    info.imgClick = imgClick;
    // кнопка «Finanzierung» → переход и предзаполнение цены
    await go(p, `/immobilien/${id}`); await sleep(800);
    const fin = p.locator('main button', { hasText: /Finanz/i }).first();
    if (await fin.count()) { await fin.evaluate(el => el.click()); await sleep(1200); info.financing = { url: new URL(p.url()).pathname, price: await p.locator('#price').inputValue().catch(() => null), equity: await p.locator('#equity').inputValue().catch(() => null) }; }
    out[id] = info; await p.ctx.close();
  }
  return out;
});

// ---------- 5. Язык и переходы ----------
await safe('language switch', async () => {
  const p = await newPage('de'); await go(p, '/wertermittlung');
  const out = {};
  const h1 = () => p.evaluate(() => (document.querySelector('main h1')?.textContent || '').replace(/\s+/g, ' ').trim());
  const btn = l => p.locator('button:visible, a:visible', { hasText: new RegExp(`^${l}$`) }).first();
  out.de = await h1();
  await btn('EN').click(); await sleep(700); out.en = { h1: await h1(), ls: await p.evaluate(() => localStorage.getItem('immoTonnLanguage')), path: new URL(p.url()).pathname };
  await btn('RU').click(); await sleep(700); out.ru = { h1: await h1(), ls: await p.evaluate(() => localStorage.getItem('immoTonnLanguage')) };
  await p.reload({ waitUntil: 'networkidle' }); await sleep(700); out.afterReload = await h1();
  await btn('DE').click(); await sleep(700); out.backDe = await h1();
  await p.ctx.close();
  return out;
});
await safe('navigation', async () => {
  const p = await newPage('de'); await go(p, '/');
  const out = {};
  const hrefs = await p.evaluate(() => [...document.querySelectorAll('header nav a')].map(a => a.getAttribute('href')));
  for (const h of [...new Set(hrefs)]) { await go(p, '/'); await p.locator(`header nav a[href="${h}"]`).first().click(); await sleep(700); out[h] = new URL(p.url()).pathname; }
  await p.ctx.close();
  return out;
});

await browser.close();
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('записано', OUT, Math.round(fs.statSync(OUT).size / 1024) + ' КБ');
