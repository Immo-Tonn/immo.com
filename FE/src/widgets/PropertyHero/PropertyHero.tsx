import React, { useState, useEffect, useRef } from 'react';
import styles from './PropertyHero.module.css';
import ImageGalleryModal from '../ImageGalleryModal/ImageGalleryModal';
import { formatGermanCurrency } from '@features/utils/formatGermanCurrency';
import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
  Image,
  Video,
} from '@shared/types/propertyTypes';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

interface PropertyHeroProps {
  object: RealEstateObject;
  images?: (Image | undefined)[];
  videos?: (Video | undefined)[];
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
  isAdmin?: boolean;
}

const PropertyHero: React.FC<PropertyHeroProps> = ({
  object,
  images = [],
  videos = [],
  apartment,
  residentialHouse,
  landPlot,
  commercialBuilding,
  isAdmin = false,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { title, address, price, status } = object;

  const livingArea = residentialHouse?.livingArea ?? apartment?.livingArea;
  const numberOfRooms =
    residentialHouse?.numberOfRooms ?? apartment?.numberOfRooms;
  const plotArea = residentialHouse?.plotArea ?? landPlot?.plotArea;
  const commercialArea = commercialBuilding?.area;

  const filteredImages: Image[] = images.filter(
    (img): img is Image => img !== undefined,
  );
  const filteredVideos: Video[] = videos.filter(
    (vid): vid is Video => vid !== undefined,
  );
  const mediaItems: (Image | Video)[] = [...filteredImages, ...filteredVideos];
  const previewMedia = mediaItems.slice(0, 3);
  const hasMoreMedia = mediaItems.length > 3;
  const refs = useRef<(HTMLLIElement | HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100, y: 50 } : { x: 100, y: -50 },
        );
    });
  }, []);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  // useEffect(() => {
  //   if (!isMobile || mediaItems.length <= 1) return;
  //   const interval = setInterval(() => {
  //     setCurrentIndex(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  //   }, 8000);
  //   return () => clearInterval(interval);
  // }, [mediaItems.length, isMobile]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prevIndex =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleThumbClick = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const shouldShowStatus = status === 'sold' || status === 'reserved';
  const statusLabel =
    status === 'sold' ? t('propertyHero.sold') : t('propertyHero.reserved');

  const isVideo = (item: Image | Video): item is Video =>
    'thumbnailUrl' in item &&
    item.url.startsWith('https://iframe.mediadelivery.net/play/');

  const currentMedia = mediaItems[currentIndex];
  const firstMedia = mediaItems[0];

const renderAddress = () => {
  if (isAdmin) { 
          // Full adress for Admin   
    return (
      <div className={styles.address}>
        {address.street && (
          <>
            {address.street}
            {address.houseNumber && ` ${address.houseNumber}`}
            <br />
          </>
        )}
        {address.zip} {address.city}, {address.district}<br />
        {address.country}
      </div>
    );
  } else {
          // Partial address for regular users
    return (
      <div className={styles.address}>
        {address.zip} {address.city}{address.district ? `, ${address.district}` : ''}
      </div>
    );
  }
};

  return (
    <section className={styles.section}>
      <h1
        className={styles.title}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        {title}
      </h1>

      {isMobile ? (
        currentMedia ? (
          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselWrapper}
              onClick={() => handleThumbClick(currentIndex)}
              ref={el => {
                refs.current[1] = el;
              }}
            >
              {shouldShowStatus && (
                <div className={styles.statusBadge}>{statusLabel}</div>
              )}
              {isVideo(currentMedia) ? (
                <div className={styles.videoFrameWrapper}>
                  <img
                    src={currentMedia.thumbnailUrl}
                    alt={currentMedia.title || 'Video preview'}
                    className={styles.videoThumbnail}
                    loading="lazy"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY1ZjUiLz4gIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn46lIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className={styles.playIcon}>▶</div>
                </div>
              ) : (
                <img
                  src={currentMedia.url}
                  alt={`Bild ${currentIndex + 1}`}
                  className={styles.carouselImage}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        ) : (
          <div className={styles.placeholderWrapper}>
            <span className={styles.placeholderText}>
              {t('propertyHero.noMedia')}
            </span>
          </div>
        )
      ) : firstMedia ? (
        <div
          className={styles.imageContainer}
          ref={el => {
            refs.current[3] = el;
          }}
        >
          <div
            className={styles.mainImageWrapper}
            onClick={() => handleThumbClick(0)}
            style={{ cursor: 'pointer' }}
          >
            {shouldShowStatus && (
              <div className={styles.statusBadge}>{statusLabel}</div>
            )}
            {isVideo(firstMedia) ? (
              <div className={styles.videoFrameWrapper}>
                <img
                  src={firstMedia.thumbnailUrl}
                  alt={firstMedia.title || 'Video preview'}
                  className={styles.videoThumbnail}
                  loading="lazy"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY1ZjUiLz4gIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn46lIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className={styles.playIcon}>▶</div>
              </div>
            ) : (
              <img
                src={firstMedia.url}
                alt={`Bild 1`}
                className={styles.mainImage}
                loading="lazy"
              />
            )}
          </div>

          <div
            className={styles.sideImages}
            ref={el => {
              refs.current[4] = el;
            }}
          >
            {previewMedia.slice(1, 3).map((item, idx) => {
              const actualIndex = idx + 1;
              const isLastPreview = idx === 1;
              const uniqueKey = isVideo(item)
                ? `video-${item.url}`
                : `image-${item.url}`;

              return (
                <div
                  key={uniqueKey}
                  className={`${styles.smallImageWrapper} ${
                    isLastPreview && hasMoreMedia ? styles.overlayWrapper : ''
                  }`}
                  onClick={() => handleThumbClick(actualIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  {isVideo(item) ? (
                    <div className={styles.videoFrameWrapper}>
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title || 'Video preview'}
                        className={styles.videoThumbnail}
                        loading="lazy"
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY1ZjUiLz4gIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn46lIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className={styles.playIconSmall}>▶</div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Bild ${actualIndex + 1}`}
                      className={styles.smallImage}
                      loading="lazy"
                    />
                  )}
                  {isLastPreview && hasMoreMedia && (
                    <div className={styles.overlay}>{t('propertyHero.moreMedia')}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={styles.placeholderWrapper}
          ref={el => {
            refs.current[5] = el;
          }}
        >
          <span className={styles.placeholderText}>
            Es wurden noch keine Fotos oder Videos hochgeladen.
          </span>
        </div>
      )}

      <div
        className={styles.features}
        ref={el => {
          refs.current[6] = el;
        }}
      >
        <div className={styles.feature}>
          <h3>{formatGermanCurrency(price)} €</h3>
          <h6>{t('propertyHero.price')}</h6>
        </div>

        {livingArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{livingArea} m²</h3>
              <h6>{t('propertyHero.livingArea')}</h6>
            </div>
          </>
        )}

        {numberOfRooms !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{numberOfRooms}</h3>
              <h6>{t('propertyHero.rooms')}</h6>
            </div>
          </>
        )}

        {plotArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{plotArea} m²</h3>
              <h6>{t('propertyHero.plotArea')}</h6>
            </div>
          </>
        )}

        {commercialArea !== undefined && (
          <>
            <div className={styles.divider} />
            <div className={styles.feature}>
              <h3>{commercialArea} m²</h3>
              <h6>{t('propertyHero.area')}</h6>
            </div>
          </>
        )}
      </div>

      {/* display address depending on user role */}
      {renderAddress()}

      {showModal && mediaItems.length > 0 && (
        <ImageGalleryModal
          images={mediaItems}
          currentIndex={currentIndex}
          onClose={() => setShowModal(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={handleThumbClick}
        />
      )}
    </section>
  );
};

export default PropertyHero;
