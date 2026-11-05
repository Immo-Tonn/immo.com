import MortgageCalculator from '@features/mortgage/ui/MortgageCalculator';
import { withPageShell } from '@shared/ui/PageShell/PageShell';
import { pageMeta } from '../seo/pageMeta';

export const meta = pageMeta('rechner', '/rechner');

export default withPageShell(MortgageCalculator);
