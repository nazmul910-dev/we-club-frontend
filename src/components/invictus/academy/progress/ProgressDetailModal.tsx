"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CircleCheck, Clock, RefreshCcw } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { fetchUserModuleProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import type { IModuleProgress } from "@/lib/features/invictus/academy/progress/progressTypes";

import ProgressStatBar from "./ProgressStatBar";
import QuizStatusBadge from "./QuizStatusBadge";

interface Props {
  open: boolean;
  onClose: () => void;
  record: IModuleProgress | null;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function ProgressDetailModal({ open, onClose, record }: Props) {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  if (!record) return null;

  const handleRefresh = async () => {
    try {
      const userId =
        typeof record.user === "string" ? record.user : record.user?._id;
      const moduleId =
        typeof record.module === "string" ? record.module : record.module?._id;

      if (!userId || !moduleId) {
        toast.error("Invalid progress record details");
        return;
      }

      setRefreshing(true);
      await dispatch(
        fetchUserModuleProgress({ userId, moduleId }),
      ).unwrap();
      toast.success("Progress recalculated from the latest activity");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not refresh progress, try again";
      toast.error(message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">Module Progress</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E7DDCC] bg-[#FAF8F4] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E9D2] text-sm font-semibold text-[#B08A3E]">
                {record.user?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={record.user.profileImage} alt={record.user?.fullName || "Member"} className="h-full w-full object-cover" />
                ) : (
                  (record.user?.fullName || "U").charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-[#1C1A17]">{record.user?.fullName || "Unknown Member"}</p>
                <p className="text-xs text-[#8A8175]">{record.user?.email || "—"}</p>
              </div>
            </div>

            {record.isCompleted ? (
              <Badge className="flex w-fit items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <CircleCheck size={12} />
                Module Completed
              </Badge>
            ) : (
              <Badge className="flex w-fit items-center gap-1 bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]">
                <Clock size={12} />
                In Progress
              </Badge>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[3px] text-[#B08A3E]">Course Module</p>
            <h3 className="mt-1 text-lg font-semibold text-[#1C1A17]">{record.module?.title || "—"}</h3>
            {record.module?.pillar?.name && (
              <p className="text-sm text-[#8A8175]">Pillar · {record.module.pillar.name}</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#E7DDCC] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-[#1C1A17]">Overall Completion</p>
              <span className="text-sm font-semibold text-[#B08A3E]">{Math.round(record.overallCompletionPercent)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F0E9DA]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#B08A3E] to-[#D4AF6A] transition-all duration-500 ease-out" style={{ width: `${Math.min(100, record.overallCompletionPercent)}%` }} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E7DDCC] p-4">
              <ProgressStatBar label="Videos Watched" completed={record.videoSummary.completedRequired} total={record.videoSummary.totalRequired} percent={record.videoSummary.completionPercent} isDone={record.videoSummary.completed} />
            </div>
            <div className="rounded-2xl border border-[#E7DDCC] p-4">
              <ProgressStatBar label="Resources Completed" completed={record.resourceSummary.completedRequired} total={record.resourceSummary.totalRequired} percent={record.resourceSummary.completionPercent} isDone={record.resourceSummary.completed} />
            </div>
            <div className="rounded-2xl border border-[#E7DDCC] p-4">
              <ProgressStatBar label="Actions Completed" completed={record.actionSummary.completedRequired} total={record.actionSummary.totalRequired} percent={record.actionSummary.completionPercent} isDone={record.actionSummary.completed} />
              <p className="mt-2 text-xs text-[#8A8175]">{record.actionsUnlocked ? "Unlocked for this member" : "Still locked until videos & resources are done"}</p>
            </div>

            <div className="rounded-2xl border border-[#E7DDCC] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[#1C1A17]">Quiz</span>
                <QuizStatusBadge status={record.quizSummary.status} />
              </div>
              <p className="text-xs text-[#8A8175]">Best score {record.quizSummary.bestScore}% · Pass at {record.quizSummary.passScore}%</p>
              <p className="mt-1 text-xs text-[#8A8175]">Attempts {record.quizSummary.attemptsUsed}/{record.quizSummary.maximumAttempts}</p>
              {record.quizSummary.lastAttemptAt && (
                <p className="mt-1 text-xs text-[#8A8175]">Last attempt {formatDate(record.quizSummary.lastAttemptAt)}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2 rounded-2xl border border-dashed border-[#E7DDCC] bg-[#FAF8F4] p-4 text-xs text-[#8A8175] sm:grid-cols-2">
            <p>Last calculated · {formatDate(record.lastCalculatedAt)}</p>
            <p>Completed at · {formatDate(record.completedAt)}</p>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" className="cursor-pointer border-[#E7DDCC] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" onClick={onClose}>
            Close
          </Button>
          <Button disabled={refreshing} className="cursor-pointer gap-2 bg-[#B08A3E] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#B08A3E]/90 active:translate-y-0" onClick={handleRefresh}>
            <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Recalculating..." : "Recalculate Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}