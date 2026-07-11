import { API_BASE_URL } from "../api/client";

export const FRONT_PAGE_CONTACT_PHONE = "+91 97415 85030";

export function sevaContactPhone(seva) {
  return seva?.contact_phone || FRONT_PAGE_CONTACT_PHONE;
}

export function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

export function formatAmount(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return "";
  return `INR ${numericAmount.toLocaleString("en-IN")}`;
}

export function sevaImageUrl(seva, fallbackImage) {
  const source = seva?.photo_url || seva?.image_url || seva?.photo || "";
  if (!source) return fallbackImage;
  if (/^https?:\/\//i.test(source) || source.startsWith("data:")) return source;
  return new URL(source, API_BASE_URL).toString();
}
