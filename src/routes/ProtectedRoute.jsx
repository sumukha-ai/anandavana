import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);

  if (!isAuthenticated) {
    return <Navigate to={`/${lang}/login`} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${lang}/unauthorized`} replace />;
  }

  return <Outlet />;
}