import { CASH_LIMIT_80G, donationFinancialYear, eligibility80G } from "../../donate/taxExemption";
import { DONATION_CHANNEL_LABELS, inr, longDate } from "./financeUtils";

const SAMSTHANA = "Sri Sheshachala Sadguru Samsthana (R)";
const ADDRESS = "Anandavana, SH 2, Agadi, Haveri - 581128, Karnataka";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

// Pass a window opened during the click when printing after an await, so pop-up blockers allow it
export function openReceiptWindow() {
  return window.open("", "_blank", "width=720,height=900");
}

// Writes a plain, printable receipt for a received donation into a new window.
// `trust` is the public trust profile; without it the fixed Samsthana details are printed.
export function printDonationReceipt(donation, targetWindow, trust) {
  const samsthana = trust?.name || SAMSTHANA;
  const address = trust?.address || ADDRESS;
  const rows = [
    ["Receipt number", donation.receipt_number],
    ["Date received", longDate(donation.donated_on)],
    ["Received from", donation.donor_name],
    ["Address", donation.donor_address],
    ["PAN", donation.pan],
    ["Towards", donation.fund?.name],
    ["Dedication", donation.dedication],
    ["Mode", DONATION_CHANNEL_LABELS[donation.channel] || donation.channel],
    ["Payment reference", donation.payment_reference],
  ].filter(([, value]) => value);

  const tax = trust?.tax_80g;
  const taxStatus = eligibility80G(donation, trust);
  const financialYear = donationFinancialYear(donation.donated_on);
  const taxRows = taxStatus
    ? [
        ["Samsthana PAN", trust.pan],
        ["80G registration no.", tax.registration_number],
        ["80G registration valid", tax.valid_from || tax.valid_until ? `${tax.valid_from ? longDate(tax.valid_from) : ""} – ${tax.valid_until ? longDate(tax.valid_until) : ""}` : ""],
      ].filter(([, value]) => value)
    : [];
  const taxNote = {
    eligible: financialYear
      ? `This donation qualifies for deduction under section 80G. It will be reported in Form 10BD, and the Form 10BE certificate for FY ${financialYear.label} will be issued by ${longDate(financialYear.form10beDue)}.`
      : "",
    "no-pan": "No PAN was given, so this donation cannot be reported for deduction under section 80G.",
    "cash-over-limit": `Cash donations above ${inr(CASH_LIMIT_80G)} do not qualify for deduction under section 80G.`,
    "outside-validity": "This donation was received outside the period of the Samsthana's 80G registration, so it does not qualify for deduction under section 80G.",
  }[taxStatus];

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Receipt ${escapeHtml(donation.receipt_number)}</title>
<style>
  body { font-family: Inter, "Noto Sans Kannada", system-ui, sans-serif; color: #18181b; margin: 0; padding: 40px; }
  .sheet { max-width: 620px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px; }
  h1 { font-size: 18px; margin: 0; }
  .sub { color: #52525b; font-size: 13px; margin: 4px 0 0; }
  .title { margin: 28px 0 18px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #c2410c; font-weight: 700; }
  .amount { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 9px 0; border-top: 1px solid #f0f0f2; vertical-align: top; }
  td:first-child { color: #6b6b74; width: 42%; }
  .tax { margin-top: 24px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b6b74; font-weight: 700; }
  .taxNote { margin-top: 10px; color: #52525b; font-size: 13px; line-height: 1.6; }
  .thanks { margin-top: 28px; color: #52525b; font-size: 13px; line-height: 1.6; }
  .sign { margin-top: 48px; display: flex; justify-content: flex-end; font-size: 13px; color: #52525b; }
  .sign span { border-top: 1px solid #a1a1aa; padding-top: 6px; min-width: 180px; text-align: center; }
  @media print { body { padding: 0; } .sheet { border: 0; } }
</style></head>
<body><div class="sheet">
  <h1>${escapeHtml(samsthana)}</h1>
  <p class="sub">${escapeHtml(address)}</p>
  ${trust?.registration_number ? `<p class="sub">Regd. no. ${escapeHtml(trust.registration_number)}</p>` : ""}
  <p class="title">Donation receipt</p>
  <p class="amount">${escapeHtml(inr(donation.amount))}</p>
  <table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</table>
  ${taxStatus ? `<p class="tax">Income tax (section 80G)</p>
  <table>${taxRows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</table>
  ${taxNote ? `<p class="taxNote">${escapeHtml(taxNote)}</p>` : ""}` : ""}
  <p class="thanks">${escapeHtml(trust?.receipt_footer || "With gratitude for your offering. May the blessings of the Sadguru be with you and your family.")}</p>
  <div class="sign"><span>${trust?.receipt_signatory ? `${escapeHtml(trust.receipt_signatory)}<br>` : ""}${escapeHtml(trust?.receipt_signatory_title || `For ${samsthana}`)}</span></div>
</div>
<script>window.onload = function () { window.print(); };</script>
</body></html>`;

  const receiptWindow = targetWindow || openReceiptWindow();
  if (!receiptWindow) return false;
  receiptWindow.document.open();
  receiptWindow.document.write(html);
  receiptWindow.document.close();
  return true;
}
