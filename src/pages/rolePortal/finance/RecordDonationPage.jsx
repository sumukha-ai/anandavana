import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Printer } from "lucide-react";
import { apiRequest } from "../../../api/client";
import { dateKey, sectionPath } from "../rolePortalConfig";
import { Field, FormSection, Page, PageHeader, Panel, SkeletonRows, Switch } from "../ui";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "./Finance.module.css";
import { DONATION_CHANNEL_LABELS, inr } from "./financeUtils";
import { openReceiptWindow, printDonationReceipt } from "./printReceipt";

const emptyForm = {
  fund_id: "",
  amount: "",
  channel: "cash",
  donated_on: dateKey(),
  payment_reference: "",
  donor_name: "",
  donor_phone: "",
  donor_email: "",
  donor_address: "",
  pan: "",
  is_anonymous: false,
  dedication: "",
  notes: "",
};

const REFERENCE_HINT = {
  cheque: "Cheque number and bank",
  upi: "UPI transaction id",
  bank_transfer: "UTR number",
  card: "Card slip number",
};

export default function RecordDonationPage({ lang, role, token, notify }) {
  const navigate = useNavigate();
  const [funds, setFunds] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [printAfter, setPrintAfter] = useState(true);
  const listPath = sectionPath(lang, role, "finance");

  useEffect(() => {
    apiRequest("/donation-funds?all=1", { token })
      .then((data) => {
        const list = data.funds || [];
        setFunds(list);
        const first = list.find((fund) => fund.enabled) || list[0];
        if (first) setForm((current) => ({ ...current, fund_id: current.fund_id || String(first.id) }));
      })
      .catch((err) => {
        setFunds([]);
        notify("error", "Could not load causes", err.message);
      });
  }, [notify, token]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : name === "pan" ? value.toUpperCase() : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    const body = { ...form, fund_id: Number(form.fund_id), amount: Number(form.amount) };
    const receiptWindow = printAfter ? openReceiptWindow() : null;
    setSaving(true);
    try {
      const data = await apiRequest("/donations/offline", { method: "POST", token, body });
      notify("success", "Donation recorded", `Receipt ${data.donation.receipt_number} · ${inr(data.donation.amount)}`);
      if (printAfter && !printDonationReceipt(data.donation, receiptWindow)) {
        notify("error", "Pop-up blocked", "Allow pop-ups for this site to print receipts.");
      }
      navigate(listPath);
    } catch (err) {
      receiptWindow?.close();
      notify("error", "Could not record the donation", err.message);
      setSaving(false);
    }
  };

  const selectedFund = funds?.find((fund) => String(fund.id) === String(form.fund_id));

  return (
    <div className={own.financeRoot}>
      <Page>
        <PageHeader
          title="Add donation entry"
          description="For cash, cheque, UPI or bank transfers received at the kshetra. It is marked received and gets a receipt number straight away."
          back={{ to: listPath, label: "Finance" }}
        />

        {!funds ? (
          <Panel>
            <SkeletonRows rows={6} columns={[40, 40]} />
          </Panel>
        ) : (
          <form onSubmit={save} className={styles.stack}>
            <Panel>
              <div className={styles.panelBody} style={{ display: "grid", gap: "1.5rem" }}>
                <FormSection title="Offering">
                  <Field label="Cause" wide>
                    <select className={styles.select} name="fund_id" value={form.fund_id} onChange={update} required>
                      {funds.map((fund) => (
                        <option key={fund.id} value={fund.id}>
                          {fund.name_en || fund.name}
                          {fund.enabled ? "" : " (hidden from the website)"}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Amount">
                    <span className={styles.inputAffix}>
                      <span className={styles.affix}>₹</span>
                      <input className={cx(styles.input, own.amountInput)} type="number" name="amount" min="1" step="0.01" inputMode="decimal" value={form.amount} onChange={update} required placeholder="0" />
                    </span>
                  </Field>
                  <Field label="Received on">
                    <input className={styles.input} type="date" name="donated_on" value={form.donated_on} max={dateKey()} onChange={update} required />
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
                  <Field label="Reference" aside="Optional" hint={REFERENCE_HINT[form.channel]}>
                    <input className={styles.input} name="payment_reference" value={form.payment_reference} onChange={update} maxLength={160} />
                  </Field>
                </FormSection>

                <FormSection title="Donor" description="Printed on the receipt.">
                  <Field label="Name" wide>
                    <input className={styles.input} name="donor_name" value={form.donor_name} onChange={update} required minLength={2} maxLength={120} autoComplete="off" />
                  </Field>
                  <Field label="Phone" aside="Optional">
                    <input className={styles.input} type="tel" name="donor_phone" value={form.donor_phone} onChange={update} minLength={8} maxLength={20} autoComplete="off" />
                  </Field>
                  <Field label="Email" aside="Optional">
                    <input className={styles.input} type="email" name="donor_email" value={form.donor_email} onChange={update} maxLength={120} autoComplete="off" />
                  </Field>
                  <Field label="PAN" aside="Optional">
                    <input className={cx(styles.input, styles.mono)} name="pan" value={form.pan} onChange={update} pattern="[A-Z]{5}[0-9]{4}[A-Z]" maxLength={10} placeholder="ABCDE1234F" title="10 characters, like ABCDE1234F" autoComplete="off" />
                  </Field>
                  <Field label="Dedication" aside="Optional">
                    <input className={styles.input} name="dedication" value={form.dedication} onChange={update} maxLength={200} placeholder="In memory of…" />
                  </Field>
                  <Field label="Address" aside="Optional" wide>
                    <textarea className={styles.textarea} name="donor_address" value={form.donor_address} onChange={update} maxLength={1000} rows={2} />
                  </Field>
                  <div className={styles.fieldWide}>
                    <Switch name="is_anonymous" checked={form.is_anonymous} onChange={update} title="Keep the donor's name private" description="The name stays on the receipt but is never shown publicly." />
                  </div>
                  <Field label="Office notes" aside="Optional" wide>
                    <textarea className={styles.textarea} name="notes" value={form.notes} onChange={update} maxLength={2000} rows={2} placeholder="Only staff see these notes" />
                  </Field>
                </FormSection>
              </div>
            </Panel>

            <div className={styles.saveBar}>
              <label className={styles.saveBarText} style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={printAfter} onChange={(event) => setPrintAfter(event.target.checked)} />
                <Printer size={14} aria-hidden="true" />
                Print the receipt after saving
              </label>
              <div className={styles.pageActions}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => navigate(listPath)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving || !funds.length}>
                  {saving ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : null}
                  {form.amount ? `Record ${inr(form.amount)}` : "Record donation"}
                  {selectedFund && form.amount ? ` for ${selectedFund.name_en || selectedFund.name}` : ""}
                </button>
              </div>
            </div>
          </form>
        )}
      </Page>
    </div>
  );
}
