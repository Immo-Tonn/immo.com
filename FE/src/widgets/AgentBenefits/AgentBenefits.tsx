import React, { useEffect, useRef } from 'react';
import styles from './AgentBenefits.module.css';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

interface BenefitItem {
  title: string;
  text: string;
}

const AgentBenefits: React.FC = () => {
  const { t } = useTranslation();
  const items = t('agentBenefits.items', { returnObjects: true }) as BenefitItem[];
  const ref = useRef(null);

  useEffect(() => {
    fadeInOnScroll(ref, { y: 100, x: -40 });
  }, []);

  return (
    <section ref={ref} className={styles.whyAgentSection}>
      <div className={styles.wrapper}>
        <div className={styles.whyAgentContentWithLine}>
          <h3 className={styles.whyAgentH3}>{t('agentBenefits.title')}</h3>
          <ul className={styles.whyAgentUl}>
            {items.map((item, i) => (
              <li className={styles.whyAgentLi} key={i}>
                <h4 className={styles.whyAgentH4}>{item.title}</h4>
                <p className={styles.whyAgentP}>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.immoTonnImageBackground}>
        <div className={styles.contentWrapper}>
          <h3 className={styles.immoTonnOverlayText}>
            IMMO <br /> TONN
          </h3>
        </div>
      </div>
    </section>
  );
};

export default AgentBenefits;
