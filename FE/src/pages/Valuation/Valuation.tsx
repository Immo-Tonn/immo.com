import Competence from '@widgets/Competence/Competence';
import HowIsGoing from '@widgets/HowIsGoing/HowIsGoing';
import ValuationCTA from '@widgets/ValuationCTA/ValuationCTA';
import HeroValuation from '@widgets/hero/HeroValuation/HeroValuation.module';
import Seo from '@shared/ui/Seo/Seo';
import { useTranslation } from 'react-i18next';

const valuationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Immobilienbewertung',
  name: 'Immobilienbewertung mit Immo Tonn',
  description:
    'Kostenlose und unverbindliche Immobilienbewertung für Häuser, Wohnungen und Grundstücke in Münster und Umgebung.',
  provider: {
    '@type': 'RealEstateAgent',
    name: 'Immo Tonn',
    url: 'https://immo-tonn.com',
  },
  areaServed: {
    '@type': 'State',
    name: 'Nordrhein-Westfalen',
  },
  url: 'https://immo-tonn.com/wertermittlung',
};

const Valuation = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t('seo.wertermittlung.title')}
        description={t('seo.wertermittlung.description')}
        path="/wertermittlung"
      />
      <script type="application/ld+json">
        {JSON.stringify(valuationSchema)}
      </script>
      <HeroValuation /> <ValuationCTA /> <Competence /> <HowIsGoing />
    </>
  );
};
export default Valuation;
