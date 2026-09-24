"use client";

import { useQuery } from "@tanstack/react-query";
import type { Request, RequestFilters } from "@/types";

interface RequestsResponse {
  items?: Request[];
  data?: Request[];
  total?: number;
}

function buildQuery(filters: RequestFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status && filters.status !== "All") params.set("status", filters.status);
  if (filters.priority && filters.priority !== "All") params.set("priority", filters.priority);
  if (filters.teamId && filters.teamId !== "All") params.set("teamId", String(filters.teamId));
  if (filters.companyId && filters.companyId !== "All")
    params.set("companyId", String(filters.companyId));
  if (filters.picId && filters.picId !== "All") params.set("picId", String(filters.picId));
  return params.toString();
}

export function useRequests(filters: RequestFilters = {}) {
  return useQuery<Request[]>({
    queryKey: ["requests", filters],
    queryFn: async () => {
      const query = buildQuery(filters);
      const res = await fetch(`/api/requests?${query}`, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Gagal memuat request");
      
      const json: RequestsResponse | Request[] = await res.json();
      
      // Handle different response formats
      if (Array.isArray(json)) {
        return json;
      }
      
      if (json.items && Array.isArray(json.items)) {
        return json.items;
      }
      
      if (json.data && Array.isArray(json.data)) {
        return json.data;
      }
      
      console.warn("Unexpected requests response format:", json);
      return [];
    },
  });
}