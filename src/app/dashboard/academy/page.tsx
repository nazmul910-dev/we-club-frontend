"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";

const ACADEMY_MODULES = [
  {
    title: "On-Demand Masterclasses",
    description:
      "Actionable lessons, advanced models, and real-world case studies for Invictus members.",
    icon: GraduationCap,
  },
  {
    title: "Deal Playbooks",
    description:
      "Step-by-step processes, scripts, and checklists to close higher-value deals faster.",
    icon: BookOpen,
  },
  {
    title: "Live Workshops",
    description:
      "Weekly sessions led by top operators, with live Q&A and breakthrough strategy work.",
    icon: Sparkles,
  },
  {
    title: "Certification Path",
    description:
      "Complete your Invictus Academy certification and showcase your elite expertise.",
    icon: ShieldCheck,
  },
];

export default function AcademyPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = useAppSelector((state) => state.authUser.isProfileLoading);

  const accessTo = profile?.accessTo || tokenUser?.accessTo;
  const hasFullAccess = accessTo === "both" || tokenUser?.role === "admin";
  const userId = tokenUser?.id;

  useEffect(() => {
    if (userId && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(userId));
    }
  }, [dispatch, userId, profile, isProfileLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-4">
        <div className="text-eyebrow mb-2">Invictus Academy</div>
        <h1 className="font-display text-3xl md:text-4xl text-white">
          {hasFullAccess ? "Welcome to Invictus Academy" : "Invictus Academy Access"}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {hasFullAccess
            ? "Your access includes the full Invictus Academy curriculum, live workshops, and certification tracks. Explore the modules below to level up your skills."
            : "You currently do not have access to Invictus Academy. Purchase a plan to unlock premium courses, live sessions, and certification materials for your account."}
        </p>
      </div>

      {hasFullAccess ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {ACADEMY_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-6 shadow-xl shadow-black/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1a1a] text-gold">
                  <Icon size={24} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">
                  {module.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {module.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-soft/30 bg-gold-soft/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-gold">
                  Start learning
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <section className="mt-8 rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-montserrat text-xs uppercase tracking-[0.32em] text-gold">
                Access required
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                No access to Invictus Academy yet
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Upgrade your plan to gain full access to Invictus Academy and unlock premium curriculum, live sessions, and official certification tracks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-gold-soft/30 bg-gold-soft/10 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold transition hover:bg-gold-soft/20">
                  Purchase plan
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}