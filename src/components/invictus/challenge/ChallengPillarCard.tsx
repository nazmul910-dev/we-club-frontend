"use client";

import Link from "next/link";
import { Crown, Infinity as InfinityIcon, Globe, Lock, ArrowRight } from "lucide-react";

import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";

const ICONS = { crown: Crown, infinity: InfinityIcon, globe: Globe } as const;

interface Props {
  pillar: ChallengePillar;
  hasAccess: boolean;
}

export default function ChallengePillarCard({ pillar, hasAccess }: Props) {
  const Icon = ICONS[pillar.icon] ?? Crown;
  const locked = pillar.isPaid && !hasAccess;

  return (
    <Link href={`/invictus/invictus-challenge/${pillar.slug}`} className="group relative overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#B18A3A]/50 hover:shadow-[0_20px_50px_rgba(177,138,58,.15)]">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
          <Icon size={24} />
        </div>
        {locked && <Lock size={18} className="text-[#B18A3A]" />}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-[#171717]">{pillar.title}</h3>
      <p className="mt-2 text-sm text-[#8A8175]">{pillar.tagline}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[3px] text-[#B18A3A]">
          {pillar.isPaid ? `$${(pillar.priceCents / 100).toFixed(2)}` : "Included"}
        </span>
        <span className="flex items-center gap-1 text-sm text-[#B18A3A]">
          {locked ? "Unlock" : "Enter"}
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}