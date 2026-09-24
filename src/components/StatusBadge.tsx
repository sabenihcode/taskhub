import { STATUS_CONFIG } from "@/lib/constants";
import type { RequestStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "bg-slate-100 text-slate-700 border border-slate-200",
    dotColor: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        config.color,
        className
      )}
    >
      {/* Dot indicator */}
      <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
      <span>{config.label}</span>
    </span>
  );
}