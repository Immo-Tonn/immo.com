import { buildMeta, dict, toLang, type Lang } from './meta';

type SeoText = { title: string; description: string };
const seoOf = (lang: Lang, key: string): SeoText => {
  const t = dict[lang].seo as unknown as Record<string, SeoText>;
  // для языков без текста — немецкий (такая языковая версия под noindex)
  return t[key] ?? (dict.de.seo as unknown as Record<string, SeoText>)[key]!;
};

/** meta-функция маршрута: тексты из locale seo.<key>, canonical/hreflang по реестру. */
export const pageMeta =
  (seoKey: string, path: string) =>
  ({ params }: { params: { lang?: string } }) => {
    const lang = toLang(params.lang);
    const { title, description } = seoOf(lang, seoKey);
    return buildMeta({ title, description, lang, path });
  };
