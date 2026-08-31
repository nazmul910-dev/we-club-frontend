"use client";

import { Plus } from "lucide-react";

interface Props {
  onCreateClick: () => void;
}

export default function TaskHeader({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
          Onboarding Tasks
        </h1>
        <p className="mt-1 text-sm text-white/50">
          These are the checklist items shown on the World Élite Associates
          &quot;Your First Week&quot; page. Each published task awards points
          the moment a member completes it, and feeds directly into their
          leaderboard points total.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateClick}
        className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-semibold text-black transition hover:bg-yellow-400"
      >
        <Plus size={16} />
        New Task
      </button>
    </div>
  );
}