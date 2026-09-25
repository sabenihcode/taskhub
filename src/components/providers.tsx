"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  // Menggunakan lazy initialization untuk QueryClient agar tidak terbuat ulang saat re-render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Mencegah request berulang jika error saat loading awal
        staleTime: 5 * 60 * 1000, // 5 menit
      },
    },
  }));
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard untuk mencegah hydration mismatch antara server dan client
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
