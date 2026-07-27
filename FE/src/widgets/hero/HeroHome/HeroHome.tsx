import Button from '@shared/ui/Button/Button';
import styles from './HeroHome.module.css';
import { Link } from 'react-router-dom';
import { fadeInOnScroll, parallaxMouseEffect } from '@shared/anim/animations';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
const HeroHome = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef<any | null>(null);
  const textRef = useRef<any | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0
            ? { x: -100, y: 0, duration: 0.85 }
            : { x: 100, y: -50, duration: 0.2 },
        );
      }
    });
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [{ ref: textRef, factor: 2 }],
    });
    return cleanup;
  }, []);
  return (
    <section className={styles.heroSection}>
      <div
        className={styles.heroContentWrapper}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        <div className={styles.topTextWrapper} ref={wrapperRef}>
          <h1 className={styles.topText} ref={textRef}>
            {t('heroHome.line1')}
            <br />
            {t('heroHome.line2')}
            <br />
            {t('heroHome.line3')}
          </h1>
        </div>

        <div
          className={styles.bottomBar}
          ref={el => {
            refs.current[2] = el;
          }}
        >
          <div className={styles.buttonWrapper}>
            <Link to="/wertermittlung">
              <Button
                initialText={t('heroHome.ctaValuation')}
                clickedText={t('common.redirecting')}
              />
            </Link>
          </div>
          <div className={styles.buttonWrapper}>
            <Link to="/immobilien">
              <Button
                initialText={t('heroHome.ctaRequest')}
                clickedText={t('common.redirecting')}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
