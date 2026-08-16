"use client";

import { CheckCircle2 } from "lucide-react";
import { UpgradePlanOption } from "@/lib/features/payment/paymentSlice";

interface Props {
  plan: UpgradePlanOption;
  isSelected: boolean;
  onSelect: () => void;
}

const DURATION_LABELS: Record<number, string> = {
  3: "3 Months",
  6: "6 Months",
  12: "12 Months",
};

const DURATION_BADGE: Record<number, string | null> = {
  3: null,
  6: "Popular",
  12: "Best Value",
};

export default function UpgradePlanCard({ plan, isSelected, onSelect }: Props) {
  const badge = DURATION_BADGE[plan.durationMonths];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all ${
        isSelected
          ? "border-yellow-500 bg-yellow-500/10"
          : "border-white/10 bg-white/5 hover:border-white/25"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-bold uppercase text-black">
          {badge}
        </span>
      )}

      <div className="mb-3 flex w-full items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
          {DURATION_LABELS[plan.durationMonths]}
        </span>

        {isSelected && (
          <CheckCircle2 size={20} className="text-yellow-400" />
        )}
      </div>

      <div className="mb-1 text-3xl font-bold text-white">
        {plan.pricing.totalFirstPaymentFormatted}
      </div>

      <p className="text-xs text-white/40">{plan.pricing.displayName}</p>

      {plan.pricing.items[0]?.description && (
        <p className="mt-3 text-xs leading-relaxed text-white/30">
          {plan.pricing.items[0].description}
        </p>
      )}
    </button>
  );
}