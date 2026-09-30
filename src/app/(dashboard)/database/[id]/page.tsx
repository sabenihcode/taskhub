import { RequestDetailView } from "@/components/features/dashboard/RequestDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <RequestDetailView requestId={decodeURIComponent(id)} />;
}
