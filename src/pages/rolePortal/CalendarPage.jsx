import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { groupBookings } from "./rolePortalConfig";
import styles from "./CalendarPage.module.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthLabel(date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function buildMonthDays(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < first.getDay(); i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
}

export default function CalendarPage({ bookings, role, lang }) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const groupedBookings = useMemo(() => groupBookings(bookings), [bookings]);
  const days = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);

  const moveMonth = (amount) => {
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <section className={styles.panel}>
      <div className={styles.calendarToolbar}>
        <div className={styles.titleBlock}>
          <span className={styles.sectionEyebrow}>Schedule</span>
          <h2 className={styles.panelTitle}>{monthLabel(currentMonth)}</h2>
        </div>
        <div className={styles.calendarActions}>
          <button type="button" className={styles.iconButton} onClick={() => moveMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button type="button" className={styles.todayButton} onClick={() => setCurrentMonth(new Date())}>
            Today
          </button>
          <button type="button" className={styles.iconButton} onClick={() => moveMonth(1)} aria-label="Next month">
            <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <div className={styles.monthCalendar} role="grid" aria-label="Seva booking calendar">
          {/* Weekday Headers */}
          {weekdays.map((weekday) => (
            <div key={weekday} className={styles.weekdayCell} role="columnheader">
              {weekday}
            </div>
          ))}

          {/* Days Grid */}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className={`${styles.dayCell} ${styles.dayCellMuted}`} />;
            }

            const key = dateKey(day);
            const count = groupedBookings[key]?.length || 0;
            const isToday = key === dateKey(new Date());

            const content = (
              <div className={styles.dayInner}>
                <div className={styles.dayTop}>
                  <span className={`${styles.dayNumber} ${isToday ? styles.todayNumber : ""}`}>
                    {day.getDate()}
                  </span>
                </div>
                <div className={styles.dayBottom}>
                  {count > 0 ? (
                    <div className={styles.bookingBadge}>
                      <strong className={styles.bookingCount}>{count}</strong>
                      <span className={styles.bookingLabel}>{count === 1 ? "booking" : "bookings"}</span>
                    </div>
                  ) : (
                    <div className={styles.emptyBadge}>No bookings</div>
                  )}
                </div>
              </div>
            );

            return count > 0 ? (
              <NavLink
                key={key}
                to={`/${lang}/${role}/calendar/${key}`}
                className={`${styles.dayCell} ${styles.dayCellClickable}`}
                role="gridcell"
              >
                {content}
              </NavLink>
            ) : (
              <div key={key} className={styles.dayCell} role="gridcell">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}