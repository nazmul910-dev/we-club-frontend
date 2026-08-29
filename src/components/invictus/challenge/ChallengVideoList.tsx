"use client";

import { Lock, CheckCircle2, PlayCircle, Circle } from "lucide-react";

import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";
import type { IModuleVideoWithProgress } from "@/lib/features/invictus/videoProgress/videoProgressTypes";

interface Props {
  videos: IModuleVideo[];
  progressByVideoId: Record<string, IModuleVideoWithProgress>;
  selectedVideoId?: string;
  onSelect: (video: IModuleVideo) => void;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
};

export default function ChallengeVideoList({ videos, progressByVideoId, selectedVideoId, onSelect }: Props) {
  return (
    <div className="rounded-3xl border border-[#E8DDCA] bg-white p-3">
      {videos.map((video) => {
        const progress = progressByVideoId[video._id];
        const isCompleted = progress?.progress.isCompleted ?? false;
        const isActive = video._id === selectedVideoId;

        return (
          <button key={video._id} onClick={() => onSelect(video)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${isActive ? "bg-[#F3E9D2]" : "hover:bg-[#FAF8F3]"}`}>
            <span className="text-[#B18A3A]">
              {isCompleted ? <CheckCircle2 size={18} /> : isActive ? <PlayCircle size={18} /> : <Circle size={18} />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium text-[#171717]">{video.title}</span>
              <span className="text-xs text-[#8A8175]">{formatDuration(video.durationSeconds)}</span>
            </span>
            {video.isPaid && <Lock size={14} className="text-[#B18A3A]" />}
          </button>
        );
      })}
    </div>
  );
}