export type RetreatCollectionHeroProps = {
  kicker?: string;
  title?: string;
  intro?: string;
};

export function RetreatCollectionHero({
  kicker = "World Élite — Retreats",
  title = "INVICTUS Retreats",
  intro = "Once a year we gather the inner circle of World Élite in a place designed to reset, expand and elevate. No stage, no selling, just the room.",
}: RetreatCollectionHeroProps) {
  return (
    <div className="pb-8 pt-[3vw]">
      <div className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">
        {kicker}
      </div>
      <h1 className="mb-3 font-display text-[clamp(2rem,4.2vw,3.2rem)] font-medium tracking-[-0.015em]">
        {title}
      </h1>
      <p className="max-w-[600px] text-[0.94rem] leading-relaxed text-ink-soft">{intro}</p>
    </div>
  );
}