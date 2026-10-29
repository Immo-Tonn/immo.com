import styles from './HeroHome.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import heroImage from '@shared/assets/hero-home/hero-home-3.webp';

const HeroHome = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);

  // мягкий параллакс фото при скролле (отключён при prefers-reduced-motion)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, section.offsetHeight);
      section.style.setProperty('--hero-shift', `${(y * 0.18).toFixed(1)}px`);
      section.style.setProperty('--hero-fade', `${1 - y / section.offsetHeight}`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <img
          className={styles.image}
          src={heroImage}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          <span className={styles.line}>{t('heroHome.line1')}</span>{' '}
          <span className={`${styles.line} ${styles.lineAccent}`}>
            {t('heroHome.line2')}
          </span>{' '}
          <span className={styles.line}>{t('heroHome.line3')}</span>
        </h1>

        <p className={styles.since}>
          <span className={styles.sinceRule} aria-hidden="true" />
          {t('heroHome.tagline')}
        </p>

        <div className={styles.actions}>
          <Link
            to="/wertermittlung"
            className={`${styles.cta} ${styles.ctaPrimary}`}
          >
            {t('heroHome.ctaValuation')}
          </Link>
          <Link
            to="/immobilien"
            className={`${styles.cta} ${styles.ctaGhost}`}
          >
            {t('heroHome.ctaRequest')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
