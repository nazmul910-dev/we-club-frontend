"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
import TableSkeleton from "@/components/skeleton/Tableskeleton";
import { PaginationControl } from "@/components/ui/PaginationControll";

export default function PillarsPage() {
  const dispatch = useAppDispatch();

  const { pillars, loading, error } = useAppSelector((state) => state.pillar);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<ChallengePillar | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(pillars.length / ITEMS_PER_PAGE);

  const paginatedPillars = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return pillars.slice(start, start + ITEMS_PER_PAGE);
  }, [pillars, page]);

  useEffect(() => {
    dispatch(fetchPillars(true));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const usedNames = useMemo(() => pillars.map((p) => p.name) as PillarName[], [pillars]);

  const canCreateMore = pillars.length < MAX_PILLARS;

  return (
    <div className="page-wrapper">
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



      <div className="mt-10">
        {loading ? (
          <TableSkeleton variant="invictus" className="border border-gold-soft  rounded-2xl!"/>
        ) : (
          <>
            <PillarTable data={paginatedPillars} onEdit={(pillar) => setEditingPillar(pillar)} />
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <PaginationControl
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  variant="invictus"
                />
              </div>
            )}
          </>
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