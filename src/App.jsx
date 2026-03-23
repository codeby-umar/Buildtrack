import { Route, Routes } from "react-router-dom";
import Notfound from "./components/Notfound";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/MaterialBozorLayout";
import DashboardPage from "./pages/DashboardPage";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import WarehousePage from "./pages/WarehousePage";
import Clients from "./pages/Clients";
import SettingsPage from "./pages/SettingsPage";
import Marketplace from "./pages/Marketplace";
import Companies from "./pages/Companies";
import Delivery from "./pages/Delivery";
import PosPayroll from "./pages/PosPayroll";
import Contact from "./pages/Contact";
import PremiumRental from "./pages/PremiumRental";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="companies" element={<Companies />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="pos-payroll" element={<PosPayroll />} />
        <Route path="premium-rental" element={<PremiumRental />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="warehouse" element={<WarehousePage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
