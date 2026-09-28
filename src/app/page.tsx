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
    <div
      className={`relative min-h-screen flex items-center justify-center lg:justify-end px-6 py-12 lg:pr-8 xl:pr-16 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="w-full max-w-md text-center space-y-5">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity" />
            <Image
              src="/logo.png"
              alt="TaskHub Logo"
              width={96}
              height={96}
              className="relative object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1.5">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight tracking-tight">
            TaskHub
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Immigration Task Management
          </p>
        </div>

        {/* Tagline */}
        <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
          Track requests, manage documents, dan kolaborasi tim.
        </p>

        {/* Buttons (tanpa card wrapper, langsung di container) */}
        <div className="flex flex-col gap-3 pt-3 max-w-xs mx-auto">
          <Link href="/register" className="w-full">
            <Button
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/30 font-semibold"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 rounded-xl bg-white/95 backdrop-blur-sm text-teal-700 border-teal-200 hover:bg-teal-50 hover:border-teal-300 font-semibold"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 pt-6">
          © 2026 TaskHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
