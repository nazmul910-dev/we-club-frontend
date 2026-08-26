import { Retreat, RetreatSchedule } from "@/types/retreat";


export type RetreatMetaRowProps = {
  retreat: Retreat;
  schedule?: RetreatSchedule;
  isPrevious? : boolean 
};

export function RetreatMetaRow({ retreat, schedule, isPrevious }: RetreatMetaRowProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2.5">
      {retreat.isFeatured && (
        <span className="inline-flex items-center gap-1.5 border border-gold/40 bg-gold-tint px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Next Retreat
        </span>
      )}

      <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-ink-soft">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
          <path d="M12 21s7-6.1 7-11.5A7 7 0 1 0 5 9.5C5 14.9 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
        {retreat.city}, {retreat.country}
      </span>

      {schedule?.dateLabel && (
        <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-ink-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
            <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
            <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
          </svg>
          {schedule.dateLabel}
        </span>
      )}

      {!isPrevious && typeof schedule?.seatsRemaining === "number" && (
        <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-ink-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
            <circle cx="9" cy="8" r="3" />
            <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
            <circle cx="17.5" cy="9" r="2.4" />
            <path d="M15.5 20c.2-2.9 1.9-5 4-5.6" />
          </svg>
          {schedule.seatsRemaining} of {schedule.seatsTotal ?? "—"} seats left
        </span>
      )}
    </div>
  );
}