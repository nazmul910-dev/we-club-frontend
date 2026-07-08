import { ArrowUpRight } from "lucide-react";
import ListingRow, { mostViewedListings } from "./ListingRowComponent";
import EmptyState from "./EmptyState";

export default function MostViewedListings() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center border border-gold/50  rounded-md px-5 py-4 hover:shadow-gold transition-all duration-300 hover:border-gold/80 hover:-translate-y-1">
      <div className=" flex-1">
        {mostViewedListings.length === 0 ? (
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
        Browse Listings
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
