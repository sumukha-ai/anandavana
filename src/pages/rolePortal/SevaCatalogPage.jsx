import { useMemo, useState } from "react";
import { ClipboardList, ImageOff, ListFilter, Pencil, Plus } from "lucide-react";
import { sevaImageUrl } from "../sevaHelpers";
import { formatAmount, sectionMeta } from "./rolePortalConfig";
import { Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

function Thumb({ seva }) {
  const src = sevaImageUrl(seva, null);
  return src ? (
    <img className={styles.thumb} src={src} alt="" loading="lazy" />
  ) : (
    <span className={cx(styles.thumb, styles.thumbEmpty)} aria-hidden="true">
      <ImageOff size={15} />
    </span>
  );
}

export default function SevaCatalogPage({ sevas, loaded, canManage, onEditSeva, onAddSeva }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");

  const counts = {
    all: sevas.length,
    open: sevas.filter((seva) => seva.enabled).length,
    off: sevas.filter((seva) => !seva.enabled).length,
    kn: sevas.filter((seva) => !seva.name_kn).length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sevas
      .filter((seva) => (view === "open" ? seva.enabled : view === "off" ? !seva.enabled : view === "kn" ? !seva.name_kn : true))
      .filter((seva) => !needle || `${seva.name} ${seva.name_kn || ""}`.toLowerCase().includes(needle));
  }, [query, sevas, view]);

  const addButton = canManage ? (
    <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={onAddSeva}>
      <Plus size={15} aria-hidden="true" />
      Add seva
    </button>
  ) : null;

  return (
    <Page>
      <PageHeader title={sectionMeta.sevas.label} description={sectionMeta.sevas.text} actions={addButton} />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search in English or Kannada" />
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Filter sevas"
              value={view}
              onChange={setView}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "open", label: "Open", count: counts.open },
                { value: "off", label: "Off", count: counts.off },
                { value: "kn", label: "No Kannada", count: counts.kn },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={6} columns={[40, 12, 12, 20]} />
        ) : visible.length ? (
          <div className={styles.tableWrap}>
            <table className={cx(styles.table, styles.tableStack)}>
              <thead>
                <tr>
                  <th>Seva</th>
                  <th className={styles.num}>Amount</th>
                  <th>Online booking</th>
                  <th>Kannada</th>
                  {canManage ? <th aria-label="Actions" /> : null}
                </tr>
              </thead>
              <tbody>
                {visible.map((seva) => (
                  <tr
                    key={seva.id}
                    className={canManage ? styles.rowClickable : undefined}
                    onClick={canManage ? () => onEditSeva(seva) : undefined}
                  >
                    <td>
                      <div className={styles.cellRow}>
                        <Thumb seva={seva} />
                        <div className={styles.cellStack}>
                          <strong className={styles.cellMain}>{seva.name}</strong>
                          {seva.name_kn ? <span lang="kn">{seva.name_kn}</span> : null}
                        </div>
                      </div>
                    </td>
                    <td className={cx(styles.num, styles.nowrap)} data-label="Amount">
                      {Number(seva.amount) > 0 ? formatAmount(seva.amount) : <Badge plain>Offline only</Badge>}
                    </td>
                    <td data-label="Booking">
                      {seva.enabled ? <Badge tone="success">Open</Badge> : <Badge tone="neutral">Off</Badge>}
                    </td>
                    <td data-label="Kannada">
                      {seva.name_kn ? <Badge tone="success">Added</Badge> : <Badge tone="warning">Missing</Badge>}
                    </td>
                    {canManage ? (
                      <td className={styles.num}>
                        <button
                          type="button"
                          className={cx(styles.btn, styles.btnGhost, styles.btnSm, styles.rowAction)}
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditSeva(seva);
                          }}
                          aria-label={`Edit ${seva.name}`}
                        >
                          <Pencil size={13} aria-hidden="true" />
                          Edit
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : sevas.length ? (
          <EmptyState
            icon={ListFilter}
            title="No sevas match"
            text="Try another spelling, or search in Kannada."
            action={
              <button
                type="button"
                className={cx(styles.btn, styles.btnSecondary)}
                onClick={() => {
                  setQuery("");
                  setView("all");
                }}
              >
                Show all sevas
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="The catalog is empty"
            text={canManage ? "Add the first seva with its amount, description and Kannada text. Devotees can book it once it is open." : "Sevas will appear here once an admin adds them."}
            action={addButton}
          />
        )}
        {loaded && visible.length ? (
          <div className={styles.tableFoot}>
            <span>
              {visible.length} of {sevas.length} {sevas.length === 1 ? "seva" : "sevas"}
            </span>
            {canManage ? <span className={styles.tableFootHint}>Select a row to edit it</span> : null}
          </div>
        ) : null}
      </Panel>
    </Page>
  );
}
