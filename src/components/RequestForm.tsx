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
import { createRequest, addTimelineEvent } from "@/lib/firebase/db";

interface RequestFormProps {
  onSuccess?: () => void;
}

export function RequestForm({ onSuccess }: RequestFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { teams, companies, requestTypes } = useMasterData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Generate Request ID
  function generateRequestId(teamCode: string): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${teamCode}-${year}-${random}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.title.trim()) {
      setError("Judul wajib diisi");
      return;
    }
    if (!form.teamId) {
      setError("Tim wajib dipilih");
      return;
    }

    setLoading(true);

    try {
      // Get team code for request ID
      const team = teams.data.find((t) => t.id === form.teamId);
      const teamCode = team?.code || "REQ";
      const requestId = generateRequestId(teamCode);

      // Prepare payload
      const payload = {
        requestId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        teamId: form.teamId,
        companyId: form.companyId || null,
        requestTypeId: form.requestTypeId || null,
        priority: form.priority,
        status: "New",
        dueDate: form.dueDate || null,
        requesterId: user?.id || null,
        requesterName: user?.name || "User",
        requesterEmail: user?.email || null,
        picId: form.picId,
        backupPicId: form.backupPicId,
        supervisorId: form.supervisorId,
        applicantName: form.applicantName.trim() || null,
        passportNumber: form.passportNumber.trim() || null,
        nationality: form.nationality.trim() || null,
        applicantPosition: form.applicantPosition.trim() || null,
        department: form.department.trim() || null,
        arrivalDate: form.arrivalDate || null,
        currentImmigrationStatus:
          form.currentImmigrationStatus.trim() || null,
        currentAction: form.currentAction.trim() || null,
        nextAction: form.nextAction.trim() || null,
        waitingFor: form.waitingFor || null,
        missingDocument: form.missingDocument.trim() || null,
      };

      // ✅ Create request directly to Firebase
      const newRequestId = await createRequest(payload);

      // ✅ Add timeline event
      await addTimelineEvent({
        requestId: newRequestId,
        actorId: user?.id || "system",
        actorName: user?.name || "User",
        action: "created",
        message: `Request ${requestId} dibuat`,
      });

      // ✅ Refresh queries
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-work"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      onSuccess?.();

      // Navigate to detail page
      router.push(`/requests/${newRequestId}`);
    } catch (err: any) {
      console.error("Error creating request:", err);
      setError(err.message || "Gagal membuat request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Judul Request <span className="text-red-500">*</span>
        </label>
        <Input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Contoh: ITAS Extension - Zhang Wei"
          className="rounded-xl"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Keterangan
        </label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Jelaskan request"
          rows={3}
          className="rounded-xl"
        />
      </div>

      {/* Team, Company, Type, Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tim <span className="text-red-500">*</span>
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
            disabled={teams.isLoading}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
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
            onChange={(e) =>
              setForm({ ...form, companyId: e.target.value })
            }
            disabled={!form.teamId}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
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
            onChange={(e) =>
              setForm({ ...form, requestTypeId: e.target.value })
            }
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
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
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

      {/* Due Date & Assignments */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
            className="rounded-xl"
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

      {/* Applicant Info */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-900">
          Informasi Applicant
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nama Applicant
            </label>
            <Input
              value={form.applicantName}
              onChange={(e) =>
                setForm({ ...form, applicantName: e.target.value })
              }
              placeholder="Nama lengkap"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nomor Passport
            </label>
            <Input
              value={form.passportNumber}
              onChange={(e) =>
                setForm({ ...form, passportNumber: e.target.value })
              }
              placeholder="E1234567"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Kebangsaan
            </label>
            <Input
              value={form.nationality}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
              placeholder="China"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Posisi
            </label>
            <Input
              value={form.applicantPosition}
              onChange={(e) =>
                setForm({ ...form, applicantPosition: e.target.value })
              }
              placeholder="Staff"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Departemen
            </label>
            <Input
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              placeholder="HR"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tanggal Kedatangan
            </label>
            <Input
              type="date"
              value={form.arrivalDate}
              onChange={(e) =>
                setForm({ ...form, arrivalDate: e.target.value })
              }
              className="rounded-xl"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status Imigrasi Saat Ini
            </label>
            <Input
              value={form.currentImmigrationStatus}
              onChange={(e) =>
                setForm({
                  ...form,
                  currentImmigrationStatus: e.target.value,
                })
              }
              placeholder="ITAS / Visa / ITK"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Process Info */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-900">Proses</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Current Action
            </label>
            <Input
              value={form.currentAction}
              onChange={(e) =>
                setForm({ ...form, currentAction: e.target.value })
              }
              placeholder="Sedang apa sekarang?"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Next Action
            </label>
            <Input
              value={form.nextAction}
              onChange={(e) =>
                setForm({ ...form, nextAction: e.target.value })
              }
              placeholder="Langkah selanjutnya"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Waiting For
            </label>
            <select
              value={form.waitingFor}
              onChange={(e) =>
                setForm({ ...form, waitingFor: e.target.value })
              }
              className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">-</option>
              {WAITING_FOR_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Dokumen yang Kurang
            </label>
            <Input
              value={form.missingDocument}
              onChange={(e) =>
                setForm({ ...form, missingDocument: e.target.value })
              }
              placeholder="Jika waiting document"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Membuat...
            </span>
          ) : (
            "Buat Request"
          )}
        </Button>
      </div>
    </form>
  );
}