"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CircleCheck, Gauge, ListChecks, Loader2 } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import type { IModuleProgress } from "@/lib/features/invictus/academy/progress/progressTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import ProgressTable from "@/components/invictus/academy/progress/ProgressTable";
// import ProgressDetailModal from "@/components/invictus/academy/progress/ProgressDetailModal";
import dynamic from "next/dynamic";

const ProgressDetailModal = dynamic(
    () => import("@/components/invictus/academy/progress/ProgressDetailModal"),
    { ssr: false },
);

export default function ManageProgressPage() {
    return (
        <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
            <ManageProgressContent />
        </AuthGuard>
    );
}

function ManageProgressContent() {
    const dispatch = useAppDispatch();

    const { records, meta, loading, error } = useAppSelector(
        (state) => state.progress,
    );

    const [courses, setCourses] = useState<ICourseModule[]>([]);
    const [moduleFilter, setModuleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "" | "completed" | "in_progress"
    >("");

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] =
        useState<IModuleProgress | null>(null);

    const loadCourses = async () => {
        try {
            const res = await courseApi.getCourses();
            setCourses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        dispatch(
            fetchAllProgress({
                moduleId: moduleFilter || undefined,
                isCompleted:
                    statusFilter === ""
                        ? undefined
                        : statusFilter === "completed",
                page: 1,
                limit: 50,
            }),
        );
    }, [dispatch, moduleFilter, statusFilter]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const stats = useMemo(() => {
        const total = meta.total || records.length;
        const completed = records.filter((item) => item.isCompleted).length;
        const inProgress = records.length - completed;
        const avgCompletion =
            records.length === 0
                ? 0
                : Math.round(
                      records.reduce(
                          (sum, item) => sum + item.overallCompletionPercent,
                          0,
                      ) / records.length,
                  );
        return { total, completed, inProgress, avgCompletion };
    }, [records, meta]);

    return (
         <div className="page-wrapper">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">INVICTUS ACADEMY</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">Progress Tracking</h1>
          <p className="mt-2 text-sm text-[#8A8175]">
            See exactly where every member stands — videos, resources, actions and quizzes — across every module.
          </p>
                </div>
            </div>



            <div className="mt-8 grid gap-6 md:grid-cols-4">
                <StatCard
                    icon={<ListChecks />}
                    title="Total Records"
                    value={String(stats.total)}
                />
                <StatCard
                    icon={<CircleCheck />}
                    title="Modules Completed"
                    value={String(stats.completed)}
                />
                <StatCard
                    icon={<Loader2 />}
                    title="In Progress"
                    value={String(stats.inProgress)}
                />
                <StatCard
                    icon={<Gauge />}
                    title="Avg. Completion"
                    value={`${stats.avgCompletion}%`}
                />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="w-full max-w-xs">
                    <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-[#E8DDCA] bg-white p-3 text-sm transition-colors duration-200 hover:border-[#B08A3E]"
                    >
                        <option value="">All Course Modules</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title} · {course.pillar?.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full max-w-xs">
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as typeof statusFilter,
                            )
                        }
                        className="w-full cursor-pointer rounded-xl border border-[#E8DDCA] bg-white p-3 text-sm transition-colors duration-200 hover:border-[#B08A3E]"
                    >
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                    </select>
                </div>
            </div>

            <div className="mt-6">
                {loading ? (
                    <p className="text-sm text-[#8A8175]">
                        Loading progress records...
                    </p>
                ) : (
                    <ProgressTable
                        data={records}
                        onView={(record) => {
                            setSelectedRecord(record);
                            setDetailOpen(true);
                        }}
                    />
                )}
            </div>

          {detailOpen &&  <ProgressDetailModal
                open={detailOpen}
                record={selectedRecord}
                onClose={() => setDetailOpen(false)}
            />}
            </div>
)


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
        <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 text-[#B18A3A]">{icon}</div>
            <p className="text-sm text-[#8A8175]">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-[#171717]">{value}</h3>
        </div>
    )
} 
}
