import styles from './AboutUs.module.css';
import { Trans, useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal="">
          <span className={styles.numeral} aria-hidden="true">
            1985
          </span>
          <h2 className={styles.title}>
            <span className={styles.titleLine}>{t('aboutUs.titleLine1')}</span>{' '}
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>
              {t('aboutUs.titleLine2')}
            </span>{' '}
            <span className={styles.titleLine}>{t('aboutUs.titleLine3')}</span>
          </h2>
        </div>

        <div className={styles.body}>
          <p className={styles.lead} data-reveal="" style={{ '--d': '80ms' } as React.CSSProperties}>
            {t('aboutUs.paragraph1')}
          </p>
          <p data-reveal="" style={{ '--d': '160ms' } as React.CSSProperties}>
            <Trans
              i18nKey="aboutUs.paragraph2"
              components={{ 0: <strong /> }}
            />
          </p>
          <p data-reveal="" style={{ '--d': '240ms' } as React.CSSProperties}>
            {t('aboutUs.paragraph3')}
          </p>
        </div>
      </div>

      <p className={styles.closing} data-reveal="">
        <b>
          <span className={styles.closingLine}>{t('aboutUs.bottomLine1')}</span>{' '}
          <span className={styles.closingLine}>{t('aboutUs.bottomLine2')}</span>
        </b>
      </p>
    </section>
  );
};

export default AboutUs;
