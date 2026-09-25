"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password strength calculator
  const passwordStrength = (() => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: "", color: "" },
      { label: "Sangat Lemah", color: "bg-red-500" },
      { label: "Lemah", color: "bg-orange-500" },
      { label: "Cukup", color: "bg-yellow-500" },
      { label: "Kuat", color: "bg-lime-500" },
      { label: "Sangat Kuat", color: "bg-green-500" },
      { label: "Sangat Kuat", color: "bg-green-600" },
    ];

    return { strength, ...levels[Math.min(strength, 6)] };
  })();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("Nama minimal 3 karakter");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        name: trimmedName,
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Wait for Firestore to save user data
        setTimeout(async () => {
          try {
            const userDoc = await getDoc(doc(db!, "users", result.uid!));
            const userData = userDoc.data();
            const userRole = userData?.role || "user";

            router.replace("/dashboard");
          } catch (err) {
            router.replace("/dashboard");
          }
        }, 500);
      }
    } catch (err: any) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If already logged in
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50 px-6 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Header */}
        <div className="mb-8 text-center">
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
            Buat Akun Baru
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar untuk mulai mengelola request
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/50 p-8 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 animate-fade-in">
                <div className="flex items-start gap-2">
                  <span className="font-semibold">⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Nama Lengkap
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Andi Wijaya"
                required
                minLength={3}
                autoComplete="name"
                disabled={submitting}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={submitting}
                  className="h-11 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors px-2 py-1"
                  tabIndex={-1}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1.5 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs text-slate-600">
                      Kekuatan:{" "}
                      <span
                        className={`font-semibold ${
                          passwordStrength.strength >= 4
                            ? "text-green-600"
                            : passwordStrength.strength >= 3
                            ? "text-yellow-600"
                            : "text-orange-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan ulang password"
                  required
                  autoComplete="new-password"
                  disabled={submitting}
                  className="h-11 rounded-xl pr-20"
                />
                {/* Match indicator */}
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {password === confirmPassword ? (
                      <span className="text-xs font-semibold text-green-600">
                        ✓ Cocok
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-red-600">
                        ✗ Tidak cocok
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={submitting}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 disabled:opacity-50 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 cursor-pointer select-none"
              >
                Saya menyetujui{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold text-teal-600 hover:text-teal-700 underline-offset-2 hover:underline"
                >
                  Syarat & Ketentuan
                </Link>
                {" "}dan{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-semibold text-teal-600 hover:text-teal-700 underline-offset-2 hover:underline"
                >
                  Kebijakan Privasi
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={submitting || !agreeTerms}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Membuat Akun...
                </span>
              ) : (
                "Daftar Sekarang"
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

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 All rights reserved.
        </p>
      </div>
    </div>
  );
}
