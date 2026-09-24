import { NavLink } from "react-router-dom";
import { CalendarX2, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { dateKey, displayLookup, formatAmount, isPaidStatus, money, parseDateKey, relativeDay, sectionPath } from "./rolePortalConfig";
import { EmptyState, Kpis, Page, PageHeader, Panel, PaymentBadge, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

function Item({ label, value, wide, wideSm }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={cx(styles.dlItem, wide && styles.dlWide, wideSm && styles.dlWideSm)}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function shiftDay(key, amount) {
  const date = parseDateKey(key);
  return dateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount));
}

export default function CalendarDayDetailsPage({ bookings, date, lang, role, loaded }) {
  const dayBookings = bookings.filter((booking) => booking.seva_date === date);
  const parsed = parseDateKey(date);
  const valid = !Number.isNaN(parsed.getTime());
  const title = valid
    ? new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(parsed)
    : "Seva day";
  const bySeva = Object.values(
    dayBookings.reduce((acc, booking) => {
      const key = booking.seva?.id || booking.seva?.name || "seva";
      if (!acc[key]) acc[key] = { key, name: booking.seva?.name || "Seva", amount: booking.seva?.amount, items: [] };
      acc[key].items.push(booking);
      return acc;
    }, {})
  );
  const expected = dayBookings.reduce((sum, booking) => sum + Number(booking.seva?.amount || 0), 0);
  const paid = dayBookings.reduce((sum, booking) => (isPaidStatus(booking.payment_status) ? sum + Number(booking.seva?.amount || 0) : sum), 0);
  const base = `/${lang}/${role}/calendar`;
  let counter = 0;

  return (
    <Page>
      <PageHeader
        back={{ to: sectionPath(lang, role, "calendar"), label: "Seva calendar" }}
        title={title}
        description={relativeDay(date) ? `${relativeDay(date)} · the full sheet for every seva booked on this day.` : "The full sheet for every seva booked on this day."}
        actions={
          valid ? (
            <>
              <NavLink to={`${base}/${shiftDay(date, -1)}`} className={cx(styles.iconButton, styles.iconButtonBordered)} aria-label="Previous day">
                <ChevronLeft size={16} aria-hidden="true" />
              </NavLink>
              <NavLink to={`${base}/${shiftDay(date, 1)}`} className={cx(styles.iconButton, styles.iconButtonBordered)} aria-label="Next day">
                <ChevronRight size={16} aria-hidden="true" />
              </NavLink>
              <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={() => window.print()} disabled={!dayBookings.length}>
                <Printer size={15} aria-hidden="true" />
                Print day sheet
              </button>
            </>
          ) : null
        }
      />

      {loaded ? (
        <Kpis
          items={[
            { label: "Bookings", value: dayBookings.length, sub: "On this day" },
            { label: "Sevas", value: bySeva.length, sub: "Different sevas" },
            { label: "Expected", value: money(expected), sub: "At seva amounts" },
            { label: "Received", value: money(paid), sub: expected > paid ? `${money(expected - paid)} pending` : "Fully paid", warn: expected > paid },
          ]}
        />
      ) : null}

      {!loaded ? (
        <Panel>
          <SkeletonRows rows={4} />
        </Panel>
      ) : dayBookings.length ? (
        bySeva.map((group) => (
          <Panel key={group.key} title={group.name} meta={`${group.items.length} · ${formatAmount(group.amount)} each`}>
            {group.items.map((booking) => {
              counter += 1;
              const profile = booking.bhakta_profile || {};
              return (
                <article key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHead}>
                    <span className={styles.bookingIndex}>{counter}</span>
                    <div className={styles.listText}>
                      <strong>{profile.name || "Devotee"}</strong>
                      <span>{profile.is_self ? "Booked for self" : "Booked for a family member"}</span>
                    </div>
                    <PaymentBadge status={booking.payment_status} />
                  </div>
                  <dl className={styles.dl}>
                    <Item label="Rashi" value={displayLookup(profile.rashi, lang)} />
                    <Item label="Nakshatra" value={displayLookup(profile.nakshatra, lang)} />
                    <Item label="Gotra" value={lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra} />
                    <Item label="Charana" value={profile.charana} />
                    <Item label="Phone" value={profile.phone_number} />
                    <Item label="Email" value={profile.email} wideSm />
                    <Item label="Booking reference" value={booking.payment_order_id} />
                    <Item label="Payment reference" value={booking.payment_reference} />
                    <Item label="Address" value={profile.address} wide />
                  </dl>
                </article>
              );
            })}
          </Panel>
        ))
      ) : (
        <Panel>
          <EmptyState
            icon={CalendarX2}
            title="No sevas booked for this day"
            text="Use the arrows to step through nearby days, or go back to the calendar to pick another date."
            action={
              <NavLink to={sectionPath(lang, role, "calendar")} className={cx(styles.btn, styles.btnSecondary)}>
                Back to calendar
              </NavLink>
            }
          />
        </Panel>
      )}
    </Page>
  );
}
