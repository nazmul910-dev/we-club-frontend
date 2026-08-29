"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Infinity as InfinityIcon,
  Globe,
  Lock,
  ArrowRight,
} from "lucide-react";

import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";
import BuyPillarModal from "@/components/invictus/challenge/BuyPillarModal";

const ICONS = {
  crown: Crown,
  infinity: InfinityIcon,
  globe: Globe,
} as const;

interface Props {
  pillar: ChallengePillar;
  hasAccess: boolean;
}

export default function ChallengePillarCard({ pillar, hasAccess }: Props) {
  const Icon = ICONS[pillar.icon] ?? Crown;
  const locked = pillar.isPaid && !hasAccess;
  const [showBuyModal, setShowBuyModal] = useState(false);

  const cardContent = (
    <div className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#B18A3A]/50 hover:shadow-[0_20px_50px_rgba(177,138,58,.18)]">
      {/* Accent glow for locked */}
      {locked && (
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#B18A3A]/8 blur-2xl" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
          <Icon size={24} />
        </div>
        {locked && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3E9D2]">
            <Lock size={15} className="text-[#B18A3A]" />
          </div>
        )}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-[#171717]">
        {pillar.title}
      </h3>
      <p className="mt-2 text-sm text-[#8A8175]">{pillar.tagline}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[3px] text-[#B18A3A]">
          {pillar.isPaid
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: pillar.currency || "usd",
                minimumFractionDigits: 0,
              }).format(pillar.priceCents / 100)
            : "Included"}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-[#B18A3A]">
          {locked ? "Unlock" : "Enter"}
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </div>
  );

  // If locked (paid and no access) → open buy modal on click
  if (locked) {
    return (
      <>
        <div onClick={() => setShowBuyModal(true)}>{cardContent}</div>
        <BuyPillarModal
          open={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          pillar={pillar}
        />
      </>
    );
  }

  // Free or already purchased → navigate normally
  return (
    <Link href={`/invictus/invictus-challenge/${pillar.slug}`}>
      {cardContent}
    </Link>
  );
}