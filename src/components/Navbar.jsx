import React, { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";
import { normalizeLang } from "../i18n/config";
import { useI18n } from "../i18n/useI18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const { t } = useI18n("navbar");

  const otherLang = lang === "en" ? "kn" : "en";

  const navItems = useMemo(
    () => [
      { to: `/${lang}/guru-parampare`, label: t("guruParampare") },
      { to: `/${lang}/institutions`, label: t("institutions") },
      { to: `/${lang}/events`, label: t("events") },
      { to: `/${lang}/seva-booking`, label: t("sevaBooking") },
      { to: `/${lang}/publications`, label: t("publications") },
      { to: `/${lang}/gallery`, label: t("gallery") },
    ],
    [lang, t]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const switchLanguage = () => {
    const currentPath = location.pathname;
    const segments = currentPath.split("/").filter(Boolean);

    if (segments.length === 0) {
      navigate(`/${otherLang}`);
      return;
    }

    segments[0] = otherLang;
    navigate(`/${segments.join("/")}${location.search}${location.hash}`);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link to={`/${lang}`} className={styles.brandWrapper}>
          <div className={styles.logoMark}>
            <img
              src={logoImg}
              alt="Sri Sheshachala Sadguru Samsthana logo"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>{t("brandTitle")}</span>
            <span className={styles.brandSubtitle}>{t("brandSubtitle")}</span>
          </div>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            type="button"
            className={styles.langToggle}
            onClick={switchLanguage}
            aria-label={`Switch language to ${otherLang}`}
          >
            {t("languageToggle")}
          </button>
        </nav>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          type="button"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}
      >
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={styles.mobileNavLink}>
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          className={styles.mobileLangToggle}
          onClick={switchLanguage}
        >
          {t("languageToggle")}
        </button>
      </div>
    </header>
  );
}