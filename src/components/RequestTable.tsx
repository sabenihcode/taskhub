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
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Request } from "@/types";
import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RequestTableProps {
  requests: Request[];
  showPIC?: boolean; // optional toggle
}

export function RequestTable({ requests, showPIC = true }: RequestTableProps) {
  const [picNames, setPicNames] = useState<Record<string, string>>({});
  const [loadingPics, setLoadingPics] = useState(false);

  // Fetch PIC names from Firebase
  useEffect(() => {
    async function fetchPicNames() {
      const picIds = Array.from(
        new Set(
          requests
            .map((r) => r.picId)
            .filter((id): id is string => !!id)
        )
      );

      if (picIds.length === 0) return;

      setLoadingPics(true);
      const names: Record<string, string> = {};

      await Promise.all(
        picIds.map(async (id) => {
          try {
            const userDoc = await getDoc(doc(db, "users", id));
            if (userDoc.exists()) {
              names[id] = userDoc.data().name || "Unknown";
            }
          } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
          }
        })
      );

      setPicNames(names);
      setLoadingPics(false);
    }

    fetchPicNames();
  }, [requests]);

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
            <TableHead className="font-semibold text-slate-700">
              Applicant
            </TableHead>
            <TableHead className="font-semibold text-slate-700">Tim</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">
              Prioritas
            </TableHead>
            {showPIC && (
              <TableHead className="font-semibold text-slate-700">PIC</TableHead>
            )}
            <TableHead className="font-semibold text-slate-700">
              Due Date
            </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id} className="group">
              {/* Request ID */}
              <TableCell className="font-medium">
                <Link
                  href={`/requests/${req.id}`}
                  className="text-teal-700 hover:text-teal-800 hover:underline"
                >
                  {req.requestId}
                </Link>
              </TableCell>

              {/* Title */}
              <TableCell className="max-w-[260px]">
                <Link
                  href={`/requests/${req.id}`}
                  className="font-medium text-slate-900 line-clamp-1 hover:text-teal-700 transition-colors"
                >
                  {req.title}
                </Link>
              </TableCell>

              {/* Applicant */}
              <TableCell className="text-slate-600">
                {req.applicantName || (
                  <span className="text-slate-400 italic">—</span>
                )}
              </TableCell>

              {/* Team */}
              <TableCell className="text-slate-600">
                {req.teamId ? (
                  <TeamNameCell teamId={req.teamId} />
                ) : (
                  <span className="text-slate-400 italic">—</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={req.status} />
              </TableCell>

              {/* Priority */}
              <TableCell className="text-slate-700 font-medium">
                {req.priority}
              </TableCell>

              {/* PIC */}
              {showPIC && (
                <TableCell>
                  {req.picId ? (
                    picNames[req.picId] ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-semibold flex-shrink-0">
                          {picNames[req.picId]
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-700 truncate">
                          {picNames[req.picId]}
                        </span>
                      </div>
                    ) : loadingPics ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <span className="text-slate-400 italic text-sm">
                        Unknown
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-sm">
                      Belum ditugaskan
                    </span>
                  )}
                </TableCell>
              )}

              {/* Due Date */}
              <TableCell>
                <DueDateBadge date={req.dueDate} />
              </TableCell>

              {/* Action */}
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

// Team Name Cell - Lazy fetch team names
function TeamNameCell({ teamId }: { teamId: string }) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    getDoc(doc(db, "teams", teamId))
      .then((snap) => {
        if (mounted && snap.exists()) {
          setName(snap.data().name || "—");
        }
      })
      .catch(() => {
        if (mounted) setName("—");
      });

    return () => {
      mounted = false;
    };
  }, [teamId]);

  if (!name) {
    return <span className="text-slate-300 text-xs">...</span>;
  }
  return <span className="text-sm">{name}</span>;
}