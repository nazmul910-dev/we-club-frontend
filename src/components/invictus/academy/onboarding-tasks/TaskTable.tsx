"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Archive, ClipboardList, Edit, Loader2, Send, Star } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  archiveOnboardingTask,
  publishOnboardingTask,
} from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import type { AdminOnboardingTask } from "@/lib/features/onboardingTasks/onboardingTaskTypes";

import InvictusConfirmDialog from "@/components/invictus/academy/shared/InvictusConfirmDialog";

interface Props {
  data: AdminOnboardingTask[];
  onEdit: (task: AdminOnboardingTask) => void;
}

const statusBadgeClass: Record<AdminOnboardingTask["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<AdminOnboardingTask["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const triggerLabel: Record<AdminOnboardingTask["trigger"], string> = {
  manual: "Manual",
  auto_on_login: "Auto on Login",
  video_watch: "Video Watch",
};

export default function TaskTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const mutatingTaskId = useAppSelector(
    (state) => state.onboardingTasks.mutatingTaskId,
  );

  const [archiveTarget, setArchiveTarget] = useState<AdminOnboardingTask | null>(
    null,
  );
  const [archiving, setArchiving] = useState(false);

  const handlePublish = async (task: AdminOnboardingTask) => {
    try {
      await dispatch(publishOnboardingTask(task._id)).unwrap();
      toast.success(`"${task.title}" is now live for members.`);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to publish task.",
      );
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;

    try {
      setArchiving(true);
      await dispatch(archiveOnboardingTask(archiveTarget._id)).unwrap();
      toast.success(`"${archiveTarget.title}" archived.`);
      setArchiveTarget(null);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to archive task.",
      );
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((task) => {
            const isMutating = mutatingTaskId === task._id;

            return (
              <TableRow key={task._id}>
                <TableCell className="text-[#8A8175]">{task.order}</TableCell>

                <TableCell className="max-w-[300px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                      <ClipboardList size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1C1A17]">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="truncate text-xs text-[#8A8175]">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    {triggerLabel[task.trigger] ?? task.trigger}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className="flex w-fit items-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-100">
                    <Star size={12} />
                    {task.pointsReward}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className={statusBadgeClass[task.status]}>
                    {statusLabel[task.status]}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      disabled={task.status === "archived"}
                      onClick={() => onEdit(task)}
                      title="Edit task"
                    >
                      <Edit size={16} />
                    </Button>

                    {task.status !== "published" &&
                      task.status !== "archived" && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer text-green-600 hover:bg-green-50"
                          disabled={isMutating}
                          onClick={() => handlePublish(task)}
                          title="Publish task"
                        >
                          {isMutating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                        </Button>
                      )}

                    {task.status !== "archived" && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer text-red-500"
                        disabled={isMutating}
                        onClick={() => setArchiveTarget(task)}
                        title="Archive task"
                      >
                        {isMutating ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Archive size={16} />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-[#8A8175]">
                No onboarding tasks yet. Click &quot;Add Task&quot; to build the
                &quot;Your First Week&quot; checklist.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <InvictusConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive this task?"
        description={
          archiveTarget
            ? `"${archiveTarget.title}" will be hidden from members and can no longer be edited or published.`
            : undefined
        }
        confirmText="Archive"
        confirmVariant="danger"
        loading={archiving}
        onConfirm={confirmArchive}
      />
    </div>
  );
}
