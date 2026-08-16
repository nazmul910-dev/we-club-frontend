"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getAllDiscountCodes } from "@/lib/features/discountFounder/discountSlice";

import DiscountHeader from "@/components/Admin/DiscountManagement/DiscountHeader";
import DiscountTable from "@/components/Admin/DiscountManagement/DiscountTable";
import CreateDiscountModal from "@/components/Admin/DiscountManagement/CreateDiscountModal";

export default function DiscountManagementPage() {
  const dispatch = useAppDispatch();

  const discounts = useAppSelector((state) => state.discount.discounts);
  const loading = useAppSelector((state) => state.discount.loading);

  const currentUser = useAppSelector((state) => state.authUser?.user);

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(getAllDiscountCodes());
  }, [dispatch]);

  if (currentUser && !["founder", "manager"].includes(currentUser.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6">
        <DiscountHeader onCreateClick={() => setShowCreateModal(true)} />

        <DiscountTable discounts={discounts} loading={loading} />
      </div>

      <CreateDiscountModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}