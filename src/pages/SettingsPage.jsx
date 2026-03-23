import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

function SettingsPage() {
  const { user, roles, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Refresh "me" payload (roles are usually public and cached).
      const { res, payload } = await apiRequest("/auth/me", {
        method: "GET",
        auth: true,
      });
      if (!res.ok || payload?.success === false) {
        setError(payload?.message || "Failed to refresh profile");
        return;
      }
      const next = payload?.data ?? payload;
      setProfile(next);
    } catch {
      setError("Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-3 text-2xl font-black">Settings</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Profile</h2>
            <button
              type="button"
              disabled={loading || !accessToken}
              onClick={handleRefresh}
              className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {profile ? (
            <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs">
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-black/60">No profile data</div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-3 text-lg font-bold">Roles</h2>
          {roles?.length ? (
            <ul className="space-y-2">
              {roles.map((r) => {
                const name = r?.name ?? r?.slug ?? r?.id ?? "—";
                return (
                  <li key={r?.id ?? name} className="rounded-lg border border-black/10 p-3 text-sm">
                    <div className="font-bold">{name}</div>
                    <div className="text-xs text-black/50">
                      {r?.slug ? `slug: ${r.slug}` : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-black/60">No roles</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;