import styles from './FiveSteps.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import Button from '@shared/ui/Button/Button';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Step {
  title: string;
  body: string;
}

const FiveSteps = () => {
  const { t } = useTranslation();
  const steps = t('fiveSteps.steps', { returnObjects: true }) as Step[];
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0
            ? { x: -100, y: 0, duration: 0.3 }
            : { x: 100, y: -50, duration: 0.2 },
        );
      }
    });
  }, []);

  return (
    <section className={styles.fiveStepsSection}>
      <div
        className={styles.firstTitleWrap}
        ref={el => {
          refs.current[1] = el;
        }}
      >
        <h2 className={styles.firstTitle}>
          {t('fiveSteps.titleLine1')} <br />
          {t('fiveSteps.titleLine2')}
        </h2>
      </div>
      <div className={styles.secondTitleWrap}>
        <h3 className={styles.secondTitle}>{t('fiveSteps.subtitle')}</h3>
      </div>

      <div className={styles.contentWrapper}>
        <div
          className={styles.itemList}
          ref={el => {
            refs.current[2] = el;
          }}
        >
          {steps.map((step, i) => (
            <Accordion
              key={i}
              sx={{
                m: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownCircleIcon />}
                aria-controls={`panel${i + 1}-content`}
                id={`panel${i + 1}-header`}
                sx={{
                  flexDirection: 'row-reverse',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div className={styles.accordionItem}>{step.title}</div>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  flexDirection: 'row-reverse',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: 0,
                }}
              >
                {step.body}
              </AccordionDetails>
            </Accordion>
          ))}

          <div className={styles.buttonWrapper}>
            <Link style={{ margin: '109px 19px 60px 0' }} to="/kontakt">
              <Button
                className={styles.verkaufButton}
                initialText={t('fiveSteps.cta')}
                clickedText={t('common.redirecting')}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiveSteps;
