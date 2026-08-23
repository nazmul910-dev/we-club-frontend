import { ClimbIcon, StreakIcon, TrophyIcon } from "@/components/invictus/profiles/icons";
import { LeaderboardTable, LedgerColumn } from "@/components/leaderboard/LeaderboardTable";
import { PersonCell, StreakPill, TerritoryCell } from "@/components/leaderboard/PersonCell";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import { StatCard } from "@/components/leaderboard/StatCard";
import { ShieldIcon } from "lucide-react";

type Referrer = {
  rank: number;
  name: string;
  initials: string;
  avatarClassName: string;
  territory: string;
  referrals: number;
  sold: number;
  volume: string;
};

type InvictusMember = {
  rank: number;
  name: string;
  initials: string;
  avatarClassName: string;
  territory: string;
  modules: number;
  success: string;
  streak: string;
  points: string;
};

const referrers: Referrer[] = [
  { rank: 1, name: "Adam Koubi", initials: "AK", avatarClassName: "bg-gradient-to-br from-[#5b6b4f] to-[#232e1d]", territory: "France", referrals: 214, sold: 187, volume: "$48.2M" },
  { rank: 2, name: "Sofia Marchetti", initials: "SM", avatarClassName: "bg-gradient-to-br from-[#7a5a45] to-[#2c1f16]", territory: "Italy", referrals: 142, sold: 121, volume: "$31.6M" },
  { rank: 3, name: "Carlos Vega", initials: "CV", avatarClassName: "bg-gradient-to-br from-[#4d6470] to-[#1c262b]", territory: "Mexico", referrals: 118, sold: 96, volume: "$24.9M" },
  { rank: 4, name: "Nathalie Rousseau", initials: "NR", avatarClassName: "bg-gradient-to-br from-[#8a5b6a] to-[#2d1c22]", territory: "France", referrals: 87, sold: 74, volume: "$18.4M" },
  { rank: 5, name: "David Chen", initials: "DC", avatarClassName: "bg-gradient-to-br from-[#5f5a80] to-[#221f31]", territory: "Canada", referrals: 71, sold: 63, volume: "$15.1M" },
];

const invictus: InvictusMember[] = [
  { rank: 1, name: "Nathalie Rousseau", initials: "NR", avatarClassName: "bg-gradient-to-br from-[#8a5b6a] to-[#2d1c22]", territory: "France", modules: 18, success: "96%", streak: "42d", points: "2,840" },
  { rank: 2, name: "David Chen", initials: "DC", avatarClassName: "bg-gradient-to-br from-[#5f5a80] to-[#221f31]", territory: "Canada", modules: 17, success: "92%", streak: "38d", points: "2,710" },
  { rank: 3, name: "Alexander Marchetti", initials: "AM", avatarClassName: "bg-gradient-to-br from-[#7a5a45] to-[#2c1f16]", territory: "Italy", modules: 16, success: "91%", streak: "35d", points: "2,605" },
  { rank: 4, name: "Priya Anand", initials: "PA", avatarClassName: "bg-gradient-to-br from-[#4d7066] to-[#1a2723]", territory: "USA", modules: 15, success: "89%", streak: "30d", points: "2,440" },
  { rank: 5, name: "Luis Ortega", initials: "LO", avatarClassName: "bg-gradient-to-br from-[#4d6470] to-[#1c262b]", territory: "Mexico", modules: 15, success: "87%", streak: "28d", points: "2,380" },
  { rank: 6, name: "Sofia Almeida", initials: "SA", avatarClassName: "bg-gradient-to-br from-[#8a6a45] to-[#2c2016]", territory: "Portugal", modules: 14, success: "88%", streak: "26d", points: "2,295" },
  { rank: 7, name: "Hannah Weiss", initials: "HW", avatarClassName: "bg-gradient-to-br from-[#5b6b4f] to-[#232e1d]", territory: "Spain", modules: 13, success: "85%", streak: "22d", points: "2,110" },
  { rank: 8, name: "Youssef Bennani", initials: "YB", avatarClassName: "bg-gradient-to-br from-[#7a5a45] to-[#2c1f16]", territory: "Canada", modules: 12, success: "84%", streak: "19d", points: "1,990" },
];

const referrerColumns: LedgerColumn<Referrer>[] = [
  { key: "rank", label: "Rank", width: "w-14", render: (r) => <RankBadge rank={r.rank} /> },
  { key: "sponsor", label: "Sponsor", render: (r) => <PersonCell name={r.name} initials={r.initials} avatarClassName={r.avatarClassName} /> },
  { key: "territory", label: "Territory", render: (r) => <TerritoryCell territory={r.territory} /> },
  { key: "referrals", label: "Referrals", align: "right", render: (r) => <span className="font-display font-medium text-ink">{r.referrals}</span> },
  { key: "sold", label: "Sold", align: "right", render: (r) => <span className="font-display font-medium text-ink">{r.sold}</span> },
  { key: "volume", label: "Volume", align: "right", render: (r) => <span className="font-display font-medium text-gold-deep">{r.volume}</span> },
];

const invictusColumns: LedgerColumn<InvictusMember>[] = [
  { key: "rank", label: "Rank", width: "w-14", render: (m) => <RankBadge rank={m.rank} /> },
  { key: "member", label: "Member", render: (m) => <PersonCell name={m.name} initials={m.initials} avatarClassName={m.avatarClassName} /> },
  { key: "territory", label: "Territory", render: (m) => <TerritoryCell territory={m.territory} /> },
  { key: "modules", label: "Modules", align: "right", render: (m) => <span className="font-display font-medium text-ink">{m.modules}</span> },
  { key: "success", label: "Success", align: "right", render: (m) => <span className="font-display font-medium text-ink">{m.success}</span> },
  { key: "streak", label: "Streak", align: "right", render: (m) => <StreakPill value={m.streak} /> },
  { key: "points", label: "Points", align: "right", render: (m) => <span className="font-display font-medium text-gold-deep">{m.points}</span> },
];

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-5 md:px-0 pb-[8vw]">
      {/* hero */}
      <div className="pb-12 pt-[3.5vw]">
        <div className="mb-[1.1rem] inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Leaderboard
        </div>
        <h1 className="mb-3 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-medium tracking-[-0.015em]">
          The ones who show up.
        </h1>
        <p className="max-w-[520px] text-[0.92rem] leading-relaxed text-ink-soft">
          Ranked by modules completed, module success rate, accountability streak, and community contribution.
        </p>
      </div>

      {/* stat cards */}
      <div className="mb-[3.6rem] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<TrophyIcon />}
          label="Top Performer"
          value="Nathalie R."
          sub={<><span className="font-semibold text-gold-deep">96%</span> success rate</>}
          delay={20}
        />
        <StatCard
          icon={<StreakIcon />}
          label="Longest Streak"
          value="42 days"
          sub="Nathalie Rousseau"
          delay={90}
        />
        <StatCard
          icon={<ClimbIcon />}
          label="Fastest Climber"
          value="+7 ranks"
          sub="David Chen — this month"
          delay={160}
        />
      </div>

      {/* top referrers */}
      <LeaderboardTable
        kickerIcon={<TrophyIcon />}
        kicker="Top World Élite Referrers"
        title="The ones who build the network."
        tag="Rolling 12 Months"
        columns={referrerColumns}
        rows={referrers}
        rowKey={(r) => r.name}
      />

      {/* invictus rankings */}
      <LeaderboardTable
        kickerIcon={<ShieldIcon />}
        kicker="INVICTUS Rankings"
        title="Season 03 standings."
        tag="Season 03 · Live"
        live
        columns={invictusColumns}
        rows={invictus}
        rowKey={(m) => m.name}
        delay={80}
      />
    </main>
  );
}