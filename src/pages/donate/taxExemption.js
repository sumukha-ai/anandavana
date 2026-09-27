import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";

// Cash above this amount is not deductible under section 80G
export const CASH_LIMIT_80G = 2000;

// The trust's public details (name, address, PAN, 80G registration), loaded once per language.
// Admins edit them under Trust profile; receipts claim 80G only when trust.tax_80g is present.
const trustRequests = {};

export function loadTrust(lang = "en") {
  if (!trustRequests[lang]) {
    trustRequests[lang] = apiRequest("/trust", { lang }).catch((err) => {
      delete trustRequests[lang];
      throw err;
    });
  }
  return trustRequests[lang];
}

// Call after the admin saves the profile so the next receipt shows the new details
export function forgetTrust() {
  Object.keys(trustRequests).forEach((key) => delete trustRequests[key]);
}

// The trust details, or null while loading or when they could not be loaded
export function useTrust(lang = "en") {
  const [trust, setTrust] = useState(null);
  useEffect(() => {
    let active = true;
    loadTrust(lang)
      .then((data) => active && setTrust(data.trust))
      .catch(() => {
        /* receipts fall back to the fixed Samsthana details */
      });
    return () => {
      active = false;
    };
  }, [lang]);
  return trust;
}

// Indian financial year (April to March) of a donation, and the date Form 10BE is due to the donor
export function donationFinancialYear(value) {
  const match = /^(\d{4})-(\d{2})/.exec(String(value || ""));
  if (!match) return null;
  const year = Number(match[1]);
  const startYear = Number(match[2]) >= 4 ? year : year - 1;
  return {
    label: `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`,
    from: `${startYear}-04-01`,
    to: `${startYear + 1}-03-31`,
    form10beDue: `${startYear + 1}-05-31`,
  };
}

// Whether a received donation can be claimed under 80G: "eligible", "no-pan", "cash-over-limit"
// or "outside-validity". null when the trust's receipts do not claim 80G.
export function eligibility80G(donation, trust) {
  const tax = trust?.tax_80g;
  if (!tax || !donation) return null;
  const day = String(donation.donated_on || donation.created_at || "").slice(0, 10);
  if (day && ((tax.valid_from && day < tax.valid_from) || (tax.valid_until && day > tax.valid_until))) return "outside-validity";
  if (donation.channel === "cash" && Number(donation.amount) > CASH_LIMIT_80G) return "cash-over-limit";
  if (!donation.pan) return "no-pan";
  return "eligible";
}
