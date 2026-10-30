import DankePage from '@pages/DankePage/DankePage';
import { dict, toLang } from '../seo/meta';

export function meta({ params }: { params: { lang?: string } }) {
  const lang = toLang(params.lang);
  return [{ title: `${dict[lang].dankePage.title} | Immo Tonn` }];
}

export default DankePage;
