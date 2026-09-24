"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { DueDateBadge } from "@/components/DueDateBadge";
import { AssignmentSelector } from "@/components/AssignmentSelector";
import { TimelineFeed } from "@/components/TimelineFeed";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate, formatDateTime, timeAgo } from "@/lib/date-utils";
import { STATUSES, PRIORITIES, WAITING_FOR_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useMasterData } from "@/hooks/useMasterData";
import type { Request, TimelineEvent } from "@/types";
import {
  ArrowLeft,
  Save,
  Edit,
  Calendar,
  User as UserIcon,
  Building2,
  Tag,
  Activity,
  Clock,
  Hash,
  Briefcase,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { teams, companies, requestTypes } = useMasterData();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Fetch request
  const requestQuery = useQuery<Request>({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${id}`, { credentials: "same-origin" });
      if (!res.ok) throw new Error("Gagal memuat request");
      const json = await res.json();
      return json?.data || json;
    },
    refetchInterval: 10_000,
    enabled: !!id,
  });

  // Fetch timeline
  const timelineQuery = useQuery<TimelineEvent[]>({
    queryKey: ["timeline", id],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${id}/timeline`, { credentials: "same-origin" });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : (json?.data || []);
    },
    enabled: !!id,
  });

  const request = requestQuery.data;
  const events = timelineQuery.data || [];

  async function updateField(field: string, value: unknown) {
    setSaving(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Update gagal");
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (requestQuery.isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not found
  if (!request) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-slate-400" />
        <p className="text-slate-600">Request tidak ditemukan</p>
        <Button variant="outline" onClick={() => router.push("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const canEdit =
    ["admin", "manager", "team_leader"].includes(user?.role || "") ||
    request.requesterId === user?.id ||
    request.picId === user?.id ||
    request.backupPicId === user?.id ||
    request.supervisorId === user?.id;

  const filteredCompanies = companies.data?.filter(
    (c) => !request.teamId || c.teamId === request.teamId
  );

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* HEADER WITH BACK BUTTON */}
      {/* ============================================ */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/requests")}
          className="text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        {saving && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Save className="h-4 w-4 animate-pulse" />
            Menyimpan...
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* HERO HEADER CARD */}
      {/* ============================================ */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Background decoration */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-teal-100/40 to-transparent blur-2xl" />
        
        <div className="relative space-y-4">
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} />
            <StatusBadge status={request.priority as any} />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Hash className="h-3 w-3" />
              {request.requestId}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {request.title}
          </h1>

          {/* Description */}
          {request.description && (
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              {request.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Dibuat {timeAgo(request.createdAt)}
            </span>
            {request.lastUpdateAt && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Update {timeAgo(request.lastUpdateAt)}
              </span>
            )}
            <DueDateBadge date={request.dueDate} />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT - 2 COLUMN */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN - Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Info Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                Informasi Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <InfoItem
                  label="Tim"
                  value={request.team?.name}
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                />
                <InfoItem
                  label="Perusahaan"
                  value={request.company?.name}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />
                <InfoItem
                  label="Jenis Request"
                  value={request.requestType?.name}
                  icon={<Tag className="h-3.5 w-3.5" />}
                />
                <InfoItem
                  label="PIC"
                  value={request.pic?.name}
                  icon={<UserIcon className="h-3.5 w-3.5" />}
                />
                <InfoItem
                  label="Backup PIC"
                  value={request.backupPic?.name}
                  icon={<UserIcon className="h-3.5 w-3.5" />}
                />
                <InfoItem
                  label="Supervisor"
                  value={request.supervisor?.name}
                  icon={<UserIcon className="h-3.5 w-3.5" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Applicant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-slate-500" />
                Informasi Applicant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem label="Nama" value={request.applicantName} />
                <InfoItem label="Passport" value={request.passportNumber} />
                <InfoItem label="Kebangsaan" value={request.nationality} />
                <InfoItem label="Posisi" value={request.applicantPosition} />
                <InfoItem label="Departemen" value={request.department} />
                <InfoItem
                  label="Tanggal Kedatangan"
                  value={formatDate(request.arrivalDate)}
                />
                <div className="col-span-2">
                  <InfoItem
                    label="Status Imigrasi Saat Ini"
                    value={request.currentImmigrationStatus}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                Progress Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <InfoItem
                  label="Current Action"
                  value={request.currentAction}
                  multiline
                />
                <InfoItem
                  label="Next Action"
                  value={request.nextAction}
                  multiline
                />
                <InfoItem label="Waiting For" value={request.waitingFor} />
                <InfoItem
                  label="Dokumen Kurang"
                  value={request.missingDocument}
                  multiline
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Timeline Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineFeed requestId={id} events={events} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Aksi Cepat</CardTitle>
                {!canEdit && (
                  <span className="text-xs text-slate-400 italic">Read-only</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <FormField
                label="Status"
                icon={<Edit className="h-3.5 w-3.5" />}
              >
                <select
                  disabled={!canEdit}
                  value={request.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>

              {/* Priority */}
              <FormField
                label="Prioritas"
                icon={<Edit className="h-3.5 w-3.5" />}
              >
                <select
                  disabled={!canEdit}
                  value={request.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormField>

              {/* Assignments */}
              <FormField label="PIC">
                <AssignmentSelector
                  teamId={request.teamId}
                  value={request.picId ?? null}
                  onChange={(val) => updateField("picId", val)}
                  disabled={!canEdit}
                />
              </FormField>

              <FormField label="Backup PIC">
                <AssignmentSelector
                  teamId={request.teamId}
                  value={request.backupPicId ?? null}
                  onChange={(val) => updateField("backupPicId", val)}
                  disabled={!canEdit}
                />
              </FormField>

              <FormField label="Supervisor">
                <AssignmentSelector
                  teamId={request.teamId}
                  value={request.supervisorId ?? null}
                  onChange={(val) => updateField("supervisorId", val)}
                  disabled={!canEdit}
                />
              </FormField>

              {/* Company */}
              <FormField label="Perusahaan">
                <select
                  disabled={!canEdit}
                  value={request.companyId ?? ""}
                  onChange={(e) => updateField("companyId", e.target.value || null)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">— Pilih —</option>
                  {filteredCompanies?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>

              {/* Request Type */}
              <FormField label="Jenis Request">
                <select
                  disabled={!canEdit}
                  value={request.requestTypeId ?? ""}
                  onChange={(e) => updateField("requestTypeId", e.target.value || null)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">— Pilih —</option>
                  {requestTypes.data?.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </FormField>

              {/* Waiting For */}
              <FormField label="Waiting For">
                <select
                  disabled={!canEdit}
                  value={request.waitingFor ?? ""}
                  onChange={(e) => updateField("waitingFor", e.target.value || null)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">—</option>
                  {WAITING_FOR_OPTIONS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS (Top-level)
// ============================================

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
  multiline?: boolean;
}

function InfoItem({ label, value, icon, multiline }: InfoItemProps) {
  const displayValue = value || "—";
  const isEmpty = !value;

  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
        {icon}
        {label}
      </p>
      <p
        className={`text-sm font-medium ${
          isEmpty ? "text-slate-400 italic" : "text-slate-900"
        } ${multiline ? "whitespace-pre-wrap" : ""}`}
      >
        {displayValue}
      </p>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function FormField({ label, icon, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}