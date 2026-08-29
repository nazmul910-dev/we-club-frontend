"use client";

import { useEffect } from "react";

import ChallengePillarCard from "@/components/invictus/challenge/ChallengPillarCard";
import { checkPillarAccess } from "@/lib/features/invictus/academy/entitlement/entitlementSlice";
import { fetchPillars } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

export default function PillarChallengePage() {
  const dispatch = useAppDispatch();
  const { pillars, loading, error } = useAppSelector((state) => state.pillar);
  const pillarAccessById = useAppSelector(
    (state) => state.entitlement.pillarAccessById,
  );

  useEffect(() => {
    dispatch(fetchPillars(false));
  }, [dispatch]);

  useEffect(() => {
    pillars
      .filter((pillar) => pillar.isPaid)
      .forEach((pillar) => dispatch(checkPillarAccess(pillar._id)));
  }, [dispatch, pillars]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-[6vw] py-[2vw] text-[#171717]">
      <div className="mx-auto max-w-295">
        <h1 className="mb-8 text-4xl font-bold">Invictus Challenge</h1>

        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading pillars...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load pillars.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <ChallengePillarCard
                key={pillar._id}
                pillar={pillar}
                hasAccess={pillarAccessById[pillar._id]?.hasAccess === true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
