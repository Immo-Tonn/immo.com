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

const getMeta = (attr: 'name' | 'property', key: string) =>
  document.head
    .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    ?.getAttribute('content') ?? '';

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

const getCanonical = () =>
  document.head
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.getAttribute('href') ?? '';

/**
 * Client-side SEO tags for the SPA (no SSR/prerender is set up), restores
 * the previous head values on unmount so navigating away doesn't leak them.
 */
const Seo = ({ title, description, path, image }: SeoProps) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const previous = {
      title: document.title,
      description: getMeta('name', 'description'),
      canonical: getCanonical(),
      ogTitle: getMeta('property', 'og:title'),
      ogDescription: getMeta('property', 'og:description'),
      ogUrl: getMeta('property', 'og:url'),
      ogImage: getMeta('property', 'og:image'),
      twitterTitle: getMeta('name', 'twitter:title'),
      twitterDescription: getMeta('name', 'twitter:description'),
    };

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
      document.title = previous.title;
      setMeta('name', 'description', previous.description);
      setCanonical(previous.canonical);
      setMeta('property', 'og:title', previous.ogTitle);
      setMeta('property', 'og:description', previous.ogDescription);
      setMeta('property', 'og:url', previous.ogUrl);
      if (previous.ogImage) setMeta('property', 'og:image', previous.ogImage);
      setMeta('name', 'twitter:title', previous.twitterTitle);
      setMeta('name', 'twitter:description', previous.twitterDescription);
    };
  }, [title, description, path, image]);

  return null;
};

export default Seo;
