import ContactForm from '@features/contact/ui/ContactForm';
import styles from './LawAndAdvice.module.css';
import rechtHero from '@shared/assets/law-and-advice/hero-law.webp';
import rechtMain from '@shared/assets/law-and-advice/law-and-advice.webp';
import rechtSecondary from '@shared/assets/law-and-advice/law-and-advice_2.webp';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, runningBoxShadow } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

const LawAndAdvice = () => {
  const { t } = useTranslation();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    runningBoxShadow(imgRef);
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 50 } : { x: 100, y: -50 },
        );
    });
  }, []);

  return (
    <section className={styles.rechtSection}>
      <div className={styles.imageWrapper}>
        <img
          src={rechtHero}
          className={styles.image}
          alt="Beratung Schritt 1"
          ref={el => {
            refs.current[0] = el;
          }}
        />
        <div className={styles.firstTitleWrapper}>
          <h1>{t('lawAndAdvice.pageTitle')}</h1>
        </div>
      </div>

      <h2
        ref={el => {
          refs.current[2] = el;
        }}
      >
        {t('lawAndAdvice.introLine1')} <br />
        {t('lawAndAdvice.introLine2')}
      </h2>

      <div
        className={styles.textBlockL}
        ref={el => {
          refs.current[1] = el;
        }}
      >
        <div className={styles.blockTitle}>
          <h2>{t('lawAndAdvice.block1Title')}</h2>
        </div>
        <div className={styles.blockText}>
          <p>{t('lawAndAdvice.block1Text')}</p>
        </div>
      </div>

      <hr />

      <div
        className={styles.textBlockR}
        ref={el => {
          refs.current[3] = el;
        }}
      >
        <div className={styles.blockText}>
          <p>{t('lawAndAdvice.block2Text')}</p>
        </div>
        <div className={styles.blockTitle}>
          <h2>{t('lawAndAdvice.block2Title')}</h2>
        </div>
      </div>
      <div
        ref={el => {
          refs.current[5] = el;
        }}
      >
        <img
          src={rechtMain}
          className={styles.image}
          alt="Beratung Schritt 2"
          ref={imgRef}
        />
      </div>
      <div
        className={styles.textBlockL}
        ref={el => {
          refs.current[4] = el;
        }}
      >
        <div className={styles.blockTitle}>
          <h2>{t('lawAndAdvice.block3Title')}</h2>
        </div>
        <div className={styles.blockText}>
          <p>{t('lawAndAdvice.block3Text')}</p>
        </div>
      </div>

      <hr />

      <div
        className={styles.textBlockR}
        ref={el => {
          refs.current[6] = el;
        }}
      >
        <div className={styles.blockText}>
          <p>{t('lawAndAdvice.block4Text')}</p>
        </div>
        <div className={styles.blockTitle}>
          <h2>{t('lawAndAdvice.block4Title')}</h2>
        </div>
      </div>

      <img
        src={rechtSecondary}
        className={styles.image}
        alt="Beratung Schritt 3"
        ref={el => {
          refs.current[7] = el;
        }}
      />

      <div className={styles.textBlockL}>
        <div
          className={styles.blockTitle}
          ref={el => {
            refs.current[9] = el;
          }}
        >
          <h2>{t('lawAndAdvice.block5Title')}</h2>
        </div>
        <div
          className={styles.blockText}
          ref={el => {
            refs.current[10] = el;
          }}
        >
          <p>{t('lawAndAdvice.block5Text')}</p>
        </div>
      </div>

      <hr />

      <p
        className={styles.ziel}
        ref={el => {
          refs.current[8] = el;
        }}
      >
        {t('lawAndAdvice.goalLine1')} <br />
        {t('lawAndAdvice.goalLine2')}
      </p>

      <ContactForm />
    </section>
  );
};

export default LawAndAdvice;
