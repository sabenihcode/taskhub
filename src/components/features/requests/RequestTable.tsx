"use client";

import Link from "next/link";
import type { Request } from "@/types";
import { RequestIndicators } from "@/components/ui/RequestIndicators";
import { useLookups } from "@/lib/useLookups";
import { formatDate } from "@/lib/utils";

interface RequestTableProps {
  requests: Request[];
  showCompany?: boolean;
}

export function RequestTable({ requests, showCompany = true }: RequestTableProps) {
  const { companyName, picName, typeName } = useLookups();

  if (requests.length === 0) {
    return (
      <div className="mono-border p-6 text-center text-xs uppercase font-bold text-gray-500">
        No request found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mono-border">
      <table className="w-full text-left text-xs">
        <thead className="bg-black text-white uppercase font-bold">
          <tr>
            <th className="p-3">Request ID</th>
            {showCompany && <th className="p-3">Company</th>}
            <th className="p-3">Applicant</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3">PIC</th>
            <th className="p-3">Due Date</th>
            <th className="p-3">Indicators</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="mono-border-t hover:bg-gray-50">
              <td className="p-3 font-mono font-bold">{req.requestId ?? req.id}</td>
              {showCompany && (
                <td className="p-3 font-semibold">{companyName(req.companyId)}</td>
              )}
              <td className="p-3">{req.applicantName ?? "-"}</td>
              <td className="p-3">{typeName(req.requestTypeId)}</td>
              <td className="p-3 font-bold">{req.status}</td>
              <td className="p-3">{picName(req.picId)}</td>
              <td className="p-3 font-mono">{formatDate(req.dueDate)}</td>
              <td className="p-3">
                <RequestIndicators request={req} showDash />
              </td>
              <td className="p-3 text-right">
                <Link
                  href={`/database/${req.id}`}
                  className="mono-border px-3 py-1 text-[11px] uppercase font-bold hover:bg-black hover:text-white"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}