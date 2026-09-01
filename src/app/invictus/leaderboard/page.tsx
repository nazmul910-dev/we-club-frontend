"use client";

import { useEffect } from "react";
import { ClimbIcon, StreakIcon, TrophyIcon } from "@/components/invictus/profiles/icons";
import { LeaderboardTable, LedgerColumn } from "@/components/leaderboard/LeaderboardTable";
import { PersonCell, StreakPill, TerritoryCell } from "@/components/leaderboard/PersonCell";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import { StatCard } from "@/components/leaderboard/StatCard";
import { ShieldIcon } from "lucide-react";
import { fetchInvictusLeaderboard } from "@/lib/features/leaderboard/leaderboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { LeaderboardEntry } from "@/lib/features/leaderboard/leaderboardTypes";
import { PaginationControl } from "@/components/ui/PaginationControll";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { getInitials } from "@/lib/utils/Helpers";

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

const referrers: Referrer[] = [
  { rank: 1, name: "Adam Koubi", initials: "AK", avatarClassName: "bg-gradient-to-br from-[#5b6b4f] to-[#232e1d]", territory: "France", referrals: 214, sold: 187, volume: "$48.2M" },
  { rank: 2, name: "Sofia Marchetti", initials: "SM", avatarClassName: "bg-gradient-to-br from-[#7a5a45] to-[#2c1f16]", territory: "Italy", referrals: 142, sold: 121, volume: "$31.6M" },
  { rank: 3, name: "Carlos Vega", initials: "CV", avatarClassName: "bg-gradient-to-br from-[#4d6470] to-[#1c262b]", territory: "Mexico", referrals: 118, sold: 96, volume: "$24.9M" },
  { rank: 4, name: "Nathalie Rousseau", initials: "NR", avatarClassName: "bg-gradient-to-br from-[#8a5b6a] to-[#2d1c22]", territory: "France", referrals: 87, sold: 74, volume: "$18.4M" },
  { rank: 5, name: "David Chen", initials: "DC", avatarClassName: "bg-gradient-to-br from-[#5f5a80] to-[#221f31]", territory: "Canada", referrals: 71, sold: 63, volume: "$15.1M" },
];

const referrerColumns: LedgerColumn<Referrer>[] = [
  { key: "rank", label: "Rank", width: "w-14", render: (r) => <RankBadge rank={r.rank} /> },
  { key: "sponsor", label: "Sponsor", render: (r) => <PersonCell name={r.name} initials={r.initials} avatarClassName={r.avatarClassName} /> },
  { key: "territory", label: "Territory", render: (r) => <TerritoryCell territory={r.territory} /> },
  { key: "referrals", label: "Referrals", align: "right", render: (r) => <span className="font-display font-medium text-ink">{r.referrals}</span> },
  { key: "sold", label: "Sold", align: "right", render: (r) => <span className="font-display font-medium text-ink">{r.sold}</span> },
  { key: "volume", label: "Volume", align: "right", render: (r) => <span className="font-display font-medium text-gold-deep">{r.volume}</span> },
];

const avatarClasses = [
  "bg-gradient-to-br from-[#8a5b6a] to-[#2d1c22]",
  "bg-gradient-to-br from-[#5f5a80] to-[#221f31]",
  "bg-gradient-to-br from-[#7a5a45] to-[#2c1f16]",
  "bg-gradient-to-br from-[#4d7066] to-[#1a2723]",
];

const invictusColumns: LedgerColumn<LeaderboardEntry>[] = [
  { key: "rank", label: "Rank", width: "w-14", render: (entry) => <RankBadge rank={entry.rank} /> },
  {
    key: "member",
    label: "Member",
    render: (entry) => (
      <PersonCell
        name={entry.user.fullName}
        initials={getInitials(entry.user.fullName)}
        avatarClassName={avatarClasses[(entry.rank - 1) % avatarClasses.length]}
      />
    ),
  },
  { key: "territory", label: "Territory", render: (entry) => <TerritoryCell territory={entry.user.country ?? "-"} /> },
  { key: "streak", label: "Streak", align: "right", render: (entry) => <StreakPill value={`${entry.breakdown?.streak ?? 0}d`} /> },
  { key: "points", label: "Points", align: "right", render: (entry) => <span className="font-display font-medium text-gold-deep">{entry.points.toLocaleString()}</span> },
];

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.leaderboard.entries ?? []);
  const isLoading = useAppSelector((state) => state.leaderboard.isLoading);
  const currentPage = useAppSelector((state) => state.leaderboard.currentPage);
  const totalPages = useAppSelector((state) => state.leaderboard.totalPages);

  useEffect(() => {
    dispatch(fetchInvictusLeaderboard({ limit : 10}));
  }, [dispatch]);

  const topPerformer = entries[0];
  const longestStreak = entries.reduce(
    (best, entry) => (entry.breakdown?.streak ?? 0) > (best?.breakdown?.streak ?? 0) ? entry : best,
    topPerformer,
  );

  return (
    <PageContainer variant="invictus" as="main">
      {/* hero */}
      <div className="pb-12 pt-[3.5vw]">
        <PageHeader
          variant="invictus"
          eyebrow="Leaderboard"
          title="The ones who show up."
          description="Ranked by total points earned and accountability streak."
          titleClassName="text-[clamp(2.2rem,4.6vw,3.6rem)]"
        />
      </div>

      {/* stat cards */}
      <div className="mb-[3.6rem] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<TrophyIcon />}
          label="Top Performer"
          value={isLoading ? "Loading..." : topPerformer?.user.fullName ?? "-"}
          sub={<><span className="font-semibold text-gold-deep">{topPerformer?.breakdown?.success ?? 0}%</span> success rate</>}
          delay={20}
        />
        <StatCard
          icon={<StreakIcon />}
          label="Longest Streak"
          value={`${longestStreak?.breakdown?.streak ?? 0} days`}
          sub={longestStreak?.user.fullName ?? "-"}
          delay={90}
        />
        <StatCard
          icon={<ClimbIcon />}
          label="Highest Points"
          value={topPerformer?.points.toLocaleString() ?? "0"}
          sub={topPerformer?.user.fullName ?? "-"}
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
        rows={entries}
        rowKey={(entry) => entry._id}
        delay={80}
      />
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        variant="light"
        onPageChange={(page) => dispatch(fetchInvictusLeaderboard({page, limit : 10}))}
      />
    </PageContainer>
  );
}