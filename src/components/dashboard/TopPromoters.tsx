"use client";

import { ArrowUpRight } from "lucide-react";
import PromoterRow from "./PromoterRow";
import { useAppSelector } from "@/lib/redux/store/hook";

export default function TopPromoters() {
  const {
    topPromoters,
    topPromotersLoading,
  } = useAppSelector((state) => state.dashboard);

  if (topPromotersLoading) {
    return (
      <div className="flex-1 rounded-md border border-gold/50 p-5">
        <p className="text-sm text-zinc-400">
          Loading top promoters...
        </p>
      </div>
    );
  }

  const hasViews = topPromoters.some(
    (item) => item.totalViews > 0
  );

  return (
    <div
      className="
      flex-1
      rounded-md
      border
      border-gold/50
      px-5
      py-4
      hover:border-gold/80
      hover:shadow-gold
      transition-all
      duration-300
      hover:-translate-y-1
      "
    >
      <div className="space-y-1">
        {hasViews ? (
          topPromoters.map((promoter, index) => (
            <PromoterRow
              key={promoter.user_id}
              promoter={promoter}
              rank={index + 1}
            />
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500">
            No Top Promoter Found
          </div>
        )}
      </div>

      {hasViews && (
        <button
          className="
          mt-6
          flex
          items-center
          gap-2
          text-xs
          uppercase
          tracking-[0.25em]
          text-[#C6A04A]
          transition-all
          hover:gap-3
          "
        >
          Explore Network
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}