"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useAuthStore } from "@/store/useAuthStore";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sudah login (atau baru selesai login) -> masuk ke dashboard
  useEffect(() => {
    if (!isInitializing && isAuthenticated) router.replace("/");
  }, [isInitializing, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // Redirect ditangani useEffect di atas
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Menunggu Firebase memeriksa sesi, atau sedang redirect
  if (isInitializing || isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="text-xs font-bold uppercase text-white/80">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mono-border bg-white/95 backdrop-blur-md p-6 space-y-5 shadow-2xl shadow-black/40"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider bg-black text-white p-2">
        Authentication
      </h3>

      {error && (
        <div
          role="alert"
          className="mono-border p-2 flex items-start gap-2 text-xs font-bold uppercase text-red-600"
        >
          <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Field label="Email *">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E.G. SUPERVISOR@COMPANY.COM"
          autoComplete="email"
          required
          disabled={submitting}
        />
      </Field>

      <Field label="Password *">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER PASSWORD"
            autoComplete="current-password"
            required
            disabled={submitting}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      {/* [&>button]:w-full membuat tombol selebar card tanpa bergantung pada props Button */}
      <div className="pt-2 [&>button]:w-full">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      <p className="text-center text-[10px] uppercase font-bold text-gray-500">
        No account? Contact your system administrator.
      </p>
    </form>
  );
}