import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  ImageOff,
  IndianRupee,
  Languages,
  Plus,
  Sunrise,
  ToggleLeft,
  Users,
} from "lucide-react";
import {
  dateKey,
  displayLookup,
  formatAmount,
  isPaidStatus,
  money,
  parseDateKey,
  relativeDay,
  roleCopy,
  sectionPath,
  shortDate,
} from "./rolePortalConfig";
import { Avatar, EmptyState, Kpis, Page, PageHeader, Panel, PaymentBadge, Skeleton, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function nextDays(count) {
  const start = new Date();
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return { key: dateKey(day), date: day };
  });
}

// Bars grow in once per session, not on every visit to the overview
let chartIntroPlayed = false;

function LoadChart({ bookings, lang, role }) {
  const [intro] = useState(() => !chartIntroPlayed);
  useEffect(() => {
    chartIntroPlayed = true;
  }, []);
  const days = nextDays(14);
  const counts = days.map(({ key }) => bookings.filter((booking) => booking.seva_date === key).length);
  const max = Math.max(1, ...counts);
  const total = counts.reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.chart}>
      <div className={styles.chartBars} role="list" aria-label="Bookings per day for the next 14 days">
        <span className={styles.chartGrid} aria-hidden="true" />
        {days.map(({ key, date }, index) => {
          const count = counts[index];
          const label = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(date);
          const bar = (
            <>
              <span
                className={cx(styles.bar, count === 0 && styles.barEmpty, index === 0 && count > 0 && styles.barToday, intro && styles.barIntro)}
                style={{ height: count ? `${(count / max) * 100}%` : 2, animationDelay: intro ? `${index * 12}ms` : undefined }}
              />
              <span className={styles.barTip} role="tooltip">
                <strong>{count} {count === 1 ? "booking" : "bookings"}</strong>
                {index === 0 ? "Today" : label}
              </span>
            </>
          );
          return count ? (
            <NavLink
              key={key}
              to={`/${lang}/${role}/calendar/${key}`}
              className={styles.barSlot}
              role="listitem"
              aria-label={`${label}: ${count} ${count === 1 ? "booking" : "bookings"}`}
            >
              {bar}
            </NavLink>
          ) : (
            <span key={key} className={styles.barSlot} role="listitem" tabIndex={0} aria-label={`${label}: no bookings`}>
              {bar}
            </span>
          );
        })}
      </div>
      <div className={styles.chartAxis} aria-hidden="true">
        {days.map(({ key, date }, index) => (
          <span key={key} className={index === 0 ? styles.chartAxisToday : undefined}>
            {index === 0 ? "Today" : index % 2 === 0 ? date.getDate() : ""}
          </span>
        ))}
      </div>
      <span className={styles.hint}>
        {total ? `${total} ${total === 1 ? "seva" : "sevas"} booked over the next two weeks.` : "Nothing booked over the next two weeks yet."}
      </span>
    </div>
  );
}

export default function OverviewPage({ role, lang, user, loaded, bookings, sevas, users, lookups, canSeeUsers }) {
  const today = dateKey();
  const todayDate = parseDateKey(today);
  const weekEnd = dateKey(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6));
  const todaysBookings = bookings.filter((booking) => booking.seva_date === today);
  const weekBookings = bookings.filter((booking) => booking.seva_date && booking.seva_date >= today && booking.seva_date <= weekEnd);
  const pending = bookings.filter((booking) => !isPaidStatus(booking.payment_status));
  const pendingAmount = pending.reduce((sum, booking) => sum + Number(booking.seva?.amount || 0), 0);
  const paidIncome = bookings.reduce((sum, booking) => (isPaidStatus(booking.payment_status) ? sum + Number(booking.seva?.amount || 0) : sum), 0);
  const enabledSevas = sevas.filter((seva) => seva.enabled).length;
  const recent = [...bookings]
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")) || Number(b.id) - Number(a.id))
    .slice(0, 6);
  const missingKannada = sevas.filter((seva) => !seva.name_kn);
  const missingImage = sevas.filter((seva) => !seva.photo_url);
  const disabled = sevas.filter((seva) => !seva.enabled);
  const name = user?.username ? user.username.split(/[\s._@]/)[0] : "";
  const isAdmin = role === "admin";

  const kpis = [
    { label: "Today's sevas", value: todaysBookings.length, sub: todaysBookings.length ? "Scheduled for today" : "None scheduled today", icon: Sunrise },
    { label: "Next 7 days", value: weekBookings.length, sub: `Through ${shortDate(weekEnd)}`, icon: CalendarClock },
    {
      label: "Awaiting payment",
      value: pending.length,
      sub: pending.length ? `${money(pendingAmount)} outstanding` : "Everything is paid",
      warn: pending.length > 0,
      icon: IndianRupee,
    },
    { label: "Paid income", value: money(paidIncome), sub: `Across ${bookings.length} loaded bookings`, icon: IndianRupee },
  ];
  if (canSeeUsers) {
    kpis.push({ label: "Accounts", value: users.length, sub: `${users.filter((account) => account.is_verified).length} verified`, icon: Users });
  } else {
    kpis.push({ label: "Sevas offered", value: enabledSevas, sub: `${sevas.length} in the catalog`, icon: ClipboardList });
  }

  const health = [
    missingKannada.length && {
      key: "kn",
      icon: Languages,
      title: `${missingKannada.length} ${missingKannada.length === 1 ? "seva needs" : "sevas need"} a Kannada name`,
      text: missingKannada.slice(0, 3).map((seva) => seva.name).join(", "),
    },
    missingImage.length && {
      key: "img",
      icon: ImageOff,
      title: `${missingImage.length} ${missingImage.length === 1 ? "seva has" : "sevas have"} no image`,
      text: "Devotees see a kshetra photo in its place",
    },
    disabled.length && {
      key: "off",
      icon: ToggleLeft,
      title: `${disabled.length} ${disabled.length === 1 ? "seva is" : "sevas are"} turned off`,
      text: "Hidden from online booking",
    },
  ].filter(Boolean);

  return (
    <Page>
      <PageHeader
        title={name ? `${greeting()}, ${name}` : roleCopy[role].title}
        description={[
          new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()),
          loaded ? `${todaysBookings.length} ${todaysBookings.length === 1 ? "seva" : "sevas"} today` : null,
          loaded && pending.length ? `${money(pendingAmount)} awaiting payment` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
        actions={
          <>
            <NavLink to={sectionPath(lang, role, "calendar")} className={cx(styles.btn, styles.btnSecondary)}>
              <CalendarCheck size={15} aria-hidden="true" />
              Open calendar
            </NavLink>
            {isAdmin ? (
              <NavLink to={sectionPath(lang, role, "seva-editor")} className={cx(styles.btn, styles.btnPrimary)}>
                <Plus size={15} aria-hidden="true" />
                Add seva
              </NavLink>
            ) : null}
          </>
        }
      />

      {loaded ? (
        <Kpis items={kpis} />
      ) : (
        <div className={styles.kpis}>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className={styles.kpi}>
              <Skeleton width="55%" height={10} />
              <Skeleton width="40%" height={22} style={{ margin: "0.35rem 0" }} />
              <Skeleton width="70%" height={9} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.split}>
        <Panel
          title="Today's sevas"
          meta={loaded ? todaysBookings.length : null}
          action={
            <NavLink to={`/${lang}/${role}/calendar/${today}`} className={styles.panelLink}>
              Day sheet <ArrowRight size={13} aria-hidden="true" />
            </NavLink>
          }
        >
          {!loaded ? (
            <SkeletonRows rows={4} columns={[45, 20, 14]} />
          ) : todaysBookings.length ? (
            <div className={styles.list}>
              {todaysBookings.map((booking) => (
                <NavLink key={booking.id} to={`/${lang}/${role}/calendar/${today}`} className={styles.listItem}>
                  <Avatar name={booking.bhakta_profile?.name} small />
                  <span className={styles.listText}>
                    <strong>{booking.seva?.name || "Seva"}</strong>
                    <span>
                      For {booking.bhakta_profile?.name || "a devotee"}
                      {booking.bhakta_profile?.nakshatra ? ` · ${displayLookup(booking.bhakta_profile.nakshatra, lang)}` : ""}
                    </span>
                  </span>
                  <span className={styles.listEnd}>
                    <PaymentBadge status={booking.payment_status} />
                    <ChevronRight size={15} className={styles.chev} aria-hidden="true" />
                  </span>
                </NavLink>
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={Sunrise}
              title="No sevas today"
              text="When a devotee books a seva for today it will appear here, with who it is for."
            />
          )}
        </Panel>

        <Panel title="Next 14 days" action={<span className={styles.panelMeta}>Bookings per day</span>}>
          {loaded ? <LoadChart bookings={bookings} lang={lang} role={role} /> : <div className={styles.chart}><Skeleton height={150} /></div>}
        </Panel>
      </div>

      <div className={styles.split}>
        <Panel
          title="Recent bookings"
          action={
            <NavLink to={sectionPath(lang, role, "bookings")} className={styles.panelLink}>
              All bookings <ArrowRight size={13} aria-hidden="true" />
            </NavLink>
          }
        >
          {!loaded ? (
            <SkeletonRows rows={5} />
          ) : recent.length ? (
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Seva</th>
                    <th>Date</th>
                    <th className={styles.num}>Amount</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className={styles.cellStack}>
                          <strong className={styles.cellMain}>{booking.seva?.name || "Seva"}</strong>
                          <span>{booking.bhakta_profile?.name || "Devotee"}</span>
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Date">
                        {booking.seva_date ? (
                          <div className={styles.cellStack}>
                            <span className={styles.cellPrimary}>{shortDate(booking.seva_date)}</span>
                            {relativeDay(booking.seva_date) ? <span>{relativeDay(booking.seva_date)}</span> : null}
                          </div>
                        ) : (
                          <span className={styles.muted}>Unscheduled</span>
                        )}
                      </td>
                      <td className={cx(styles.num, styles.nowrap)} data-label="Amount">{formatAmount(booking.seva?.amount)}</td>
                      <td data-label="Payment">
                        <PaymentBadge status={booking.payment_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState compact icon={CalendarCheck} title="No bookings yet" text="Online seva bookings will show here as devotees make them." />
          )}
        </Panel>

        <Panel
          title="Catalog"
          meta={loaded ? `${enabledSevas} of ${sevas.length} open for booking` : null}
          action={
            <NavLink to={sectionPath(lang, role, "sevas")} className={styles.panelLink}>
              Open <ArrowRight size={13} aria-hidden="true" />
            </NavLink>
          }
        >
          {!loaded ? (
            <SkeletonRows rows={3} columns={[60, 12]} />
          ) : health.length ? (
            <div className={styles.list}>
              {health.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.key} to={sectionPath(lang, role, "sevas")} className={styles.listItem}>
                    <span className={styles.listIcon}>
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className={styles.listText}>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </span>
                    <ChevronRight size={15} className={styles.chev} aria-hidden="true" />
                  </NavLink>
                );
              })}
              <div className={styles.listItem}>
                <span className={styles.listIcon}>
                  <Languages size={15} aria-hidden="true" />
                </span>
                <span className={styles.listText}>
                  <strong>{lookups.rashis.length} rashis · {lookups.nakshatras.length} nakshatras</strong>
                  <span>Jyotisha references for devotee profiles</span>
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              compact
              icon={ClipboardList}
              title="The catalog is complete"
              text="Every seva has a Kannada name and an image, and all are open for booking."
            />
          )}
        </Panel>
      </div>
    </Page>
  );
}
