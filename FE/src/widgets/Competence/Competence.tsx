import { useEffect, useRef } from 'react';
import styles from './Competence.module.css';
import lightBuilding from '@shared/assets/competence/light-bulding.webp';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';
const Competence = () => {
  const { t } = useTranslation();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 0 } : { x: 150, y: -150 },
        );
      }
    });
  }, []);
  return (
    <section className={styles.competenceSection}>
      <h2
        className={styles.firstTitle}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        {t('competence.title')}
      </h2>
      <span className={styles.line}></span>
      <p
        ref={el => {
          refs.current[1] = el;
        }}
      >
        {t('competence.paragraph1')}
      </p>
      <p
        ref={el => {
          refs.current[2] = el;
        }}
      >
        {t('competence.paragraph2')}
      </p>

      <img
        src={lightBuilding}
        alt="light-house"
        ref={el => {
          refs.current[3] = el;
        }}
      />

      <div className={styles.titleWrapper}>
        <h2
          className={styles.secondTitle}
          ref={el => {
            refs.current[4] = el;
          }}
        >
          {t('competence.secondTitle')}
        </h2>
      </div>
    </section>
  );
};

export default Competence;
