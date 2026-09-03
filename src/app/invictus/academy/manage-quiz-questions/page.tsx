"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ListChecks, Plus, CircleCheck, CircleHelp } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { fetchQuizQuestions } from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";

import type { IQuizQuestion } from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import QuizQuestionTable from "@/components/invictus/academy/quiz-question/QuizQuestionTable";

// import CreateQuizQuestionModal from "@/components/invictus/academy/quiz-question/CreateQuizQuestionModal";

// import EditQuizQuestionModal from "@/components/invictus/academy/quiz-question/EditQuizQuestionModal";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/skeleton/Tableskeleton";

const CreateQuizQuestionModal = dynamic(
    () =>
        import("@/components/invictus/academy/quiz-question/CreateQuizQuestionModal"),
    {
        ssr: false,
    },
);
const EditQuizQuestionModal = dynamic(
    () =>
        import("@/components/invictus/academy/quiz-question/EditQuizQuestionModal"),
    {
        ssr: false,
    },
);

export default function ManageQuizQuestionsPage() {
    return (
        <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
            <ManageQuizQuestionsContent />
        </AuthGuard>
    );
}

function ManageQuizQuestionsContent() {
    const dispatch = useAppDispatch();

    const { questions, loading, error } = useAppSelector(
        (state) => state.quizQuestion,
    );

    const [courses, setCourses] = useState<ICourseModule[]>([]);

    const [courseFilter, setCourseFilter] = useState("");

    const [createOpen, setCreateOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);

    const [selectedQuestion, setSelectedQuestion] =
        useState<IQuizQuestion | null>(null);

    const loadCourses = async () => {
        try {
            const res = await courseApi.getCourses();

            setCourses(res.data.filter((item) => item.status === "published"));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(
            fetchQuizQuestions({
                includeArchived: true,
            }),
        );

        loadCourses();
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredQuestions = useMemo(() => {
        if (!courseFilter) return questions;

        return questions.filter((item) => item.module?._id === courseFilter);
    }, [questions, courseFilter]);

    const stats = useMemo(() => {
        const total = questions.length;

        const single = questions.filter(
            (item) => item.questionType === "single_choice",
        ).length;

        const trueFalse = questions.filter(
            (item) => item.questionType === "true_false",
        ).length;

        return {
            total,

            single,

            trueFalse,
        };
    }, [questions]);

    return (
        <div className="page-wrapper">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">
                        INVICTUS ACADEMY
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
                        Quiz Questions
                    </h1>

                    <p className="mt-2 text-sm text-[#8A8175]">
                        Manage module quiz questions and assessments
                    </p>
                </div>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#B08A3E] px-5 py-2.5 text-sm text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                    <Plus size={16} />
                    Add Question
                </button>
            </div>



            <div className="mt-8 grid gap-6 md:grid-cols-3">
                <StatCard
                    icon={<ListChecks />}
                    title="Total Questions"
                    value={String(stats.total)}
                />

                <StatCard
                    icon={<CircleCheck />}
                    title="Single Choice"
                    value={String(stats.single)}
                />

                <StatCard
                    icon={<CircleHelp />}
                    title="True / False"
                    value={String(stats.trueFalse)}
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
                    <TableSkeleton
                        variant="invictus"
                        className="border border-gold-soft"
                    />
                ) : (
                    <QuizQuestionTable
                        data={filteredQuestions}
                        onEdit={(item) => {
                            setSelectedQuestion(item);

                            setEditOpen(true);
                        }}
                    />
                )}
            </div>

            {createOpen && (
                <CreateQuizQuestionModal
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                />
            )}

            {editOpen && (
                <EditQuizQuestionModal
                    open={editOpen}
                    question={selectedQuestion}
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
