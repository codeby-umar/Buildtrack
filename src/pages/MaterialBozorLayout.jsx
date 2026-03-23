import React, { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  alpha,
} from "@mui/material";
import {
  Search,
  NotificationsNone,
  Dashboard as DashboardIcon,
  ShoppingCart,
  Inventory2,
  Warehouse,
  People,
  Settings,
  DarkMode,
  LightMode,
  Menu,
} from "@mui/icons-material";

const drawerWidth = 260;

export default function MaterialBozorLayout() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      {
        label: t("dashboard.pages.dashboard"),
        icon: <DashboardIcon />,
        path: "/dashboard",
        end: true,
      },
      {
        label: t("dashboard.pages.orders"),
        icon: <ShoppingCart />,
        path: "/dashboard/orders",
      },
      {
        label: t("dashboard.pages.products"),
        icon: <Inventory2 />,
        path: "/dashboard/products",
      },
      {
        label: t("dashboard.pages.warehouse"),
        icon: <Warehouse />,
        path: "/dashboard/warehouse",
      },
      {
        label: t("dashboard.pages.clients"),
        icon: <People />,
        path: "/dashboard/clients",
      },
      {
        label: t("dashboard.pages.settings"),
        icon: <Settings />,
        path: "/dashboard/settings",
      },
    ],
    [t]
  );
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#6366f1" },
          background: {
            default: darkMode ? "#09090b" : "#f8fafc",
            paper: darkMode ? "#18181b" : "#ffffff",
          },
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: "'Inter', sans-serif" },
      }),
    [darkMode]
  );
  const drawer = (
    <Box
      sx={{
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          px: 2,
          mb: 4,
          color: "primary.main",
          letterSpacing: -0.5,
        }}
      >
        {t("dashboard.brand")}
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "text.primary",
              "& .MuiListItemIcon-root": {
                color: "inherit",
              },
              "&.active": {
                bgcolor: "primary.main",
                color: "#fff",
              },
              "&.active .MuiListItemIcon-root": {
                color: "#fff",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Stack
        spacing={1.5}
        sx={{
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Select
          size="small"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <MenuItem value="uz">O‘zbek</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ru">Русский</MenuItem>
        </Select>

        <ListItemButton
          onClick={() => setDarkMode((prev) => !prev)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText
            primary={darkMode ? t("common.theme.light") : t("common.theme.dark")}
          />
        </ListItemButton>
      </Stack>
    </Box>
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
            bgcolor: alpha(theme.palette.background.default, 0.8),
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { lg: "none" }, mr: 1 }}
            >
              <Menu />
            </IconButton>

            <TextField
              size="small"
              placeholder={t("dashboard.search")}
              sx={{
                width: { xs: 150, sm: 300 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.action.hover, 0.05),
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton size="small">
                <NotificationsNone />
              </IconButton>
              <Avatar
                src="https://github.com/codeby-umar.png"
                sx={{
                  width: 34,
                  height: 34,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                border: 0,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxSizing: "border-box",
                bgcolor: "background.paper",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { lg: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}