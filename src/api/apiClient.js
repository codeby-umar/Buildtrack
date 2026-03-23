import { API_BASE_URL } from "../config";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  extractTokensFromLoginResponse,
  clearTokens,
} from "../auth/authStorage";

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return { accessToken: null, refreshToken: null };

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok || !payload?.success) {
    clearTokens();
    return { accessToken: null, refreshToken: null };
  }

  const tokens = extractTokensFromLoginResponse(payload);
  setTokens(tokens);
  return tokens;
}

export async function apiRequest(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const doRequest = async (accessToken) => {
    const res = await fetch(url, {
      method,
      headers: {
        ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "Content-Type": body ? "application/json" : undefined,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await parseJsonSafe(res);
    return { res, payload };
  };

  const accessToken = getAccessToken();
  const { res, payload } = await doRequest(accessToken);
  if (res.status !== 401 || !auth) {
    return { res, payload };
  }

  // Try refresh once.
  const tokens = await refreshAccessToken();
  if (!tokens?.accessToken) return { res, payload };

  const retry = await doRequest(tokens.accessToken);
  return retry;
}

export async function apiGet(path, options) {
  return apiRequest(path, { method: "GET", ...options });
}

export async function apiPost(path, body, options) {
  return apiRequest(path, { method: "POST", body, ...options });
}

