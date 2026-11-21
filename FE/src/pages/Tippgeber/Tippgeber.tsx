import { useTranslation } from 'react-i18next';
import { Link } from '@shared/lib/localeRouter';
import { withPageShell } from '@shared/ui/PageShell/PageShell';
import heroImage from '@shared/assets/hero-home/hero-home-2.webp';
import styles from './Tippgeber.module.css';
import {
  EMAIL,
  MAILTO,
  MOBILE_DISPLAY,
  MOBILE_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  contentDe,
} from './content';
import { contentEn } from './content.en';
import { contentRu } from './content.ru';

const contentByLang = { de: contentDe, en: contentEn, ru: contentRu };


const Tippgeber = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2) as keyof typeof contentByLang;
  const {
    benefits,
    conditions,
    discrepancy,
    faq,
    finalBlock,
    hero,
    reward,
    steps,
    submit,
  } = contentByLang[lang] ?? contentDe;
  const [introBefore, introAfter] = submit.intro.split('{email}');
  const [introMid, introEnd] = (introAfter ?? '').split('{phone}');

  return (
    <>
      {/* 1. Hero */}
      <section className={styles.hero} aria-labelledby="tg-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            className={styles.heroImage}
            src={heroImage}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="tg-title" className={styles.title}>
            <span className={styles.line}>{hero.line1}</span>{' '}
            <span className={`${styles.line} ${styles.lineAccent}`}>
              {hero.line2}
            </span>
          </h1>
          <p className={styles.lead}>{hero.intro}</p>

          <ul className={styles.facts}>
            {hero.facts.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className={styles.factsNote}>{hero.note}</p>

          <div className={styles.actions}>
            <a href={MAILTO} className={`${styles.cta} ${styles.ctaPrimary}`}>
              {hero.ctaMail}
            </a>
            <a href={MOBILE_HREF} className={`${styles.cta} ${styles.ctaGhost}`}>
              {hero.ctaCall}
            </a>
          </div>
          <a href="#teilnahmebedingungen" className={styles.textLink}>
            {hero.conditionsLink}
          </a>
        </div>
      </section>

      {/* 2. Четыре этапа */}
      <section className={styles.paper} aria-labelledby="tg-steps">
        <div className={styles.container}>
          <h2 id="tg-steps" className={styles.h2Paper}>
            {steps.title}
          </h2>
          <ol className={styles.steps}>
            {steps.items.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2a. Что получает знакомый */}
      <section className={styles.benefits} aria-labelledby="tg-benefits">
        <div className={styles.container}>
          <h2 id="tg-benefits" className={styles.h2Dark}>
            {benefits.title}
          </h2>
          <ul className={styles.benefitList}>
            {benefits.items.map(item => (
              <li key={item} className={styles.benefit}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Вознаграждение */}
      <section className={styles.reward} aria-labelledby="tg-reward">
        <div className={styles.container}>
          <h2 id="tg-reward" className={styles.h2Dark}>
            {reward.title}
          </h2>
          <div className={styles.rewardHead}>
            <div className={styles.rewardBig}>
              <span className={styles.bigValue}>{reward.big}</span>
              <span className={styles.bigLabel}>{reward.bigLabel}</span>
            </div>
            <div className={styles.rewardBig}>
              <span className={styles.bigValue}>{reward.range}</span>
              <span className={styles.bigLabel}>{reward.rangeLabel}</span>
            </div>
          </div>
          <p className={styles.bodyDark}>{reward.intro}</p>

          <h3 className={styles.examplesTitle}>{reward.examplesTitle}</h3>
          <ul className={styles.examples}>
            {reward.examples.map(e => (
              <li key={e.price} className={styles.example}>
                <span className={styles.exampleLabel}>{reward.priceLabel}</span>
                <span className={styles.examplePrice}>{e.price}</span>
                <span className={styles.exampleArrow} aria-hidden="true">
                  ↓
                </span>
                <span className={styles.exampleLabel}>{reward.rewardLabel}</span>
                <span className={styles.exampleReward}>{e.reward}</span>
              </li>
            ))}
          </ul>
          <p className={styles.bodyDark}>{reward.cap}</p>
          <p className={styles.bodyDarkMuted}>{reward.reduced}</p>
        </div>
      </section>

      {/* 4. Как передать рекомендацию */}
      <section className={styles.paper} aria-labelledby="tg-submit">
        <div className={styles.container}>
          <h2 id="tg-submit" className={styles.h2Paper}>
            {submit.title}
          </h2>
          <div className={styles.submitGrid}>
            <div>
              <p className={styles.bodyPaper}>
                {introBefore}
                <a href={MAILTO} className={styles.inlineLink}>
                  {EMAIL}
                </a>
                {introMid}
                <a
                  href={PHONE_HREF}
                  className={`${styles.inlineLink} ${styles.nowrap}`}
                >
                  {PHONE_DISPLAY}
                </a>
                {introEnd}
              </p>
              <p className={styles.listTitle}>{submit.listTitle}</p>
              <ul className={styles.checklist}>
                {submit.list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.bodyPaper}>{submit.consent}</p>
            </div>
            <aside
              className={styles.privacyBox}
              aria-labelledby="tg-privacy"
            >
              <h3 id="tg-privacy" className={styles.privacyTitle}>
                {submit.privacyTitle}
              </h3>
              <p>{submit.privacy}</p>
              <Link to="/privacypolicy" className={styles.inlineLinkLight}>
                {submit.privacyLink}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* 4a. FAQ */}
      <section className={styles.faq} aria-labelledby="tg-faq">
        <div className={styles.containerNarrow}>
          <h2 id="tg-faq" className={styles.h2Paper}>
            {faq.title}
          </h2>
          <div className={styles.faqList}>
            {faq.items.map(item => (
              <details key={item.q} className={styles.faqItem}>
                <summary className={styles.faqSummary}>{item.q}</summary>
                <p className={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Полные условия */}
      <section
        id="teilnahmebedingungen"
        className={styles.conditions}
        aria-labelledby="tg-conditions"
      >
        <div className={styles.containerNarrow}>
          <h2 id="tg-conditions" className={styles.h2Dark}>
            {conditions.title}
          </h2>
          <p className={styles.provider}>
            {conditions.provider}{' '}
            <Link to="/legalnotice" className={styles.inlineLinkLight}>
              {conditions.imprintLink}
            </Link>
          </p>
          {discrepancy && <p className={styles.provider}>{discrepancy}</p>}
          <ol className={styles.clauses}>
            {conditions.sections.map((sec, i) => (
              <li key={sec.title} className={styles.clause}>
                <details className={styles.clauseDetails} open={i === 0}>
                  <summary className={styles.clauseSummary}>
                    <h3 className={styles.clauseTitle}>{sec.title}</h3>
                  </summary>
                  <div className={styles.clauseBody}>
                    {sec.paragraphs.map(p => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Финальный контакт */}
      <section className={styles.final} aria-labelledby="tg-final">
        <div className={styles.finalInner}>
          <h2 id="tg-final" className={styles.finalTitle}>
            {finalBlock.title}
          </h2>
          <p className={styles.finalText}>{finalBlock.text}</p>
          <p className={styles.finalContacts}>
            <a href={MAILTO} className={styles.finalLink}>
              {EMAIL}
            </a>
            <a href={MOBILE_HREF} className={styles.finalLink}>
              {MOBILE_DISPLAY}
            </a>
          </p>
          <a href={MAILTO} className={`${styles.cta} ${styles.ctaLight}`}>
            {hero.ctaMail}
          </a>
        </div>
      </section>
    </>
  );
};

export default withPageShell(Tippgeber);
