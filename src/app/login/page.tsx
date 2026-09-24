"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    const result = await login(email, password);
    setSubmitting(false);
    
    if (result.error) {
      setError(result.error);
    }
    // No need to redirect here, useEffect will handle it
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/50 p-10 shadow-2xl shadow-slate-200/50 transition-all duration-300 hover:shadow-3xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Selamat Datang
            </h1>
            <p className="text-base text-slate-500">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Alamat Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-base focus:border-teal-500 focus:ring-teal-500/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 pr-28 text-base focus:border-teal-500 focus:ring-teal-500/20 transition-all"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? "SEMBUNYIKAN" : "TAMPILKAN"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-600">
              Belum memiliki akun?{" "}
              <Link 
                href="/register" 
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors underline-offset-4 hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Dilindungi dengan autentikasi server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}