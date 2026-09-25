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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div 
        className={`max-w-2xl w-full text-center space-y-8 sm:space-y-12 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl sm:blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            {/* Logo Image */}
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="TaskHub Logo" 
                width={192}
                height={192}
                className="object-contain w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Name - Responsive Typography */}
        <div className="space-y-2 sm:space-y-4 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight">
            TaskHub
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-light px-2">
            Immigration Task Management System
          </p>
        </div>

        {/* Tagline - Responsive Text */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-md lg:max-w-lg mx-auto px-4 leading-relaxed">
          Track requests, Manage documents, and Collaborate eamlessly.
        </p>

        {/* Buttons - Responsive Sizing */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-2 sm:pt-4 px-4">
          <Link
            href="/register"
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300 text-center"
          >
            Get Started
          </Link>
          
          <Link
            href="/login"
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 bg-white text-teal-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Footer Text - Responsive */}
        <p className="text-xs sm:text-sm text-slate-400 pt-4 sm:pt-8 px-4">
          © 2026 TaskHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
