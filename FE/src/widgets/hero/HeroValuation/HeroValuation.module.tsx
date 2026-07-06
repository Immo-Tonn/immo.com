import { useEffect, useRef } from 'react';
import styles from './HeroValuation.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

const HeroValuation = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useEffect(() => {
    fadeInOnScroll(ref, { x: 100 });
  }, []);
  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <p>{t('heroValuation.eyebrow')}</p>
      <div className={styles.contentWrapper}>
        <div className={styles.textWrapper}>
          <p>{t('heroValuation.title')}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroValuation;
