import React, { useEffect } from 'react'; // добавлен useEffect
import styles from './PropertyDetails.module.css';
import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
} from '@shared/types/propertyTypes';
import { useNavigate } from 'react-router-dom';
import { formatGermanCurrency } from '@features/utils/formatGermanCurrency';
import { getObjectTypeLabel } from '@features/utils/objectTypeMapping';
import { ObjectType } from '@features/utils/types';
import { useTranslation } from 'react-i18next';

interface PropertyDetailsProps {
  object: RealEstateObject;
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
}

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className={styles.detailRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{String(value)}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className={styles.section}>
    <hr className={styles.hr} />
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

const getPropertyDetailEntries = (
  t: (key: string) => string,
  object: RealEstateObject,
  apartment?: Apartment,
  commercial?: CommercialBuilding,
  land?: LandPlot,
  house?: ResidentialHouse,
): { key: string; label: string; value: any }[] => {
  const raw: Record<string, any> = {
    country: object.address?.country,
    idNumber: object.number,
    objectType: getObjectTypeLabel(object.type as ObjectType),
    ...(apartment?.type && { apartmentType: apartment.type }),
    ...(house?.type && { houseType: house.type }),
    ...(commercial?.buildingType && { buildingType: commercial.buildingType }),
    ...(land?.landPlottype && { landPlotType: land.landPlottype }),

    livingArea: house?.livingArea
      ? `${house.livingArea} m²`
      : apartment?.livingArea
        ? `${apartment.livingArea} m²`
        : undefined,
    area: commercial?.area ? `${commercial.area} m²` : undefined,
    plotArea: house?.plotArea
      ? `${house.plotArea} m²`
      : land?.plotArea
        ? `${land.plotArea} m²`
        : commercial?.plotArea
          ? `${commercial.plotArea} m²`
          : undefined,
    usableArea: house?.usableArea ? `${house.usableArea} m²` : undefined,
    yearBuilt: house?.yearBuilt ?? apartment?.yearBuilt ?? commercial?.yearBuilt,
    rooms: house?.numberOfRooms ?? apartment?.numberOfRooms,
    bedrooms: house?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
    bathrooms: house?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
    floor: apartment?.floor,
    totalFloors: apartment?.totalFloors ?? house?.numberOfFloors,
    parkingSpaces: house?.garageParkingSpaces,
    energyEfficiencyClass:
      house?.energyEfficiencyClass ?? apartment?.energyEfficiencyClass,
    energySource: house?.energySource ?? apartment?.energySource,
    heating: house?.heatingType ?? apartment?.heatingType,
    freeFrom: object.freeWith,
    usage:
      commercial?.purpose ?? land?.recommendedUsage ?? land?.recommendedUsage,
    infrastructure: land?.infrastructureConnection,
    buildingRegulations: land?.buildingRegulations,
  };

  return Object.entries(raw)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      key,
      label: t(`propertyDetails.fields.${key}`),
      value,
    }));
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  object,
  apartment,
  commercialBuilding,
  landPlot,
  residentialHouse,
}) => {
  const { t } = useTranslation();
  const detailEntries = getPropertyDetailEntries(
    t,
    object,
    apartment,
    commercialBuilding,
    landPlot,
    residentialHouse,
  );
  const navigate = useNavigate();

  // 👇 Добавим управление overflow при монтировании/размонтировании
  useEffect(() => {
    document.body.style.overflowX = 'visible';
    return () => {
      document.body.style.overflowX = 'hidden';
    };
  }, []);

  const statusLabels: Record<string, string> = {
    active: t('propertyDetails.statusActive'),
    sold: t('propertyDetails.statusSold'),
    reserved: t('propertyDetails.statusReserved'),
    archived: t('propertyDetails.statusArchived'),
  };

  return (
    <div className={styles.propertyLayout}>
      <div className={styles.mainContent}>
        <div className={styles.floatingButtonWrapper}>
          <button
            className={styles.calcButton}
            onClick={() => navigate('/finanzierung')}
          >
            {t('propertyDetails.financingCalculator')}
          </button>
        </div>

        <Section title={t('propertyDetails.objectData')}>
          {object.status && (
            <div className={styles.status}>
              <span className={styles.label}>
                {t('propertyDetails.objectStatus')}:
              </span>
              <div className={styles.statusBanner}>
                {statusLabels[object.status]}
              </div>
            </div>
          )}

          <div className={styles.detailsLeft}>
            {detailEntries.map(({ key, label, value }) => (
              <DetailRow key={key} label={label} value={value} />
            ))}
          </div>
        </Section>

        {(apartment?.additionalFeatures ||
          residentialHouse?.additionalFeatures ||
          commercialBuilding?.additionalFeatures) && (
          <Section title={t('propertyDetails.features')}>
            <p className={styles.narrowText}>
              {apartment?.additionalFeatures ??
                residentialHouse?.additionalFeatures ??
                commercialBuilding?.additionalFeatures}
            </p>
          </Section>
        )}

        {object.description && (
          <Section title={t('propertyDetails.description')}>
            <p className={styles.narrowText}>{object.description}</p>
          </Section>
        )}

        {object.location && (
          <Section title={t('propertyDetails.location')}>
            <p className={styles.narrowText}>{object.location}</p>
          </Section>
        )}

        {object.miscellaneous && (
          <Section title={t('propertyDetails.miscellaneous')}>
            <p className={styles.narrowText}>{object.miscellaneous}</p>
          </Section>
        )}
      </div>

      <aside className={styles.stickyAside}>
        <div className={styles.verticalDividerRight} />
        <div className={styles.detailsRight}>
          <div className={styles.tagline}>
            <p>{t('immoTonnContent.line1')}</p>
            <p>{t('immoTonnContent.line2')}</p>
            <p>{t('immoTonnContent.line3')}</p>
          </div>
          <div className={styles.rightButton}>
            <button
              className={styles.calcButton}
              onClick={() =>
                navigate('/finanzierung', {
                  state: { price: formatGermanCurrency(object.price) },
                })
              }
            >
              {t('propertyDetails.financingCalculator')}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PropertyDetails;
