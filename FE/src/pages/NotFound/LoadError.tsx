import { useTranslation } from 'react-i18next';

const LoadError = () => {
  const { t } = useTranslation();
  return (
    <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <title>{`${t('loadError.title')} | Immo Tonn`}</title>
      <h1>{t('loadError.title')}</h1>
      <p>{t('loadError.text')}</p>
      <p>
        <a href={typeof window === 'undefined' ? '.' : window.location.href}>
          {t('loadError.retry')}
        </a>
      </p>
    </section>
  );
};

export default LoadError;
