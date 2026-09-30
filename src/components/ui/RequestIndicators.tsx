import { isNoUpdate, isOverdue } from "@/lib/utils";
import type { Request } from "@/types";

interface RequestIndicatorsProps {
  request: Request;
  showDash?: boolean;
}

export function RequestIndicators({ request, showDash = false }: RequestIndicatorsProps) {
  const overdue = isOverdue(request);
  const noUpdate = isNoUpdate(request);

  if (overdue) {
    return (
      <span className="mono-border bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase mr-1">
        [OVERDUE]
      </span>
    );
  }
  if (noUpdate) {
    return (
      <span className="mono-border bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">
        [NO UPDATE]
      </span>
    );
  }
  if (!showDash) {
    return (
      <span className="mono-border px-2 py-0.5 text-[10px] uppercase">
        [NEW]
      </span>
    );
  }
  return <span className="text-gray-400 font-mono">-</span>;
}
