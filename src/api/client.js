export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    token,
    body,
    lang,
    headers: customHeaders = {},
  } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (lang === "kn") {
    url.searchParams.set("lang", "kn");
  }

  const headers = { ...customHeaders };
  let requestBody = body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: requestBody,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }
  return payload.data;
}
