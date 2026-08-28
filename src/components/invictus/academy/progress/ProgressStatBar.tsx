"use client";

interface Props {
  label: string;
  completed: number;
  total: number;
  percent: number;
  isDone?: boolean;
}

export default function ProgressStatBar({ label, completed, total, percent, isDone }: Props) {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-[#1C1A17]">{label}</span>
        <span className={isDone ? "font-semibold text-emerald-600" : "text-[#8A8175]"}>
          {total === 0 ? "N/A" : `${completed}/${total}`} · {Math.round(percent)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0E9DA]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? "bg-emerald-500" : "bg-[#B08A3E]"}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}