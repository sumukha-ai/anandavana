import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { sevaImageUrl } from "../sevaHelpers";
import { parseISODate } from "../shop/shopUtils";
import templeCourtyard from "../../../assets/seva/temple-courtyard.webp";
import kshetraView from "../../../assets/seva/kshetra-view.webp";
import devoteesGathering from "../../../assets/seva/devotees-gathering.webp";

// Labels for the staff console; the public site uses the bilingual events.category.* translations
export const EVENT_CATEGORY_LABELS = {
  festival: "Festival",
  regional: "Regional festival",
  utsava: "Utsava",
  special: "Special pooja",
  other: "Other",
};

const FALLBACK_IMAGES = [kshetraView, devoteesGathering, templeCourtyard];

export function eventCover(event) {
  const index = Math.abs(Number(event?.id) || 0) % FALLBACK_IMAGES.length;
  return sevaImageUrl({ photo_url: event?.cover_image_url }, FALLBACK_IMAGES[index]);
}

export function eventImageUrl(url) {
  return sevaImageUrl({ photo_url: url }, "");
}

function intl(lang, options) {
  return new Intl.DateTimeFormat(lang === "kn" ? "kn-IN" : "en-IN", options);
}

// "14 Sept 2026", "14 – 16 Sept 2026", "30 Sept – 2 Oct 2026"
export function formatEventRange(event, lang = "en") {
  const start = parseISODate(event?.start_date);
  if (!start) return "";
  const end = parseISODate(event?.end_date);
  const full = { day: "numeric", month: "short", year: "numeric" };
  if (!end || end.getTime() === start.getTime()) return intl(lang, full).format(start);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const startText = intl(lang, sameMonth ? { day: "numeric" } : sameYear ? { day: "numeric", month: "short" } : full).format(start);
  return `${startText} – ${intl(lang, full).format(end)}`;
}

export function dateBadge(event, lang = "en") {
  const start = parseISODate(event?.start_date);
  if (!start) return { day: "", month: "" };
  return {
    day: intl(lang, { day: "numeric" }).format(start),
    month: intl(lang, { month: "short" }).format(start),
    weekday: intl(lang, { weekday: "short" }).format(start),
  };
}

export function eventDayCount(event) {
  const start = parseISODate(event?.start_date);
  const end = parseISODate(event?.end_date);
  if (!start || !end) return 1;
  return Math.round((end - start) / 86400000) + 1;
}

// Days until the event starts; negative once it has started. Null when there is no date.
export function daysUntil(event, today) {
  const start = parseISODate(event?.start_date);
  const base = parseISODate(today) || new Date(new Date().setHours(0, 0, 0, 0));
  if (!start) return null;
  return Math.round((start - base) / 86400000);
}

export function isHappeningNow(event, today) {
  const start = parseISODate(event?.start_date);
  const end = parseISODate(event?.end_date) || start;
  const base = parseISODate(today);
  return Boolean(start && base && start <= base && base <= end);
}

export function isLink(value) {
  return /^https?:\/\/\S+$/i.test(String(value || "").trim());
}

export function useEventList(lang, when) {
  const [events, setEvents] = useState([]);
  const [today, setToday] = useState(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setStatus("loading");
      try {
        const data = await apiRequest(`/events?when=${when}`, { lang });
        if (!active) return;
        setEvents(data.events || []);
        setToday(data.today || null);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [lang, when, attempt]);

  return { events, today, status, retry: () => setAttempt((n) => n + 1) };
}

export function useEvent(ref, lang) {
  const [event, setEvent] = useState(null);
  const [today, setToday] = useState(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setStatus("loading");
      try {
        const data = await apiRequest(`/events/${encodeURIComponent(ref)}`, { lang });
        if (!active) return;
        setEvent(data.event);
        setToday(data.today || null);
        setStatus("ready");
      } catch (err) {
        if (active) setStatus(err.status === 404 ? "missing" : "error");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [ref, lang, attempt]);

  return { event, today, status, retry: () => setAttempt((n) => n + 1) };
}

export const EVENT_IMAGE_LIMIT = 10;

export function useGalleryAlbums(lang) {
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setStatus("loading");
      try {
        const data = await apiRequest("/gallery", { lang });
        if (!active) return;
        setAlbums(data.albums || []);
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

  return { albums, status, retry: () => setAttempt((n) => n + 1) };
}
