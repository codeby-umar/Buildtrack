import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";

function WarehousePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [actionError, setActionError] = useState(null);

  const deliveryItems = useMemo(() => {
    return Array.isArray(deliveries) ? deliveries : deliveries?.items ?? [];
  }, [deliveries]);

  const getDeliveryId = (d) => d?.id ?? d?.delivery_id ?? d?.deliveryId ?? null;

  const load = async () => {
    const { res, payload } = await apiRequest("/deliveries", {
      method: "GET",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setError(payload?.message || "Failed to load deliveries");
      return;
    }
    setDeliveries(payload?.data ?? payload?.items ?? payload ?? []);
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        await load();
      } catch {
        if (!cancelled) setError("Failed to load deliveries");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    setActionError(null);
    try {
      await load();
    } catch {
      // ignore
    }
  };

  const handleMarkDelivered = async (delivery) => {
    const deliveryId = getDeliveryId(delivery);
    if (!deliveryId) return;
    setActionError(null);
    const { res, payload } = await apiRequest(
      `/deliveries/${deliveryId}/delivered`,
      { method: "POST", auth: true, body: {} }
    );
    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to mark delivered");
      return;
    }
    await reload();
  };

  return (
    <div>
      <h1 className="mb-3 text-2xl font-black">Warehouse</h1>

      {actionError && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-sm font-bold text-black/60">
            Total: {deliveryItems.length}
          </div>
          {deliveryItems.length === 0 ? (
            <div className="rounded-lg bg-black/5 p-4 text-sm text-black/60">
              No deliveries
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-[900px] border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase text-black/50">
                    <th className="border-b border-black/10 p-2">ID</th>
                    <th className="border-b border-black/10 p-2">Status</th>
                    <th className="border-b border-black/10 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryItems.map((d, idx) => {
                    const id = getDeliveryId(d);
                    const status = d?.status ?? d?.state ?? "—";
                    return (
                      <tr key={id ?? idx} className="align-top">
                        <td className="border-b border-black/10 p-2 text-sm font-mono">
                          {id ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm">
                          {String(status)}
                        </td>
                        <td className="border-b border-black/10 p-2">
                          <button
                            type="button"
                            className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90 disabled:opacity-60"
                            onClick={() => handleMarkDelivered(d)}
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
      )}
    </div>
  );
}

export default WarehousePage;