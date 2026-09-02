"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchPillarBySlug } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import { checkPillarAccess } from "@/lib/features/invictus/academy/entitlement/entitlementSlice";
import { fetchMyAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import {
    setCourses,
    setCourseLoading,
    setCourseError,
} from "@/lib/features/invictus/academy/course/courseSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import ChallengeModuleCard from "@/components/invictus/challenge/ChallengeModuleCard";
import BuyPillarModal from "@/components/invictus/challenge/BuyPillarModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function PillarChallengePage() {
    const dispatch = useAppDispatch();
    const params = useParams<{ pillarSlug: string }>();

    const { selectedPillar } = useAppSelector((state) => state.pillar);

    const pillarLoading = useAppSelector((state) => state.pillar.loading);

    const pillarError = useAppSelector((state) => state.pillar.error);

    const {
        courses,
        loading: coursesLoading,
        error: courseError,
    } = useAppSelector((state) => state.course);

    const { myProgress } = useAppSelector((state) => state.progress);

    const pillarAccessById = useAppSelector(
        (state) => state.entitlement.pillarAccessById,
    );

    const [showBuyModal, setShowBuyModal] = useState(false);

    /*
     * Load pillar and progress whenever the slug changes.
     */
    useEffect(() => {
        dispatch(setCourses([]));

        dispatch(fetchPillarBySlug(params.pillarSlug));

        dispatch(fetchMyAllProgress());
    }, [dispatch, params.pillarSlug]);


    
    /*
     * Make sure the selected pillar belongs to the current URL.
     */
    const isCurrentPillarLoaded =
        !!selectedPillar && selectedPillar.slug === params.pillarSlug;

    /*
     * Once the pillar is loaded:
     * - Check access if it is paid
     * - Load courses/modules
     */
    useEffect(() => {
        if (!isCurrentPillarLoaded || !selectedPillar) {
            return;
        }

        if (selectedPillar.isPaid) {
            dispatch(checkPillarAccess(selectedPillar._id));
        }

        const loadCourses = async () => {
            try {
                dispatch(setCourseLoading(true));
                dispatch(setCourseError(null));

                const res = await courseApi.getCoursesByPillar(
                    selectedPillar._id,
                );

                const payload = Array.isArray(res?.data?.modules)
                    ? res.data.modules
                    : [];

                dispatch(setCourses(payload));
            } catch (err: any) {
                console.error(
                    "Failed to load modules for pillar",
                    selectedPillar._id,
                    err,
                );

                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load modules for this pillar";

                dispatch(setCourseError(message));
                dispatch(setCourses([]));
            } finally {
                dispatch(setCourseLoading(false));
            }
        };

        loadCourses();
    }, [dispatch, isCurrentPillarLoaded, selectedPillar]);

    /*
     * Loading state
     *
     * Important:
     * We only show the skeleton while the pillar is actually loading
     * or while the selected pillar does not match the current slug.
     */
    if (pillarLoading || !isCurrentPillarLoaded || !selectedPillar) {
        return (
            <div className="page-wrapper">
                <div className="rounded-3xl border border-[#E8DDCA] bg-white p-10 space-y-4">
                    <Skeleton className="h-4 w-32 rounded" />

                    <Skeleton className="h-10 w-2/3 rounded-lg" />

                    <Skeleton className="h-4 w-full max-w-xl rounded" />

                    <Skeleton className="h-4 w-3/4 max-w-md rounded" />
                </div>

                <div className="mt-12">
                    <Skeleton className="mb-6 h-8 w-40 rounded-lg" />

                    <div className="grid gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="space-y-4 rounded-3xl border border-[#E8DDCA] bg-white p-6"
                            >
                                <Skeleton className="h-12 w-12 rounded-xl" />

                                <Skeleton className="h-4 w-24 rounded" />

                                <Skeleton className="h-6 w-3/4 rounded" />

                                <Skeleton className="h-4 w-full rounded" />

                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /*
     * Error state
     */
    if (pillarError) {
        return (
            <div className="page-wrapper">
                <p className="text-red-600">{pillarError}</p>

                <Link
                    href="/invictus/invictus-challenge"
                    className="mt-4 inline-block text-sm font-semibold text-[#B18A3A]"
                >
                    ← Back to all pillars
                </Link>
            </div>
        );
    }

    /*
     * Make sure courses is always an array.
     */
    const safeCourses: ICourseModule[] = Array.isArray(courses) ? courses : [];

    /*
     * Determine whether the current user can access the pillar.
     */
    const hasAccess =
        !selectedPillar.isPaid ||
        pillarAccessById?.[selectedPillar._id]?.hasAccess === true;

    /*
     * Only show published modules.
     */
    const publishedModules = safeCourses.filter(
        (course: ICourseModule) => course.status === "published",
    );

    /*
     * Format pillar price.
     */
    const priceFormatted = selectedPillar.priceCents
        ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: selectedPillar.currency || "USD",
              minimumFractionDigits: 0,
          }).format(selectedPillar.priceCents / 100)
        : null;

    return (
        <div className="page-wrapper">
            {/* Pillar Header */}
            <div className="relative overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-10 shadow-sm">
                {/* Background glow */}
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#B18A3A]/8 blur-3xl" />

                <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[5px] text-[#B18A3A]">
                        {selectedPillar.name}
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl font-bold text-[#171717]">
                        {selectedPillar.title}
                    </h1>

                    <p className="mt-4 max-w-2xl text-[#8A8175]">
                        {selectedPillar.description}
                    </p>

                    {/* Locked / Paid Banner */}
                    {!hasAccess && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-[#B18A3A]/30 bg-gradient-to-r from-[#FAF0DC] to-[#FDF8EE]">
                            <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#B18A3A]/15">
                                        <Lock
                                            size={18}
                                            className="text-[#B18A3A]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#171717]">
                                            This pillar requires a purchase
                                        </p>

                                        <p className="mt-0.5 text-xs text-[#8A8175]">
                                            Unlock full video access, resources,
                                            quiz, and certificate
                                            {priceFormatted
                                                ? ` for ${priceFormatted}`
                                                : ""}
                                            .
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowBuyModal(true)}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#997734] hover:shadow-lg active:translate-y-0"
                                >
                                    <Lock size={14} />
                                    Unlock
                                    {priceFormatted
                                        ? ` · ${priceFormatted}`
                                        : " Pillar"}
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Already has access badge */}
                    {hasAccess && selectedPillar.isPaid && (
                        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                            <svg
                                className="h-4 w-4 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Pillar Unlocked — Full Access
                        </div>
                    )}
                </div>
            </div>

            {/* Modules */}
            <div className="mt-12">
                <h2 className="mb-6 text-2xl font-semibold text-[#171717]">
                    Modules
                </h2>

                {coursesLoading ? (
                    <div className="grid gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="space-y-4 rounded-3xl border border-[#E8DDCA] bg-white p-6"
                            >
                                <Skeleton className="h-12 w-12 rounded-xl" />

                                <Skeleton className="h-4 w-24 rounded" />

                                <Skeleton className="h-6 w-3/4 rounded" />

                                <Skeleton className="h-4 w-full rounded" />

                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : courseError ? (
                    <p className="text-sm text-red-600">{courseError}</p>
                ) : publishedModules.length === 0 ? (
                    <p className="text-sm text-[#8A8175]">
                        No modules are published for this pillar yet.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {publishedModules.map((courseModule: ICourseModule) => {
                            const progress = myProgress.find((item) => {
                                const itemModId =
                                    typeof item?.module === "string"
                                        ? item.module
                                        : item?.module?._id;

                                return itemModId === courseModule._id;
                            });

                            return (
                                <ChallengeModuleCard
                                    key={courseModule._id}
                                    courseModule={courseModule}
                                    pillarSlug={selectedPillar.slug}
                                    progressPercent={
                                        progress?.overallCompletionPercent ?? 0
                                    }
                                    isCompleted={progress?.isCompleted ?? false}
                                    isLocked={
                                        !hasAccess && selectedPillar.isPaid
                                    }
                                    onLockClick={() => setShowBuyModal(true)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Back */}
            <div className="mt-10">
                <Link
                    href="/invictus/invictus-challenge"
                    className="text-sm text-[#B18A3A]"
                >
                    ← Back to all pillars
                </Link>
            </div>

            {/* Buy Modal */}
            {selectedPillar.isPaid && !hasAccess && (
                <BuyPillarModal
                    open={showBuyModal}
                    onClose={() => setShowBuyModal(false)}
                    pillar={selectedPillar}
                />
            )}
        </div>
    );
}
