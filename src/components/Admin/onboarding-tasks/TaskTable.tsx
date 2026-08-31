"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Archive, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  archiveOnboardingTask,
  publishOnboardingTask,
} from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import { AdminOnboardingTask } from "@/lib/features/onboardingTasks/onboardingTaskTypes";
import TaskFormModal from "./TaskFormModal";

interface Props {
  tasks: AdminOnboardingTask[];
  loading?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "border-white/20 bg-white/5 text-white/60",
  published: "border-green-500/30 bg-green-500/10 text-green-400",
  archived: "border-red-500/30 bg-red-500/10 text-red-400",
};

const TRIGGER_LABELS: Record<string, string> = {
  manual: "Manual",
  auto_on_login: "Auto on login",
  video_watch: "Video watch",
};

export default function TaskTable({ tasks, loading }: Props) {
  const dispatch = useAppDispatch();
  const mutatingTaskId = useAppSelector((state) => state.onboardingTasks.mutatingTaskId);

  const [editTarget, setEditTarget] = useState<AdminOnboardingTask | null>(null);

  const handlePublish = async (task: AdminOnboardingTask) => {
    try {
      await dispatch(publishOnboardingTask(task._id)).unwrap();
      toast.success(`"${task.title}" is now live for members.`);
    } catch (e: any) {
      toast.error(e || "Failed to publish task.");
    }
  };

  const handleArchive = async (task: AdminOnboardingTask) => {
    try {
      await dispatch(archiveOnboardingTask(task._id)).unwrap();
      toast.success(`"${task.title}" archived.`);
    } catch (e: any) {
      toast.error(e || "Failed to archive task.");
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-yellow-500/20 bg-[#111]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-white/5 px-6 py-5"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-yellow-500/20 bg-[#111]">
        <table className="w-full">
          <thead className="border-b border-yellow-500/20 bg-[#151515]">
            <tr className="text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-6 py-5">Order</th>
              <th className="px-6 py-5">Task</th>
              <th className="px-6 py-5">Trigger</th>
              <th className="px-6 py-5">Points</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-white/40">
                  No onboarding tasks yet. Create one to build the &quot;Your First
                  Week&quot; checklist.
                </td>
              </tr>
            )}

            {tasks.map((task) => {
              const isMutating = mutatingTaskId === task._id;

              return (
                <tr
                  key={task._id}
                  className="border-b border-white/5 transition hover:bg-white/3"
                >
                  <td className="px-6 py-5 text-sm text-white/50">{task.order}</td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-white">{task.title}</span>
                    {task.description && (
                      <p className="mt-1 max-w-sm text-xs text-white/30">
                        {task.description}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs text-white/50">
                      {TRIGGER_LABELS[task.trigger] ?? task.trigger}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-yellow-400">
                      +{task.pointsReward}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase ${
                        STATUS_STYLES[task.status] ?? STATUS_STYLES.draft
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditTarget(task)}
                        title="Edit"
                        className="cursor-pointer rounded-lg border border-white/15 bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
                      >
                        <Pencil size={16} />
                      </button>

                      {task.status !== "published" && task.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => handlePublish(task)}
                          disabled={isMutating}
                          title="Publish"
                          className="cursor-pointer rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isMutating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      )}

                      {task.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => handleArchive(task)}
                          disabled={isMutating}
                          title="Archive"
                          className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isMutating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Archive size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TaskFormModal
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        task={editTarget}
      />
    </>
  );
}