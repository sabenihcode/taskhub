'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div 
        className={`max-w-2xl w-full text-center space-y-12 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            {/* Icon Container */}
            <div className="relative w-48 h-48 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              {/* Documents Stack */}
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-28 bg-white/90 rounded-2xl shadow-xl transform -rotate-12 flex flex-col items-center justify-center p-3 space-y-1.5">
                  <div className="w-full h-1.5 bg-teal-200 rounded"></div>
                  <div className="w-full h-1.5 bg-teal-200 rounded"></div>
                  <div className="w-3/4 h-1.5 bg-teal-100 rounded"></div>
                </div>
                
                <div className="w-24 h-32 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-3 space-y-1.5">
                  <CheckCircle2 className="w-10 h-10 text-teal-600" strokeWidth={3} />
                  <div className="w-full h-1.5 bg-teal-300 rounded"></div>
                  <div className="w-full h-1.5 bg-teal-300 rounded"></div>
                  <div className="w-2/3 h-1.5 bg-teal-200 rounded"></div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-20 h-28 bg-white/90 rounded-2xl shadow-xl transform rotate-12 flex flex-col items-center justify-center p-3 space-y-1.5">
                  <div className="w-full h-1.5 bg-cyan-200 rounded"></div>
                  <div className="w-full h-1.5 bg-cyan-200 rounded"></div>
                  <div className="w-3/4 h-1.5 bg-cyan-100 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* 
              ✅ UNCOMMENT SETELAH LOGO READY:
              <Image 
                src="/logo.png" 
                alt="TaskHub Logo" 
                width={192}
                height={192}
                className="object-contain"
                priority
              />
            */}
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
            TaskHub
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light">
            Immigration Task Management System
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
          Streamline your immigration processes. Track requests, manage documents, and collaborate seamlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/register"
            className="px-10 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            Get Started
          </Link>
          
          <Link
            href="/login"
            className="px-10 py-4 bg-white text-teal-700 rounded-2xl font-bold text-lg border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 w-full sm:w-auto"
          >
            Sign In
          </Link>
        </div>

        {/* Footer Text (Optional) */}
        <p className="text-sm text-slate-400 pt-8">
          © 2026 TaskHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
