import { forwardRef } from 'react';
import styles from './PropertyCard.module.css';
import { PropertyHeroProps } from '@shared/types/propertyTypes';
import { NavLink } from 'react-router-dom';
import { formatGermanCurrency } from '@features/utils/formatGermanCurrency';
import { useTranslation } from 'react-i18next';

const PropertyCard = forwardRef<HTMLLIElement, PropertyHeroProps>(
  ({ object, images, residentialHouse }, ref) => {
    const { t } = useTranslation();
    console.log('object.images:', object?.images);
    console.log('images prop:', images);

    const imageId = object?.images?.[0];
    console.log('imageId:', imageId);
    const imageObj = images?.find(img => img._id === imageId);
    console.log('found imageObj:', imageObj);
    const backgroundUrl = imageObj?.url || null;

    const { title, address, price, status } = object;

    const livingArea = residentialHouse?.livingArea;
    const numberOfRooms = residentialHouse?.numberOfRooms;

    return (
      <li ref={ref}>
        <NavLink to={`/immobilien/${object._id}`}>
          <div className={styles.cardWrapper}>
            {backgroundUrl ? (
              <img
                src={backgroundUrl}
                alt={title}
                className={styles.image}
                width="600"
                height="300"
                loading="lazy"
              />
            ) : (
              <p className={styles.errorTitle}>{t('propertyCard.noPhoto')}</p>
            )}
            {(status === 'sold' || status === 'reserved') && (
              <span className={styles.status}>
                {status === 'sold' && t('propertyCard.sold')}
                {status === 'reserved' && t('propertyCard.reserved')}
              </span>
            )}

            <div className={styles.cardOverlay}>
              <p className={styles.cardTitle}>{title}</p>
              <p className={styles.address}>{address?.city}</p>
              <div className={styles.details}>
                {price !== undefined && (
                  <p>
                    {t('propertyCard.price')}: {formatGermanCurrency(price)} €
                  </p>
                )}
                {livingArea !== undefined && (
                  <p>
                    | {t('propertyCard.livingArea')}: {livingArea} m² |{' '}
                  </p>
                )}
                {numberOfRooms !== undefined && (
                  <p> {t('propertyCard.rooms', { count: numberOfRooms })}</p>
                )}
              </div>
            </div>
          </div>
        </NavLink>
      </li>
    );
  },
);

export default PropertyCard;
