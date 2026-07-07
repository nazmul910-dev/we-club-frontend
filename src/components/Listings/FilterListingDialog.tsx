"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export interface ListingFilters {
  sortBy: "price" | "area_sqm" | "commission";
  direction: "asc" | "desc";
  commission: "any" | "0-5" | "5-10" | "10-15" | "15+";
}

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  sortBy: "price",
  direction: "desc",
  commission: "any",
};

interface FilterListingDialogProps {
  onApply?: (filters: ListingFilters) => void;
  onReset?: () => void;
  defaultValues?: ListingFilters;
}

const FilterListingDialog = ({
  onApply,
  onReset,
 
  defaultValues = DEFAULT_LISTING_FILTERS,
}: FilterListingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>(defaultValues);

  useEffect(() => {
    setFilters(defaultValues);
  }, [defaultValues]);

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onApply?.(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const clearedFilters = { ...DEFAULT_LISTING_FILTERS };
    setFilters(clearedFilters);
    onReset?.();
    onApply?.(clearedFilters);
    setIsOpen(false);
  };

  console.log("filters", filters);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="rounded-full border border-gold-soft px-4 py-2 font-ui text-[11px] tracking-[0.2em] uppercase text-white transition duration-200 hover:border-gold hover:text-gold cursor-pointer"
        >
          Filter
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-gold-soft/60 bg-[#111111]/80 text-white backdrop-blur-xl">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Filter Listings</h2>
            <p className="text-sm text-muted-foreground">
              Sort your inventory by price, area, or commission and refine by
              commission percentage.
            </p>
          </div>

          <form onSubmit={applyFilters} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-white/80">
                <span>Sort by</span>
                <select
                  value={filters.sortBy}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      sortBy: event.target.value as ListingFilters["sortBy"],
                    }))
                  }
                  className="rounded-md border border-gold-soft/50 bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="price">Price</option>
                  <option value="area_sqm">Area (sqm)</option>
                  <option value="commission">Commission</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-white/80">
                <span>Order</span>
                <select
                  value={filters.direction}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      direction: event.target.value as ListingFilters["direction"],
                    }))
                  }
                  className="rounded-md border border-gold-soft/50 bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-white/80">
              <span>Commission %</span>
              <select
                value={filters.commission}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    commission: event.target.value as ListingFilters["commission"],
                  }))
                }
                className="rounded-md border border-gold-soft/50 bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none focus:border-gold"
              >
                <option value="any">Any commission</option>
                <option value="0-5">0% - 5%</option>
                <option value="5-10">5% - 10%</option>
                <option value="10-15">10% - 15%</option>
                <option value="15+">15%+</option>
              </select>
            </label>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/80 transition hover:border-gold hover:text-gold"
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <button
                type="submit"
                className="rounded-full bg-gold px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition hover:brightness-110"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterListingDialog;
