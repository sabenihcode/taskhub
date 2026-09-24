"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMasterData } from "@/hooks/useMasterData";
import { AssignmentSelector } from "./AssignmentSelector";
import { PRIORITIES, WAITING_FOR_OPTIONS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface RequestFormProps {
  onSuccess?: () => void;
}

export function RequestForm({ onSuccess }: RequestFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { teams, companies, requestTypes } = useMasterData();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    teamId: "",
    companyId: "",
    requestTypeId: "",
    priority: "Normal",
    dueDate: "",
    picId: null as string | null,
    backupPicId: null as string | null,
    supervisorId: null as string | null,
    applicantName: "",
    passportNumber: "",
    nationality: "",
    applicantPosition: "",
    department: "",
    arrivalDate: "",
    currentImmigrationStatus: "",
    currentAction: "",
    nextAction: "",
    waitingFor: "",
    missingDocument: "",
  });

  const selectedTeamId = form.teamId || null;
  const filteredCompanies = useMemo(
    () => companies.data.filter((c) => c.teamId === selectedTeamId),
    [companies.data, selectedTeamId]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.teamId) {
      alert("Tim wajib dipilih");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        teamId: form.teamId,
        companyId: form.companyId || null,
        requestTypeId: form.requestTypeId || null,
        waitingFor: form.waitingFor || null,
        requesterId: user?.id || null,
        requesterName: user?.name || "User",
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Gagal membuat request");

      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onSuccess?.();

      if (data.id) {
        router.push(`/requests/${data.id}`);
      } else {
        router.push("/requests");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Gagal membuat request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Judul Request *
        </label>
        <Input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Contoh: ITAS Extension - Zhang Wei"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Keterangan
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Jelaskan request"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tim *
          </label>
          <select
            required
            value={form.teamId}
            onChange={(e) =>
              setForm({
                ...form,
                teamId: e.target.value,
                companyId: "",
                picId: null,
                backupPicId: null,
                supervisorId: null,
              })
            }
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Pilih tim</option>
            {teams.data.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Perusahaan
          </label>
          <select
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Pilih perusahaan</option>
            {filteredCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Jenis Request
          </label>
          <select
            value={form.requestTypeId}
            onChange={(e) => setForm({ ...form, requestTypeId: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Pilih jenis</option>
            {requestTypes.data.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Prioritas
          </label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            PIC
          </label>
          <AssignmentSelector
            teamId={selectedTeamId}
            value={form.picId}
            onChange={(id) => setForm({ ...form, picId: id })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Backup PIC
          </label>
          <AssignmentSelector
            teamId={selectedTeamId}
            value={form.backupPicId}
            onChange={(id) => setForm({ ...form, backupPicId: id })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Supervisor
          </label>
          <AssignmentSelector
            teamId={selectedTeamId}
            value={form.supervisorId}
            onChange={(id) => setForm({ ...form, supervisorId: id })}
          />
        </div>
      </div>

      {/* Rest of form fields... */}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Membuat..." : "Buat Request"}
        </Button>
      </div>
    </form>
  );
}