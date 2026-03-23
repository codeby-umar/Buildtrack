import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import AppThemeProvider from "./theme/AppThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <AppThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppThemeProvider>
    </StrictMode>
  </BrowserRouter>,
);
