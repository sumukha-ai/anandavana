import styles from "./RolePortal.module.css";

function money(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

function isPaidStatus(status) {
  return ["paid", "success", "completed", "captured"].includes(String(status || "").toLowerCase());
}

function buildSevaSummary(bookings) {
  return Object.values(bookings.reduce((summary, booking) => {
    const key = booking.seva?.id || booking.seva?.name || "unknown";
    if (!summary[key]) {
      summary[key] = {
        id: key,
        name: booking.seva?.name || "Seva",
        count: 0,
        amount: Number(booking.seva?.amount || 0),
        expected: 0,
        paid: 0,
      };
    }
    const amount = Number(booking.seva?.amount || 0);
    summary[key].count += 1;
    summary[key].expected += amount;
    if (isPaidStatus(booking.payment_status)) {
      summary[key].paid += amount;
    }
    return summary;
  }, {})).sort((a, b) => b.count - a.count);
}

export default function BookingsPage({ bookings, filters, onFilterChange }) {
  const expectedIncome = bookings.reduce((sum, booking) => sum + Number(booking.seva?.amount || 0), 0);
  const paidIncome = bookings.reduce((sum, booking) => {
    if (!isPaidStatus(booking.payment_status)) return sum;
    return sum + Number(booking.seva?.amount || 0);
  }, 0);
  const pendingCount = bookings.filter((booking) => !isPaidStatus(booking.payment_status)).length;
  const sevaSummary = buildSevaSummary(bookings);
  const topSeva = sevaSummary[0];

  return (
    <div className={styles.stackList}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.sectionEyebrow}>Samsthaana overview</span>
          <h2 className={styles.panelTitle}>Booked sevas dashboard</h2>
        </div>
        <div className={styles.grid4}>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Total bookings</span>
            <strong className={styles.metricValue}>{bookings.length}</strong>
            <span className={styles.helperText}>Current filter range</span>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Expected income</span>
            <strong className={styles.metricValue}>{money(expectedIncome)}</strong>
            <span className={styles.helperText}>All visible bookings</span>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Paid income</span>
            <strong className={styles.metricValue}>{money(paidIncome)}</strong>
            <span className={styles.helperText}>{pendingCount} pending booking{pendingCount === 1 ? "" : "s"}</span>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.cardLabel}>Most booked seva</span>
            <strong className={styles.metricValue}>{topSeva?.count || 0}</strong>
            <span className={styles.helperText}>{topSeva?.name || "No seva yet"}</span>
          </article>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.sectionEyebrow}>Seva-wise income</span>
          <h2 className={styles.panelTitle}>Which seva is booked and how much</h2>
        </div>
        {sevaSummary.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Seva</th>
                  <th>Bookings</th>
                  <th>Amount each</th>
                  <th>Expected</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {sevaSummary.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.tableStrong}>{item.name}</td>
                    <td>{item.count}</td>
                    <td>{money(item.amount)}</td>
                    <td>{money(item.expected)}</td>
                    <td>{money(item.paid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>No seva income data for this view.</div>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.sectionEyebrow}>Operations</span>
          <h2 className={styles.panelTitle}>Booked sevas</h2>
        </div>
        <div className={styles.inlineFilters}>
          <label className={styles.field}>
            <span>From</span>
            <input type="date" name="from_date" value={filters.from_date} onChange={onFilterChange} />
          </label>
          <label className={styles.field}>
            <span>To</span>
            <input type="date" name="to_date" value={filters.to_date} onChange={onFilterChange} />
          </label>
        </div>
        {bookings.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Seva</th>
                  <th>For</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Order</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className={styles.tableStrong}>{booking.seva?.name}</td>
                    <td>{booking.bhakta_profile?.name}</td>
                    <td>{booking.seva_date}</td>
                    <td>{money(booking.seva?.amount)}</td>
                    <td><span className={styles.statusPill}>{booking.payment_status || "Pending"}</span></td>
                    <td>{booking.payment_order_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>No bookings match this view.</div>
        )}
      </section>
    </div>
  );
}
