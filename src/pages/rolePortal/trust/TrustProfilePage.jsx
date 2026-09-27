import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Landmark, Loader2, Plus, Save, Trash2, UsersRound } from "lucide-react";
import { apiRequest } from "../../../api/client";
import { donationFinancialYear, forgetTrust } from "../../donate/taxExemption";
import { dateKey, downloadCsv, sectionMeta } from "../rolePortalConfig";
import { Badge, EmptyState, Field, FormSection, Page, PageHeader, Panel, SkeletonRows, Switch } from "../ui";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "../finance/Finance.module.css";
import { Drawer } from "../finance/FinanceParts";
import { inr, longDate } from "../finance/financeUtils";

const PAN_PATTERN = "[A-Z]{5}[0-9]{4}[A-Z]";
const REGISTRATION_TYPES = ["Public charitable trust", "Registered society", "Section 8 company", "Religious endowment"];
const DESIGNATIONS = ["Chairman", "President", "Vice President", "Secretary", "Treasurer", "Managing Trustee", "Trustee"];

const PROFILE_FIELDS = [
  "name", "name_kn", "registration_type", "registration_number", "registered_on",
  "address", "address_kn", "phone", "email", "website",
  "pan", "tan", "gstin",
  "reg_12a_number", "reg_12a_valid_from", "reg_12a_valid_until",
  "reg_80g_number", "reg_80g_valid_from", "reg_80g_valid_until", "show_80g_on_receipts",
  "receipt_signatory", "receipt_signatory_title", "receipt_footer", "receipt_footer_kn",
];

const emptyTrustee = {
  id: null,
  name: "",
  name_kn: "",
  designation: "Trustee",
  designation_kn: "",
  phone: "",
  email: "",
  address: "",
  pan: "",
  appointed_on: "",
  term_ends_on: "",
  is_active: true,
  position: 0,
  notes: "",
};

function toForm(record, fields) {
  return Object.fromEntries(fields.map((field) => [field, typeof record?.[field] === "boolean" ? record[field] : record?.[field] ?? ""]));
}

const upperCodes = (name, value) => (["pan", "tan", "gstin"].includes(name) ? value.toUpperCase().replace(/\s/g, "") : value);

// How a registration stands today: valid, expiring within 90 days, expired, or not entered
function registrationState(number, until) {
  if (!number) return { tone: "neutral", label: "Not entered" };
  if (!until) return { tone: "success", label: "Entered" };
  const days = Math.round((new Date(`${until}T00:00:00`) - new Date(`${dateKey()}T00:00:00`)) / 86400000);
  if (days < 0) return { tone: "danger", label: `Expired ${longDate(until)}` };
  if (days <= 90) return { tone: "warning", label: `Expires ${longDate(until)}` };
  return { tone: "success", label: `Valid until ${longDate(until)}` };
}

function TrusteeEditor({ initial, token, notify, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : upperCodes(name, value) }));
  };

  const save = async (event) => {
    event.preventDefault();
    const body = { ...form, position: Number(form.position) || 0 };
    if (!body.id) delete body.id;
    setBusy(true);
    try {
      const data = await apiRequest("/admin/trustees", { method: "POST", token, body });
      notify("success", form.id ? "Trustee updated" : "Trustee added", data.trustee.name);
      onSaved();
    } catch (err) {
      notify("error", "Could not save the trustee", err.message);
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${form.name} from the trustees? Mark a past trustee as not serving instead, to keep the record.`)) return;
    setBusy(true);
    try {
      await apiRequest(`/admin/trustees/${form.id}`, { method: "DELETE", token });
      notify("success", "Trustee removed", form.name);
      onSaved();
    } catch (err) {
      notify("error", "Could not remove the trustee", err.message);
      setBusy(false);
    }
  };

  return (
    <Drawer
      open
      title={form.id ? "Edit trustee" : "New trustee"}
      subtitle="Only admins see contact details and PAN. The name and designation may appear on the website."
      onClose={onClose}
      footer={
        <>
          {form.id ? (
            <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={remove} disabled={busy} style={{ marginRight: "auto", color: "var(--c-danger)" }}>
              <Trash2 size={15} aria-hidden="true" />
              Remove
            </button>
          ) : null}
          <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form="trustee-form" className={cx(styles.btn, styles.btnPrimary)} disabled={busy}>
            {busy ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : null}
            Save trustee
          </button>
        </>
      }
    >
      <form id="trustee-form" onSubmit={save} style={{ display: "grid", gap: "1rem" }}>
        <div className={own.inlineFields}>
          <Field label="Name in English">
            <input className={styles.input} name="name" value={form.name} onChange={update} required minLength={2} maxLength={120} autoComplete="off" />
          </Field>
          <Field label="Name in Kannada" aside="Optional">
            <input className={styles.input} name="name_kn" value={form.name_kn} onChange={update} maxLength={120} lang="kn" autoComplete="off" />
          </Field>
        </div>
        <div className={own.inlineFields}>
          <Field label="Designation">
            <input className={styles.input} name="designation" value={form.designation} onChange={update} required minLength={2} maxLength={80} list="trustee-designations" />
            <datalist id="trustee-designations">
              {DESIGNATIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </Field>
          <Field label="Designation in Kannada" aside="Optional">
            <input className={styles.input} name="designation_kn" value={form.designation_kn} onChange={update} maxLength={80} lang="kn" />
          </Field>
        </div>
        <div className={own.inlineFields}>
          <Field label="Phone" aside="Optional">
            <input className={styles.input} type="tel" name="phone" value={form.phone} onChange={update} minLength={8} maxLength={20} autoComplete="off" />
          </Field>
          <Field label="Email" aside="Optional">
            <input className={styles.input} type="email" name="email" value={form.email} onChange={update} maxLength={120} autoComplete="off" />
          </Field>
        </div>
        <Field label="PAN" aside="Optional">
          <input className={cx(styles.input, styles.mono)} name="pan" value={form.pan} onChange={update} pattern={PAN_PATTERN} maxLength={10} placeholder="ABCDE1234F" title="10 characters, like ABCDE1234F" autoComplete="off" />
        </Field>
        <Field label="Address" aside="Optional">
          <textarea className={styles.textarea} name="address" value={form.address} onChange={update} maxLength={1000} rows={2} />
        </Field>
        <div className={own.inlineFields}>
          <Field label="Appointed on" aside="Optional">
            <input className={styles.input} type="date" name="appointed_on" value={form.appointed_on} onChange={update} />
          </Field>
          <Field label="Term ends on" aside="Optional">
            <input className={styles.input} type="date" name="term_ends_on" value={form.term_ends_on} onChange={update} min={form.appointed_on || undefined} />
          </Field>
        </div>
        <Field label="Order" hint="Lower numbers are listed first">
          <input className={styles.input} type="number" name="position" min="0" max="1000" value={form.position} onChange={update} />
        </Field>
        <Switch name="is_active" checked={form.is_active} onChange={update} title="Currently serving" description="Past trustees stay on record but are not shown on the website." />
        <Field label="Office notes" aside="Optional">
          <textarea className={styles.textarea} name="notes" value={form.notes} onChange={update} maxLength={2000} rows={2} placeholder="Only admins see these notes" />
        </Field>
      </form>
    </Drawer>
  );
}

// Paid donations of one financial year, in the column order of the Form 10BD bulk upload template
function Form10bdExport({ trust, token, notify }) {
  const years = useMemo(() => {
    const current = donationFinancialYear(dateKey());
    return [0, 1, 2].map((back) => donationFinancialYear(`${Number(current.from.slice(0, 4)) - back}-04-01`));
  }, []);
  const [yearLabel, setYearLabel] = useState(years[1].label);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);
  const year = years.find((item) => item.label === yearLabel);

  const exportYear = async () => {
    setBusy(true);
    try {
      const data = await apiRequest(`/finance/income?source=donation&from_date=${year.from}&to_date=${year.to}`, { token });
      const donations = (data.entries || []).map((entry) => entry.donation).filter(Boolean);
      const withPan = donations.filter((donation) => donation.pan);
      const mode = (channel) => (channel === "cash" ? "Cash" : channel === "other" ? "Others" : "Electronic modes including account payee cheque/draft");
      downloadCsv(`form-10bd-${year.label}.csv`, [
        ["Sr. No.", "ID Code", "Unique Identification Number", "Section Code", "Unique Registration Number (URN)", "Name of donor", "Address of donor", "Donation Type", "Mode of receipt", "Amount of donation (Indian rupees)", "Receipt no.", "Date received"],
        ...withPan.map((donation, index) => [
          index + 1,
          "Permanent Account Number",
          donation.pan,
          "Section 80G",
          trust.reg_80g_number,
          donation.donor_name,
          donation.donor_address,
          "Others",
          mode(donation.channel),
          donation.amount,
          donation.receipt_number,
          donation.donated_on,
        ]),
      ]);
      setSummary({
        year: year.label,
        exported: withPan.length,
        exportedTotal: withPan.reduce((sum, donation) => sum + donation.amount, 0),
        missing: donations.length - withPan.length,
        missingTotal: donations.filter((donation) => !donation.pan).reduce((sum, donation) => sum + donation.amount, 0),
      });
    } catch (err) {
      notify("error", "Could not export the donations", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="Form 10BD data">
      <div className={styles.panelBody} style={{ display: "grid", gap: "1rem" }}>
        <p className={styles.muted} style={{ margin: 0 }}>
          The yearly statement of donations, due on the income-tax portal by 31 May. Donors receive their Form 10BE certificates from the portal once it is filed. Donations without a PAN are left out, since they cannot be reported against a donor.
        </p>
        <div className={styles.pageActions}>
          <label className={styles.field} style={{ minWidth: "10rem" }}>
            <span className={styles.label}>Financial year</span>
            <select className={styles.select} value={yearLabel} onChange={(event) => setYearLabel(event.target.value)}>
              {years.map((item) => (
                <option key={item.label} value={item.label}>
                  FY {item.label} (due {longDate(item.form10beDue)})
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={exportYear} disabled={busy || !trust.reg_80g_number} style={{ alignSelf: "end" }}>
            {busy ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : <Download size={15} aria-hidden="true" />}
            Export CSV
          </button>
        </div>
        {!trust.reg_80g_number ? <span className={styles.hint}>Save the 80G registration number first; every row of the statement carries it.</span> : null}
        {summary ? (
          <p className={styles.hint} role="status" style={{ margin: 0 }}>
            FY {summary.year}: {summary.exported} {summary.exported === 1 ? "donation" : "donations"} exported ({inr(summary.exportedTotal)}).
            {summary.missing ? ` ${summary.missing} without a PAN left out (${inr(summary.missingTotal)}).` : ""}
          </p>
        ) : null}
      </div>
    </Panel>
  );
}

export default function TrustProfilePage({ token, notify }) {
  const [saved, setSaved] = useState(null);
  const [form, setForm] = useState(null);
  const [trustees, setTrustees] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/admin/trust", { token })
      .then((data) => {
        if (!active) return;
        setSaved(data.trust);
        setForm((current) => current || toForm(data.trust, PROFILE_FIELDS));
        setTrustees(data.trustees || []);
      })
      .catch((err) => {
        if (!active) return;
        setTrustees((current) => current || []);
        notify("error", "Could not load the trust profile", err.message);
      });
    return () => {
      active = false;
    };
  }, [notify, token, reload]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : upperCodes(name, value) }));
  };

  const dirty = form && saved && PROFILE_FIELDS.some((field) => String(form[field] ?? "") !== String(saved[field] ?? ""));
  const can80g = Boolean(form?.pan && form?.reg_80g_number);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = await apiRequest("/admin/trust", { method: "PUT", token, body: { ...form, show_80g_on_receipts: form.show_80g_on_receipts && can80g } });
      setSaved(data.trust);
      setForm(toForm(data.trust, PROFILE_FIELDS));
      forgetTrust();
      notify("success", "Trust profile saved", "Receipts now print these details.");
    } catch (err) {
      notify("error", "Could not save the trust profile", err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeEditor = useCallback(() => setEditing(null), []);

  if (!form) {
    return (
      <Page>
        <PageHeader title={sectionMeta.trust.label} description={sectionMeta.trust.text} />
        <Panel>{trustees ? <EmptyState icon={Landmark} title="The trust profile could not be loaded" text="Check the connection to the server and reload the page." /> : <SkeletonRows rows={6} columns={[30, 50]} />}</Panel>
      </Page>
    );
  }

  const state12a = registrationState(saved.reg_12a_number, saved.reg_12a_valid_until);
  const state80g = registrationState(saved.reg_80g_number, saved.reg_80g_valid_until);
  const addTrustee = (
    <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm)} onClick={() => setEditing({ ...emptyTrustee, position: trustees.length })}>
      <Plus size={14} aria-hidden="true" />
      Add trustee
    </button>
  );

  return (
    <div className={own.financeRoot}>
      <Page>
        <PageHeader
          title={sectionMeta.trust.label}
          description={sectionMeta.trust.text}
          actions={
            <button type="submit" form="trust-form" className={cx(styles.btn, styles.btnPrimary)} disabled={saving || !dirty}>
              {saving ? <Loader2 size={15} className={styles.spin} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {dirty ? "Save changes" : "Saved"}
            </button>
          }
        />

        <form id="trust-form" onSubmit={save} style={{ display: "contents" }}>
          <Panel title="Trust details">
            <div className={styles.panelBody}>
              <FormSection title="Name and registration" description="Printed at the top of every receipt.">
                <Field label="Name in English" wide>
                  <input className={styles.input} name="name" value={form.name} onChange={update} required minLength={2} maxLength={200} />
                </Field>
                <Field label="Name in Kannada" aside="Recommended" wide>
                  <input className={styles.input} name="name_kn" value={form.name_kn} onChange={update} maxLength={200} lang="kn" />
                </Field>
                <Field label="Registered as" aside="Optional">
                  <input className={styles.input} name="registration_type" value={form.registration_type} onChange={update} maxLength={80} list="registration-types" />
                  <datalist id="registration-types">
                    {REGISTRATION_TYPES.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Registration number" aside="Optional">
                  <input className={cx(styles.input, styles.mono)} name="registration_number" value={form.registration_number} onChange={update} maxLength={80} />
                </Field>
                <Field label="Registered on" aside="Optional">
                  <input className={styles.input} type="date" name="registered_on" value={form.registered_on} onChange={update} max={dateKey()} />
                </Field>
              </FormSection>
              <FormSection title="Contact" description="Shown on receipts so donors can reach the office.">
                <Field label="Address in English" aside="Optional" wide>
                  <textarea className={styles.textarea} name="address" value={form.address} onChange={update} maxLength={1000} rows={2} />
                </Field>
                <Field label="Address in Kannada" aside="Optional" wide>
                  <textarea className={styles.textarea} name="address_kn" value={form.address_kn} onChange={update} maxLength={1000} rows={2} lang="kn" />
                </Field>
                <Field label="Phone" aside="Optional">
                  <input className={styles.input} type="tel" name="phone" value={form.phone} onChange={update} maxLength={40} />
                </Field>
                <Field label="Email" aside="Optional">
                  <input className={styles.input} type="email" name="email" value={form.email} onChange={update} maxLength={120} />
                </Field>
                <Field label="Website" aside="Optional">
                  <input className={styles.input} name="website" value={form.website} onChange={update} maxLength={200} placeholder="https://" />
                </Field>
              </FormSection>
            </div>
          </Panel>

          <Panel title="Income tax">
            <div className={styles.panelBody}>
              <FormSection title="Tax numbers">
                <Field label="PAN of the trust" aside="Needed for 80G">
                  <input className={cx(styles.input, styles.mono)} name="pan" value={form.pan} onChange={update} pattern={PAN_PATTERN} maxLength={10} placeholder="AAATA1234A" title="10 characters, like AAATA1234A" autoComplete="off" />
                </Field>
                <Field label="TAN" aside="Optional">
                  <input className={cx(styles.input, styles.mono)} name="tan" value={form.tan} onChange={update} pattern="[A-Z]{4}[0-9]{5}[A-Z]" maxLength={10} placeholder="BLRA12345A" title="10 characters, like BLRA12345A" autoComplete="off" />
                </Field>
                <Field label="GSTIN" aside="Optional">
                  <input className={cx(styles.input, styles.mono)} name="gstin" value={form.gstin} onChange={update} pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]" maxLength={15} title="15 characters, like 29AAATA1234A1Z5" autoComplete="off" />
                </Field>
              </FormSection>

              <FormSection title="12A / 12AB registration" description="Exempts the trust's own income from tax.">
                <Field label="Registration number" aside={<Badge tone={state12a.tone}>{state12a.label}</Badge>} wide>
                  <input className={cx(styles.input, styles.mono)} name="reg_12a_number" value={form.reg_12a_number} onChange={update} maxLength={80} />
                </Field>
                <Field label="Valid from" aside="Optional">
                  <input className={styles.input} type="date" name="reg_12a_valid_from" value={form.reg_12a_valid_from} onChange={update} />
                </Field>
                <Field label="Valid until" aside="Optional">
                  <input className={styles.input} type="date" name="reg_12a_valid_until" value={form.reg_12a_valid_until} onChange={update} min={form.reg_12a_valid_from || undefined} />
                </Field>
              </FormSection>

              <FormSection title="80G registration" description="Lets donors claim a tax deduction. The approval gives assessment years: AY 2027-28 to AY 2031-32 covers donations from 1 Apr 2026 to 31 Mar 2031.">
                <Field label="Registration number (URN)" aside={<Badge tone={state80g.tone}>{state80g.label}</Badge>} wide>
                  <input className={cx(styles.input, styles.mono)} name="reg_80g_number" value={form.reg_80g_number} onChange={update} maxLength={80} />
                </Field>
                <Field label="Covers donations from" aside="Optional">
                  <input className={styles.input} type="date" name="reg_80g_valid_from" value={form.reg_80g_valid_from} onChange={update} />
                </Field>
                <Field label="Covers donations until" aside="Optional">
                  <input className={styles.input} type="date" name="reg_80g_valid_until" value={form.reg_80g_valid_until} onChange={update} min={form.reg_80g_valid_from || undefined} />
                </Field>
                <div className={styles.fieldWide}>
                  <Switch
                    name="show_80g_on_receipts"
                    checked={form.show_80g_on_receipts && can80g}
                    onChange={(event) => (can80g ? update(event) : notify("error", "Add the PAN and 80G number first", "Receipts cannot claim 80G without both."))}
                    title="Show 80G on donation receipts"
                    description={
                      can80g
                        ? "Receipts print the trust PAN and 80G number, and tell donors how to claim with Form 10BE. Donations outside the dates above are marked as not qualifying."
                        : "Enter the trust PAN and the 80G registration number to turn this on."
                    }
                  />
                </div>
              </FormSection>
            </div>
          </Panel>

          <Panel title="Receipts">
            <div className={styles.panelBody}>
              <FormSection title="Signature and closing line" description="Printed at the foot of donation receipts. Leave blank to use the standard wording.">
                <Field label="Signed by" aside="Optional">
                  <input className={styles.input} name="receipt_signatory" value={form.receipt_signatory} onChange={update} maxLength={120} placeholder="Name of the authorised signatory" />
                </Field>
                <Field label="Signatory title" aside="Optional">
                  <input className={styles.input} name="receipt_signatory_title" value={form.receipt_signatory_title} onChange={update} maxLength={120} placeholder="Secretary" />
                </Field>
                <Field label="Closing line in English" aside="Optional" wide>
                  <input className={styles.input} name="receipt_footer" value={form.receipt_footer} onChange={update} maxLength={500} />
                </Field>
                <Field label="Closing line in Kannada" aside="Optional" wide>
                  <input className={styles.input} name="receipt_footer_kn" value={form.receipt_footer_kn} onChange={update} maxLength={500} lang="kn" />
                </Field>
              </FormSection>
            </div>
          </Panel>
        </form>

        <Panel title="Trustees" meta={trustees.filter((trustee) => trustee.is_active).length} action={trustees.length ? addTrustee : null}>
          {trustees.length ? (
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Contact</th>
                    <th>Term</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trustees.map((trustee) => (
                    <tr key={trustee.id} className={styles.rowClickable} onClick={() => setEditing(toForm(trustee, ["id", ...Object.keys(emptyTrustee).filter((key) => key !== "id")]))}>
                      <td>
                        <div className={styles.cellStack}>
                          <strong className={styles.cellMain}>{trustee.name}</strong>
                          {trustee.name_kn ? <span lang="kn">{trustee.name_kn}</span> : null}
                        </div>
                      </td>
                      <td data-label="Designation">{trustee.designation}</td>
                      <td data-label="Contact">
                        <div className={styles.cellStack}>
                          <span className={styles.cellPrimary}>{trustee.phone || "—"}</span>
                          {trustee.email ? <span>{trustee.email}</span> : null}
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Term">
                        {trustee.appointed_on || trustee.term_ends_on ? `${trustee.appointed_on ? longDate(trustee.appointed_on) : "—"} to ${trustee.term_ends_on ? longDate(trustee.term_ends_on) : "present"}` : "—"}
                      </td>
                      <td data-label="Status">{trustee.is_active ? <Badge tone="success">Serving</Badge> : <Badge plain>Past</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={UsersRound} title="No trustees yet" text="Add the members of the trust's board with their designations and terms." action={addTrustee} />
          )}
        </Panel>

        <Form10bdExport trust={saved} token={token} notify={notify} />

        {editing ? (
          <TrusteeEditor
            key={editing.id || "new"}
            initial={editing}
            token={token}
            notify={notify}
            onClose={closeEditor}
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
