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

  // Safe arrays
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
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filter</h3>
        {Object.values(filters).some(
          (v) => v !== undefined && v !== "" && v !== "All"
        ) && (
          <button
            onClick={() => onChange({})}
            className="text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Cari
        </label>
        <Input
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          placeholder="ID, judul, nama..."
          className="rounded-xl"
        />
      </div>

      {/* Team */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Tim
        </label>
        <select
          value={String(filters.teamId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              teamId: e.target.value === "All" ? undefined : e.target.value,
              // Reset company & pic when team changes
              companyId: undefined,
              picId: undefined,
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
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Status
        </label>
        <select
          value={filters.status || "All"}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value === "All" ? undefined : (e.target.value as Filters["status"]),
            })
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
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Prioritas
        </label>
        <select
          value={filters.priority || "All"}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value === "All" ? undefined : (e.target.value as Filters["priority"]),
            })
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
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Perusahaan
        </label>
        <select
          value={String(filters.companyId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              companyId: e.target.value === "All" ? undefined : e.target.value,
            })
          }
          disabled={!filters.teamId}
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          PIC
        </label>
        <select
          value={String(filters.picId || "All")}
          onChange={(e) =>
            onChange({
              ...filters,
              picId: e.target.value === "All" ? undefined : e.target.value,
            })
          }
          disabled={!filters.teamId}
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="All">Semua PIC</option>
          {filteredPics.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.teamId ? ` (${teamsData.find((t) => t.id === p.teamId)?.name || ""})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Results counter */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          {Object.values(filters).filter(
            (v) => v !== undefined && v !== "" && v !== "All"
          ).length}{" "}
          filter aktif
        </p>
      </div>
    </div>
  );
}