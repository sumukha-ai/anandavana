import { Fragment, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, ChevronDown, Download, FileText, MapPin } from "lucide-react";
import { dateKey, displayLookup, downloadCsv, parseDateKey, relativeDay, sectionMeta, shortDate, statusTone } from "./rolePortalConfig";
import { EmptyState, Page, PageHeader, Panel, Segmented, SkeletonRows } from "./ui";
import SevaCalendar from "./SevaCalendar";
import { PersonLink, ReceiptButton } from "./Links";
import { bhaktaIdOf } from "./receiptContext";
import { cx } from "./cx";
import styles from "./Console.module.css";

const WEEK_DAYS = 7;

function addDays(key, amount) {
  const date = parseDateKey(key);
  return dateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount));
}

function jyotisha(profile, lang) {
  return {
    rashi: displayLookup(profile.rashi, lang),
    nakshatra: displayLookup(profile.nakshatra, lang),
    gotra: lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra,
    charana: profile.charana,
  };
}

function groupBySeva(bookings) {
  const groups = bookings.reduce((acc, booking) => {
    const name = booking.seva?.name || "Seva";
    if (!acc[name]) acc[name] = { name, items: [] };
    acc[name].items.push(booking);
    return acc;
  }, {});
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}

function SevaGroup({ group, lang, role, showDate }) {
  const [open, setOpen] = useState(true);
  const [addressOpen, setAddressOpen] = useState(() => new Set());
  const columns = showDate ? 9 : 8;
  const bodyId = `seva-group-${group.name.replace(/\W+/g, "-")}`;

  const toggleAddress = (id) =>
    setAddressOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={styles.sevaGroup}>
      <button type="button" className={styles.collapseHead} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={bodyId}>
        <ChevronDown size={16} className={cx(styles.collapseChevron, open && styles.collapseChevronOpen)} aria-hidden="true" />
        <span className={styles.panelTitle}>{group.name}</span>
        <span className={styles.groupCount}>
          {group.items.length}
          <span>booked</span>
        </span>
      </button>
      {open ? (
        <div id={bodyId} className={styles.tableWrap}>
          <table className={cx(styles.table, styles.tableStack)}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                {showDate ? <th>Date</th> : null}
                <th>Rashi</th>
                <th>Nakshatra</th>
                <th>Gotra</th>
                <th>Charana</th>
                <th>
                  <span className={styles.srOnly}>Address</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((booking) => {
                const profile = booking.bhakta_profile || {};
                const details = jyotisha(profile, lang);
                const showAddress = addressOpen.has(booking.id);
                const addressId = `address-${booking.id}`;
                return (
                  <Fragment key={booking.id}>
                    <tr className={cx(showAddress && styles.rowExpanded)}>
                      <td>
                        <strong className={styles.cellMain}>
                          <PersonLink lang={lang} role={role} bhaktaId={bhaktaIdOf(booking)}>
                            {profile.name || "Devotee"}
                          </PersonLink>
                        </strong>
                      </td>
                      <td className={styles.nowrap} data-label="Phone">
                        {profile.phone_number ? <a href={`tel:${profile.phone_number}`}>{profile.phone_number}</a> : "—"}
                      </td>
                      {showDate ? (
                        <td className={styles.nowrap} data-label="Date">
                          {shortDate(booking.seva_date, { weekday: "short", day: "numeric", month: "short" })}
                        </td>
                      ) : null}
                      <td data-label="Rashi">{details.rashi || "—"}</td>
                      <td data-label="Nakshatra">{details.nakshatra || "—"}</td>
                      <td data-label="Gotra">{details.gotra || "—"}</td>
                      <td data-label="Charana">{details.charana || "—"}</td>
                      <td className={cx(styles.num, styles.nowrap)}>
                        <ReceiptButton booking={booking} />
                        <button type="button" className={styles.addressToggle} onClick={() => toggleAddress(booking.id)} aria-expanded={showAddress} aria-controls={addressId}>
                          <MapPin size={13} aria-hidden="true" />
                          {showAddress ? "Hide address" : "View address"}
                        </button>
                      </td>
                    </tr>
                    {showAddress ? (
                      <tr id={addressId} className={styles.addressRow}>
                        <td colSpan={columns}>
                          <span className={styles.addressLabel}>Address</span>
                          <p className={styles.addressText}>{profile.address || "No address on file for this devotee."}</p>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default function BookingsPage({ bookings, loaded, lang, role }) {
  const today = dateKey();
  const [range, setRange] = useState("today");
  const [custom, setCustom] = useState({ from: today, to: today });

  // Today, tomorrow, the next seven days, or a custom from–to range (a calendar click is a one-day range)
  const [from, to] = useMemo(() => {
    if (range === "tomorrow") return [addDays(today, 1), addDays(today, 1)];
    if (range === "week") return [today, addDays(today, WEEK_DAYS - 1)];
    if (range === "custom") return [custom.from, custom.to];
    return [today, today];
  }, [custom.from, custom.to, range, today]);
  const singleDay = from === to;

  // Failed or cancelled payments are not sevas to perform
  const scheduled = useMemo(() => bookings.filter((booking) => statusTone(booking.payment_status) !== "danger"), [bookings]);

  const visible = useMemo(
    () =>
      scheduled
        .filter((booking) => booking.seva_date && booking.seva_date >= from && booking.seva_date <= to)
        .sort((a, b) => a.seva_date.localeCompare(b.seva_date) || String(a.bhakta_profile?.name || "").localeCompare(String(b.bhakta_profile?.name || ""))),
    [from, scheduled, to],
  );
  const groups = useMemo(() => groupBySeva(visible), [visible]);

  const selectDay = (key) => {
    if (key === today) setRange("today");
    else if (key === addDays(today, 1)) setRange("tomorrow");
    else setRange("custom");
    setCustom({ from: key, to: key });
  };

  // Editing either end starts from the range on screen; the other end moves if they would cross
  const changeRange = (event) => {
    const { name, value } = event.target;
    if (!value) return;
    const next = { from, to, [name]: value };
    if (next.from > next.to) {
      if (name === "from") next.to = value;
      else next.from = value;
    }
    setRange("custom");
    setCustom(next);
  };

  const rangeTitle = singleDay
    ? `${relativeDay(from) ? `${relativeDay(from)} · ` : ""}${shortDate(from, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
    : `${shortDate(from, { day: "numeric", month: "short" })} – ${shortDate(to, { day: "numeric", month: "short", year: "numeric" })}`;

  const exportCsv = () => {
    downloadCsv(`booked-sevas-${from}${singleDay ? "" : `-to-${to}`}.csv`, [
      ["Seva", "Name", "Phone", "Seva date", "Rashi", "Nakshatra", "Gotra", "Charana", "Address"],
      ...groups.flatMap((group) =>
        group.items.map((booking) => {
          const details = jyotisha(booking.bhakta_profile || {}, lang);
          const profile = booking.bhakta_profile || {};
          return [group.name, profile.name, profile.phone_number, booking.seva_date, details.rashi, details.nakshatra, details.gotra, details.charana, profile.address];
        }),
      ),
    ]);
  };

  return (
    <Page>
      <PageHeader
        title={sectionMeta.bookings.label}
        description={sectionMeta.bookings.text}
        actions={
          <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={exportCsv} disabled={!visible.length}>
            <Download size={15} aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      <SevaCalendar bookings={scheduled} loaded={loaded} selected={singleDay ? from : null} onSelect={selectDay} />

      <Panel>
        <div className={styles.toolbar}>
          <h2 className={styles.panelTitle}>
            {rangeTitle}
            {loaded ? (
              <span className={styles.panelMeta}>
                {visible.length} {visible.length === 1 ? "booking" : "bookings"}
              </span>
            ) : null}
          </h2>
          <div className={styles.toolbarEnd}>
            {singleDay ? (
              <NavLink to={`/${lang}/${role}/calendar/${from}`} className={cx(styles.btn, styles.btnGhost, styles.btnSm)}>
                <FileText size={14} aria-hidden="true" />
                Day sheet
              </NavLink>
            ) : null}
            <div className={styles.dateRange}>
              <input className={styles.input} type="date" name="from" value={from} onChange={changeRange} aria-label="From date" />
              <span>to</span>
              <input className={styles.input} type="date" name="to" value={to} onChange={changeRange} aria-label="To date" />
            </div>
            <Segmented
              label="Days"
              value={range}
              onChange={setRange}
              options={[
                { value: "today", label: "Today" },
                { value: "tomorrow", label: "Tomorrow" },
                { value: "week", label: "Week" },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={6} columns={[30, 16, 16, 16, 10]} />
        ) : groups.length ? (
          groups.map((group) => <SevaGroup key={group.name} group={group} lang={lang} role={role} showDate={!singleDay} />)
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={singleDay ? "No sevas booked for this day" : range === "week" ? "No sevas booked in the next 7 days" : "No sevas booked in these dates"}
            text="Pick another day on the calendar, change the dates, or switch between Today, Tomorrow and Week."
          />
        )}
      </Panel>
    </Page>
  );
}
