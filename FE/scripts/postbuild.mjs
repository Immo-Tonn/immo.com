// Шаги после `react-router build`:
//  1) 404.html = SPA-fallback → неизвестный URL получает HTTP 404, но SPA
//     всё равно запускается (например, показывает объект, ещё не попавший в prerender);
//  2) sitemap.xml со всеми языковыми версиями и объектами (данные из API).
// При недоступности API сборка падает — прежний деплой остаётся на production.
import { copyFile, writeFile } from 'node:fs/promises';

const OUT = 'build/client';
const SITE = 'https://immo-tonn.com';
const API = 'https://immo-tonn.de/api';
const PAGES = [
  '/', '/immobilien', '/wertermittlung', '/finanzierung', '/rechner',
  '/verkaufssupport', '/kontakt', '/recht-und-rat', '/objectstyling',
  '/legalnotice', '/privacypolicy', '/cancellationpolicy',
];
const LANGS = ['de', 'en', 'ru'];
const url = (lang, p) =>
  SITE + (lang === 'de' ? p : p === '/' ? `/${lang}` : `/${lang}${p}`);

await copyFile(`${OUT}/__spa-fallback.html`, `${OUT}/404.html`);

const res = await fetch(`${API}/objects`);
if (!res.ok) throw new Error(`Objects API failed: ${res.status}`);
const objects = await res.json();
const paths = [...PAGES, ...objects.map(o => `/immobilien/${o._id}`)];

const entry = p =>
  LANGS.map(
    l => `  <url>
    <loc>${url(l, p)}</loc>
${LANGS.map(a => `    <xhtml:link rel="alternate" hreflang="${a}" href="${url(a, p)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('de', p)}"/>
  </url>`,
  ).join('\n');

await writeFile(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(entry).join('\n')}
</urlset>
`,
);
console.log(`postbuild: 404.html, sitemap.xml (${paths.length * LANGS.length} URL)`);
