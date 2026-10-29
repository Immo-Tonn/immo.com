import Valuation from '@pages/Valuation/Valuation';
import { buildMeta, dict, toLang } from '../seo/meta';

export function meta({ params }: { params: { lang?: string } }) {
  const lang = toLang(params.lang);
  const { title, description } = dict[lang].seo.wertermittlung;
  return buildMeta({ title, description, lang, path: '/wertermittlung' });
}

export default Valuation;
