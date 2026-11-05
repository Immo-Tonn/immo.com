import ContactForm from '@features/contact/ui/ContactForm';
import { withPageShell } from '@shared/ui/PageShell/PageShell';
import { pageMeta } from '../seo/pageMeta';

export const meta = pageMeta('kontakt', '/kontakt');

// На странице /kontakt заголовок формы — единственный H1
const KontaktPage = withPageShell(ContactForm);
export default function Kontakt() {
  return <KontaktPage headingLevel={1} />;
}
