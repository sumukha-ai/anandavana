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
