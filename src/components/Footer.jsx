import { AiFillYoutube, AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineStorefront } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiSettings } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  const mobileItems = [
    {
      label: t("home.navbar.home"),
      path: "/",
      icon: <AiOutlineHome className="h-5 w-5" />,
    },
    {
      label: t("home.navbar.marketplace"),
      path: "/marketplace",
      icon: <MdOutlineStorefront className="h-5 w-5" />,
    },
    {
      label: t("home.navbar.delivery"),
      path: "/delivery",
      icon: <TbTruckDelivery className="h-5 w-5" />,
    },
    {
      label: t("home.navbar.posPayroll"),
      path: "/pos-payroll",
      icon: <HiOutlineBuildingOffice2 className="h-5 w-5" />,
    },
    {
      label: t("home.navbar.settings"),
      path: "/setting",
      icon: <FiSettings className="h-5 w-5" />,
    },
  ];

  const footerLinks = [
    { to: "/advertising", label: t("home.footer.title") },
    { to: "/offer", label: t("home.footer.title1") },
    { to: "/support", label: t("home.footer.title2") },
  ];

  return (
    <>
      <footer className="hidden bg-black text-white md:block">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap items-center gap-4 lg:gap-8">
              {footerLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    className="text-sm transition hover:text-yellow-400"
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-black transition hover:bg-yellow-400"
                href="https:/t.me/buildtrack"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <FaTelegramPlane />
              </a>

              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-black transition hover:bg-yellow-400"
                href="https://www.instagram.com/buildtrack.uzb/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <AiOutlineInstagram />
              </a>

              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-black transition hover:bg-yellow-400"
                href="https://www.youtube.com/@buildtrack-uz"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <AiFillYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-yellow-400 py-3 text-black">
          <div className="container mx-auto flex flex-col gap-2 px-4 text-sm md:flex-row md:items-center md:justify-between">
            <p>{t("home.footer.description")}</p>
            <p>{t("home.footer.save")}</p>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-100 bg-white/80 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {mobileItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex p-5 flex-col items-center justify-center gap-1  text-center transition ${
                  isActive
                    ? "text-black"
                    : "text-slate-500 hover:text-slate-700"
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="max-w-15.5 truncate text-[11px] font-medium leading-none">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Footer;
