import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import cowSound from '@shared/assets/audio/cow-moo.mp3';
import Button from '@shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const [showCow] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (showCow) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.4;
        audio.play().catch(() => {});
      }
    }
  }, [showCow]);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src={cowSound} />
      <div className={styles.cowWrapper}>
        <Link to="/">
          <Button
            initialText={t('notFound.backHome')}
            clickedText={t('common.redirecting')}
            className={styles.homeBtn}
          />
        </Link>

        <div className={styles.cow}>
          <div className={styles.head}>
            <div className={styles.face}></div>
          </div>
          <div className={`${styles.leg} ${styles.b} ${styles.l}`}></div>
          <div className={`${styles.leg} ${styles.b} ${styles.r}`}></div>
          <div className={`${styles.leg} ${styles.f} ${styles.l}`}></div>
          <div className={`${styles.leg} ${styles.f} ${styles.r}`}></div>
          <div className={styles.tail}></div>
        </div>

        <div className={styles.textBox}>
          <h1>404</h1>
          <p>{t('notFound.text')}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
