import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { apiRequest } from "../../../api/client";
import { dateKey, displayLookup, sectionPath } from "../rolePortalConfig";
import { Field, FormSection, Page, PageHeader, Panel, SkeletonRows } from "../ui";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "./Finance.module.css";
import { DONATION_CHANNEL_LABELS, inr } from "./financeUtils";

const emptyForm = {
  seva_id: "",
  seva_date: dateKey(),
  amount: "",
  channel: "cash",
  paid_on: dateKey(),
  payment_reference: "",
  devotee_name: "",
  devotee_phone: "",
  gotra: "",
  rashi_id: "",
  nakshatra_id: "",
};

export default function SevaEntryPage({ lang, role, token, notify, sevas, lookups, loaded }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const financePath = sectionPath(lang, role, "finance");
  const sortedSevas = [...sevas].sort((a, b) => Number(b.enabled) - Number(a.enabled) || a.name.localeCompare(b.name));

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      // Choosing a seva fills in its current amount, which staff can still change
      if (name === "seva_id") {
        const seva = sevas.find((item) => String(item.id) === value);
        if (seva?.amount) next.amount = String(seva.amount);
      }
      return next;
    });
  };

  const save = async (event) => {
    event.preventDefault();
    const body = {
      ...form,
      seva_id: Number(form.seva_id),
      amount: Number(form.amount),
      rashi_id: form.rashi_id ? Number(form.rashi_id) : null,
      nakshatra_id: form.nakshatra_id ? Number(form.nakshatra_id) : null,
    };
    setSaving(true);
    try {
      const data = await apiRequest("/finance/seva-entries", { method: "POST", token, body });
      notify("success", "Seva entry saved", `${data.booking.seva?.name} for ${form.devotee_name} · ${inr(form.amount)}`);
      navigate(financePath);
    } catch (err) {
      notify("error", "Could not save the seva entry", err.message);
      setSaving(false);
    }
  };

  return (
    <div className={own.financeRoot}>
      <Page>
        <PageHeader
          title="Add seva entry"
          description="For a seva booked and paid for at the kshetra. It counts as income and appears on the seva calendar for the priests."
          back={{ to: financePath, label: "Finance" }}
        />

        {!loaded ? (
          <Panel>
            <SkeletonRows rows={6} columns={[40, 40]} />
          </Panel>
        ) : (
          <form onSubmit={save} className={styles.stack}>
            <Panel>
              <div className={styles.panelBody} style={{ display: "grid", gap: "1.5rem" }}>
                <FormSection title="Seva">
                  <Field label="Seva" wide>
                    <select className={styles.select} name="seva_id" value={form.seva_id} onChange={update} required>
                      <option value="" disabled>
                        Choose a seva
                      </option>
                      {sortedSevas.map((seva) => (
                        <option key={seva.id} value={seva.id}>
                          {seva.name}
                          {seva.amount ? ` · ${inr(seva.amount)}` : ""}
                          {seva.enabled ? "" : " (disabled)"}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Seva date" hint="The day the seva will be performed">
                    <input className={styles.input} type="date" name="seva_date" value={form.seva_date} onChange={update} required />
                  </Field>
                  <Field label="Amount paid">
                    <span className={styles.inputAffix}>
                      <span className={styles.affix}>₹</span>
                      <input className={cx(styles.input, own.amountInput)} type="number" name="amount" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={update} required placeholder="0" />
                    </span>
                  </Field>
                  <Field label="Paid on">
                    <input className={styles.input} type="date" name="paid_on" value={form.paid_on} max={dateKey()} onChange={update} required />
                  </Field>
                  <Field label="Mode">
                    <select className={styles.select} name="channel" value={form.channel} onChange={update}>
                      {Object.entries(DONATION_CHANNEL_LABELS)
                        .filter(([value]) => value !== "online")
                        .map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                    </select>
                  </Field>
                  <Field label="Reference" aside="Optional" hint="UPI transaction id, cheque number or receipt book number" wide>
                    <input className={styles.input} name="payment_reference" value={form.payment_reference} onChange={update} maxLength={160} />
                  </Field>
                </FormSection>

                <FormSection title="Devotee" description="Who the seva is for. Priests see these details on the seva calendar.">
                  <Field label="Name" wide>
                    <input className={styles.input} name="devotee_name" value={form.devotee_name} onChange={update} required minLength={2} maxLength={120} autoComplete="off" />
                  </Field>
                  <Field label="Phone" aside="Optional">
                    <input className={styles.input} type="tel" name="devotee_phone" value={form.devotee_phone} onChange={update} minLength={8} maxLength={20} autoComplete="off" />
                  </Field>
                  <Field label="Gotra" aside="Optional">
                    <input className={styles.input} name="gotra" value={form.gotra} onChange={update} maxLength={120} autoComplete="off" />
                  </Field>
                  <Field label="Rashi" aside="Optional">
                    <select className={styles.select} name="rashi_id" value={form.rashi_id} onChange={update}>
                      <option value="">Not given</option>
                      {lookups.rashis.map((item) => (
                        <option key={item.id} value={item.id}>
                          {displayLookup(item, "en")} · {item.name_kn}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Nakshatra" aside="Optional">
                    <select className={styles.select} name="nakshatra_id" value={form.nakshatra_id} onChange={update}>
                      <option value="">Not given</option>
                      {lookups.nakshatras.map((item) => (
                        <option key={item.id} value={item.id}>
                          {displayLookup(item, "en")} · {item.name_kn}
                        </option>
                      ))}
                    </select>
                  </Field>
                </FormSection>
              </div>
            </Panel>

            <div className={styles.saveBar}>
              <span className={styles.saveBarText}>{form.amount ? `Receiving ${inr(form.amount)}` : "Choose the seva and fill in the devotee."}</span>
              <div className={styles.pageActions}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => navigate(financePath)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
                  {saving ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : null}
                  Save seva entry
                </button>
              </div>
            </div>
          </form>
        )}
      </Page>
    </div>
  );
}
