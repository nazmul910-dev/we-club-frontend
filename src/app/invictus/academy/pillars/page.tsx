"use client";

import { useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import PillarTable from "@/components/invictus/academy/pillars/PillarTable";
import { fetchPillars } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import {
  MAX_PILLARS,
  type ChallengePillar,
  type PillarName,
} from "@/lib/features/invictus/academy/pillar/pillarTypes";

import CreatePillarModal from "@/components/invictus/academy/pillars/CreatePillarModal";
import EditPillarModal from "@/components/invictus/academy/pillars/EditPillarModal";

export default function PillarsPage() {
  const dispatch = useAppDispatch();

  const { pillars, loading, error } = useAppSelector((state) => state.pillar);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ChallengePillar | null>(null);

  useEffect(() => {

    dispatch(fetchPillars(true));
  }, [dispatch]);

  const usedNames = useMemo(() => pillars.map((p) => p.name) as PillarName[], [pillars]);

  const canCreateMore = pillars.length < MAX_PILLARS;

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[6vw] sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#B08A3E]">Invictus Academy</p>
          <h1 className="mt-3 text-3xl font-bold">Challenge Pillars</h1>
          <p className="mt-1 text-sm text-[#8A8175]">
            {pillars.length}/{MAX_PILLARS} pillars created
          </p>
        </div>

        {canCreateMore && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#B08A3E] px-5 py-3 text-white"
          >
            <Plus size={18} />
            Create Pillar
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading pillars...</p>
        ) : (
          <PillarTable data={pillars} onEdit={(pillar) => setEditingPillar(pillar)} />
        )}
      </div>

      {createOpen && (
        <CreatePillarModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          usedNames={usedNames}
        />
      )}

      <EditPillarModal
        open={!!editingPillar}
        onClose={() => setEditingPillar(null)}
        pillar={editingPillar}
      />
    </div>
  );
}