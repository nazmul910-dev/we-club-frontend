import PageHeader from "@/components/common/PageHeader";

export default function ProfilePageHeader() {
  return (
    <PageHeader
      className="mb-8"
      eyebrow="Account · Private"
      title="My Profile"
      description="The face you present to the network."
      fontFamily="font-playfair"
      titleClassName="text-4xl text-[#eee]"
    />
  );
}