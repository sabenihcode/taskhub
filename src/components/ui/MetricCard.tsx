import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  isAlert?: boolean;
}

export function MetricCard({ label, value, isAlert = false }: MetricCardProps) {
  return (
    <div
      className={`mono-border p-4 flex flex-col justify-between ${
        isAlert ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <span className="text-xs uppercase font-bold tracking-wider mb-2">
        {label}
      </span>
      <span className="text-3xl font-bold font-mono">{value}</span>
    </div>
  );
}
