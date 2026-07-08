import { ArrowUpRight } from "lucide-react";
import PromoterRow, { promoters } from "./PromoterRow";

export default function TopPromoters() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center border border-gold/50 px-5 py-4 rounded-md hover:border-gold/80 hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
      <div className=" space-y-1 w-full">
        {promoters.map((promoter) => (
          <PromoterRow key={promoter.id} promoter={promoter} />
        ))}
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
        Explore Network
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
