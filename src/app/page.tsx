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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-sm">
        {/* Phone Shadow with Teal Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-[3rem] blur-3xl opacity-20 transform scale-105"></div>
        
        {/* Phone Container */}
        <div 
          className={`relative bg-white rounded-[3rem] shadow-2xl border-8 border-slate-100 overflow-hidden transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ aspectRatio: '9/19.5' }}
        >
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-8 text-xs text-slate-600 z-10">
            <span className="font-medium">9:41</span>
            <div className="flex gap-1 items-center">
              <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
              <div className="w-5 h-3 border-2 border-slate-600 rounded-sm relative">
                <div className="absolute inset-0.5 bg-slate-600 rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex flex-col items-center justify-between h-full px-8 pt-16 pb-12">
            {/* Top Text */}
            <div className="text-center space-y-1 mt-8 animate-fade-in">
              <p className="text-sm font-medium text-teal-700 tracking-wider uppercase">
                Immigration Made Simple.
              </p>
              <p className="text-sm font-medium text-teal-600 tracking-wider uppercase">
                Track Every Step.
              </p>
            </div>

            {/* Logo/Icon Area */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6 animate-slide-up">
                {/* Logo Container */}
                <div className="relative w-48 h-48 mx-auto group">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  
                  {/* Icon/Logo Placeholder */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="relative animate-logo-bounce">
                      {/* Document Stack - Immigration Theme */}
                      <div className="flex gap-1.5 mb-3 justify-center">
                        <div className="w-7 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg transform -rotate-6 flex items-center justify-center">
                          <div className="space-y-1">
                            <div className="w-4 h-0.5 bg-white/70 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/70 rounded"></div>
                            <div className="w-3 h-0.5 bg-white/70 rounded"></div>
                          </div>
                        </div>
                        <div className="w-7 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg shadow-lg flex items-center justify-center">
                          <div className="space-y-1">
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-3 h-0.5 bg-white/70 rounded"></div>
                          </div>
                        </div>
                        <div className="w-7 h-14 bg-gradient-to-br from-teal-700 to-cyan-700 rounded-lg shadow-lg transform rotate-6 flex items-center justify-center">
                          <div className="space-y-1">
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/90 rounded"></div>
                            <div className="w-4 h-0.5 bg-white/70 rounded"></div>
                            <div className="w-3 h-0.5 bg-white/50 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Base Platform */}
                      <div className="w-36 h-24 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl relative shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                        {/* Checkmark Circle */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-4 h-4 bg-white/20 rounded backdrop-blur-sm"></div>
                        <div className="absolute top-3 right-3 w-3 h-3 bg-white/20 rounded-full backdrop-blur-sm"></div>
                        <div className="absolute bottom-3 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
                        <div className="absolute bottom-3 right-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* 
                      ✅ UNCOMMENT SETELAH LOGO READY:
                      <Image 
                        src="/logo.png" 
                        alt="TaskHub Logo" 
                        width={192}
                        height={192}
                        className="object-contain animate-logo-bounce"
                        priority
                      />
                    */}
                  </div>
                </div>

                {/* Brand Name */}
                <div className="space-y-2">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                    TaskHub
                  </h1>
                  <p className="text-sm text-teal-600/80 tracking-[0.2em] uppercase font-semibold">
                    Immigration System
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="w-full space-y-4 animate-slide-up animation-delay-200">
              {/* Get Started Button - Teal Brand Color */}
              <Link
                href="/register"
                className="block w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-center rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                GET STARTED
              </Link>

              {/* Login Link */}
              <Link
                href="/login"
                className="block text-center text-sm text-teal-700 font-semibold tracking-wide hover:text-teal-800 transition-colors relative group"
              >
                I ALREADY HAVE AN ACCOUNT
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Bottom Indicator */}
              <div className="flex justify-center pt-2">
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
