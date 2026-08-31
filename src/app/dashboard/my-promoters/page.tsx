"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { listingsApi, Promoter } from "@/lib/features/listings/listingsApi";
import PromotersCard from "@/components/promoters/PromotersCard";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="card-luxe p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-[52px] h-[52px] rounded-full bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="h-14 bg-white/10 rounded-md" />
      <div className="h-14 bg-white/10 rounded-md" />
    </div>
    <div className="h-8 bg-white/10 rounded mt-2" />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyPromotersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { promoters, loading, error } = useSelector((state: RootState) => ({
    promoters: (state as any).listings?.promoters as Promoter[] ?? [],
    loading: (state as any).listings?.promotersLoading as boolean ?? false,
    error: (state as any).listings?.promotersError as string | null ?? null,
  }));

  useEffect(() => {
    dispatch(listingsApi.getMyPromoters());
  }, [dispatch]);

  return (
    <PageContainer variant="dashboard">
      {/* Header */}
      <PageHeader
        eyebrow="Operators · Trusted"
        title="My Promoters"
        description="The hand-picked operators advancing your inventory across the network."
        actions={
          !loading && promoters.length > 0 ? (
            <div className="font-ui text-xs tracking-widest uppercase text-gold border border-gold-soft rounded-full px-3 py-1">
              {promoters.length} Active
            </div>
          ) : null
        }
      />

      {/* Error */}
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
        <EmptyState
          title="No promoters added yet"
          description="You currently don't have any operators promoting your properties."
        />
      )}

      {/* Cards */}
      {!loading && promoters.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {promoters.map((promoter) => (
            <PromotersCard key={promoter.user_id} promoter={promoter} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}