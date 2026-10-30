import { mkdirSync, writeFileSync } from 'node:fs';
import type { Config } from '@react-router/dev/config';
import { objectsFingerprint } from './scripts/fingerprint.mjs';

// Для тестового окружения адрес API можно переопределить (по умолчанию — боевой)
const API = process.env.API_BASE_URL ?? 'https://immo-tonn.de/api';
const PAGES = [
  '/',
  '/immobilien',
  '/wertermittlung',
  '/finanzierung',
  '/kontakt',
  '/verkaufssupport',
  '/objectstyling',
  '/recht-und-rat',
  '/rechner',
  '/legalnotice',
  '/privacypolicy',
  '/cancellationpolicy',
  '/kontakt/danke',
];

export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    // Список объектов берём из API во время сборки. При недоступности API
    // сборка должна падать (а не публиковать сайт без объектов).
    const res = await fetch(`${API}/objects`);
    if (!res.ok) throw new Error(`Objects API failed: ${res.status}`);
    const objects = (await res.json()) as { _id: string }[];
    const ids = objects.map(o => o._id);
    // Единый список для postbuild: sitemap и built-objects.json строятся ровно из
    // того, что prerender'ится (иначе данные могли бы разойтись между шагами)
    mkdirSync('.react-router', { recursive: true });
    writeFileSync(
      '.react-router/prerender-objects.json',
      JSON.stringify({ ids, fingerprint: objectsFingerprint(objects) }),
    );
    const langs = ['', '/en', '/ru'];
    const pages = langs.flatMap(l =>
      PAGES.map(p => (l + p === '' ? '/' : l === '' ? p : p === '/' ? l : l + p)),
    );
    const objectPaths = langs.flatMap(l => ids.map(id => `${l}/immobilien/${id}`));
    // React Router запрещает у маршрута `loader`, если он ни разу не пререндерится
    // (ssr:false). Пока в каталоге нет объектов, пререндерим служебный путь: страница
    // под noindex, в sitemap и built-objects.json не попадает.
    if (ids.length === 0) objectPaths.push('/immobilien/_empty');
    return [...pages, ...objectPaths];
  },
} satisfies Config;
