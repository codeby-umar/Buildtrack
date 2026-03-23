import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

function PremiumRental() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const items = useMemo(() => {
    return Array.isArray(products) ? products : products?.items ?? [];
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { res, payload } = await apiRequest(
          `/catalog/products?page=1&page_size=12&is_premium=true`,
          { method: "GET", auth: false }
        );
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setError(payload?.message || "Failed to load premium products");
          return;
        }
        setProducts(payload?.data ?? payload?.items ?? payload ?? []);
      } catch {
        if (!cancelled) setError("Failed to load premium products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = async (productId) => {
    if (!isAuthenticated || !productId) return;
    const { res, payload } = await apiRequest(`/cart/items`, {
      method: "POST",
      auth: true,
      body: { product_id: productId, quantity: 1 },
    });
    if (!res.ok || payload?.success === false) {
      alert(payload?.message || "Failed to add to cart");
      return;
    }
    alert("Added to cart");
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-3 text-2xl font-black">Premium / Rental</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const id = p?.id ?? p?.product_id ?? p?.uuid ?? null;
            const title = p?.name ?? p?.title ?? p?.slug ?? "Product";
            const img = p?.image ?? p?.thumbnail ?? null;
            return (
              <div
                key={id ?? title}
                className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="h-44 bg-black/5">
                  {img ? (
                    <img
                      src={img}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-black/50">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-bold">{title}</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90"
                      disabled={!id}
                      onClick={() =>
                        navigate(`/product/${id}`, { state: { product: p } })
                      }
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-60"
                      disabled={!id || !isAuthenticated}
                      onClick={() => addToCart(id)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PremiumRental;