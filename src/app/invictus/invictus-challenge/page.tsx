"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchPillars } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import { checkPillarAccess } from "@/lib/features/invictus/academy/entitlement/entitlementSlice";
import ChallengePillarCard from "@/components/invictus/challenge/ChallengPillarCard";

export default function InvictusChallenge() {
  const dispatch = useAppDispatch();

  // const { pillars, loading } = useAppSelector((state) => state.pillar);
  const pillars = useAppSelector((state) => state.pillar.pillars);
  const loading = useAppSelector((state) => state.pillar.loading)
  const pillarAccessById = useAppSelector((state) => state.entitlement.pillarAccessById);

  useEffect(() => {
    dispatch(fetchPillars(false));
  }, [dispatch]);

  useEffect(() => {
    pillars.forEach((pillar) => {
      if (pillar.isPaid && !pillarAccessById[pillar._id]) {
        dispatch(checkPillarAccess(pillar._id));
      }
    });
  }, [dispatch, pillars, pillarAccessById]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#171717] mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-10 shadow-sm">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#B18A3A]/10 blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[5px] text-[#B18A3A]">INVICTUS CHALLENGE</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-[#171717]">Pick Your Pillar. Start the Challenge.</h1>
          <p className="mt-4 max-w-2xl text-[#8A8175]">Every pillar is a complete track of videos, resources, actions, a quiz and a certificate. Watch, act, get tested, get certified.</p>
        </div>
      </div>

      <div className="mt-12">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading pillars...</p>
        ) : pillars.length === 0 ? (
          <p className="text-sm text-[#8A8175]">No challenge pillars are published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <ChallengePillarCard key={pillar._id} pillar={pillar} hasAccess={!pillar.isPaid || pillarAccessById[pillar._id]?.hasAccess === true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}