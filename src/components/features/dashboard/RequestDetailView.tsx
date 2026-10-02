// src/components/features/dashboard/RequestDetailView.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import {
  STATUSES,
  WAITING_FOR_OPTIONS,
  type RequestStatus,
  type TimelineEvent,
  type WaitingFor,
} from "@/types";
import { useDataStore } from "@/store/useDataStore";
import { subscribeToTimeline } from "@/firebase/firestore";
import { useLookups } from "@/lib/useLookups";
import { formatDate, formatDateTime } from "@/lib/utils";

interface RequestDetailViewProps {
  /** Document ID Firestore (parameter [id] dari URL) */
  requestId: string;
}

export function RequestDetailView({ requestId }: RequestDetailViewProps) {
  const router = useRouter();
  const requests = useDataStore((s) => s.requests);
  const teams = useDataStore((s) => s.teams);
  const users = useDataStore((s) => s.users);
  const isLoading = useDataStore((s) => s.isLoading);
  const updateRequest = useDataStore((s) => s.updateRequest);
  const { companyName, picName, typeName, teamNameOfRequest } = useLookups();

  const baseRequest = requests.find((r) => r.id === requestId) ?? null;

  const [status, setStatus] = useState<RequestStatus>("New");
  const [currentAction, setCurrentAction] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [waitingFor, setWaitingFor] = useState<WaitingFor>("Internal Team");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Isi form SEKALI saat request pertama kali tersedia.
  const initializedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!baseRequest || initializedFor.current === baseRequest.id) return;
    initializedFor.current = baseRequest.id;
    setStatus(baseRequest.status);
    setCurrentAction(baseRequest.currentAction ?? "");
    setNextAction(baseRequest.nextAction ?? "");
    setWaitingFor((baseRequest.waitingFor as WaitingFor) || "Internal Team");
  }, [baseRequest]);

  // Timeline real-time (collection terpisah)
  useEffect(() => {
    return subscribeToTimeline(requestId, setTimeline);
  }, [requestId]);

  if (!baseRequest) {
    return (
      <div className="mono-border p-6 text-center text-xs uppercase font-bold text-gray-500">
        {isLoading ? "Loading request..." : `Request ${requestId} not found.`}
        {!isLoading && (
          <div className="mt-4">
            <Link href="/database">
              <Button>Back to Database</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const statusChanged = status !== baseRequest.status;

    try {
      await updateRequest(
        baseRequest.id,
        { status, currentAction, nextAction, waitingFor },
        {
          timelineAction: statusChanged ? "Status Changed" : "Progress Updated",
          timelineMessage: statusChanged
            ? `${baseRequest.status} → ${status}. Action: ${currentAction}`
            : `Action: ${currentAction}`,
        }
      );
      router.push("/database");
    } catch (err) {
      console.error("[RequestDetailView] gagal update:", err);
      setError(err instanceof Error ? err.message : "Failed to update request.");
      setSaving(false);
    }
  };

  const displayId = baseRequest.requestId ?? baseRequest.id;

  // ✅ Get team name
  const teamInfo = teams.find((t) => t.id === baseRequest.teamId);
  const teamDisplayName = teamInfo?.name ?? "-";

  // ✅ Get PIC user name
  const picUser = users.find((u) => u.id === baseRequest.picEmailUserId);
  const picUserName = picUser?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mono-border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-mono">{displayId}</h2>
            <span className="mono-border px-2 py-0.5 text-xs font-bold uppercase bg-black text-white">
              {baseRequest.status}
            </span>
          </div>
          <p className="text-xs uppercase text-gray-500 mt-1">
            {companyName(baseRequest.companyId)} - {baseRequest.subjectEmail ?? "-"} (
            {typeName(baseRequest.requestTypeId)})
          </p>
        </div>
        <Link href="/database">
          <Button>Back to Database</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ===== REQUEST DETAILS ===== */}
        <div className="mono-border p-4 space-y-3 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Request Details
          </h3>
          <DetailRow label="Subject Email" value={baseRequest.subjectEmail ?? "-"} />
          <DetailRow label="Detail Email" value={baseRequest.detailEmail ?? "-"} />
          <DetailRow label="Company & Team" value={`${companyName(baseRequest.companyId)} (${teamDisplayName})`} />
          <DetailRow label="Request Type" value={typeName(baseRequest.requestTypeId)} />
          <DetailRow label="PIC Email" value={picUserName} />
          <DetailRow label="Priority" value={baseRequest.priority} />
          <DetailRow label="Due Date" value={formatDate(baseRequest.dueDate)} mono />
          <DetailRow
            label="Last Update Date"
            value={formatDate(baseRequest.lastUpdateAt ?? baseRequest.updatedAt)}
            mono
          />
        </div>

        {/* ===== STATUS UPDATE FORM ===== */}
        <div className="mono-border p-5 md:col-span-2 bg-white space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Low Friction Status Update
          </h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Status">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RequestStatus)}
                  className="font-bold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Waiting For">
                <Select
                  value={waitingFor}
                  onChange={(e) => setWaitingFor(e.target.value as WaitingFor)}
                >
                  {WAITING_FOR_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Current Action (What are you doing now?)">
              <Input
                type="text"
                value={currentAction}
                onChange={(e) => setCurrentAction(e.target.value)}
                required
              />
            </Field>
            <Field label="Next Action (What is the next step?)">
              <Input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                required
              />
            </Field>
            {error && (
              <p className="text-xs font-bold uppercase text-red-600 mono-border p-2">
                {error}
              </p>
            )}
            <div className="pt-2 text-right">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Update Progress Now"}
              </Button>
            </div>
          </form>
        </div>

        {/* ===== AUDIT LOG TIMELINE ===== */}
        <div className="mono-border p-5 md:col-span-3 bg-white space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mono-border-b pb-2">
            Audit Log Timeline
          </h3>
          {timeline.length === 0 ? (
            <p className="text-xs uppercase text-gray-500">No timeline entries yet.</p>
          ) : (
            <div className="space-y-3">
              {/* subscribeToTimeline sudah mengurutkan terbaru di atas */}
              {timeline.map((t) => (
                <div key={t.id} className="flex gap-4 items-start text-xs">
                  <div className="w-36 font-mono text-[11px] text-gray-500 uppercase">
                    {formatDateTime(t.createdAt)}
                  </div>
                  <div className="flex-1 mono-border-l pl-3 pb-1">
                    <p className="font-semibold uppercase">{t.action}</p>
                    {t.message && <p className="text-gray-600 mt-0.5">{t.message}</p>}
                    {t.actorName && (
                      <p className="text-[10px] uppercase text-gray-500 mt-0.5">
                        by {t.actorName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function DetailRow({ label, value, mono = false }: DetailRowProps) {
  return (
    <div>
      <span className="block text-[10px] text-gray-500 uppercase">{label}</span>
      <span className={`text-xs font-bold uppercase ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}