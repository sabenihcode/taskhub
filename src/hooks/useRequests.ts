"use client";

import { useEffect, useState } from "react";
import { getRequests } from "@/lib/firebase/db";
import type { Request } from "@/types";

export function useRequests(filters: any = {}) {
  const [data, setData] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const items = await getRequests(filters);
        setData(items as Request[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error };
}