import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../api/client";

const AUTH_STORAGE_KEY = "agadi_auth";

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
    throw new Error(error.message || fallbackMessage, { cause: error });
  }
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

  const register = useCallback(async (registrationPayload) => {
    const result = await postAuthRequest(
      "/auth/register",
      registrationPayload,
      "Unable to register"
    );
    if (result.token) {
      persistAuth(result);
    }
    return result;
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
