import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from '@shared/ui/ScrollToTop/ScrollToTop';
import 'leaflet/dist/leaflet.css';
import '@shared/styles/global.css';
import '@shared/i18n/i18n';
import { siteStructuredData } from './seo/structuredData';

const GA_ID = 'G-H21BY7YBZM';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const first = pathname.split('/')[1];
  const lang = first === 'en' || first === 'ru' ? first : 'de';

  return (
    <html lang={lang}>
      <head>
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="mfufpW0PUoxzLj"
          async
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Immobilienmakler Münster, Immobilienbewertung Münster, Haus verkaufen Münster, Wohnung verkaufen Münsterland, Immobilienmakler NRW, Immobilien Nordrhein-Westfalen, Grundstück verkaufen Münster"
        />
        <meta name="geo.region" content="DE-NW" />
        <meta name="geo.placename" content="Münster" />
        <meta name="geo.position" content="51.9607;7.6261" />
        <meta name="ICBM" content="51.9607, 7.6261" />
        <meta property="og:site_name" content="Immo Tonn" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://immo-tonn.com/og-image.png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
        {siteStructuredData.map(data => (
          <script
            key={data['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        <script
          type="text/plain"
          data-usercentrics="Google Analytics"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          type="text/plain"
          data-usercentrics="Google Analytics"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <Analytics />
    </>
  );
}
