import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await login(email, password);
      if (!result?.success) {
        setError(result?.error || "Login failed");
        return;
      }
      const from = location.state?.from?.pathname;
      navigate(from || "/dashboard", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(700px circle at 10% 10%, rgba(99,102,241,0.25), transparent 40%), radial-gradient(650px circle at 90% 0%, rgba(250,204,21,0.20), transparent 45%)",
            pointerEvents: "none",
          }}
        />

        <Stack spacing={2} sx={{ position: "relative" }}>
          <Typography variant="h4" fontWeight={900}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboardga kirish uchun email va passwordni kiriting.
          </Typography>

          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                variant="contained"
                type="submit"
                disabled={submitting}
                sx={{
                  mt: 1,
                  height: 46,
                  borderRadius: 2,
                  fontWeight: 800,
                }}
              >
                {submitting ? "Logging in..." : "Login"}
              </Button>

              <Typography variant="caption" color="text.secondary">
                Agar credentialsingiz bo‘lmasa, adminingizdan akkaunt ochishni
                so‘rang.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Login;

