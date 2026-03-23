const ACCESS_TOKEN_KEY = "bt_access_token";
const REFRESH_TOKEN_KEY = "bt_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function extractTokensFromLoginResponse(payload) {
  // Backend response shape is not fully described in OpenAPI (schema: {}),
  // so we accept several common token key variants.
  const data = payload?.data ?? payload;
  const accessToken =
    data?.access_token ??
    data?.accessToken ??
    data?.token ??
    payload?.access_token ??
    payload?.accessToken;
  const refreshToken =
    data?.refresh_token ??
    data?.refreshToken ??
    payload?.refresh_token ??
    payload?.refreshToken;

  return { accessToken, refreshToken };
}

