import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Languages,
  LayoutDashboard,
  ListChecks,
  UserRoundPlus,
  Users,
} from "lucide-react";

export const roleCopy = {
  admin: {
    title: "Admin workspace",
    text: "Manage staff access, seva catalog content, bookings, calendar visibility, users, and Jyotisha references.",
  },
  manager: {
    title: "Manager workspace",
    text: "Review bookings, seva availability, user accounts, and daily operational schedules.",
  },
  priest: {
    title: "Priest workspace",
    text: "Track booked sevas, upcoming ritual dates, and seva catalog details in one focused view.",
  },
};

export const sectionMeta = {
  overview: { label: "Overview", text: "Today at a glance.", icon: LayoutDashboard, eyebrow: "Workspace", group: "Home" },
  staff: { label: "Staff logins", text: "Create sign-in accounts for managers and priests.", icon: UserRoundPlus, eyebrow: "Access", group: "Access" },
  "seva-editor": { label: "Seva editor", text: "Add a seva or change its name, amount, description, and online booking.", icon: ListChecks, eyebrow: "Catalog", group: "Catalog" },
  sevas: { label: "Seva catalog", text: "Every seva offered at the kshetra, as devotees see it.", icon: ClipboardList, eyebrow: "Catalog", group: "Catalog" },
  bookings: { label: "Booked sevas", text: "Bookings, payment status, and income for the dates you choose.", icon: CalendarDays, eyebrow: "Operations", group: "Operations" },
  calendar: { label: "Seva calendar", text: "Booked sevas by day. Open a date to see who each seva is for.", icon: CalendarCheck, eyebrow: "Schedule", group: "Operations" },
  "calendar-detail": { label: "Seva day details", text: "Everything the priests need for each seva on this date.", icon: CalendarCheck, eyebrow: "Schedule", group: "Operations" },
  users: { label: "User accounts", text: "Registered devotees and staff accounts.", icon: Users, eyebrow: "People", group: "Access" },
  lookups: { label: "Jyotisha references", text: "Rashi and Nakshatra names in English and Kannada, used in devotee profiles.", icon: Languages, eyebrow: "Rashi and Nakshatra", group: "Catalog" },
};

export function getMenuItems(role) {
  const base = ["overview", "bookings", "calendar", "sevas"];
  if (role === "admin") {
    return ["overview", "staff", "seva-editor", "bookings", "calendar", "sevas", "users", "lookups"];
  }
  if (role === "manager") {
    return [...base, "users"];
  }
  return base;
}

export function getGroupedMenuItems(role) {
  return getMenuItems(role).reduce((groups, item) => {
    const group = sectionMeta[item].group;
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function displayLookup(item, lang) {
  if (!item) return "";
  return lang === "kn" ? item.name_kn : item.name;
}

export function formatAmount(amount) {
  const numericAmount = Number(amount);
  if (amount === null || amount === undefined || amount === "" || !(numericAmount > 0)) return "Offline";
  return `INR ${numericAmount.toLocaleString("en-IN")}`;
}

export function groupBookings(bookings) {
  return bookings.reduce((groups, booking) => {
    const key = booking.seva_date || "Unscheduled";
    if (!groups[key]) groups[key] = [];
    groups[key].push(booking);
    return groups;
  }, {});
}

export function statusToneKey(status) {
  const value = String(status || "pending").toLowerCase();
  if (["paid", "success", "completed", "captured"].includes(value)) return "statusPaid";
  if (["failed", "cancelled", "canceled"].includes(value)) return "statusFailed";
  return "statusPending";
}
