import { useState, useEffect, useMemo, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  HandHeart,
  Images,
  Languages,
  LayoutGrid,
  LayoutDashboard,
  LogIn,
  LogOut,
  ScrollText,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useI18n } from "../i18n/useI18n";
import { FamilyTreeIcon, TempleIcon } from "./icons/NavIcons";

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
  const [openGroup, setOpenGroup] = useState(null);
  const groupCloseTimer = useRef(null);
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
    setOpenGroup(null);
  }
  const accountButtonRef = useRef(null);

  const role = normalizeRole(user?.role);
  const isBhakta = isAuthenticated && role === "bhakta";
  const displayName = user?.username || user?.email || "";
  const firstName = displayName.split(/\s+/)[0];
  const initials = initialsOf(displayName) || "•";

  // The public site stays the same for everyone; signing in only adds the account menu
  // Top-level entries are either a single link or a group revealed on hover/focus
  const navItems = useMemo(
    () => [
      {
        id: "sevas",
        label: t("groupSevas"),
        items: [
          { to: `/${lang}/seva-booking`, label: t("sevaBooking"), hint: t("sevaBookingHint"), icon: TempleIcon },
          { to: `/${lang}/donate`, label: t("donate"), hint: t("donateHint"), icon: HandHeart },
        ],
      },
      {
        id: "about",
        label: t("groupAbout"),
        items: [
          { to: `/${lang}/guru-parampare`, label: t("guruParampare"), hint: t("guruParampareHint"), icon: ScrollText },
          {
            to: `/${lang}/sadguru-vamsha-vruksha`,
            label: t("sadguruVamshaVruksha"),
            hint: t("sadguruVamshaVrukshaHint"),
            icon: FamilyTreeIcon,
          },
          { to: `/${lang}/institutions`, label: t("institutions"), hint: t("institutionsHint"), icon: Building2 },
          { to: `/${lang}/gallery`, label: t("gallery"), hint: t("galleryHint"), icon: Images },
        ],
      },
      { id: "events", to: `/${lang}/events`, label: t("events") },
      { id: "publications", to: `/${lang}/publications`, label: t("publications") },
    ],
    [lang, t]
  );

  const isGroupActive = (group) =>
    group.items.some((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));

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

  useEffect(() => {
    if (!openGroup) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        document.getElementById(`nav-trigger-${openGroup}`)?.focus();
        setOpenGroup(null);
      }
    };
    const handlePointer = (event) => {
      if (!event.target.closest?.(`.${styles.navGroup}`)) setOpenGroup(null);
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [openGroup]);

  useEffect(() => () => clearTimeout(groupCloseTimer.current), []);

  // A short grace period lets the pointer travel from the trigger into the panel
  const showGroup = (id) => {
    clearTimeout(groupCloseTimer.current);
    setOpenGroup(id);
  };
  const hideGroupSoon = () => {
    clearTimeout(groupCloseTimer.current);
    groupCloseTimer.current = setTimeout(() => setOpenGroup(null), 140);
  };
  const handleGroupBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpenGroup(null);
  };

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
          <ul className={styles.navList}>
            {navItems.map((item) =>
              item.items ? (
                <li
                  key={item.id}
                  className={styles.navGroup}
                  onPointerEnter={(event) => event.pointerType === "mouse" && showGroup(item.id)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && hideGroupSoon()}
                  onBlur={handleGroupBlur}
                >
                  <button
                    id={`nav-trigger-${item.id}`}
                    type="button"
                    className={`${styles.navLink} ${styles.groupTrigger} ${isGroupActive(item) ? styles.active : ""} ${
                      openGroup === item.id ? styles.groupTriggerOpen : ""
                    }`}
                    aria-expanded={openGroup === item.id}
                    aria-controls={`nav-panel-${item.id}`}
                    onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} strokeWidth={2.25} aria-hidden="true" className={styles.groupChevron} />
                  </button>
                  <div
                    id={`nav-panel-${item.id}`}
                    className={`${styles.groupPanel} ${openGroup === item.id ? styles.groupPanelOpen : ""}`}
                    inert={openGroup === item.id ? undefined : true}
                  >
                    <ul className={styles.groupList}>
                      {item.items.map(({ to, label, hint, icon: Icon }) => (
                        <li key={to}>
                          <NavLink
                            to={to}
                            className={({ isActive }) => `${styles.groupLink} ${isActive ? styles.groupLinkActive : ""}`}
                          >
                            <span className={styles.groupIcon}>
                              <Icon {...ICON} />
                            </span>
                            <span className={styles.groupText}>
                              <span className={styles.groupLabel}>{label}</span>
                              <span className={styles.groupHint}>{hint}</span>
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

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

        {navItems.map((item) =>
          item.items ? (
            <section key={item.id} className={styles.mobileGroup} aria-labelledby={`mobile-group-${item.id}`}>
              <h2 id={`mobile-group-${item.id}`} className={styles.mobileGroupTitle}>
                {item.label}
              </h2>
              {item.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `${styles.mobileNavLink} ${styles.mobileSubLink} ${isActive ? styles.mobileNavLinkActive : ""}`
                  }
                  onClick={closeMenu}
                >
                  <Icon {...ICON} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </section>
          ) : (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          )
        )}

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
