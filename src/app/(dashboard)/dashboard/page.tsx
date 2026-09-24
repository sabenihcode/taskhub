"use client";

import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { RequestTable } from "@/components/RequestTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats, getRequests } from "@/lib/firebase/db";
import type { DashboardStats, Request } from "@/types";
import {
  Inbox,
  FileText,
  Settings,
  Send,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Bell,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // ✅ Direct Firebase calls - no API routes!
        const [statsData, requestsData] = await Promise.all([
          getDashboardStats(),
          getRequests(),
        ]);

        setStats(statsData);
        setRecent(requestsData.slice(0, 5) as Request[]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeRequests = (stats?.total || 0) - (stats?.completed || 0);

  return (
    <div className="space-y-8">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-8 text-white shadow-xl shadow-teal-600/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjEzOCAwIDYgMi44NjIgNiA2djEyYzAgMy4xMzgtMi44NjIgNi02IDZoLTZjLTMuMTM4IDAtNi0yLjg2Mi02LTZ2LTEyYzAtMy4xMzggMi44NjItNiA2LTZoNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-teal-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-200 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-100" />
                </span>
                Online
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Halo, {user?.name?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-teal-50/90 text-base">
                Anda memiliki{" "}
                <strong className="font-semibold text-white">
                  {activeRequests} request aktif
                </strong>{" "}
                yang perlu ditangani
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center min-w-[120px]">
                <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-3xl font-bold mt-1">{stats?.total || 0}</p>
                <p className="text-xs text-teal-100 mt-1">Requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT */}
      {stats && stats.noUpdate3Days > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-in">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                {stats.noUpdate3Days} request tidak ada update
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                Lebih dari 3 hari tidak ada aktivitas. Segera tinjau dan
                berikan update.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STATS SECTION HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Ringkasan Status
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Status request berdasarkan tahap proses
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <SummaryCard
          title="Baru"
          subtitle="Baru masuk"
          value={stats?.new || 0}
          icon={<Inbox className="h-5 w-5" />}
          accent="bg-slate-600"
        />
        <SummaryCard
          title="Menunggu"
          subtitle="Dokumen applicant"
          value={stats?.waitingDocument || 0}
          icon={<FileText className="h-5 w-5" />}
          accent="bg-amber-500"
        />
        <SummaryCard
          title="Diproses"
          subtitle="Sedang berjalan"
          value={stats?.processing || 0}
          icon={<Settings className="h-5 w-5" />}
          accent="bg-indigo-500"
        />
        <SummaryCard
          title="Diajukan"
          subtitle="Sudah ke imigrasi"
          value={stats?.submitted || 0}
          icon={<Send className="h-5 w-5" />}
          accent="bg-cyan-500"
        />
        <SummaryCard
          title="Approval"
          subtitle="Menunggu approval"
          value={stats?.waitingApproval || 0}
          icon={<Clock className="h-5 w-5" />}
          accent="bg-orange-500"
        />
        <SummaryCard
          title="Follow Up"
          subtitle="Perlu ditindaklanjuti"
          value={stats?.followUp || 0}
          icon={<RefreshCw className="h-5 w-5" />}
          accent="bg-purple-500"
        />
        <SummaryCard
          title="Overdue"
          subtitle="Lewat deadline"
          value={stats?.overdue || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="bg-red-500"
          highlight={(stats?.overdue || 0) > 0}
        />
        <SummaryCard
          title="Selesai"
          subtitle="Bulan ini"
          value={stats?.completedThisMonth || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          accent="bg-green-500"
        />
      </div>

      {/* RECENT REQUESTS SECTION */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Request Terbaru
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              5 request terakhir yang dibuat
            </p>
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            Lihat semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="Belum ada request"
            description="Request yang dibuat akan muncul di sini"
          />
        ) : (
          <RequestTable requests={recent} />
        )}
      </div>
    </div>
  );
}