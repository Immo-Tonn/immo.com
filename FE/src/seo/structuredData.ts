// Статические JSON-LD из прежнего index.html (RealEstateAgent, WebSite)
export const siteStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Immo-Tonn",
    "url": "https://immo-tonn.com/",
    "image": "https://immo-tonn.com/og-image.png",
    "logo": "https://immo-tonn.com/og-image.png",
    "telephone": "+49 174 345 44 19",
    "email": "tonn_andreas@web.de",
    "sameAs": [
      "https://www.instagram.com/immo_tonn/",
      "https://www.linkedin.com/company/immo-tonn-m%C3%BCnster/?viewAsMember=true"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sessendrupweg 54",
      "postalCode": "48161",
      "addressLocality": "Münster",
      "addressRegion": "Nordrhein-Westfalen",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.9607,
      "longitude": 7.6261
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Münster"
      },
      {
        "@type": "Place",
        "name": "Münsterland"
      },
      {
        "@type": "State",
        "name": "Nordrhein-Westfalen"
      }
    ],
    "description": "Immobilienbewertung, Verkauf und Vermittlung von Wohnungen, Häusern, Grundstücken und Gewerbeimmobilien in Münster, Münsterland und Nordrhein-Westfalen."
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Immo Tonn",
    "url": "https://immo-tonn.com/",
    "inLanguage": "de-DE"
  }
] as const;
