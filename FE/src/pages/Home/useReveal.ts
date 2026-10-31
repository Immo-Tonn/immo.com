import { useEffect, useRef } from 'react';

/**
 * Включает reveal-анимации внутри контейнера Home.
 * Без JS или при prefers-reduced-motion контент остаётся полностью видимым.
 */
export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute('data-in', '');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    targets.forEach(el => io.observe(el));
    root.setAttribute('data-motion', 'on');

    return () => {
      io.disconnect();
      root.removeAttribute('data-motion');
      targets.forEach(el => el.removeAttribute('data-in'));
    };
  }, []);

  return ref;
};
