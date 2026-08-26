import PageHeader from "@/components/common/PageHeader";

export default function PendingPaymentsHeader() {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="PAYMENT MANAGEMENT"
      title="Pending Registration Payments"
      description="Review pending registrations and send payment links to users."
      fontFamily="font-serif"
    />
  );
}