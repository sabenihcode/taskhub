// src/components/features/requests/RequestForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import type { Priority } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore } from "@/store/useDataStore";
import { addDaysIsoDate } from "@/lib/utils";

export function RequestForm() {
  const router = useRouter();
  const me = useAuthStore((s) => s.user);
  const companies = useDataStore((s) => s.companies);
  const teams = useDataStore((s) => s.teams);
  const users = useDataStore((s) => s.users);
  const requestTypes = useDataStore((s) => s.requestTypes);
  const isLoading = useDataStore((s) => s.isLoading);
  const addRequest = useDataStore((s) => s.addRequest);

  const activeCompanies = useMemo(() => companies.filter((c) => c.active), [companies]);
  const activeTypes = useMemo(() => requestTypes.filter((t) => t.active), [requestTypes]);
  const activePics = useMemo(() => users.filter((u) => u.active), [users]);
  const activeTeams = useMemo(() => teams.filter((t) => t.active), [teams]);

  // ============================================================
  // SECTION 1
  // ============================================================
  const [companyInput, setCompanyInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [dueDate, setDueDate] = useState(() => addDaysIsoDate(14));

  // ============================================================
  // SECTION 2
  // ============================================================
  const [subjectEmail, setSubjectEmail] = useState("");
  const [detailEmail, setDetailEmail] = useState("");
  const [picEmailUserId, setPicEmailUserId] = useState("");
  const [teamInput, setTeamInput] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // DERIVED VALUES
  // ============================================================
  // ✅ Admin/Manager bisa pilih semua company, Staff hanya company-nya sendiri
  const isAdminOrManager = me?.role === "admin" || me?.role === "manager";
  const userCompanyId = me?.companyId ?? null;

  const availableCompanies = useMemo(() => {
    if (isAdminOrManager) return activeCompanies;
    // ✅ Staff: hanya company miliknya
    if (userCompanyId) {
      return activeCompanies.filter((c) => c.id === userCompanyId);
    }
    return activeCompanies;
  }, [activeCompanies, isAdminOrManager, userCompanyId]);

  const companyId = companyInput || availableCompanies[0]?.id || "";
  const typeId = typeInput || activeTypes[0]?.id || "";

  const selectedCompany = activeCompanies.find((c) => c.id === companyId);
  const selectedType = activeTypes.find((t) => t.id === typeId);

  // ✅ Team: HANYA dari company yang dipilih
  const companyTeam = selectedCompany?.teamId
    ? teams.find((t) => t.id === selectedCompany.teamId)
    : null;

  const teamId = teamInput || selectedCompany?.teamId || null;
  const teamName = companyTeam?.name ?? "-";

  // ✅ PIC: HANYA dari company yang dipilih (berdasarkan team)
  const availablePics = useMemo(() => {
    if (!companyId) return activePics;
    // ✅ Filter PIC yang belong ke company ini
    const companyUsers = activePics.filter((u) => u.companyId === companyId);
    // ✅ Jika tidak ada user yang di-assign ke company, tampilkan semua
    return companyUsers.length > 0 ? companyUsers : activePics;
  }, [activePics, companyId]);

  const defaultPicEmail = picEmailUserId || availablePics[0]?.id || "";

  // Helper
  const teamNameOfCompany = (teamIdValue?: string | null) =>
    teams.find((t) => t.id === teamIdValue)?.name ?? "No Team";

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyId) {
      setError("Company is required.");
      return;
    }
    if (!subjectEmail.trim()) {
      setError("Subject Email is required.");
      return;
    }
    if (!typeId) {
      setError("Request type is required. Add one in Master Data first.");
      return;
    }
    if (!defaultPicEmail) {
      setError("PIC Email is required.");
      return;
    }
    if (!teamId) {
      setError("Team is required.");
      return;
    }

    setSubmitting(true);
    try {
      await addRequest({
        title: `${selectedType?.name ?? "Request"} - ${subjectEmail.trim()}`,
        status: "New",
        priority,
        companyId,
        teamId,
        requestTypeId: typeId,
        picId: defaultPicEmail,
        subjectEmail: subjectEmail.trim(),
        detailEmail: detailEmail.trim() || null,
        picEmailUserId: defaultPicEmail,
        dueDate,
        currentAction: "New request registered into system",
        nextAction: "Review applicant documents",
        waitingFor: "Internal Team",
        documents: [],
      });
      router.push("/database");
    } catch (err) {
      console.error("[RequestForm] gagal menyimpan:", err);
      setError(err instanceof Error ? err.message : "Failed to save request.");
    } finally {
      setSubmitting(false);
    }
  };

  const noMasterData = !isLoading && (availableCompanies.length === 0 || activeTypes.length === 0);

  return (
    <form onSubmit={handleSubmit} className="mono-border p-6 space-y-6 bg-white">
      {isLoading && (
        <p className="text-xs font-bold uppercase text-gray-500 mono-border p-2">
          Loading master data...
        </p>
      )}
      {noMasterData && (
        <p className="text-xs font-bold uppercase text-red-600 mono-border p-2">
          Company or request type data is empty. Add it in Master Data first.
        </p>
      )}

      {/* ============================================
          SECTION 1: Request Information
          ============================================ */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
          1. Request Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company *">
            <Select
              value={companyId}
              onChange={(e) => {
                setCompanyInput(e.target.value);
                setTeamInput("");
                setPicEmailUserId(""); // ✅ Reset PIC saat company berubah
              }}
              required
              disabled={!isAdminOrManager && availableCompanies.length === 1}
            >
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({teamNameOfCompany(c.teamId)})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Request Type *">
            <Select value={typeId} onChange={(e) => setTypeInput(e.target.value)} required>
              {activeTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </Select>
          </Field>

          <Field label="Due Date Target *">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Field>
        </div>
      </div>

      {/* ============================================
          SECTION 2: Applicant Information
          ============================================ */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
          2. Applicant Information
        </h3>

        <div className="space-y-3 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Subject Email *">
              <Input
                type="text"
                value={subjectEmail}
                onChange={(e) => setSubjectEmail(e.target.value)}
                placeholder="e.g. Pengajuan Visa"
                required
              />
            </Field>
            <Field label="Detail Email">
              <Input
                type="text"
                value={detailEmail}
                onChange={(e) => setDetailEmail(e.target.value)}
                placeholder="e.g. Visa 12 Pax"
              />
            </Field>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ PIC: Hanya dari company yang dipilih */}
            <Field label="PIC Email *">
              <Select
                value={defaultPicEmail}
                onChange={(e) => setPicEmailUserId(e.target.value)}
                required
              >
                <option value="">-- Select User --</option>
                {availablePics.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </Field>

            {/* ✅ Team: Auto dari company, readonly */}
            <Field label="Team (from company) *">
              <Select
                value={teamId ?? ""}
                onChange={(e) => setTeamInput(e.target.value)}
                required
                disabled={!!companyTeam}
              >
                {companyTeam ? (
                  <option value={teamId ?? ""}>{teamName}</option>
                ) : (
                  <>
                    <option value="">-- Select Team --</option>
                    {activeTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </>
                )}
              </Select>
            </Field>
          </div>

          {companyTeam && (
            <p className="text-xs text-gray-500 italic pt-1">
              ⓘ Team automatically assigned from {selectedCompany?.name}.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs font-bold uppercase text-red-600 mono-border p-2">{error}</p>
      )}

      <div className="pt-4 mono-border-t flex justify-end gap-3">
        <Button type="button" onClick={() => router.push("/database")} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting || isLoading}>
          {submitting ? "Saving..." : "Save & Generate Request ID"}
        </Button>
      </div>
    </form>
  );
}