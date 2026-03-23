import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiRequest } from "../api/apiClient";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function ProductDetail() {
  const { productId } = useParams();
  const location = useLocation();
  const { accessToken, isAuthenticated } = useAuth();

  const initialProduct = location.state?.product ?? null;
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!accessToken || !productId) return;
      setLoading(true);
      setActionError(null);
      try {
        const { payload, res } = await apiRequest(`/products/${productId}`, {
          method: "GET",
          auth: true,
        });
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setActionError(payload?.message || "Failed to load product");
          return;
        }
        setProduct(payload?.data ?? payload?.item ?? payload);
      } catch {
        if (!cancelled) setActionError("Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, productId]);

  const title = useMemo(() => {
    return (
      product?.name ??
      product?.title ??
      product?.slug ??
      (product ? "Product" : null)
    );
  }, [product]);

  const image = product?.image ?? product?.thumbnail ?? product?.imgUrl;

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;
    setActionError(null);
    try {
      const { res, payload } = await apiRequest(`/cart/items`, {
        method: "POST",
        auth: true,
        body: { product_id: productId, quantity: 1 },
      });
      if (!res.ok || payload?.success === false) {
        setActionError(payload?.message || "Failed to add to cart");
        return;
      }
    } catch {
      setActionError("Failed to add to cart");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            {title || "Product"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Product detail
          </Typography>
        </Box>

        {actionError && (
          <Alert severity="error" variant="outlined">
            {actionError}
          </Alert>
        )}

        {loading && (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            Loading...
          </Paper>
        )}

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              {image ? (
                <Box>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={title || "product"}
                    sx={{ borderRadius: 3, height: 320, objectFit: "cover" }}
                  />
                  <Divider sx={{ my: 2.5 }} />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      borderRadius: 3,
                      height: 320,
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
                  <Divider sx={{ my: 2.5 }} />
                </>
              )}

              <Stack spacing={1.5}>
                <Typography variant="body2">
                  <b>Description: </b>
                  {product?.description ?? product?.details ?? "—"}
                </Typography>
                <Typography variant="body2">
                  <b>Price: </b>
                  {product?.price ?? product?.unit_price ?? "—"}
                </Typography>
                <Typography variant="body2">
                  <b>Discount: </b>
                  {product?.discount_price ?? product?.discount ?? "—"}
                </Typography>
                <Typography variant="body2">
                  <b>Stock: </b>
                  {product?.stock_quantity ?? product?.stock ?? "—"}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>
                Actions
              </Typography>

              {isAuthenticated ? (
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  sx={{
                    height: 46,
                    borderRadius: 2,
                    fontWeight: 900,
                  }}
                >
                  Add to cart
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Login is required to add products to cart.
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tip: from the marketplace you can open this page without auth, and
                  once logged-in you can add items to cart.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default ProductDetail;

