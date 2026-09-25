import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarDays, HandCoins, HeartHandshake, IndianRupee, ListFilter, Plus, Wallet, X } from "lucide-react";
import { sectionMeta, sectionPath } from "../rolePortalConfig";
import { Badge, EmptyState, Kpis, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "../ui";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "./Finance.module.css";
import { PeriodPicker } from "./FinanceParts";
import { DONATION_CHANNEL_LABELS, inr, longDate, periodLabel, rangeQuery, resolvePeriod } from "./financeUtils";
import { useFinanceQuery } from "./useFinanceQuery";

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "source", label: "Type" },
  { key: "description", label: "Seva or cause" },
  { key: "person", label: "Devotee" },
  { key: "channel", label: "Mode" },
  { key: "amount", label: "Amount", numeric: true },
];

function compare(a, b, key) {
  if (key === "amount") return a.amount - b.amount;
  return String(a[key] || "").localeCompare(String(b[key] || ""), "en", { sensitivity: "base" });
}

export default function FinancePage({ lang, role, token, notify }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState({ preset: "this-month", from: "", to: "" });
  const [source, setSource] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "date", desc: true });
  const range = resolvePeriod(period);
  const validRange = range.from && range.to && range.to >= range.from;
  const { data, loading } = useFinanceQuery(validRange ? `/finance/income?${rangeQuery(range)}` : null, {
    token,
    notify,
    errorTitle: "Could not load income",
  });

  const entries = useMemo(() => data?.entries || [], [data]);
  const counts = useMemo(
    () => ({
      all: entries.length,
      seva: entries.filter((entry) => entry.source === "seva").length,
      donation: entries.filter((entry) => entry.source === "donation").length,
    }),
    [entries]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries
      .filter((entry) => source === "all" || entry.source === source)
      .filter((entry) => !needle || [entry.description, entry.person, entry.phone, entry.reference, entry.detail].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)))
      .sort((a, b) => {
        const result = compare(a, b, sort.key) || compare(a, b, "date");
        return sort.desc ? -result : result;
      });
  }, [entries, query, sort, source]);

  const visibleTotal = visible.reduce((sum, entry) => sum + entry.amount, 0);
  const totals = data?.totals;
  const isFiltered = source !== "all" || query;
  const base = sectionPath(lang, role, "finance");

  const toggleSort = (key) => setSort((current) => (current.key === key ? { key, desc: !current.desc } : { key, desc: key === "date" || key === "amount" }));

  const resetFilters = () => {
    setSource("all");
    setQuery("");
  };

  const actions = (
    <>
      <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => navigate(`${base}/causes`)}>
        <HeartHandshake size={15} aria-hidden="true" />
        Causes
      </button>
      <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={() => navigate(`${base}/seva/new`)}>
        <Plus size={15} aria-hidden="true" />
        Add seva entry
      </button>
      <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={() => navigate(`${base}/donation/new`)}>
        <HandCoins size={15} aria-hidden="true" />
        Add donation entry
      </button>
    </>
  );

  return (
    <div className={own.financeRoot}>
      <Page>
        <PageHeader title={sectionMeta.finance.label} description={sectionMeta.finance.text} actions={actions} />

        {totals ? (
          <Kpis
            items={[
              { label: "Total income", value: inr(totals.income), sub: periodLabel(period), icon: IndianRupee },
              { label: "Seva income", value: inr(totals.seva), sub: `${counts.seva} ${counts.seva === 1 ? "seva" : "sevas"}`, icon: CalendarDays },
              { label: "Donation income", value: inr(totals.donation), sub: `${counts.donation} ${counts.donation === 1 ? "donation" : "donations"}`, icon: HeartHandshake },
            ]}
          />
        ) : null}

        <Panel>
          <div className={styles.toolbar}>
            <PeriodPicker period={period} onChange={setPeriod} />
            <div className={styles.toolbarEnd}>
              <Segmented
                label="Type of income"
                value={source}
                onChange={setSource}
                options={[
                  { value: "all", label: "All", count: counts.all },
                  { value: "seva", label: "Seva", count: counts.seva },
                  { value: "donation", label: "Donations", count: counts.donation },
                ]}
              />
            </div>
          </div>
          <div className={styles.toolbar} style={{ paddingTop: 0 }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search devotee, phone, seva, cause or receipt" />
          </div>

          {loading && !data ? (
            <SkeletonRows rows={8} columns={[12, 10, 26, 22, 10, 12]} />
          ) : visible.length ? (
            <>
              <div className={styles.tableWrap}>
                <table className={cx(styles.table, styles.tableStack)}>
                  <thead>
                    <tr>
                      {COLUMNS.map((column) => {
                        const active = sort.key === column.key;
                        const Icon = active ? (sort.desc ? ArrowDown : ArrowUp) : ArrowUpDown;
                        return (
                          <th key={column.key} className={column.numeric ? styles.num : undefined} aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"}>
                            <button type="button" className={cx(styles.thButton, !active && own.sortIdle)} onClick={() => toggleSort(column.key)}>
                              {column.label}
                              <Icon size={13} aria-hidden="true" />
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((entry) => (
                      <tr key={entry.id}>
                        <td className={styles.nowrap} data-label="Date">
                          {longDate(entry.date)}
                        </td>
                        <td data-label="Type">
                          <div className={styles.cellRow}>
                            {entry.source === "seva" ? <Badge tone="accent">Seva</Badge> : <Badge tone="success">Donation</Badge>}
                          </div>
                        </td>
                        <td>
                          <div className={styles.cellStack}>
                            <strong className={styles.cellMain}>{entry.description}</strong>
                            {entry.detail || entry.reference ? <span>{[entry.detail, entry.reference].filter(Boolean).join(" · ")}</span> : null}
                          </div>
                        </td>
                        <td data-label="Devotee">
                          <div className={styles.cellStack}>
                            <span className={styles.cellPrimary}>{entry.person || "—"}</span>
                            {entry.phone ? <span>{entry.phone}</span> : null}
                          </div>
                        </td>
                        <td className={styles.nowrap} data-label="Mode">
                          {DONATION_CHANNEL_LABELS[entry.channel] || entry.channel || "Online"}
                        </td>
                        <td className={cx(styles.num, styles.nowrap)} data-label="Amount">
                          <strong>{inr(entry.amount)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableFoot}>
                <span>
                  {visible.length} {visible.length === 1 ? "entry" : "entries"} · {inr(visibleTotal)}
                </span>
                {isFiltered ? (
                  <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={resetFilters}>
                    <X size={13} aria-hidden="true" />
                    Clear filters
                  </button>
                ) : (
                  <span className={styles.tableFootHint}>Online payments appear once they are paid</span>
                )}
              </div>
            </>
          ) : isFiltered ? (
            <EmptyState
              icon={ListFilter}
              title="Nothing matches"
              text="Try the other type, a longer period or a shorter search."
              action={
                <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={resetFilters}>
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={Wallet}
              title={`No income for ${periodLabel(period)}`}
              text="Paid online seva bookings and donations appear here on their own. Add sevas and donations received at the counter with the buttons above."
            />
          )}
        </Panel>
      </Page>
    </div>
  );
}
