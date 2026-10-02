import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

const APP_NAME = "TaskHub"; // ganti jika memang ingin "TaskHub"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4 py-10">
      {/* Background gambar; jika file belum ada, gradient di atas yang tampil */}
      <Image
        src="/login-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay supaya teks dan card tetap terbaca */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <header className="pb-2 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3">
            <Logo width="clamp(64px, 18vw, 96px)" priority className="drop-shadow-2xl" />
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-white">
              TaskLDB
            </h1>
          </div>
          <p className="text-[10px] uppercase text-white/70 mt-2 font-bold">
            Permit & Immigration Tracking System
          </p>
        </header>

        {children}

        <p className="text-center text-[10px] uppercase font-bold tracking-wider text-white/80">
          © {new Date().getFullYear()} TaskLDB. All rights reserved.
        </p>
      </div>
    </main>
  );
}