"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { listingsApi, Promoter } from "@/lib/features/listings/listingsApi";
import PromotersCard from "@/components/promoters/PromotersCard";
import SkeletonCard from "@/components/promoters/PromotersCardSkeleton";

export default function MyPromotersPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Adjust selector path to match your actual Redux slice structure
  const { promoters, loading, error } = useSelector((state: RootState) => ({
    promoters: (state as any).listings?.promoters as Promoter[] ?? [],
    loading: (state as any).listings?.promotersLoading as boolean ?? false,
    error: (state as any).listings?.promotersError as string | null ?? null,
  }));

  useEffect(() => {
    dispatch(listingsApi.getMyPromoters());
  }, [dispatch]);


 

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Operators · Trusted</div>
          <h1 className="font-display text-3xl md:text-4xl text-white">
            My Promoters
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The hand-picked operators advancing your inventory across the
            network.
          </p>
        </div>

        {/* Live count badge */}
        {!loading && promoters.length > 0 && (
          <div className="font-ui text-xs tracking-widest uppercase text-gold border border-gold-soft rounded-full px-3 py-1">
            {promoters.length} Active
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && promoters.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gold-soft rounded-lg bg-card/50">
          <p className="text-muted-foreground font-ui text-xs tracking-wider uppercase">
            No promoters added yet
          </p>
        </div>
      )}

      {/* Promoter cards */}
      {!loading && promoters.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {promoters.map((promoter) => (
            <PromotersCard key={promoter.user_id} promoter={promoter} />
          ))}
        </div>
      )}
    </div>
  );
}


