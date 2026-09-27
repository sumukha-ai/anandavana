import { useMemo, useState } from "react";
import { ClipboardList, ImageOff, ListFilter, Pencil, Plus } from "lucide-react";
import { sevaImageUrl } from "../sevaHelpers";
import { formatAmount, sectionMeta } from "./rolePortalConfig";
import { Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, Skeleton } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./SevaCatalog.module.css";

function SevaCard({ seva, canManage, onEdit, onToggleEnabled }) {
  const src = sevaImageUrl(seva, null);
  const enabled = Boolean(seva.enabled);
  const stop = (event) => event.stopPropagation();

  return (
    <article className={cx(own.card, canManage && own.clickable, !enabled && own.off)} onClick={canManage ? () => onEdit(seva) : undefined}>
      <div className={own.media}>
        {src ? (
          <img src={src} alt="" loading="lazy" />
        ) : (
          <div className={own.mediaEmpty} aria-hidden="true">
            <ImageOff size={20} />
            <span>No image</span>
          </div>
        )}
        <span className={own.status}>{enabled ? "Enabled" : "Disabled"}</span>
      </div>

      <div className={own.body}>
        <h3 className={own.name} title={seva.name}>
          {seva.name}
        </h3>
        {seva.name_kn ? (
          <span className={own.nameKn} lang="kn">
            {seva.name_kn}
          </span>
        ) : null}
        <div className={own.meta}>
          {Number(seva.amount) > 0 ? <span className={own.amount}>{formatAmount(seva.amount)}</span> : <span className={own.offline}>Offline only</span>}
          {!seva.name_kn ? <Badge tone="warning">No Kannada</Badge> : null}
        </div>
      </div>

      {canManage ? (
        <div className={own.foot}>
          <button
            type="button"
            className={cx(styles.btn, styles.btnSecondary, styles.btnSm)}
            onClick={(event) => {
              stop(event);
              onEdit(seva);
            }}
            aria-label={`Edit ${seva.name}`}
          >
            <Pencil size={13} aria-hidden="true" />
            Edit
          </button>
          <label className={styles.switchInline} onClick={stop}>
            <span>{enabled ? "Enabled" : "Disabled"}</span>
            <span className={styles.switch}>
              <input type="checkbox" role="switch" checked={enabled} onChange={() => onToggleEnabled(seva)} aria-label={`${enabled ? "Disable" : "Enable"} ${seva.name}`} />
              <span className={styles.switchTrack} />
            </span>
          </label>
        </div>
      ) : null}
    </article>
  );
}

export default function SevaCatalogPage({ sevas, loaded, canManage, onEditSeva, onAddSeva, onToggleEnabled }) {
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
                { value: "open", label: "Enabled", count: counts.open },
                { value: "off", label: "Disabled", count: counts.off },
                // { value: "kn", label: "No Kannada", count: counts.kn },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <div className={own.grid}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={own.card}>
                <Skeleton height="auto" radius={0} style={{ display: "block", aspectRatio: "2 / 1" }} />
                <div className={own.skeleton}>
                  <Skeleton width="65%" height={14} />
                  <Skeleton width="40%" height={11} />
                  <Skeleton width="30%" height={18} style={{ marginTop: 10 }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length ? (
          <div className={own.grid}>
            {visible.map((seva) => (
              <SevaCard key={seva.id} seva={seva} canManage={canManage} onEdit={onEditSeva} onToggleEnabled={onToggleEnabled} />
            ))}
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
            {canManage ? <span className={styles.tableFootHint}>Select a card to edit it</span> : null}
          </div>
        ) : null}
      </Panel>
    </Page>
  );
}
