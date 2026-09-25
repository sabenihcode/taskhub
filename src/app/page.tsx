'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 animate-gradient-xy">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div 
          className={`w-full max-w-2xl backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Logo/Icon Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75"></div>
              <div className="relative bg-white rounded-full p-6 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title with Gradient */}
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-100 to-blue-100 bg-clip-text text-transparent animate-gradient-x">
              TaskHub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Task Management System
            </p>
            <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"></div>
          </div>

          {/* Description */}
          <p className="text-center text-white/80 mb-8 text-lg">
            Manage your immigration requests and tasks efficiently with our modern platform
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/login"
              className="group relative px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                Login →
              </span>
            </Link>
            
            <Link 
              href="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center text-white/70 text-sm">
            <div className="group cursor-pointer">
              <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📋</span>
              </div>
              <p>Track Requests</p>
            </div>
            <div className="group cursor-pointer">
              <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📄</span>
              </div>
              <p>Manage Docs</p>
            </div>
            <div className="group cursor-pointer">
              <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <p>Collaborate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
