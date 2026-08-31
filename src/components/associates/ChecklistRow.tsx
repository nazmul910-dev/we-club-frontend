import CheckIcon from "./CheckIcon";

export type ChecklistRowStatus = "complete" | "active" | "upcoming";

export type ChecklistRowItem = {
  title: string;
  description?: string;
  status: ChecklistRowStatus;
  pointsReward: number;
  action?: { label: string; href?: string };
};

export default function ChecklistRow({
  item,
  index,
  isSubmitting,
  onComplete,
}: {
  item: ChecklistRowItem;
  index: number;
  isSubmitting?: boolean;
  onComplete?: () => void;
}) {
  const isComplete = item.status === "complete";
  const isActive = item.status === "active";

  const handleActionClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!item.action?.href || item.action.href === "#") {
      event.preventDefault();
    }
    onComplete?.();
  };

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
        <div className="flex items-center gap-2">
          <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#1C1A16]">
            {item.title}
          </p>
          <span className="rounded-full bg-[#F3ECD8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A6D1F]">
            +{item.pointsReward} pts
          </span>
        </div>
        {item.description && (
          <p className="mt-0.5 text-sm text-[#8A8375]">{item.description}</p>
        )}

        {item.action && !isComplete && (
          <a
            href={item.action.href ?? "#"}
            onClick={handleActionClick}
            aria-disabled={isSubmitting}
            className={`mt-3 inline-block rounded-md border border-[#DDBB6E] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1C1A16] transition-colors hover:bg-[#FFFBF0] ${
              isSubmitting ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : item.action.label}
          </a>
        )}
      </div>
    </div>
  );
}
