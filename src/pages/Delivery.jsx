import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

function Delivery() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  const list = useMemo(() => {
    return Array.isArray(deliveries) ? deliveries : deliveries?.items ?? [];
  }, [deliveries]);

  const getDeliveryId = (d) => d?.id ?? d?.delivery_id ?? d?.deliveryId ?? null;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { res, payload } = await apiRequest("/deliveries", {
        method: "GET",
        auth: true,
      });
      if (!res.ok || payload?.success === false) {
        setError(payload?.message || "Failed to load deliveries");
        return;
      }
      setDeliveries(payload?.data ?? payload?.items ?? payload ?? []);
    } catch {
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const markDelivered = async (d) => {
    const id = getDeliveryId(d);
    if (!id) return;
    setActionError(null);
    const { res, payload } = await apiRequest(
      `/deliveries/${id}/delivered`,
      { method: "POST", auth: true, body: {} }
    );
    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to mark delivered");
      return;
    }
    await load();
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-2 text-2xl font-black">Delivery</h1>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          Please login to view deliveries.
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
      <h1 className="mb-3 text-2xl font-black">Delivery</h1>

      {actionError && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}
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
          <table className="min-w-[740px] border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase text-black/50">
                <th className="border-b border-black/10 p-2">ID</th>
                <th className="border-b border-black/10 p-2">Status</th>
                <th className="border-b border-black/10 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d, idx) => {
                const id = getDeliveryId(d);
                return (
                  <tr key={id ?? idx} className="align-top">
                    <td className="border-b border-black/10 p-2 text-sm font-mono">
                      {id ?? "—"}
                    </td>
                    <td className="border-b border-black/10 p-2 text-sm">
                      {d?.status ?? d?.state ?? "—"}
                    </td>
                    <td className="border-b border-black/10 p-2">
                      <button
                        type="button"
                        className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90 disabled:opacity-60"
                        onClick={() => markDelivered(d)}
                        disabled={!id}
                      >
                        Mark delivered
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Delivery;