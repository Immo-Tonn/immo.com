import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import { useNavigate } from '@shared/lib/localeRouter';
import axios from '@features/utils/axiosConfig';
import PropertyHero from '@widgets/PropertyHero/PropertyHero';
import PropertyDetails from '@widgets/PropertyDetails/PropertyDetails';
// leaflet обращается к window при импорте — карту грузим только в браузере
const PropertyMap = lazy(() => import('@widgets/PropertyMap/PropertyMap'));
import {
  usePropertyData,
  type PropertyBundle,
} from '@shared/api/usePropertyData';
import ContactForm from '@features/contact/ui/ContactForm';
import styles from './PropertyPage.module.css';
import LoadingErrorHandler from '@shared/ui/LoadingErrorHandler/LoadingErrorHandler';
import { useTranslation } from 'react-i18next';

const PropertyPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initial = useLoaderData() as PropertyBundle | undefined;

  const { objectData, images, loading, err, videos, isDeleted, markAsDeleted } =
    usePropertyData(id, initial);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => setMapReady(true), []);

  // Checking admin authorization
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  useEffect(() => {
    if (isDeleted) {
      console.log(
        'Объект удален, показываем сообщение и редиректим через 3 секунды',
      );
      const timer = setTimeout(() => {
        navigate('/immobilien');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isDeleted, navigate]);

  // Edit handler (admin only)
  const handleEdit = () => {
    navigate(`/edit-object/${id}`);
  };

  // Delete handler (admin only)
  const handleDelete = async () => {
    if (!window.confirm(t('propertyPage.confirmDelete'))) {
      return;
    }

    try {
      markAsDeleted();
      await axios.delete(`/objects/${id}`);

      // delete the object from confirmed
      const confirmedObjects = JSON.parse(
        sessionStorage.getItem('confirmedObjects') || '[]',
      );
      const updatedConfirmed = confirmedObjects.filter(
        (objId: string) => objId !== id,
      );
      sessionStorage.setItem(
        'confirmedObjects',
        JSON.stringify(updatedConfirmed),
      );

      console.log('Объект успешно удален, -->> на /immobilien');

      navigate('/immobilien', {
        state: {
          message: t('propertyPage.deleteSuccess'),
          type: 'success',
        },
      });
    } catch (err: any) {
      console.error('Error deleting object:', err);
      markAsDeleted();
      alert(
        'Error deleting object: ' +
          (err.response?.data?.message || err.message),
      );
    }
  };

  if (isDeleted) {
    return (
      <div className={styles.propertyPageContainer}>
        <div className={styles.deletedObjectMessage}>
          <h2>{t('propertyPage.deletedTitle')}</h2>
          <p>{t('propertyPage.deletedText')}</p>
          <p>{t('propertyPage.deletedRedirect')}</p>
          <button
            className={styles.backButton}
            onClick={() => navigate('/immobilien')}
          >
            {t('propertyPage.backToOverview')}
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <p>{t('propertyPage.loading')}</p>;

  if (err && err.includes('nicht gefunden')) {
    return (
      <div className={styles.propertyPageContainer}>
        <div className={styles.notFoundMessage}>
          <h2>{t('propertyPage.notFoundTitle')}</h2>
          <p>{t('propertyPage.notFoundText')}</p>
          <p>{t('propertyPage.notFoundHint')}</p>
          <button
            className={styles.backButton}
            onClick={() => navigate('/immobilien')}
          >
            {t('propertyPage.toOverview')}
          </button>
        </div>
      </div>
    );
  }

  if (!objectData) return <p>{t('propertyPage.notFoundTitle')}</p>;

  return (
    <div className={styles.propertyPageContainer}>
      <LoadingErrorHandler loading={loading} error={err} />

      {/* Admin buttons */}
      {isAdmin && (
        <div className={styles.adminActions}>
          <button className={styles.editButton} onClick={handleEdit}>
            {t('propertyPage.edit')}
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            {t('propertyPage.delete')}
          </button>
        </div>
      )}

      {!loading && objectData && (
        <>
          <PropertyHero
            object={objectData}
            images={images}
            videos={videos}
            apartment={objectData.apartments}
            commercialBuilding={objectData.commercial_NonResidentialBuildings}
            landPlot={objectData.landPlots}
            residentialHouse={objectData.residentialHouses}
            isAdmin={isAdmin}
          />
          <PropertyDetails
            object={objectData}
            apartment={objectData.apartments}
            commercialBuilding={objectData.commercial_NonResidentialBuildings}
            landPlot={objectData.landPlots}
            residentialHouse={objectData.residentialHouses}
          />
          {mapReady && (
            <Suspense fallback={null}>
              <PropertyMap address={objectData.address} />
            </Suspense>
          )}

          <ContactForm />
        </>
      )}
    </div>
  );
};

export default PropertyPage;
