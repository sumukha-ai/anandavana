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

// Writes a plain, printable receipt for a received donation into a new window
export function printDonationReceipt(donation, targetWindow) {
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
  .thanks { margin-top: 28px; color: #52525b; font-size: 13px; line-height: 1.6; }
  .sign { margin-top: 48px; display: flex; justify-content: flex-end; font-size: 13px; color: #52525b; }
  .sign span { border-top: 1px solid #a1a1aa; padding-top: 6px; min-width: 180px; text-align: center; }
  @media print { body { padding: 0; } .sheet { border: 0; } }
</style></head>
<body><div class="sheet">
  <h1>${SAMSTHANA}</h1>
  <p class="sub">${ADDRESS}</p>
  <p class="title">Donation receipt</p>
  <p class="amount">${escapeHtml(inr(donation.amount))}</p>
  <table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</table>
  <p class="thanks">With gratitude for your offering. May the blessings of the Sadguru be with you and your family.</p>
  <div class="sign"><span>For ${SAMSTHANA}</span></div>
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
