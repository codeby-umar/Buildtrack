import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

function Companies() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { res, payload } = await apiRequest("/companies", {
        method: "GET",
        auth: true,
      });
      if (!res.ok || payload?.success === false) {
        setError(payload?.message || "Failed to load companies");
        return;
      }
      setItems(payload?.data ?? payload?.items ?? payload ?? []);
    } catch {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const list = useMemo(() => {
    return Array.isArray(items) ? items : items?.items ?? [];
  }, [items]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-2 text-2xl font-black">Companies</h1>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          Please login to view company data.
          <button
            type="button"
            className="ml-3 rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90"
            onClick={() => navigate("/login")}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-3 text-2xl font-black">Companies</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-sm font-bold text-black/60">
            Total: {list.length}
          </div>
          <table className="min-w-[840px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase text-black/50">
                <th className="border-b border-black/10 p-2">ID</th>
                <th className="border-b border-black/10 p-2">Name</th>
                <th className="border-b border-black/10 p-2">Slug</th>
                <th className="border-b border-black/10 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, idx) => (
                <tr key={c?.id ?? idx} className="align-top">
                  <td className="border-b border-black/10 p-2 text-sm font-mono">
                    {c?.id ?? "—"}
                  </td>
                  <td className="border-b border-black/10 p-2 text-sm font-bold">
                    {c?.name ?? "—"}
                  </td>
                  <td className="border-b border-black/10 p-2 text-sm">
                    {c?.slug ?? "—"}
                  </td>
                  <td className="border-b border-black/10 p-2 text-sm">
                    {c?.status ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Companies;