"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { Plus } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface MasterDataTableProps<T extends { id: string; active: boolean }> {
  title: string;
  items: T[];
  columns: Column<T>[];
  fields: { key: string; label: string; placeholder?: string }[];
  onAdd: (payload: Record<string, string>) => Promise<void>;
  onToggle: (item: T) => Promise<void>;
  isLoading?: boolean;
}

export function MasterDataTable<T extends { id: string; active: boolean }>({
  title,
  items,
  columns,
  fields,
  onAdd,
  onToggle,
  isLoading = false,
}: MasterDataTableProps<T>) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""]))
  );
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      await onAdd(form);
      setForm(Object.fromEntries(fields.map((f) => [f.key, ""])));
    } catch (error) {
      console.error("Error adding:", error);
      alert("Gagal menambah data");
    } finally {
      setAdding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
      >
        {fields.map((field) => (
          <div key={field.key} className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              {field.label}
            </label>
            <Input
              value={form[field.key]}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
              placeholder={field.placeholder}
              className="h-10 rounded-xl"
              required
            />
          </div>
        ))}
        <Button
          type="submit"
          disabled={adding}
          className="rounded-xl"
        >
          {adding ? (
            "Menambahkan..."
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Tambah
            </>
          )}
        </Button>
      </form>

      {/* Table or Empty */}
      {items.length === 0 ? (
        <EmptyState
          title={`Belum ada ${title}`}
          description={`Gunakan form di atas untuk menambah ${title} baru`}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-semibold text-slate-700"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-900"
                    >
                      {col.render
                        ? col.render(item)
                        : (item as any)[col.key] || (
                            <span className="text-slate-400 italic">—</span>
                          )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.active
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.active ? "bg-green-500" : "bg-slate-400"
                        }`}
                      />
                      {item.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggle(item)}
                      className="rounded-xl"
                    >
                      {item.active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}