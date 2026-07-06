import Button from '@shared/ui/Button/Button';
import styles from './HowIsGoing.module.css';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowIsGoing = () => {
  const { t } = useTranslation();
  const considerItems = t('howIsGoing.considerItems', {
    returnObjects: true,
  }) as string[];
  const processItems = t('howIsGoing.processItems', {
    returnObjects: true,
  }) as string[];
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { y: 100 } : { y: -150 },
        );
      }
    });
  }, []);
  return (
    <section className={styles.howIsGoingSection}>
      <div
        className={styles.textBlock}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        <h3>{t('howIsGoing.considerTitle')}</h3>
        <div
          className={styles.listWrapper}
          ref={el => {
            refs.current[1] = el;
          }}
        >
          <ul>
            {considerItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <h3>{t('howIsGoing.processTitle')}</h3>
        <div
          className={styles.listWrapper}
          ref={el => {
            refs.current[2] = el;
          }}
        >
          <ol>
            {processItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
        <div
          className={styles.buttonWrapper}
          ref={el => {
            refs.current[3] = el;
          }}
        >
          <Link to="/kontakt" style={{ marginTop: '113px' }}>
            <Button
              initialText={t('howIsGoing.cta')}
              clickedText={t('common.redirecting')}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowIsGoing;
