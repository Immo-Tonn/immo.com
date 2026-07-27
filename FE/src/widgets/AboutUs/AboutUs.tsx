import { useEffect, useRef } from 'react';
import styles from './AboutUs.module.css';
import { fadeInOnScroll, parallaxMouseEffect } from '@shared/anim/animations';
import { Trans, useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef<any | null>(null);
  const logoRef = useRef<any | null>(null);
  const textRef = useRef<any | null>(null);
  const bottomTextRef = useRef<any | null>(null);
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
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [
        { ref: logoRef, factor: 2 },
        { ref: textRef, factor: 1 },
        { ref: bottomTextRef, factor: 2 },
      ],
    });
    return cleanup;
  }, []);

  return (
    <section className={styles.aboutUsSection}>
      <div className={styles.contentWrapper} ref={wrapperRef}>
        <div className={styles.textBlock} ref={textRef}>
          <div
            className={styles.titleWrapper}
            ref={el => {
              refs.current[0] = el;
            }}
          >
            <h2>
              {t('aboutUs.titleLine1')} <br />
              {t('aboutUs.titleLine2')} <br />
              {t('aboutUs.titleLine3')}
            </h2>
            <div
              className={styles.textWrapper}
              ref={el => {
                refs.current[1] = el;
              }}
            >
              <p>{t('aboutUs.paragraph1')}</p>
              <p>
                <Trans
                  i18nKey="aboutUs.paragraph2"
                  components={{ 0: <strong /> }}
                />
              </p>
              <p>{t('aboutUs.paragraph3')}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={el => {
          refs.current[3] = el;
        }}
      >
        <p className={styles.textBottom} ref={bottomTextRef}>
          <b>
            {t('aboutUs.bottomLine1')} <br />
            {t('aboutUs.bottomLine2')}
          </b>
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
