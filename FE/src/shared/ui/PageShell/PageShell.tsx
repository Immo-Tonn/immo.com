import type { ComponentType, ReactNode } from 'react';
import styles from './PageShell.module.css';

/**
 * Оболочка публичных страниц (кроме Home и админки): токены, шрифты и базовые правила
 * дизайна «Nachtarchitektur». Только оформление — на поведение не влияет.
 */
const PageShell = ({ children }: { children: ReactNode }) => (
  <div className={styles.shell}>{children}</div>
);

export default PageShell;

/** Оборачивает компонент страницы в PageShell (только оформление). */
export const withPageShell = <P extends object>(Page: ComponentType<P>) => {
  const Wrapped = (props: P) => (
    <PageShell>
      <Page {...props} />
    </PageShell>
  );
  Wrapped.displayName = `withPageShell(${Page.displayName || Page.name || 'Page'})`;
  return Wrapped;
};
