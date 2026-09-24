import { useMemo, useState } from "react";
import { Languages, LoaderCircle, Plus, Save } from "lucide-react";
import { sectionMeta } from "./rolePortalConfig";
import { EmptyState, Field, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const kinds = {
  rashi: { one: "rashi", many: "Rashis", listKey: "rashis" },
  nakshatra: { one: "nakshatra", many: "Nakshatras", listKey: "nakshatras" },
};

export default function LookupsPage({ lookups, loaded, lookupForm, onLookupChange, onSaveLookup, onEditLookup, onResetLookup, saving }) {
  const [query, setQuery] = useState("");
  const kind = kinds[lookupForm.kind] || kinds.rashi;
  const items = useMemo(() => lookups[kind.listKey] || [], [kind.listKey, lookups]);
  const editing = Boolean(lookupForm.id);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => !needle || `${item.name} ${item.name_kn}`.toLowerCase().includes(needle));
  }, [items, query]);

  return (
    <Page>
      <PageHeader title={sectionMeta.lookups.label} description={sectionMeta.lookups.text} />

      <div className={styles.split}>
        <Panel>
          <div className={styles.toolbar}>
            <Segmented
              label="Reference type"
              value={lookupForm.kind}
              onChange={(value) => {
                setQuery("");
                onResetLookup(value);
              }}
              options={[
                { value: "rashi", label: "Rashi", count: lookups.rashis.length },
                { value: "nakshatra", label: "Nakshatra", count: lookups.nakshatras.length },
              ]}
            />
            <SearchInput value={query} onChange={setQuery} placeholder={`Search ${kind.many.toLowerCase()}`} />
          </div>
          {!loaded ? (
            <SkeletonRows rows={6} columns={[30, 30]} />
          ) : visible.length ? (
            <div className={styles.chipGrid} key={lookupForm.kind}>
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cx(styles.chip, String(lookupForm.id) === String(item.id) && styles.chipActive)}
                  onClick={() => onEditLookup(lookupForm.kind, item)}
                  aria-label={`Edit ${item.name}`}
                >
                  <span className={styles.chipIndex}>{items.indexOf(item) + 1}</span>
                  <span className={styles.chipText}>
                    <strong>{item.name}</strong>
                    <span lang="kn">{item.name_kn || "No Kannada name"}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Languages}
              title={items.length ? `No ${kind.many.toLowerCase()} match` : `No ${kind.many.toLowerCase()} yet`}
              text={items.length ? "Try the English or the Kannada spelling." : `Add each ${kind.one} with its English and Kannada name. Devotees pick from this list in their profile.`}
            />
          )}
        </Panel>

        <div className={styles.sticky}>
          <Panel
            as="form"
            onSubmit={onSaveLookup}
            title={editing ? `Edit ${kind.one}` : `Add a ${kind.one}`}
            action={
              editing ? (
                <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={() => onResetLookup(lookupForm.kind)}>
                  <Plus size={13} aria-hidden="true" />
                  New instead
                </button>
              ) : null
            }
          >
            <div className={cx(styles.panelBody, styles.skeletonStack)}>
              <Field label="English name">
                <input className={styles.input} name="name" value={lookupForm.name} onChange={onLookupChange} required placeholder={lookupForm.kind === "rashi" ? "e.g. Mesha" : "e.g. Ashwini"} />
              </Field>
              <Field label="Kannada name">
                <input className={styles.input} name="name_kn" value={lookupForm.name_kn} onChange={onLookupChange} required lang="kn" placeholder={lookupForm.kind === "rashi" ? "ಉದಾ. ಮೇಷ" : "ಉದಾ. ಅಶ್ವಿನಿ"} />
              </Field>
              <p className={styles.hint}>{editing ? "Pick another entry on the left to edit that one instead." : "Pick an entry on the left to edit it."}</p>
            </div>
            <div className={styles.panelFoot}>
              {editing ? (
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => onResetLookup(lookupForm.kind)}>
                  Cancel
                </button>
              ) : null}
              <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
                {saving ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : editing ? <Save size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                {saving ? "Saving…" : editing ? "Save changes" : `Add ${kind.one}`}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
