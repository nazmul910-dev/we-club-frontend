"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchPendingRegistrationPayments } from "@/lib/features/payment/paymentSlice";

import PendingPaymentsHeader from "@/components/Admin/PendingPayments/PendingPaymentsHeader";
import PendingPaymentsTable from "@/components/Admin/PendingPayments/PendingPaymentsTable";

export default function RegistrationPaymentsPage() {
  const dispatch = useAppDispatch();

  const pendingRegistrations = useAppSelector(
    (state) => state.payment.pendingRegistrations
  );
  const loading = useAppSelector((state) => state.payment.isPendingLoading);

  const currentUser = useAppSelector((state) => state.authUser?.user);

  useEffect(() => {
    dispatch(fetchPendingRegistrationPayments());
  }, [dispatch]);

  if (currentUser && !["founder", "manager"].includes(currentUser.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6">
        <PendingPaymentsHeader />

        <PendingPaymentsTable payments={pendingRegistrations} loading={loading} />
      </div>
    </div>
  );
}