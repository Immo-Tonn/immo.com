import { Outlet } from 'react-router';
import Layout from '@widgets/Layout/Layout';
import NotFound from '@pages/NotFound/NotFound';
import i18n from '@shared/i18n/i18n';
import { toLang } from './seo/meta';

// /en, /ru — языковые версии; без префикса — немецкий (существующие URL).
// /de/... и любые другие значения первого сегмента — 404.
const setLanguage = async ({ params }: { params: { lang?: string } }) => {
  const { lang } = params;
  if (lang && lang !== 'en' && lang !== 'ru') {
    throw new Response(null, { status: 404 });
  }
  await i18n.changeLanguage(toLang(lang));
  return null;
};

export const loader = setLanguage;
export const clientLoader = setLanguage;

export default function LangLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  return (
    <Layout>
      <title>404 | Immo Tonn</title>
      <meta name="robots" content="noindex" />
      <NotFound />
    </Layout>
  );
}
