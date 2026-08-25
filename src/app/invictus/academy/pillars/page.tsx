"use client";

import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import PillarTable from "@/components/invictus/academy/pillars/PillarTable";
import {
  fetchPillars,
  deletePillar,
} from "@/lib/features/invictus/academy/pillar/pillarSlice";

import PillarCard from "@/components/invictus/academy/pillars/PillarCard";

import CreatePillarModal from "@/components/invictus/academy/pillars/CreatePillarModal";

export default function PillarsPage() {
  const dispatch = useAppDispatch();

  const { pillars } = useAppSelector((state) => state.pillar);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPillars());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[6vw] sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#B08A3E]">
            Invictus Academy
          </p>

          <h1 className="mt-3 text-3xl font-bold">Challenge Pillars</h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#B08A3E] px-5 py-3 text-white"
        >
          <Plus size={18} />
          Create Pillar
        </button>
      </div>

      <div className="mt-10 ">
        <PillarTable data={pillars} />
        {/* {pillars.map((item: any) => (
          <PillarCard
            key={item._id}
            title={item.title}
            description={item.description}
            status={item.status}
            onDelete={() => {
              dispatch(deletePillar(item._id));
            }}
            onEdit={() => {}}
            onPublish={() => {}}
          />
        ))} */}
      </div>

      {open && (
        <CreatePillarModal
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
