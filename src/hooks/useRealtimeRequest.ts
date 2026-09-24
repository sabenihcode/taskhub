"use client";

import { useQuery } from "@tanstack/react-query";
import type { Request } from "@/types";

export function useRealtimeRequest(id: number | string | undefined) {
  return useQuery<Request>({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${id}`, {
        credentials: "same-origin",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Request tidak ditemukan");
        throw new Error("Gagal memuat request");
      }
      
      const json = await res.json();
      
      // Handle if response is wrapped
      if (json.data && typeof json.data === 'object') {
        return json.data;
      }
      
      return json;
    },
    enabled: !!id,
    refetchInterval: 10_000, // Auto-refresh every 10 seconds
  });
}