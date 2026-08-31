import PageHeader from "@/components/common/PageHeader";

export default function NetworkHeader() {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="Members · By Invitation"
      title="Network Directory"
      description="The discreet roster of operators, brokers, and ambassadors who move with you."
      fontFamily="font-serif"
      titleClassName="text-5xl leading-none"
    />
  );
}