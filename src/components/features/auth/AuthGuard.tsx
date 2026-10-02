"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuthStore();

  useEffect(() => {
    // Jika proses inisialisasi selesai dan user tidak terautentikasi, lempar ke login
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isAuthenticated, isInitializing]);

  // Tampilkan loading state selama Firebase mengecek session
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="mono-border p-6 text-center text-xs uppercase font-bold text-gray-500">
          Checking session...
        </div>
      </div>
    );
  }

  // Jika belum auth, render null (biarkan useEffect yang redirect)
  if (!isAuthenticated) return null;

  return <>{children}</>;
}