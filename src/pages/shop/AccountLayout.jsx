import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CalendarCheck, HandHeart, LayoutGrid, ShoppingBag, UsersRound } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Account.module.css";
import { Breadcrumbs } from "./ShopParts";

export default function AccountLayout({ crumb, children }) {
  const { t, lang } = useI18n("account");
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navRef = useRef(null);

  // On narrow screens the account nav is a horizontal strip; keep the current page in view
  useEffect(() => {
    const list = navRef.current;
    const active = list?.querySelector('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    const offset = active.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    list.scrollLeft = offset - (list.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);
  const name = user?.username || "";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const links = [
    { to: `/${lang}/dashboard`, label: t("navOverview"), icon: LayoutGrid, end: true },
    { to: `/${lang}/dashboard/profile`, label: t("navProfile"), icon: UsersRound },
    { to: `/${lang}/dashboard/bookings`, label: t("navBookings"), icon: CalendarCheck },
    { to: `/${lang}/dashboard/donations`, label: t("navDonations"), icon: HandHeart },
    { to: `/${lang}/dashboard/book-seva`, label: t("navBook"), icon: ShoppingBag },
  ];

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={[{ label: t("myAccount"), to: crumb ? `/${lang}/dashboard` : undefined }, ...(crumb ? [{ label: crumb }] : [])]} />

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <span className={styles.avatar} aria-hidden="true">
                {initials || "•"}
              </span>
              <div className={styles.userText}>
                <strong>{name}</strong>
                {user?.email ? <span>{user.email}</span> : null}
              </div>
            </div>
            <nav aria-label={t("myAccount")}>
              <ul className={styles.nav} ref={navRef}>
                {links.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
