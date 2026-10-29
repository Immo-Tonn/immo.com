import PropertyPage from '@pages/PropertyPage/PropertyPage';
import { loadObjectBundle } from '@shared/api/propertyLoaders';
import type { PropertyBundle } from '@shared/api/usePropertyData';
import { buildMeta, toLang } from '../seo/meta';

const load = ({ params }: { params: { id?: string } }) =>
  loadObjectBundle(params.id!);

// loader — данные при prerender; clientLoader — в браузере, когда объекта нет в
// prerender (новый объект). При ssr:false export `loader` вырезается из клиентской
// сборки, поэтому clientLoader не должен ссылаться на него напрямую.
export const loader = load;
export const clientLoader = load;

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
  const { title, description } = data.object;
  return buildMeta({
    title: `${title} | Immo Tonn`,
    description: description.replace(/\s+/g, ' ').trim().slice(0, 160),
    lang,
    path: `/immobilien/${params.id}`,
    key: '/immobilien/:id',
  });
}

export default PropertyPage;
