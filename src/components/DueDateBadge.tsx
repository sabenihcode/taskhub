import { dueDateStatus, formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface DueDateBadgeProps {
  date: Date | string | null | undefined;
  className?: string;
}

export function DueDateBadge({ date, className }: DueDateBadgeProps) {
  const { text, variant } = dueDateStatus(date);
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        {
          "bg-slate-50 text-slate-700 border border-slate-200": variant === "default",
          "bg-amber-50 text-amber-700 border border-amber-200": variant === "warning",
          "bg-red-50 text-red-700 border border-red-200": variant === "danger",
        },
        className
      )}
      title={date ? formatDate(date) : undefined}
    >
      {/* Dot indicator instead of emoji */}
      <span 
        className={cn(
          "h-2 w-2 rounded-full",
          {
            "bg-slate-400": variant === "default",
            "bg-amber-500": variant === "warning",
            "bg-red-500": variant === "danger",
          }
        )} 
      />
      {text}
    </span>
  );
}