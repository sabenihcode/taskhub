"use client";

import { useQuery } from "@tanstack/react-query";
import type { Company, RequestType, User, Team } from "@/types";

interface ApiResponse<T> {
  data?: T[];
  items?: T[];
}

async function fetchMasterData<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  
  const json: ApiResponse<T> | T[] = await res.json();
  
  // Handle different response formats
  if (Array.isArray(json)) {
    return json;
  }
  
  if (json.data && Array.isArray(json.data)) {
    return json.data;
  }
  
  if (json.items && Array.isArray(json.items)) {
    return json.items;
  }
  
  console.warn(`Unexpected response format from ${url}:`, json);
  return [];
}

export function useMasterData() {
  const teams = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: () => fetchMasterData<Team>("/api/master/teams"),
    staleTime: 5 * 60 * 1000,
  });

  const companies = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => fetchMasterData<Company>("/api/master/companies"),
    staleTime: 5 * 60 * 1000,
  });

  const requestTypes = useQuery<RequestType[]>({
    queryKey: ["requestTypes"],
    queryFn: () => fetchMasterData<RequestType>("/api/master/types"),
    staleTime: 5 * 60 * 1000,
  });

  const pics = useQuery<User[]>({
    queryKey: ["pics"],
    queryFn: () => fetchMasterData<User>("/api/master/pics"),
    staleTime: 5 * 60 * 1000,
  });

  return {
    teams: {
      data: teams.data || [],
      isLoading: teams.isLoading,
      error: teams.error,
    },
    companies: {
      data: companies.data || [],
      isLoading: companies.isLoading,
      error: companies.error,
    },
    requestTypes: {
      data: requestTypes.data || [],
      isLoading: requestTypes.isLoading,
      error: requestTypes.error,
    },
    pics: {
      data: pics.data || [],
      isLoading: pics.isLoading,
      error: pics.error,
    },
  };
}