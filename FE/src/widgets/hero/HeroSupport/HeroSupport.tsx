import React, { useEffect, useRef } from 'react';
import styles from './HeroSupport.module.css';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

const HeroSupport: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    runningBoxShadow(imgRef);
    if (ref.current) {
      fadeInOnScroll(ref, { x: 100 });
    }
  }, []);

  return (
    <section className={styles.heroValuationSection} ref={ref}>
      <div className={styles.textWrapper} ref={imgRef}>
        <div className={styles.textOverlay}>
          <p>
            {t('heroSupport.line1')} <br />
            {t('heroSupport.line2')} <br />
            {t('heroSupport.line3')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSupport;
