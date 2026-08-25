import PageHeader from "@/components/common/PageHeader";

export default function UserHeader() {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="USER MANAGEMENT"
      title="Users Directory"
      description="Manage approval, verification and account access."
      fontFamily="font-serif"
    />
  );
}
