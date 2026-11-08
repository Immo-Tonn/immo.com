import { withPageShell } from '@shared/ui/PageShell/PageShell';
import NotFound from '@pages/NotFound/NotFound';

export function meta() {
  return [{ title: '404 | Immo Tonn' }, { name: 'robots', content: 'noindex' }];
}

export default withPageShell(NotFound);
