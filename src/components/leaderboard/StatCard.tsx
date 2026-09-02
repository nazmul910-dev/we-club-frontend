import type { ReactNode } from "react";

export type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sub: ReactNode;
  delay?: number;
};

export function StatCard({ icon, label, value, sub, delay = 0 }: StatCardProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-rise border text-center md:text-left border-[#DECDB0] bg-paper-raised px-6 py-6  transition-all duration-[400ms] ease-out hover:-translate-y-1 hover:border-[#d8cba4] hover:shadow-card bg-[#FAF6EE] rounded-2xl "
    >
      <div className="mb-3.5 flex items-center justify-center md:justify-start gap-2 text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
        <span className="h-[13px] w-[13px] [&>svg]:h-full [&>svg]:w-full">{icon}</span>
        {label}
      </div>
      <p className="mb-1.5 text-[1.7rem] font-medium tracking-[-0.01em] text-ink">
        {value}
      </p>
      <p className="text-[0.72rem] font-medium text-ink-faint">{sub}</p>
    </div>
  );
}
