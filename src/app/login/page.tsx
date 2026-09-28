"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BackgroundIllustration } from "@/components/BackgroundIllustration";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.error) setError(result.error);
      else router.replace("/dashboard");
    } catch {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) return null;

  // Form section (dipakai di kedua mode)
  const formContent = (
    <>
      {/* Logo Header (menggunakan /logo.png) */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="TaskHub Logo"
            width={80}
            height={80}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Selamat Datang Kembali
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Masuk ke akun TaskHub Anda
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2 animate-fade-in mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@perusahaan.com"
            required
            autoComplete="email"
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-teal-600 hover:text-teal-700">
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={submitting}
              className="h-11 rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1"
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/30 font-semibold"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-500">atau</span>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
          Daftar Sekarang
        </Link>
      </p>
    </>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ============================================ */}
      {/* LEFT: Background Image — Hidden on mobile */}
      {/* ============================================ */}
      <div className="hidden lg:block relative">
        <BackgroundIllustration />
      </div>

      {/* ============================================ */}
      {/* RIGHT: Form Section (full mobile, half desktop) */}
      {/* ============================================ */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50 px-6 py-12 min-h-screen lg:min-h-0">
        {/* Mobile-only: Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/50 p-8 shadow-xl shadow-slate-200/50">
            {formContent}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
