// Сравнение снимка поведения с baseline (состояние ДО редизайна).
// Запуск: node qa/behavior-compare.mjs qa/baseline.json <новый снимок.json>
//   ✗ — регрессия (код выхода 1);  ~ — согласованное изменение (qa/approved-changes.json, с причиной);
//   проверки языковых URL идут без baseline (его в старом виде нет): в новом приложении язык задаёт адрес.
// Baseline не переписывается: любое отличие, которого нет в approved-changes.json, — регрессия.
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const approved = JSON.parse(fs.readFileSync(new URL('./approved-changes.json', import.meta.url), 'utf8'));
let diffs = 0;
const approvedUsed = new Map();
const say = (...x) => { diffs++; console.log('✗', ...x); };
const ok = (reason, n = 1) => approvedUsed.set(reason, (approvedUsed.get(reason) ?? 0) + n);
const strip = s => s.replace(/\s+/g, '');
const ws = s => s.replace(/\s+/g, ' ').trim();
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);
const hasPattern = (list, key) => list.find(r => key.includes(r.pagePattern));

// ---- ссылки: приводим новые URL к виду baseline (язык задаётся префиксом /en, /ru) ----
const normLinks = (links, lang) => {
  const own = lang === 'de' ? null : `/${lang}`;
  const out = new Set();
  for (const raw of links) {
    const l = ws(raw);
    if (/^\/(en|ru)(\/|$)/.test(l) && (!own || !(l === own || l.startsWith(own + '/')))) continue; // ссылка переключателя на другой язык
    out.add(own && (l === own || l.startsWith(own + '/')) ? l.slice(own.length) || '/' : l);
  }
  return out;
};

for (const k of Object.keys(a)) {
  if (k === 'meta') continue;
  if (k === 'pages') {
    for (const pk of Object.keys(a.pages)) {
      const x = a.pages[pk], y = b.pages[pk];
      if (!y) { say(pk, 'нет в новом'); continue; }
      const lang = pk.slice(0, 2);
      const tx = strip(x.lines.join('')), ty = strip(y.lines.join(''));
      if (tx !== ty) {
        const sx = new Set(x.lines.map(strip)), sy = new Set(y.lines.map(strip));
        const lost = x.lines.filter(l => !sy.has(strip(l))), added = y.lines.filter(l => !sx.has(strip(l)));
        const rule = hasPattern(approved.textAdded, pk);
        if (rule && !lost.length) ok(rule.reason);
        else if (!lost.length && !added.length) say(pk, 'тот же текст, другой порядок');
        else say(pk, 'ТЕКСТ отличается; пропало:', JSON.stringify(lost.slice(0, 3)), 'добавилось:', JSON.stringify(added.slice(0, 3)));
      }
      // ссылки
      const lx = new Set([...x.links].map(ws)), ly = normLinks(y.links, lang);
      const gone = [...lx].filter(l => !ly.has(l)), added = [...ly].filter(l => !lx.has(l));
      const restGone = gone.filter(l => {
        const m = approved.linkMoved.find(r => r.from === l && r.to.every(t => ly.has(t)));
        if (m) { ok(m.reason); return false; } return true;
      });
      const pagePath = pk.slice(3).replace(':id', '[0-9a-f]{24}');
      const restAdded = added.filter(l => {
        if (new RegExp(`^${pagePath}$`).test(l)) { ok(approved.switcherSelfLink.reason); return false; }
        const m = approved.linkAdded.find(r => r.value === l)
          || approved.linkMoved.find(r => r.to.includes(l));
        if (m) { ok(m.reason); return false; } return true;
      });
      if (restGone.length || restAdded.length) say(pk, 'ССЫЛКИ отличаются; пропало:', JSON.stringify(restGone), 'добавилось:', JSON.stringify(restAdded));
      if (!same(x.controls, y.controls)) { const r = hasPattern(approved.controlsChanged, pk); if (r) ok(r.reason); else say(pk, 'ПОЛЯ/КНОПКИ отличаются'); }
      if (x.images !== y.images) say(pk, `число картинок ${x.images} → ${y.images}`);
      if (x.hash !== y.hash) say(pk, 'хэш текста отличается');
    }
  } else if (k.startsWith('calc')) {
    for (const c of Object.keys(a[k])) {
      const x = a[k][c], y = b[k]?.[c];
      if (!y) { say(k, c, 'нет'); continue; }
      if (!same(x.controls, y.controls)) say(k, c, 'ЗНАЧЕНИЯ полей', JSON.stringify(x.controls.filter(v => !y.controls.includes(v))), '→', JSON.stringify(y.controls.filter(v => !x.controls.includes(v))));
      if (!same(x.errors, y.errors)) say(k, c, 'ОШИБКИ', JSON.stringify(x.errors), '→', JSON.stringify(y.errors));
      if (x.text !== y.text) say(k, c, 'ТЕКСТ результата отличается');
      if ((x.monthly == null) !== (y.monthly == null)) say(k, c, 'платёж есть только в одном снимке', x.monthly, y.monthly);
      else if (x.monthly != null && Math.abs(x.monthly - y.monthly) / x.monthly > 0.01) say(k, c, `ПЛАТЁЖ ${x.monthly} → ${y.monthly} (отличие больше 1%; в самом приложении он плавает ≈0,2%)`);
    }
  } else if (k.startsWith('contact submit')) {
    const miss = v => v?.requests?.length === 0 && v?.errors?.some(e => /CAPTCHA/i.test(e));
    if (miss(a[k]) || miss(b[k])) console.log('~', k, 'капча Google не пройдена в одном из прогонов — не сравнивается');
    else if (!same(a[k], b[k])) say(k, 'отличается');
  } else if (k === 'detail actions') {
    // Число <img> в документе включает шапку и подвал. Сравниваем галерею отдельно и сверяем с API.
    const cb = approved.chromeImages.baseline;
    for (const id of Object.keys(a[k])) {
      const x = a[k][id], y = b[k]?.[id];
      if (!y) { say(k, id, 'нет'); continue; }
      for (const f of ['buttons', 'imgs', 'imgClick', 'financing']) if (!same(x[f], y[f])) say(k, id, f, 'отличается', JSON.stringify(x[f]), '→', JSON.stringify(y[f]));
      if (!same(x.links.map(ws), y.links.map(ws))) say(k, id, 'ссылки в main отличаются');
      if (x.afterImageClick.dialog !== y.afterImageClick.dialog) say(k, id, 'галерея не открылась');
      const galBase = x.afterImageClick.imgs - cb.header - cb.footer;
      const galNow = y.afterImageClick.imgs - y.afterImageClick.header - y.afterImageClick.footer;
      if (galBase !== galNow) say(k, id, `фото в галерее: baseline ${galBase}, сейчас ${galNow} (по API: ${y.apiImages} + 1 крупный кадр + 3 прочих)`);
      else if (x.afterImageClick.imgs !== y.afterImageClick.imgs) ok(approved.chromeImages.reason);
      if (y.afterImageClick.main !== 3 + y.apiImages + 1) say(k, id, `в main ${y.afterImageClick.main} изображений, по API ожидалось ${3 + y.apiImages + 1}`);
      if (y.afterImageClick.broken) say(k, id, `не загрузились изображений: ${y.afterImageClick.broken}`);
    }
  } else if (k === 'language switch') {
    // в baseline язык хранился в localStorage; теперь его задаёт URL — проверка по смыслу, ниже
  } else if (!same(a[k], b[k])) say(k, 'отличается');
}

// ---- проверки языковых URL (без baseline) ----
const SITE = 'https://immo-tonn.com';
const assert = (cond, ...msg) => { if (!cond) say(...msg); };
const ls = b['language switch'];
if (!ls || ls.ERROR) say('language switch', ls?.ERROR ?? 'нет в снимке');
else for (const [path, s] of Object.entries(ls)) {
  assert(s.de.path === path && s.de.htmlLang === 'de', 'DE', path, JSON.stringify(s.de));
  assert(s.en.path === `/en${path}` && s.en.htmlLang === 'en' && s.en.h1 && s.en.h1 !== s.de.h1, 'DE→EN: та же страница, язык, H1', path, JSON.stringify(s.en));
  assert(s.ru.path === `/ru${path}` && s.ru.htmlLang === 'ru' && s.ru.h1 && s.ru.h1 !== s.en.h1, 'EN→RU: та же страница, язык, H1', path, JSON.stringify(s.ru));
  assert(s.afterReloadRu.path === `/ru${path}` && s.afterReloadRu.htmlLang === 'ru' && s.afterReloadRu.h1 === s.ru.h1, 'RU после обновления страницы', path, JSON.stringify(s.afterReloadRu));
  assert(s.backDeKeyboard.path === path && s.backDeKeyboard.htmlLang === 'de' && s.backDeKeyboard.h1 === s.de.h1, 'RU→DE с клавиатуры (Enter)', path, JSON.stringify(s.backDeKeyboard));
  for (const [l, st] of Object.entries({ de: s.de, en: s.en, ru: s.ru })) assert(st.canonical === SITE + st.path, 'canonical в DOM', path, l, st.canonical);
}
const lu = b['language urls'];
if (!lu || lu.ERROR) say('language urls', lu?.ERROR ?? 'нет в снимке');
else for (const [path, u] of Object.entries(lu)) {
  const lang = /^\/(en|ru)(\/|$)/.test(path) ? path.slice(1, 3) : 'de';
  assert(u.status === 200, path, 'HTTP', u.status);
  assert(u.htmlLang === lang, path, '<html lang>', u.htmlLang);
  assert(u.canonical === SITE + path, path, 'canonical', u.canonical);
  assert(u.canonicalInSitemap, path, 'canonical нет в sitemap');
  assert(same([...new Set(u.switcherHrefs)].sort(), u.switcherExpected), path, 'ссылки переключателя в исходном HTML', JSON.stringify(u.switcherHrefs));
  const langs = u.hreflangs.map(h => h.split('=')[0]).sort();
  assert(same(langs, ['de', 'en', 'ru', 'x-default']), path, 'hreflang', langs.join(','));
  assert(u.hreflangTargetsInSitemap.every(Boolean), path, 'hreflang-адрес не в sitemap');
}
const lm = b['language mobile'];
if (!lm || lm.ERROR) say('language mobile', lm?.ERROR ?? 'нет в снимке');
else {
  assert(same([...lm.drawerLinks].sort(), ['/en/wertermittlung', '/ru/wertermittlung', '/wertermittlung']), 'мобильное меню: ссылки языков', JSON.stringify(lm.drawerLinks));
  assert(lm.afterEnter?.path === '/en/wertermittlung' && lm.afterEnter?.htmlLang === 'en', 'мобильное меню: Enter на ссылке EN', JSON.stringify(lm.afterEnter));
}

for (const [reason, n] of approvedUsed) console.log('~ согласовано:', reason, `(×${n})`);
console.log(diffs ? `\nРЕГРЕССИЙ: ${diffs}` : '\n✓ Регрессий нет: все отличия от baseline согласованы (approved-changes.json), языковые URL работают');
process.exit(diffs ? 1 : 0);
