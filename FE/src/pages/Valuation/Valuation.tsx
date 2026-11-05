import Competence from '@widgets/Competence/Competence';
import HowIsGoing from '@widgets/HowIsGoing/HowIsGoing';
import ValuationCTA from '@widgets/ValuationCTA/ValuationCTA';
import HeroValuation from '@widgets/hero/HeroValuation/HeroValuation.module';
import { useTranslation } from 'react-i18next';
import { ORGANIZATION_ID } from '../../seo/structuredData';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const Valuation = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0];
  const url = `https://immo-tonn.com${lang === 'en' || lang === 'ru' ? `/${lang}` : ''}/wertermittlung`;
  // Разметка совпадает с видимым содержимым и языком страницы
  const valuationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    serviceType: 'Immobilienbewertung',
    name: t('seo.wertermittlung.title'),
    description: t('seo.wertermittlung.description'),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: {
      '@type': 'State',
      name: 'Nordrhein-Westfalen',
    },
    url,
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(valuationSchema)}
      </script>
      <HeroValuation /> <ValuationCTA /> <Competence /> <HowIsGoing />
    </>
  );
};
export default withPageShell(Valuation);
