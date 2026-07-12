"use client";

import { useEffect, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import ListingRow, { Listing } from "./ListingRowComponent";
import EmptyState from "./EmptyState";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { listingsApi } from "@/lib/features/listings/listingsApi";
import Link from "next/link";

const TOP_N = 5;

function normalizeListingRow(listing: any): Listing {
  return {
    id: listing._id,
    title: listing.title,
    location: [listing.location?.city, listing.location?.region]
      .filter(Boolean)
      .join(", "),
    views: listing.listings_view ?? 0,
    price: `${listing.price?.amount ?? "-"} ${listing.price?.currency ?? ""}`.trim(),
  };
}

export default function MostViewedListings() {
  const dispatch = useAppDispatch();
  const {
    mostViewedListings: rawListings,
    mostViewedListingsLoading: loading,
    mostViewedListingsError: error,
  } = useAppSelector((state) => state.listings);

  useEffect(() => {
    // Backend sorts and limits — this fetches exactly the 5 rows shown,
    // nothing more to filter or sort client-side afterward.
    dispatch(
      listingsApi.getMostViewedListings({ limit: TOP_N, sort: "-listings_view" })
    );
  }, [dispatch]);

  const mostViewedListings = useMemo(
    () => (rawListings ?? []).map(normalizeListingRow),
    [rawListings]
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center border border-gold/50  rounded-md px-5 py-4 hover:shadow-gold transition-all duration-300 hover:border-gold/80 hover:-translate-y-1">
      <div className=" flex-1">
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-400">
            Loading most viewed listings...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-400">{error}</p>
        ) : mostViewedListings.length === 0 ? (
          <EmptyState
            title="No data found."
            description="Once a listing begins to circulate, it will rise here."
          />
        ) : (
          <div className="space-y-3">
            {mostViewedListings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <Link href={"/dashboard/listings"}
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
        Browse Listings
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}