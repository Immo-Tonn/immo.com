// Шаги после `react-router build`:
//  1) 404.html = SPA-fallback → неизвестный URL получает HTTP 404, но SPA
//     всё равно запускается (например, показывает объект, ещё не попавший в prerender);
//  2) sitemap.xml со всеми языковыми версиями и объектами (данные из API).
// При недоступности API сборка падает — прежний деплой остаётся на production.
import { copyFile, readFile, writeFile } from 'node:fs/promises';

const OUT = 'build/client';
const SITE = 'https://immo-tonn.com';
const API = 'https://immo-tonn.de/api';
const PAGES = [
  '/', '/immobilien', '/wertermittlung', '/finanzierung', '/rechner',
  '/verkaufssupport', '/kontakt', '/recht-und-rat', '/objectstyling',
  '/legalnotice', '/privacypolicy', '/cancellationpolicy',
];
// В sitemap и hreflang попадают только ГОТОВЫЕ языковые версии (src/seo/readiness.json)
const readiness = JSON.parse(await readFile('src/seo/readiness.json', 'utf8'));
const ready = key => readiness[key] ?? ['de'];
const url = (lang, p) =>
  SITE + (lang === 'de' ? p : p === '/' ? `/${lang}` : `/${lang}${p}`);

await copyFile(`${OUT}/__spa-fallback.html`, `${OUT}/404.html`);

const res = await fetch(`${API}/objects`);
if (!res.ok) throw new Error(`Objects API failed: ${res.status}`);
const objects = await res.json();
const items = [
  ...PAGES.map(p => ({ path: p, key: p })),
  ...objects.map(o => ({ path: `/immobilien/${o._id}`, key: '/immobilien/:id' })),
];

const entry = ({ path: p, key }) => {
  const langs = ready(key);
  // hreflang — только если готовы минимум 2 языка
  const alt =
    langs.length > 1
      ? langs
          .map(a => `    <xhtml:link rel="alternate" hreflang="${a}" href="${url(a, p)}"/>`)
          .concat(
            langs.includes('de')
              ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${url('de', p)}"/>`]
              : [],
          )
          .join('\n') + '\n'
      : '';
  return langs.map(l => `  <url>\n    <loc>${url(l, p)}</loc>\n${alt}  </url>`).join('\n');
};

await writeFile(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.map(entry).join('\n')}
</urlset>
`,
);
const total = items.reduce((n, i) => n + ready(i.key).length, 0);
console.log(`postbuild: 404.html, sitemap.xml (${total} URL)`);
