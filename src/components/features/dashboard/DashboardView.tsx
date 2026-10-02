// src/components/features/dashboard/DashboardView.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { RequestIndicators } from "@/components/ui/RequestIndicators";
import { useDataStore } from "@/store/useDataStore";
import { computeDashboardStats } from "@/firebase/firestore";
import { useLookups } from "@/lib/useLookups";
import { isNoUpdate, isOverdue } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import type { Request } from "@/types";

type CardFilter =
  | "all"
  | "new"
  | "waitingDoc"
  | "processing"
  | "submitted"
  | "waitingApproval"
  | "overdue"
  | "noUpdate";

const DAY_MS = 24 * 60 * 60 * 1000;

export function DashboardView() {
  const me = useAuthStore((s) => s.user);
  const requests = useDataStore((s) => s.requests);
  const companies = useDataStore((s) => s.companies);
  const isLoading = useDataStore((s) => s.isLoading);
  const { companyName, picName, typeName } = useLookups();

  const [activeFilter, setActiveFilter] = useState<CardFilter>("all");
  const [filterTime, setFilterTime] = useState(0);

  // ✅ Company filter: "all" atau specific companyId
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const isAdminOrManager = me?.role === "admin" || me?.role === "manager";
  const userCompanyId = me?.companyId ?? null;

  // ✅ Available companies untuk filter
  const availableCompanies = useMemo(() => {
    const active = companies.filter((c) => c.active);
    if (isAdminOrManager) return active;
    if (userCompanyId) return active.filter((c) => c.id === userCompanyId);
    return active;
  }, [companies, isAdminOrManager, userCompanyId]);

  // ✅ Filter requests by company FIRST
  const companyRequests = useMemo(() => {
    if (companyFilter === "all") return requests;
    return requests.filter((r) => r.companyId === companyFilter);
  }, [requests, companyFilter]);

  const handleCardClick = (filter: CardFilter) => {
    setFilterTime(Date.now());
    setActiveFilter((prev) => (prev === filter ? "all" : filter));
  };

  const metrics = useMemo(() => {
    const stats = computeDashboardStats(companyRequests);
    return {
      totalActive: stats.total - stats.completed - stats.cancelled,
      newCount: stats.new,
      waitingDoc: stats.waitingDocument,
      processing: stats.processing,
      submitted: stats.submitted,
      waitingApproval: stats.waitingApproval,
      overdue: companyRequests.filter(isOverdue).length,
      noUpdate: companyRequests.filter(isNoUpdate).length,
    };
  }, [companyRequests]);

  // ✅ Filter requests by card + company
  const filteredRequests = useMemo(() => {
    const openRequests = companyRequests.filter(
      (r) => r.status !== "Completed" && r.status !== "Cancelled"
    );

    switch (activeFilter) {
      case "new":
        return openRequests.filter((r) => {
          if (r.status !== "New") return false;
          const created = r.createdAt ? new Date(r.createdAt).getTime() : 0;
          return filterTime - created < DAY_MS;
        });
      case "waitingDoc":
        return openRequests.filter((r) => r.status === "Waiting Document");
      case "processing":
        return openRequests.filter((r) => r.status === "Processing");
      case "submitted":
        return openRequests.filter((r) => r.status === "Submitted");
      case "waitingApproval":
        return openRequests.filter((r) => r.status === "Waiting Approval");
      case "overdue":
        return openRequests.filter(isOverdue);
      case "noUpdate":
        return openRequests.filter(isNoUpdate);
      case "all":
      default:
        return openRequests.filter(
          (r) => isOverdue(r) || isNoUpdate(r) || r.status === "New"
        );
    }
  }, [companyRequests, activeFilter, filterTime]);

  const filterLabel: Record<CardFilter, string> = {
    all: "Action Required / High Priority",
    new: "New Requests (Created < 24 Hours)",
    waitingDoc: "Waiting Document",
    processing: "Processing",
    submitted: "Submitted",
    waitingApproval: "Waiting Approval",
    overdue: "⚠ OVERDUE Requests",
    noUpdate: "⚠ No Update > 3 Days",
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">Management Dashboard</h2>
            <p className="text-xs uppercase text-gray-500 mt-1">
              Click any card to filter • Select company tab to isolate data
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary">+ Create New Request</Button>
          </Link>
        </div>

        {/* ✅ COMPANY TABS */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCompanyFilter("all")}
            className={`mono-border px-3 py-2 text-xs uppercase font-bold transition-colors ${
              companyFilter === "all"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            ALL COMPANIES
          </button>
          {availableCompanies.map((c) => (
            <button
              key={c.id}
              onClick={() => setCompanyFilter(c.id)}
              className={`mono-border px-3 py-2 text-xs uppercase font-bold transition-colors ${
                companyFilter === c.id
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="text-xs uppercase text-gray-500 mb-3">Loading data...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Active Request"
            value={metrics.totalActive}
            isActive={activeFilter === "all"}
            onClick={() => handleCardClick("all")}
          />
          <MetricCard
            label="New"
            value={metrics.newCount}
            isActive={activeFilter === "new"}
            onClick={() => handleCardClick("new")}
          />
          <MetricCard
            label="Waiting Document"
            value={metrics.waitingDoc}
            isActive={activeFilter === "waitingDoc"}
            onClick={() => handleCardClick("waitingDoc")}
          />
          <MetricCard
            label="Processing"
            value={metrics.processing}
            isActive={activeFilter === "processing"}
            onClick={() => handleCardClick("processing")}
          />
          <MetricCard
            label="Submitted"
            value={metrics.submitted}
            isActive={activeFilter === "submitted"}
            onClick={() => handleCardClick("submitted")}
          />
          <MetricCard
            label="Waiting Approval"
            value={metrics.waitingApproval}
            isActive={activeFilter === "waitingApproval"}
            onClick={() => handleCardClick("waitingApproval")}
          />
          <MetricCard
            label="[ALERT] OVERDUE"
            value={metrics.overdue}
            isAlert
            isActive={activeFilter === "overdue"}
            onClick={() => handleCardClick("overdue")}
          />
          <MetricCard
            label="[ALERT] NO UPDATE > 3 DAYS"
            value={metrics.noUpdate}
            isAlert
            isActive={activeFilter === "noUpdate"}
            onClick={() => handleCardClick("noUpdate")}
          />
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {filterLabel[activeFilter]}
            </h3>
            <span className="mono-border px-2 py-0.5 text-[10px] font-bold uppercase bg-black text-white">
              {filteredRequests.length}
            </span>
            {companyFilter !== "all" && (
              <span className="mono-border px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-800 text-white">
                {availableCompanies.find((c) => c.id === companyFilter)?.name}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {activeFilter !== "all" && (
              <Button type="button" onClick={() => setActiveFilter("all")}>
                ✕ Clear Filter
              </Button>
            )}
            <Link href="/database">
              <Button>View Full Database</Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto mono-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Company</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">PIC</th>
                <th className="p-3">Indicator</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center font-bold uppercase text-gray-500">
                    {isLoading ? "Loading..." : "No requests found."}
                  </td>
                </tr>
              )}
              {filteredRequests.map((req) => (
                <tr key={req.id} className="mono-border-t hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold">{req.requestId ?? req.id}</td>
                  <td className="p-3 font-semibold">{companyName(req.companyId)}</td>
                  <td className="p-3">{req.subjectEmail ?? req.applicantName ?? "-"}</td>
                  <td className="p-3">{typeName(req.requestTypeId)}</td>
                  <td className="p-3 font-bold">{req.status}</td>
                  <td className="p-3">{picName(req.picId)}</td>
                  <td className="p-3"><RequestIndicators request={req} /></td>
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