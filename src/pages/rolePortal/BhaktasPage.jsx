import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookUser, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { sectionMeta, sectionPath } from "./rolePortalConfig";
import { Avatar, Badge, EmptyState, Page, PageHeader, Panel, SearchInput, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import { inr, longDate } from "./finance/financeUtils";
import { useFinanceQuery } from "./finance/useFinanceQuery";

const PER_PAGE = 25;

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);
  return debounced;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

export default function BhaktasPage({ lang, role, token, notify }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const search = useDebounced(query.trim());
  // The page number belongs to one search; a new search starts again at page 1
  const [paging, setPaging] = useState({ search: "", page: 1 });
  const page = paging.search === search ? paging.page : 1;
  const goToPage = (next) => setPaging({ search, page: next });

  const params = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE) });
  if (search) params.set("q", search);
  const { data, loading } = useFinanceQuery(`/bhaktas?${params.toString()}`, {
    token,
    notify,
    errorTitle: "Could not load bhaktas",
  });

  const bhaktas = data?.bhaktas || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;
  const open = (bhakta) => navigate(`${sectionPath(lang, role, "bhaktas")}/${bhakta.id}`);

  return (
    <Page>
      <PageHeader title={sectionMeta.bhaktas.label} description={sectionMeta.bhaktas.text} />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search name or phone, including family members" />
        </div>

        {!data ? (
          <SkeletonRows rows={8} columns={[28, 16, 10, 10, 12, 14]} />
        ) : bhaktas.length ? (
          <>
            <div className={styles.tableWrap} aria-busy={loading}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Bhakta</th>
                    <th>Phone</th>
                    <th className={styles.num}>Family</th>
                    <th className={styles.num}>Sevas</th>
                    <th className={styles.num}>Donations</th>
                    <th className={styles.num}>Total given</th>
                    <th>Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {bhaktas.map((bhakta) => (
                    <tr
                      key={bhakta.id}
                      className={styles.rowClickable}
                      onClick={() => open(bhakta)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") open(bhakta);
                      }}
                      tabIndex={0}
                      aria-label={`Open ${bhakta.name}`}
                    >
                      <td>
                        <div className={styles.cellRow}>
                          <Avatar name={bhakta.name} small />
                          <div className={styles.cellStack}>
                            <strong className={styles.cellMain}>{bhakta.name}</strong>
                            <span>{bhakta.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Phone">
                        {bhakta.phone_number || (bhakta.has_profile ? "—" : <Badge tone="warning">No profile yet</Badge>)}
                      </td>
                      <td className={styles.num} data-label="Family">
                        {bhakta.family_count || "—"}
                      </td>
                      <td className={styles.num} data-label="Sevas">
                        {bhakta.seva_count || "—"}
                      </td>
                      <td className={styles.num} data-label="Donations">
                        {bhakta.donation_count || "—"}
                      </td>
                      <td className={cx(styles.num, styles.nowrap)} data-label="Total given">
                        {bhakta.total_given ? <strong>{inr(bhakta.total_given)}</strong> : "—"}
                      </td>
                      <td className={styles.nowrap} data-label="Last activity">
                        {bhakta.last_activity ? longDate(bhakta.last_activity) : <span className={styles.muted}>Joined {longDate(bhakta.joined_at)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFoot}>
              <span>
                {search ? `${plural(total, "match", "matches")} of ${plural(data.all_total, "bhakta", "bhaktas")}` : plural(total, "bhakta", "bhaktas")}
                {pages > 1 ? ` · page ${page} of ${pages}` : ""}
              </span>
              {pages > 1 ? (
                <span className={styles.cellRow}>
                  <button
                    type="button"
                    className={cx(styles.iconButton, styles.iconButtonBordered)}
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1 || loading}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={cx(styles.iconButton, styles.iconButtonBordered)}
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= pages || loading}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </span>
              ) : (
                <span className={styles.muted}>Open a bhakta to see their full history</span>
              )}
            </div>
          </>
        ) : search ? (
          <EmptyState icon={ListFilter} title="No bhakta matches" text="Try part of the name, or the last few digits of the phone number." />
        ) : (
          <EmptyState icon={BookUser} title="No bhaktas yet" text="Devotees appear here when they register on the site." />
        )}
      </Panel>
    </Page>
  );
}
