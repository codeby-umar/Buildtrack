import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { res, payload } = await apiRequest("/analytics/overview", {
          method: "GET",
          auth: true,
        });
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setError(payload?.message || "Failed to load overview");
          return;
        }
        setOverview(payload?.data ?? payload);
      } catch {
        if (!cancelled) setError("Failed to load overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      <Stack spacing={2}>
        {loading ? (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            Loading...
          </Paper>
        ) : error ? (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        ) : (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 1.5 }}>
              Overview
            </Typography>
            <pre
              style={{
                margin: 0,
                maxHeight: 420,
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 12,
              }}
            >
              {overview ? JSON.stringify(overview, null, 2) : "No data"}
            </pre>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

export default DashboardPage;