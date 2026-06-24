export function withLang(lang, path = "") {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}