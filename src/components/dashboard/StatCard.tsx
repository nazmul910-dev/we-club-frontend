
import { cn } from "@/lib/utils";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export interface DashboardStat {
  id: number;
  title: string;
  value: string;
  change: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    id: 1,
    title: "NO. OF LISTINGS",
    value: "27",
    change: "+3 this month",
  },
  {
    id: 2,
    title: "VALUE OF LISTINGS",
    value: "€184.6M",
    change: "+€12.4M MoM",
  },
  {
    id: 3,
    title: "LISTING VIEWS GENERATED",
    value: "48,219",
    change: "+8.7% WoW",
  },
  {
    id: 4,
    title: "NO. OF PROMOTERS",
    value: "62",
    change: "12 active today",
  },
  {
    id: 5,
    title: "PROPERTIES SHARED WITH ME",
    value: "14",
    change: "3 new this week",
  },
  {
    id: 6,
    title: "COMMISSION PIPELINE",
    value: "€2.84M",
    change: "9 deals in flight",
  },
];

export default function StatCard({
  stat,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        `
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-[#655321]
        bg-[#111111]
        p-7
        hover:shadow-gold transition-all duration-300 hover:border-gold/80 `,
        className
      )}
    >
      {/* subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A44E]/50 to-transparent opacity-40" />

      <p
        className="
        text-[11px]
        uppercase
        tracking-[0.32em]
        text-zinc-500
      "
      >
        {stat.title}
      </p>

      <h2 className="mt-7 font-display text-[48px] leading-none text-[#ECE7DF]">
        {stat.value}
      </h2>

      <p className="mt-4 text-sm text-[#B89237]">
        {stat.change}
      </p>
    </div>
  );
}