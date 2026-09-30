import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Company,
  DashboardStats,
  Priority,
  Request,
  RequestFilters,
  RequestStatus,
  RequestType,
  Team,
  TimelineEvent,
  User,
  UserRole,
} from "@/types";
import { USER_ROLES } from "@/types";

// ==============================================
// COLLECTION NAMES (harus sama dengan Security Rules)
// ==============================================
export const COLLECTIONS = {
  USERS: "users",
  TEAMS: "teams",
  COMPANIES: "companies",
  REQUEST_TYPES: "requestTypes",
  REQUESTS: "requests",
  TIMELINE: "timeline",
} as const;

// ==============================================
// INTERNAL HELPERS
// ==============================================
function requireDb() {
  if (!db) {
    throw new Error(
      "Firestore belum siap. Pastikan env NEXT_PUBLIC_FIREBASE_* terisi dan kode berjalan di browser."
    );
  }
  return db;
}

function stripUndefined<T extends DocumentData>(obj: T): T {
  // Firestore menolak nilai `undefined`
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

function sortByDateDesc<T>(items: T[], getDate: (item: T) => string | null | undefined) {
  return items.sort((a, b) => {
    const da = getDate(a) ? new Date(getDate(a) as string).getTime() : 0;
    const dbb = getDate(b) ? new Date(getDate(b) as string).getTime() : 0;
    return dbb - da;
  });
}

function sortByName<T extends { name: string }>(items: T[]) {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

// ==============================================
// TIMESTAMP CONVERTERS
// ==============================================

/** Firestore Timestamp / Date / string / number -> ISO string */
export function toISO(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString();
  return null;
}

/** ISO string -> Firestore Timestamp (null jika kosong / tidak valid) */
export function toTimestamp(iso: string | null | undefined): Timestamp | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

// ==============================================
// DOCUMENT MAPPERS (Firestore -> tipe aplikasi)
// ==============================================
function mapTeam(id: string, d: DocumentData): Team {
  return {
    id,
    code: d.code ?? "",
    name: d.name ?? "",
    active: d.active !== false,
  };
}

function mapCompany(id: string, d: DocumentData): Company {
  return {
    id,
    name: d.name ?? "",
    code: d.code ?? null,
    teamId: d.teamId ?? null,
    active: d.active !== false,
  };
}

function mapRequestType(id: string, d: DocumentData): RequestType {
  return {
    id,
    name: d.name ?? "",
    category: d.category ?? null,
    active: d.active !== false,
  };
}

export function normalizeRole(role: unknown): UserRole {
  const value = String(role ?? "").toLowerCase();
  return (USER_ROLES as string[]).includes(value) ? (value as UserRole) : "user";
}

export function mapUserDoc(id: string, d: DocumentData): User {
  return {
    id,
    email: d.email ?? "",
    name: d.name ?? "",
    role: normalizeRole(d.role),
    active: d.active !== false,
  };
}

function mapRequest(id: string, d: DocumentData): Request {
  return {
    ...(d as Omit<Request, "id">),
    id, // selalu pakai ID dokumen, bukan field `id` di dalam data
    title: d.title ?? "",
    status: (d.status ?? "New") as RequestStatus,
    priority: (d.priority ?? "Normal") as Priority,
    dueDate: toISO(d.dueDate),
    arrivalDate: toISO(d.arrivalDate),
    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    lastUpdateAt: toISO(d.lastUpdateAt),
  };
}

function mapTimeline(id: string, d: DocumentData): TimelineEvent {
  return {
    id,
    requestId: d.requestId ?? "",
    actorId: d.actorId ?? null,
    actorName: d.actorName ?? null,
    action: d.action ?? "",
    message: d.message ?? null,
    createdAt: toISO(d.createdAt) ?? new Date().toISOString(),
  };
}

// ==============================================
// GENERIC REAL-TIME SUBSCRIBER
// Sorting dilakukan di client supaya:
// - tidak butuh composite index
// - dokumen lama yang tidak punya field tertentu tidak hilang dari hasil
// ==============================================
function subscribeCollection<T>(
  name: string,
  mapper: (id: string, data: DocumentData) => T,
  sorter: (items: T[]) => T[],
  callback: (items: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) return () => {};

  return onSnapshot(
    collection(db, name),
    (snap) => {
      const items = snap.docs.map((d) => mapper(d.id, d.data()));
      callback(sorter(items));
    },
    (error) => {
      console.error(`[firestore] subscribe "${name}" error:`, error);
      onError?.(error);
    }
  );
}

// ==============================================
// TEAMS
// ==============================================
export function subscribeToTeams(
  callback: (data: Team[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeCollection(COLLECTIONS.TEAMS, mapTeam, sortByName, callback, onError);
}

export async function addTeam(data: { code: string; name: string }): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(requireDb(), COLLECTIONS.TEAMS), {
    code: data.code,
    name: data.name,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateTeam(
  id: string,
  data: Partial<Omit<Team, "id">>
): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTIONS.TEAMS, id), {
    ...stripUndefined(data),
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// COMPANIES
// ==============================================
export function subscribeToCompanies(
  callback: (data: Company[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeCollection(COLLECTIONS.COMPANIES, mapCompany, sortByName, callback, onError);
}

export async function addCompany(data: {
  name: string;
  code?: string | null;
  teamId?: string | null;
}): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(requireDb(), COLLECTIONS.COMPANIES), {
    name: data.name,
    code: data.code ?? null,
    teamId: data.teamId ?? null,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateCompany(
  id: string,
  data: Partial<Omit<Company, "id">>
): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTIONS.COMPANIES, id), {
    ...stripUndefined(data),
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// REQUEST TYPES
// ==============================================
export function subscribeToRequestTypes(
  callback: (data: RequestType[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeCollection(
    COLLECTIONS.REQUEST_TYPES,
    mapRequestType,
    sortByName,
    callback,
    onError
  );
}

export async function addRequestType(data: {
  name: string;
  category?: string | null;
}): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(requireDb(), COLLECTIONS.REQUEST_TYPES), {
    name: data.name,
    category: data.category ?? null,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateRequestType(
  id: string,
  data: Partial<Omit<RequestType, "id">>
): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTIONS.REQUEST_TYPES, id), {
    ...stripUndefined(data),
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// USERS (dipakai juga sebagai daftar PIC)
// Pembuatan akun dilakukan manual lewat Firebase Console.
// ==============================================
export function subscribeToUsers(
  callback: (data: User[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeCollection(COLLECTIONS.USERS, mapUserDoc, sortByName, callback, onError);
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "name" | "role" | "active">>
): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTIONS.USERS, id), {
    ...stripUndefined(data),
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// REQUESTS
// ==============================================
const REQUEST_DATE_FIELDS = ["dueDate", "arrivalDate"] as const;
const REQUEST_READONLY_FIELDS = ["id", "createdAt", "updatedAt", "lastUpdateAt"] as const;

/** Tipe aplikasi -> payload Firestore (ISO string -> Timestamp, hapus field sistem) */
function toFirestoreRequest(data: Partial<Request>): DocumentData {
  const payload: DocumentData = { ...data };

  for (const key of REQUEST_READONLY_FIELDS) delete payload[key];

  for (const key of REQUEST_DATE_FIELDS) {
    if (key in payload) payload[key] = toTimestamp(payload[key] as string | null);
  }

  return stripUndefined(payload);
}

/** Generator ID yang mudah dibaca. Format: REQ-YYYYMMDD-XXXX */
export function generateRequestId(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${ymd}-${rand}`;
}

export function subscribeToRequests(
  callback: (data: Request[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return subscribeCollection(
    COLLECTIONS.REQUESTS,
    mapRequest,
    (items) => sortByDateDesc(items, (r) => r.createdAt),
    callback,
    onError
  );
}

/** Real-time satu request (untuk halaman detail) */
export function subscribeToRequest(
  id: string,
  callback: (data: Request | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) return () => {};

  return onSnapshot(
    doc(db, COLLECTIONS.REQUESTS, id),
    (snap) => callback(snap.exists() ? mapRequest(snap.id, snap.data()) : null),
    (error) => {
      console.error(`[firestore] subscribe request "${id}" error:`, error);
      onError?.(error);
    }
  );
}

/** Membuat request baru. Mengembalikan document ID. */
export async function createRequest(data: Partial<Request>): Promise<string> {
  const now = Timestamp.now();
  const ref = await addDoc(collection(requireDb(), COLLECTIONS.REQUESTS), {
    ...toFirestoreRequest(data),
    requestId: data.requestId ?? generateRequestId(),
    status: data.status ?? "New",
    priority: data.priority ?? "Normal",
    createdAt: now,
    updatedAt: now,
    lastUpdateAt: now,
  });
  return ref.id;
}

export async function updateRequest(
  id: string,
  data: Partial<Request>
): Promise<void> {
  const now = Timestamp.now();
  await updateDoc(doc(requireDb(), COLLECTIONS.REQUESTS, id), {
    ...toFirestoreRequest(data),
    updatedAt: now,
    lastUpdateAt: now,
  });
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTIONS.REQUESTS, id));
}

// ==============================================
// TIMELINE (collection terpisah, append-only sesuai rules)
// ==============================================
export function subscribeToTimeline(
  requestId: string,
  callback: (events: TimelineEvent[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) return () => {};

  // Sengaja tanpa orderBy agar tidak perlu composite index; sort di client.
  const q = query(collection(db, COLLECTIONS.TIMELINE), where("requestId", "==", requestId));

  return onSnapshot(
    q,
    (snap) => {
      const events = snap.docs.map((d) => mapTimeline(d.id, d.data()));
      callback(sortByDateDesc(events, (e) => e.createdAt));
    },
    (error) => {
      console.error("[firestore] subscribe timeline error:", error);
      onError?.(error);
      callback([]);
    }
  );
}

export async function addTimelineEvent(data: {
  requestId: string;
  actorId?: string | null;
  actorName?: string | null;
  action: string;
  message?: string | null;
}): Promise<string> {
  const ref = await addDoc(collection(requireDb(), COLLECTIONS.TIMELINE), {
    requestId: data.requestId,
    actorId: data.actorId ?? null,
    actorName: data.actorName ?? null,
    action: data.action,
    message: data.message ?? null,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

// ==============================================
// CLIENT-SIDE HELPERS (tanpa read tambahan ke Firestore)
// ==============================================

/** Filter request yang sudah ada di store. Nilai "All" atau kosong = diabaikan. */
export function filterRequests(requests: Request[], filters: RequestFilters = {}): Request[] {
  const active = (v?: string) => (v && v !== "All" ? v : null);

  const status = active(filters.status);
  const priority = active(filters.priority);
  const teamId = active(filters.teamId);
  const companyId = active(filters.companyId);
  const picId = active(filters.picId);
  const search = filters.search?.trim().toLowerCase();

  return requests.filter((r) => {
    if (status && r.status !== status) return false;
    if (priority && r.priority !== priority) return false;
    if (teamId && r.teamId !== teamId) return false;
    if (companyId && r.companyId !== companyId) return false;
    if (picId && r.picId !== picId) return false;

    if (search) {
      const haystack = [r.title, r.requestId, r.applicantName, r.passportNumber]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

/** Hitung statistik dashboard dari array request di store. */
export function computeDashboardStats(requests: Request[]): DashboardStats {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = (status: RequestStatus) => requests.filter((r) => r.status === status).length;
  const isOpen = (r: Request) => r.status !== "Completed" && r.status !== "Cancelled";
  const lastUpdate = (r: Request) => {
    const v = r.lastUpdateAt ?? r.updatedAt ?? r.createdAt;
    return v ? new Date(v) : null;
  };

  return {
    total: requests.length,
    new: count("New"),
    acknowledged: count("Acknowledged"),
    waitingDocument: count("Waiting Document"),
    processing: count("Processing"),
    submitted: count("Submitted"),
    waitingApproval: count("Waiting Approval"),
    followUp: count("Follow Up"),
    completed: count("Completed"),
    cancelled: count("Cancelled"),
    onHold: count("On Hold"),
    overdue: requests.filter((r) => isOpen(r) && r.dueDate && new Date(r.dueDate) < now).length,
    noUpdate3Days: requests.filter((r) => {
      if (!isOpen(r)) return false;
      const last = lastUpdate(r);
      return !!last && last < threeDaysAgo;
    }).length,
    completedThisMonth: requests.filter((r) => {
      if (r.status !== "Completed") return false;
      const last = lastUpdate(r);
      return !!last && last >= startOfMonth;
    }).length,
  };
}