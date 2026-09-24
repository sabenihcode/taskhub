"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useMasterData } from "@/hooks/useMasterData";
import {
  addTeam,
  updateTeam,
  addCompany,
  updateCompany,
  addRequestType,
  updateRequestType,
  getUsers,
} from "@/lib/firebase/db";
import type { User } from "@/types";
import { Plus, Users } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { teams, companies, requestTypes, pics } = useMasterData();
  const [tab, setTab] = useState("teams");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Use useEffect with proper async handling
  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    let mounted = true;
    getUsers()
      .then((data) => {
        if (mounted) setUsers(data as User[]);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setUsersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?.role]);

  if (!["admin", "manager", "team_leader"].includes(user?.role || "")) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Anda tidak memiliki akses ke halaman pengaturan.
      </div>
    );
  }

  // ============================================
  // HANDLERS - Match (form) => Promise<void> signature
  // ============================================

  const handleAddTeam = async (form: Record<string, string>) => {
    setSubmitting(true);
    try {
      await addTeam({ code: form.code, name: form.name });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTeam = async (item: any) => {
    await updateTeam(item.id, { active: !item.active });
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  const handleAddCompany = async (form: Record<string, string>) => {
    setSubmitting(true);
    try {
      await addCompany({ name: form.name, code: form.code });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCompany = async (item: any) => {
    await updateCompany(item.id, { active: !item.active });
    queryClient.invalidateQueries({ queryKey: ["companies"] });
  };

  const handleAddType = async (form: Record<string, string>) => {
    setSubmitting(true);
    try {
      await addRequestType({ name: form.name, category: form.category });
      queryClient.invalidateQueries({ queryKey: ["requestTypes"] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleType = async (item: any) => {
    await updateRequestType(item.id, { active: !item.active });
    queryClient.invalidateQueries({ queryKey: ["requestTypes"] });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola data master</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="inline-flex w-auto min-w-full sm:w-full">
            <TabsTrigger
              value="teams"
              active={tab === "teams"}
              onClick={() => setTab("teams")}
            >
              Tim
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              active={tab === "companies"}
              onClick={() => setTab("companies")}
            >
              Perusahaan
            </TabsTrigger>
            <TabsTrigger
              value="types"
              active={tab === "types"}
              onClick={() => setTab("types")}
            >
              Jenis Request
            </TabsTrigger>
            {user?.role === "admin" && (
              <TabsTrigger
                value="users"
                active={tab === "users"}
                onClick={() => setTab("users")}
              >
                Pengguna
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* TEAMS */}
        <TabsContent value="teams" activeValue={tab}>
          <MasterDataSection
            title="tim"
            isLoading={teams.isLoading}
            submitting={submitting}
            fields={[
              { key: "code", label: "Kode", placeholder: "VDNI" },
              { key: "name", label: "Nama Tim", placeholder: "VDNI/GNI" },
            ]}
            items={teams.data}
            onAdd={handleAddTeam}
            onToggle={handleToggleTeam}
          />
        </TabsContent>

        {/* COMPANIES */}
        <TabsContent value="companies" activeValue={tab}>
          <MasterDataSection
            title="perusahaan"
            isLoading={companies.isLoading}
            submitting={submitting}
            fields={[
              { key: "name", label: "Nama", placeholder: "PT VDNI" },
              { key: "code", label: "Kode", placeholder: "VDNI" },
            ]}
            items={companies.data}
            onAdd={handleAddCompany}
            onToggle={handleToggleCompany}
          />
        </TabsContent>

        {/* TYPES */}
        <TabsContent value="types" activeValue={tab}>
          <MasterDataSection
            title="jenis request"
            isLoading={requestTypes.isLoading}
            submitting={submitting}
            fields={[
              { key: "name", label: "Nama", placeholder: "ITAS" },
              { key: "category", label: "Kategori", placeholder: "Visa" },
            ]}
            items={requestTypes.data}
            onAdd={handleAddType}
            onToggle={handleToggleType}
          />
        </TabsContent>

        {/* USERS - Admin Only */}
        {user?.role === "admin" && (
          <TabsContent value="users" activeValue={tab}>
            {usersLoading ? (
              <div className="flex h-32 items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-900">
                    Daftar Pengguna
                  </h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="pb-3 text-left whitespace-nowrap">Nama</th>
                      <th className="pb-3 text-left whitespace-nowrap">Email</th>
                      <th className="pb-3 text-left whitespace-nowrap">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-sm text-slate-500">
                          Belum ada pengguna
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="py-3 font-medium text-slate-900 whitespace-nowrap">
                            {u.name}
                          </td>
                          <td className="py-3 text-slate-600 whitespace-nowrap">
                            {u.email}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 capitalize">
                              {u.role || "user"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ============================================
// MASTER DATA SECTION COMPONENT (Inline)
// ============================================
interface MasterDataSectionProps {
  title: string;
  isLoading: boolean;
  submitting: boolean;
  fields: { key: string; label: string; placeholder?: string }[];
  items: any[];
  onAdd: (form: Record<string, string>) => Promise<void>;
  onToggle: (item: any) => Promise<void>;
}

function MasterDataSection({
  title,
  isLoading,
  submitting,
  fields,
  items,
  onAdd,
  onToggle,
}: MasterDataSectionProps) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""]))
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (fields.some((f) => !form[f.key]?.trim())) {
      alert("Semua field wajib diisi");
      return;
    }
    try {
      await onAdd(form);
      setForm(Object.fromEntries(fields.map((f) => [f.key, ""])));
    } catch (error) {
      console.error("Error:", error);
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
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="h-10 rounded-xl"
            />
          </div>
        ))}
        <Button type="submit" disabled={submitting} className="rounded-xl">
          {submitting ? "Menambahkan..." : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Tambah
            </>
          )}
        </Button>
      </form>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">Belum ada {title}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {fields.map((field) => (
                  <th key={field.key} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  {fields.map((field) => (
                    <td key={field.key} className="px-4 py-3 text-slate-900">
                      {item[field.key] || (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.active
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-slate-50 text-slate-500 border border-slate-200"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        item.active ? "bg-green-500" : "bg-slate-400"
                      }`} />
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