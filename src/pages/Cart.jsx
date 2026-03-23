import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function pickItemId(item) {
  return item?.id ?? item?.item_id ?? item?.cart_item_id ?? null;
}

function pickProductId(item) {
  return item?.product_id ?? item?.productId ?? item?.product?.id ?? null;
}

function Cart() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  const [orderType, setOrderType] = useState("delivery");
  const [paymentType, setPaymentType] = useState("cash");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [addressId, setAddressId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const items = useMemo(() => {
    return (
      cart?.items ??
      cart?.data?.items ??
      cart?.data ??
      []
    );
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { res, payload } = await apiRequest(`/cart`, {
          method: "GET",
          auth: true,
        });
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setError(payload?.message || "Failed to load cart");
          return;
        }
        setCart(payload?.data ?? payload);
      } catch {
        if (!cancelled) setError("Failed to load cart");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateQty = async (item, nextQty) => {
    const itemId = pickItemId(item);
    if (!itemId) return;
    const qty = Number(nextQty);
    if (!Number.isFinite(qty) || qty < 1) return;

    setError(null);
    const { res, payload } = await apiRequest(`/cart/items/${itemId}`, {
      method: "PATCH",
      auth: true,
      body: { quantity: qty },
    });
    if (!res.ok || payload?.success === false) {
      setError(payload?.message || "Failed to update quantity");
      return;
    }
    // Reload to keep UI consistent (response schemas are not explicit).
    const { payload: nextPayload, res: nextRes } = await apiRequest(`/cart`, {
      method: "GET",
      auth: true,
    });
    if (nextRes.ok && nextPayload?.success !== false) {
      setCart(nextPayload?.data ?? nextPayload);
    }
  };

  const deleteItem = async (item) => {
    const itemId = pickItemId(item);
    if (!itemId) return;
    setError(null);
    const { res, payload } = await apiRequest(`/cart/items/${itemId}`, {
      method: "DELETE",
      auth: true,
    });
    if (!res.ok || payload?.success === false) {
      setError(payload?.message || "Failed to delete item");
      return;
    }
    const { payload: nextPayload, res: nextRes } = await apiRequest(`/cart`, {
      method: "GET",
      auth: true,
    });
    if (nextRes.ok && nextPayload?.success !== false) {
      setCart(nextPayload?.data ?? nextPayload);
    }
  };

  const handleCheckout = async () => {
    setCheckoutSubmitting(true);
    setError(null);

    const payload = {
      order_type: orderType,
      payment_type: paymentType,
      delivery_fee: deliveryFee,
      discount: discount,
      address_id: addressId ? addressId : null,
      employee_id: employeeId ? employeeId : null,
    };

    try {
      const { res, payload: resp } = await apiRequest(`/cart/checkout`, {
        method: "POST",
        auth: true,
        body: payload,
      });
      if (!res.ok || resp?.success === false) {
        setError(resp?.message || "Checkout failed");
        return;
      }
      // Backend may return created order details; we just refresh cart.
      const { payload: nextPayload, res: nextRes } = await apiRequest(`/cart`, {
        method: "GET",
        auth: true,
      });
      if (nextRes.ok && nextPayload?.success !== false) {
        setCart(nextPayload?.data ?? nextPayload);
      }
    } catch {
      setError("Checkout failed");
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Cart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Items + checkout
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
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2 }}>
                  Items: {Array.isArray(items) ? items.length : 0}
                </Typography>

                {Array.isArray(items) && items.length > 0 ? (
                  <Stack spacing={1.5}>
                    {items.map((item, idx) => {
                      const itemId = pickItemId(item);
                      const productId = pickProductId(item);
                      const product = item?.product ?? item?.product_data ?? {};
                      const title =
                        product?.name ?? item?.name ?? item?.title ?? "Item";
                      const img = product?.image ?? item?.image;

                      return (
                        <Paper
                          key={itemId ?? `${productId}-${idx}`}
                          variant="outlined"
                          sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
                        >
                          {img ? (
                            <Box
                              component="img"
                              src={img}
                              alt={title}
                              sx={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                              }}
                            />
                          )}

                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={900}>{title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {itemId ?? "—"}
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={1.2}
                              alignItems="center"
                              sx={{ mt: 1 }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!(itemId && (item.quantity ?? 1) > 1)}
                                onClick={() => updateQty(item, (item.quantity ?? 1) - 1)}
                              >
                                -
                              </Button>

                              <TextField
                                type="number"
                                size="small"
                                value={item.quantity ?? 1}
                                inputProps={{ min: 1 }}
                                disabled={!itemId}
                                onChange={(e) => updateQty(item, e.target.value)}
                                sx={{ width: 110 }}
                              />

                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!itemId}
                                onClick={() => updateQty(item, (item.quantity ?? 1) + 1)}
                              >
                                +
                              </Button>

                              <Box sx={{ flex: 1 }} />

                              <Button
                                variant="text"
                                color="error"
                                disabled={!itemId}
                                onClick={() => deleteItem(item)}
                              >
                                Remove
                              </Button>
                            </Stack>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography color="text.secondary">Cart is empty</Typography>
                  </Paper>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                  Checkout
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    select
                    label="Order type"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <MenuItem value="delivery">delivery</MenuItem>
                    <MenuItem value="pickup">pickup</MenuItem>
                  </TextField>

                  <TextField
                    label="Payment type"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    placeholder="cash"
                  />

                  <TextField
                    label="Delivery fee"
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                  />

                  <TextField
                    label="Discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />

                  <TextField
                    label="Address ID (uuid)"
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                    placeholder="optional"
                  />

                  <TextField
                    label="Employee ID (uuid)"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="optional"
                  />

                  <Button
                    variant="contained"
                    onClick={handleCheckout}
                    disabled={checkoutSubmitting}
                    sx={{
                      mt: 1,
                      height: 46,
                      borderRadius: 2,
                      fontWeight: 900,
                    }}
                  >
                    {checkoutSubmitting ? "Processing..." : "Checkout"}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}

export default Cart;

