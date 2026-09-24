import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, groupBookings, sectionMeta } from "./rolePortalConfig";
import { Page, PageHeader, Panel, Skeleton } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthDays(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let i = first.getDay(); i > 0; i -= 1) days.push({ date: new Date(year, month, 1 - i), outside: true });
  for (let day = 1; day <= last.getDate(); day += 1) days.push({ date: new Date(year, month, day), outside: false });
  let next = 1;
  while (days.length % 7 !== 0) {
    days.push({ date: new Date(year, month + 1, next), outside: true });
    next += 1;
  }
  return days;
}

function sevaGroups(bookings) {
  const groups = bookings.reduce((acc, booking) => {
    const name = booking.seva?.name || "Seva";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(groups).sort((a, b) => b[1] - a[1]);
}

export default function CalendarPage({ bookings, loaded, role, lang }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [direction, setDirection] = useState(0);
  const grouped = useMemo(() => groupBookings(bookings), [bookings]);
  const days = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);
  const today = dateKey();
  const monthPrefix = dateKey(currentMonth).slice(0, 7);
  const monthTotal = Object.entries(grouped).reduce((sum, [key, list]) => (key.startsWith(monthPrefix) ? sum + list.length : sum), 0);
  const isCurrentMonth = today.startsWith(monthPrefix);

  const moveMonth = (amount) => {
    setDirection(amount);
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const goToday = () => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), 1);
    setDirection(target > currentMonth ? 1 : -1);
    setCurrentMonth(target);
  };

  return (
    <Page>
      <PageHeader title={sectionMeta.calendar.label} description={sectionMeta.calendar.text} />

      <Panel>
        <div className={styles.calToolbar}>
          <h2 className={styles.calMonth} aria-live="polite">
            {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            {loaded ? (
              <span className={styles.panelMeta}>
                {monthTotal} {monthTotal === 1 ? "booking" : "bookings"}
              </span>
            ) : null}
          </h2>
          <div className={styles.calNav}>
            <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm)} onClick={goToday} disabled={isCurrentMonth}>
              Today
            </button>
            <button type="button" className={cx(styles.iconButton, styles.iconButtonBordered)} onClick={() => moveMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" className={cx(styles.iconButton, styles.iconButtonBordered)} onClick={() => moveMonth(1)} aria-label="Next month">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.calViewport}>
          <div className={styles.calGrid} role="row">
            {weekdays.map((weekday) => (
              <div key={weekday} className={styles.calWeekday} role="columnheader">
                {weekday}
              </div>
            ))}
          </div>
          <div
            key={monthPrefix}
            className={cx(styles.calGrid, direction > 0 && styles.calSlideNext, direction < 0 && styles.calSlidePrev)}
            role="grid"
            aria-label="Seva bookings by day"
          >
            {days.map(({ date, outside }) => {
              const key = dateKey(date);
              const list = grouped[key] || [];
              const count = list.length;
              const classes = cx(styles.calDay, outside && styles.calDayOutside, key === today && styles.calToday, key < today && styles.calDayPast);
              const groups = sevaGroups(list);
              const inner = (
                <>
                  <span className={styles.calNum}>{date.getDate()}</span>
                  {!loaded && !outside && date.getDate() % 5 === 2 ? <Skeleton height={16} /> : null}
                  {groups.slice(0, 2).map(([name, n]) => (
                    <span key={name} className={styles.calEvent} title={`${name}: ${n}`}>
                      <span>{name}</span>
                      {n > 1 ? <strong>×{n}</strong> : null}
                    </span>
                  ))}
                  {groups.length > 2 ? <span className={styles.calMore}>+{groups.length - 2} more</span> : null}
                  {count ? <span className={styles.calDot}>{count}</span> : null}
                </>
              );
              const label = `${date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}: ${count ? `${count} ${count === 1 ? "booking" : "bookings"}` : "no bookings"}`;
              return count ? (
                <NavLink key={key} to={`/${lang}/${role}/calendar/${key}`} className={classes} role="gridcell" aria-label={label}>
                  {inner}
                </NavLink>
              ) : (
                <div key={key} className={classes} role="gridcell" aria-label={outside ? undefined : label}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.calLegend}>
          <span>
            <span className={styles.legendToday} aria-hidden="true" />
            Today
          </span>
          <span>
            <span className={styles.legendSwatch} aria-hidden="true" />
            Booked seva · open the day for the full sheet
          </span>
        </div>
      </Panel>
    </Page>
  );
}
