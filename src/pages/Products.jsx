import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";
import { API_BASE_URL } from "../config";
import { getAccessToken } from "../auth/authStorage";

function Products() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const [create, setCreate] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    unit: "pcs",
    sku: "",
    is_active: true,
    is_premium: false,
    is_rental: false,
    category_id: "",
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [update, setUpdate] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    unit: "",
    sku: "",
    is_active: true,
    is_premium: false,
    is_rental: false,
    category_id: "",
  });

  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  const productItems = useMemo(() => {
    return Array.isArray(products) ? products : products?.items ?? [];
  }, [products]);

  const getProductId = (p) => p?.id ?? p?.product_id ?? p?.productId ?? null;

  const load = async () => {
    const { res, payload } = await apiRequest("/products", {
      method: "GET",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setError(payload?.message || "Failed to load products");
      return;
    }
    setProducts(payload?.data ?? payload?.items ?? payload ?? []);
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        await load();
      } catch {
        if (!cancelled) setError("Failed to load products");
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

  const toNumberOrNull = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const toNullIfEmpty = (v) => (v === "" ? null : v);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionError(null);
    setCreateSubmitting(true);
    try {
      const body = {
        name: create.name,
        slug: create.slug,
        description: toNullIfEmpty(create.description),
        price: toNumberOrNull(create.price),
        discount_price: toNumberOrNull(create.discount_price),
        stock_quantity:
          create.stock_quantity === "" ? null : Number(create.stock_quantity),
        unit: toNullIfEmpty(create.unit) ?? "pcs",
        sku: toNullIfEmpty(create.sku),
        category_id: toNullIfEmpty(create.category_id),
        is_active: !!create.is_active,
        is_premium: !!create.is_premium,
        is_rental: !!create.is_rental,
      };
      const { res, payload } = await apiRequest("/products", {
        method: "POST",
        auth: true,
        body,
      });
      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Failed to create product");
        return;
      }
      await reload();
      setCreate({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount_price: "",
        stock_quantity: "",
        unit: "pcs",
        sku: "",
        is_active: true,
        is_premium: false,
        is_rental: false,
        category_id: "",
      });
    } finally {
      setCreateSubmitting(false);
    }
  };

  const startEdit = (p) => {
    const id = getProductId(p);
    if (!id) return;
    setEditingId(id);
    setUpdate({
      name: p?.name ?? p?.title ?? "",
      slug: p?.slug ?? "",
      description: p?.description ?? "",
      price: p?.price ?? "",
      discount_price: p?.discount_price ?? p?.discountPrice ?? "",
      stock_quantity: p?.stock_quantity ?? p?.stockQuantity ?? "",
      unit: p?.unit ?? "",
      sku: p?.sku ?? "",
      is_active: p?.is_active ?? true,
      is_premium: p?.is_premium ?? false,
      is_rental: p?.is_rental ?? false,
      category_id: p?.category_id ?? "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setActionError(null);
    setUpdateSubmitting(true);
    try {
      const body = {
        name: toNullIfEmpty(update.name),
        slug: toNullIfEmpty(update.slug),
        description: toNullIfEmpty(update.description),
        price: toNumberOrNull(update.price),
        discount_price: toNumberOrNull(update.discount_price),
        stock_quantity:
          update.stock_quantity === "" ? null : Number(update.stock_quantity),
        unit: toNullIfEmpty(update.unit),
        sku: toNullIfEmpty(update.sku),
        category_id: toNullIfEmpty(update.category_id),
        is_active: !!update.is_active,
        is_premium: !!update.is_premium,
        is_rental: !!update.is_rental,
      };

      const { res, payload } = await apiRequest(`/products/${editingId}`, {
        method: "PATCH",
        auth: true,
        body,
      });
      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Failed to update product");
        return;
      }
      await reload();
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const handleDelete = async (p) => {
    const id = getProductId(p);
    if (!id) return;
    const ok = window.confirm(`Delete product ${id}?`);
    if (!ok) return;

    setActionError(null);
    const { res, payload } = await apiRequest(`/products/${id}`, {
      method: "DELETE",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to delete product");
      return;
    }
    if (editingId === id) setEditingId(null);
    await reload();
  };

  const handleUploadImage = async () => {
    if (!editingId || !uploadFile) return;
    setActionError(null);
    setUploadSubmitting(true);
    try {
      const token = getAccessToken();
      const form = new FormData();
      form.append("file", uploadFile);

      const res = await fetch(`${API_BASE_URL}/products/${editingId}/images`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      const text = await res.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }

      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Image upload failed");
        return;
      }

      setUploadFile(null);
      await reload();
    } finally {
      setUploadSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-3 text-2xl font-black">Products</h1>

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
        <div className="space-y-4">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="mb-2 text-sm font-bold text-black/60">
              Total: {productItems.length}
            </div>

            <div className="overflow-auto">
              <table className="min-w-[900px] border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase text-black/50">
                    <th className="border-b border-black/10 p-2">ID</th>
                    <th className="border-b border-black/10 p-2">Name</th>
                    <th className="border-b border-black/10 p-2">Slug</th>
                    <th className="border-b border-black/10 p-2">Price</th>
                    <th className="border-b border-black/10 p-2">Stock</th>
                    <th className="border-b border-black/10 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productItems.map((p, idx) => {
                    const id = getProductId(p);
                    return (
                      <tr key={id ?? idx} className="align-top">
                        <td className="border-b border-black/10 p-2 text-sm font-mono">
                          {id ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm font-bold">
                          {p?.name ?? p?.title ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm">
                          {p?.slug ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm">
                          {p?.price ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2 text-sm">
                          {p?.stock_quantity ?? p?.stock ?? "—"}
                        </td>
                        <td className="border-b border-black/10 p-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-black/90"
                              onClick={() => startEdit(p)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-500/20"
                              onClick={() => handleDelete(p)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 text-lg font-bold">Create product</h2>
              <form onSubmit={handleCreate} className="space-y-3 text-sm">
                <label className="flex flex-col gap-1">
                  Name *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.name}
                    onChange={(e) => setCreate((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Slug *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.slug}
                    onChange={(e) => setCreate((p) => ({ ...p, slug: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Price *
                  <input
                    type="number"
                    step="0.01"
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.price}
                    onChange={(e) => setCreate((p) => ({ ...p, price: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Description
                  <textarea
                    className="min-h-[84px] rounded-lg border border-black/10 bg-white px-2 py-2"
                    value={create.description}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Category ID (optional)
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.category_id}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, category_id: e.target.value }))
                    }
                    placeholder="uuid or empty"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    Discount price
                    <input
                      type="number"
                      step="0.01"
                      className="h-10 rounded-lg border border-black/10 bg-white px-2"
                      value={create.discount_price}
                      onChange={(e) =>
                        setCreate((p) => ({ ...p, discount_price: e.target.value }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    Stock quantity
                    <input
                      type="number"
                      step="1"
                      className="h-10 rounded-lg border border-black/10 bg-white px-2"
                      value={create.stock_quantity}
                      onChange={(e) =>
                        setCreate((p) => ({ ...p, stock_quantity: e.target.value }))
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={create.is_active}
                      onChange={(e) => setCreate((p) => ({ ...p, is_active: e.target.checked }))}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={create.is_premium}
                      onChange={(e) => setCreate((p) => ({ ...p, is_premium: e.target.checked }))}
                    />
                    Premium
                  </label>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={create.is_rental}
                    onChange={(e) => setCreate((p) => ({ ...p, is_rental: e.target.checked }))}
                  />
                  Rental
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={createSubmitting}
                    className="h-11 flex-1 rounded-lg bg-black text-sm font-bold text-white hover:bg-black/90 disabled:opacity-60"
                  >
                    {createSubmitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4">
              <h2 className="mb-3 text-lg font-bold">
                Update product {editingId ? `(${editingId})` : ""}
              </h2>

              {!editingId ? (
                <div className="text-sm text-black/60">
                  Pick a product from the list to edit.
                </div>
              ) : (
                <>
                  <form onSubmit={handleUpdate} className="space-y-3 text-sm">
                    <label className="flex flex-col gap-1">
                      Name
                      <input
                        className="h-10 rounded-lg border border-black/10 bg-white px-2"
                        value={update.name}
                        onChange={(e) => setUpdate((p) => ({ ...p, name: e.target.value }))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Price
                      <input
                        type="number"
                        step="0.01"
                        className="h-10 rounded-lg border border-black/10 bg-white px-2"
                        value={update.price}
                        onChange={(e) =>
                          setUpdate((p) => ({ ...p, price: e.target.value }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Stock quantity
                      <input
                        type="number"
                        step="1"
                        className="h-10 rounded-lg border border-black/10 bg-white px-2"
                        value={update.stock_quantity}
                        onChange={(e) =>
                          setUpdate((p) => ({ ...p, stock_quantity: e.target.value }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Description
                      <textarea
                        className="min-h-[84px] rounded-lg border border-black/10 bg-white px-2 py-2"
                        value={update.description}
                        onChange={(e) =>
                          setUpdate((p) => ({ ...p, description: e.target.value }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Discount price
                      <input
                        type="number"
                        step="0.01"
                        className="h-10 rounded-lg border border-black/10 bg-white px-2"
                        value={update.discount_price}
                        onChange={(e) =>
                          setUpdate((p) => ({
                            ...p,
                            discount_price: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={update.is_active}
                          onChange={(e) =>
                            setUpdate((p) => ({
                              ...p,
                              is_active: e.target.checked,
                            }))
                          }
                        />
                        Active
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={update.is_premium}
                          onChange={(e) =>
                            setUpdate((p) => ({
                              ...p,
                              is_premium: e.target.checked,
                            }))
                          }
                        />
                        Premium
                      </label>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={update.is_rental}
                        onChange={(e) =>
                          setUpdate((p) => ({
                            ...p,
                            is_rental: e.target.checked,
                          }))
                        }
                      />
                      Rental
                    </label>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={updateSubmitting}
                        className="h-11 flex-1 rounded-lg bg-black text-sm font-bold text-white hover:bg-black/90 disabled:opacity-60"
                      >
                        {updateSubmitting ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 border-t border-black/10 pt-4">
                    <h3 className="mb-2 text-sm font-bold">Upload image</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      disabled={uploadSubmitting || !uploadFile}
                      onClick={handleUploadImage}
                      className="mt-2 h-10 w-full rounded-lg bg-black text-sm font-bold text-white hover:bg-black/90 disabled:opacity-60"
                    >
                      {uploadSubmitting ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;