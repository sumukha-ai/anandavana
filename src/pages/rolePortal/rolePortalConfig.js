import {
  BookUser,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  HandCoins,
  HeartHandshake,
  Images,
  Landmark,
  PartyPopper,
  Languages,
  LayoutDashboard,
  SquarePen,
  Users,
  Wallet,
} from "lucide-react";

export const roleCopy = {
  admin: {
    title: "Admin workspace",
    text: "Staff access, the seva catalog, bookings, the calendar, income and donations, and accounts.",
  },
  manager: {
    title: "Manager workspace",
    text: "Bookings, seva availability, staff and the daily schedule.",
  },
  priest: {
    title: "Priest workspace",
    text: "Booked sevas, upcoming ritual dates and seva details.",
  },
};

export const sectionMeta = {
  overview: { label: "Overview", text: "Today at a glance.", icon: LayoutDashboard, group: "Home" },
  bookings: { label: "Seva Calendar", text: "The seva calendar, and who each seva is for on the days you choose.", icon: CalendarDays, group: "Operations" },
  // Merged into "bookings"; kept for old links to /calendar
  calendar: { label: "Seva calendar", text: "Booked sevas by day. Open a date to see who each seva is for.", icon: CalendarCheck, group: "Operations" },
  bhaktas: { label: "Bhaktas", text: "Every registered devotee. Search by name or phone, and open one to see their family, sevas and donations.", icon: BookUser, group: "Operations" },
  "bhakta-detail": { label: "Bhakta", text: "Profile, family and the full history of sevas and donations.", icon: BookUser, group: "Operations" },
  "calendar-detail": { label: "Seva day", text: "Everything the priests need for each seva on this date.", icon: CalendarCheck, group: "Operations" },
  sevas: { label: "Seva catalog", text: "Every seva offered at the kshetra, as devotees see it.", icon: ClipboardList, group: "Catalog" },
  "seva-editor": { label: "Seva editor", text: "Add a seva or change its name, amount, description and online booking.", icon: SquarePen, group: "Catalog" },
  events: { label: "Events", text: "Festivals and utsavas shown on the public events page, with dates, photos and details.", icon: PartyPopper, group: "Catalog" },
  "event-editor": { label: "Event editor", text: "The fixed event template: dates, description, highlights, extra details and photos.", icon: PartyPopper, group: "Catalog" },
  gallery: { label: "Gallery", text: "Up to 10 photos per event, each with an optional description. They appear on the public Gallery page.", icon: Images, group: "Catalog" },
  "gallery-event": { label: "Event photos", text: "Add, describe, order and remove the photos of one event.", icon: Images, group: "Catalog" },
  lookups: { label: "Jyotisha references", text: "Rashi and Nakshatra names in English and Kannada, used in devotee profiles.", icon: Languages, group: "Catalog" },
  finance: { label: "Finance", text: "All income in one place: seva bookings and donations, online and at the counter.", icon: Wallet, group: "Finance" },
  "finance-seva-entry": { label: "Add seva entry", text: "A seva booked and paid for at the kshetra.", icon: CalendarDays, group: "Finance" },
  "finance-donation-entry": { label: "Add donation entry", text: "A donation received at the kshetra, with its receipt.", icon: HandCoins, group: "Finance" },
  "finance-causes": { label: "Donation causes", text: "The causes devotees can give to on the Donate page, with suggested amounts and optional targets.", icon: HeartHandshake, group: "Finance" },
  trust: { label: "Trust profile", text: "The trust's registration, contact and income-tax details printed on receipts, its trustees, and the yearly Form 10BD data.", icon: Landmark, group: "Access" },
  "staff-new": { label: "Add staff", text: "Create a sign-in account for a manager or priest.", icon: Users, group: "Access" },
  staff: { label: "Staffs", text: "Everyone who can sign in to this console: admins, managers and priests.", icon: Users, group: "Access" },
};

export function getMenuItems(role) {
  // Overview is switched off for now, and the seva calendar lives on the booked sevas page
  if (role === "admin") {
    return [/* "overview", */ "bookings", "bhaktas", "sevas", /* "seva-editor", */ "events", "gallery", /* "lookups", */ "finance", "trust", "staff"];
  }
  if (role === "manager") {
    return [/* "overview", */ "bookings", "bhaktas", "sevas", "events", "gallery", "staff"];
  }
  return [/* "overview", */ "bookings", "sevas"];
}

export function getGroupedMenuItems(role) {
  return getMenuItems(role).reduce((groups, item) => {
    const group = sectionMeta[item].group;
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function sectionPath(lang, role, section) {
  // With Overview off, the workspace root opens the booked sevas page
  if (section === "overview") return `/${lang}/${role}/bookings`;
  return `/${lang}/${role}/${section}`;
}

export function displayLookup(item, lang) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return lang === "kn" ? item.name_kn || item.name : item.name || item.name_kn;
}

export function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function formatAmount(amount) {
  const numericAmount = Number(amount);
  if (amount === null || amount === undefined || amount === "" || !(numericAmount > 0)) return "Offline";
  return money(numericAmount);
}

export function groupBookings(bookings) {
  return bookings.reduce((groups, booking) => {
    const key = booking.seva_date || "Unscheduled";
    if (!groups[key]) groups[key] = [];
    groups[key].push(booking);
    return groups;
  }, {});
}

export function isPaidStatus(status) {
  return ["paid", "success", "completed", "captured"].includes(String(status || "").toLowerCase());
}

export function statusTone(status) {
  const value = String(status || "pending").toLowerCase();
  if (isPaidStatus(value)) return "success";
  if (["failed", "cancelled", "canceled"].includes(value)) return "danger";
  return "warning";
}

export function statusLabel(status) {
  const value = String(status || "pending").toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key) {
  return new Date(`${String(key).slice(0, 10)}T00:00:00`);
}

export function shortDate(key, options = { day: "numeric", month: "short" }) {
  if (!key) return "Unscheduled";
  const date = parseDateKey(key);
  if (Number.isNaN(date.getTime())) return String(key);
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

export function relativeDay(key) {
  if (!key) return "";
  const today = parseDateKey(dateKey());
  const diff = Math.round((parseDateKey(key) - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < -1 && diff > -7) return `${-diff} days ago`;
  return "";
}

export function downloadCsv(filename, rows) {
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
