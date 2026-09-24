"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface MasterDataTableProps<T extends { id: string; active: boolean }> {
  // ✅ Changed: id: string (Firebase compatibility)
  title: string;
  items: T[];
  columns: Column<T>[];
  onAdd: (payload: Record<string, string>) => Promise<void>;
  onToggle: (item: T) => Promise<void>;
  fields: { key: string; label: string; placeholder?: string }[];
}

export function MasterDataTable<T extends { id: string; active: boolean }>({
  title,
  items,
  columns,
  onAdd,
  onToggle,
  fields,
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

  return (
    <div className="space-y-4">
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
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="h-10 rounded-xl"
            />
          </div>
        ))}
        <Button type="submit" disabled={adding} className="rounded-xl">
          {adding ? "Menambahkan..." : "Tambah"}
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title={`Belum ada ${title}`}
          description={`Gunakan form di atas untuk menambah ${title} baru`}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.header}</TableHead>
                ))}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(item)
                        : (item as unknown as Record<string, string>)[col.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge
                      variant={item.active ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                          item.active ? "bg-white" : "bg-slate-400"
                        }`}
                      />
                      {item.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggle(item)}
                      className="rounded-xl"
                    >
                      {item.active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}