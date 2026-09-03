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
    <div className="w-full min-w-[120px]">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-[#8A8175]">
          {label}
        </span>
        <span
          className={`whitespace-nowrap text-xs font-semibold ${
            isDone ? "text-emerald-600" : "text-[#B08A3E]"
          }`}
        >
          {Math.round(percent)}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0E9DA]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? "bg-emerald-500" : "bg-[#B08A3E]"}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>

      <p className="mt-1 whitespace-nowrap text-[11px] text-[#8A8175]">
        {total === 0 ? "N/A" : `${completed}/${total} done`}
      </p>
    </div>
  );
}