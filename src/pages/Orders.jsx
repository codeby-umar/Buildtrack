import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";

function Orders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverByOrder, setDriverByOrder] = useState({});
  const [actionError, setActionError] = useState(null);

  const orderItems = useMemo(() => {
    return Array.isArray(orders) ? orders : orders?.items ?? [];
  }, [orders]);

  const getOrderId = (order) => {
    return order?.id ?? order?.order_id ?? order?.orderId ?? null;
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setActionError(null);
      try {
        const [ordersRes, driversRes] = await Promise.all([
          apiRequest("/orders", { method: "GET", auth: true }),
          apiRequest("/drivers", { method: "GET", auth: true }),
        ]);
        if (cancelled) return;

        if (!ordersRes.res.ok || ordersRes.payload?.success === false) {
          setError(ordersRes.payload?.message || "Failed to load orders");
          return;
        }
        if (!driversRes.res.ok || driversRes.payload?.success === false) {
          // Drivers list is optional for viewing orders.
          setDrivers([]);
        } else {
          setDrivers(driversRes.payload?.data ?? driversRes.payload?.items ?? driversRes.payload);
        }

        setOrders(ordersRes.payload?.data ?? ordersRes.payload?.items ?? ordersRes.payload ?? []);
      } catch {
        if (!cancelled) setError("Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const reloadOrders = async () => {
    const { res, payload } = await apiRequest("/orders", {
      method: "GET",
      auth: true,
    });
    if (res.ok && payload?.success !== false) {
      setOrders(payload?.data ?? payload?.items ?? payload ?? []);
    }
  };

  const handleAssignDriver = async (order) => {
    const orderId = getOrderId(order);
    const driverId = driverByOrder[orderId];
    if (!orderId || !driverId) return;

    setActionError(null);
    const { res, payload } = await apiRequest(
      `/orders/${orderId}/assign-driver`,
      {
        method: "POST",
        auth: true,
        body: { driver_id: driverId },
      }
    );

    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to assign driver");
      return;
    }
    await reloadOrders();
  };

  const handleCancelOrder = async (order) => {
    const orderId = getOrderId(order);
    if (!orderId) return;
    const reason = window.prompt("Cancel reason (optional):", "") ?? "";

    setActionError(null);
    const { res, payload } = await apiRequest(`/orders/${orderId}/cancel`, {
      method: "POST",
      auth: true,
      body: { reason: reason.trim() ? reason.trim() : null },
    });
    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to cancel order");
      return;
    }
    await reloadOrders();
  };

  return (
    <div>
      <h1 className="mb-3 text-2xl font-black">Orders</h1>

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
            Total: {orderItems.length}
          </div>

          {orderItems.length === 0 ? (
            <div className="rounded-lg bg-black/5 p-4 text-sm text-black/60">
              No orders
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-[900px] border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase text-black/50">
                    <th className="border-b border-black/10 p-2">ID</th>
                    <th className="border-b border-black/10 p-2">Status</th>
                    <th className="border-b border-black/10 p-2">Assign driver</th>
                    <th className="border-b border-black/10 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((order, idx) => {
                    const orderId = getOrderId(order);
                    const status = order?.status ?? order?.state ?? "—";
                    const selected = driverByOrder[orderId] ?? "";

                    return (
                      <tr key={orderId ?? idx} className="align-top">
                        <td className="border-b border-black/10 p-2 text-sm font-mono">
                          {orderId ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm">
                          {String(status)}
                        </td>
                        <td className="border-b border-black/10 p-2">
                          <select
                            className="h-9 w-full rounded-lg border border-black/10 bg-white px-2 text-sm"
                            value={selected}
                            onChange={(e) =>
                              setDriverByOrder((prev) => ({
                                ...prev,
                                [orderId]: e.target.value,
                              }))
                            }
                            disabled={drivers.length === 0 || !orderId}
                          >
                            <option value="">Select driver</option>
                            {drivers.map((d) => {
                              const dId = d?.id ?? d?.driver_id ?? d?.driverId;
                              const label =
                                d?.full_name ??
                                d?.name ??
                                d?.email ??
                                dId ??
                                "Driver";
                              return (
                                <option key={dId ?? label} value={dId}>
                                  {label}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="border-b border-black/10 p-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90 disabled:opacity-60"
                              onClick={() => handleAssignDriver(order)}
                              disabled={!orderId || !selected}
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-500/20 disabled:opacity-60"
                              onClick={() => handleCancelOrder(order)}
                              disabled={!orderId}
                            >
                              Cancel
                            </button>
                          </div>
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

export default Orders;