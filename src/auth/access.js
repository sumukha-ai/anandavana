export const USER_ROLES = ["Admin", "Manager", "Priest", "User"];

export function getRoleHomePath(role, lang = "en") {
  if (role === "Admin") return `/${lang}/admin`;
  if (role === "Manager") return `/${lang}/manager`;
  if (role === "Priest") return `/${lang}/priest`;
  return `/${lang}/dashboard`;
}