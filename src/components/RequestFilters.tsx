"use client";

import { Input } from "@/components/ui/input";
import { STATUSES, PRIORITIES } from "@/lib/constants";
import { useMasterData } from "@/hooks/useMasterData";
import type { RequestFilters as Filters } from "@/types";
import { Search, RotateCcw } from "lucide-react"; // Tambahkan icon agar lebih modern

interface RequestFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function RequestFilters({ filters, onChange }: RequestFiltersProps) {
  const { teams, companies, pics } = useMasterData();

  const teamsData = Array.isArray(teams.data) ? teams.data : [];
  const companiesData = Array.isArray(companies.data) ? companies.data : [];
  const picsData = Array.isArray(pics.data) ? pics.data : [];

  const filteredCompanies = companiesData.filter(
    (c) => !filters.teamId || filters.teamId === "All" || c.teamId === filters.teamId
  );

  const filteredPics = picsData.filter(
    (p) => !filters.teamId || filters.teamId === "All" || p.teamId === filters.teamId
  );

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== "" && v !== "All"
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Header Filter - Horizontal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">Filter Request</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount} Aktif
              </span>
            )}
          </div>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={() => onChange({})}
              className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filter
            </button>
          )}
        </div>

        {/* Filter Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          
          {/* Search - Dibuat lebih lebar jika memungkinkan */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Cari
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={filters.search || ""}
                onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
                placeholder="ID, judul, nama..."
                className="pl-9 rounded-xl h-9 text-sm"
              />
            </div>
          </div>

          {/* Team */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tim
            </label>
            <select
              value={String(filters.teamId || "All")}
              onChange={(e) =>
                onChange({
                  ...filters,
                  teamId: e.target.value === "All" ? undefined : e.target.value,
                  companyId: undefined,
                  picId: undefined,
                })
              }
              className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">Semua tim</option>
              {teamsData.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
              className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">Semua status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
              className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">Semua prioritas</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
              className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="All">Semua perusahaan</option>
              {filteredCompanies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* PIC */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
              className="flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}
