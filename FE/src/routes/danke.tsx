import DankePage from '@pages/DankePage/DankePage';
import { withPageShell } from '@shared/ui/PageShell/PageShell';
import { dict, toLang } from '../seo/meta';

export function meta({ params }: { params: { lang?: string } }) {
  const lang = toLang(params.lang);
  return [{ title: `${dict[lang].dankePage.title} | Immo Tonn` }];
}

export default withPageShell(DankePage);
