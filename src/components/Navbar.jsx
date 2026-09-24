import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import { Languages } from "lucide-react";
import { useI18n } from "../i18n/useI18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const { t } = useI18n("navbar");
  const { isAuthenticated, user, logout } = useAuth();

  const role = normalizeRole(user?.role);
  const isBhakta = isAuthenticated && role === "bhakta";

  const navItems = useMemo(() => {
    if (isBhakta) {
      return [
        { to: `/${lang}/dashboard`, label: t("dashboard"), end: true },
        { to: `/${lang}/dashboard/profile`, label: t("profile") },
        { to: `/${lang}/dashboard/book-seva`, label: t("bookSeva") },
        { to: `/${lang}/dashboard/bookings`, label: t("bookedSevas") },
      ];
    }

    if (isAuthenticated) return [];

    return [
      { to: `/${lang}/guru-parampare`, label: t("guruParampare") },
      { to: `/${lang}/sadguru-vamsha-vruksha`, label: t("sadguruVamshaVruksha") },
      { to: `/${lang}/institutions`, label: t("institutions") },
      { to: `/${lang}/events`, label: t("events") },
      { to: `/${lang}/seva-booking`, label: t("sevaBooking") },
      { to: `/${lang}/publications`, label: t("publications") },
      { to: `/${lang}/gallery`, label: t("gallery") },
    ];
  }, [isAuthenticated, isBhakta, lang, t]);

  const brandPath = isAuthenticated ? getRoleHomePath(user?.role, lang) : `/${lang}`;
  const forceSolidNav = /^\/[^/]+\/seva\/[^/]+/.test(location.pathname);
  const otherLang = lang === "kn" ? "en" : "kn";
  const switchLangPath = `/${otherLang}${location.pathname.replace(/^\/[^/]+/, "")}${location.search}${location.hash}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate(`/${lang}`);
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
        isAuthenticated ? styles.authenticated : ""
      } ${forceSolidNav ? styles.solid : ""} ${navItems.length === 0 ? styles.utilityOnly : ""}`}
    >
      <div className={styles.navContainer}>
        <Link to={brandPath} className={styles.brandWrapper}>
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
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            to={switchLangPath}
            className={styles.langToggle}
            lang={otherLang}
            hrefLang={otherLang}
            aria-label={t("languageToggleLabel")}
          >
            <Languages size={15} aria-hidden="true" />
            <span>{t("languageToggle")}</span>
          </Link>

          {isAuthenticated ? (
            <button type="button" className={styles.authButton} onClick={handleLogout}>
              {t("logout")}
            </button>
          ) : (
            <NavLink
              to={`/${lang}/login`}
              className={({ isActive }) =>
                isActive ? `${styles.authButton} ${styles.authButtonActive}` : styles.authButton
              }
            >
              {t("login")}
            </NavLink>
          )}
        </nav>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? t("closeMenu") : t("menu")}
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
        inert={isMobileMenuOpen ? undefined : true}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink
            }
            onClick={closeMenu}
          >
            {item.label}
          </NavLink>
        ))}

        <Link
          to={switchLangPath}
          className={styles.mobileLangToggle}
          lang={otherLang}
          hrefLang={otherLang}
          aria-label={t("languageToggleLabel")}
          onClick={closeMenu}
        >
          <Languages size={17} aria-hidden="true" />
          <span>{t("languageToggle")}</span>
        </Link>

        {isAuthenticated ? (
          <button type="button" className={styles.mobileAuthButton} onClick={handleLogout}>
            {t("logout")}
          </button>
        ) : (
          <Link to={`/${lang}/login`} className={styles.mobileAuthButton} onClick={closeMenu}>
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
}
