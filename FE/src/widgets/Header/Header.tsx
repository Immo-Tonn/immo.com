import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import telephone from '@shared/assets/header/telephone.svg';
import eMail from '@shared/assets/header/e-mail.svg';
import location from '@shared/assets/header/google.svg';
import AdminDropdownMenu from '@widgets/AdminDropdownMenu/AdminDropdownMenu';
import { dispatchLogoutEvent } from '@features/utils/authEvent';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface NavLink {
  label: string;
  path: string;
}

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
              <LanguageSwitcher />
            </div>
          </Drawer>

          <div className={styles.contactColumn}>
            <div className={styles.contact}>
              <ul className={styles.headerContacts}>
                <li>
                  <div className={styles.contactIcon}>
                    <img src={telephone} alt="Phone" />
                  </div>
                  <a href="tel:01743454419" className={styles.contactText}>
                    0174 345 44 19
                  </a>
                </li>
                <li>
                  <div className={styles.contactIcon}>
                    <img src={eMail} alt="email" />
                  </div>
                  <a
                    href="mailto:tonn_andreas@web.de"
                    className={styles.contactText}
                  >
                    tonn_andreas@web.de
                  </a>
                </li>
                <li className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <img src={location} alt="address icon" />
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactText}
                  >
                    <div className={styles.contactTextWrapper}>
                      <span>Sessendrupweg 54</span>
                      <span>48161 Münster</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <LanguageSwitcher className={styles.bottomLangSwitcher} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
