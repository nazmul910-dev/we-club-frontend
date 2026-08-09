"use client";

import { Plus } from "lucide-react";

interface Props {
  onCreateClick: () => void;
}

export default function DiscountHeader({ onCreateClick }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs tracking-[5px] text-eyebrow uppercase">
          DISCOUNT MANAGEMENT
        </p>

        <h1 className="text-4xl font-serif text-white mt-3">
          Discount Codes
        </h1>

        <p className="text-white/40 mt-2">
          Create, send and manage discount codes for members.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateClick}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
      >
        <Plus size={18} />
        Create Discount
      </button>
    </div>
  );
}