import React, { useState } from "react";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";

function PosPayroll() {
  const { isAuthenticated } = useAuth();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [approving, setApproving] = useState(false);

  const extractPayrollId = (p) => p?.id ?? p?.payroll_id ?? p?.payrollId ?? null;

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const body = { month: Number(month), year: Number(year) };
      const { res, payload } = await apiRequest("/payrolls/calculate", {
        method: "POST",
        auth: true,
        body,
      });
      if (!res.ok || payload?.success === false) {
        setError(payload?.message || "Payroll calculate failed");
        return;
      }
      setResult(payload?.data ?? payload ?? null);
    } catch {
      setError("Payroll calculate failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const payrollId = extractPayrollId(result);
    if (!payrollId) return;
    setApproving(true);
    setActionError(null);
    try {
      const { res, payload } = await apiRequest(`/payrolls/${payrollId}/approve`, {
        method: "POST",
        auth: true,
        body: {},
      });
      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Approve failed");
        return;
      }
      setResult(payload?.data ?? payload ?? result);
    } catch {
      setActionError("Approve failed");
    } finally {
      setApproving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-2 text-2xl font-black">POS & Payroll</h1>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          Please login to calculate payroll.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-3 text-2xl font-black">POS & Payroll</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-3 text-lg font-bold">Calculate payroll</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Month
              <input
                type="number"
                className="h-10 rounded-lg border border-black/10 bg-white px-2"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                min={1}
                max={12}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Year
              <input
                type="number"
                className="h-10 rounded-lg border border-black/10 bg-white px-2"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={loading}
            className="mt-4 h-11 w-full rounded-lg bg-black text-sm font-bold text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>

          {result && (
            <div className="mt-4 rounded-lg border border-black/10 bg-black/5 p-3 text-sm">
              <div className="mb-2 font-bold">Result</div>
              <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-3 text-lg font-bold">Actions</h2>
          <button
            type="button"
            disabled={approving || !extractPayrollId(result)}
            onClick={handleApprove}
            className="h-11 w-full rounded-lg bg-yellow-400 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-60"
          >
            {approving ? "Approving..." : "Approve payroll"}
          </button>

          <p className="mt-3 text-xs text-black/50">
            Payroll schema is backend-defined. This UI shows raw payload for safe compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PosPayroll;