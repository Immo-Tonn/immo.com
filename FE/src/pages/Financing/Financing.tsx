import ContactForm from '@features/contact/ui/ContactForm';
import MortgageCalculator from '@features/mortgage/ui/MortgageCalculator';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const Financing = () => {
  return (
    <>
      <MortgageCalculator />
      <ContactForm />
    </>
  );
};

export default withPageShell(Financing);
