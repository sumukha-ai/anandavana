import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const AUTH_STORAGE_KEY = "agadi_auth";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

function loadStoredAuth() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

async function postAuthRequest(path, body, fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || payload?.message || fallbackMessage);
  }

  return {
    token: payload.data.access_token,
    user: payload.data.user,
  };
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const persistAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const nextAuth = await postAuthRequest(
      "/auth/login",
      { email, password },
      "Unable to log in"
    );
    persistAuth(nextAuth);
    return nextAuth;
  }, [persistAuth]);

  const register = useCallback(async ({ username, email, password }) => {
    const nextAuth = await postAuthRequest(
      "/auth/register",
      { username, email, password },
      "Unable to register"
    );
    persistAuth(nextAuth);
    return nextAuth;
  }, [persistAuth]);

  const logout = useCallback(() => {
    persistAuth(null);
  }, [persistAuth]);

  const value = useMemo(() => ({
    token: auth?.token || null,
    user: auth?.user || null,
    isAuthenticated: Boolean(auth?.token && auth?.user),
    login,
    register,
    logout,
  }), [auth, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}