"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (pwd.length >= 6) strength++;  // Minimum password server
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Sangat Lemah", color: "bg-red-500" },
      { strength: 2, label: "Lemah", color: "bg-orange-500" },
      { strength: 3, label: "Cukup", color: "bg-yellow-500" },
      { strength: 4, label: "Kuat", color: "bg-lime-500" },
      { strength: 5, label: "Sangat Kuat", color: "bg-green-500" },
      { strength: 6, label: "Sangat Kuat", color: "bg-green-600" },
    ];

    return levels[Math.min(strength, 6)];
  };

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (name.trim().length < 3) {
      setError("Nama minimal 3 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    setSubmitting(true);
    const result = await register({ name: name.trim(), email: email.trim(), password });
    setSubmitting(false);
    
    if (result.error) {
      setError(result.error);
    }
    // Redirect handled by useEffect when user state changes
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/50 p-10 shadow-2xl shadow-slate-200/50 transition-all duration-300 hover:shadow-3xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Buat Akun Baru
            </h1>
            <p className="text-base text-slate-500">
              Daftar untuk mulai mengelola request Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                minLength={3}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-base focus:border-teal-500 focus:ring-teal-500/20 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Alamat Email
              </label>
              <Input
                id="email"
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
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Kata Sandi
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
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 pr-28 text-base focus:border-teal-500 focus:ring-teal-500/20 transition-all"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-teal-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? "SEMBUNYIKAN" : "TAMPILKAN"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs font-medium text-slate-600">
                      Kekuatan: <span className={passwordStrength.strength >= 4 ? "text-green-600" : passwordStrength.strength >= 3 ? "text-yellow-600" : "text-orange-600"}>
                        {passwordStrength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                Konfirmasi Kata Sandi
              </label>
              
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan ulang kata sandi"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 pr-28 text-base focus:border-teal-500 focus:ring-teal-500/20 transition-all"
                />
                
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-teal-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "SEMBUNYIKAN" : "TAMPILKAN"}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {password === confirmPassword ? (
                    <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      Kata sandi cocok
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                      <span className="text-red-600">✗</span>
                      Kata sandi tidak cocok
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
                Saya menyetujui{" "}
                <Link 
                  href="/terms" 
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline underline-offset-2"
                  target="_blank"
                >
                  Syarat & Ketentuan
                </Link>
                {" "}dan{" "}
                <Link 
                  href="/privacy" 
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline underline-offset-2"
                  target="_blank"
                >
                  Kebijakan Privasi
                </Link>
              </label>
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
              disabled={submitting || !agreeTerms}
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

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-600">
              Sudah memiliki akun?{" "}
              <Link 
                href="/login" 
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors underline-offset-4 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Data Anda dilindungi dengan autentikasi server
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/50 p-6 shadow-lg shadow-slate-200/30">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Keuntungan mendaftar:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-xs mt-0.5">
                ✓
              </span>
              <span>Kelola semua request dalam satu platform terpusat</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-xs mt-0.5">
                ✓
              </span>
              <span>Tracking real-time dan notifikasi otomatis</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-xs mt-0.5">
                ✓
              </span>
              <span>Dashboard analytics dan reporting lengkap</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-xs mt-0.5">
                ✓
              </span>
              <span>Kolaborasi tim yang lebih efisien dan terorganisir</span>
            </li>
          </ul>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Dengan mendaftar, Anda akan mendapatkan akses gratis ke semua fitur dasar
          </p>
        </div>
      </div>
    </div>
  );
}