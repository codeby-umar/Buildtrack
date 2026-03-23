import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../auth/AuthContext";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function Marketplace() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

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
          `/catalog/products?page=${page}&page_size=${pageSize}`,
          { method: "GET", auth: false }
        );
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setError(payload?.message || "Failed to load catalog");
          return;
        }
        setProducts(payload?.data ?? payload?.items ?? payload ?? []);
      } catch {
        if (!cancelled) setError("Failed to load catalog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

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

  const renderCard = (p) => {
    const id = p?.id ?? p?.product_id ?? p?.uuid ?? null;
    const title = p?.name ?? p?.title ?? p?.slug ?? "Product";
    const img = p?.image ?? p?.thumbnail ?? null;
    const price = p?.price ?? p?.unit_price ?? p?.amount ?? "";

    return (
      <Card
        key={id ?? title}
        sx={{
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          transition: "transform 150ms ease",
          "&:hover": { transform: "translateY(-2px)" },
        }}
        variant="outlined"
      >
        {img ? (
          <CardMedia component="img" image={img} alt={title} height="180" />
        ) : (
          <Box
            sx={{
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No image
            </Typography>
          </Box>
        )}
        <CardContent>
          <Stack spacing={1.2}>
            <Typography
              variant="subtitle1"
              fontWeight={900}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body1" fontWeight={900}>
              {price !== "" ? price : "—"}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2.5, pb: 2.5 }}>
          <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            <Button
              variant="contained"
              disabled={!id}
              sx={{ flex: 1, borderRadius: 2, fontWeight: 900 }}
              onClick={() =>
                navigate(`/product/${id}`, { state: { product: p } })
              }
            >
              View
            </Button>
            <Button
              variant="outlined"
              disabled={!id || !isAuthenticated}
              sx={{
                flex: 1,
                borderRadius: 2,
                fontWeight: 900,
                borderColor: "#facc15",
                color: "black",
              }}
              onClick={() => addToCart(id)}
            >
              Add
            </Button>
          </Box>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Marketplace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Products list from backend
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}

        {loading ? (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            Loading...
          </Paper>
        ) : (
          <>
            <Grid container spacing={2.2}>
              {items.map((p) => (
                <Grid item key={p?.id ?? p?.slug} xs={12} sm={6} md={4}>
                  {renderCard(p)}
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                sx={{ borderRadius: 2, fontWeight: 900 }}
              >
                Prev
              </Button>
              <Typography variant="body2" fontWeight={900}>
                Page {page}
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Button
                variant="outlined"
                disabled={items.length === 0}
                onClick={() => setPage((p) => p + 1)}
                sx={{ borderRadius: 2, fontWeight: 900 }}
              >
                Next
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}

export default Marketplace;