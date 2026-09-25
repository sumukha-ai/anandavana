import { dateKey, parseDateKey } from "../rolePortalConfig";

export const DONATION_CHANNEL_LABELS = {
  online: "Online",
  cash: "Cash",
  cheque: "Cheque",
  upi: "UPI",
  bank_transfer: "Bank transfer",
  card: "Card",
  other: "Other",
};

// Rupees with paise only when there are paise, grouped the Indian way (1,00,000)
export function inr(value) {
  const amount = Number(value || 0);
  const hasPaise = Math.round(amount * 100) % 100 !== 0;
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: hasPaise ? 2 : 0, maximumFractionDigits: 2 })}`;
}

export function longDate(key) {
  if (!key) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parseDateKey(key));
}

function fyStartYear(date) {
  return date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
}

// The periods offered everywhere in Finance. Financial years run April to March.
export function periodPresets(today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const fy = fyStartYear(today);
  const todayKey = dateKey(today);
  return [
    { value: "this-month", label: "This month", from: dateKey(new Date(y, m, 1)), to: todayKey },
    { value: "last-month", label: "Last month", from: dateKey(new Date(y, m - 1, 1)), to: dateKey(new Date(y, m, 0)) },
    { value: "this-fy", label: `FY ${fy}-${String(fy + 1).slice(-2)}`, from: `${fy}-04-01`, to: todayKey },
    { value: "last-fy", label: `FY ${fy - 1}-${String(fy).slice(-2)}`, from: `${fy - 1}-04-01`, to: `${fy}-03-31` },
  ];
}

export function resolvePeriod(period) {
  if (period.preset === "custom") return { from: period.from, to: period.to };
  const preset = periodPresets().find((item) => item.value === period.preset) || periodPresets()[0];
  return { from: preset.from, to: preset.to };
}

export function periodLabel(period) {
  if (period.preset === "custom") return `${longDate(period.from)} – ${longDate(period.to)}`;
  return (periodPresets().find((item) => item.value === period.preset) || periodPresets()[0]).label;
}

export function rangeQuery({ from, to }, extra = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from_date", from);
  if (to) params.set("to_date", to);
  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") params.set(key, value);
  });
  return params.toString();
}
