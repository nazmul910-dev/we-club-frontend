"use client";

import Image from "next/image";
import {  ITopPromoter} from "@/lib/features/dashboard/dashboardTypes";

interface PromoterRowProps {
  promoter: ITopPromoter;
  rank: number;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((item) => item.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function PromoterRow({
  promoter,
  rank,
}: PromoterRowProps) {
  return (
    <div className="group">
      <div
        className="
        flex
        items-center
        justify-between
        rounded-xl
        px-1
        py-3
        transition-all
        duration-300
        hover:bg-[#171717]
        "
      >
        <div className="flex items-center gap-4">
          <span
            className="
            w-6
            text-[11px]
            tracking-[0.25em]
            text-[#9C7A2C]
            "
          >
            {String(rank).padStart(2, "0")}
          </span>

          {promoter.profileImage ? (
            <Image
              src={promoter.profileImage}
              alt={promoter.fullName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#7B6128]
              bg-[#131313]
              text-xs
              text-[#D6B25E]
              "
            >
              {getInitials(promoter.fullName)}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-white">
              {promoter.fullName}
            </h4>

            <p className="mt-1 text-xs text-zinc-500">
              {[promoter.city, promoter.country]
                .filter(Boolean)
                .join(", ") || "Unknown"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-xl text-white">
            {promoter.totalViews.toLocaleString()}
          </p>

          <p
            className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-zinc-600
            "
          >
            Views
          </p>
        </div>
      </div>

      <div className="mx-2 h-px bg-[#2A251B]" />
    </div>
  );
}