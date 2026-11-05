import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from '@shared/lib/localeRouter';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import styles from './Header.module.css';
import logo from '@shared/assets/header/logo.svg';
import location from '@shared/assets/header/google.svg';
import AdminDropdownMenu from '@widgets/AdminDropdownMenu/AdminDropdownMenu';
import { dispatchLogoutEvent } from '@features/utils/authEvent';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface NavLink {
  label: string;
  path: string;
}

const PhoneIcon = () => (
  <svg
    className={styles.callIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5.2 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 6.4 6.4l1.3-2 4 1.6v3a1.9 1.9 0 0 1-2 1.9A15.8 15.8 0 0 1 3.3 5.5a1.9 1.9 0 0 1 1.9-2z" />
  </svg>
);

const Header = () => {
  const { t } = useTranslation();

  /* ---------- navigation state ---------- */
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const toggleDrawer = (open: boolean) => () => {
    setIsMenuOpen(open);
  };

  /* ---------- Admin state ---------- */
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  /* Verify token and set up listeners for login/logout events */
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('adminToken');
      setIsAdmin(!!token);
    };

    checkAuth();

    const handleAdminLogin = () => setIsAdmin(true);
    const handleAdminLogout = () => setIsAdmin(false);

    window.addEventListener('admin-login', handleAdminLogin);
    window.addEventListener('admin-logout', handleAdminLogout);

    return () => {
      window.removeEventListener('admin-login', handleAdminLogin);
      window.removeEventListener('admin-logout', handleAdminLogout);
    };
  }, []);

  /* logout */
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminInfo');
    setIsAdmin(false);
    dispatchLogoutEvent();
    navigate('/');
  };

  const navLinks: NavLink[] = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.valuation'), path: '/wertermittlung' },
    { label: t('nav.realEstate'), path: '/immobilien' },
    { label: t('nav.financing'), path: '/finanzierung' },
    { label: t('nav.contact'), path: '/kontakt' },
  ];

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className={styles.headerWrapper}>
        <div className={styles.headerTop}>
          <NavLink to="/" aria-label={t('header.toHome')} className={styles.logoLink}>
            <img className={styles.logo} src={logo} alt="logo" />
          </NavLink>

          <div className={styles.navContainer}>
            <nav className={styles.nav}>
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ''
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {/* --- ADMIN DROPDOWN (десктоп >768px) --- */}
              {isAdmin && (
                <div className={styles.adminDesktop}>
                  <AdminDropdownMenu onLogout={handleLogout} />
                </div>
              )}
            </nav>

            {/* --- ADMIN DROPDOWN (планшет ≤768px) --- */}
            {isAdmin && (
              <div className={styles.adminTablet}>
                <AdminDropdownMenu onLogout={handleLogout} />
              </div>
            )}
          </div>

          <div className={styles.mobileActions}>
            <a
              href="tel:01743454419"
              className={styles.callIconButton}
              aria-label={t('header.call')}
            >
              <PhoneIcon />
            </a>
            <LanguageSwitcher />
            <IconButton
              className={styles.burgerButton}
              onClick={toggleDrawer(true)}
              aria-label={t('header.openMenu')}
            >
              <MenuIcon />
            </IconButton>
          </div>

          <Drawer
            anchor="top"
            open={isMenuOpen}
            onClose={toggleDrawer(false)}
            slotProps={{
              paper: {
                className: styles.drawerPaper,
              },
            }}
          >
            <div className={styles.drawerHeader}>
              <NavLink to="/" aria-label={t('header.toHome')} onClick={toggleDrawer(false)}>
                <img src={logo} alt="logo-mobile" className={styles.drawerLogo} />
              </NavLink>
              <IconButton
                onClick={toggleDrawer(false)}
                className={styles.drawerCloseButton}
                aria-label={t('header.closeMenu')}
              >
                <CloseIcon />
              </IconButton>
            </div>

            <List className={styles.drawerList}>
              {navLinks.map(link => (
                <ListItem
                  key={link.path}
                  component={NavLink}
                  to={link.path}
                  onClick={handleNavLinkClick}
                  className={styles.drawerListItem}
                >
                  <ListItemText
                    primary={link.label}
                    className={styles.listItemText}
                  />
                </ListItem>
              ))}
            </List>

            {/* --- ADMIN DROPDOWN (мобильное меню) --- */}
            {isAdmin && (
              <div className={styles.drawerAdminContainer}>
                <AdminDropdownMenu onLogout={handleLogout} />
              </div>
            )}

            <div className={styles.drawerLangSwitcher}>
              <LanguageSwitcher variant="inline" />
            </div>
          </Drawer>

          <div className={styles.contactColumn}>
            <a href="tel:01743454419" className={styles.callButton}>
              <PhoneIcon />
              <span>{t('header.call')}</span>
            </a>
            <a
              href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addressLink}
            >
              <img className={styles.addressIcon} src={location} alt="" />
              <span className={styles.addressText}>
                <span className={styles.addressCity}>Münster</span>
                <span className={styles.addressStreet}>Sessendrupweg 54</span>
              </span>
            </a>
            <LanguageSwitcher className={styles.headerLang} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
