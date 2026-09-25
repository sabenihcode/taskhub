"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { DueDateBadge } from "@/components/DueDateBadge";
import { AssignmentSelector } from "@/components/AssignmentSelector";
import { TimelineFeed } from "@/components/TimelineFeed";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate, timeAgo } from "@/lib/date-utils";
import { STATUSES, PRIORITIES, WAITING_FOR_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useMasterData } from "@/hooks/useMasterData";
import {
  getRequest,
  updateRequest,
  getTimeline,
  addTimelineEvent,
  getTeams,
  getCompanies,
} from "@/lib/firebase/db";
import type { Request, TimelineEvent } from "@/types";
import {
  ArrowLeft,
  Edit,
  Briefcase,
  User as UserIcon,
  Activity,
  Clock,
  Hash,
  FileText,
  AlertCircle,
  Loader2,
  Settings2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { requestTypes, pics } = useMasterData();
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getCompanies(), getTeams()])
      .then(([c, t]) => {
        setCompanies(c);
        setTeams(t);
      })
      .catch(console.error);
  }, []);

  const requestQuery = useQuery<Request | null>({
    queryKey: ["request", id],
    queryFn: async () => {
      const data = await getRequest(id);
      return data as Request | null;
    },
    enabled: !!id,
    refetchInterval: 30_000,
  });

  const timelineQuery = useQuery<TimelineEvent[]>({
    queryKey: ["timeline", id],
    queryFn: async () => {
      return await getTimeline(id);
    },
    enabled: !!id,
    refetchInterval: 30_000,
  });

  const request = requestQuery.data;
  const events = timelineQuery.data || [];

  async function updateField(field: string, value: unknown) {
    if (!request) return;
    setSaving(true);
    try {
      await updateRequest(request.id, { [field]: value });

      if (field === "status" && value !== request.status) {
        await addTimelineEvent({
          requestId: request.id,
          actorId: user?.id || "system",
          actorName: user?.name || "User",
          action: "status_changed",
          message: `Status berubah dari "${request.status}" menjadi "${value}"`,
        });
      }
      if (field === "picId" && value !== request.picId) {
        let picName = "Unknown";
        if (value) {
          const pic = pics.data.find((p) => p.id === value);
          picName = pic?.name || "Unknown";
        }
        await addTimelineEvent({
          requestId: request.id,
          actorId: user?.id || "system",
          actorName: user?.name || "User",
          action: "assigned",
          message: value ? `Ditugaskan ke ${picName}` : "Penugasan PIC dihapus",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["timeline", id] });
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  }

  if (requestQuery.isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!request) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-slate-400" />
        <p className="text-slate-600">Request tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push("/requests")} className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const canEdit = ["admin", "manager", "team_leader"].includes(user?.role || "") || 
                  request.requesterId === user?.id || request.picId === user?.id || 
                  request.backupPicId === user?.id || request.supervisorId === user?.id;

  const filteredCompanies = companies.filter((c) => !request.teamId || c.teamId === request.teamId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/requests")} className="text-slate-600 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-teal-100/40 to-transparent blur-2xl" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} />
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${request.priority === "Urgent" ? "bg-red-50 text-red-700 border border-red-200" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${request.priority === "Urgent" ? "bg-red-500" : "bg-slate-400"}`} />
              {request.priority}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Hash className="h-3 w-3" /> {request.requestId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{request.title}</h1>
          {request.description && <p className="text-slate-600 leading-relaxed max-w-3xl whitespace-pre-wrap">{request.description}</p>}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Dibuat {timeAgo(request.createdAt)}</span>
            {request.lastUpdateAt && <span className="inline-flex items-center gap-1.5"><Activity className="h-4 w-4" /> Update {timeAgo(request.lastUpdateAt)}</span>}
            <DueDateBadge date={request.dueDate} />
          </div>
        </div>
      </div>

      {/* HORIZONTAL ACTION BAR (Previously Sidebar) */}
      <Card className="border-teal-100 bg-teal-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-teal-800">
            <Settings2 className="h-4 w-4" /> Panel Kontrol Cepat
            {!canEdit && <span className="text-xs text-slate-400 font-normal italic ml-2">(Read-only)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <FormField label="Status" icon={<Edit className="h-3.5 w-3.5" />}>
              <select disabled={!canEdit || saving} value={request.status} onChange={(e) => updateField("status", e.target.value)} className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Prioritas" icon={<Edit className="h-3.5 w-3.5" />}>
              <select disabled={!canEdit || saving} value={request.priority} onChange={(e) => updateField("priority", e.target.value)} className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>

            <FormField label="PIC">
              <AssignmentSelector teamId={request.teamId} value={request.picId ?? null} onChange={(val) => updateField("picId", val)} disabled={!canEdit || saving} />
            </FormField>

            <FormField label="Backup PIC">
              <AssignmentSelector teamId={request.teamId} value={request.backupPicId ?? null} onChange={(val) => updateField("backupPicId", val)} disabled={!canEdit || saving} />
            </FormField>

            <FormField label="Supervisor">
              <AssignmentSelector teamId={request.teamId} value={request.supervisorId ?? null} onChange={(val) => updateField("supervisorId", val)} disabled={!canEdit || saving} />
            </FormField>

            <FormField label="Perusahaan">
              <select disabled={!canEdit || saving} value={request.companyId ?? ""} onChange={(e) => updateField("companyId", e.target.value || null)} className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none">
                <option value="">— Pilih —</option>
                {filteredCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>

            <FormField label="Jenis Request">
              <select disabled={!canEdit || saving} value={request.requestTypeId ?? ""} onChange={(e) => updateField("requestTypeId", e.target.value || null)} className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none">
                <option value="">— Pilih —</option>
                {requestTypes.data.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </FormField>

            <FormField label="Waiting For">
              <select disabled={!canEdit || saving} value={request.waitingFor ?? ""} onChange={(e) => updateField("waitingFor", e.target.value || null)} className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500/20 outline-none">
                <option value="">—</option>
                {WAITING_FOR_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* HORIZONTAL INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-500" /> Informasi Request
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Tim" value={teams.find((t) => t.id === request.teamId)?.name} />
            <InfoItem label="Perusahaan" value={companies.find((c) => c.id === request.companyId)?.name} />
            <InfoItem label="Jenis Request" value={requestTypes.data.find((t) => t.id === request.requestTypeId)?.name} />
            <InfoItem label="PIC" value={pics.data.find((p) => p.id === request.picId)?.name} />
            <InfoItem label="Backup PIC" value={pics.data.find((p) => p.id === request.backupPicId)?.name} />
            <InfoItem label="Supervisor" value={pics.data.find((p) => p.id === request.supervisorId)?.name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-slate-500" /> Informasi Applicant
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Nama" value={request.applicantName} />
            <InfoItem label="Passport" value={request.passportNumber} />
            <InfoItem label="Kebangsaan" value={request.nationality} />
            <InfoItem label="Posisi" value={request.applicantPosition} />
            <InfoItem label="Departemen" value={request.department} />
            <InfoItem label="Tgl Kedatangan" value={formatDate(request.arrivalDate)} />
            <div className="col-span-full">
              <InfoItem label="Status Imigrasi Saat Ini" value={request.currentImmigrationStatus} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" /> Progress Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem label="Current Action" value={request.currentAction} multiline />
            <InfoItem label="Next Action" value={request.nextAction} multiline />
            <InfoItem label="Waiting For" value={request.waitingFor} />
            <InfoItem label="Dokumen Kurang" value={request.missingDocument} multiline />
          </CardContent>
        </Card>
      </div>

      {/* Timeline - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" /> Timeline Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineFeed requestId={id} events={events} />
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function InfoItem({ label, value, icon, multiline }: { label: string; value: string | null | undefined; icon?: React.ReactNode; multiline?: boolean }) {
  const displayValue = value || "—";
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {icon} {label}
      </p>
      <p className={`text-sm font-medium ${!value ? "text-slate-400 italic" : "text-slate-900"} ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {displayValue}
      </p>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
