"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  List,
  Briefcase,
  Settings,
  AppWindow,
  Menu,
  X,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext"; // ✅ Import dari context

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests", label: "Requests", icon: List },
  { href: "/my-work", label: "My Jobs", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

// ==============================================
// SIDEBAR BODY COMPONENT (top level)
// ==============================================
interface SidebarBodyProps {
  pathname: string;
  collapsed: boolean;
  isMobileView: boolean;
  onItemClick: () => void;
  onToggleCollapse: () => void;
  navItems: typeof navItems;
}

function SidebarBody({
  pathname,
  collapsed,
  isMobileView,
  onItemClick,
  onToggleCollapse,
  navItems,
}: SidebarBodyProps) {
  const showFull = isMobileView || !collapsed;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-100 transition-all",
          isMobileView || showFull ? "gap-3 px-5" : "justify-center px-2"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 flex-1 min-w-0",
            !isMobileView && !showFull && "justify-center flex-none"
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-600/20">
            <AppWindow className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          {showFull && (
            <span className="text-base font-bold text-slate-900 whitespace-nowrap">
              TaskHub
            </span>
          )}
        </Link>

        {/* Desktop collapse button */}
        {!isMobileView && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Collapse sidebar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Desktop expand button when collapsed */}
      {!isMobileView && collapsed && (
        <div className="flex justify-center border-b border-slate-100 py-3">
          <button
            onClick={onToggleCollapse}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 hover:shadow-md transition-all"
            aria-label="Expand sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Section Label */}
      {showFull && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                showFull ? "gap-3 px-3" : "justify-center px-2",
                active
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/30"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              title={!showFull ? item.label : undefined}
            >
              {active && showFull && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform",
                  active && "scale-110"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              {showFull && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {showFull && (
        <div className="border-t border-slate-100 p-3">
          <p className="text-center text-[10px] text-slate-400">
            © 2026 TaskHub
          </p>
        </div>
      )}
    </div>
  );
}

// ==============================================
// MAIN SIDEBAR COMPONENT
// ==============================================
export function Sidebar() {
  const pathname = usePathname();
  // ✅ Pakai context - SHARED STATE
  const { open, setOpen } = useSidebar();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close on route change (mobile only)
  useEffect(() => {
    if (isMobile) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  const sharedProps = {
    pathname,
    collapsed,
    navItems,
    onToggleCollapse: () => setCollapsed(!collapsed),
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-200 bg-white shrink-0",
          "transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarBody
          {...sharedProps}
          isMobileView={false}
          onItemClick={() => {}}
        />
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-[70] w-72 max-w-[85vw] bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <SidebarBody
          {...sharedProps}
          isMobileView={true}
          onItemClick={() => setOpen(false)}
        />
      </div>
    </>
  );
}