"use client";

import { useMemo } from "react";
import { useDataStore } from "@/store/useDataStore";
import { isClosed, isOverdue } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

export function ReportsView() {
  const requests = useDataStore((s) => s.requests);
  const companies = useDataStore((s) => s.companies);

  const stats = useMemo(() => {
    const total = requests.length;
    const completedReqs = requests.filter((r) => r.status === "Completed");
    const completed = completedReqs.length;
    const cancelled = requests.filter((r) => r.status === "Cancelled").length;
    const overdue = requests.filter(isOverdue).length;

    const durations = completedReqs
      .map((r) => {
        const start = r.createdAt ? new Date(r.createdAt).getTime() : NaN;
        const end = new Date(r.lastUpdateAt ?? r.updatedAt ?? "").getTime();
        return (end - start) / DAY_MS;
      })
      .filter((d) => Number.isFinite(d) && d >= 0);

    const avgDays =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : null;

    return {
      total,
      completed,
      overdue,
      active: total - completed - cancelled,
      avgDays,
    };
  }, [requests]);

  const byCompany = useMemo(
    () =>
      companies.map((comp) => {
        const reqs = requests.filter((r) => r.companyId === comp.id);
        const completed = reqs.filter((r) => r.status === "Completed").length;
        const active = reqs.filter((r) => !isClosed(r)).length;
        return {
          id: comp.id,
          name: comp.name,
          total: reqs.length,
          active,
          completed,
          overdue: reqs.filter(isOverdue).length,
        };
      }),
    [companies, requests]
  );

  const pct = (n: number) =>
    `${stats.total ? Math.round((n / stats.total) * 100) : 0}%`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wide">
          Monthly Performance & Analytics
        </h2>
        <p className="text-xs uppercase text-gray-500 mt-1">
          Operational bottleneck analysis & volume report
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBlock label="Total Volume" value={stats.total} />
        <StatBlock label="Completed Rate" value={pct(stats.completed)} />
        <StatBlock label="Overdue Rate" value={pct(stats.overdue)} />
        <StatBlock
          label="Avg Processing Time"
          value={stats.avgDays === null ? "-" : `${stats.avgDays.toFixed(1)} Days`}
        />
      </div>

      <div className="mono-border p-5 bg-white space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
          Breakdown By Company
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs mono-border">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Total Requests</th>
                <th className="p-3">Active</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {byCompany.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center font-bold uppercase text-gray-500">
                    No company data.
                  </td>
                </tr>
              )}
              {byCompany.map((c) => (
                <tr key={c.id} className="mono-border-t">
                  <td className="p-3 font-bold">{c.name}</td>
                  <td className="p-3 font-mono">{c.total}</td>
                  <td className="p-3 font-mono">{c.active}</td>
                  <td className="p-3 font-mono">{c.completed}</td>
                  <td className="p-3 font-mono font-bold">{c.overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatBlockProps {
  label: string;
  value: string | number;
}

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="mono-border p-4">
      <span className="block text-[10px] font-bold uppercase text-gray-500">{label}</span>
      <span className="text-2xl font-mono font-bold">{value}</span>
    </div>
  );
}