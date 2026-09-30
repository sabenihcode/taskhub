"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/store/useDataStore";

export function NotificationBanner() {
  const notification = useDataStore((s) => s.notification);
  const clearNotification = useDataStore((s) => s.clearNotification);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notification) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 3500);
      return () => clearTimeout(t);
    }
  }, [notification]);

  if (!show || !notification) return null;

  return (
    <div
      role="status"
      className="mono-border bg-black text-white p-3 text-xs font-mono font-bold text-center uppercase"
      onClick={clearNotification}
    >
      {notification}
    </div>
  );
}
