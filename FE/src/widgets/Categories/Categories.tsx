import { CategoriesData, CategoryItem } from './CategoriesData';
import styles from './Categories.module.css';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Categories = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <ul className={styles.grid}>
        {CategoriesData.map((item: CategoryItem, i: number) => (
          <li
            key={item.id}
            className={styles.item}
            data-reveal=""
            style={{ '--d': `${(i % 2) * 120}ms` } as React.CSSProperties}
          >
            <NavLink to={item.link} className={styles.card}>
              <img
                src={item.image}
                alt=""
                className={styles.image}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.veil} aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.caption}>
                <span className={styles.title}>
                  {t(`categories.items.${item.alt}`)}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
