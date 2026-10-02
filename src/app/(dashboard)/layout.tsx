// src/app/(dashboard)/layout.tsx
import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import DataProvider from "@/components/features/data/DataProvider";
import { DashboardErrorBoundary } from "@/components/layout/DashboardErrorBoundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardErrorBoundary>
        <DataProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <Topbar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
          </div>
        </DataProvider>
      </DashboardErrorBoundary>
    </AuthGuard>
  );
}