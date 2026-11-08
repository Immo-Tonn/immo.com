import styles from './FAQ.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className={styles.section}>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className={styles.inner}>
        <h2 className={styles.title} data-reveal="">
          {t('faq.title')}
        </h2>
        <div className={styles.list} data-reveal="" style={{ '--d': '120ms' } as React.CSSProperties}>
          {items.map((item, i) => (
            <Accordion
              key={i}
              disableGutters
              square
              className={styles.accordion}
            >
              <AccordionSummary
                expandIcon={<AddIcon />}
                aria-controls={`faq-panel${i + 1}-content`}
                id={`faq-panel${i + 1}-header`}
                className={styles.summary}
              >
                <div className={styles.question}>{item.question}</div>
              </AccordionSummary>
              <AccordionDetails className={styles.answer}>
                {item.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
