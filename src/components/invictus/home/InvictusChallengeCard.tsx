"use client";

import { useRouter } from "next/navigation";
import { Crown, Flame, Infinity as InfinityIcon, Globe, Lock, ArrowRight } from "lucide-react";

export default function InvictusChallengeCard() {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-6 md:p-8 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EAE2D2] pb-5">
        <div className="space-y-1">
          <p className="font-montserrat text-[10px] font-bold tracking-[0.22em] text-[#9E7B28] uppercase">
            THE FLAGSHIP PROGRAM
          </p>
          <div className="flex items-center gap-2.5">
            <Crown size={22} className="text-[#9E7B28]" />
            <h3 className="font-playfair text-xl md:text-2xl font-bold tracking-wide text-[#1C1814]">
              THE INVICTUS CHALLENGE
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/invictus/challenge")}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#947124] px-5 py-2 font-montserrat text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#7C5F1E] cursor-pointer self-start sm:self-auto"
        >
          <span>ENTER</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3 Challenge Track Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: FEARLESS (In Progress) */}
        <div className="relative rounded-xl border border-[#DECDB0] bg-white p-5 shadow-2xs space-y-4 hover:border-[#9E7B28] transition">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4E6] text-[#9E7B28]">
              <Flame size={20} />
            </div>
            <span className="font-montserrat text-xs font-bold text-[#9E7B28]">
              42%
            </span>
          </div>

          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#1C1814] uppercase">
              FEARLESS
            </h4>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#F2ECE0] overflow-hidden">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#9E7B28] to-[#C9A84C]" />
            </div>
          </div>

          <div className="pt-2">
            <span className="inline-block rounded-md bg-[#FAF4E6] px-2.5 py-1 font-montserrat text-[10px] font-bold tracking-wider text-[#9E7B28] uppercase">
              IN PROGRESS
            </span>
          </div>
        </div>

        {/* Card 2: LIMITLESS (Locked) */}
        <div className="relative rounded-xl border border-[#EAE2D2] bg-[#FAF8F5]/80 p-5 shadow-2xs space-y-4 opacity-80 hover:opacity-100 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EBE0] text-[#7A7062]">
              <InfinityIcon size={20} />
            </div>
            <Lock size={15} className="text-[#A69B89]" />
          </div>

          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#5C5348] uppercase">
              LIMITLESS
            </h4>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#EAE2D2]" />
          </div>

          <div className="pt-2">
            <span className="inline-block rounded-md bg-[#EFE8DC] px-2.5 py-1 font-montserrat text-[10px] font-semibold tracking-wider text-[#7A7062] uppercase">
              LOCKED
            </span>
          </div>
        </div>

        {/* Card 3: BORDERLESS (Locked) */}
        <div className="relative rounded-xl border border-[#EAE2D2] bg-[#FAF8F5]/80 p-5 shadow-2xs space-y-4 opacity-80 hover:opacity-100 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EBE0] text-[#7A7062]">
              <Globe size={20} />
            </div>
            <Lock size={15} className="text-[#A69B89]" />
          </div>

          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#5C5348] uppercase">
              BORDERLESS
            </h4>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#EAE2D2]" />
          </div>

          <div className="pt-2">
            <span className="inline-block rounded-md bg-[#EFE8DC] px-2.5 py-1 font-montserrat text-[10px] font-semibold tracking-wider text-[#7A7062] uppercase">
              LOCKED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
