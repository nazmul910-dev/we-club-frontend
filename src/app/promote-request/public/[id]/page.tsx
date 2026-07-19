import PublicPromoteRequestDetails from "@/components/PublicPage/PublicPromoteRequestDetails";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <PublicPromoteRequestDetails id={id} />
  );
}