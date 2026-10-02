// src/app/(auth)/layout.tsx
import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4 py-10">
      <Image
        src="/login-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay diperbesbar sedikit agar teks lebih kontras */}
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* ✅ REVISED BRANDING HEADER */}
        <header className="flex flex-col items-center text-center space-y-5">
          {/* Logo dengan lingkaran glassmorphism agar menonjol */}
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl shadow-black/50">
            <Logo width={64} priority className="drop-shadow-lg" />
          </div>

          {/* Teks Brand & Tagline */}
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold uppercase tracking-[0.3em] font-mono text-white drop-shadow-md">
              TaskLDB
            </h1>
            
            {/* Garis pemisah elegan (Gradient Divider) */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" aria-hidden="true" />
            
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
              Permit & Immigration Tracking System
            </p>
          </div>
        </header>

        {children}

        <p className="text-center text-[10px] uppercase font-bold tracking-wider text-white/30">
          © {new Date().getFullYear()} TaskLDB. All rights reserved.
        </p>
      </div>
    </main>
  );
}
