import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada item untuk ditampilkan saat ini.",
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-6 text-center",
        className
      )}
    >
      {/* Empty box icon replacement - using CSS */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <div className="h-10 w-10 rounded-lg border-2 border-dashed border-slate-300" />
      </div>
      
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-600">{description}</p>
      
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}