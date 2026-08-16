"use client";

import UpgradePlanContent from "@/components/UpgradePlan/UpgradePlanContent";
import UpgradePlanHeader from "@/components/UpgradePlan/UpgradePlanHeader";



export default function UpgradePlanPage() {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6">
        <UpgradePlanHeader />
        <UpgradePlanContent />
      </div>
    </div>
  );
}