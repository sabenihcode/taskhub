'use client';

import Link from 'next/link';
import Image from 'next/image';
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
        {/* space-y-3 = 12px antar elemen (rapat) */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg text-center space-y-3">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity" />
              <Image
                src="/logo.png"
                alt="TaskHub Logo"
                width={80}
                height={80}
                className="relative object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Brand — mt-0 karena parent sudah punya space-y-3 */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight tracking-tight">
              TaskHub
            </h1>
            <p className="mt-0.5 text-sm sm:text-base lg:text-lg text-slate-700 font-semibold">
              Immigration Task Management
            </p>
          </div>

          {/* Tagline — Rapat dengan brand */}
          <p className="-mt-1 text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-snug">
            Track requests and Manage documents.
          </p>

          {/* Buttons — Rapat dengan tagline */}
          <div className="-mt-1 flex flex-row gap-3 pt-1 max-w-sm mx-auto">
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

          {/* Footer — Rapat dengan tombol */}
          <p className="-mt-1 text-xs text-slate-700 font-medium">
            © 2026 TaskHub. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
