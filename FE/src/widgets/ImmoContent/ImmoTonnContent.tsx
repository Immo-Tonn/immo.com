import Button from '@shared/ui/Button/Button';
import styles from './ImmoTonnContent.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

interface ListItem {
  title: string;
  description: string;
}

const ImmoTonnContent: React.FC = () => {
  const { t } = useTranslation();
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          {
            x: i % 2 === 0 ? 50 : -100,
            y: i % 2 === 0 ? 0 : -50,
          },
        );
    });
  }, []);

  const listItemData = t('immoTonnContent.items', {
    returnObjects: true,
  }) as ListItem[];

  return (
    <>
      <section className={styles.immoTonnContentSection}>
        <div className={styles.immoTonnLeftSectionWrapper}>
          <p className={styles.immoTonnBigPhrase}>
            {t('immoTonnContent.line1')} <br /> {t('immoTonnContent.line2')} <br />{' '}
            {t('immoTonnContent.line3')}
          </p>
          <span className={styles.immoTonnLine}></span>
        </div>
        <ul
          className={styles.immoTonnTextList}
          ref={el => {
            refs.current[0] = el;
          }}
        >
          {listItemData.map((item, index) => (
            <li key={index} className={styles.immoTonnTextListItemWrapper}>
              <h4 className={styles.immoTonnTextH4}>{item.title}</h4>
              <p className={styles.immoTonnTextP}>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className={styles.buttonWrapper}>
        <Link to="/kontakt">
          <Button
            className={styles.salesSupportButton}
            initialText={t('immoTonnContent.cta')}
            clickedText={t('common.redirecting')}
          />
        </Link>
      </div>
    </>
  );
};

export default ImmoTonnContent;
