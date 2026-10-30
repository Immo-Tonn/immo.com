// Шаги после `react-router build`:
//  1) 404.html = SPA-fallback → неизвестный URL получает HTTP 404, но SPA
//     всё равно запускается (например, показывает объект, ещё не попавший в prerender);
//  2) built-objects.json — какие объекты есть в этой сборке
//  3) build-info.json — отпечаток данных, с которыми собран сайт
//  4) sitemap.xml: только готовые языковые версии (src/seo/readiness.json) и собранные объекты.
// Список объектов берётся из prerender (API при сборке читает react-router.config.ts;
// при его недоступности сборка падает — прежний деплой остаётся на production).
import { copyFile, readFile, writeFile } from 'node:fs/promises';

const OUT = 'build/client';
const SITE = 'https://immo-tonn.com';
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

// Список объектов — тот же, что prerender'ился (его пишет react-router.config.ts)
const { ids, fingerprint } = JSON.parse(
  await readFile('.react-router/prerender-objects.json', 'utf8'),
);
// Манифест собранных объектов: приложение показывает только их (см. built-objects.ts)
await writeFile(`${OUT}/built-objects.json`, JSON.stringify(ids));
// build-info.json: что именно опубликовано. Backend сверяет отпечаток с текущими данными
// и так обнаруживает пропущенные обновления (см. docs/AUTO-REBUILD.md).
await writeFile(
  `${OUT}/build-info.json`,
  JSON.stringify({ fingerprint, objectCount: ids.length, builtAt: new Date().toISOString() }),
);

const items = [
  ...PAGES.map(p => ({ path: p, key: p })),
  ...ids.map(id => ({ path: `/immobilien/${id}`, key: '/immobilien/:id' })),
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
