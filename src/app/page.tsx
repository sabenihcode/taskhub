'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BackgroundIllustration } from '@/components/auth/BackgroundIllustration';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <BackgroundIllustration />

      <div
        className={`relative min-h-screen flex items-center justify-center lg:justify-end px-4 py-12 lg:pr-12 xl:pr-24 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
          {/* Brand — TANPA logo, langsung judul */}
          <div>
            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight tracking-tight">
              TaskHub
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-700 font-semibold">
              Immigration Task Management
            </p>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-snug">
            Track requests and Manage documents.
          </p>

          {/* Buttons */}
          <div className="flex flex-row gap-3 pt-2 max-w-sm mx-auto">
            <Link href="/register" className="flex-1">
              <Button
                size="lg"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/30 font-semibold text-white"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-11 rounded-xl bg-white/95 backdrop-blur-sm text-teal-700 border-teal-300 hover:bg-white font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="pt-2 text-xs text-slate-700 font-medium">
            © 2026 TaskHub. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
