import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdWorkspacePremium } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

const deals = [
  {
    id: 1,
    title: "Saralangan mahsulotlar, tez yetkazib berish",
    subtitle: "Sifat kafolati bilan",
    badge: "BuildChoice",
    icon: <TbTruckDelivery className="h-4 w-4" />,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Bitta platformada hamma narsa",
    subtitle: "Chegirmalar va qulay takliflar",
    badge: "Smart Savdo",
    icon: <HiOutlineSparkles className="h-4 w-4" />,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Ustalar tanlagan ishonchli tovarlar",
    subtitle: "Mustahkam, foydali va ommabop",
    badge: "Premium Tanlov",
    icon: <MdWorkspacePremium className="h-4 w-4" />,
    image:
      "https://images.unsplash.com/photo-1581147036324-c1c1d3624cc4?q=80&w=1200&auto=format&fit=crop",
  },
];

function DealCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-yellow-500/20 bg-yellow-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-200" />

      <div className="relative grid min-h-[180px] grid-cols-1 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-between p-4 sm:p-5">
          <div>
            <h3 className="max-w-[260px] text-lg font-black leading-tight text-black sm:text-xl lg:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 max-w-[220px] text-xs font-medium text-black/70 sm:text-sm">
              {item.subtitle}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold text-white sm:text-xs">
              {item.icon}
              {item.badge}
            </span>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/85 text-black transition hover:bg-white sm:h-9 sm:w-9"
            >
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative h-36 sm:h-full">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-yellow-300/25 sm:bg-gradient-to-l" />
        </div>
      </div>
    </div>
  );
}

function CurrentDeals() {
  return (
    <section className="bg-[#f6f7f9] py-6 sm:py-8">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Dolzarb takliflar
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {deals.map((item) => (
            <DealCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CurrentDeals;