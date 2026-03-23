import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard/settings", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="mb-2 text-2xl font-black">Settings</h1>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          Please login to access settings.
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

  return <div className="p-4">Redirecting...</div>;
}

export default Settings;