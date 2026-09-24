"use client";

import { useMasterData } from "@/hooks/useMasterData";
import { LoadingSpinner } from "./LoadingSpinner";

interface AssignmentSelectorProps {
  value: string | "" | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  teamId?: string | null;
}

export function AssignmentSelector({
  value,
  onChange,
  disabled,
  teamId,
}: AssignmentSelectorProps) {
  const { pics } = useMasterData();

  // Filter PICs by team or show admin/manager regardless of team
  const options = pics.data.filter(
    (p) => !teamId || p.teamId === teamId || p.role === "admin" || p.role === "manager"
  );

  if (pics.isLoading) return <LoadingSpinner size="sm" />;

  return (
    <select
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val || null);
      }}
      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">Belum ditugaskan</option>
      {options.map((pic) => (
        <option key={pic.id} value={pic.id}>
          {pic.name}
          {pic.teamId && pic.team ? ` (${pic.team.name})` : ""}
        </option>
      ))}
    </select>
  );
}