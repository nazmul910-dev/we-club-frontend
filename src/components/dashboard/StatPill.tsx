interface StatPillProps {
  value: string | number;
  label: string;
}

export function StatPill({
  value,
  label,
}: StatPillProps) {
  return (
    <div className="text-right">
      <div className="text-3xl font-display text-white">
        {value}
      </div>

      <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}