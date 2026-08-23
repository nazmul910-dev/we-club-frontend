import { ArrowIcon, GlobeIcon, LockIcon } from "../profiles/icons";

export type RoomCardProps = {
  /** Two-letter region code shown as a small serif mark. Omit to show a globe icon instead. */
  code?: string;
  name: string;
  /** "enter" shows a live "Enter room" link; "invitation" shows a locked "By invitation" meta line. */
  status: "enter" | "invitation";
  href?: string;
  disabled?: boolean;
  /** Stagger delay in ms for the entrance animation. */
  delay?: number;
};

export function RoomCard({
  code,
  name,
  status,
  href = "#",
  disabled = false,
  delay = 0,
}: RoomCardProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      style={{ animationDelay: `${delay}ms` }}
      onClick={(event) => {
        if (disabled) event.preventDefault();
      }}
      className={`group relative isolate block animate-rise overflow-hidden border border-[#ecdfb8] bg-gradient-to-br from-cream to-cream-deep px-6 pb-7 pt-8 text-center shadow-card transition-all duration-[450ms] ease-out rounded-xl bg-white  shadow-2xs ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-1.5 hover:border-gold hover:shadow-card-hover"
      }`}
    >
      {/* gold bar that slides in from the left on hover */}
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold to-gold-bright transition-transform duration-500 ease-snap group-hover:scale-x-100" />

      {code ? (
        <div className="mb-2.5 font-display text-2xl italic text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5">
          {code}
        </div>
      ) : (
        <div className="mx-auto mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] border-gold-deep text-gold-deep">

          <GlobeIcon className="h-[17px] w-[17px]" />
        </div>
      )}

      <p className="mb-4 px-1 text-[0.76rem] font-bold uppercase leading-[1.5] tracking-[0.03em] text-ink">
        {name}
      </p>

      {status === "enter" ? (
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-gold-deep">
          Enter room
          <ArrowIcon className="h-[11px] w-[11px] transition-transform duration-300 ease-snap group-hover:translate-x-1" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.05em] text-ink-soft">
          <LockIcon className="h-[11px] w-[11px]" />
          By invitation
        </span>
      )}
    </a>
  );
}
