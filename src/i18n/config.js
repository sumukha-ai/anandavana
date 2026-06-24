export const SUPPORTED_LANGS = ["en", "kn"];
export const DEFAULT_LANG = "en";

export function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
}