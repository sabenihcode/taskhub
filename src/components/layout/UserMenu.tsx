"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_LABELS } from "@/types";

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      router.replace("/login");
    } catch (err) {
      console.error("[UserMenu] logout gagal:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="mono-border px-3 py-2 text-xs uppercase font-bold hover:bg-black hover:text-white"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mono-border px-3 py-2 text-xs uppercase font-bold bg-white text-black hover:bg-black hover:text-white"
      >
        {user.name || user.email} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 mono-border bg-white z-50">
          <div className="px-3 py-2 mono-border-b">
            <span className="block text-[10px] text-gray-500 uppercase">Logged in as</span>
            <span className="block text-xs font-bold uppercase break-all">
              {ROLE_LABELS[user.role]} / {user.email}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left px-3 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white disabled:opacity-50"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}