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
  const { data, isLoading, error } = useRequests(filters);

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== "" && v !== "All"
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Request
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? (
              "Memuat..."
            ) : error ? (
              "Terjadi kesalahan saat memuat data"
            ) : (
              <>
                Menampilkan{" "}
                <strong className="font-semibold text-slate-700">
                  {data?.length || 0}
                </strong>{" "}
                request
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter toggle - Tetap dipertahankan untuk layar kecil */}
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden rounded-xl"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <Button onClick={() => setOpen(true)} className="rounded-xl bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Request Baru</span>
            <span className="sm:hidden">Baru</span>
          </Button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="space-y-4">
        {/* Desktop Filter - Sekarang Horizontal & Full Width */}
        <div className="hidden lg:block">
          <RequestFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Active Filter Chips - Diletakkan tepat di bawah toolbar filter */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-medium text-slate-500">
              Filter aktif:
            </span>
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
              className="h-7 px-2 text-xs text-slate-500 hover:text-red-500"
            >
              <X className="mr-1 h-3 w-3" />
              Bersihkan semua
            </Button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT - No more grid columns, just full width */}
      <div className="min-w-0">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState
            title="Terjadi kesalahan"
            description="Gagal memuat data. Coba refresh halaman."
          />
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
                <Button
                  variant="outline"
                  onClick={() => setFilters({})}
                  className="rounded-xl"
                >
                  Reset Filter
                </Button>
              ) : (
                <Button onClick={() => setOpen(true)} className="rounded-xl">
                  <Plus className="mr-2 h-4 w-4" /> Buat Request
                </Button>
              )
            }
          />
        ) : (
          <RequestTable requests={data || []} />
        )}
      </div>

      {/* MOBILE FILTERS DRAWER - Tetap digunakan karena horizontal filter terlalu lebar untuk HP */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Filter Request</h3>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <RequestFilters filters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {/* CREATE REQUEST DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Buat Request Baru</DialogTitle>
        </DialogHeader>
        <RequestForm onSuccess={() => setOpen(false)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
            Batal
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 border border-teal-200">
      {label}
      <button
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-teal-100 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
