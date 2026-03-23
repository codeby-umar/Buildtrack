import React, { useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const LS_KEY = "bt_dark_mode";

export default function AppThemeProvider({ children }) {
  const [darkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(LS_KEY);
    return stored === "0" ? false : true;
  });

  const theme = useMemo(() => {
    return createTheme({
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
    });
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

