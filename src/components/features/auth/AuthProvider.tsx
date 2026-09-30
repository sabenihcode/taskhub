"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().initAuthListener();
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}