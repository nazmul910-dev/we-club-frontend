import { ArrowUpRight } from "lucide-react";
import WorldMapCard from "./WorldMap";
import { StatPill } from "./StatPill";



export default function ReachedAudience() {
  return (
    <div className="py-8 ">

      <div className="flex items-start justify-between">

        <div>
       
          <p className="mt-3 text-sm text-zinc-500">
            Live visitor distribution across the network.
          </p>
        </div>

        <div className="flex items-center gap-10">

          <StatPill
            value={68}
            label="Countries"
          />

          <StatPill
            value={214}
            label="Cities"
          />

          <button
            className="
            rounded-full
            border
            border-[#6B5522]
            px-5
            py-2
            text-xs
            uppercase
            tracking-[0.28em]
            text-[#D3AE57]
            transition
            hover:border-[#C9A227]
            hover:bg-[#191919]
          "
          >
            Open Atlas
            <ArrowUpRight className="ml-2 inline h-3 w-3" />
          </button>

        </div>

      </div>

      <WorldMapCard />

    </div>
  );
}