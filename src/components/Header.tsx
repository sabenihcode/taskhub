"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown, Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext"; // ✅ Import dari context

export function Header() {
  const { user, loading, logout } = useAuth();
  const { toggle } = useSidebar(); // ✅ Pakai context yang sama

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* ✅ Hamburger button - Mobile only */}
        <button
          onClick={toggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Page Title */}
        <h1 className="text-base font-semibold text-slate-900">
          Permit & Immigration
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : user ? (
          <DropdownMenu
            trigger={
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-white font-semibold text-xs shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="text-left hidden md:block pr-2">
                  <p className="text-xs font-medium text-slate-500 capitalize leading-tight">
                    {user.role}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {user.name}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block mr-1" />
              </button>
            }
          >
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}