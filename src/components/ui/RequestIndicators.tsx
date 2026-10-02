// src/components/ui/RequestIndicators.tsx
import { isNoUpdate, isOverdue } from "@/lib/utils";
import type { Request } from "@/types";

interface RequestIndicatorsProps {
  request: Request;
  showDash?: boolean;
}

export function RequestIndicators({ request, showDash = false }: RequestIndicatorsProps) {
  const overdue = isOverdue(request);
  const noUpdate = isNoUpdate(request);

  // ✅ Tampilkan multiple indicators jika keduanya true
  if (overdue || noUpdate) {
    return (
      <div className="flex gap-1 flex-wrap">
        {overdue && (
          <span className="mono-border bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase" title="Lewat due date">
            [OVERDUE]
          </span>
        )}
        {noUpdate && (
          <span className="mono-border bg-gray-800 text-white px-2 py-0.5 text-[10px] font-bold uppercase" title="Belum ada update > 3 hari">
            [NO UPDATE]
          </span>
        )}
      </div>
    );
  }

  if (!showDash) {
    return (
      <span className="mono-border px-2 py-0.5 text-[10px] uppercase" title="Request baru">
        [NEW]
      </span>
    );
  }

  return <span className="text-gray-400 font-mono">-</span>;
}