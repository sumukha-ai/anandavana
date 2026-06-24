import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { translations } from "./translations";
import { DEFAULT_LANG, normalizeLang } from "./config";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function useI18n(namespace) {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);

  const dict = translations[lang] || translations[DEFAULT_LANG];
  const fallback = translations[DEFAULT_LANG];

  const t = useMemo(() => {
    return (key, fallbackValue = key) => {
      const namespacedKey = namespace ? `${namespace}.${key}` : key;
      return (
        getNestedValue(dict, namespacedKey) ??
        getNestedValue(fallback, namespacedKey) ??
        fallbackValue
      );
    };
  }, [dict, fallback, namespace]);

  return { lang, t };
}