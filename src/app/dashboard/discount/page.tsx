import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

export default function DiscountPage() {
  return (
    <PageContainer variant="dashboard">
      <PageHeader
        eyebrow="Discounts"
        title="Discounts"
        description="View and manage available discount options."
      />
    </PageContainer>
  );
}
