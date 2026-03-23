import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";

function Clients() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [actionError, setActionError] = useState(null);

  const [create, setCreate] = useState({
    company_name: "",
    company_slug: "",
    subscription_plan: "free",
    status: "active",
    owner_full_name: "",
    owner_phone: "",
    owner_email: "",
    owner_password: "",
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const items = useMemo(() => {
    return Array.isArray(companies) ? companies : companies?.items ?? [];
  }, [companies]);

  const getCompanyId = (c) => c?.id ?? c?.company_id ?? c?.companyId ?? null;

  const load = async () => {
    const { res, payload } = await apiRequest("/companies", {
      method: "GET",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setError(payload?.message || "Failed to load companies");
      return;
    }
    setCompanies(payload?.data ?? payload?.items ?? payload ?? []);
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        await load();
      } catch {
        if (!cancelled) setError("Failed to load companies");
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
    await load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionError(null);
    setCreateSubmitting(true);
    try {
      const body = {
        company: {
          name: create.company_name,
          slug: create.company_slug,
          subscription_plan: create.subscription_plan,
          status: create.status,
        },
        owner_full_name: create.owner_full_name,
        owner_phone: create.owner_phone,
        owner_email: create.owner_email,
        owner_password: create.owner_password,
      };

      const { res, payload } = await apiRequest("/companies", {
        method: "POST",
        auth: true,
        body,
      });
      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Failed to create company");
        return;
      }
      await reload();
      setCreate({
        company_name: "",
        company_slug: "",
        subscription_plan: "free",
        status: "active",
        owner_full_name: "",
        owner_phone: "",
        owner_email: "",
        owner_password: "",
      });
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleDelete = async (company) => {
    const id = getCompanyId(company);
    if (!id) return;
    const ok = window.confirm(`Delete company ${id}?`);
    if (!ok) return;

    setActionError(null);
    const { res, payload } = await apiRequest(`/companies/${id}`, {
      method: "DELETE",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setActionError(payload?.message || "Failed to delete company");
      return;
    }
    await reload();
  };

  return (
    <div>
      <h1 className="mb-3 text-2xl font-black">Clients</h1>

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
              Total: {items.length}
            </div>

            {items.length === 0 ? (
              <div className="rounded-lg bg-black/5 p-4 text-sm text-black/60">
                No companies
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-[860px] border-collapse">
                  <thead>
                    <tr className="text-left text-xs uppercase text-black/50">
                      <th className="border-b border-black/10 p-2">ID</th>
                      <th className="border-b border-black/10 p-2">Name</th>
                      <th className="border-b border-black/10 p-2">Slug</th>
                      <th className="border-b border-black/10 p-2">Status</th>
                      <th className="border-b border-black/10 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c, idx) => {
                      const id = getCompanyId(c);
                      return (
                        <tr key={id ?? idx} className="align-top">
                          <td className="border-b border-black/10 p-2 text-sm font-mono">
                            {id ?? "—"}
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
                          <td className="border-b border-black/10 p-2">
                            <button
                              type="button"
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-500/20"
                              onClick={() => handleDelete(c)}
                            >
                              Delete
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

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <h2 className="mb-3 text-lg font-bold">Create company (with admin)</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  Company name *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.company_name}
                    onChange={(e) =>
                      setCreate((p) => ({
                        ...p,
                        company_name: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Company slug *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.company_slug}
                    onChange={(e) =>
                      setCreate((p) => ({
                        ...p,
                        company_slug: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  Subscription plan
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.subscription_plan}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, subscription_plan: e.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Status
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.status}
                    onChange={(e) => setCreate((p) => ({ ...p, status: e.target.value }))}
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  Owner full name *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.owner_full_name}
                    onChange={(e) =>
                      setCreate((p) => ({
                        ...p,
                        owner_full_name: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Owner phone *
                  <input
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.owner_phone}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, owner_phone: e.target.value }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  Owner email *
                  <input
                    type="email"
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.owner_email}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, owner_email: e.target.value }))
                    }
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Owner password *
                  <input
                    type="password"
                    className="h-10 rounded-lg border border-black/10 bg-white px-2"
                    value={create.owner_password}
                    onChange={(e) =>
                      setCreate((p) => ({ ...p, owner_password: e.target.value }))
                    }
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={createSubmitting}
                className="h-11 w-full rounded-lg bg-black text-sm font-bold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {createSubmitting ? "Creating..." : "Create company"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;