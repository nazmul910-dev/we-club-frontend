export function RankBadge({ rank }: { rank: number }) {
  const tierClass =
    rank === 1
      ? "border-[#c99a44] bg-gradient-to-br from-[#f3d98a] to-[#b4863a] text-[#3a2c10] ring-4 ring-[#c99a4424]"
      : rank === 2
        ? "border-[#c7cbca] bg-gradient-to-br from-[#eef0ef] to-[#b7bcbb] text-[#33302f] ring-4 ring-[#b4b9b824]"
        : rank === 3
          ? "border-[#b4763f] bg-gradient-to-br from-[#d9a06c] to-[#935e33] text-[#3a220c] ring-4 ring-[#935e3324]"
          : "border-line bg-transparent text-ink-soft";

  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-[1.4px] font-display text-[0.8rem] font-semibold ${tierClass}`}
    >
      {rank}
    </span>
  );
}
