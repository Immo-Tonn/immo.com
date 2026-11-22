import { Link } from '@shared/lib/localeRouter';
import { useTranslation } from 'react-i18next';
import styles from './TippgeberPromo.module.css';

/**
 * Блок акции Tippgeber-Programm на главной (сразу после hero).
 * Страница /tippgeber есть только на немецком, поэтому блок показывается только в немецкой версии.
 */
const TippgeberPromo = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.language.startsWith('de')) return null;

  return (
    <section className={styles.promo} aria-labelledby="tipp-promo-title">
      <div className={styles.inner}>
        <h2 id="tipp-promo-title" className={styles.title} data-reveal="">
          <span className={styles.line}>{t('tippgeberPromo.line1')}</span>{' '}
          <span className={`${styles.line} ${styles.accent}`}>
            {t('tippgeberPromo.line2')}
            <span className={styles.dot} aria-hidden="true" />
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
          <p className={styles.note}>{t('tippgeberPromo.note')}</p>
        </div>
      </div>
    </section>
  );
};

export default TippgeberPromo;
