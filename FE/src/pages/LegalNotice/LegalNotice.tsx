import React from 'react';
import styles from './LegalNotice.module.css';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const LegalNotice: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Impressum</h1>

      <h2>Diensteanbieter</h2>
      <p>
        Immo-Tonn Inhaber: Andreas Tonn
        <br />
        Sessendrupweg 54
        <br />
        48161 Münster
      </p>

      <h2>Kontaktmöglichkeiten</h2>
      <p>
        E-Mail-Adresse:{' '}
        <a href="mailto:tonn_andreas@web.de">tonn_andreas@web.de</a>
        <br />
        Telefon: <a href="tel:+491743454419">+49 174 345 44 19</a>
      </p>

      <h2>Journalistisch-redaktionelle Angebote</h2>
      <p>
        Inhaltlich verantwortlich: Andreas Tonn
        <br />
        Salzmannstr. 50a
        <br />
        48147 Münster
      </p>

      <h2>Angaben zum Unternehmen</h2>
      <h3>Berufshaftpflichtversicherung</h3>
      <p>
        Allianz Versicherung SE
        <br />
        Königinstraße 28
        <br />
        80802 München
        <br />
        Räumliche Geltung: Deutschland
      </p>

      <h2>Aufsichtsbehörde</h2>
      <p>
        IHK Nord-Westfalen
        <br />
        Sentmaringer Weg 61
        <br />
        48151 Münster
        <br />
        Website:{' '}
        <a
          href="https://www.ihk.de/nordwestfalen/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ihk.de/nordwestfalen
        </a>
      </p>

      <h2>Bildnachweise</h2>
      <p>
        Bildquellen und Urheberrechtshinweise:
        <br />
        Wir verwenden auf unserer Homepage nur Fotos von{' '}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          pexels.com
        </a>
        , die urheberrechtlich nicht geschützt und kostenlos sind.
      </p>

      <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        Erstellt mit dem Datenschutz-Generator.de von Dr. Thomas Schwenke
      </p>
    </div>
  );
};

export default withPageShell(LegalNotice);
