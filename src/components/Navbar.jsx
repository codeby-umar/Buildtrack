import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { ShoppingCart, User, Search } from "lucide-react";

function Navbar() {
  const { t } = useTranslation();

  const navItems = [
    { label: t("home.navbar.home"), path: "/" },
    { label: t("home.navbar.marketplace"), path: "/marketplace" },
    { label: t("home.navbar.companies"), path: "/companies" },
    { label: t("home.navbar.delivery"), path: "/delivery" },
    { label: t("home.navbar.posPayroll"), path: "/pos-payroll" },
    { label: t("home.navbar.premiumRental"), path: "/premium-rental" },
    { label: t("home.navbar.contact"), path: "/contact" },
  ];

  const navLinkClass = ({ isActive }) =>
    [
      "text-sm font-semibold transition-all duration-200",
      isActive
        ? " text-white"
        : "text-black/80 ",
    ].join(" ");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-yellow-500 bg-yellow-400 text-black backdrop-blur-xl shadow-sm">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-9">
            <NavLink
              to="/"
              className="shrink-0 text-xl font-black text-black sm:text-[28px]"
            >
              {t("home.brand")}
            </NavLink>

            <div className="hidden flex-1 items-center gap-3 lg:flex">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className="h-12 w-full rounded-2xl border border-black/10 bg-white/95 pl-11 pr-32 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-black/20 focus:bg-white focus:shadow-md"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 inline-flex h-8.5 -translate-y-1/2 items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {t("common.search")}
                </button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-6">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="hidden bg-transparent text-black text-sm font-medium outline-none sm:block"
              >
                <option value="uz">O‘zbek</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>

              <NavLink
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg p-2 text-black transition hover:bg-black/10"
              >
                <User className="text-2xl" />
              </NavLink>

              <NavLink
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg p-2 text-black transition hover:bg-black/10"
              >
                <ShoppingCart className="text-2xl" />
              </NavLink>
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="h-12 w-full rounded-2xl border border-black/10 bg-white/95 pl-11 pr-28 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-black/20 focus:bg-white focus:shadow-md"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex h-8.5 -translate-y-1/2 items-center justify-center rounded-xl bg-black px-4 text-xs font-semibold text-white transition hover:bg-slate-800 sm:text-sm"
              >
                {t("common.search")}
              </button>
            </div>
          </div>

          <nav className="mt-6 hidden flex-wrap items-center justify-center gap-18 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
