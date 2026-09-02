"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Flame,
  Infinity as InfinityIcon,
  Globe,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchPillars } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import { checkPillarAccess } from "@/lib/features/invictus/academy/entitlement/entitlementSlice";
import { fetchMyAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";
import BuyPillarModal from "@/components/invictus/challenge/BuyPillarModal";

const PILLAR_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  crown: Crown,
  flame: Flame,
  infinity: InfinityIcon,
  globe: Globe,
  fearless: Flame,
  limitless: InfinityIcon,
  borderless: Globe,
};

export default function InvictusChallengeCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { pillars, loading: pillarsLoading } = useAppSelector((state) => state.pillar);
  const pillarAccessById = useAppSelector((state) => state.entitlement.pillarAccessById);
  const { myProgress } = useAppSelector((state) => state.progress);

  const [modules, setModules] = useState<ICourseModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [selectedBuyPillar, setSelectedBuyPillar] = useState<ChallengePillar | null>(null);

  // Fetch pillars and user's module progress
  useEffect(() => {
    dispatch(fetchPillars(false));
    dispatch(fetchMyAllProgress());
  }, [dispatch]);

  // Check access for all paid pillars
  useEffect(() => {
    pillars.forEach((pillar) => {
      if (pillar.isPaid && !pillarAccessById[pillar._id]) {
        dispatch(checkPillarAccess(pillar._id));
      }
    });
  }, [dispatch, pillars, pillarAccessById]);

  // Fetch all modules to group by pillar
  useEffect(() => {
    let isMounted = true;
    const loadModules = async () => {
      try {
        setModulesLoading(true);
        const res = await courseApi.getCourses();
        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setModules(list.filter((m) => m.status === "published"));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load challenge modules", err);
      } finally {
        if (isMounted) setModulesLoading(false);
      }
    };

    loadModules();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute stats for each pillar
  const pillarStats = useMemo(() => {
    return pillars.map((pillar) => {
      const hasAccess =
        !pillar.isPaid || pillarAccessById[pillar._id]?.hasAccess === true;

      // Find published modules for this pillar
      const pillarModules = modules.filter((m) => {
        const pId = typeof m.pillar === "string" ? m.pillar : m.pillar?._id;
        const pSlug = typeof m.pillar === "object" ? m.pillar?.slug : undefined;
        return pId === pillar._id || (pSlug && pSlug === pillar.slug);
      });

      if (!hasAccess) {
        return {
          pillar,
          hasAccess: false,
          percent: 0,
          status: "LOCKED" as const,
          totalModules: pillarModules.length,
          completedModules: 0,
        };
      }

      if (pillarModules.length === 0) {
        return {
          pillar,
          hasAccess: true,
          percent: 0,
          status: "NOT STARTED" as const,
          totalModules: 0,
          completedModules: 0,
        };
      }

      // Calculate progress from user's progress records
      let totalPercentSum = 0;
      let completedCount = 0;

      pillarModules.forEach((mod) => {
        const modId = typeof mod._id === "string" ? mod._id : String(mod._id);
        const progress = myProgress.find((item) => {
          const itemModId =
            typeof item?.module === "string" ? item.module : item?.module?._id;
          return itemModId === modId;
        });

        if (progress) {
          totalPercentSum += progress.overallCompletionPercent || 0;
          if (progress.isCompleted || progress.quizSummary?.passed) {
            completedCount += 1;
          }
        }
      });

      const avgPercent = Math.min(
        100,
        Math.round(totalPercentSum / pillarModules.length)
      );

      let status: "COMPLETED" | "IN PROGRESS" | "NOT STARTED" = "NOT STARTED";
      if (avgPercent >= 100 || (completedCount === pillarModules.length && pillarModules.length > 0)) {
        status = "COMPLETED";
      } else if (avgPercent > 0 || completedCount > 0) {
        status = "IN PROGRESS";
      }

      return {
        pillar,
        hasAccess: true,
        percent: avgPercent,
        status,
        totalModules: pillarModules.length,
        completedModules: completedCount,
      };
    });
  }, [pillars, modules, myProgress, pillarAccessById]);

  // Overall Challenge Progress Calculation
  const overallChallengePercent = useMemo(() => {
    const accessiblePillars = pillarStats.filter((p) => p.hasAccess);
    if (accessiblePillars.length === 0) return 0;
    const sum = accessiblePillars.reduce((acc, curr) => acc + curr.percent, 0);
    return Math.round(sum / accessiblePillars.length);
  }, [pillarStats]);

  const loading = pillarsLoading || modulesLoading;

  return (
    <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-6 md:p-8 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  border-b border-[#EAE2D2] pb-5 gap-4 md:gap-0">
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

        <div className="flex items-center md:w-[51%] xl:w-auto gap-4">
          {overallChallengePercent > 0 && (
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white border border-[#DECDB0] px-3.5 py-1.5 shadow-2xs">
              <Sparkles size={14} className="text-[#9E7B28]" />
              <span className="font-montserrat text-xs font-semibold text-[#1C1814]">
                {overallChallengePercent}% Completed
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/invictus/invictus-challenge")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#947124] px-5 py-2 font-montserrat text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#7C5F1E] cursor-pointer self-start sm:self-auto"
          >
            <span>ENTER</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Challenge Track Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-[#DECDB0] bg-white p-5 shadow-2xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-[#FAF4E6]" />
                <div className="h-4 w-10 rounded bg-[#FAF4E6]" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-[#FAF4E6]" />
                <div className="h-1.5 w-full rounded-full bg-[#F2ECE0]" />
              </div>
              <div className="h-5 w-20 rounded bg-[#FAF4E6]" />
            </div>
          ))}
        </div>
      ) : pillarStats.length === 0 ? (
        <div className="rounded-xl border border-[#EAE2D2] bg-white p-8 text-center text-sm text-[#7A7062]">
          No challenge tracks available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillarStats.map(({ pillar, hasAccess, percent, status }) => {
            const Icon =
              PILLAR_ICONS[pillar.icon?.toLowerCase()] ||
              PILLAR_ICONS[pillar.slug?.toLowerCase()] ||
              Crown;

            const isLocked = !hasAccess;

            if (isLocked) {
              return (
                <div
                  key={pillar._id}
                  onClick={() => setSelectedBuyPillar(pillar)}
                  className="group relative cursor-pointer rounded-xl border border-[#EAE2D2] bg-[#FAF8F5]/80 p-5 shadow-2xs space-y-4 opacity-85 transition hover:opacity-100 hover:border-[#9E7B28]/50 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EBE0] text-[#7A7062] group-hover:text-[#9E7B28] group-hover:bg-[#FAF4E6] transition">
                      <Icon size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock size={14} className="text-[#A69B89] group-hover:text-[#9E7B28]" />
                      <span className="font-montserrat text-xs font-semibold text-[#7A7062]">
                        {pillar.priceCents
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: pillar.currency || "usd",
                              minimumFractionDigits: 0,
                            }).format(pillar.priceCents / 100)
                          : "Locked"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#5C5348] group-hover:text-[#1C1814] uppercase">
                      {pillar.title || pillar.name}
                    </h4>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#EAE2D2]" />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-block rounded-md bg-[#EFE8DC] px-2.5 py-1 font-montserrat text-[10px] font-semibold tracking-wider text-[#7A7062] uppercase group-hover:bg-[#FAF4E6] group-hover:text-[#9E7B28]">
                      LOCKED · UNLOCK
                    </span>
                    <ArrowRight size={13} className="text-[#A69B89] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={pillar._id}
                onClick={() => router.push(`/invictus/invictus-challenge/${pillar.slug}`)}
                className="group relative cursor-pointer rounded-xl border border-[#DECDB0] bg-white p-5 shadow-2xs space-y-4 transition hover:-translate-y-0.5 hover:border-[#9E7B28] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4E6] text-[#9E7B28] group-hover:scale-105 transition">
                    <Icon size={20} />
                  </div>
                  <span className="font-montserrat text-xs font-bold text-[#9E7B28]">
                    {percent}%
                  </span>
                </div>

                <div>
                  <h4 className="font-montserrat text-xs font-bold tracking-wider text-[#1C1814] uppercase">
                    {pillar.title || pillar.name}
                  </h4>
                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[#F2ECE0] overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#9E7B28] to-[#C9A84C] transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 font-montserrat text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                      <CheckCircle2 size={11} /> COMPLETED
                    </span>
                  ) : status === "IN PROGRESS" ? (
                    <span className="inline-block rounded-md bg-[#FAF4E6] px-2.5 py-1 font-montserrat text-[10px] font-bold tracking-wider text-[#9E7B28] uppercase">
                      IN PROGRESS
                    </span>
                  ) : (
                    <span className="inline-block rounded-md bg-[#F4EFE6] px-2.5 py-1 font-montserrat text-[10px] font-semibold tracking-wider text-[#7A7062] uppercase group-hover:text-[#9E7B28]">
                      START TRACK
                    </span>
                  )}

                  <span className="flex items-center gap-1 font-montserrat text-[11px] font-semibold text-[#9E7B28] opacity-0 group-hover:opacity-100 transition">
                    Open <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buy Modal for Locked Pillars */}
      {selectedBuyPillar && (
        <BuyPillarModal
          open={Boolean(selectedBuyPillar)}
          onClose={() => setSelectedBuyPillar(null)}
          pillar={selectedBuyPillar}
        />
      )}
    </div>
  );
}

