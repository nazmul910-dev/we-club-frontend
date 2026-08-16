import { formatCompactNumber } from "@/lib/utils/format-number";
import { Eye } from "lucide-react";

export interface Listing {
  id: string;
  title: string;
  location: string;
  views: number;
  price: string;
}

interface ListingRowProps {
  listing: Listing;
}

const formatPrice = (price: string) => {
  const [amount, currency] = price.split(" ");

  return formatCompactNumber(Number(amount), {
    currency,
    // currencyPosition: "suffix ",
  });
};

export default function ListingRow({ listing }: ListingRowProps) {
  return (
    <div className="group w-full rounded-xl border border-transparent px-2 py-4 transition-all duration-300 hover:border-[#5E4A20] hover:bg-[#171717]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">{listing.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{listing.location}</p>
        </div>

        <div className="text-right">
          <p className="text-lg text-[#D8B761]">
            {formatPrice(listing.price)}
          </p>

          <div className="mt-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
            <Eye className="h-3 w-3" />
            {formatCompactNumber(listing.views)}
          </div>
        </div>
      </div>
    </div>
  );
}