import PropertyPage from '@pages/PropertyPage/PropertyPage';
import { loadObjectBundle } from '@shared/api/propertyLoaders';
import { getBuiltObjectIds } from '@shared/api/builtObjects';
import type { PropertyBundle } from '@shared/api/usePropertyData';
import { buildMeta, toLang } from '../seo/meta';

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
