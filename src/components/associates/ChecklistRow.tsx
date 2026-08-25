import { ChecklistItem } from "@/app/invictus/associates/page";
import CheckIcon from "./CheckIcon";





export default function ChecklistRow({ item, index }: { item: ChecklistItem; index: number }) {
  const isComplete = item.status === "complete";
  const isActive = item.status === "active";

  return (
    <div
      className={`flex items-start gap-4 rounded-lg border px-5 py-4 sm:items-center ${
        isActive
          ? "border-[#DDBB6E] bg-[#FFFBF0]"
          : "border-[#EDE7D8] bg-white"
      }`}
    >
      {/* Status indicator */}
      <div className="mt-0.5 shrink-0 sm:mt-0">
        {isComplete ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6A34A]">
            <CheckIcon />
          </div>
        ) : (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-semibold ${
              isActive
                ? "border-[#C6A34A] text-[#A88A3F]"
                : "border-[#DAD3C2] text-[#B0A996]"
            }`}
          >
            {index}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#1C1A16]">
          {item.title}
        </p>
        <p className="mt-0.5 text-sm text-[#8A8375]">{item.description}</p>

        {item.action && (
          <a
            href={item.action.href}
            className="mt-3 inline-block rounded-md border border-[#DDBB6E] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1C1A16] transition-colors hover:bg-[#FFFBF0]"
          >
            {item.action.label}
          </a>
        )}
      </div>
    </div>
  );
}