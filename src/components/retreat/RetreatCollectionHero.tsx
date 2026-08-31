import PageHeader from "@/components/common/PageHeader";

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
      <PageHeader
        variant="invictus"
        eyebrow={kicker}
        title={title}
        description={intro}
        titleClassName="text-[clamp(2rem,4.2vw,3.2rem)] font-medium tracking-[-0.015em]"
      />
    </div>
  );
}