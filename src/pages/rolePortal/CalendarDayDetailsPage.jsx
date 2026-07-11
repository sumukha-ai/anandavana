import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./RolePortal.module.css";

function lookupName(item, lang) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return lang === "kn" ? item.name_kn || item.name : item.name || item.name_kn;
}

function Field({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={styles.detailItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function CalendarDayDetailsPage({ bookings, date, lang, role }) {
  const dayBookings = bookings.filter((booking) => booking.seva_date === date);

  return (
    <div className={styles.stackList}>
      <section className={styles.panel}>
        <div className={styles.panelHeaderSplit}>
          <div>
            <span className={styles.sectionEyebrow}>Seva day details</span>
            <h2 className={styles.panelTitle}>{date}</h2>
          </div>
          <NavLink to={`/${lang}/${role}/calendar`} className={styles.secondaryButton}>
            <ArrowLeft size={17} aria-hidden="true" />
            Calendar
          </NavLink>
        </div>
        <div className={styles.grid3}>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Bookings</span>
            <strong className={styles.metricValue}>{dayBookings.length}</strong>
            <span className={styles.helperText}>For this date</span>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Sevas</span>
            <strong className={styles.metricValue}>{new Set(dayBookings.map((booking) => booking.seva?.id)).size}</strong>
            <span className={styles.helperText}>Unique seva types</span>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Expected amount</span>
            <strong className={styles.metricValue}>
              INR {dayBookings.reduce((sum, booking) => sum + Number(booking.seva?.amount || 0), 0).toLocaleString("en-IN")}
            </strong>
            <span className={styles.helperText}>Based on seva amounts</span>
          </article>
        </div>
      </section>

      {dayBookings.length ? (
        dayBookings.map((booking) => {
          const profile = booking.bhakta_profile || {};
          return (
            <article key={booking.id} className={styles.bookingDetailCard}>
              <div className={styles.bookingHeader}>
                <div>
                  <strong className={styles.miniCardTitle}>{booking.seva?.name || "Seva"}</strong>
                  <span className={styles.metaText}>
                    Booked for {profile.name || "Bhakta"} {profile.is_self ? "(Self)" : "(Family member)"}
                  </span>
                </div>
                <span className={styles.statusPill}>{booking.payment_status || "Pending"}</span>
              </div>

              <div className={styles.detailGrid}>
                <Field label="Bhakta name" value={profile.name} />
                <Field label="Phone" value={profile.phone_number} />
                <Field label="Email" value={profile.email} />
                <Field label="Rashi" value={lookupName(profile.rashi, lang)} />
                <Field label="Nakshatra" value={lookupName(profile.nakshatra, lang)} />
                <Field label="Gotra" value={lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra} />
                <Field label="Charana" value={profile.charana} />
                <Field label="Profile type" value={profile.is_self ? "Self" : "Family member"} />
                <Field label="Amount" value={booking.seva?.amount ? `INR ${booking.seva.amount}` : "Offline"} />
                <Field label="Order ID" value={booking.payment_order_id} />
                <Field label="Payment ref" value={booking.payment_reference} />
              </div>

              {profile.address ? (
                <div className={styles.addressBlock}>
                  <span>Address</span>
                  <p>{profile.address}</p>
                </div>
              ) : null}
            </article>
          );
        })
      ) : (
        <section className={styles.panel}>
          <div className={styles.emptyState}>No bookings found for this date.</div>
        </section>
      )}
    </div>
  );
}
