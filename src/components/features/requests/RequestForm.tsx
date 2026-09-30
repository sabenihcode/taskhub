"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import type { DocumentItem, Priority } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore } from "@/store/useDataStore";
import { addDaysIsoDate } from "@/lib/utils";

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  { name: "Passport Copy", status: "Received" },
  { name: "Photo 4x6", status: "Missing" },
  { name: "Guarantee Letter", status: "Missing" },
];

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

  // Data Firestore datang async, jadi nilai default diturunkan saat render
  // (bukan di useState) supaya tidak kosong saat pertama kali dimuat.
  const [companyInput, setCompanyInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [picInput, setPicInput] = useState("");

  const [applicantName, setApplicantName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [dueDate, setDueDate] = useState(() => addDaysIsoDate(14));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const companyId = companyInput || activeCompanies[0]?.id || "";
  const typeId = typeInput || activeTypes[0]?.id || "";
  const picId =
    picInput ||
    activePics.find((u) => u.id === me?.id)?.id ||
    activePics[0]?.id ||
    "";

  const selectedCompany = activeCompanies.find((c) => c.id === companyId);
  const selectedType = activeTypes.find((t) => t.id === typeId);
  const teamId = selectedCompany?.teamId ?? null;
  const teamName = teams.find((t) => t.id === teamId)?.name ?? "-";
  const teamNameOfCompany = (teamIdValue?: string | null) =>
    teams.find((t) => t.id === teamIdValue)?.name ?? "No Team";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!applicantName.trim() || !companyId) {
      setError("Applicant and company are required.");
      return;
    }
    if (!typeId) {
      setError("Request type is required. Add one in Master Data first.");
      return;
    }
    if (!picId) {
      setError("Assigned PIC is required.");
      return;
    }

    setSubmitting(true);
    try {
      await addRequest({
        title: `${selectedType?.name ?? "Request"} - ${applicantName.trim()}`,
        status: "New",
        priority,
        companyId,
        teamId,
        requestTypeId: typeId,
        picId,
        applicantName: applicantName.trim(),
        passportNumber: passportNumber.trim() || null,
        nationality: nationality.trim() || null,
        dueDate,
        currentAction: "New request registered into system",
        nextAction: "Review applicant documents",
        waitingFor: "Internal Team",
        documents: DEFAULT_DOCUMENTS,
      });
      router.push("/database");
    } catch (err) {
      console.error("[RequestForm] gagal menyimpan:", err);
      setError(err instanceof Error ? err.message : "Failed to save request.");
    } finally {
      setSubmitting(false);
    }
  };

  const noMasterData = !isLoading && (activeCompanies.length === 0 || activeTypes.length === 0);

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

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
          1. Request Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company *">
            <Select value={companyId} onChange={(e) => setCompanyInput(e.target.value)} required>
              {activeCompanies.map((c) => (
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

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
          2. Applicant Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Subject Email *">
            <Input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Pengajuan Visa"
              required
            />
          </Field>
          <Field label="Detail Email">
            <Input
              type="text"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              placeholder="Visa 12 Pax"
            />
          </Field>
          <Field label="PIC Email">
            <Input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Fatih"
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
          3. Assignment & PIC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Assigned PIC *">
            <Select value={picId} onChange={(e) => setPicInput(e.target.value)} required>
              {activePics.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Team (from company)">
            <Select value={teamId ?? ""} disabled>
              <option value={teamId ?? ""}>{teamName}</option>
            </Select>
          </Field>
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