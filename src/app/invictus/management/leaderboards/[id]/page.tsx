"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { PaginationControl } from "@/components/ui/PaginationControll";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import { getInitials } from "@/lib/utils/Helpers";
import { clearSelectedLeaderboard, fetchLeaderboardEntries, fetchSingleLeaderboard, finalizeLeaderboard, recalculateLeaderboardRanks, removeLeaderboardEntry, upsertEntryPoints } from "@/lib/features/leaderboardAdmin/leaderboardAdminSlice";


const ENTRIES_PER_PAGE = 25;

export default function LeaderboardEntriesAdminPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const leaderboardId = params.id;

  const {
    selectedLeaderboard,
    entries,
    entriesMeta,
    loading,
    entriesLoading,
    entryActionLoading,
    actionLoading,
    error,
  } = useAppSelector((state) => state.leaderboardAdmin);

  const [page, setPage] = useState(1);
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustDelta, setAdjustDelta] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    dispatch(fetchSingleLeaderboard(leaderboardId));
    return () => {
      dispatch(clearSelectedLeaderboard());
    };
  }, [dispatch, leaderboardId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(
      fetchLeaderboardEntries({ leaderboardId, page, limit: ENTRIES_PER_PAGE }),
    );
  }, [dispatch, leaderboardId, page]);

  const handleAdjustPoints = async () => {
    const delta = Number(adjustDelta);
    if (!adjustUserId || !Number.isInteger(delta)) return;

    const result = await dispatch(
      upsertEntryPoints({
        leaderboardId,
        payload: {
          userId: adjustUserId,
          pointsDelta: delta,
          breakdownKey: adjustReason || undefined,
        },
      }),
    );

    if (upsertEntryPoints.fulfilled.match(result)) {
      setAdjustUserId("");
      setAdjustDelta("");
      setAdjustReason("");
    }
  };

  const handleRemoveEntry = (userId: string) => {
    dispatch(removeLeaderboardEntry({ leaderboardId, userId }));
  };

  const handleRecalculate = async () => {
    const result = await dispatch(recalculateLeaderboardRanks(leaderboardId));
    if (recalculateLeaderboardRanks.fulfilled.match(result)) {
      dispatch(
        fetchLeaderboardEntries({ leaderboardId, page, limit: ENTRIES_PER_PAGE }),
      );
    }
  };

  const isFinalized = selectedLeaderboard?.status === "finalized";
  const startRank = (page - 1) * ENTRIES_PER_PAGE;

  return (
    <PageContainer variant="invictus">
      <button
        onClick={() => router.push("/invictus/management/leaderboards")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} /> All Leaderboards
      </button>

      <PageHeader
        variant="invictus"
        eyebrow={selectedLeaderboard ? `${selectedLeaderboard.type} · ${selectedLeaderboard.period}` : "Leaderboard"}
        title={loading ? "Loading..." : selectedLeaderboard?.title ?? "Leaderboard"}
        description={selectedLeaderboard?.description}
        actions={
          <div className="flex gap-2">
            {selectedLeaderboard?.status === "active" && (
              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => dispatch(finalizeLeaderboard(leaderboardId))}
              >
                Finalize
              </Button>
            )}
            <Button
              variant="outline"
              disabled={entryActionLoading || isFinalized}
              onClick={handleRecalculate}
            >
              <RefreshCw size={15} /> Recalculate Ranks
            </Button>
          </div>
        }
      />



      {isFinalized && (
        <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
          This leaderboard is finalized — points and entries can no longer be modified.
        </p>
      )}

      {/* {!isFinalized && (
        <Card className="mt-6">
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-[1fr_140px_1fr_auto]">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User ID
              </label>
              <Input
                value={adjustUserId}
                onChange={(e) => setAdjustUserId(e.target.value)}
                placeholder="Mongo user _id"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Points delta
              </label>
              <Input
                type="number"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(e.target.value)}
                placeholder="+50 or -20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Reason (breakdown key, optional)
              </label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. manual_adjustment"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAdjustPoints}
                disabled={entryActionLoading || !adjustUserId || !adjustDelta}
              >
                {entryActionLoading ? "Saving..." : "Apply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )} */}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-14 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Rank
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Member
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Country
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Points
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entriesLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Loading entries...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No entries yet for this leaderboard.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry._id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5">
                    {/* Entries arrive sorted by points from the API — display rank
                        is derived from row position, not the stored `rank` field,
                        since `rank` is only set once a leaderboard is finalized. */}
                    <RankBadge rank={startRank + index + 1} />
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[0.65rem] font-semibold">
                        {getInitials(entry.user.fullName)}
                      </span>
                      {entry.user.fullName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {entry.user.country ?? "-"}
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm font-semibold">
                    {entry.points.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        disabled={entryActionLoading || isFinalized}
                        onClick={() => handleRemoveEntry(entry.user._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {entriesMeta && entriesMeta.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControl
            currentPage={entriesMeta.page}
            totalPages={entriesMeta.totalPages}
            variant="dark"
            onPageChange={setPage}
          />
        </div>
      )}
    </PageContainer>
  );
}
