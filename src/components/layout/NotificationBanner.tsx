// src/components/layout/NotificationBanner.tsx
"use client";

import { useDataStore } from "@/store/useDataStore";

export function NotificationBanner() {
  const notification = useDataStore((s) => s.notification);
  const clearNotification = useDataStore((s) => s.clearNotification);

  if (!notification) return null;

  return (
    <div
      role="status"
      className="mono-border bg-black text-white p-3 text-xs font-mono font-bold text-center uppercase cursor-pointer hover:bg-gray-900"
      onClick={clearNotification}
    >
      {notification}
    </div>
  );
}