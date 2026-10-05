// src/types/index.ts
// ==============================================
// TYPES - ImmiTrack (sinkron dengan Firestore project lama)
// Semua tanggal di level aplikasi berupa ISO string.
// Konversi Timestamp <-> string ada di src/firebase/firestore.ts
// ==============================================

// ---------- Union types ----------
export type RequestStatus =
  | "New"
  | "Acknowledged"
  | "Waiting Document"
  | "Processing"
  | "Submitted"
  | "Waiting Approval"
  | "Follow Up"
  | "Completed"
  | "Cancelled"
  | "On Hold";

export type Priority = "Normal" | "Urgent";

export type WaitingFor =
  | "Applicant"
  | "Company"
  | "HR"
  | "Finance"
  | "Internal Team"
  | "Instansi Kemenaker"
  | "Immigration"
  | "Manpower"
  | "Other";

export type DocumentStatus = "Missing" | "Received" | "Valid" | "Expired";

// Harus sama dengan Security Rules: role in ['admin', 'user', 'manager']
export type UserRole = "admin" | "manager" | "user";

// ---------- Master data ----------
export interface Team {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

export interface Company {
  id: string;
  name: string;
  code: string | null;
  teamId: string | null;
  active: boolean;
}

export interface RequestType {
  id: string;
  name: string;
  category: string | null;
  active: boolean;
}

// ---------- User (users/{uid}) ----------
// PIC, backup PIC, dan supervisor semuanya mereferensi User.id
export interface User {
  id: string; // = Firebase Auth uid
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  companyId?: string | null; // ✅ BARU: User belongs to company
}

// ---------- Request ----------
export interface DocumentItem {
  name: string;
  status: DocumentStatus;
}

export interface Request {
  id: string; // Firestore document ID
  requestId?: string | null; // ID yang mudah dibaca, contoh: REQ-20250115-1234
  title: string;
  description?: string | null;

  status: RequestStatus;
  priority: Priority;

  // Relasi (menyimpan ID dokumen)
  teamId?: string | null;
  companyId?: string | null;
  requestTypeId?: string | null;
  picId?: string | null;
  backupPicId?: string | null;
  supervisorId?: string | null;

  // Requester
  requesterId?: string | null;
  requesterName?: string | null;
  requesterEmail?: string | null;

  // ✅ BARU: Email Content
  subjectEmail?: string | null;    // Pengajuan Visa, dll
  detailEmail?: string | null;     // Visa 12 Pax, dll
  picEmailUserId?: string | null;  // User ID siapa yg ditunjuk
  
  // OLD FIELDS (DEPRECATED - tapi keep untuk backward compatibility)
  applicantName?: string | null;
  passportNumber?: string | null;
  nationality?: string | null;
  applicantPosition?: string | null;
  department?: string | null;
  arrivalDate?: string | null;
  currentImmigrationStatus?: string | null;

  // Progress
  currentAction?: string | null;
  nextAction?: string | null;
  waitingFor?: string | null;
  missingDocument?: string | null;
  documents?: DocumentItem[]; // opsional, hanya jika data lama memakainya

  // Tanggal (ISO string)
  dueDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastUpdateAt?: string | null;
}

// ---------- Timeline (collection terpisah: timeline) ----------
export interface TimelineEvent {
  id: string;
  requestId: string;
  actorId?: string | null;
  actorName?: string | null;
  action: string;
  message?: string | null;
  createdAt: string; // ISO string
}

// ---------- Dashboard ----------
export interface DashboardStats {
  total: number;
  new: number;
  acknowledged: number;
  waitingDocument: number;
  processing: number;
  submitted: number;
  waitingApproval: number;
  followUp: number;
  completed: number;
  cancelled: number;
  onHold: number;
  overdue: number;
  noUpdate3Days: number;
  completedThisMonth: number;
}

export interface RequestFilters {
  search?: string;
  status?: string;
  priority?: string;
  teamId?: string;
  companyId?: string;
  picId?: string;
}

// ---------- Constants ----------
export const STATUSES: RequestStatus[] = [
  "New",
  "Acknowledged",
  "Waiting Document",
  "Processing",
  "Submitted",
  "Waiting Approval",
  "Follow Up",
  "Completed",
  "Cancelled",
  "On Hold",
];

export const PRIORITIES: Priority[] = ["Normal", "Urgent"];

export const WAITING_FOR_OPTIONS: WaitingFor[] = [
  "Applicant",
  "Company",
  "HR",
  "Finance",
  "Internal Team",
  "Instansi Kemenaker",
  "Immigration",
  "Manpower",
  "Other",
];

export const USER_ROLES: UserRole[] = ["admin", "manager", "user"];

// Label tampilan di UI (sebelumnya: Supervisor / Manager / Staff)
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  user: "Staff",
};
