import styles from './Effect.module.css';
import effectPhoto from '@shared/assets/effect/effect-photo.webp';
import effectBuild from '@shared/assets/effect/effect-build.webp';
import { useEffect, useRef } from 'react';
import { fadeInOnScroll, parallaxMouseEffect } from '@shared/anim/animations';
const Effect = () => {
  const wrapperRef = useRef<any | null>(null);
  const elem1 = useRef<any | null>(null);
  const elem2 = useRef<any | null>(null);
  const refs = useRef<(any | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0
            ? { x: -100, y: 0, duration: 0.3, start: 'top bottom' }
            : { x: 100, y: -50, duration: 0.2, start: 'top bottom' },
        );
      }
    });
    const cleanup = parallaxMouseEffect({
      wrapperRef,
      targets: [
        { ref: elem1, factor: 2 },
        { ref: elem2, factor: 1 },
      ],
    });
    return cleanup;
  }, []);

  return (
    <section className={styles.effectSection}>
      <div
        className={styles.descriptionWrapper}
        ref={el => {
          refs.current[0] = el;
        }}
      >
        <span className={styles.line}></span>
        <p className={styles.description}>
          Objektstyling ist mehr als Dekoration. Es ist die Kunst, Räume
          lebendig wirken zu lassen. Wir inszenieren Immobilien so, dass sie
          nicht nur schön aussehen <br /> — <br />
          sondern sich wie Zuhause anfühlen. Weil der erste Eindruck keine
          zweite Chance bekommt.
        </p>
      </div>
      <div
        ref={el => {
          refs.current[1] = el;
        }}
      >
        <div className={styles.imageWrapper} ref={wrapperRef}>
          <img
            src={effectPhoto}
            alt="effect-photo"
            className={styles.effectPhoto}
            ref={elem1}
          />
          <h2 ref={elem2}>Licht. Perspektive. Wirkung.</h2>
        </div>
      </div>
      <div
        className={styles.descriptionWrapper}
        ref={el => {
          refs.current[2] = el;
        }}
      >
        <div>
          <p className={styles.description}>
            Mit dem richtigen Blickwinkel und dem Spiel aus Schatten und Licht
            lassen wir Räume größer, wärmer und lebendiger wirken.
            <br /> Jedes Detail wird gezielt inszeniert – damit Ihre Immobilie
            nicht nur im Foto glänzt, sondern beim ersten Schritt über die
            Schwelle begeistert.
            <br />
            <span className={styles.advantagesTitle}>
              Ihre Vorteile auf einen Blick:
            </span>
          </p>
          <ul className={styles.advantagesList}>
            <li>
              <strong>Höhere Sichtbarkeit auf Plattformen</strong>
            </li>
            <li>
              <strong>Mehr Anfragen & schnellere Verkäufe</strong>
            </li>
            <li>
              <strong>Preissteigerung von bis zu 15 %</strong>
            </li>
            <li>
              <strong>Alles aus einer Hand – stilvoll & stressfrei</strong>
            </li>
          </ul>
        </div>
      </div>
      <img
        src={effectBuild}
        alt="effect-build"
        ref={el => {
          refs.current[3] = el;
        }}
      />
    </section>
  );
};
export default Effect;
