import { useTranslation } from 'react-i18next';
import Seo from './Seo';

interface RouteSeoProps {
  page: string;
  path: string;
}

/** Seo tags for a page, texts come from `seo.<page>.*` in the locale files. */
const RouteSeo = ({ page, path }: RouteSeoProps) => {
  const { t } = useTranslation();
  return (
    <Seo
      title={t(`seo.${page}.title`)}
      description={t(`seo.${page}.description`)}
      path={path}
    />
  );
};

export default RouteSeo;
