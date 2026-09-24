import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, CircleCheck, ChevronRight, Globe, LogOut, Menu, Moon, Plus, Search, Sun, X, ClipboardList } from "lucide-react";
import logoImg from "../../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";
import CommandPalette from "./CommandPalette";
import { getGroupedMenuItems, sectionMeta, sectionPath } from "./rolePortalConfig";
import { Avatar } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const THEME_KEY = "agadi_console_theme";

function readTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useNavIndicator(navRef, pathname) {
  const [box, setBox] = useState(null);
  const [animate, setAnimate] = useState(false);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector('[aria-current="page"]');
    if (!nav || !active) {
      setBox(null);
      return;
    }
    setBox({ y: active.offsetTop, h: active.offsetHeight });
  }, [navRef]);

  useLayoutEffect(() => {
    measure();
  }, [measure, pathname]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [measure, navRef]);

  // The first placement snaps; later ones glide
  useEffect(() => {
    if (!box || animate) return undefined;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate, box]);

  return { box, still: !animate };
}

function Toasts({ toasts, onDismiss }) {
  return (
    <div className={styles.toasts} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => {
        const Icon = toast.tone === "error" ? CircleAlert : CircleCheck;
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={cx(
              styles.toast,
              toast.tone === "error" ? styles.toastError : styles.toastSuccess,
              toast.leaving && styles.toastLeaving
            )}
          >
            <Icon size={17} aria-hidden="true" />
            <div className={styles.toastBody}>
              <strong>{toast.title}</strong>
              {toast.text ? <span>{toast.text}</span> : null}
            </div>
            <button type="button" className={styles.toastClose} onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function RoleShell({ role, lang, section, sevas = [], loading, crumb, toasts, onDismissToast, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(readTheme);
  const { box, still } = useNavIndicator(navRef, location.pathname);
  const grouped = getGroupedMenuItems(role);
  const meta = sectionMeta[section] || sectionMeta.overview;
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);
  const otherLang = lang === "kn" ? "en" : "kn";
  const switchLangPath = `/${otherLang}${location.pathname.replace(/^\/[^/]+/, "")}${location.search}`;

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    logout();
    navigate(`/${lang}/login`);
  }, [lang, logout, navigate]);

  useEffect(() => {
    const onKey = (event) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setPaletteOpen(true);
      } else if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands = useMemo(() => {
    const list = [];
    Object.values(grouped)
      .flat()
      .forEach((item) => {
        const itemMeta = sectionMeta[item];
        list.push({
          id: `page-${item}`,
          group: "Pages",
          label: itemMeta.label,
          keywords: `${itemMeta.group} ${itemMeta.text}`,
          icon: itemMeta.icon,
          run: () => {
            setMenuOpen(false);
            navigate(sectionPath(lang, role, item));
          },
        });
      });
    if (role === "admin") {
      list.push({
        id: "action-add-seva",
        group: "Actions",
        label: "Add a new seva",
        keywords: "create new catalog",
        icon: Plus,
        run: () => navigate(`/${lang}/${role}/seva-editor`),
      });
    }
    list.push(
      {
        id: "action-theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        keywords: "theme appearance dark light mode",
        icon: theme === "dark" ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: "action-lang",
        group: "Actions",
        label: otherLang === "kn" ? "Show content in Kannada" : "Show content in English",
        keywords: "language kannada english ಕನ್ನಡ",
        icon: Globe,
        run: () => navigate(switchLangPath),
      },
      {
        id: "action-signout",
        group: "Actions",
        label: "Sign out",
        keywords: "logout log out",
        icon: LogOut,
        run: signOut,
      }
    );
    sevas.forEach((seva) => {
      list.push({
        id: `seva-${seva.id}`,
        group: "Sevas",
        label: seva.name || "Untitled seva",
        keywords: seva.name_kn || "",
        hint: role === "admin" ? "Edit" : "Catalog",
        icon: ClipboardList,
        run: () =>
          role === "admin"
            ? navigate(`/${lang}/${role}/seva-editor/${seva.id}`, { state: { seva } })
            : navigate(`/${lang}/${role}/sevas`),
      });
    });
    return list;
  }, [grouped, lang, navigate, otherLang, role, sevas, signOut, switchLangPath, theme, toggleTheme]);

  return (
    <div className={styles.console} data-theme={theme} lang={lang}>
      <aside id="console-sidebar" className={cx(styles.sidebar, menuOpen && styles.sidebarOpen)} aria-label={`${roleName} workspace`}>
        <div className={styles.brand}>
          <img src={logoImg} alt="" className={styles.brandLogo} />
          <div className={styles.brandText}>
            <strong>Sri Kshetra Anandavana</strong>
            <span>{role} console</span>
          </div>
          <button
            type="button"
            className={cx(styles.iconButton, styles.railClose)}
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.navScroll}>
          <nav className={styles.nav} ref={navRef} aria-label="Workspace pages">
            <span
              className={cx(styles.navIndicator, still && styles.navIndicatorStill)}
              style={{ transform: `translateY(${box?.y || 0}px)`, height: box?.h || 0, opacity: box ? 1 : 0 }}
              aria-hidden="true"
            />
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className={styles.navGroup}>
                {group !== "Home" ? <span className={styles.navGroupLabel}>{group}</span> : null}
                {items.map((item) => {
                  const itemMeta = sectionMeta[item];
                  const Icon = itemMeta.icon;
                  return (
                    <NavLink
                      key={item}
                      to={sectionPath(lang, role, item)}
                      end={item === "overview"}
                      className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span>{itemMeta.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarFoot}>
          <div className={styles.userRow}>
            <Avatar name={user?.username || user?.email} />
            <div className={styles.userMeta}>
              <strong>{user?.username || roleName}</strong>
              <span>{user?.email || `${roleName} account`}</span>
            </div>
          </div>
          <div className={styles.footActions}>
            <button type="button" className={styles.footButton} onClick={toggleTheme} aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}>
              {theme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button type="button" className={styles.footButton} onClick={signOut}>
              <LogOut size={15} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className={cx(styles.scrim, menuOpen && styles.scrimOpen)} onClick={() => setMenuOpen(false)} aria-hidden="true" />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={cx(styles.iconButton, styles.menuButton)}
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="console-sidebar"
          >
            <Menu size={19} aria-hidden="true" />
          </button>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link to={sectionPath(lang, role, "overview")}>{roleName}</Link>
            {section !== "overview" ? (
              <>
                <ChevronRight size={14} aria-hidden="true" />
                {crumb ? (
                  <>
                    <Link to={crumb.parentTo}>{crumb.parent}</Link>
                    <ChevronRight size={14} aria-hidden="true" />
                    <span className={styles.crumbCurrent} aria-current="page">{crumb.label}</span>
                  </>
                ) : (
                  <span className={styles.crumbCurrent} aria-current="page">{meta.label}</span>
                )}
              </>
            ) : (
              <>
                <ChevronRight size={14} aria-hidden="true" />
                <span className={styles.crumbCurrent} aria-current="page">Overview</span>
              </>
            )}
          </nav>
          <div className={styles.topActions}>
            <button type="button" className={styles.searchTrigger} onClick={() => setPaletteOpen(true)} aria-label="Search and jump (Ctrl K)">
              <Search size={15} aria-hidden="true" />
              <span>Search or jump to…</span>
              <kbd className={styles.kbd}>Ctrl K</kbd>
            </button>
            <Link
              to={switchLangPath}
              className={cx(styles.btn, styles.btnGhost, styles.btnSm)}
              lang={otherLang}
              hrefLang={otherLang}
              title={otherLang === "kn" ? "Show content in Kannada" : "Show content in English"}
            >
              <Globe size={15} aria-hidden="true" />
              {otherLang === "kn" ? "ಕನ್ನಡ" : "English"}
            </Link>
          </div>
          {loading ? <span className={styles.progress} role="progressbar" aria-label="Loading" /> : null}
        </header>

        <main className={styles.content} key={location.pathname}>
          {children}
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={commands} /> : null}
      <Toasts toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}
