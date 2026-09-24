import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

// ==============================================
// TYPE DEFINITIONS (inline untuk simplicity)
// ==============================================
export interface Team {
  id: string;
  code: string;
  name: string;
  active?: boolean;
}

export interface Company {
  id: string;
  name: string;
  code?: string | null;
  teamId?: string | null;
  active?: boolean;
}

export interface RequestType {
  id: string;
  name: string;
  category?: string | null;
  active?: boolean;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role?: string;
  active?: boolean;
}

export interface RequestData {
  id: string;
  requestId?: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  teamId?: string | null;
  companyId?: string | null;
  requestTypeId?: string | null;
  picId?: string | null;
  backupPicId?: string | null;
  supervisorId?: string | null;
  requesterId?: string | null;
  requesterName?: string | null;
  requesterEmail?: string | null;
  applicantName?: string | null;
  passportNumber?: string | null;
  nationality?: string | null;
  applicantPosition?: string | null;
  department?: string | null;
  arrivalDate?: string | null;
  currentImmigrationStatus?: string | null;
  currentAction?: string | null;
  nextAction?: string | null;
  waitingFor?: string | null;
  missingDocument?: string | null;
  dueDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastUpdateAt?: string | null;
}

export interface TimelineEvent {
  id: string;
  requestId: string;
  actorId?: string | null;
  actorName?: string | null;
  action: string;
  message?: string | null;
  createdAt: string | Date;
}

// ==============================================
// TEAMS
// ==============================================
export async function getTeams(): Promise<Team[]> {
  const snap = await getDocs(collection(db, "teams"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Team)
  );
}

export async function addTeam(data: {
  code: string;
  name: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "teams"), {
    code: data.code,
    name: data.name,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTeam(id: string, data: Partial<Team>): Promise<void> {
  await updateDoc(doc(db, "teams", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// COMPANIES
// ==============================================
export async function getCompanies(): Promise<Company[]> {
  const snap = await getDocs(collection(db, "companies"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Company)
  );
}

export async function addCompany(data: {
  name: string;
  code?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "companies"), {
    name: data.name,
    code: data.code || null,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCompany(
  id: string,
  data: Partial<Company>
): Promise<void> {
  await updateDoc(doc(db, "companies", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// REQUEST TYPES
// ==============================================
export async function getRequestTypes(): Promise<RequestType[]> {
  const snap = await getDocs(collection(db, "requestTypes"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as RequestType)
  );
}

export async function addRequestType(data: {
  name: string;
  category?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "requestTypes"), {
    name: data.name,
    category: data.category || null,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateRequestType(
  id: string,
  data: Partial<RequestType>
): Promise<void> {
  await updateDoc(doc(db, "requestTypes", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// USERS
// ==============================================
export async function getUsers(): Promise<UserData[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as UserData)
  );
}

export async function updateUser(
  id: string,
  data: Partial<UserData>
): Promise<void> {
  await updateDoc(doc(db, "users", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ==============================================
// REQUESTS
// ==============================================
export async function getRequests(filters?: {
  search?: string;
  status?: string;
  priority?: string;
  teamId?: string;
  companyId?: string;
  picId?: string;
}): Promise<RequestData[]> {
  const constraints: QueryConstraint[] = [];

  // Apply filters - skip "All" values
  if (filters?.status && filters.status !== "All") {
    constraints.push(where("status", "==", filters.status));
  }
  if (filters?.priority && filters.priority !== "All") {
    constraints.push(where("priority", "==", filters.priority));
  }
  if (filters?.teamId && filters.teamId !== "All") {
    constraints.push(where("teamId", "==", filters.teamId));
  }
  if (filters?.companyId && filters.companyId !== "All") {
    constraints.push(where("companyId", "==", filters.companyId));
  }
  if (filters?.picId && filters.picId !== "All") {
    constraints.push(where("picId", "==", filters.picId));
  }

  constraints.push(orderBy("createdAt", "desc"));

  const q = query(collection(db, "requests"), ...constraints);
  const snap = await getDocs(q);

  let items = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt),
      dueDate: timestampToString(data.dueDate),
      arrivalDate: timestampToString(data.arrivalDate),
      lastUpdateAt: timestampToString(data.lastUpdateAt),
    } as RequestData;
  });

  // Client-side search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.requestId?.toLowerCase().includes(searchLower) ||
        item.applicantName?.toLowerCase().includes(searchLower) ||
        item.passportNumber?.toLowerCase().includes(searchLower)
      );
    });
  }

  return items;
}

export async function getRequest(id: string): Promise<RequestData | null> {
  const docSnap = await getDoc(doc(db, "requests", id));

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
    dueDate: timestampToString(data.dueDate),
    arrivalDate: timestampToString(data.arrivalDate),
    lastUpdateAt: timestampToString(data.lastUpdateAt),
  } as RequestData;
}

export async function createRequest(
  data: Partial<RequestData>
): Promise<string> {
  const docRef = await addDoc(collection(db, "requests"), {
    ...data,
    status: data.status || "New",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastUpdateAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateRequest(
  id: string,
  data: Partial<RequestData>
): Promise<void> {
  await updateDoc(doc(db, "requests", id), {
    ...data,
    updatedAt: Timestamp.now(),
    lastUpdateAt: Timestamp.now(),
  });
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, "requests", id));
}

export async function getMyWork(userId: string): Promise<RequestData[]> {
  const q = query(
    collection(db, "requests"),
    where("picId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt),
      dueDate: timestampToString(data.dueDate),
    } as RequestData;
  });
}

// ==============================================
// TIMELINE
// ==============================================
export async function getTimeline(
  requestId: string
): Promise<TimelineEvent[]> {
  const q = query(
    collection(db, "timeline"),
    where("requestId", "==", requestId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      requestId: data.requestId || requestId,
      actorId: data.actorId || null,
      actorName: data.actorName || null,
      action: data.action || "",
      message: data.message || null,
      createdAt: timestampToString(data.createdAt) || new Date().toISOString(),
    } as TimelineEvent;
  });
}

export async function addTimelineEvent(data: {
  requestId: string;
  actorId?: string;
  actorName?: string;
  action: string;
  message?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "timeline"), {
    requestId: data.requestId,
    actorId: data.actorId || null,
    actorName: data.actorName || null,
    action: data.action,
    message: data.message || null,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Subscribe to timeline changes (real-time)
 */
export function subscribeToTimeline(
  requestId: string,
  callback: (events: TimelineEvent[]) => void
): () => void {
  const q = query(
    collection(db, "timeline"),
    where("requestId", "==", requestId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const events = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          requestId: data.requestId || requestId,
          actorId: data.actorId || null,
          actorName: data.actorName || null,
          action: data.action || "",
          message: data.message || null,
          createdAt:
            timestampToString(data.createdAt) || new Date().toISOString(),
        } as TimelineEvent;
      });
      callback(events);
    },
    (error) => {
      console.error("Timeline subscription error:", error);
      callback([]);
    }
  );
}

// ==============================================
// DASHBOARD STATS
// ==============================================
export interface DashboardStats {
  total: number;
  new: number;
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

export async function getDashboardStats(): Promise<DashboardStats> {
  const requestsSnap = await getDocs(collection(db, "requests"));
  const all = requestsSnap.docs.map((doc) => doc.data());

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats: DashboardStats = {
    total: all.length,
    new: all.filter((r) => r.status === "New").length,
    waitingDocument: all.filter((r) => r.status === "Waiting Document").length,
    processing: all.filter((r) => r.status === "Processing").length,
    submitted: all.filter((r) => r.status === "Submitted").length,
    waitingApproval: all.filter((r) => r.status === "Waiting Approval").length,
    followUp: all.filter((r) => r.status === "Follow Up").length,
    completed: all.filter((r) => r.status === "Completed").length,
    cancelled: all.filter((r) => r.status === "Cancelled").length,
    onHold: all.filter((r) => r.status === "On Hold").length,
    overdue: all.filter((r) => {
      if (!r.dueDate || r.status === "Completed" || r.status === "Cancelled")
        return false;
      const due = r.dueDate?.toDate?.() || new Date(r.dueDate);
      return due < now;
    }).length,
    noUpdate3Days: all.filter((r) => {
      if (
        r.status === "Completed" ||
        r.status === "Cancelled" ||
        !r.lastUpdateAt
      )
        return false;
      const lastUpdate = r.lastUpdateAt?.toDate?.() || new Date(r.lastUpdateAt);
      return lastUpdate < threeDaysAgo;
    }).length,
    completedThisMonth: all.filter((r) => {
      if (r.status !== "Completed" || !r.lastUpdateAt) return false;
      const lastUpdate = r.lastUpdateAt?.toDate?.() || new Date(r.lastUpdateAt);
      return lastUpdate >= startOfMonth;
    }).length,
  };

  return stats;
}

// ==============================================
// SEED DATA (Initial setup)
// ==============================================
export async function seedInitialData(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check if already seeded
    const teamsSnap = await getDocs(collection(db, "teams"));
    if (!teamsSnap.empty) {
      return { success: true, message: "Data sudah ada, skip seeding" };
    }

    // Seed Teams
    const teamsData = [
      { code: "VDNI", name: "VDNI/GNI" },
      { code: "NNI", name: "NNI & Others" },
    ];

    for (const team of teamsData) {
      await addDoc(collection(db, "teams"), {
        ...team,
        active: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    // Seed Companies
    const companiesData = [
      { name: "PT VDNI", code: "VDNI" },
      { name: "PT GNI", code: "GNI" },
      { name: "PT NNI", code: "NNI" },
    ];

    for (const company of companiesData) {
      await addDoc(collection(db, "companies"), {
        ...company,
        active: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    // Seed Request Types
    const typesData = [
      "Visa",
      "ITK",
      "ITAS",
      "KITAS",
      "IMTA",
      "RPTKA",
      "Extension",
      "Cancellation",
      "Reporting",
    ];

    for (const name of typesData) {
      await addDoc(collection(db, "requestTypes"), {
        name,
        category: null,
        active: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    return { success: true, message: "Seed berhasil!" };
  } catch (error: any) {
    console.error("Seed error:", error);
    return { success: false, message: error.message };
  }
}

// ==============================================
// UTILITY HELPERS
// ==============================================

/**
 * Convert Firestore Timestamp to ISO string
 */
function timestampToString(timestamp: any): string | null {
  if (!timestamp) return null;

  try {
    // Firestore Timestamp
    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toISOString();
    }
    // Already a Date
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    // Already a string
    if (typeof timestamp === "string") {
      return timestamp;
    }
    // Number (milliseconds)
    if (typeof timestamp === "number") {
      return new Date(timestamp).toISOString();
    }
    return null;
  } catch (error) {
    console.error("Error converting timestamp:", error);
    return null;
  }
}

/**
 * Convert ISO string to Firestore Timestamp
 */
export function stringToTimestamp(isoString: string | null): Timestamp | null {
  if (!isoString) return null;
  try {
    return Timestamp.fromDate(new Date(isoString));
  } catch (error) {
    console.error("Error converting to timestamp:", error);
    return null;
  }
}

/**
 * Helper to ensure value is array
 */
export function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.data)) return data.data as T[];
  if (data && Array.isArray(data.items)) return data.items as T[];
  return [];
}