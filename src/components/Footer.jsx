import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import styles from "./Footer.module.css";
import logoImg from "../../assets/logo.png";
import { useI18n } from "../i18n/useI18n";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Anandavana+Agadi+Haveri+Karnataka";

export default function Footer() {
  const { t, lang } = useI18n("footer");
  const { t: tNav } = useI18n("navbar");

  const links = [
    { to: `/${lang}/guru-parampare`, label: tNav("guruParampare") },
    { to: `/${lang}/sadguru-vamsha-vruksha`, label: tNav("sadguruVamshaVruksha") },
    { to: `/${lang}/institutions`, label: tNav("institutions") },
    { to: `/${lang}/seva-booking`, label: tNav("sevaBooking") },
    { to: `/${lang}/events`, label: tNav("events") },
    { to: `/${lang}/gallery`, label: tNav("gallery") },
  ];

  return (
    <footer className={styles.footer} lang={lang}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src={logoImg} alt="" className={styles.logo} width="56" height="56" />
          <div>
            <p className={styles.brandTitle}>{tNav("brandTitle")}</p>
            <p className={styles.brandSubtitle}>{tNav("brandSubtitle")}</p>
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>{t("visitHeading")}</h2>
          <p className={styles.line}>
            <MapPin size={16} aria-hidden="true" />
            <span>{t("address")}</span>
          </p>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className={styles.textLink}>
            {t("directions")}
          </a>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>{t("reachHeading")}</h2>
          <a href="tel:+919741585030" className={styles.line}>
            <Phone size={16} aria-hidden="true" />
            <span>+91 97415 85030</span>
          </a>
          <a href="mailto:info@anandavanaagadi.org" className={styles.line}>
            <Mail size={16} aria-hidden="true" />
            <span>info@anandavanaagadi.org</span>
          </a>
        </div>

        <nav className={styles.column} aria-label={t("exploreHeading")}>
          <h2 className={styles.heading}>{t("exploreHeading")}</h2>
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.baseline}>
        <p>&copy; {new Date().getFullYear()} {t("copyright")}</p>
      </div>
    </footer>
  );
}
