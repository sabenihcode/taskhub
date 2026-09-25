'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Users, BarChart3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-teal-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                TaskHub
              </h1>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">
                About
              </a>
              <Link 
                href="/login"
                className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div 
              className={`space-y-8 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-semibold">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Immigration Management System
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Simplify Your{' '}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Immigration
                </span>{' '}
                Tasks
              </h1>

              {/* Description */}
              <p className="text-xl text-slate-600 leading-relaxed">
                Streamline your immigration processes with our intelligent task management platform. 
                Track requests, manage documents, and collaborate seamlessly—all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-teal-700 rounded-xl font-bold text-lg border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-teal-600">500+</div>
                  <div className="text-sm text-slate-600">Active Requests</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">50+</div>
                  <div className="text-sm text-slate-600">Teams</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">99%</div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Content - Illustration/Image */}
            <div 
              className={`relative transition-all duration-1000 delay-200 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-3xl blur-3xl"></div>
              
              {/* Main Illustration Container */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100">
                {/* Logo/Icon Placeholder */}
                <div className="flex flex-col items-center justify-center space-y-8">
                  {/* Animated Icon */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-64 h-64 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                      {/* Documents Stack */}
                      <div className="relative">
                        <div className="absolute -top-8 -left-8 w-24 h-32 bg-white/90 rounded-2xl shadow-xl transform -rotate-12 flex flex-col items-center justify-center p-4 space-y-2">
                          <div className="w-full h-2 bg-teal-200 rounded"></div>
                          <div className="w-full h-2 bg-teal-200 rounded"></div>
                          <div className="w-3/4 h-2 bg-teal-100 rounded"></div>
                        </div>
                        
                        <div className="w-28 h-36 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4 space-y-2">
                          <CheckCircle2 className="w-12 h-12 text-teal-600" strokeWidth={3} />
                          <div className="w-full h-2 bg-teal-300 rounded"></div>
                          <div className="w-full h-2 bg-teal-300 rounded"></div>
                          <div className="w-2/3 h-2 bg-teal-200 rounded"></div>
                        </div>
                        
                        <div className="absolute -bottom-8 -right-8 w-24 h-32 bg-white/90 rounded-2xl shadow-xl transform rotate-12 flex flex-col items-center justify-center p-4 space-y-2">
                          <div className="w-full h-2 bg-cyan-200 rounded"></div>
                          <div className="w-full h-2 bg-cyan-200 rounded"></div>
                          <div className="w-3/4 h-2 bg-cyan-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { icon: FileText, label: 'Track Documents' },
                      { icon: Users, label: 'Team Collaboration' },
                      { icon: BarChart3, label: 'Analytics' },
                      { icon: CheckCircle2, label: 'Verified Process' },
                    ].map((feature, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Manage Immigration Tasks
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features to streamline your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Document Management',
                desc: 'Upload, organize, and track all immigration documents in one secure place.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                desc: 'Work together seamlessly with your team and clients in real-time.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                desc: 'Get insights into your processes with comprehensive reporting.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-700">TaskHub</span>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 TaskHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
