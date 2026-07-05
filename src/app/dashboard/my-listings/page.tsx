"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { ListingCard } from "@/components/Listings/ListingCard";
import { Plus } from "lucide-react";
import { ListingsGridSkeleton } from "@/components/Listings/ListingsSkeleton";
import { AddListingDialog } from "@/components/Listings/AddListingDialog";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => {
    return s.listings;
  });

  

  useEffect(() => {
    dispatch(listingsApi.getListings());
  }, [dispatch]);

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
          <button
            type="button"
            className="rounded-full border border-gold-soft px-4 py-2 font-ui text-[11px] tracking-[0.2em] uppercase text-white hover:border-gold hover:text-gold transition duration-200 cursor-pointer"
          >
            Filter
          </button>

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
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
