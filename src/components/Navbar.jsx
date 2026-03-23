import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Navbar() {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(false);

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
      "rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600",
    ].join(" ");

  const mobileNavLinkClass = ({ isActive }) =>
    [
      "block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600",
    ].join(" ");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="container-custom flex min-h-[72px] items-center justify-between gap-4 lg:min-h-[80px]">
          <NavLink to="/" className="flex shrink-0 items-center gap-3 no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-200">
              B
            </div>

            <div>
              <div className="text-xl font-black leading-none tracking-tight text-blue-600 sm:text-2xl">
                {t("home.brand")}
              </div>
              <div className="hidden text-[11px] text-slate-500 sm:block">
                {t("home.subtitle")}
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 sm:block"
            >
              <option value="uz">O‘zbek</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>

            <NavLink
              to="/dashboard"
              className="hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:inline-flex"
            >
              {t("common.buttons.login")}
            </NavLink>

            <button
              type="button"
              onClick={() => setOpenMenu(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {openMenu && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpenMenu(false)}
            aria-label="Close menu backdrop"
          />

          <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 font-black text-white">
                  B
                </div>
                <div>
                  <div className="text-xl font-black text-blue-600">{t("home.brand")}</div>
                  <div className="text-[11px] text-slate-500">{t("home.subtitle")}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenMenu(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 border-t border-slate-200 pt-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpenMenu(false)}
                    className={mobileNavLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-4">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500"
              >
                <option value="uz">O‘zbek</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>

              <NavLink
                to="/dashboard"
                onClick={() => setOpenMenu(false)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {t("common.buttons.login")}
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;