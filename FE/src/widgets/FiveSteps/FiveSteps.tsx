import styles from './FiveSteps.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Step {
  title: string;
  body: string;
}

const FiveSteps = () => {
  const { t } = useTranslation();
  const steps = t('fiveSteps.steps', { returnObjects: true }) as Step[];

  return (
    <section className={styles.section}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.head} data-reveal="">
          <h2 className={styles.title}>
            <span className={styles.titleLine}>{t('fiveSteps.titleLine1')}</span>{' '}
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>
              {t('fiveSteps.titleLine2')}
            </span>
          </h2>
          <h3 className={styles.subtitle}>{t('fiveSteps.subtitle')}</h3>
        </div>

        <div className={styles.list} data-reveal="" style={{ '--d': '120ms' } as React.CSSProperties}>
          {steps.map((step, i) => (
            <Accordion
              key={i}
              disableGutters
              square
              className={styles.step}
            >
              <AccordionSummary
                expandIcon={<AddIcon />}
                aria-controls={`panel${i + 1}-content`}
                id={`panel${i + 1}-header`}
                className={styles.summary}
              >
                <div className={styles.stepTitle}>{step.title}</div>
              </AccordionSummary>
              <AccordionDetails className={styles.details}>
                {step.body}
              </AccordionDetails>
            </Accordion>
          ))}

          <div className={styles.cta}>
            <Link to="/kontakt" className={styles.ctaButton}>
              {t('fiveSteps.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiveSteps;
