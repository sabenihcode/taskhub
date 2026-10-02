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
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* ✅ REVISED BRANDING: INLINE (SEJAJAR) + PROFESIONAL */}
        <header className="flex flex-col items-center text-center space-y-4">
          
          {/* Logo dan Brand Name sejajar */}
          <div className="flex items-center justify-center gap-4">
            {/* Glassmorphism wrapper untuk logo */}
            <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-md border border-white/10 shadow-xl shadow-black/40">
              <Logo width={36} priority className="drop-shadow-md" />
            </div>
            
            <h1 className="text-2xl font-extrabold uppercase tracking-[0.25em] font-mono text-white drop-shadow-md">
              TaskLDB
            </h1>
          </div>

          {/* Garis pemisah elegan (Gradient Divider) */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
          
          {/* Tagline */}
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
            Permit & Immigration Tracking System
          </p>
        </header>

        {children}

        <p className="text-center text-[10px] uppercase font-bold tracking-wider text-white/30">
          © {new Date().getFullYear()} TaskLDB. All rights reserved.
        </p>
      </div>
    </main>
  );
}
