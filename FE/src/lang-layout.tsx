import { Outlet, useLocation } from 'react-router';
import Layout from '@widgets/Layout/Layout';
import NotFound from '@pages/NotFound/NotFound';
import i18n from '@shared/i18n/i18n';
import { langOf, readinessKey, readyLangs, toLang } from './seo/meta';

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
  const { pathname } = useLocation();
  // Языковая версия, для которой нет готовых текстов/мета (readiness.json),
  // доступна пользователям, но закрыта от индексации
  const ready = readyLangs(readinessKey(pathname)).includes(langOf(pathname));
  return (
    <Layout>
      {!ready && <meta name="robots" content="noindex" />}
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
