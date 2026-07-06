"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { ListingCard } from "@/components/Listings/ListingCard";
import { ListingsGridSkeleton } from "@/components/Listings/ListingsSkeleton";
import { AddListingDialog } from "@/components/Listings/AddListingDialog";
import FilterListingDialog, {
  DEFAULT_LISTING_FILTERS,
  ListingFilters,
} from "@/components/Listings/FilterListingDialog";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => {
    return s.listings;
  });
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_LISTING_FILTERS);

  useEffect(() => {
    dispatch(listingsApi.getListings());
  }, [dispatch]);

  const visibleItems = useMemo(() => {
    const sortedItems = [...items];
    const direction = filters.direction === "asc" ? 1 : -1;

    const filterByCommission = sortedItems.filter((property) => {
      if (filters.commission === "any") return true;

      const commission = Number(property?.referral_commission?.offered_amount ?? 0);
      if (filters.commission === "0-5") return commission >= 0 && commission < 5;
      if (filters.commission === "5-10") return commission >= 5 && commission < 10;
      if (filters.commission === "10-15") return commission >= 10 && commission < 15;
      return commission >= 15;
    });

    if (filters.sortBy === "price") {
      filterByCommission.sort((a, b) => {
        return (
          (Number(a?.price?.amount ?? 0) - Number(b?.price?.amount ?? 0)) * direction
        );
      });
    } else if (filters.sortBy === "area_sqm") {
      filterByCommission.sort((a, b) => {
        return (Number(a?.area_sqm ?? 0) - Number(b?.area_sqm ?? 0)) * direction;
      });
    } else {
      filterByCommission.sort((a, b) => {
        return (
          (Number(a?.referral_commission?.offered_amount ?? 0) -
            Number(b?.referral_commission?.offered_amount ?? 0)) *
          direction
        );
      });
    }

    return filterByCommission;
  }, [filters, items]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Inventory · Discreet</div>
          <h1 className="font-display text-3xl md:text-4xl text-white">
            My Listings
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Properties presented under your name or shared from the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FilterListingDialog
            onApply={(filters) => setFilters(filters)}
            onReset={() => setFilters(DEFAULT_LISTING_FILTERS)}
            defaultValues={filters}
          />
          <AddListingDialog
            onSubmit={async (formData) => {
              await dispatch(listingsApi.postListing(formData)).unwrap();
              dispatch(listingsApi.getListings()); // refresh grid after creating
            }}
          />
        </div>
      </div>

      {loading ? (
        <ListingsGridSkeleton count={6} />
      ) : visibleItems.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-10 text-center text-white shadow-xl">
          <span className="mb-3 text-sm font-ui uppercase tracking-[0.3em] text-gold">
            No listings found
          </span>
          <h2 className="max-w-md text-2xl font-semibold text-white">
            There are no listings that match your filter yet.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Try changing the sort order or commission filter, or add a new listing to populate your inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
