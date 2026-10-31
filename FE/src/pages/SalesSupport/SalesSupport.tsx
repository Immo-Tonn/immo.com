import HeroSupport from '@widgets/hero/HeroSupport/HeroSupport';
import AgentBenefits from '@widgets/AgentBenefits/AgentBenefits';
import ImmoTonnContent from '@widgets/ImmoContent/ImmoTonnContent';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const SalesSupport: React.FC = () => {
  return (
    <>
      <HeroSupport />
      <AgentBenefits />
      <ImmoTonnContent />
    </>
  );
};

export default withPageShell(SalesSupport);
