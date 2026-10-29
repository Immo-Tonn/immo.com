import RealEstate from '@pages/RealEstate/RealEstate';
import { loadObjectList } from '@shared/api/propertyLoaders';
import { buildMeta, dict, toLang } from '../seo/meta';

export const loader = () => loadObjectList();
export const clientLoader = () => loadObjectList();

export function meta({ params }: { params: { lang?: string } }) {
  const lang = toLang(params.lang);
  const title = `${dict[lang].realEstate.title} | Immo Tonn`;
  return buildMeta({
    title,
    description: dict[lang].aboutUs.paragraph1,
    lang,
    path: '/immobilien',
  });
}

export default RealEstate;
