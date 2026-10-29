import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';
import { langPath, type Lang } from '../../seo/meta';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

interface LanguageSwitcherProps {
  className?: string;
}

// Переключатель — обычные ссылки на ту же страницу с другим языковым префиксом
const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const { pathname, search } = useLocation();
  const currentLang = (i18n.language?.split('-')[0] ?? 'de') as Lang;
  // prerender отдаёт путь со слэшем в конце (/immobilien/) — нормализуем
  const clean = pathname.replace(/\/+$/, '') || '/';
  const first = clean.split('/')[1];
  const basePath =
    first === 'en' || first === 'ru'
      ? clean.slice(first.length + 1) || '/'
      : clean;

  return (
    <div className={`${styles.langSwitcher} ${className ?? ''}`}>
      {LANGUAGES.map(({ code, label }) => (
        <Link
          key={code}
          to={`${langPath(code, basePath)}${search}`}
          hrefLang={code}
          lang={code}
          className={
            currentLang === code
              ? `${styles.langButton} ${styles.langButtonActive}`
              : styles.langButton
          }
          aria-current={currentLang === code ? 'true' : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
