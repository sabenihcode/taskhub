"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { RequestIndicators } from "@/components/ui/RequestIndicators";
import { useDataStore } from "@/store/useDataStore";
import { computeDashboardStats } from "@/firebase/firestore";
import { useLookups } from "@/lib/useLookups";
import { isNoUpdate, isOverdue } from "@/lib/utils";

export function DashboardView() {
  const requests = useDataStore((s) => s.requests);
  const isLoading = useDataStore((s) => s.isLoading);
  const { companyName, picName, typeName } = useLookups();

  const metrics = useMemo(() => {
    const stats = computeDashboardStats(requests);
    return {
      totalActive: stats.total - stats.completed - stats.cancelled,
      newCount: stats.new,
      waitingDoc: stats.waitingDocument,
      processing: stats.processing,
      submitted: stats.submitted,
      waitingApproval: stats.waitingApproval,
      // Pakai isOverdue/isNoUpdate agar angkanya sama dengan baris di tabel
      overdue: requests.filter(isOverdue).length,
      noUpdate: requests.filter(isNoUpdate).length,
    };
  }, [requests]);

  const actionRequests = useMemo(
    () =>
      requests.filter((req) => {
        if (req.status === "Completed" || req.status === "Cancelled") return false;
        return isOverdue(req) || isNoUpdate(req) || req.status === "New";
      }),
    [requests]
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">Management Dashboard</h2>
            <p className="text-xs uppercase text-gray-500 mt-1">
              Single source of truth for all visa & permit tracking
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary">+ Create New Request</Button>
          </Link>
        </div>

        {isLoading && (
          <p className="text-xs uppercase text-gray-500 mb-3">Loading data...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Active Request" value={metrics.totalActive} />
          <MetricCard label="New" value={metrics.newCount} />
          <MetricCard label="Waiting Document" value={metrics.waitingDoc} />
          <MetricCard label="Processing" value={metrics.processing} />
          <MetricCard label="Submitted" value={metrics.submitted} />
          <MetricCard label="Waiting Approval" value={metrics.waitingApproval} />
          <MetricCard label="[ALERT] OVERDUE" value={metrics.overdue} isAlert />
          <MetricCard label="[ALERT] NO UPDATE > 3 DAYS" value={metrics.noUpdate} isAlert />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Action Required / High Priority Requests
          </h3>
          <Link href="/database">
            <Button>View Full Database</Button>
          </Link>
        </div>

        <div className="overflow-x-auto mono-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Company</th>
                <th className="p-3">Applicant</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">PIC</th>
                <th className="p-3">Indicator</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {actionRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center font-bold uppercase text-gray-500"
                  >
                    {isLoading ? "Loading..." : "No action required."}
                  </td>
                </tr>
              )}
              {actionRequests.map((req) => (
                <tr key={req.id} className="mono-border-t hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold">{req.requestId ?? req.id}</td>
                  <td className="p-3 font-semibold">{companyName(req.companyId)}</td>
                  <td className="p-3">{req.applicantName ?? "-"}</td>
                  <td className="p-3">{typeName(req.requestTypeId)}</td>
                  <td className="p-3 font-bold">{req.status}</td>
                  <td className="p-3">{picName(req.picId)}</td>
                  <td className="p-3">
                    <RequestIndicators request={req} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/database/${req.id}`}
                      className="mono-border px-2 py-1 text-[11px] uppercase font-bold hover:bg-black hover:text-white"
                    >
                      Open Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}