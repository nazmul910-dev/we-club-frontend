import { LockIcon } from "../profiles/icons";

export type CouncilCardProps = {
  name: string;
  href?: string;
  /** Stagger delay in ms for the entrance animation. */
  delay?: number;
};

export function CouncilCard({ name, href = "#", delay = 0 }: CouncilCardProps) {
  return (
    <a
      // href={href}
      style={{ animationDelay: `${delay}ms` }}
      className="group relative isolate block animate-rise overflow-hidden border border-[#ecdfb8] bg-[radial-gradient(ellipse_340px_200px_at_50%_-20%,rgba(201,154,68,.16),transparent_65%)] bg-dark px-7 pb-8 pt-9 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-gold-bright/50 hover:shadow-vault rounded-xl cursor-not-allowed"
    >
      {/* corner brackets — real elements instead of ::before/::after so no external CSS is needed */}
      <span className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-gold-bright/50 opacity-0 transition-opacity duration-[450ms] group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b border-r border-gold-bright/50 opacity-0 transition-opacity duration-[450ms] group-hover:opacity-100" />

      <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-full border border-gold-bright/40 bg-gold-bright/10 text-gold-bright transition-transform duration-500 ease-bounce group-hover:-rotate-[4deg] group-hover:scale-[1.08] group-hover:bg-gold-bright/20">
        <LockIcon className="h-[17px] w-[17px]" />
      </div>

      <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.05em] text-gold-bright">
        {name}
      </p>

      <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.05em] text-[#8c8578]">
        <LockIcon className="h-[11px] w-[11px] opacity-70" />
        By invitation
      </span>
    </a>
  );
}
