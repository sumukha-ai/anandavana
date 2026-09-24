import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { sevaImageUrl } from "../sevaHelpers";
import templeCourtyard from "../../../assets/seva/temple-courtyard.webp";
import devoteesGathering from "../../../assets/seva/devotees-gathering.webp";
import templeSide from "../../../assets/seva/temple-side.webp";
import kshetraView from "../../../assets/seva/kshetra-view.webp";

export const OFFICE_PHONE = "+91 97415 85030";
export const OFFICE_TEL = "tel:+919741585030";

const FALLBACK_IMAGES = [templeCourtyard, kshetraView, devoteesGathering, templeSide];

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function hasPrice(amount) {
  return Number(amount) > 0;
}

export function formatPrice(amount) {
  return hasPrice(amount) ? priceFormatter.format(Number(amount)) : "";
}

// Seva records rarely carry photos yet; rotate real photographs of the kshetra so the grid never repeats one image
export function sevaImage(seva) {
  const index = Math.abs(Number(seva?.id) || 0) % FALLBACK_IMAGES.length;
  return sevaImageUrl(seva, FALLBACK_IMAGES[index]);
}

export function isVisibleSeva(seva) {
  return seva?.enabled !== false;
}

export function isBookableOnline(seva) {
  return Boolean(seva?.is_bookable) && isVisibleSeva(seva);
}

export function interpolate(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value) {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, lang = "en", options = { day: "numeric", month: "long", year: "numeric" }) {
  const date = parseISODate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "kn" ? "kn-IN" : "en-IN", options).format(date);
}

export function paymentState(status) {
  const value = String(status || "pending").toLowerCase();
  if (["paid", "success", "completed", "captured"].includes(value)) return "paid";
  if (["failed", "cancelled", "canceled", "expired"].includes(value)) return "failed";
  return "pending";
}

export function lookupName(item, lang) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return lang === "kn" ? item.name_kn || item.name : item.name || item.name_kn;
}

export function gotraName(profile, lang) {
  if (!profile) return "";
  return lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra;
}

export function useSevas(lang) {
  const [sevas, setSevas] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setStatus("loading");
      try {
        const data = await apiRequest("/seva", { lang });
        if (!active) return;
        setSevas((data.sevas || []).filter(isVisibleSeva));
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [lang, attempt]);

  return { sevas, status, retry: () => setAttempt((n) => n + 1) };
}

export function useDevoteeProfiles(token, lang) {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState(token ? "loading" : "idle");

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    async function load() {
      try {
        const [profileData, familyData] = await Promise.all([
          apiRequest("/bhakta/profile", { token, lang }),
          apiRequest("/family_member", { token, lang }),
        ]);
        if (!active) return;
        setProfiles([profileData.profile, ...(familyData.family_members || [])].filter(Boolean));
        setStatus("ready");
      } catch {
        if (active) {
          setProfiles([]);
          setStatus("error");
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [token, lang]);

  return { profiles, status };
}

export function useBookings(token, lang) {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setStatus("loading");
      try {
        const data = await apiRequest("/booked_sevas", { token, lang });
        if (!active) return;
        setBookings(data.booked_sevas || []);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [token, lang, attempt]);

  return { bookings, status, retry: () => setAttempt((n) => n + 1) };
}
