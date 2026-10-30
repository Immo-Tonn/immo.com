import ContactForm from '@features/contact/ui/ContactForm';
import { pageMeta } from '../seo/pageMeta';

export const meta = pageMeta('kontakt', '/kontakt');

// На странице /kontakt заголовок формы — единственный H1
export default function Kontakt() {
  return <ContactForm headingLevel={1} />;
}
