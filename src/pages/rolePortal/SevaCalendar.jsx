import { useMemo, useState } from "react";
import { CalendarCheck, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, groupBookings } from "./rolePortalConfig";
import { Skeleton } from "./ui";
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

// Collapsible month view. Picking a day hands it back to the page so the table below can show it.
export default function SevaCalendar({ bookings, loaded, selected, onSelect }) {
  const [open, setOpen] = useState(true);
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
  const monthLabel = currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

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
    <section className={styles.panel}>
      <button
        type="button"
        className={styles.collapseHead}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="seva-calendar-body"
      >
        <CalendarCheck size={16} aria-hidden="true" />
        <span className={styles.panelTitle}>
          Calendar
          <span className={styles.panelMeta}>
            {monthLabel}
            {loaded ? ` · ${monthTotal} ${monthTotal === 1 ? "booking" : "bookings"}` : ""}
          </span>
        </span>
        <ChevronDown size={16} className={cx(styles.collapseChevron, open && styles.collapseChevronOpen)} aria-hidden="true" />
      </button>

      {open ? (
        <div id="seva-calendar-body" className={styles.collapseBody}>
          <div className={styles.calToolbar}>
            <h2 className={styles.calMonth} aria-live="polite">
              {monthLabel}
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
                const groups = sevaGroups(list);
                const label = `${date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}: ${count ? `${count} ${count === 1 ? "booking" : "bookings"}` : "no bookings"}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className={cx(
                      styles.calDay,
                      outside && styles.calDayOutside,
                      key === today && styles.calToday,
                      key < today && styles.calDayPast,
                      key === selected && styles.calDaySelected
                    )}
                    role="gridcell"
                    aria-label={label}
                    aria-selected={key === selected}
                    onClick={() => onSelect(key)}
                  >
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
                  </button>
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
              Booked seva · pick a day to list it below
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
