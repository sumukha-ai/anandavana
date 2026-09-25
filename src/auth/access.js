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

// Where to send someone after sign-in: the page they were headed to, if their role may open it
export function getPostLoginPath(role, lang = "en", from) {
  const home = getRoleHomePath(role, lang);
  const pathname = from?.pathname;
  if (!pathname || /^\/[^/]+\/(login|register|unauthorized)(\/|$)/.test(pathname)) return home;
  const area = pathname.match(/^\/[^/]+\/(admin|manager|priest)(\/|$)/)?.[1];
  if (area && !(ROLE_AREAS[normalizeRole(role)] || []).includes(area)) return home;
  return `${pathname}${from.search || ""}${from.hash || ""}`;
}
