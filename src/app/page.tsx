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
      {/* Background full-cover sama dengan login/register */}
      <BackgroundIllustration />

      <div
        className={`relative min-h-screen flex items-center justify-center px-6 py-8 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-xl w-full text-center space-y-6">
          {/* Logo Hero */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity" />
              <Image
                src="/logo.png"
                alt="TaskHub Logo"
                width={160}
                height={160}
                className="relative object-contain w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-lg">
              TaskHub
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white font-semibold drop-shadow-md">
              Immigration Task Management System
            </p>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-white/90 max-w-sm mx-auto leading-relaxed drop-shadow">
            Track requests and Manage documents.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-white text-teal-700 hover:bg-teal-50 shadow-lg font-semibold"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-white/10 backdrop-blur-md text-white border-white/40 hover:bg-white/20 font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/90 pt-8 drop-shadow">
            © 2026 TaskHub. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
