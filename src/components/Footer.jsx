import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

 const mobileItems = [
  {
    label: t("home.navbar.home"),
    path: "/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5 12 3l9 7.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 9.75V20a.75.75 0 0 0 .75.75h4.5v-5.25h3v5.25H18a.75.75 0 0 0 .75-.75V9.75"
        />
      </svg>
    ),
  },
  {
    label: t("home.navbar.marketplace"),
    path: "/marketplace",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7.5V16.5L12 21l8-4.5V7.5"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
      </svg>
    ),
  },
  {
    label: t("home.navbar.delivery"),
    path: "/delivery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7.5h11.25v8.25H3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 10.5H18l3 3v2.25h-1.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        />
      </svg>
    ),
  },
  {
    label: t("home.navbar.posPayroll"),
    path: "/pos-payroll",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 5.25h15a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 9h9"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 12h4.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 15h3"
        />
      </svg>
    ),
  },
  {
    label: t("home.navbar.contact"),
    path: "/contact",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"
        />
      </svg>
    ),
  },
];

  const desktopLinks = [
    { label: t("home.navbar.home"), path: "/" },
    { label: t("home.navbar.companies"), path: "/companies" },
    { label: t("home.navbar.marketplace"), path: "/marketplace" },
    { label: t("home.navbar.premiumRental"), path: "/premium-rental" },
    { label: t("home.navbar.delivery"), path: "/delivery" },
    { label: t("home.navbar.posPayroll"), path: "/pos-payroll" },
    { label: t("home.navbar.contact"), path: "/contact" },
  ];

  return (
    <>
      <footer className="mt-16 hidden bg-slate-950 text-white md:block">
        <div className="container-custom py-14">
          <div className="grid grid-cols-3 gap-10">
            <div className="max-w-sm">
              <h2 className="text-2xl font-black tracking-tight text-blue-400">
                {t("home.brand")}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {t("home.footer.description")}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">
                {t("home.footer.company")}
              </h3>
              <div className="space-y-3">
                {desktopLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="block text-sm text-slate-300 transition hover:text-blue-400"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">
                {t("home.footer.contact")}
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <a
                  href="tel:+998901234567"
                  className="block transition hover:text-blue-400"
                >
                  +998 90 123 45 67
                </a>
                <a
                  href="mailto:info@buildtrack.uz"
                  className="block transition hover:text-blue-400"
                >
                  info@buildtrack.uz
                </a>
                <NavLink
                  to="/contact"
                  className="block transition hover:text-blue-400"
                >
                  Toshkent, O‘zbekiston
                </NavLink>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
            © 2026 {t("home.brand")} — {t("home.footer.rights")}
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {mobileItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-1 pt-2 text-center transition",
                  isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")
              }
            >
              <span>{item.icon}</span>
              <span className="max-w-15.5 truncate text-[11px] font-medium leading-none">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default Footer;
