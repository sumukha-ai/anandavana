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
  overview: { label: "Overview", icon: LayoutDashboard, eyebrow: "Workspace", group: "Home" },
  staff: { label: "Staff logins", icon: UserRoundPlus, eyebrow: "Access", group: "Access" },
  "seva-editor": { label: "Seva editor", icon: ListChecks, eyebrow: "Catalog", group: "Catalog" },
  sevas: { label: "Seva catalog", icon: ClipboardList, eyebrow: "Catalog", group: "Catalog" },
  bookings: { label: "Booked sevas", icon: CalendarDays, eyebrow: "Operations", group: "Operations" },
  calendar: { label: "Seva calendar", icon: CalendarCheck, eyebrow: "Schedule", group: "Operations" },
  "calendar-detail": { label: "Seva day details", icon: CalendarCheck, eyebrow: "Schedule", group: "Operations" },
  users: { label: "User accounts", icon: Users, eyebrow: "People", group: "Access" },
  lookups: { label: "Jyotisha references", icon: Languages, eyebrow: "Rashi and Nakshatra", group: "Catalog" },
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
  if (amount === null || amount === undefined || amount === "") return "Offline";
  return `INR ${amount}`;
}

export function groupBookings(bookings) {
  return bookings.reduce((groups, booking) => {
    const key = booking.seva_date || "Unscheduled";
    if (!groups[key]) groups[key] = [];
    groups[key].push(booking);
    return groups;
  }, {});
}
