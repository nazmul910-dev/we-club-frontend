"use client";

import { Trash2, Edit, Check } from "lucide-react";

export default function PillarCard({
  title,
  description,
  status,
  onDelete,
  onEdit,
  onPublish,
}: any) {
  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-6">
      <h3 className="text-xl font-semibold text-[#1C1A17]">{title}</h3>

      <p className="mt-2 text-sm text-[#8A8175]">{description}</p>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-[#F3E9D2] px-3 py-1 text-xs text-[#B08A3E]">
          {status}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="cursor-pointer rounded-lg border p-2"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={onDelete}
            className="cursor-pointer rounded-lg border p-2 text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={onPublish}
            className="cursor-pointer rounded-lg bg-[#B08A3E] p-2 text-white"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
