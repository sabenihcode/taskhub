"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { RequestTable } from "@/components/RequestTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getMyWork } from "@/lib/firebase/db";
import { Briefcase, Plus } from "lucide-react";
import type { Request } from "@/types";

export default function MyWorkPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await getMyWork(user.id);
        setRequests(data as Request[]);
      } catch (err: any) {
        console.error("Failed to load my work:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-600">Gagal memuat data: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pekerjaan Saya
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {requests.length === 0
              ? "Belum ada request yang ditugaskan"
              : `${requests.length} request ditugaskan kepada Anda`}
          </p>
        </div>
        <Link href="/requests">
          <Button variant="outline" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Request Baru
          </Button>
        </Link>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={requests.length}
          color="bg-slate-100 text-slate-700"
        />
        <StatCard
          label="Aktif"
          value={
            requests.filter((r) =>
              ["New", "Processing", "Waiting Document", "Submitted"].includes(r.status)
            ).length
          }
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Selesai"
          value={requests.filter((r) => r.status === "Completed").length}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Overdue"
          value={
            requests.filter(
              (r) =>
                r.dueDate &&
                new Date(r.dueDate) < new Date() &&
                !["Completed", "Cancelled"].includes(r.status)
            ).length
          }
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* REQUEST LIST */}
      {requests.length === 0 ? (
        <EmptyState
          title="Tidak ada pekerjaan"
          description="Anda belum ditugaskan ke request apapun. Request yang ditugaskan akan muncul di sini."
          action={
            <Link href="/requests">
              <Button className="rounded-xl">
                <Briefcase className="mr-2 h-4 w-4" />
                Lihat Semua Request
              </Button>
            </Link>
          }
        />
      ) : (
        <RequestTable requests={requests} />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}