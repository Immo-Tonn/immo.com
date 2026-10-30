import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from '@shared/lib/localeRouter';
const Lottie = lazy(() => import('lottie-react'));
import animationData from '@shared/assets/lottie/mail-sent.json';
import Confetti from 'react-confetti';
import styles from './DankePage.module.css';
import Button from '@shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

const DankePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const mounted = windowSize.width > 0;

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className={styles.dankeWrapper}>
      {/* конфетти и анимация — только в браузере (размер окна известен после монтирования) */}
      {mounted && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <div className={styles.card}>
        {mounted ? (
          <Suspense fallback={<div>{t('dankePage.loadingAnimation')}</div>}>
            <Lottie
              animationData={animationData}
              style={{ width: 180, height: 180, marginBottom: 20 }}
            />
          </Suspense>
        ) : (
          <div>{t('dankePage.loadingAnimation')}</div>
        )}
        <h1>{t('dankePage.title')}</h1>
        <p>{t('dankePage.text')}</p>
        <Button
          initialText={t('dankePage.backHome')}
          clickedText={t('common.redirecting')}
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default DankePage;
