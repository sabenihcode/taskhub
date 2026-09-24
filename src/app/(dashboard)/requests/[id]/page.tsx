// ✅ Required for static export with dynamic routes
// ⚠️ Removed dynamicParams (not compatible with output: "export")

export function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";

import RequestDetailClient from "./RequestDetailClient";

export default function RequestDetailPage() {
  return <RequestDetailClient />;
}
