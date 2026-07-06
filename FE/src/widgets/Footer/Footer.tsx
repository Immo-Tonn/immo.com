import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import logo from '@shared/assets/about-us/logo-white.svg';
import instagram from '@shared/assets/footer/instagram.svg';
import linkedIn from '@shared/assets/footer/linkedin.svg';
// import youtube from '@shared/assets/footer/youtube.svg'; // пока не подключаем
const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.topStripe} />
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <img src={logo} alt="logo" className={styles.footerLogo} />

          <ul className={styles.footerLinks}>
            <li>
              <Link to="/legalnotice">{t('footer.legalNotice')}</Link>
            </li>
            <li>
              <Link to="/privacypolicy">{t('footer.privacyPolicy')}</Link>
            </li>
            <li>
              <Link to="/cancellationpolicy">{t('footer.cancellationPolicy')}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerMiddle}>
          <ul className={styles.footerIcons}>
            <li>
              <a
                href="https://www.instagram.com/immo_tonn/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="instagram" />
              </a>
            </li>
            {/* YouTube пока не подключаем — нет активной страницы
            <li>
              <a>
                <img src={youtube} alt="youtube" />
              </a>
            </li>
            */}
            <li>
              <a
                href="https://www.linkedin.com/company/immo-tonn-m%C3%BCnster/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedIn} alt="linked-in" />
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerRight}>
          <a href="tel:01743454419">Tel.: 0251 625 60 763</a>
          <a href="tel:01743454419">Mobil: 0174 345 44 19</a>
          <a
            href="https://ig.al/tonn"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.tonn-versicherung.de
          </a>
          <a
            href="https://www.google.com/maps/place/Sessendrupweg+54,+48161+M%C3%BCnster/@52.000885,7.5495001,17z/data=!3m1!4b1!4m6!3m5!1s0x47b9b0fb68b86337:0x6c01106fad5b0129!8m2!3d52.000885!4d7.552075!16s%2Fg%2F11bw3zj4mf?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sessendrupweg 54 <p>48161 Münster</p>
          </a>
        </div>
      </div>
      <div className={styles.bottomStripe}>
        <p>{t('footer.rightsReserved', { name: 'Immo Tonn', year: 2026 })}</p>
      </div>
    </footer>
  );
};

export default Footer;
