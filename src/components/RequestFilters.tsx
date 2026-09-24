"use client";

import { Input } from "@/components/ui/input";
import { STATUSES, PRIORITIES } from "@/lib/constants";
import { useMasterData } from "@/hooks/useMasterData";
import type { RequestFilters as Filters } from "@/types";

interface RequestFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function RequestFilters({ filters, onChange }: RequestFiltersProps) {
  const { teams, companies, pics } = useMasterData();

  // Safe array access
  const teamsData = Array.isArray(teams.data) ? teams.data : [];
  const companiesData = Array.isArray(companies.data) ? companies.data : [];
  const picsData = Array.isArray(pics.data) ? pics.data : [];

  // Filter companies by selected team
  const filteredCompanies = companiesData.filter(
    (c) => !filters.teamId || filters.teamId === "All" || c.teamId === filters.teamId
  );

  // Filter PICs by selected team
  const filteredPics = picsData.filter(
    (p) => !filters.teamId || filters.teamId === "All" || p.teamId === filters.teamId
  );

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Filter</h3>

      {/* Search */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Cari
        </label>
        <Input
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="ID, judul, atau nama applicant"
          className="rounded-xl"
        />
      </div>

      {/* Team */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Tim
        </label>
        <select
          value={String(filters.teamId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              teamId: e.target.value === "All" ? "All" : e.target.value,
              companyId: "All",
              picId: "All",
            })
          }
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="All">Semua tim</option>
          {teamsData.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          value={filters.status || "All"}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as Filters["status"] })
          }
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="All">Semua status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Prioritas
        </label>
        <select
          value={filters.priority || "All"}
          onChange={(e) =>
            onChange({ ...filters, priority: e.target.value as Filters["priority"] })
          }
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="All">Semua prioritas</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Company */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Perusahaan
        </label>
        <select
          value={String(filters.companyId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              companyId: e.target.value === "All" ? "All" : e.target.value,
            })
          }
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="All">Semua perusahaan</option>
          {filteredCompanies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* PIC */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          PIC
        </label>
        <select
          value={String(filters.picId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              picId: e.target.value === "All" ? "All" : e.target.value,
            })
          }
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="All">Semua PIC</option>
          {filteredPics.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}