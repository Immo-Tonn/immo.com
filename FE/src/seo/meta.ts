import de from '@shared/i18n/locales/de.json';
import en from '@shared/i18n/locales/en.json';
import ru from '@shared/i18n/locales/ru.json';
import readiness from './readiness.json';

export const SITE_URL = 'https://immo-tonn.com';
export const LANGS = ['de', 'en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];
export const dict = { de, en, ru };

export const toLang = (v?: string): Lang =>
  (LANGS as readonly string[]).includes(v ?? '') ? (v as Lang) : 'de';

/** Немецкий — без префикса (существующие URL сохраняются), EN/RU — с префиксом. */
export const langPath = (lang: Lang, path: string) =>
  lang === 'de' ? path : path === '/' ? `/${lang}` : `/${lang}${path}`;

/**
 * Языки, для которых страница ГОТОВА (есть редакторские тексты и мета).
 * Единый источник для hreflang, noindex и sitemap (readiness.json).
 * Нет в списке — только de.
 */
export const readyLangs = (key: string): Lang[] =>
  ((readiness as Record<string, string[]>)[key] as Lang[] | undefined) ?? ['de'];

/** Ключ реестра по pathname: без языкового префикса и слэша в конце. */
export const readinessKey = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const m = clean.match(/^\/(en|ru)(\/.*)?$/);
  const path = m ? m[2] || '/' : clean;
  return /^\/immobilien\/[^/]+$/.test(path) ? '/immobilien/:id' : path;
};

export const langOf = (pathname: string): Lang => {
  const first = pathname.split('/')[1];
  return first === 'en' || first === 'ru' ? first : 'de';
};

interface MetaInput {
  title: string;
  description: string;
  lang: Lang;
  path: string; // путь без языкового префикса
  key?: string; // ключ в readiness.json (по умолчанию path)
  image?: string;
  noindex?: boolean; // только для служебных страниц (не для неготовых языков)
}

export const buildMeta = ({
  title,
  description,
  lang,
  path,
  key = path,
  image = `${SITE_URL}/og-image.png`,
  noindex,
}: MetaInput) => {
  const url = SITE_URL + langPath(lang, path);
  const ready = readyLangs(key);
  // hreflang — только между готовыми языковыми версиями (от 2 языков)
  const alternates =
    ready.length > 1
      ? [
          ...ready.map(l => ({
            tagName: 'link',
            rel: 'alternate',
            hrefLang: l,
            href: SITE_URL + langPath(l, path),
          })),
          ...(ready.includes('de')
            ? [{ tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: SITE_URL + path }]
            : []),
        ]
      : [];
  return [
    { title },
    { name: 'description', content: description },
    ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    { tagName: 'link', rel: 'canonical', href: url },
    ...alternates,
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:locale', content: { de: 'de_DE', en: 'en_US', ru: 'ru_RU' }[lang] },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
};
