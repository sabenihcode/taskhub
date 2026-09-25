'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div 
        className={`max-w-xl w-full text-center space-y-6 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            {/* Logo Image - Ukuran dikurangi agar lebih proporsional */}
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="TaskHub Logo" 
                width={160}
                height={160}
                className="object-contain w-24 h-24 sm:w-32 sm:h-32 drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Name - Ukuran font disesuaikan agar tidak "teriak" */}
        <div className="space-y-2 px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight tracking-tight">
            TaskHub
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium">
            Immigration Task Management System
          </p>
        </div>

        {/* Tagline - Lebar max-w dikurangi agar teks tidak terlalu melebar */}
        <p className="text-sm sm:text-base text-slate-500 max-w-sm mx-auto px-4 leading-relaxed">
          Track requests, manage documents, and collaborate seamlessly in one centralized platform.
        </p>

        {/* Buttons - Padding dan ukuran font diperhalus */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 px-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Get Started
          </Link>
          
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-white text-teal-700 rounded-xl font-semibold text-base border border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-slate-400 pt-8">
          © 2026 TaskHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
