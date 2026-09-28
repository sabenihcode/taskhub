'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      className={`relative min-h-screen flex items-center justify-center px-6 py-12 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt="TaskHub Logo"
            width={72}
            height={72}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-white/40 p-8 shadow-2xl shadow-slate-900/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight tracking-tight">
              TaskHub
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 font-medium">
              Immigration Task Management
            </p>
          </div>

          <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">
            Track requests, manage documents, dan kolaborasi dengan tim Anda dalam satu platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/register" className="w-full">
              <Button
                size="lg"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/30 font-semibold text-base"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 rounded-xl bg-white text-teal-700 border-teal-200 hover:bg-teal-50 hover:border-teal-300 font-semibold text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-500">atau</span>
            </div>
          </div>

          {/* Secondary info */}
          <div className="space-y-3 text-center">
            <p className="text-xs text-slate-500">
              Gratis untuk 14 hari pertama
            </p>
            <p className="text-xs text-slate-500">
              Data aman dengan Firebase
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-900/80 drop-shadow-md font-medium">
          © 2026 TaskHub. All rights reserved.
        </p>
      </div>
    </main>
  );
}
