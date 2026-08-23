export type PersonCellProps = {
  name: string;
  initials: string;
  /** A literal Tailwind gradient class, e.g. "bg-gradient-to-br from-[#5b6b4f] to-[#232e1d]" */
  avatarClassName: string;
};

export function PersonCell({ name, initials, avatarClassName }: PersonCellProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full font-display text-[0.72rem] font-semibold text-[#fff8ea] ring-1 ring-inset ring-white/15 ${avatarClassName}`}
      >
        {initials}
      </span>
      <span className="text-[0.85rem] font-semibold text-ink">{name}</span>
    </div>
  );
}

export function TerritoryCell({ territory }: { territory: string }) {
  return (
    <span className="text-[0.68rem] font-medium uppercase tracking-[0.09em] text-ink-faint">
      {territory}
    </span>
  );
}

export function StreakPill({ value }: { value: string }) {
  return <span className="text-[0.78rem] font-semibold text-ink-soft">{value}</span>;
}
