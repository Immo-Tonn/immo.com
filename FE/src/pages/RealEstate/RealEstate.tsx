// ./src/pages/RealEstate/RealEstate.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@widgets/PropertyCard/PropertyCard';
import styles from './RealEstate.module.css';
import { usePropertysData } from '@shared/api/usePropertyData';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

const RealEstate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectData, err, loading, images } = usePropertysData();
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  useEffect(() => {
    if (loading) return;

    requestAnimationFrame(() => {
      refs.current.forEach((ref, i) => {
        if (ref) {
          fadeInOnScroll(
            { current: ref },
            {
              x: i % 2 === 0 ? -50 : 100,
              y: i % 2 === 0 ? 0 : -50,
            },
          );
        }
      });
    });
  }, [loading, objectData, images]);

  const handleCreateNew = () => {
    navigate('/create-object');
  };

  return (
    <>
      <LoadingErrorHandler loading={loading} error={err} />
      {!loading && !err && (
        <section className={styles.container}>
          <div className={styles.pageHeader}>
            {isAdmin && objectData && (
              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{objectData.length}</span>
                  <span className={styles.statLabel}>
                    {t('realEstate.available', { count: objectData.length })}
                  </span>
                </div>
              </div>
            )}
            <h1 className={styles.title}>{t('realEstate.title')}</h1>
            {isAdmin && (
              <button className={styles.createButton} onClick={handleCreateNew}>
                {t('realEstate.createButton')}
              </button>
            )}
          </div>
          {objectData && objectData.length > 0 ? (
            <ul className={styles.cardList} ref={listRef}>
              {objectData.map((obj, i) => (
                <PropertyCard
                  key={obj._id}
                  object={obj}
                  images={images}
                  ref={el => {
                    refs.current[i] = el;
                  }}
                  residentialHouse={obj.residentialHouses}
                />
              ))}
            </ul>
          ) : (
            !loading &&
            !err && (
              <div className={styles.noProperties}>
                <div className={styles.noPropertiesIcon}>🏠</div>
                <h3>{t('realEstate.noneFoundTitle')}</h3>
                <p>
                  {isAdmin
                    ? t('realEstate.noneFoundAdmin')
                    : t('realEstate.noneFoundVisitor')}
                </p>
              </div>
            )
          )}

          {isAdmin && (
            <div className={styles.adminInfo}>
              <h4>{t('realEstate.adminInfoTitle')}</h4>
              {objectData && objectData.length > 0 ? (
                <>
                  <p>{t('realEstate.adminInfoAllUsers')}</p>
                  <p>{t('realEstate.adminInfoManage')}</p>
                </>
              ) : (
                <>
                  <p>{t('realEstate.adminInfoEmpty')}</p>
                  <p>{t('realEstate.adminInfoCreateFirst')}</p>
                </>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default RealEstate;
