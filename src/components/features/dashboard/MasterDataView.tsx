"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore } from "@/store/useDataStore";
import { useLookups } from "@/lib/useLookups";

function ActiveToggle({
  active,
  disabled,
  onToggle,
}: {
  active: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`mono-border px-2 py-0.5 text-[10px] font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? "bg-black text-white" : "border-dashed"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}

export function MasterDataView() {
  const me = useAuthStore((s) => s.user);
  const canManage = me?.role === "admin" || me?.role === "manager";
  const isAdmin = me?.role === "admin";

  const companies = useDataStore((s) => s.companies);
  const teams = useDataStore((s) => s.teams);
  const requestTypes = useDataStore((s) => s.requestTypes);
  const users = useDataStore((s) => s.users);
  const isLoading = useDataStore((s) => s.isLoading);

  const addCompany = useDataStore((s) => s.addCompany);
  const updateCompany = useDataStore((s) => s.updateCompany);
  const addTeam = useDataStore((s) => s.addTeam);
  const updateTeam = useDataStore((s) => s.updateTeam);
  const addRequestType = useDataStore((s) => s.addRequestType);
  const updateRequestType = useDataStore((s) => s.updateRequestType);
  const updateUser = useDataStore((s) => s.updateUser);

  const { teamName } = useLookups();

  const [compName, setCompName] = useState("");
  const [compCode, setCompCode] = useState("");
  const [compTeamId, setCompTeamId] = useState("");

  const [teamNameInput, setTeamNameInput] = useState("");
  const [teamCode, setTeamCode] = useState("");

  const [typeName, setTypeName] = useState("");
  const [typeCategory, setTypeCategory] = useState("");

  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
    } catch (err) {
      console.error("[MasterData]", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  const effectiveCompTeamId = compTeamId || teams.find((t) => t.active)?.id || "";

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    void run(async () => {
      await addCompany({
        name: compName.trim(),
        code: compCode.trim() || null,
        teamId: effectiveCompTeamId || null,
      });
      setCompName("");
      setCompCode("");
    });
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamNameInput.trim() || !teamCode.trim()) return;
    void run(async () => {
      await addTeam({ name: teamNameInput.trim(), code: teamCode.trim().toUpperCase() });
      setTeamNameInput("");
      setTeamCode("");
    });
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;
    void run(async () => {
      await addRequestType({
        name: typeName.trim(),
        category: typeCategory.trim() || null,
      });
      setTypeName("");
      setTypeCategory("");
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wide">Master Data Management</h2>
        <p className="text-xs uppercase text-gray-500 mt-1">
          Manage Companies, Teams, PICs, and Request Types
        </p>
        {!canManage && (
          <p className="text-xs font-bold uppercase text-gray-500 mono-border p-2 mt-3">
            Read-only. Only manager or admin can edit master data.
          </p>
        )}
        {isLoading && <p className="text-xs uppercase text-gray-500 mt-2">Loading...</p>}
        {error && (
          <p className="text-xs font-bold uppercase text-red-600 mono-border p-2 mt-3">
            {error}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= COMPANY ================= */}
        <div className="mono-border p-5 space-y-4 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Master Company
          </h3>
          {canManage && (
            <form onSubmit={handleAddCompany} className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <Field label="Company Name">
                  <Input
                    type="text"
                    placeholder="NEW COMPANY NAME..."
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                  />
                </Field>
              </div>
              <div className="w-24">
                <Field label="Code">
                  <Input
                    type="text"
                    placeholder="GNI"
                    value={compCode}
                    onChange={(e) => setCompCode(e.target.value.toUpperCase())}
                  />
                </Field>
              </div>
              <div className="min-w-[140px]">
                <Field label="Team">
                  <Select
                    value={effectiveCompTeamId}
                    onChange={(e) => setCompTeamId(e.target.value)}
                  >
                    {teams
                      .filter((t) => t.active)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </Select>
                </Field>
              </div>
              <div className="self-end">
                <Button type="submit" variant="primary">
                  + Add
                </Button>
              </div>
            </form>
          )}

          <table className="w-full text-left text-xs mono-border">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Company Name</th>
                <th className="p-2">Team</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="mono-border-t">
                  <td className="p-2 font-mono">{c.code ?? "-"}</td>
                  <td className="p-2 font-bold">{c.name}</td>
                  <td className="p-2">{teamName(c.teamId)}</td>
                  <td className="p-2">
                    <ActiveToggle
                      active={c.active}
                      disabled={!canManage}
                      onToggle={() => void run(() => updateCompany(c.id, { active: !c.active }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= TEAM ================= */}
        <div className="mono-border p-5 space-y-4 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Master Team
          </h3>
          {canManage && (
            <form onSubmit={handleAddTeam} className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <Field label="Team Name">
                  <Input
                    type="text"
                    placeholder="NEW TEAM NAME..."
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                  />
                </Field>
              </div>
              <div className="w-28">
                <Field label="Code">
                  <Input
                    type="text"
                    placeholder="NNI"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  />
                </Field>
              </div>
              <div className="self-end">
                <Button type="submit" variant="primary">
                  + Add
                </Button>
              </div>
            </form>
          )}

          <table className="w-full text-left text-xs mono-border">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Team Name</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="mono-border-t">
                  <td className="p-2 font-mono">{t.code}</td>
                  <td className="p-2 font-bold">{t.name}</td>
                  <td className="p-2">
                    <ActiveToggle
                      active={t.active}
                      disabled={!canManage}
                      onToggle={() => void run(() => updateTeam(t.id, { active: !t.active }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= REQUEST TYPES ================= */}
        <div className="mono-border p-5 space-y-4 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Request Types
          </h3>
          {canManage && (
            <form onSubmit={handleAddType} className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <Field label="Type Name">
                  <Input
                    type="text"
                    placeholder="E.G. KITAS"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                  />
                </Field>
              </div>
              <div className="min-w-[140px]">
                <Field label="Category (optional)">
                  <Input
                    type="text"
                    value={typeCategory}
                    onChange={(e) => setTypeCategory(e.target.value)}
                  />
                </Field>
              </div>
              <div className="self-end">
                <Button type="submit" variant="primary">
                  + Add
                </Button>
              </div>
            </form>
          )}

          <table className="w-full text-left text-xs mono-border">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {requestTypes.map((t) => (
                <tr key={t.id} className="mono-border-t">
                  <td className="p-2 font-bold">{t.name}</td>
                  <td className="p-2">{t.category ?? "-"}</td>
                  <td className="p-2">
                    <ActiveToggle
                      active={t.active}
                      disabled={!canManage}
                      onToggle={() =>
                        void run(() => updateRequestType(t.id, { active: !t.active }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= USERS / PIC ================= */}
        <div className="mono-border p-5 space-y-4 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Users / PIC
          </h3>
          <p className="text-[10px] uppercase text-gray-500">
            Accounts are created in Firebase Console. Active users can be assigned as PIC.
          </p>

          <table className="w-full text-left text-xs mono-border">
            <thead className="bg-black text-white uppercase font-bold">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id} className="mono-border-t">
                    <td className="p-2 font-bold">
                      {u.name || "-"} {isMe && <span className="text-gray-500">(you)</span>}
                    </td>
                    <td className="p-2 font-mono">{u.email}</td>
                    <td className="p-2">
                      {isAdmin && !isMe ? (
                        <Select
                          value={u.role}
                          onChange={(e) =>
                            void run(() => updateUser(u.id, { role: e.target.value as UserRole }))
                          }
                        >
                          {USER_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        ROLE_LABELS[u.role]
                      )}
                    </td>
                    <td className="p-2">
                      <ActiveToggle
                        active={u.active}
                        disabled={!isAdmin || isMe}
                        onToggle={() => void run(() => updateUser(u.id, { active: !u.active }))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}