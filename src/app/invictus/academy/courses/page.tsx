"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
    setCourses,
    setCourseLoading,
    setCourseError,
} from "@/lib/features/invictus/academy/course/courseSlice";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import CourseHeader from "@/components/invictus/academy/courses/CourseHeader";

import CourseTable from "@/components/invictus/academy/courses/CourseTable";

// import CreateCourseDialog from "@/components/invictus/academy/courses/CreateCourseDialog";

// import EditCourseDialog from "@/components/invictus/academy/courses/EditCourseDialog";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import dynamic from "next/dynamic";

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
            dispatch(setCourseError(err.message));
        } finally {
            dispatch(setCourseLoading(false));
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleToggleStatus = async (course: ICourseModule) => {
        try {
            if (course.status === "published") {
                await courseApi.draftCourse(course._id);
            } else {
                await courseApi.publishCourse(course._id);
            }

            loadCourses();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreate = async (data: any) => {
        try {
            await courseApi.createCourse(data);

            setCreateOpen(false);

            loadCourses();
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            await courseApi.updateCourse(id, data);

            setEditOpen(false);

            loadCourses();
        } catch (err) {
            console.log(err);
        }
    };
    const handleArchiveCourse = async (course: ICourseModule) => {
        try {
            await courseApi.archiveCourse(course._id);
            loadCourses();
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div
                className="
h-[300px]
flex
items-center
justify-center
text-[#B18A3A]
"
            >
                Loading Courses...
            </div>
        );
    }

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

            <CourseTable
                courses={courses}
                onEdit={(course) => {
                    setSelectedCourse(course);

                    setEditOpen(true);
                }}
                onToggleStatus={handleToggleStatus}
                onArchive={handleArchiveCourse}
            />

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
