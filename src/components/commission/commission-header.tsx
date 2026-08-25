import PageHeader from "@/components/common/PageHeader";

export default function CommissionHeader() {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="Ledger · Confidential"
      title="Commission Ledger"
      description="Every introduction, every settlement, every shilling accounted for."
      fontFamily="font-playfair"
      titleClassName="text-4xl"
    />
  );
}