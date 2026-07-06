import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { Address } from '@shared/types/propertyTypes';
import { LatLngTuple } from 'leaflet';
import styles from './PropertyMap.module.css';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
interface PropertyMapProps {
  address: Address;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address }) => {
  const { t } = useTranslation();
  const { district, zip, city, country } = address;

  const [fuseCountry, setFuseCountry] = useState<Fuse<string> | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<LatLngTuple[][] | null>(
    null,
  );
  const [center, setCenter] = useState<LatLngTuple | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,translations',
        );

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const countriesRaw = await res.json();

        if (!Array.isArray(countriesRaw)) {
          throw new Error('API returned unexpected structure');
        }

        const countryNames: string[] = countriesRaw.flatMap((c: any) => {
          const names = [c.name?.common].filter(Boolean);
          const german = c.translations?.deu?.common;
          if (german && !names.includes(german)) names.push(german);
          return names;
        });

        const fuse = new Fuse(countryNames, { threshold: 0.4 });
        setFuseCountry(fuse);
      } catch (e) {
        console.error('Fehler beim Laden der Länderliste:', e);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!fuseCountry) return;

    const tryQueries = async (baseCountry: string): Promise<boolean> => {
      const queries = [
        `${district}, ${zip} ${city}, ${baseCountry}`,
        `${zip} ${city}, ${baseCountry}`,
        `${city}, ${baseCountry}`,
        `${baseCountry}`,
      ];

      for (const query of queries) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query)}`,
          );
          const data = await res.json();
          if (!data.length || !data[0].geojson) continue;

          const geo = data[0].geojson;
          const coords: LatLngTuple[][] =
            geo.type === 'Polygon'
              ? [
                  geo.coordinates[0].map(([lng, lat]: [number, number]) => [
                    lat,
                    lng,
                  ]),
                ]
              : geo.coordinates.flatMap((poly: any[][]) =>
                  poly.map((ring: any[]) =>
                    ring.map(([lng, lat]: [number, number]) => [lat, lng]),
                  ),
                );

          setPolygonCoords(coords);
          setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setError(false);
          return true;
        } catch (err) {
          console.warn('Fehler beim Kartenabruf:', query, err);
        }
      }

      return false;
    };

    const fetchWithFallback = async () => {
      const found = await tryQueries(country);
      if (found) return;

      const corrected = fuseCountry.search(country)[0]?.item;
      if (!corrected || corrected.toLowerCase() === country.toLowerCase()) {
        setError(true);
        return;
      }

      console.warn(
        `Land nicht erkannt: "${country}", versuche stattdessen "${corrected}"`,
      );
      const fallbackFound = await tryQueries(corrected);
      if (!fallbackFound) setError(true);
    };

    fetchWithFallback();
  }, [fuseCountry, district, zip, city, country]);

  return (
    <section className={styles.mapSection}>
      <hr className={styles.hr} />
      <h2 className={styles.title}>{t('propertyMap.title')}</h2>

      <div className={styles.infoLine}>
        <span>{district},</span>{' '}
        <span>
          {zip} {city}
        </span>
      </div>

      <p className={styles.disclaimer}>{t('propertyMap.disclaimer')}</p>

      {error ? (
        <p className={styles.error}>{t('propertyMap.loadError')}</p>
      ) : polygonCoords && center ? (
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          doubleClickZoom={true}
          className={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {polygonCoords.map((polygon, i) => (
            <Polygon
              key={i}
              positions={polygon}
              pathOptions={{ color: '#007BFF', weight: 2, fillOpacity: 0.2 }}
            />
          ))}
        </MapContainer>
      ) : (
        <p className={styles.loading}>{t('propertyMap.loading')}</p>
      )}
    </section>
  );
};

export default PropertyMap;
