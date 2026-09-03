"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { PaginationControl } from "@/components/ui/PaginationControll";
import { LEADERBOARD_PERIODS, LEADERBOARD_STATUSES, LEADERBOARD_TYPES, LeaderboardPeriod, LeaderboardStatus, LeaderboardType } from "@/lib/features/leaderboardAdmin/leaderboardAdminTypes";
import { activateLeaderboard, createLeaderboard, fetchLeaderboards, finalizeLeaderboard } from "@/lib/features/leaderboardAdmin/leaderboardAdminSlice";


const STATUS_STYLES: Record<LeaderboardStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-emerald-100 text-emerald-700",
  finalized: "bg-blue-100 text-blue-700",
  archived: "bg-red-100 text-red-600",
};

function StatusBadge({ status }: { status: LeaderboardStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

const emptyCreateForm = {
  title: "",
  type: "points" as LeaderboardType,
  period: "seasonal" as LeaderboardPeriod,
  startAt: "",
  endAt: "",
  description: "",
};

export default function LeaderboardAdminPage() {
  const dispatch = useAppDispatch();

  const { leaderboards, meta, loading, actionLoading, error } = useAppSelector(
    (state) => state.leaderboardAdmin,
  );

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<LeaderboardStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyCreateForm);

  useEffect(() => {
    dispatch(
      fetchLeaderboards({
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
    );
  }, [dispatch, page, statusFilter]);

  const handleCreate = async () => {
    if (!form.title || !form.startAt || !form.endAt) return;

    const result = await dispatch(
      createLeaderboard({
        title: form.title,
        type: form.type,
        period: form.period,
        startAt: form.startAt,
        endAt: form.endAt,
        description: form.description || undefined,
      }),
    );

    if (createLeaderboard.fulfilled.match(result)) {
      setForm(emptyCreateForm);
      setCreateOpen(false);
    }
  };

  return (
    <PageContainer variant="invictus">
      <PageHeader
        variant="invictus"
        eyebrow="Invictus · Management"
        title="Leaderboards"
        description="Create, activate, and finalize leaderboards, then drill into each one to review member points."
        actions={
          <Button onClick={() => setCreateOpen((v) => !v)} >
            <Plus size={16} /> New Leaderboard
          </Button>
        }
      />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {createOpen && (
        <Card className="mt-6">
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Season 03 — Points Leaderboard"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </label>
              <select
                className="h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as LeaderboardType }))
                }
              >
                {LEADERBOARD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Period
              </label>
              <select
                className="h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm"
                value={form.period}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    period: e.target.value as LeaderboardPeriod,
                  }))
                }
              >
                {LEADERBOARD_PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Starts
              </label>
              <Input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ends
              </label>
              <Input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description (optional)
              </label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3 sm:col-span-2">
              <Button onClick={handleCreate} disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create Leaderboard"}
              </Button>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setStatusFilter("");
            setPage(1);
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            statusFilter === "" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          All
        </button>
        {LEADERBOARD_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Period
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Window
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Loading leaderboards...
                </td>
              </tr>
            ) : leaderboards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No leaderboards yet.
                </td>
              </tr>
            ) : (
              leaderboards.map((lb) => (
                <tr key={lb._id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 text-sm font-medium">
                    <Link
                      href={`/invictus/management/leaderboards/${lb._id}`}
                      className="hover:underline"
                    >
                      {lb.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-sm capitalize">{lb.type}</td>
                  <td className="px-5 py-3.5 text-sm capitalize">{lb.period}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={lb.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {new Date(lb.startAt).toLocaleDateString()} –{" "}
                    {new Date(lb.endAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      {lb.status !== "active" && lb.status !== "finalized" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading}
                          onClick={() => dispatch(activateLeaderboard(lb._id))}
                        >
                          Activate
                        </Button>
                      )}
                      {lb.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading}
                          onClick={() => dispatch(finalizeLeaderboard(lb._id))}
                        >
                          Finalize
                        </Button>
                      )}
                      <Link href={`/invictus/management/leaderboards/${lb._id}`}>
                        <Button size="sm">View Entries</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControl
            currentPage={meta.page}
            totalPages={meta.totalPages}
            variant="dark"
            onPageChange={setPage}
          />
        </div>
      )}
    </PageContainer>
  );
}