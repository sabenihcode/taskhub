"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumn,
  Database,
  LayoutDashboard,
  Settings2,
  SquarePlus,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationBanner } from "@/components/layout/NotificationBanner";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/database", label: "Request Database", icon: Database },
  { href: "/create", label: "Create Request", icon: SquarePlus },
  { href: "/master", label: "Master Data", icon: Settings2 },
  { href: "/reports", label: "Performance Reports", icon: ChartColumn },
];

export function Topbar() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="mono-border-b bg-white">
      <div className="px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={40} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold uppercase tracking-wider font-mono leading-none">
              TaskHub
            </h1>
            <span className="text-[10px] uppercase text-gray-500 font-bold mt-1">
              Permit & Immigration Tracking System
            </span>
          </div>
        </Link>
        <UserMenu />
      </div>

      <nav className="px-6 md:px-8 pb-4 flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`mono-border px-3 py-2 text-xs uppercase font-bold transition-colors hover:bg-black hover:text-white inline-flex items-center gap-2 ${
                active ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <Icon size={16} strokeWidth={2.25} aria-hidden="true" />
              {/* Di layar sangat kecil hanya ikon yang tampil */}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 md:px-8 pb-4">
        <NotificationBanner />
      </div>
    </header>
  );
}