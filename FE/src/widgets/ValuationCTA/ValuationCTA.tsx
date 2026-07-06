import Button from '@shared/ui/Button/Button';
import styles from './ValuationCTA.module.css';
import valuationPhoto from '@shared/assets/valuation-cta/valuation-photo.webp';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ValuationCTA = () => {
  const { t } = useTranslation();
  const imgRef = useRef<HTMLImageElement | null>(null);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    runningBoxShadow(imgRef);

    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0
            ? { x: -100, y: 0, duration: 0.3 }
            : { x: 100, y: -50, duration: 0.6 },
        );
      }
    });
  }, []);

  return (
    <section className={styles.valuationCTASection}>
      <div
        className={styles.textWrapper}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        <h2 className={styles.firstTitle}>
          <b>{t('valuationCTA.firstTitle')}</b>
        </h2>
        <p className={styles.description}>{t('valuationCTA.paragraph1')}</p>
        <p className={styles.description}>{t('valuationCTA.paragraph2')}</p>
      </div>
      <div
        className={styles.imageWrapper}
        ref={el => {
          refs.current[1] = el;
        }}
      >
        <h1 className={styles.secondTitle}>{t('valuationCTA.secondTitle')}</h1>
        <img
          ref={imgRef}
          src={valuationPhoto}
          className={styles.valuationPhoto}
          alt="valuation-photo"
          style={{ boxShadow: '0 4px 41px 11px rgba(0, 0, 0, 0.25)' }}
        />
      </div>
      <div
        className={styles.bottomWrapper}
        ref={el => {
          refs.current[2] = el;
        }}
      >
        <h2 className={styles.thirdTitle}>{t('valuationCTA.thirdTitle')}</h2>
        <p>{t('valuationCTA.thirdParagraph')}</p>
      </div>

      <div
        className={styles.buttonWrapper}
        ref={el => {
          refs.current[3] = el;
        }}
      >
        <Link to="/finanzierung">
          <Button
            initialText={t('valuationCTA.cta')}
            clickedText={t('common.redirecting')}
          />
        </Link>
      </div>
    </section>
  );
};

export default ValuationCTA;
