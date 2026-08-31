"use client";

import Link from "next/link";
import {
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Globe,
  Sparkles,
  Trophy,
  BookOpen,
} from "lucide-react";

export default function InvictusCampusSection() {
  const campusCards = [
    {
      title: "COMMUNITY ROOMS",
      subtitle: "12 members online",
      badge: "LIVE",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      href: "/invictus/community-rooms",
      icon: MessageSquare,
    },
    {
      title: "CEO PROFILES",
      subtitle: "New video from Sofia Marchetti",
      badge: "NEW",
      badgeColor: "bg-[#FAF4E6] text-[#9E7B28] border-[#DECDB0]",
      href: "/invictus/ceo-profiles",
      icon: UserCheck,
    },
    {
      title: "FCC PROFILES",
      subtitle: "Founders Council Club",
      badge: "NEW",
      badgeColor: "bg-[#FAF4E6] text-[#9E7B28] border-[#DECDB0]",
      href: "/invictus/founders-profiles",
      icon: ShieldCheck,
    },
    {
      title: "ASSOCIATES",
      subtitle: "Members only",
      badge: "ACTIVE",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      href: "/invictus/associates",
      icon: Globe,
    },
    {
      title: "RETREATS",
      subtitle: "Marrakech · October 2026",
      badge: "NEW",
      badgeColor: "bg-[#FAF4E6] text-[#9E7B28] border-[#DECDB0]",
      href: "/invictus/retreats",
      icon: Sparkles,
    },
    {
      title: "LEADERBOARD",
      subtitle: "#1 Nathalie R. · 2,840 pts",
      badge: "TOP",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      href: "/invictus/leaderboard",
      icon: Trophy,
    },
    {
      title: "RESOURCES & LIBRARY",
      subtitle: "PDFs, worksheets, templates",
      badge: "UPDATED",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      href: "/invictus/accountability",
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-montserrat text-[10px] font-bold tracking-[0.24em] text-[#9E7B28] uppercase">
          THE CAMPUS
        </p>
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1C1814] tracking-tight">
          The INVICTUS Campus of the Newgen Business Wo/Men
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
        {campusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex flex-col justify-between rounded-xl border border-[#DECDB0] bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9E7B28] hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF6EE] text-[#9E7B28] group-hover:bg-[#9E7B28] group-hover:text-white transition">
                  <Icon size={16} />
                </div>
                <span
                  className={`rounded-md border px-2 py-0.5 font-montserrat text-[9px] font-bold tracking-wider uppercase ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>

              <div className="mt-3 space-y-0.5">
                <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#1C1814] uppercase group-hover:text-[#9E7B28] transition">
                  {card.title}
                </h4>
                <p className="font-montserrat text-[11px] text-[#6B6358] truncate">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
