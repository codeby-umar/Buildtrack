import React, { useEffect, useState } from "react";
import { FaStar, FaCrown } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const mockProducts = [
  {
    id: 1,
    brand: "BuildTrack",
    badge: "Top mahsulot",
    title: "Portland sement M400 50kg",
    image:
      "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=1200&auto=format&fit=crop",
    rating: 5,
    reviews: 124,
    price: "78 000",
    oldPrice: "85 000",
    discount: "-8%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 2,
    brand: "BuildTrack",
    badge: "Chegirma",
    title: "Qizil g‘isht 1 dona",
    image:
      "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 86,
    price: "2 200",
    oldPrice: "2 500",
    discount: "-12%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 3,
    brand: "BuildTrack",
    badge: "Top mahsulot",
    title: "Armatura 12mm",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 53,
    price: "89 000",
    oldPrice: "96 000",
    discount: "-7%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 4,
    brand: "BuildTrack",
    badge: "Yangi",
    title: "Profil truba 40x40",
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop",
    rating: 5,
    reviews: 41,
    price: "67 000",
    oldPrice: "73 000",
    discount: "-9%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 5,
    brand: "BuildTrack",
    badge: "Top mahsulot",
    title: "Keramik plitka premium 60x60",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 97,
    price: "129 000",
    oldPrice: "145 000",
    discount: "-11%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 6,
    brand: "BuildTrack",
    badge: "Yangi",
    title: "Shpaklyovka finish 25kg",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 34,
    price: "54 000",
    oldPrice: "59 000",
    discount: "-8%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 7,
    brand: "BuildTrack",
    badge: "Top mahsulot",
    title: "Beton uchun qum 1 qop",
    image:
      "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1200&auto=format&fit=crop",
    rating: 5,
    reviews: 77,
    price: "18 000",
    oldPrice: "20 000",
    discount: "-10%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 8,
    brand: "BuildTrack",
    badge: "Chegirma",
    title: "Tom yopish profnasti 1.2m",
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 65,
    price: "112 000",
    oldPrice: "125 000",
    discount: "-10%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 9,
    brand: "BuildTrack",
    badge: "Premium",
    title: "Fasad bo‘yog‘i 10 litr",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    rating: 5,
    reviews: 90,
    price: "149 000",
    oldPrice: "165 000",
    discount: "-9%",
    shipping: "Bepul yetkazib berish",
  },
  {
    id: 10,
    brand: "BuildTrack",
    badge: "Top mahsulot",
    title: "Gazoblok 600x200x300",
    image:
      "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=1200&auto=format&fit=crop",
    rating: 4,
    reviews: 58,
    price: "32 000",
    oldPrice: "36 000",
    discount: "-11%",
    shipping: "Bepul yetkazib berish",
  },
];

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
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm bg-white transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-32 lg:h-36"
        />

        <div className="absolute left-2 top-2 rounded-md bg-yellow-400 px-2 py-1 text-[9px] font-bold text-black">
          {product.badge}
        </div>

        <div className="absolute bottom-2 left-2 rounded-md bg-black px-2 py-1 text-[9px] font-semibold text-white">
          {product.brand}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-bold leading-5 text-slate-900 sm:min-h-[40px] sm:text-sm">
          {product.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`h-3 w-3 ${
                star <= product.rating ? "text-yellow-400" : "text-slate-300"
              }`}
            />
          ))}
          <span className="ml-1 text-[11px] font-medium text-slate-500">
            {product.reviews}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-base font-black text-slate-900 sm:text-lg">
            {product.price}
          </span>
          <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {product.discount}
          </span>
        </div>

        <div className="mt-0.5">
          <span className="text-xs text-slate-400 line-through">
            {product.oldPrice}
          </span>
        </div>

        <p className="mt-2 text-[11px] font-semibold text-slate-600">
          {product.shipping}
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

function BestProdects() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-[#f6f7f9] py-6 sm:py-8">
      <div className="container">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Ko‘p buyurtma qilingan mahsulotlar
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

export default BestProducts;