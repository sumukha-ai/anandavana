import { useState, useEffect, useMemo, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import {
  CalendarCheck,
  ChevronDown,
  HandHeart,
  Languages,
  LayoutGrid,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useI18n } from "../i18n/useI18n";

const ICON = { size: 17, strokeWidth: 1.75, "aria-hidden": true };

function initialsOf(name) {
  return String(name || "")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const { t } = useI18n("navbar");
  const { t: tAccount } = useI18n("account");
  const { isAuthenticated, user, logout } = useAuth();
  const accountRef = useRef(null);
  const [menuPath, setMenuPath] = useState(location.pathname);

  // Any navigation closes open menus
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  }
  const accountButtonRef = useRef(null);

  const role = normalizeRole(user?.role);
  const isBhakta = isAuthenticated && role === "bhakta";
  const displayName = user?.username || user?.email || "";
  const firstName = displayName.split(/\s+/)[0];
  const initials = initialsOf(displayName) || "•";

  // The public site stays the same for everyone; signing in only adds the account menu
  const navItems = useMemo(
    () => [
      { to: `/${lang}/guru-parampare`, label: t("guruParampare") },
      { to: `/${lang}/sadguru-vamsha-vruksha`, label: t("sadguruVamshaVruksha") },
      { to: `/${lang}/institutions`, label: t("institutions") },
      { to: `/${lang}/events`, label: t("events") },
      { to: `/${lang}/seva-booking`, label: t("sevaBooking") },
      { to: `/${lang}/donate`, label: t("donate") },
      { to: `/${lang}/publications`, label: t("publications") },
      { to: `/${lang}/gallery`, label: t("gallery") },
    ],
    [lang, t]
  );

  const accountItems = useMemo(() => {
    if (!isAuthenticated) return [];
    if (!isBhakta) {
      return [{ to: getRoleHomePath(user?.role, lang), label: t("openWorkspace"), icon: LayoutDashboard }];
    }
    return [
      { to: `/${lang}/dashboard`, label: tAccount("navOverview"), icon: LayoutGrid, end: true },
      { to: `/${lang}/dashboard/bookings`, label: tAccount("navBookings"), icon: CalendarCheck },
      { to: `/${lang}/dashboard/donations`, label: tAccount("navDonations"), icon: HandHeart },
      { to: `/${lang}/dashboard/profile`, label: tAccount("navProfile"), icon: UsersRound },
      { to: `/${lang}/dashboard/book-seva`, label: tAccount("navBook"), icon: Sparkles },
    ];
  }, [isAuthenticated, isBhakta, lang, t, tAccount, user?.role]);

  const forceSolidNav = /^\/[^/]+\/(seva\/|seva-booking|checkout|donate|dashboard|login|register|unauthorized)/.test(location.pathname);
  const otherLang = lang === "kn" ? "en" : "kn";
  const switchLangPath = `/${otherLang}${location.pathname.replace(/^\/[^/]+/, "")}${location.search}${location.hash}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  useEffect(() => {
    if (!isAccountOpen) return undefined;
    const handlePointer = (event) => {
      if (!accountRef.current?.contains(event.target)) setIsAccountOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isAccountOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
    logout();
    navigate(`/${lang}/login`, { replace: true });
  };

  // Close when keyboard focus moves elsewhere; pointer clicks outside are handled above
  const handleAccountBlur = (event) => {
    const next = event.relatedTarget;
    if (next && !accountRef.current?.contains(next)) setIsAccountOpen(false);
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${forceSolidNav ? styles.solid : ""} ${
        isMobileMenuOpen ? styles.menuOpen : ""
      }`}
    >
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
            <div className={styles.account} ref={accountRef} onBlur={handleAccountBlur}>
              <button
                ref={accountButtonRef}
                type="button"
                className={`${styles.accountButton} ${isAccountOpen ? styles.accountButtonOpen : ""}`}
                aria-expanded={isAccountOpen}
                aria-controls="account-menu"
                aria-label={`${t("accountMenu")}: ${displayName}`}
                onClick={() => setIsAccountOpen((open) => !open)}
              >
                <span className={styles.avatar} aria-hidden="true">{initials}</span>
                <span className={styles.accountName} aria-hidden="true">{firstName}</span>
                <ChevronDown size={16} strokeWidth={2} aria-hidden="true" className={styles.chevron} />
              </button>

              <div
                id="account-menu"
                className={`${styles.accountPanel} ${isAccountOpen ? styles.accountPanelOpen : ""}`}
                inert={isAccountOpen ? undefined : true}
              >
                <div className={styles.accountHeader}>
                  <span className={`${styles.avatar} ${styles.avatarLarge}`} aria-hidden="true">{initials}</span>
                  <div>
                    <span className={styles.accountLabel}>{t("signedInAs")}</span>
                    <strong>{displayName}</strong>
                    {user?.email && user.email !== displayName ? <span className={styles.accountEmail}>{user.email}</span> : null}
                  </div>
                </div>
                <ul className={styles.accountList}>
                  {accountItems.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) => `${styles.accountLink} ${isActive ? styles.accountLinkActive : ""}`}
                      >
                        <Icon {...ICON} />
                        <span>{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <button type="button" className={styles.signOut} onClick={handleLogout}>
                  <LogOut {...ICON} />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to={`/${lang}/login`}
              className={({ isActive }) =>
                isActive ? `${styles.authButton} ${styles.authButtonActive}` : styles.authButton
              }
            >
              <LogIn size={16} strokeWidth={2} aria-hidden="true" />
              <span>{t("login")}</span>
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
          {isAuthenticated ? (
            <span className={`${styles.avatar} ${styles.avatarSmall}`} aria-hidden="true">{initials}</span>
          ) : null}
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}
        inert={isMobileMenuOpen ? undefined : true}
      >
        {isAuthenticated ? (
          <div className={styles.mobileAccount}>
            <div className={styles.accountHeader}>
              <span className={`${styles.avatar} ${styles.avatarLarge}`} aria-hidden="true">{initials}</span>
              <div>
                <span className={styles.accountLabel}>{t("signedInAs")}</span>
                <strong>{displayName}</strong>
                {user?.email && user.email !== displayName ? <span className={styles.accountEmail}>{user.email}</span> : null}
              </div>
            </div>
            <ul className={styles.mobileAccountGrid}>
              {accountItems.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => `${styles.mobileAccountLink} ${isActive ? styles.mobileAccountLinkActive : ""}`}
                    onClick={closeMenu}
                  >
                    <Icon {...ICON} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
          <button type="button" className={`${styles.mobileAuthButton} ${styles.mobileSignOut}`} onClick={handleLogout}>
            <LogOut {...ICON} />
            <span>{t("logout")}</span>
          </button>
        ) : (
          <Link to={`/${lang}/login`} className={styles.mobileAuthButton} onClick={closeMenu}>
            <LogIn {...ICON} />
            <span>{t("login")}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
