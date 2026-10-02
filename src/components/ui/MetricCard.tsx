// src/components/ui/MetricCard.tsx
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  isAlert?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function MetricCard({ label, value, isAlert = false, isActive = false, onClick }: MetricCardProps) {
  const baseClass = `mono-border p-4 flex flex-col justify-between transition-all ${
    isAlert ? "bg-black text-white" : "bg-white text-black"
  }`;

  // ✅ Jika clickable, tambah hover + cursor + active state
  const interactiveClass = onClick
    ? `cursor-pointer hover:scale-105 hover:shadow-lg ${
        isActive
          ? isAlert
            ? "ring-2 ring-red-400 shadow-lg"
            : "ring-2 ring-black shadow-lg"
          : ""
      }`
    : "";

  return (
    <div
      className={`${baseClass} ${interactiveClass}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      <span className="text-xs uppercase font-bold tracking-wider mb-2">
        {label}
      </span>
      <span className="text-3xl font-bold font-mono">{value}</span>
    </div>
  );
}