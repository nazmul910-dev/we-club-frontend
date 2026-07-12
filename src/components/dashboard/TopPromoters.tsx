"use client";

import { useEffect, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import PromoterRow from "./PromoterRow";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { promotersApi, Promoter } from "@/lib/features/promoters/promotersApi";
import Link from "next/link";

const TOP_N = 5;

// ⚠️ Adjust these two field names if PromoterRow expects something
// different — I don't have PromoterRow's source, so this mirrors the
// original dashboard-based shape (user_id, totalViews) rather than
// changing PromoterRow itself.
function normalizeTopPromoter(promoter: Promoter) {
  const userId =
    typeof promoter.user_id === "string" ? promoter.user_id : promoter.user_id._id;

  return {
    user_id: userId,
    fullName: promoter.user?.fullName ?? "Unknown",
    brokerage: promoter.user?.brokerage,
    city: promoter.user?.city,
    country: promoter.user?.country,
    totalViews: promoter.profile_views ?? 0,
    totalListings: promoter.listings?.length ?? 0,
  };
}

export default function TopPromoters() {
  const dispatch = useAppDispatch();
  const {
    items: promoters,
    loading,
    error,
  } = useAppSelector((state) => state.promoters);

  useEffect(() => {
    // Backend does the sorting AND the limiting — we only ever fetch
    // exactly the 5 rows we're going to show, not a larger page filtered
    // down client-side afterward.
    dispatch(promotersApi.getPromoters({ limit: TOP_N, sort: "-profile_views" }));
  }, [dispatch]);

  const topPromoters = useMemo(() => promoters.map(normalizeTopPromoter), [promoters]);
  const hasViews = topPromoters.some((item) => item.totalViews > 0);

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
      {loading ? (
        <p className="text-sm text-zinc-400">Loading top promoters...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <>
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
            <Link href="/dashboard/network-directory"
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
            </Link>
          )}
        </>
      )}
    </div>
  );
}