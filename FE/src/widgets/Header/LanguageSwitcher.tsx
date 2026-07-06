import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] ?? 'de';

  return (
    <div className={`${styles.langSwitcher} ${className ?? ''}`}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={
            currentLang === code
              ? `${styles.langButton} ${styles.langButtonActive}`
              : styles.langButton
          }
          aria-current={currentLang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
