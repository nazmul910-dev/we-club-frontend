"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, ListChecks, ShieldCheck, Unlock } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { fetchModuleActions } from "@/lib/features/invictus/academy/action-module/actionChecklistSlice";

import type { IModuleAction } from "@/lib/features/invictus/academy/action-module/actionChecklistTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import ActionTable from "@/components/invictus/academy/acitons/ActionTable";
// import CreateActionModal from "@/components/invictus/academy/acitons/CreateActionModal";
// import EditActionModal from "@/components/invictus/academy/acitons/EditActionModal";
import dynamic from "next/dynamic";

const CreateActionModal = dynamic(
    () => import("@/components/invictus/academy/acitons/CreateActionModal"),
    { ssr: false },
);
const EditActionModal = dynamic(
    () => import("@/components/invictus/academy/acitons/EditActionModal"),
    { ssr: false },
);

export default function ManageActionsPage() {
    return (
        <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
            <ManageActionsContent />
        </AuthGuard>
    );
}

function ManageActionsContent() {
    const dispatch = useAppDispatch();

    const { actions, loading, error } = useAppSelector(
        (state) => state.moduleAction,
    );

    const [courses, setCourses] = useState<ICourseModule[]>([]);

    const [courseFilter, setCourseFilter] = useState("");

    const [createOpen, setCreateOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);

    const [selectedAction, setSelectedAction] = useState<IModuleAction | null>(
        null,
    );

    const loadCourses = async () => {
        try {
            const res = await courseApi.getCourses();

            setCourses(res.data.filter((item) => item.status === "published"));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(fetchModuleActions({ includeArchived: true }));

        loadCourses();
    }, [dispatch]);

    const filteredActions = useMemo(() => {
        if (!courseFilter) return actions;

        return actions.filter((item) => item.module?._id === courseFilter);
    }, [actions, courseFilter]);

    const stats = useMemo(() => {
        const total = actions.length;

        const required = actions.filter((item) => item.isRequired).length;

        return {
            total,
            required,
            optional: total - required,
        };
    }, [actions]);

    return (
        <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">
                        INVICTUS ACADEMY
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
                        Module Actions
                    </h1>

                    <p className="mt-2 text-sm text-[#8A8175]">
                        Create actionable checklist items for each course module
                    </p>
                </div>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#B18A3A] px-5 py-2.5 text-sm text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                    <Plus size={16} />
                    Add Action
                </button>
            </div>

            {error && (
                <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                <StatCard
                    icon={<ListChecks />}
                    title="Total Actions"
                    value={String(stats.total)}
                />

                <StatCard
                    icon={<ShieldCheck />}
                    title="Required"
                    value={String(stats.required)}
                />

                <StatCard
                    icon={<Unlock />}
                    title="Optional"
                    value={String(stats.optional)}
                />
            </div>

            <div className="mt-8 w-full max-w-xs">
                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-[#E7DDCC] bg-white p-3 text-sm"
                >
                    <option value="">All Courses</option>

                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                            {course.title} · {course.pillar?.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6">
                {loading ? (
                    <p className="text-sm text-[#8A8175]">Loading actions...</p>
                ) : (
                    <ActionTable
                        data={filteredActions}
                        onEdit={(item) => {
                            setSelectedAction(item);

                            setEditOpen(true);
                        }}
                    />
                )}
            </div>

            {createOpen && (
                <CreateActionModal
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                />
            )}

            {editOpen && (
                <EditActionModal
                    open={editOpen}
                    action={selectedAction}
                    onClose={() => setEditOpen(false)}
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
        <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
            <div className="mb-4 text-[#B18A3A]">{icon}</div>

            <p className="text-sm text-[#8A8175]">{title}</p>

            <h3 className="mt-1 text-2xl font-bold text-[#171717]">{value}</h3>
        </div>
    );
}
