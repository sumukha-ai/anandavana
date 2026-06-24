import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "./config";

export default function LangRouteGuard() {
  const { lang } = useParams();
  const location = useLocation();

  if (!SUPPORTED_LANGS.includes(lang)) {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return <Navigate to={`/${DEFAULT_LANG}`} replace />;
    segments[0] = DEFAULT_LANG;
    return <Navigate to={`/${segments.join("/")}${location.search}${location.hash}`} replace />;
  }

  return <Outlet />;
}