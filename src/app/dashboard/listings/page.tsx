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
import { PaginationControl } from "@/components/ui/PaginationControll";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, meta } = useSelector((s: RootState) => {
    return s.listings;
  });

  const [countrySearch, setCountrySearch] = useState("");
  const [filters, setFilters] = useState<ListingFilters>(
    DEFAULT_LISTING_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);



  const visibleItems = useMemo(() => {
    const sortedItems = [...items];
    const direction = filters.direction === "asc" ? 1 : -1;

    const filteredItems = sortedItems.filter((property) => {
      const matchesCountry =
        countrySearch.trim() === "" ||
        property.location?.country
          ?.toLowerCase()
          .includes(countrySearch.trim().toLowerCase());

      let matchesCommission = true;

      if (filters.commission !== "any") {
        const commission = Number(
          property.referral_commission?.offered_amount ?? 0,
        );

        if (filters.commission === "0-5") {
          matchesCommission = commission >= 0 && commission < 5;
        } else if (filters.commission === "5-10") {
          matchesCommission = commission >= 5 && commission < 10;
        } else if (filters.commission === "10-15") {
          matchesCommission = commission >= 10 && commission < 15;
        } else {
          matchesCommission = commission >= 15;
        }
      }

      return matchesCountry && matchesCommission;
    });

    if (filters.sortBy === "price") {
      filteredItems.sort((a, b) => {
        return (
          (Number(a?.price?.amount ?? 0) - Number(b?.price?.amount ?? 0)) *
          direction
        );
      });
    } else if (filters.sortBy === "area_sqm") {
      filteredItems.sort((a, b) => {
        return (
          (Number(a?.area_sqm ?? 0) - Number(b?.area_sqm ?? 0)) * direction
        );
      });
    } else {
      filteredItems.sort((a, b) => {
        return (
          (Number(a?.referral_commission?.offered_amount ?? 0) -
            Number(b?.referral_commission?.offered_amount ?? 0)) *
          direction
        );
      });
    }

    return filteredItems;
  }, [filters, items]);

  useEffect(() => {
    dispatch(listingsApi.getListings({ page, limit,search: countrySearch }));
  }, [dispatch, page, limit,countrySearch]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Inventory · Discreet</div>
          <h1 className="font-playfair text-3xl md:text-4xl text-white">
            WE Listings
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Properties presented under your name or shared from the platform.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="space-x-3 space-y-3 md:space-x-0 md:space-y-0 md:flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by country..."
              value={countrySearch}
              onChange={(e) => {
                const value = e.target.value;
                setCountrySearch(value);

                dispatch(
                  listingsApi.getListings({
                    page: 1,
                    limit,
                    search: value,
                  }),
                );
              }}
              className="w-64 rounded-full border border-gold-soft bg-[#131313] px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-gold"
            />

            <FilterListingDialog
              onApply={(filters) => setFilters(filters)}
              onReset={() => setFilters(DEFAULT_LISTING_FILTERS)}
              defaultValues={filters}
            />
            <AddListingDialog
              onSubmit={async (formData) => {
                await dispatch(listingsApi.postListing(formData)).unwrap();
                // postListing.fulfilled already unshifts into items — no
                // refetch needed here (same fix as the previous version of
                // this page).
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Per page</label>
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-[#3A3120] bg-[#131313] px-3 py-2 text-sm text-white outline-none"
            >
              {[10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <ListingsGridSkeleton count={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-10 text-center text-white shadow-xl">
          <span className="mb-3 text-sm font-ui uppercase tracking-[0.3em] text-gold">
            No listings found
          </span>
          <h2 className="max-w-md text-2xl font-semibold text-white">
            There are no listings that match your filter yet.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Try changing the sort order or commission filter, or add a new
            listing to populate your inventory.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((property) => (
              <ListingCard key={property._id} property={property} />
            ))}
          </div>

          <div className="mt-8">
            <PaginationControl
              currentPage={page}
              totalPages={meta?.totalPages ?? 1}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                dispatch(listingsApi.getListings({ page: nextPage, limit }));
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
