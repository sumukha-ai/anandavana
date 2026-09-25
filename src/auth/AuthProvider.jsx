import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest, SESSION_EXPIRED_EVENT, setAuthToken } from "../api/client";

const AUTH_STORAGE_KEY = "agadi_auth";

// Reads the JWT `exp` claim; tokens we cannot read are trusted until the server rejects them
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function loadStoredAuth() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (!stored?.token || !stored?.user || isTokenExpired(stored.token)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

async function postAuthRequest(path, body, fallbackMessage) {
  try {
    const data = await apiRequest(path, {
      method: "POST",
      body,
    });

    if (data?.requires_otp) {
      return data;
    }

    return {
      token: data.access_token,
      user: data.user,
      profile: data.profile,
    };
  } catch (error) {
    const authError = new Error(error.message || fallbackMessage, { cause: error });
    authError.status = error.status;
    authError.code = error.code;
    throw authError;
  }
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedAuth = loadStoredAuth();
    setAuthToken(storedAuth?.token || null);
    return storedAuth;
  });
  // Why the last session ended, so the sign-in page can say so: "signed-out" | "expired" | null
  const [endReason, setEndReason] = useState(null);

  const persistAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    setAuthToken(nextAuth?.token || null);
    if (nextAuth) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // The server rejected our token: drop the session instead of leaving a half-signed-in UI
  useEffect(() => {
    const handleExpired = () => {
      if (!window.localStorage.getItem(AUTH_STORAGE_KEY)) return;
      persistAuth(null);
      setEndReason("expired");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [persistAuth]);

  // Keep every open tab on the same session
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== AUTH_STORAGE_KEY) return;
      const nextAuth = loadStoredAuth();
      setAuth(nextAuth);
      setAuthToken(nextAuth?.token || null);
      if (!nextAuth) setEndReason("signed-out");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const nextAuth = await postAuthRequest(
      "/auth/login",
      { email, password },
      "Unable to log in"
    );
    persistAuth(nextAuth);
    setEndReason(null);
    return nextAuth;
  }, [persistAuth]);

  const register = useCallback(async (registrationPayload) => {
    const result = await postAuthRequest(
      "/auth/register",
      registrationPayload,
      "Unable to register"
    );
    if (result.token) {
      persistAuth(result);
      setEndReason(null);
    }
    return result;
  }, [persistAuth]);

  const logout = useCallback(() => {
    persistAuth(null);
    setEndReason("signed-out");
  }, [persistAuth]);

  const clearEndReason = useCallback(() => setEndReason(null), []);

  const value = useMemo(() => ({
    token: auth?.token || null,
    user: auth?.user || null,
    isAuthenticated: Boolean(auth?.token && auth?.user),
    endReason,
    clearEndReason,
    login,
    register,
    logout,
  }), [auth, endReason, clearEndReason, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
