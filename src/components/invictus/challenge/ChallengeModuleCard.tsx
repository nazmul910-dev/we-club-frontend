"use client";

import Link from "next/link";
import { PlayCircle, ArrowRight, CheckCircle2 } from "lucide-react";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

interface Props {
  courseModule: ICourseModule;
  pillarSlug: string;
  progressPercent: number;
  isCompleted: boolean;
}

export default function ChallengeModuleCard({ courseModule, pillarSlug, progressPercent, isCompleted }: Props) {
  return (
    <Link href={`/invictus/invictus-challenge/${pillarSlug}/${courseModule._id}`} className="group cursor-pointer rounded-3xl border border-[#E8DDCA] bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#B18A3A]/50 hover:shadow-[0_20px_50px_rgba(177,138,58,.15)]">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
          <PlayCircle size={24} />
        </div>
        {isCompleted && <CheckCircle2 size={20} className="text-emerald-500" />}
      </div>

      <p className="mt-4 text-xs uppercase tracking-[2px] text-[#B18A3A]">Module {courseModule.moduleNumber}</p>
      <h3 className="mt-1 text-xl font-semibold text-[#171717]">{courseModule.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-[#8A8175]">{courseModule.shortDescription || courseModule.description}</p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-[#8A8175]">
          <span>{courseModule.estimatedDurationMinutes} min</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F3E9D2]">
          <div style={{ width: `${progressPercent}%` }} className="h-full bg-[#B18A3A]" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-[#B18A3A]">
        {isCompleted ? "Review Module" : progressPercent > 0 ? "Continue" : "Start Module"}
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}