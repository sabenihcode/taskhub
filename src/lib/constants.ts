export const ROLES = [
  "admin",
  "manager",
  "team_leader",
  "pic",
  "viewer",
  "user",
] as const;

export type Role = (typeof ROLES)[number];

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dotColor?: string }
> = {
  New: { 
    label: "Baru", 
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    dotColor: "bg-blue-500"
  },
  Acknowledged: {
    label: "Diterima",
    color: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dotColor: "bg-indigo-500"
  },
  "Waiting Document": {
    label: "Menunggu Dokumen",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    dotColor: "bg-amber-500"
  },
  Processing: {
    label: "Diproses",
    color: "bg-purple-50 text-purple-700 border border-purple-200",
    dotColor: "bg-purple-500"
  },
  Submitted: {
    label: "Diajukan",
    color: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    dotColor: "bg-cyan-500"
  },
  "Waiting Approval": {
    label: "Menunggu Approval",
    color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotColor: "bg-yellow-500"
  },
  "Follow Up": {
    label: "Follow Up",
    color: "bg-orange-50 text-orange-700 border border-orange-200",
    dotColor: "bg-orange-500"
  },
  Completed: {
    label: "Selesai",
    color: "bg-green-50 text-green-700 border border-green-200",
    dotColor: "bg-green-500"
  },
  Cancelled: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-700 border border-red-200",
    dotColor: "bg-red-500"
  },
  "On Hold": {
    label: "Ditunda",
    color: "bg-slate-50 text-slate-700 border border-slate-200",
    dotColor: "bg-slate-500"
  },
};

export const PRIORITY_CONFIG: Record<
  string, 
  { label: string; color: string; dotColor?: string }
> = {
  Low: { 
    label: "Rendah", 
    color: "bg-slate-50 text-slate-700 border border-slate-200",
    dotColor: "bg-slate-400"
  },
  Normal: { 
    label: "Normal", 
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotColor: "bg-emerald-500"
  },
  High: { 
    label: "Tinggi", 
    color: "bg-orange-50 text-orange-700 border border-orange-200",
    dotColor: "bg-orange-500"
  },
  Urgent: { 
    label: "Mendesak", 
    color: "bg-red-50 text-red-700 border border-red-200",
    dotColor: "bg-red-500"
  },
};

export const WAITING_FOR_OPTIONS = [
  "Applicant",
  "Company",
  "HR",
  "Finance",
  "Internal Team",
  "Immigration",
  "Manpower",
  "Other",
] as const;

export const STATUSES = Object.keys(STATUS_CONFIG);
export const PRIORITIES = Object.keys(PRIORITY_CONFIG);