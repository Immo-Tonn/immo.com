import { Link } from '@shared/lib/localeRouter';
import { Trans, useTranslation } from 'react-i18next';
import styles from './TippgeberPromo.module.css';

/** Блок акции Tippgeber-Programm на главной (сразу после hero). */
const TippgeberPromo = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.promo} aria-labelledby="tipp-promo-title">
      <div className={styles.inner}>
        <h2 id="tipp-promo-title" className={styles.title} data-reveal="">
          <span className={styles.line}>{t('tippgeberPromo.line1')}</span>{' '}
          <span className={`${styles.line} ${styles.accent}`}>
            {t('tippgeberPromo.line2')}
          </span>
        </h2>
        <div
          className={styles.body}
          data-reveal=""
          style={{ '--d': '120ms' } as React.CSSProperties}
        >
          <p className={styles.text}>{t('tippgeberPromo.text')}</p>
          <Link to="/tippgeber" className={styles.cta}>
            {t('tippgeberPromo.cta')}
          </Link>
          <p className={styles.note}>
            <Trans
              i18nKey="tippgeberPromo.note"
              components={[
                <Link
                  key="conditions"
                  to="/tippgeber#teilnahmebedingungen"
                  className={styles.noteLink}
                />,
              ]}
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default TippgeberPromo;
