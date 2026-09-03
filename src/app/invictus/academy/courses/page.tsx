"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
    setCourses,
    setCourseLoading,
    setCourseError,
} from "@/lib/features/invictus/academy/course/courseSlice";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import CourseHeader from "@/components/invictus/academy/courses/CourseHeader";

import CourseTable from "@/components/invictus/academy/courses/CourseTable";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/skeleton/Tableskeleton";

const CreateCourseDialog = dynamic(
    () => import("@/components/invictus/academy/courses/CreateCourseDialog"),
    {
        ssr: false,
    },
);

const EditCourseDialog = dynamic(
    () => import("@/components/invictus/academy/courses/EditCourseDialog"),
    {
        ssr: false,
    },
);

export default function CoursesPage() {
    const dispatch = useAppDispatch();

    const { courses, loading, error } = useAppSelector((state) => state.course);

    const [createOpen, setCreateOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState<ICourseModule | null>(
        null,
    );

    const loadCourses = async () => {
        try {
            dispatch(setCourseLoading(true));

            const res = await courseApi.getCourses();

            dispatch(setCourses(res.data));
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Failed to load courses";
            dispatch(setCourseError(msg));
        } finally {
            dispatch(setCourseLoading(false));
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggleStatus = async (course: ICourseModule) => {
        try {
            if (course.status === "published") {
                await courseApi.draftCourse(course._id);
                toast.success("Course changed to draft");
            } else {
                await courseApi.publishCourse(course._id);
                toast.success("Course published successfully");
            }

            loadCourses();
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to update course status");
        }
    };

    const handleCreate = async (data: any) => {
        try {
            await courseApi.createCourse(data);
            toast.success("Course created successfully");
            setCreateOpen(false);

            loadCourses();
        } catch (err: any) {
            console.log(err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to create course");
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            await courseApi.updateCourse(id, data);
            toast.success("Course updated successfully");
            setEditOpen(false);

            loadCourses();
        } catch (err: any) {
            console.log(err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to update course");
        }
    };
    const handleArchiveCourse = async (course: ICourseModule) => {
        try {
            await courseApi.archiveCourse(course._id);
            toast.success("Course archived successfully");
            loadCourses();
        } catch (err: any) {
            console.log(err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to archive course");
        }
    };

    //     if (loading) {
    //         return (
    //             <div
    //                 className="
    // h-[300px]
    // flex
    // items-center
    // justify-center
    // text-[#B18A3A]
    // "
    //             >
    //                 Loading Courses...
    //             </div>
    //         );
    //     }

    return (
        <div className="page-wrapper">
            <CourseHeader onCreate={() => setCreateOpen(true)} />

            {error && (
                <div
                    className="
mb-5
text-red-500
"
                >
                    {error}
                </div>
            )}

            {loading ? (
                <TableSkeleton variant="invictus" className="border border-gold-soft" />
            ) : (
                <CourseTable
                    courses={courses}
                    onEdit={(course) => {
                        setSelectedCourse(course);

                        setEditOpen(true);
                    }}
                    onToggleStatus={handleToggleStatus}
                    onArchive={handleArchiveCourse}
                />
            )}

            {createOpen && (
                <CreateCourseDialog
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    onSubmit={handleCreate}
                />
            )}

            {editOpen && (
                <EditCourseDialog
                    open={editOpen}
                    course={selectedCourse}
                    onClose={() => setEditOpen(false)}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
}
