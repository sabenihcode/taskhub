import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  value: number | string;
  icon?: React.ReactNode;
  accent?: string;
  trend?: {
    value: number;
    positive?: boolean;
  };
  highlight?: boolean;
}

export function SummaryCard({
  title,
  subtitle,
  value,
  icon,
  accent = "bg-teal-600",
  trend,
  highlight = false,
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        highlight && "ring-2 ring-red-200 bg-red-50/30"
      )}
    >
      {/* Decorative gradient blob */}
      <div
        className={cn(
          "absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          accent
        )}
      />

      <CardContent className="p-5 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-600 truncate">{title}</p>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md",
                accent
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-2">
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {value}
          </div>

          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md",
                trend.positive
                  ? "text-green-700 bg-green-50"
                  : "text-red-700 bg-red-50"
              )}
            >
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}