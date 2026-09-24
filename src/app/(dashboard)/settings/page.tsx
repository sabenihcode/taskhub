"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MasterDataTable } from "@/components/MasterDataTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useMasterData } from "@/hooks/useMasterData";
import { useAuth } from "@/hooks/useAuth";
import type { Company, RequestType, User, Team } from "@/types";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { teams, companies, requestTypes, pics } = useMasterData();
  const [tab, setTab] = useState("teams");

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await fetch("/api/master/users", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Gagal memuat pengguna");
      const json = await res.json();

      if (Array.isArray(json)) return json;
      if (json?.data && Array.isArray(json.data)) return json.data;
      return [];
    },
  });

  // Safe extraction
  const usersData: User[] = Array.isArray(usersQuery.data)
    ? usersQuery.data
    : [];

  if (!["admin", "manager", "team_leader"].includes(user?.role || "")) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Anda tidak memiliki akses ke halaman pengaturan.
      </div>
    );
  }

  async function postAdd(path: string, body: Record<string, unknown>) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error("Gagal menambah");
  }

  async function patchToggle(path: string, id: string, active: boolean) {
    const res = await fetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error("Gagal update");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">Kelola data master</p>
      </div>

      {/* Tabs - sudah responsive dengan Context API */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="teams">Tim</TabsTrigger>
          <TabsTrigger value="companies">Perusahaan</TabsTrigger>
          <TabsTrigger value="types">Jenis Request</TabsTrigger>
          <TabsTrigger value="pics">PIC</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          )}
        </TabsList>

        {/* Teams */}
        <TabsContent value="teams">
          {teams.isLoading ? (
            <LoadingSpinner />
          ) : (
            <MasterDataTable<Team>
              title="tim"
              items={teams.data}
              columns={[
                { key: "code", header: "Kode" },
                { key: "name", header: "Nama Tim" },
              ]}
              fields={[
                { key: "code", label: "Kode", placeholder: "VDNI" },
                { key: "name", label: "Nama Tim", placeholder: "VDNI/GNI" },
              ]}
              onAdd={async (form) => {
                await postAdd("/api/master/teams", form);
                queryClient.invalidateQueries({ queryKey: ["teams"] });
              }}
              onToggle={async (item) => {
                await patchToggle("/api/master/teams", item.id, !item.active);
                queryClient.invalidateQueries({ queryKey: ["teams"] });
              }}
            />
          )}
        </TabsContent>

        {/* Companies */}
        <TabsContent value="companies">
          {companies.isLoading ? (
            <LoadingSpinner />
          ) : (
            <MasterDataTable<Company>
              title="perusahaan"
              items={companies.data}
              columns={[
                { key: "name", header: "Nama" },
                { key: "code", header: "Kode" },
                {
                  key: "team",
                  header: "Tim",
                  render: (item) => item.team?.name || "-",
                },
              ]}
              fields={[
                { key: "name", label: "Nama", placeholder: "PT VDNI" },
                { key: "code", label: "Kode", placeholder: "VDNI" },
              ]}
              onAdd={async (form) => {
                await postAdd("/api/master/companies", form);
                queryClient.invalidateQueries({ queryKey: ["companies"] });
              }}
              onToggle={async (item) => {
                await patchToggle("/api/master/companies", item.id, !item.active);
                queryClient.invalidateQueries({ queryKey: ["companies"] });
              }}
            />
          )}
        </TabsContent>

        {/* Types */}
        <TabsContent value="types">
          {requestTypes.isLoading ? (
            <LoadingSpinner />
          ) : (
            <MasterDataTable<RequestType>
              title="jenis request"
              items={requestTypes.data}
              columns={[
                { key: "name", header: "Nama" },
                { key: "category", header: "Kategori" },
              ]}
              fields={[
                { key: "name", label: "Nama", placeholder: "ITAS" },
                { key: "category", label: "Kategori", placeholder: "Visa" },
              ]}
              onAdd={async (form) => {
                await postAdd("/api/master/types", form);
                queryClient.invalidateQueries({ queryKey: ["requestTypes"] });
              }}
              onToggle={async (item) => {
                await patchToggle("/api/master/types", item.id, !item.active);
                queryClient.invalidateQueries({ queryKey: ["requestTypes"] });
              }}
            />
          )}
        </TabsContent>

        {/* PICs */}
        <TabsContent value="pics">
          {pics.isLoading ? (
            <LoadingSpinner />
          ) : (
            <MasterDataTable<User>
              title="PIC"
              items={pics.data}
              columns={[
                { key: "name", header: "Nama" },
                { key: "email", header: "Email" },
                { key: "role", header: "Role" },
                {
                  key: "team",
                  header: "Tim",
                  render: (item) => item.team?.name || "-",
                },
              ]}
              fields={[
                { key: "name", label: "Nama", placeholder: "PIC name" },
                { key: "email", label: "Email", placeholder: "email@example.com" },
              ]}
              onAdd={async () => {
                alert("Untuk menambah PIC, buat akun pengguna atau ubah role pengguna.");
              }}
              onToggle={async (item) => {
                await patchToggle("/api/master/pics", item.id, !item.active);
                queryClient.invalidateQueries({ queryKey: ["pics"] });
              }}
            />
          )}
        </TabsContent>

        {/* Users - Admin Only */}
        <TabsContent value="users">
          {usersQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="pb-3 text-left whitespace-nowrap">Nama</th>
                    <th className="pb-3 text-left whitespace-nowrap">Email</th>
                    <th className="pb-3 text-left whitespace-nowrap">Role</th>
                    <th className="pb-3 text-left whitespace-nowrap">Tim</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        Belum ada pengguna
                      </td>
                    </tr>
                  ) : (
                    usersData.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-900 whitespace-nowrap">{u.name}</td>
                        <td className="py-3 text-slate-600 whitespace-nowrap">{u.email}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 whitespace-nowrap">{u.team?.name || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}