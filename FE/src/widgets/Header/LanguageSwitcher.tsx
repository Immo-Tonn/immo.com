import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

interface LanguageSwitcherProps {
  className?: string;
  /** dropdown — компактный выбор в шапке; inline — три кнопки (мобильное меню) */
  variant?: 'dropdown' | 'inline';
}

const LanguageSwitcher = ({
  className,
  variant = 'dropdown',
}: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] ?? 'de';
  const current =
    LANGUAGES.find(l => l.code === currentLang) ?? LANGUAGES[0];

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  /* закрытие по клику вне меню и по Escape */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  /* при открытии фокус на текущем языке */
  useEffect(() => {
    if (!open) return;
    const idx = LANGUAGES.findIndex(l => l.code === currentLang);
    optionRefs.current[idx < 0 ? 0 : idx]?.focus();
  }, [open, currentLang]);

  if (variant === 'inline') {
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
  }

  const select = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const items = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.langDropdown} ${className ?? ''}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.langTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t('header.language')}: ${current.label}`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{current.label}</span>
        <svg
          className={`${styles.langChevron} ${open ? styles.langChevronOpen : ''}`}
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          id={menuId}
          role="listbox"
          className={styles.langMenu}
          aria-label={t('header.language')}
          onKeyDown={onMenuKeyDown}
        >
          {LANGUAGES.map(({ code, label }, i) => (
            <li key={code} role="presentation">
              <button
                ref={el => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={currentLang === code}
                className={
                  currentLang === code
                    ? `${styles.langOption} ${styles.langOptionActive}`
                    : styles.langOption
                }
                onClick={() => select(code)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
