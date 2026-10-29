import Home from '@pages/Home/Home';
import { buildMeta, dict, toLang } from '../seo/meta';

export function meta({ params }: { params: { lang?: string } }) {
  const lang = toLang(params.lang);
  const t = dict[lang];
  // DE — существующие title/description из index.html. EN/RU — временные
  // значения из уже имеющихся переводов (нужна редакторская правка).
  const title =
    lang === 'de'
      ? 'Immo Tonn – Immobilienbewertung mit Herz und Verstand'
      : `${t.heroHome.line1} ${t.heroHome.line2} ${t.heroHome.line3} | Immo Tonn`;
  const description =
    lang === 'de'
      ? 'Immo-Tonn in Münster: Verlässliche Immobilienbewertung, Verkauf und Vermittlung von Wohnungen, Häusern und Grundstücken. Jetzt kostenlos bewerten lassen!'
      : t.aboutUs.paragraph1;
  return buildMeta({ title, description, lang, path: '/' });
}

export default Home;
