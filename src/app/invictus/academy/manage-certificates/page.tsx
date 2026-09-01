"use client";

import { useEffect, useMemo, useState } from "react";

import { Award, CircleCheck, ShieldAlert } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import {
    CertificateStatus,
    IQuizCertificate,
} from "@/lib/features/invictus/academy/cerfificate/certificateTypes";
import { fetchAllCertificates } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import CertificateTable from "@/components/invictus/academy/ceftificates/CertificateTable";
// import CertificateDetailModal from "@/components/invictus/academy/ceftificates/CertificateDetailModal";
import dynamic from "next/dynamic";

const CertificateDetailModal = dynamic(
    () =>
        import("@/components/invictus/academy/ceftificates/CertificateDetailModal"),
    { ssr: false },
);

export default function ManageCertificatesPage() {
    return (
        <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
            <ManageCertificatesContent />
        </AuthGuard>
    );
}

function ManageCertificatesContent() {
    const dispatch = useAppDispatch();

    const { certificates, meta, loading, error } = useAppSelector(
        (state) => state.certificate,
    );

    const [courses, setCourses] = useState<ICourseModule[]>([]);
    const [moduleFilter, setModuleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | CertificateStatus>(
        "",
    );

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] =
        useState<IQuizCertificate | null>(null);

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
            fetchAllCertificates({
                moduleId: moduleFilter || undefined,
                status: statusFilter || undefined,
                page: 1,
                limit: 50,
            }),
        );
    }, [dispatch, moduleFilter, statusFilter]);

    const stats = useMemo(() => {
        const total = meta.total || certificates.length;
        const issued = certificates.filter(
            (item) => item.status === "issued",
        ).length;
        const revoked = certificates.filter(
            (item) => item.status === "revoked",
        ).length;
        return { total, issued, revoked };
    }, [certificates, meta]);

    return (
        <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-[4px] text-[#B18A3A]">
                        INVICTUS ACADEMY
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
                        Certificates
                    </h1>
                    <p className="mt-2 text-sm text-[#8A8175]">
                        Review every certificate earned by passing a module
                        quiz, attach the generated file and revoke when needed.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                <StatCard
                    icon={<Award />}
                    title="Total Certificates"
                    value={String(stats.total)}
                />
                <StatCard
                    icon={<CircleCheck />}
                    title="Active / Issued"
                    value={String(stats.issued)}
                />
                <StatCard
                    icon={<ShieldAlert />}
                    title="Revoked"
                    value={String(stats.revoked)}
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
                        <option value="issued">Issued</option>
                        <option value="revoked">Revoked</option>
                    </select>
                </div>
            </div>

            <div className="mt-6">
                {loading ? (
                    <p className="text-sm text-[#8A8175]">
                        Loading certificates...
                    </p>
                ) : (
                    <CertificateTable
                        data={certificates}
                        onView={(certificate) => {
                            setSelectedCertificate(certificate);
                            setDetailOpen(true);
                        }}
                    />
                )}
            </div>

           {detailOpen && <CertificateDetailModal
                open={detailOpen}
                certificate={selectedCertificate}
                onClose={() => setDetailOpen(false)}
            />}
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
