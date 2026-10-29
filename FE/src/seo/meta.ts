import de from '@shared/i18n/locales/de.json';
import en from '@shared/i18n/locales/en.json';
import ru from '@shared/i18n/locales/ru.json';

export const SITE_URL = 'https://immo-tonn.com';
export const LANGS = ['de', 'en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];
export const dict = { de, en, ru };

export const toLang = (v?: string): Lang =>
  (LANGS as readonly string[]).includes(v ?? '') ? (v as Lang) : 'de';

/** Немецкий — без префикса (существующие URL сохраняются), EN/RU — с префиксом. */
export const langPath = (lang: Lang, path: string) =>
  lang === 'de' ? path : path === '/' ? `/${lang}` : `/${lang}${path}`;

interface MetaInput {
  title: string;
  description: string;
  lang: Lang;
  path: string; // путь без языкового префикса
  image?: string;
  noindex?: boolean;
}

export const buildMeta = ({
  title,
  description,
  lang,
  path,
  image = `${SITE_URL}/og-image.png`,
  noindex,
}: MetaInput) => {
  const url = SITE_URL + langPath(lang, path);
  return [
    { title },
    { name: 'description', content: description },
    ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    { tagName: 'link', rel: 'canonical', href: url },
    ...LANGS.map(l => ({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: l,
      href: SITE_URL + langPath(l, path),
    })),
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: SITE_URL + path },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:locale', content: { de: 'de_DE', en: 'en_US', ru: 'ru_RU' }[lang] },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
};
