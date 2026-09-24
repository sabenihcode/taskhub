"use client";

import { useEffect, useState } from "react";
import { RequestTable } from "@/components/RequestTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import type { Request } from "@/types";

export default function MyWorkPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/my-work", { credentials: "same-origin" });
        if (res.ok) setRequests(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-sm text-slate-500">
          Requests assigned to {user?.name}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No Jobs Assigned"
          description="Saat ini tidak ada request aktif yang ditugaskan ke Anda."
        />
      ) : (
        <RequestTable requests={requests} />
      )}
    </div>
  );
}
