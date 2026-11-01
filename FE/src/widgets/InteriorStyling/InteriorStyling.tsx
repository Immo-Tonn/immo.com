import { useEffect, useRef } from 'react';
import styles from './InteriorStyling.module.css';
import ContactForm from '@features/contact/ui/ContactForm';
import { fadeInOnScroll } from '@shared/anim/animations';
const InteriorStyling = () => {
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { y: 100, x: 120, start: 'top 95%' });
  }, []);

  return (
    <section className={styles.interiorStylingSection} ref={ref}>
      <h2>vom raum zum wunschobjekt</h2>
      <p>
        Sie haben die Immobilie.
        <br />
        Wir verleihen ihr Charakter, Tiefe und Atmosphäre.
      </p>
      <p>
        Design, das sofort ein Gefühl von Zuhause vermittelt und zum <br />
        Verweilen einlädt.
      </p>
      <p>
        Ob leerstehende Wohnung, Familienhaus oder Design-Loft – <br />
        wir entwickeln individuelle Stylingkonzepte mit klarer Linie und Liebe
        zum Detail.
      </p>
      <div className={styles.lineWrapper}>
        <span className={styles.line}></span>
      </div>
      <div className={styles.formWrapper}>
        <ContactForm />
        <span className={styles.lineVertical}></span>
        <p>
          Verbindlich. <br />
          Kompetent. <br />
          Erfolgreich.
        </p>
      </div>
    </section>
  );
};

export default InteriorStyling;
