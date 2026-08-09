export default function PendingPaymentsTableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-yellow-500/20 bg-[#111]">
      <div className="border-b border-yellow-500/20 bg-[#151515] px-6 py-5">
        <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-white/5 px-6 py-5"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
        </div>
      ))}
    </div>
  );
}