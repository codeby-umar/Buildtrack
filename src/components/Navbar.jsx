import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import {
  ShoppingCart,
  User,
  Search,
  Globe,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";

const dummyData = [
  { id: 1, name: "Portland sement M400", category: "Marketplace" },
  { id: 2, name: "Armatura 12mm", category: "Marketplace" },
  { id: 3, name: "Yetkazib berish xizmati", category: "Delivery" },
  { id: 4, name: "Mega Qurilish Market", category: "Companies" },
];

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navbarRef = useRef(null);

  const navItems = useMemo(
    () => [
      { label: t("home.navbar.home"), path: "/" },
      { label: t("home.navbar.marketplace"), path: "/marketplace" },
      { label: t("home.navbar.companies"), path: "/companies" },
      { label: t("home.navbar.delivery"), path: "/delivery" },
      { label: t("home.navbar.posPayroll"), path: "/pos-payroll" },
      { label: t("home.navbar.premiumRental"), path: "/premium-rental" },
      { label: t("home.navbar.contact"), path: "/contact" },
    ],
    [t]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim().toLowerCase();
      if (trimmed.length <= 1) {
        setResults([]);
        setIsSearching(false);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);
      const filtered = dummyData.filter((item) =>
        item.name.toLowerCase().includes(trimmed)
      );
      setResults(filtered);
      setIsSearching(false);
      setShowDropdown(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setQuery("");
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const renderSearchDropdown = () => {
    if (!showDropdown) return null;
    return (
      <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl">
        <div className="max-h-[320px] overflow-y-auto p-2">
          {isSearching ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-5 w-5 animate-spin text-black/30" />
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleResultClick(item.id)}
                className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-yellow-50"
              >
                <div>
                  <div className="text-sm font-bold leading-tight text-zinc-900">{item.name}</div>
                  <div className="text-[10px] font-black uppercase text-black/40">{item.category}</div>
                </div>
                <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-sm italic text-black/40">Hech narsa topilmadi</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header ref={navbarRef} className="sticky top-0 z-50 w-full border-b border-black/5 bg-yellow-400/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Yuqori qism */}
        <div className="flex h-18 items-center justify-between gap-3 md:gap-6">
          <NavLink to="/" className="shrink-0 text-xl font-black tracking-tight text-black md:text-2xl">
            {t("home.brand")}
          </NavLink>

          {/* Desktop Search */}
          <div className="relative hidden max-w-2xl flex-1 lg:block">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-black/35" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
                placeholder={t("common.search")}
                className="h-11 w-full rounded-full bg-white/70 pl-11 pr-24 text-sm outline-none transition-all placeholder:text-black/40 focus:bg-white focus:ring-4 focus:ring-black/5"
              />
              {query && (
                <button onClick={clearSearch} className="absolute right-20 rounded-full p-1 text-black/40 hover:text-black">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button className="absolute right-1.5 h-8 rounded-full bg-black px-4 text-xs font-bold text-white">
                {t("common.search")}
              </button>
            </div>
            {renderSearchDropdown()}
          </div>

          {/* O'ng tarafdagi ikonlar */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            {/* Tilni tanlash faqat desktopda */}
            <div className="hidden items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 sm:flex">
              <Globe className="h-4 w-4 opacity-60" />
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="cursor-pointer bg-transparent text-xs font-black uppercase outline-none"
              >
                <option value="uz">UZ</option>
                <option value="en">EN</option>
                <option value="ru">RU</option>
              </select>
            </div>

            {/* LOGIN TUGMASI - Endi hamma razmerda ko'rinadi */}
            <NavLink
              to="/dashboard"
              className="rounded-full p-2 transition hover:bg-white/40"
            >
              <User className="h-5 w-5" />
            </NavLink>

            {/* SAVATCHA TUGMASI */}
            <NavLink
              to="/cart"
              className="relative rounded-full p-2 transition hover:bg-white/40"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                0
              </span>
            </NavLink>
          </div>
        </div>

        {/* Mobil Search (Faqat mobil uchun) */}
        <div className="relative pb-4 lg:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-black/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
              placeholder={t("common.search")}
              className="h-10 w-full rounded-xl bg-white/70 pl-10 pr-10 text-sm outline-none placeholder:text-black/40 transition focus:bg-white"
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-3 rounded-full p-1 text-black/40">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {renderSearchDropdown()}
        </div>

        {/* Desktop Navigatsiya (Kategoriyalar) */}
        <nav className="hidden border-t border-black/5 py-3 lg:block">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative block whitespace-nowrap py-1 text-[13px] font-bold tracking-tight transition-all ${
                      isActive ? "text-black" : "text-black/55 hover:text-black"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;