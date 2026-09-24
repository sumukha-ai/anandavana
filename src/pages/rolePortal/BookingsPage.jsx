import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowDown, ArrowUp, CalendarDays, Download, IndianRupee, ListFilter, Trophy, X } from "lucide-react";
import {
  downloadCsv,
  formatAmount,
  isPaidStatus,
  money,
  relativeDay,
  sectionMeta,
  shortDate,
  statusTone,
} from "./rolePortalConfig";
import { EmptyState, Kpis, Page, PageHeader, Panel, PaymentBadge, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

function buildSevaSummary(bookings) {
  return Object.values(
    bookings.reduce((summary, booking) => {
      const key = booking.seva?.id || booking.seva?.name || "unknown";
      if (!summary[key]) {
        summary[key] = { id: key, name: booking.seva?.name || "Seva", count: 0, amount: Number(booking.seva?.amount || 0), expected: 0, paid: 0 };
      }
      const amount = Number(booking.seva?.amount || 0);
      summary[key].count += 1;
      summary[key].expected += amount;
      if (isPaidStatus(booking.payment_status)) summary[key].paid += amount;
      return summary;
    }, {})
  ).sort((a, b) => b.count - a.count);
}

export default function BookingsPage({ bookings, loaded, lang, role, filters, onFilterChange, onClearFilters }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      success: bookings.filter((booking) => statusTone(booking.payment_status) === "success").length,
      warning: bookings.filter((booking) => statusTone(booking.payment_status) === "warning").length,
      danger: bookings.filter((booking) => statusTone(booking.payment_status) === "danger").length,
    }),
    [bookings]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bookings
      .filter((booking) => status === "all" || statusTone(booking.payment_status) === status)
      .filter((booking) => {
        if (!needle) return true;
        return [booking.seva?.name, booking.bhakta_profile?.name, booking.payment_order_id, booking.bhakta_profile?.phone_number]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      })
      .sort((a, b) => {
        const left = a.seva_date || "9999";
        const right = b.seva_date || "9999";
        return sortAsc ? left.localeCompare(right) : right.localeCompare(left);
      });
  }, [bookings, query, sortAsc, status]);

  const expected = bookings.reduce((sum, booking) => sum + Number(booking.seva?.amount || 0), 0);
  const paid = bookings.reduce((sum, booking) => (isPaidStatus(booking.payment_status) ? sum + Number(booking.seva?.amount || 0) : sum), 0);
  const summary = buildSevaSummary(bookings);
  const top = summary[0];
  const maxCount = Math.max(1, ...summary.map((item) => item.count));
  const hasDateFilter = Boolean(filters.from_date || filters.to_date);
  const isFiltered = hasDateFilter || query || status !== "all";

  const exportCsv = () => {
    downloadCsv(`booked-sevas-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Seva", "Devotee", "Phone", "Seva date", "Amount", "Payment status", "Booking reference", "Payment reference"],
      ...visible.map((booking) => [
        booking.seva?.name,
        booking.bhakta_profile?.name,
        booking.bhakta_profile?.phone_number,
        booking.seva_date || "",
        Number(booking.seva?.amount || 0),
        booking.payment_status || "pending",
        booking.payment_order_id,
        booking.payment_reference,
      ]),
    ]);
  };

  const resetAll = () => {
    setQuery("");
    setStatus("all");
    onClearFilters();
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

      {loaded ? (
        <Kpis
          items={[
            { label: "Bookings", value: bookings.length, sub: hasDateFilter ? "In the selected dates" : "All loaded bookings", icon: CalendarDays },
            { label: "Expected", value: money(expected), sub: "At current seva amounts", icon: IndianRupee },
            {
              label: "Received",
              value: money(paid),
              sub: counts.warning ? `${counts.warning} awaiting payment` : "Nothing outstanding",
              warn: counts.warning > 0,
              icon: IndianRupee,
            },
            { label: "Most booked", value: top?.name || "None yet", text: true, sub: top ? `${top.count} ${top.count === 1 ? "booking" : "bookings"}` : "No bookings in range", icon: Trophy },
          ]}
        />
      ) : null}

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search seva, devotee or reference" />
          <div className={styles.dateRange}>
            <input className={styles.input} type="date" name="from_date" value={filters.from_date} data-empty={!filters.from_date} onChange={onFilterChange} aria-label="From date" max={filters.to_date || undefined} />
            <span>to</span>
            <input className={styles.input} type="date" name="to_date" value={filters.to_date} data-empty={!filters.to_date} onChange={onFilterChange} aria-label="To date" min={filters.from_date || undefined} />
          </div>
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Payment status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "success", label: "Paid", count: counts.success },
                { value: "warning", label: "Pending", count: counts.warning },
                { value: "danger", label: "Failed", count: counts.danger },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={7} columns={[30, 18, 14, 10, 10, 14]} />
        ) : visible.length ? (
          <>
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Seva</th>
                    <th>Devotee</th>
                    <th aria-sort={sortAsc ? "ascending" : "descending"}>
                      <button type="button" className={styles.thButton} onClick={() => setSortAsc((value) => !value)}>
                        Seva date
                        {sortAsc ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />}
                      </button>
                    </th>
                    <th className={styles.num}>Amount</th>
                    <th>Payment</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong className={styles.cellMain}>{booking.seva?.name || "Seva"}</strong>
                      </td>
                      <td data-label="For">
                        <div className={styles.cellStack}>
                          <span className={styles.cellPrimary}>{booking.bhakta_profile?.name || "—"}</span>
                          {booking.bhakta_profile?.phone_number ? <span>{booking.bhakta_profile.phone_number}</span> : null}
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Date">
                        {booking.seva_date ? (
                          <NavLink to={`/${lang}/${role}/calendar/${booking.seva_date}`} className={styles.cellStack}>
                            <span className={styles.cellPrimary}>{shortDate(booking.seva_date, { day: "numeric", month: "short", year: "numeric" })}</span>
                            {relativeDay(booking.seva_date) ? <span>{relativeDay(booking.seva_date)}</span> : null}
                          </NavLink>
                        ) : (
                          <span className={styles.muted}>Unscheduled</span>
                        )}
                      </td>
                      <td className={cx(styles.num, styles.nowrap)} data-label="Amount">{formatAmount(booking.seva?.amount)}</td>
                      <td data-label="Payment">
                        <PaymentBadge status={booking.payment_status} />
                      </td>
                      <td data-label="Ref">
                        <span className={styles.mono}>{booking.payment_order_id || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFoot}>
              <span>
                Showing {visible.length} of {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
              </span>
              {isFiltered ? (
                <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={resetAll}>
                  <X size={13} aria-hidden="true" />
                  Clear filters
                </button>
              ) : null}
            </div>
          </>
        ) : isFiltered ? (
          <EmptyState
            icon={ListFilter}
            title="No bookings match these filters"
            text="Try a wider date range, another payment status or a shorter search."
            action={
              <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={resetAll}>
                Clear filters
              </button>
            }
          />
        ) : (
          <EmptyState icon={CalendarDays} title="No bookings yet" text="When devotees book sevas online, each booking appears here with its payment status." />
        )}
      </Panel>

      <Panel title="By seva" meta={loaded ? `${summary.length} ${summary.length === 1 ? "seva" : "sevas"}` : null}>
        {!loaded ? (
          <SkeletonRows rows={4} columns={[30, 30, 12, 12]} />
        ) : summary.length ? (
          <div className={styles.tableWrap}>
            <table className={cx(styles.table, styles.tableStack)}>
              <thead>
                <tr>
                  <th>Seva</th>
                  <th className={styles.colShare}>Bookings</th>
                  <th className={styles.num}>Each</th>
                  <th className={styles.num}>Expected</th>
                  <th className={styles.num}>Received</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong className={styles.cellMain}>{item.name}</strong>
                    </td>
                    <td data-label="Bookings">
                      <div className={styles.cellRow}>
                        <span className={styles.countCell}>{item.count}</span>
                        <span className={styles.shareBar} aria-hidden="true">
                          <span style={{ width: `${(item.count / maxCount) * 100}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className={cx(styles.num, styles.nowrap)} data-label="Each">{formatAmount(item.amount)}</td>
                    <td className={cx(styles.num, styles.nowrap)} data-label="Expected">{money(item.expected)}</td>
                    <td className={cx(styles.num, styles.nowrap)} data-label="Received">{money(item.paid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState compact icon={IndianRupee} title="No income to show" text="Income per seva appears once there are bookings in this range." />
        )}
      </Panel>
    </Page>
  );
}
