"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Plus, Star } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchAllOnboardingTasksAdmin } from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import type {
  AdminOnboardingTask,
  OnboardingTaskStatus,
} from "@/lib/features/onboardingTasks/onboardingTaskTypes";
import TaskTable from "@/components/invictus/academy/onboarding-tasks/TaskTable";
import CreateTaskModal from "@/components/invictus/academy/onboarding-tasks/CreateTaskModal";
import EditTaskModal from "@/components/invictus/academy/onboarding-tasks/EditTAskModal";



export default function OnboardingTasksPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <OnboardingTasksContent />
    </AuthGuard>
  );
}

function OnboardingTasksContent() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.onboardingTasks.adminTasks);
  const loading = useAppSelector(
    (state) => state.onboardingTasks.isAdminLoading,
  );
  const error = useAppSelector((state) => state.onboardingTasks.adminError);

  const [statusFilter, setStatusFilter] = useState<OnboardingTaskStatus | "">(
    "",
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminOnboardingTask | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchAllOnboardingTasksAdmin());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (!statusFilter) return tasks;
    return tasks.filter((item) => item.status === statusFilter);
  }, [tasks, statusFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const published = tasks.filter((item) => item.status === "published").length;
    const totalPoints = tasks
      .filter((item) => item.status !== "archived")
      .reduce((sum, item) => sum + (item.pointsReward || 0), 0);

    return { total, published, totalPoints };
  }, [tasks]);

  return (
    <div className="page-wrapper">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">
            INVICTUS ACADEMY
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
            Onboarding Tasks
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[#8A8175]">
            These are the checklist items shown on the World Élite Associates
            &quot;Your First Week&quot; page. Each published task awards
            points the moment a member completes it, and feeds directly into
            their leaderboard points total.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-[#B18A3A] px-5 py-2.5 text-sm text-white transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<ClipboardList />}
          title="Total Tasks"
          value={String(stats.total)}
        />

        <StatCard
          icon={<CheckCircle2 />}
          title="Published"
          value={String(stats.published)}
        />

        <StatCard
          icon={<Star />}
          title="Points Available"
          value={String(stats.totalPoints)}
        />
      </div>

      <div className="mt-8 w-full max-w-xs">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OnboardingTaskStatus | "")
          }
          className="w-full cursor-pointer rounded-xl border border-[#E7DDCC] bg-white p-3 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading tasks...</p>
        ) : (
          <TaskTable
            data={filteredTasks}
            onEdit={(task) => {
              setSelectedTask(task);
              setEditOpen(true);
            }}
          />
        )}
      </div>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <EditTaskModal
        open={editOpen}
        task={selectedTask}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="page-warpper">
      <div className="mb-4 text-[#B18A3A]">{icon}</div>

      <p className="text-sm text-[#8A8175]">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-[#171717]">{value}</h3>
    </div>
  );
}
