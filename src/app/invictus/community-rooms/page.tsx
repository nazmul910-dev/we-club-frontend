import { CouncilCard } from "@/components/invictus/community/CouncilCard";
import { RoomCard } from "@/components/invictus/community/RoomCard";

const focusGroups = [
  { code: "CA", name: "World Élite Canada — Focus Group & Referrals", status: "enter" as const },
  { code: "US", name: "World Élite USA — Focus Group & Referrals", status: "invitation" as const },
  { code: "ES", name: "World Élite Spain — Focus Group & Referrals", status: "invitation" as const },
  { code: "MX", name: "World Élite Mexico — Focus Group & Referrals", status: "invitation" as const },
  { code: "PT", name: "World Élite Portugal — Focus Group & Referrals", status: "invitation" as const },
  { code: "FR", name: "World Élite France — Focus Group & Referrals", status: "invitation" as const },
  { name: "Contact World Élite for Global Referrals", status: "enter" as const },
];

const innerCircles = [
  { name: "CCC — CEOs Council Club" },
  { name: "FCC — Founders Council Club" },
  { name: "The NewGen VIP Community" },
  { name: "World Élite Inner Circle" },
];

export default function CommunityRoomsPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-[6vw] pb-[9vw] pt-[6vw]">
      {/* page head */}
      <div className="mb-[4.6rem]">
        <div className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">
          Community Rooms
        </div>
        <h1 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium tracking-[-0.01em]">
          Where the work happens.
        </h1>
      </div>

      {/* focus groups */}
      <section className="mb-[5.5rem]">
        <div className="mb-7 flex flex-col">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            Focus Groups
          </span>
          <h2 className="font-display text-2xl font-medium tracking-[-0.005em]">
            World Élite Global
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {focusGroups.map((room, i) => (
            <RoomCard key={room.name} {...room} delay={i * 60} />
          ))}
        </div>
      </section>

      {/* inner circles */}
      <section>
        <div className="mb-7 flex flex-col">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            Inner Circles
          </span>
          <h2 className="font-display text-2xl font-medium tracking-[-0.005em]">
            Invitation-only councils
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {innerCircles.map((circle, i) => (
            <CouncilCard key={circle.name} {...circle} delay={i * 80} />
          ))}
        </div>
      </section>
    </main>
  );
}
