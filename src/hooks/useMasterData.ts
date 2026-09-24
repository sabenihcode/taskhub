"use client";

import { useEffect, useState } from "react";
import { 
  getTeams, 
  getCompanies, 
  getRequestTypes, 
  getUsers 
} from "@/lib/firebase/db";

export function useMasterData() {
  const [teams, setTeams] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [requestTypes, setRequestTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [t, c, r, u] = await Promise.all([
          getTeams(),
          getCompanies(),
          getRequestTypes(),
          getUsers(),
        ]);
        setTeams(t);
        setCompanies(c);
        setRequestTypes(r);
        setUsers(u);
      } catch (error) {
        console.error("Failed to load master data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return {
    teams: { data: teams, isLoading },
    companies: { data: companies, isLoading },
    requestTypes: { data: requestTypes, isLoading },
    users: { data: users, isLoading },
    pics: { data: users.filter(u => 
      u.role === "pic" || u.role === "team_leader" || 
      u.role === "manager" || u.role === "admin"
    ), isLoading },
  };
}