import { useEffect, useState } from "react";
import { ExternalLink, HeartHandshake, Loader2, Plus, X } from "lucide-react";
import { apiRequest } from "../../../api/client";
import { sectionMeta, sectionPath } from "../rolePortalConfig";
import { Badge, EmptyState, Field, Page, PageHeader, Panel, SkeletonRows, Switch } from "../ui";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "./Finance.module.css";
import { Drawer } from "./FinanceParts";
import { inr } from "./financeUtils";

const emptyFund = {
  id: null,
  name: "",
  name_kn: "",
  description: "",
  description_kn: "",
  suggested_amounts: [501, 1001, 2501, 5001],
  target_amount: "",
  position: 0,
  enabled: true,
};

function toForm(fund) {
  return {
    id: fund.id,
    name: fund.name_en || "",
    name_kn: fund.name_kn || "",
    description: fund.description_en || "",
    description_kn: fund.description_kn || "",
    suggested_amounts: fund.suggested_amounts || [],
    target_amount: fund.target_amount ?? "",
    position: fund.position ?? 0,
    enabled: Boolean(fund.enabled),
  };
}

function FundEditor({ initial, token, notify, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [newAmount, setNewAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const addAmount = () => {
    const value = Math.round(Number(newAmount));
    if (!(value >= 1) || form.suggested_amounts.includes(value) || form.suggested_amounts.length >= 6) return;
    setForm((current) => ({ ...current, suggested_amounts: [...current.suggested_amounts, value].sort((a, b) => a - b) }));
    setNewAmount("");
  };

  const save = async (event) => {
    event.preventDefault();
    const body = {
      ...form,
      target_amount: form.target_amount === "" ? null : Number(form.target_amount),
      position: Number(form.position) || 0,
    };
    if (!body.id) delete body.id;
    setSaving(true);
    try {
      const data = await apiRequest("/donation-funds", { method: "POST", token, body });
      notify("success", form.id ? "Cause updated" : "Cause added", data.fund.name);
      onSaved();
    } catch (err) {
      notify("error", "Could not save the cause", err.message);
      setSaving(false);
    }
  };

  return (
    <Drawer
      open
      title={form.id ? "Edit cause" : "New cause"}
      subtitle="Shown on the public Donate page when it is on."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="fund-form" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
            {saving ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : null}
            Save cause
          </button>
        </>
      }
    >
      <form id="fund-form" onSubmit={save} style={{ display: "grid", gap: "1rem" }}>
        <Field label="Name in English">
          <input className={styles.input} name="name" value={form.name} onChange={update} required minLength={2} maxLength={160} />
        </Field>
        <Field label="Name in Kannada" aside="Recommended">
          <input className={styles.input} name="name_kn" value={form.name_kn} onChange={update} maxLength={160} lang="kn" />
        </Field>
        <Field label="Description in English" aside="Optional">
          <textarea className={styles.textarea} name="description" value={form.description} onChange={update} maxLength={5000} rows={3} />
        </Field>
        <Field label="Description in Kannada" aside="Optional">
          <textarea className={styles.textarea} name="description_kn" value={form.description_kn} onChange={update} maxLength={5000} rows={3} lang="kn" />
        </Field>

        <div className={styles.field}>
          <span className={styles.label}>
            Suggested amounts
            <span className={styles.labelHint}>Up to 6</span>
          </span>
          <div className={own.amountChips}>
            {form.suggested_amounts.map((amount) => (
              <span key={amount} className={own.amountChip}>
                {inr(amount)}
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, suggested_amounts: current.suggested_amounts.filter((item) => item !== amount) }))}
                  aria-label={`Remove ${inr(amount)}`}
                >
                  <X size={11} aria-hidden="true" />
                </button>
              </span>
            ))}
            {!form.suggested_amounts.length ? <span className={styles.hint}>Devotees will type their own amount.</span> : null}
          </div>
          {form.suggested_amounts.length < 6 ? (
            <div className={own.chipAdd}>
              <span className={styles.inputAffix}>
                <span className={styles.affix}>₹</span>
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  step="1"
                  value={newAmount}
                  onChange={(event) => setNewAmount(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addAmount();
                    }
                  }}
                  aria-label="New suggested amount"
                />
              </span>
              <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm)} onClick={addAmount} disabled={!newAmount}>
                Add
              </button>
            </div>
          ) : null}
        </div>

        <div className={own.inlineFields}>
          <Field label="Target" aside="Optional" hint="Shows progress on the website">
            <span className={styles.inputAffix}>
              <span className={styles.affix}>₹</span>
              <input className={styles.input} type="number" name="target_amount" min="1" step="1" value={form.target_amount} onChange={update} />
            </span>
          </Field>
          <Field label="Order" hint="Lower numbers come first">
            <input className={styles.input} type="number" name="position" min="0" max="1000" value={form.position} onChange={update} />
          </Field>
        </div>

        <Switch name="enabled" checked={form.enabled} onChange={update} title="Accept donations online" description="When off, the cause is hidden from the website but staff can still record donations to it." />
      </form>
    </Drawer>
  );
}

export default function DonationFundsPage({ lang, role, token, notify }) {
  const [funds, setFunds] = useState(null);
  const [editing, setEditing] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/donation-funds?all=1", { token })
      .then((data) => active && setFunds(data.funds || []))
      .catch((err) => {
        if (!active) return;
        setFunds([]);
        notify("error", "Could not load causes", err.message);
      });
    return () => {
      active = false;
    };
  }, [notify, token, reload]);

  const addButton = (
    <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={() => setEditing(emptyFund)}>
      <Plus size={15} aria-hidden="true" />
      Add cause
    </button>
  );

  return (
    <div className={own.financeRoot}>
      <Page>
        <PageHeader
          title={sectionMeta["finance-causes"].label}
          description={sectionMeta["finance-causes"].text}
          back={{ to: sectionPath(lang, role, "finance"), label: "Finance" }}
          actions={
            <>
              <a href={`/${lang}/donate`} target="_blank" rel="noreferrer" className={cx(styles.btn, styles.btnSecondary)}>
                <ExternalLink size={15} aria-hidden="true" />
                View Donate page
              </a>
              {addButton}
            </>
          }
        />

        <Panel>
          {!funds ? (
            <SkeletonRows rows={4} columns={[36, 24, 20, 10]} />
          ) : funds.length ? (
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Cause</th>
                    <th>Suggested amounts</th>
                    <th>Received</th>
                    <th className={styles.num}>Donations</th>
                    <th>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund) => {
                    const share = fund.target_amount ? Math.min(100, ((fund.raised || 0) / fund.target_amount) * 100) : null;
                    return (
                      <tr key={fund.id} className={styles.rowClickable} onClick={() => setEditing(toForm(fund))}>
                        <td>
                          <div className={styles.cellStack}>
                            <strong className={styles.cellMain}>{fund.name_en}</strong>
                            {fund.name_kn ? <span lang="kn">{fund.name_kn}</span> : <span>No Kannada name</span>}
                          </div>
                        </td>
                        <td data-label="Amounts">
                          <span className={styles.muted}>{fund.suggested_amounts.length ? fund.suggested_amounts.map((amount) => inr(amount)).join(" · ") : "Any amount"}</span>
                        </td>
                        <td data-label="Received">
                          {share !== null ? (
                            <div className={own.fundMeter}>
                              <span>
                                <strong>{inr(fund.raised)}</strong> <span className={styles.muted}>of {inr(fund.target_amount)}</span>
                              </span>
                              <span className={own.fundTrack} aria-hidden="true">
                                <span className={own.fundFill} style={{ width: `${share}%` }} />
                              </span>
                            </div>
                          ) : (
                            <strong>{inr(fund.raised)}</strong>
                          )}
                        </td>
                        <td className={styles.num} data-label="Donations">
                          {fund.donation_count || "—"}
                        </td>
                        <td data-label="Website">
                          <div className={styles.cellRow}>
                            {fund.enabled ? <Badge tone="success">Accepting</Badge> : <Badge plain>Hidden</Badge>}
                            {!fund.name_kn ? <Badge tone="warning">No Kannada</Badge> : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={HeartHandshake} title="No causes yet" text="Add a cause such as annadana or gau seva so devotees can give towards it online." action={addButton} />
          )}
          {funds?.length ? (
            <div className={styles.tableFoot}>
              <span>
                {funds.filter((fund) => fund.enabled).length} of {funds.length} accepting donations
              </span>
              <span className={styles.tableFootHint}>Received totals count every paid donation, all time</span>
            </div>
          ) : null}
        </Panel>

        {editing ? (
          <FundEditor
            key={editing.id || "new"}
            initial={editing}
            token={token}
            notify={notify}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              setReload((n) => n + 1);
            }}
          />
        ) : null}
      </Page>
    </div>
  );
}
