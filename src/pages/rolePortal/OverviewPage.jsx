import { NavLink } from "react-router-dom";
import { getMenuItems, sectionMeta } from "./rolePortalConfig";
import styles from "./RolePortal.module.css";

function MetricCard({ title, value, helper, tone }) {
  return (
    <article className={styles.metricCard}>
      <span className={styles.metricBar} style={{ background: tone }} />
      <span className={styles.cardLabel}>{title}</span>
      <strong className={styles.metricValue}>{value}</strong>
      <span className={styles.helperText}>{helper}</span>
    </article>
  );
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function OverviewPage({ role, lang, bookings, sevas, users, lookups, canSeeUsers }) {
  const today = localDateKey();
  const todaysBookings = bookings.filter((booking) => booking.seva_date === today);

  return (
    <div className={styles.stackList}>
      <div className={styles.grid4}>
        <MetricCard title="Booked sevas" value={bookings.length} helper="Visible in current filters" tone="#b16038" />
        <MetricCard title="Catalog sevas" value={sevas.length} helper={`${sevas.filter((seva) => seva.enabled).length} enabled`} tone="#1f2d4f" />
        <MetricCard title="Accounts" value={canSeeUsers ? users.length : "-"} helper={canSeeUsers ? "Users and staff" : "Restricted"} tone="#8b6d2c" />
        <MetricCard title="Jyotisha references" value={lookups.rashis.length + lookups.nakshatras.length} helper="Rashi and nakshatra" tone="#6d4c7d" />
      </div>

      <div className={styles.grid2}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.sectionEyebrow}>Operations</span>
            <h2 className={styles.panelTitle}>Today's sevas</h2>
          </div>
          {todaysBookings.length ? (
            <div className={styles.stackList}>
              {todaysBookings.map((booking) => (
                <article key={booking.id} className={styles.miniCard}>
                  <div className={styles.miniCardTop}>
                    <div>
                      <strong className={styles.miniCardTitle}>{booking.seva?.name || "Seva"}</strong>
                      <span className={styles.metaText}>{booking.bhakta_profile?.name || "Bhakta"}</span>
                    </div>
                    <span className={styles.datePill}>{booking.payment_status || "Pending"}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No sevas are booked for today.</div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.sectionEyebrow}>Navigation</span>
            <h2 className={styles.panelTitle}>Open a focused page</h2>
          </div>
          <div className={styles.actionsGrid}>
            {getMenuItems(role).filter((item) => item !== "overview").map((item) => {
              const meta = sectionMeta[item];
              const Icon = meta.icon;
              return (
                <NavLink key={item} to={`/${lang}/${role}/${item}`} className={styles.actionCard}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{meta.label}</span>
                </NavLink>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
