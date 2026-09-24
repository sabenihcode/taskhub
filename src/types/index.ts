export type Role = "admin" | "manager" | "team_leader" | "pic" | "viewer" | "user";

export interface User {
  id: string; // ← Changed from number to string
  email: string;
  name: string;
  role: Role;
  teamId?: string | null; // ← Changed from number to string
  team?: Team | null;
  position?: string | null;
  active: boolean;
  createdAt?: Date | string;
}

export interface Team {
  id: string; // ← Changed from number to string
  code: string;
  name: string;
  active: boolean;
}

export interface Company {
  id: string; // ← Changed from number to string
  name: string;
  code?: string | null;
  teamId?: string | null; // ← Changed from number to string
  team?: Team | null;
  active: boolean;
}

export interface RequestType {
  id: string; // ← Changed from number to string
  name: string;
  category?: string | null;
  active: boolean;
}

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

export type Priority = "Low" | "Normal" | "High" | "Urgent";

export type WaitingFor =
  | "Applicant"
  | "Company"
  | "HR"
  | "Finance"
  | "Internal Team"
  | "Immigration"
  | "Manpower"
  | "Other";

export interface Request {
  id: string; // ← Changed from number to string
  requestId: string;
  title: string;
  description?: string | null;
  companyId?: string | null; // ← Changed from number to string
  requestTypeId?: string | null; // ← Changed from number to string
  teamId?: string | null; // ← Changed from number to string
  priority: Priority;
  status: RequestStatus;
  dueDate?: Date | string | null;
  // Applicant
  applicantName?: string | null;
  passportNumber?: string | null;
  nationality?: string | null;
  applicantPosition?: string | null;
  department?: string | null;
  arrivalDate?: Date | string | null;
  currentImmigrationStatus?: string | null;
  // Assignment
  requesterId?: string | null; // ← Changed from number to string
  picId?: string | null; // ← Changed from number to string
  backupPicId?: string | null; // ← Changed from number to string
  supervisorId?: string | null; // ← Changed from number to string
  // Process
  currentAction?: string | null;
  nextAction?: string | null;
  waitingFor?: WaitingFor | null;
  missingDocument?: string | null;
  lastUpdateAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Relations
  requester?: User | null;
  pic?: User | null;
  backupPic?: User | null;
  supervisor?: User | null;
  team?: Team | null;
  company?: Company | null;
  requestType?: RequestType | null;
}

export interface TimelineEvent {
  id: string; // ← Changed from number to string
  requestId: string; // ← Changed from number to string
  actorId?: string | null; // ← Changed from number to string
  actorName?: string | null;
  action: string;
  message?: string | null;
  createdAt: Date | string;
}

export interface RequestFilters {
  search?: string;
  status?: RequestStatus | "All";
  priority?: Priority | "All";
  teamId?: string | "All"; // ← Changed from number to string
  companyId?: string | "All"; // ← Changed from number to string
  picId?: string | "All"; // ← Changed from number to string
}

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