import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

import { fetchCatalogProducts } from "../api/catalog";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm bg-white">
      <div className="h-28 w-full animate-pulse bg-slate-200 sm:h-32 lg:h-36" />
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-full animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const title = product?.title ?? product?.name ?? product?.slug ?? "Product";
  const brand = product?.brand ?? "BuildTrack";
  const image = product?.image ?? product?.thumbnail ?? product?.imgUrl;

  const price = product?.price ?? product?.unit_price ?? product?.amount ?? "";
  const discountPrice =
    product?.discount_price ?? product?.discountPrice ?? null;

  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    price !== "" &&
    Number.isFinite(Number(discountPrice)) &&
    Number.isFinite(Number(price)) &&
    Number(price) > 0;

  const discount = hasDiscount
    ? `-${Math.round((1 - Number(discountPrice) / Number(price)) * 100)}%`
    : product?.discount ?? "";

  const oldPrice =
    product?.oldPrice ?? (hasDiscount ? String(price) : "");

  const badge =
    product?.badge ??
    (product?.is_premium ? "Premium" : product?.is_rental ? "Rental" : "Top");

  const rating = product?.rating ?? 4;
  const reviews = product?.reviews ?? 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm bg-white transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-32 lg:h-36"
        />

        <div className="absolute left-2 top-2 rounded-md bg-yellow-400 px-2 py-1 text-[9px] font-bold text-black">
          {badge}
        </div>

        <div className="absolute bottom-2 left-2 rounded-md bg-black px-2 py-1 text-[9px] font-semibold text-white">
          {brand}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-bold leading-5 text-slate-900 sm:min-h-[40px] sm:text-sm">
          {title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`h-3 w-3 ${
                star <= rating ? "text-yellow-400" : "text-slate-300"
              }`}
            />
          ))}
          <span className="ml-1 text-[11px] font-medium text-slate-500">
            {reviews}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-base font-black text-slate-900 sm:text-lg">
            {hasDiscount ? discountPrice : price}
          </span>
          <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {discount}
          </span>
        </div>

        <div className="mt-0.5">
          <span className="text-xs text-slate-400 line-through">
            {oldPrice}
          </span>
        </div>

        <p className="mt-2 text-[11px] font-semibold text-slate-600">
          Bepul yetkazib berish
        </p>

        <button
          type="button"
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-yellow-400 px-3 py-2 text-[11px] font-bold text-black transition hover:bg-yellow-300 sm:text-xs"
        >
          <FiShoppingCart className="h-3.5 w-3.5" />
          Sotib olish
        </button>
      </div>
    </div>
  );
}

function TopSelection() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { res, payload } = await fetchCatalogProducts({
          page: 1,
          pageSize: 10,
          isPremium: true,
        });
        if (cancelled) return;
        if (!res.ok || payload?.success === false) {
          setProducts([]);
          return;
        }
        setProducts(payload?.data?.items ?? payload?.data ?? payload?.items ?? payload ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-[#f6f7f9] py-6 sm:py-8">
      <div className="container">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
             Premiume mahsulotlar
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}

export default TopSelection;