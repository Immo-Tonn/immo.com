import PropertyPage from '@pages/PropertyPage/PropertyPage';
import { loadObjectBundle } from '@shared/api/propertyLoaders';
import { getBuiltObjectIds } from '@shared/api/builtObjects';
import type { PropertyBundle } from '@shared/api/usePropertyData';
import { buildMeta, dict, fitTitle, langPath, SITE_URL, toLang } from '../seo/meta';
import { ORGANIZATION_ID } from '../seo/structuredData';

const load = ({ params }: { params: { id?: string } }) =>
  loadObjectBundle(params.id!);

// loader — данные при prerender; clientLoader — в браузере, когда объекта нет в
// prerender (новый объект). При ssr:false export `loader` вырезается из клиентской
// сборки, поэтому clientLoader не должен ссылаться на него напрямую.
// '_empty' — служебный путь для пустого каталога (см. react-router.config.ts)
export const loader = (args: { params: { id?: string } }) =>
  args.params.id === '_empty' ? null : load(args);

// В браузере показываем только объекты из текущей сборки: URL нового объекта,
// которого ещё нет в prerender, отвечает HTTP 404 — страница не должна показывать
// карточку поверх этого ответа (ни при прямом открытии, ни при переходе из приложения).
export const clientLoader = async (args: { params: { id?: string } }) => {
  const built = await getBuiltObjectIds();
  if (built && !built.has(args.params.id!)) {
    throw new Response(null, { status: 404 });
  }
  return load(args);
};

export function meta({
  data,
  params,
}: {
  data?: PropertyBundle;
  params: { lang?: string; id?: string };
}) {
  const lang = toLang(params.lang);
  if (!data) {
    return [{ title: '404 | Immo Tonn' }, { name: 'robots', content: 'noindex' }];
  }
  const { object, images } = data;
  const flat = object.description.replace(/\s+/g, ' ').trim();
  // описание для сниппета — до 160 символов, обрезка по слову
  const description =
    flat.length <= 160 ? flat : `${flat.slice(0, 159).replace(/\s+\S*$/, '')}…`;
  const path = `/immobilien/${params.id}`;
  const url = SITE_URL + langPath(lang, path);
  // главное фото объекта; служебный параметр ?t= (метка времени) в адрес не берём
  const main = images.find(i => i.type === 'main') ?? images[0];
  const image = main ? encodeURI(main.url.split('?')[0]!) : undefined;
  const sold = object.status === 'sold';
  // Разметка соответствует видимому содержимому страницы; предложение (цена) — только
  // для активных объектов, проданный объект остаётся страницей-архивом без оферты
  const listing = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name: object.title,
    description,
    datePosted: object.dateAdded,
    ...(image ? { image } : {}),
    provider: { '@id': ORGANIZATION_ID },
    ...(!sold && Number(object.price) > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: String(Number(object.price)),
            priceCurrency: 'EUR',
          },
        }
      : {}),
  };
  return buildMeta({
    title: fitTitle(object.title),
    description,
    lang,
    path,
    key: '/immobilien/:id',
    image,
    crumbs: [
      { name: dict[lang].seo.breadcrumb.immobilien, path: '/immobilien' },
      { name: object.title, path },
    ],
    ld: [listing],
  });
}

export default PropertyPage;
