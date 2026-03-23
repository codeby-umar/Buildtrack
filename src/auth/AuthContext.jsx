/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { apiGet } from "../api/apiClient";
import {
  clearTokens,
  extractTokensFromLoginResponse,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./authStorage";

const AuthContext = createContext(null);

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!accessToken;

  const refreshMe = async () => {
    const { payload } = await apiGet("/auth/me", { auth: true });
    if (payload?.success === false) return;
    // OpenAPI schema is empty, so just store the raw data.
    setUser(payload?.data ?? payload);
  };

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setAccessToken(getAccessToken());
        setRefreshToken(getRefreshToken());

        // Roles endpoint seems public, so we fetch it regardless.
        const rolesRes = await apiGet("/auth/roles", { auth: false });
        if (cancelled) return;
        setRoles(rolesRes?.payload?.data ?? []);

        if (cancelled) return;
        if (getAccessToken()) {
          await refreshMe();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await parseJsonSafe(res);
    if (!res.ok || payload?.success === false) {
      return { success: false, error: payload?.message || "Invalid credentials" };
    }

    const tokens = extractTokensFromLoginResponse(payload);
    if (!tokens?.accessToken) {
      // Some backends wrap tokens elsewhere; fallback to raw payload.
      return {
        success: false,
        error: "Login succeeded but token format is unknown",
      };
    }

    setTokens(tokens);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken ?? null);

    await refreshMe().catch(() => {});
    return { success: true };
  };

  const logout = () => {
    clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = {
    accessToken,
    refreshToken,
    user,
    roles,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

