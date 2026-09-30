"use client";

import { useMemo } from "react";
import { useDataStore } from "@/store/useDataStore";
import type { Request } from "@/types";

/** Menerjemahkan ID referensi (companyId, picId, dll.) menjadi nama untuk UI */
export function useLookups() {
  const companies = useDataStore((s) => s.companies);
  const teams = useDataStore((s) => s.teams);
  const users = useDataStore((s) => s.users);
  const requestTypes = useDataStore((s) => s.requestTypes);

  return useMemo(() => {
    const companyMap = new Map(companies.map((c) => [c.id, c]));
    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const userMap = new Map(users.map((u) => [u.id, u]));
    const typeMap = new Map(requestTypes.map((t) => [t.id, t]));

    const nameOf = <T extends { name: string }>(
      map: Map<string, T>,
      id?: string | null
    ) => (id ? map.get(id)?.name : undefined) ?? "-";

    return {
      companyMap,
      teamMap,
      userMap,
      typeMap,
      companyName: (id?: string | null) => nameOf(companyMap, id),
      teamName: (id?: string | null) => nameOf(teamMap, id),
      picName: (id?: string | null) => nameOf(userMap, id),
      typeName: (id?: string | null) => nameOf(typeMap, id),
      /** Team request; fallback ke team milik company jika request tidak punya teamId */
      teamNameOfRequest: (r: Request) => {
        const teamId = r.teamId ?? (r.companyId ? companyMap.get(r.companyId)?.teamId : null);
        return nameOf(teamMap, teamId);
      },
    };
  }, [companies, teams, users, requestTypes]);
}