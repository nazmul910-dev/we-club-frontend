"use client";

import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  onCreateClick: () => void;
}

export default function DiscountHeader({ onCreateClick }: Props) {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="DISCOUNT MANAGEMENT"
      title="Discount Codes"
      description="Create, send and manage discount codes for members."
      fontFamily="font-serif"
      actions={
        <button
          type="button"
          onClick={onCreateClick}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          <Plus size={18} />
          Create Discount
        </button>
      }
    />
  );
}