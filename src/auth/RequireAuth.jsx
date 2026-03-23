import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}

