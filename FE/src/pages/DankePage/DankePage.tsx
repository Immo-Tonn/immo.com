import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div className={styles.card}>
        <Suspense fallback={<div>{t('dankePage.loadingAnimation')}</div>}>
          <Lottie
            animationData={animationData}
            style={{ width: 180, height: 180, marginBottom: 20 }}
          />
        </Suspense>
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
