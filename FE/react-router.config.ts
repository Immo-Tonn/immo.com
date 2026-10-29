import type { Config } from '@react-router/dev/config';

const API = 'https://immo-tonn.de/api';
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
    const langs = ['', '/en', '/ru'];
    const pages = langs.flatMap(l =>
      PAGES.map(p => (l + p === '' ? '/' : l === '' ? p : p === '/' ? l : l + p)),
    );
    const objectPaths = langs.flatMap(l => ids.map(id => `${l}/immobilien/${id}`));
    return [...pages, ...objectPaths];
  },
} satisfies Config;
