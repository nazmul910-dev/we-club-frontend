"use client";

import CommissionHeader from "@/components/commission/commission-header";

import CommissionTabs from "@/components/commission/commission-tabs";

import CommissionTable from "@/components/commission/commission-table";

export default function CommissionLedgerPage() {
  return (
    <div
      className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]"
    >
      <div className="">
        <CommissionHeader />

        <CommissionTabs />

        <CommissionTable />
      </div>
    </div>
  ); 
}
