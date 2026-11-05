import { forwardRef, useCallback } from 'react';
import {
  Link as RRLink,
  NavLink as RRNavLink,
  Navigate as RRNavigate,
  useLocation,
  useNavigate as useRRNavigate,
  type LinkProps,
  type NavLinkProps,
  type NavigateProps,
  type NavigateOptions,
  type To,
} from 'react-router-dom';
import { langOf, localizeTo } from '../../seo/meta';

/**
 * Обёртки над Link/NavLink/Navigate/useNavigate: внутренние ссылки сохраняют
 * текущий язык (/en, /ru). Внешние адреса и уже локализованные пути не меняются.
 */
const useLang = () => langOf(useLocation().pathname);

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, ...props }, ref) => (
    <RRLink ref={ref} to={localizeTo(useLang(), to)} {...props} />
  ),
);
Link.displayName = 'LocaleLink';

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, ...props }, ref) => (
    <RRNavLink ref={ref} to={localizeTo(useLang(), to)} {...props} />
  ),
);
NavLink.displayName = 'LocaleNavLink';

export const Navigate = ({ to, ...props }: NavigateProps) => (
  <RRNavigate to={localizeTo(useLang(), to)} {...props} />
);

export const useNavigate = () => {
  const navigate = useRRNavigate();
  const lang = useLang();
  return useCallback(
    (to: To | number, options?: NavigateOptions) =>
      typeof to === 'number'
        ? navigate(to)
        : navigate(localizeTo(lang, to), options),
    [navigate, lang],
  );
};
