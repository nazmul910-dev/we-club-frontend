"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Mail, Users } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { PageContainer, PageHeader } from "@/components/common";
import { PaginationControl } from "@/components/ui/PaginationControll";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getRetreatLocations } from "@/lib/features/retreat/retreatApi";
import {
    cancelRetreatBookingByAdmin,
    confirmRetreatBookingByAdmin,
    fetchAdminRetreatBookingCounts,
    fetchAdminRetreatBookings,
    inviteRetreatBookingAdmin,
    refundRetreatBookingByAdmin,
} from "@/lib/features/retreat/retreatSlice";
import type {
    RetreatBooking,
    RetreatBookingStatus,
} from "@/lib/features/retreat/retreatTypes";
import type { Retreat } from "@/types/retreat";

import RetreatBookingTable, {
    type RetreatBookingDialogMode,
} from "@/components/invictus/management/retreat-bookings/RetreatBookingTable";
// import RetreatBookingDialogs from "@/components/invictus/management/retreat-bookings/RetreatBookingDialogs";
import dynamic from "next/dynamic";

const RetreatBookingDialogs = dynamic(
    () =>
        import("@/components/invictus/management/retreat-bookings/RetreatBookingDialogs"),
    { ssr: false },
);

const STATUS_TABS: { value: "" | RetreatBookingStatus; label: string }[] = [
    { value: "", label: "All" },
    { value: "waitlisted", label: "Requests" },
    { value: "invited", label: "Invitations" },
    { value: "payment_pending", label: "Payment" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
];

export default function RetreatBookingsManagementPage() {
    return (
        <AuthGuard
            allowedRoles={["founder", "super_admin", "admin", "manager"]}
            allowedAccessTo={["invictus", "both"]}
        >
            <RetreatBookingsManagementContent />
        </AuthGuard>
    );
}

function RetreatBookingsManagementContent() {
    const dispatch = useAppDispatch();

    const {
        adminBookings,
        adminBookingsMeta,
        adminBookingCounts,
        isLoadingAdminBookings,
        adminBookingsError,
        isAdminActing,
        adminActionError,
    } = useAppSelector((state) => state.retreat);

    const [status, setStatus] = useState<"" | RetreatBookingStatus>("");
    const [locationId, setLocationId] = useState("");
    const [page, setPage] = useState(1);
    const [locations, setLocations] = useState<Retreat[]>([]);

    const [selected, setSelected] = useState<RetreatBooking | null>(null);
    const [dialogMode, setDialogMode] =
        useState<RetreatBookingDialogMode | null>(null);

    useEffect(() => {
        getRetreatLocations()
            .then(setLocations)
            .catch(() => setLocations([]));
    }, []);

    const loadBookings = () => {
        dispatch(
            fetchAdminRetreatBookings({
                page,
                limit: 20,
                ...(status ? { status } : {}),
                ...(locationId ? { locationId } : {}),
            }),
        );
        dispatch(fetchAdminRetreatBookingCounts());
    };

    useEffect(() => {
        loadBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, status, locationId, page]);

    const handleTabChange = (value: "" | RetreatBookingStatus) => {
        setStatus(value);
        setPage(1);
    };

    const handleAction = (
        booking: RetreatBooking,
        mode: RetreatBookingDialogMode,
    ) => {
        setSelected(booking);
        setDialogMode(mode);
    };

    const closeDialog = () => {
        setSelected(null);
        setDialogMode(null);
    };

    const afterAction = async (action: Promise<unknown>) => {
        try {
            await action;
            closeDialog();
            loadBookings();
        } catch {
            // Keep the dialog open so the slice error can be shown.
        }
    };

    return (
        <PageContainer variant="invictus">
            <PageHeader
                variant="invictus"
                fontFamily="font-playfair"
                eyebrow="Invictus Management"
                title="Retreat bookings"
                description="Review waitlist requests, send invitations, and approve or refund retreat seats."
            />

            {adminBookingsError && (
                <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-500">
                    {adminBookingsError}
                </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={<Users size={20} />}
                    title="Requests"
                    value={String(adminBookingCounts.waitlisted)}
                />
                <StatCard
                    icon={<Mail size={20} />}
                    title="Invitations"
                    value={String(adminBookingCounts.invited)}
                />
                <StatCard
                    icon={<Clock size={20} />}
                    title="Payment pending"
                    value={String(adminBookingCounts.payment_pending)}
                />
                <StatCard
                    icon={<CheckCircle2 size={20} />}
                    title="Confirmed"
                    value={String(adminBookingCounts.confirmed)}
                />
            </div>

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((tab) => {
                        const active = status === tab.value;
                        return (
                            <button
                                key={tab.label}
                                type="button"
                                onClick={() => handleTabChange(tab.value)}
                                className={`cursor-pointer rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
                                    active
                                        ? "bg-[#B08A3E] text-white"
                                        : "border border-[#E7DDCC] bg-white text-[#6C6357] hover:bg-[#F6F1E7]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <select
                    value={locationId}
                    onChange={(e) => {
                        setLocationId(e.target.value);
                        setPage(1);
                    }}
                    className="w-full max-w-xs cursor-pointer rounded-xl border border-[#E7DDCC] bg-white p-3 text-sm"
                >
                    <option value="">All retreats</option>
                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6">
                {isLoadingAdminBookings ? (
                    <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E7DDCC]  text-sm text-[#8A8175]">
                        Loading retreat bookings…
                    </div>
                ) : (
                    <RetreatBookingTable
                        data={adminBookings}
                        onAction={handleAction}
                    />
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <PaginationControl
                    currentPage={adminBookingsMeta.page}
                    totalPages={adminBookingsMeta.totalPages}
                    onPageChange={setPage}
                    variant="light"
                />
            </div>

            <RetreatBookingDialogs
                booking={selected}
                mode={dialogMode}
                loading={isAdminActing}
                error={adminActionError}
                onClose={closeDialog}
                onInvite={(payload) => {
                    if (!selected) return;
                    void afterAction(
                        dispatch(
                            inviteRetreatBookingAdmin({
                                bookingId: selected._id,
                                ...payload,
                            }),
                        ).unwrap(),
                    );
                }}
                onConfirm={(payload) => {
                    if (!selected) return;
                    void afterAction(
                        dispatch(
                            confirmRetreatBookingByAdmin({
                                bookingId: selected._id,
                                ...payload,
                            }),
                        ).unwrap(),
                    );
                }}
                onCancel={(reason) => {
                    if (!selected) return;
                    void afterAction(
                        dispatch(
                            cancelRetreatBookingByAdmin({
                                bookingId: selected._id,
                                reason,
                            }),
                        ).unwrap(),
                    );
                }}
                onRefund={(payload) => {
                    if (!selected) return;
                    void afterAction(
                        dispatch(
                            refundRetreatBookingByAdmin({
                                bookingId: selected._id,
                                ...payload,
                            }),
                        ).unwrap(),
                    );
                }}
            />
        </PageContainer>
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
