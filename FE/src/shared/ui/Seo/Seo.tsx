import { useEffect } from 'react';

const SITE_URL = 'https://immo-tonn.com';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

// Site-wide defaults (same as index.html). Prerendered pages ship with their own
// head values, so we can't capture "previous" values on mount: restore these instead.
const DEFAULTS = {
  title: 'Immo Tonn – Immobilienbewertung mit Herz und Verstand',
  description:
    'Immo-Tonn in Münster: Verlässliche Immobilienbewertung, Verkauf und Vermittlung von Wohnungen, Häusern und Grundstücken. Jetzt kostenlos bewerten lassen!',
  socialDescription:
    'Verlässliche Immobilienbewertung für Ihre sichere Entscheidung. Jetzt kostenlos bewerten lassen!',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.png`,
};

/**
 * Client-side SEO tags (also baked into HTML by scripts/prerender.mjs), restores
 * the site defaults on unmount so navigating away doesn't leak them.
 */
const Seo = ({ title, description, path, image }: SeoProps) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setCanonical(url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    return () => {
      document.title = DEFAULTS.title;
      setMeta('name', 'description', DEFAULTS.description);
      setCanonical(DEFAULTS.url);
      setMeta('property', 'og:title', DEFAULTS.title);
      setMeta('property', 'og:description', DEFAULTS.socialDescription);
      setMeta('property', 'og:url', DEFAULTS.url);
      setMeta('property', 'og:image', DEFAULTS.image);
      setMeta('name', 'twitter:title', DEFAULTS.title);
      setMeta('name', 'twitter:description', DEFAULTS.socialDescription);
    };
  }, [title, description, path, image]);

  return null;
};

export default Seo;
