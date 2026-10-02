"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDataStore } from "@/store/useDataStore";

export default function DataProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const { initListeners, stopListeners, reset } = useDataStore.getState();
    initListeners();

    return () => {
      stopListeners();
      reset();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}