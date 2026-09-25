import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

const AUTH_STORAGE_KEY = "agadi_auth";

function getStoredToken() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored)?.token || null : null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

axiosInstance.interceptors.request.use((config) => {
  const token = config.token || getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  delete config.token;
  return config;
});

// Fired when the server rejects a stored token; AuthProvider listens and signs the user out
export const SESSION_EXPIRED_EVENT = "agadi:session-expired";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const networkError = new Error("We could not reach the Samsthana server. Please check your internet connection and try again.");
      networkError.code = "network";
      return Promise.reject(networkError);
    }
    const { status, data: payload } = error.response;
    const sentToken = Boolean(error.config?.headers?.Authorization);
    if (status === 401 && sentToken) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
    const apiError = new Error(payload?.error || payload?.message || "Something went wrong. Please try again in a moment.");
    apiError.status = status;
    return Promise.reject(apiError);
  }
);

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    token,
    body,
    lang,
    headers: customHeaders = {},
  } = options;

  const response = await axiosInstance.request({
    url: path,
    method,
    data: body,
    params: lang === "kn" ? { lang: "kn" } : undefined,
    headers: customHeaders,
    token,
  });

  const payload = response.data;
  if (!payload?.success) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }
  return payload.data;
}
