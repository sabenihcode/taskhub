"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RequestFilters } from "@/components/RequestFilters";
import { RequestTable } from "@/components/RequestTable";
import { RequestForm } from "@/components/RequestForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { useRequests } from "@/hooks/useRequests";
import type { RequestFilters as Filters } from "@/types";
import { Plus, SlidersHorizontal, X } from "lucide-react";

export default function RequestListPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [open, setOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data, isLoading } = useRequests(filters);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== "" && v !== "All"
  ).length;

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? (
              "Memuat..."
            ) : (
              <>
                Showing <strong className="font-semibold text-slate-700">{data?.length || 0}</strong> requests
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* CONTENT GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <RequestFilters filters={filters} onChange={setFilters} />
            
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({})}
                className="w-full"
              >
                <X className="mr-2 h-3.5 w-3.5" />
                Reset {activeFiltersCount} Filter
              </Button>
            )}
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}>
            <div 
              className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filter</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <RequestFilters filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="min-w-0">
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Filter aktif:</span>
              {filters.search && (
                <FilterChip 
                  label={`"${filters.search}"`} 
                  onRemove={() => setFilters({ ...filters, search: undefined })}
                />
              )}
              {filters.status && filters.status !== "All" && (
                <FilterChip 
                  label={filters.status} 
                  onRemove={() => setFilters({ ...filters, status: "All" })}
                />
              )}
              {filters.priority && filters.priority !== "All" && (
                <FilterChip 
                  label={filters.priority} 
                  onRemove={() => setFilters({ ...filters, priority: "All" })}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="h-7 text-xs text-slate-500"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Table or Loading or Empty */}
          {isLoading ? (
            <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <LoadingSpinner size="lg" />
            </div>
          ) : (data?.length || 0) === 0 ? (
            <EmptyState
              title={activeFiltersCount > 0 ? "Tidak ada hasil" : "Belum ada request"}
              description={
                activeFiltersCount > 0
                  ? "Coba ubah atau hapus filter yang aktif"
                  : "Buat request pertama Anda untuk memulai"
              }
              action={
                activeFiltersCount > 0 ? (
                  <Button variant="outline" onClick={() => setFilters({})}>
                    Reset Filter
                  </Button>
                ) : (
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Request
                  </Button>
                )
              }
            />
          ) : (
            <RequestTable requests={data || []} />
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* CREATE REQUEST DIALOG */}
      {/* ============================================ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Create Request</DialogTitle>
        </DialogHeader>
        <RequestForm onSuccess={() => setOpen(false)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// ============================================
// FILTER CHIP COMPONENT
// ============================================
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 border border-teal-200">
      {label}
      <button
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-teal-100 transition-colors"
        aria-label={`Remove filter ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}