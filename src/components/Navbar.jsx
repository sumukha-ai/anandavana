import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import { useI18n } from "../i18n/useI18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const { t } = useI18n("navbar");
  const { isAuthenticated, user, logout } = useAuth();

  const role = normalizeRole(user?.role);
  const isBhakta = isAuthenticated && role === "bhakta";

  const navItems = useMemo(() => {
    if (isBhakta) {
      return [
        { to: `/${lang}/dashboard`, label: "Dashboard" },
        { to: `/${lang}/dashboard/profile`, label: "Profile" },
        { to: `/${lang}/dashboard/book-seva`, label: "Book Seva" },
        { to: `/${lang}/dashboard/bookings`, label: "Booked Sevas" },
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      }`}
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
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <button type="button" className={styles.authButton} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink
              to={`/${lang}/login`}
              className={({ isActive }) =>
                isActive ? `${styles.authButton} ${styles.authButtonActive}` : styles.authButton
              }
            >
              Login
            </NavLink>
          )}
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
          <NavLink key={item.to} to={item.to} className={styles.mobileNavLink} onClick={closeMenu}>
            {item.label}
          </NavLink>
        ))}

        {isAuthenticated ? (
          <button type="button" className={styles.mobileAuthButton} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to={`/${lang}/login`} className={styles.mobileNavLink} onClick={closeMenu}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
