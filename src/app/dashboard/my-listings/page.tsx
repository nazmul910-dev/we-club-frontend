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
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => {
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
    <PageContainer variant="dashboard">
      {/* Header Section */}
      <PageHeader
        eyebrow="Inventory · Discreet"
        title="My Listings"
        description="Properties presented under your name or shared from the platform."
        actions={
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
        }
      />

      {loading ? (
        <ListingsGridSkeleton count={6} />
      ) : visibleItems.length === 0 ? (
        <EmptyState
          kicker="No listings found"
          title="There are no listings that match your filter yet."
          description="Try changing the sort order or commission filter, or add a new listing to populate your inventory."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
