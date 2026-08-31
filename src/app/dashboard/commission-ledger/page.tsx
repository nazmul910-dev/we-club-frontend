"use client";

import CommissionHeader from "@/components/commission/commission-header";
import CommissionTabs from "@/components/commission/commission-tabs";
import CommissionTable from "@/components/commission/commission-table";
import PageContainer from "@/components/common/PageContainer";

export default function CommissionLedgerPage() {
  return (
    <PageContainer variant="dashboard">
      <div>
        <CommissionHeader />
        <CommissionTabs />
        <CommissionTable />
      </div>
    </PageContainer>
  );
}
