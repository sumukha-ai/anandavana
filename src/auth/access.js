export const USER_ROLES = ["admin", "manager", "priest", "bhakta"];

export function normalizeRole(role) {
  const roleMap = {
    Admin: "admin",
    Manager: "manager",
    Priest: "priest",
    User: "bhakta",
    Bhakta: "bhakta",
  };
  return roleMap[role] || role;
}

export function getRoleHomePath(role, lang = "en") {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "admin") return `/${lang}/admin`;
  if (normalizedRole === "manager") return `/${lang}/manager`;
  if (normalizedRole === "priest") return `/${lang}/priest`;
  return `/${lang}/dashboard`;
}

const ROLE_AREAS = {
  admin: ["admin", "manager", "priest"],
  manager: ["manager", "priest"],
  priest: ["priest"],
  bhakta: [],
};

// Where to send someone after sign-in: the page they were headed to, if their role may open it.
// Staff always land in their console unless they were headed to a console page they may open.
export function getPostLoginPath(role, lang = "en", from) {
  const home = getRoleHomePath(role, lang);
  const pathname = from?.pathname;
  if (!pathname || /^\/[^/]+\/(login|register|unauthorized)(\/|$)/.test(pathname)) return home;
  const areas = ROLE_AREAS[normalizeRole(role)] || [];
  const area = pathname.match(/^\/[^/]+\/(admin|manager|priest)(\/|$)/)?.[1];
  if (area ? !areas.includes(area) : areas.length > 0) return home;
  return `${pathname}${from.search || ""}${from.hash || ""}`;
}
