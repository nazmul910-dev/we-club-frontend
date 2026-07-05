// components/profile/standing-panel.tsx
import type { ProfileStanding } from "@/lib/data/profile";

function StatRow({
  label,
  value,
  size = "base",
  isLast = false,
}: {
  label: string;
  value: string | number;
  size?: "base" | "lg";
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between py-3.5 ${
        isLast ? "" : "border-b border-[#232420]"
      }`}
    >
      <span className="text-[10px] tracking-widest uppercase text-[#8a8a82]">
        {label}
      </span>
      <span
        className={`text-[#ece9e2] ${size === "lg" ? "text-2xl" : "text-lg"}`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function StandingPanel({ standing }: { standing: ProfileStanding }) {
  return (
    <div className="rounded-2xl border border-[#26261f] bg-[#111112] px-7 py-6 h-fit">
      <h3 className="text-[11px] tracking-widest uppercase text-[#c9a962] mb-1">
        Standing
      </h3>
      <div>
        <StatRow label="Tenure" value={standing.tenure} />
        <StatRow
          label="Total Introductions"
          value={standing.totalIntroductions}
          size="lg"
        />
        <StatRow label="Lifetime Commission" value={standing.lifetimeCommission} />
        <StatRow
          label="Discretion Score"
          value={standing.discretionScore}
          isLast
        />
      </div>
    </div>
  );
}