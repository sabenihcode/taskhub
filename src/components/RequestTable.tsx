"use client";

import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { DueDateBadge } from "./DueDateBadge";
import { EmptyState } from "./EmptyState";
import type { Request } from "@/types";
import { ChevronRight } from "lucide-react";

interface RequestTableProps {
  requests: Request[];
}

export function RequestTable({ requests }: RequestTableProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="Tidak ada request"
        description="Coba ubah filter atau buat request baru."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="font-semibold text-slate-700">ID</TableHead>
            <TableHead className="font-semibold text-slate-700">Judul</TableHead>
            <TableHead className="font-semibold text-slate-700">Applicant</TableHead>
            <TableHead className="font-semibold text-slate-700">Tim</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">Prioritas</TableHead>
            <TableHead className="font-semibold text-slate-700">PIC</TableHead>
            <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id} className="group">
              <TableCell className="font-medium">
                <Link
                  href={`/requests/${req.id}`}
                  className="text-teal-700 hover:text-teal-800 hover:underline"
                >
                  {req.requestId}
                </Link>
              </TableCell>
              <TableCell className="max-w-[260px]">
                <Link
                  href={`/requests/${req.id}`}
                  className="font-medium text-slate-900 line-clamp-1 hover:text-teal-700 transition-colors"
                >
                  {req.title}
                </Link>
              </TableCell>
              <TableCell className="text-slate-600">
                {req.applicantName || (
                  <span className="text-slate-400 italic">—</span>
                )}
              </TableCell>
              <TableCell className="text-slate-600">
                {req.team?.name || (
                  <span className="text-slate-400 italic">—</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={req.status} />
              </TableCell>
              <TableCell className="text-slate-700 font-medium">
                {req.priority}
              </TableCell>
              <TableCell>
                {req.pic ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-semibold flex-shrink-0">
                      {req.pic.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-700 truncate">
                      {req.pic.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-sm">
                    Belum ditugaskan
                  </span>
                )}
              </TableCell>
              <TableCell>
                <DueDateBadge date={req.dueDate} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/requests/${req.id}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700 transition-all"
                  aria-label="View detail"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}