"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CircleCheck, Gauge, ListChecks, Loader2 } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { PaginationControl } from "@/components/ui/PaginationControll";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchAllProgressByUser } from "@/lib/features/invictus/academy/progress/progressSlice";
import type { IUserModuleProgressGroup } from "@/lib/features/invictus/academy/progress/progressTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import ProgressTable from "@/components/invictus/academy/progress/ProgressTable";
import dynamic from "next/dynamic";

const ProgressDetailModal = dynamic(
    () => import("@/components/invictus/academy/progress/ProgressDetailModal"),
    { ssr: false },
);

const PAGE_LIMIT = 20;

export default function ManageProgressPage() {
    return (
        <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
            <ManageProgressContent />
        </AuthGuard>
    );
}

function ManageProgressContent() {
    const dispatch = useAppDispatch();

    const { userGroups, userGroupsMeta, loading, error } = useAppSelector(
        (state) => state.progress,
    );

    const [courses, setCourses] = useState<ICourseModule[]>([]);
    const [moduleFilter, setModuleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "" | "completed" | "in_progress"
    >("");
    const [page, setPage] = useState(1);

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] =
        useState<IUserModuleProgressGroup | null>(null);

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

    // Reset back to page 1 whenever a filter changes.
    useEffect(() => {
        setPage(1);
    }, [moduleFilter, statusFilter]);

    useEffect(() => {
        dispatch(
            fetchAllProgressByUser({
                moduleId: moduleFilter || undefined,
                isCompleted:
                    statusFilter === ""
                        ? undefined
                        : statusFilter === "completed",
                page,
                limit: PAGE_LIMIT,
            }),
        );
    }, [dispatch, moduleFilter, statusFilter, page]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const stats = useMemo(() => {
        const total = userGroupsMeta.total || userGroups.length;
        const completed = userGroups.filter(
            (group) => group.isFullyCompleted,
        ).length;
        const inProgress = userGroups.length - completed;
        const avgCompletion =
            userGroups.length === 0
                ? 0
                : Math.round(
                      userGroups.reduce(
                          (sum, group) => sum + group.avgCompletionPercent,
                          0,
                      ) / userGroups.length,
                  );
        return { total, completed, inProgress, avgCompletion };
    }, [userGroups, userGroupsMeta]);

    return (
        <div className="page-wrapper">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">
                        INVICTUS ACADEMY
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
                        Progress Tracking
                    </h1>
                    <p className="mt-2 text-sm text-[#8A8175]">
                        See exactly where every member stands — videos, resources, actions and quizzes — across every module.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-4">
                <StatCard
                    icon={<ListChecks />}
                    title="Total Members"
                    value={String(stats.total)}
                />
                <StatCard
                    icon={<CircleCheck />}
                    title="Fully Completed"
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
                        data={userGroups}
                        onView={(group) => {
                            setSelectedGroup(group);
                            setDetailOpen(true);
                        }}
                    />
                )}
            </div>

            {!loading && userGroupsMeta.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <PaginationControl
                        currentPage={userGroupsMeta.page}
                        totalPages={userGroupsMeta.totalPages}
                        onPageChange={setPage}
                        variant="light"
                    />
                </div>
            )}

            {detailOpen && (
                <ProgressDetailModal
                    open={detailOpen}
                    group={selectedGroup}
                    onClose={() => setDetailOpen(false)}
                />
            )}
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
        <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 text-[#B18A3A]">{icon}</div>
            <p className="text-sm text-[#8A8175]">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-[#171717]">{value}</h3>
        </div>
    );
}