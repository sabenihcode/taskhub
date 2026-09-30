"use client";

import { create } from "zustand";
import type { Unsubscribe } from "firebase/firestore";
import * as fs from "@/firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import type {
  Company,
  Request,
  RequestType,
  Team,
  User,
} from "@/types";

type Source = "requests" | "companies" | "teams" | "requestTypes" | "users";
const ALL_SOURCES: Source[] = [
  "requests",
  "companies",
  "teams",
  "requestTypes",
  "users",
];

interface UpdateRequestOptions {
  /** Kosongkan untuk auto-generate (Status Changed / Request Updated) */
  timelineAction?: string;
  timelineMessage?: string;
}

interface DataState {
  requests: Request[];
  companies: Company[];
  teams: Team[];
  requestTypes: RequestType[];
  /** Semua user; dipakai juga sebagai daftar PIC / backup PIC / supervisor */
  users: User[];

  selectedReqId: string | null;
  notification: string | null;
  /** true sampai SEMUA collection selesai dimuat pertama kali */
  isLoading: boolean;
  error: string | null;

  // Lifecycle listener
  initListeners: () => void;
  stopListeners: () => void;
  reset: () => void;

  // Requests
  addRequest: (data: Partial<Request>) => Promise<string>;
  updateRequest: (
    id: string,
    data: Partial<Request>,
    options?: UpdateRequestOptions
  ) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;

  // Master data
  addTeam: (data: { code: string; name: string }) => Promise<string>;
  updateTeam: (id: string, data: Partial<Omit<Team, "id">>) => Promise<void>;
  addCompany: (data: {
    name: string;
    code?: string | null;
    teamId?: string | null;
  }) => Promise<string>;
  updateCompany: (id: string, data: Partial<Omit<Company, "id">>) => Promise<void>;
  addRequestType: (data: {
    name: string;
    category?: string | null;
  }) => Promise<string>;
  updateRequestType: (
    id: string,
    data: Partial<Omit<RequestType, "id">>
  ) => Promise<void>;
  updateUser: (
    id: string,
    data: Partial<Pick<User, "name" | "role" | "active">>
  ) => Promise<void>;

  // UI
  setSelectedReqId: (id: string | null) => void;
  showNotification: (msg: string) => void;
  clearNotification: () => void;
}

let unsubscribers: Unsubscribe[] = [];
let notificationTimer: ReturnType<typeof setTimeout> | null = null;

const initialData = {
  requests: [] as Request[],
  companies: [] as Company[],
  teams: [] as Team[],
  requestTypes: [] as RequestType[],
  users: [] as User[],
};

export const useDataStore = create<DataState>()((set, get) => ({
  ...initialData,
  selectedReqId: null,
  notification: null,
  isLoading: true,
  error: null,

  // ==========================================================
  // LISTENERS
  // ==========================================================
  initListeners: () => {
    get().stopListeners(); // hindari listener ganda
    set({ isLoading: true, error: null });

    const loaded = new Set<Source>();
    const markLoaded = (source: Source) => {
      if (loaded.has(source)) return;
      loaded.add(source);
      if (loaded.size === ALL_SOURCES.length) set({ isLoading: false });
    };
    const onError = (source: Source) => (err: Error) => {
      set({ error: `Gagal memuat ${source}: ${err.message}` });
      markLoaded(source); // jangan biarkan UI loading selamanya
    };

    unsubscribers = [
      fs.subscribeToRequests((requests) => {
        set({ requests });
        markLoaded("requests");
      }, onError("requests")),

      fs.subscribeToCompanies((companies) => {
        set({ companies });
        markLoaded("companies");
      }, onError("companies")),

      fs.subscribeToTeams((teams) => {
        set({ teams });
        markLoaded("teams");
      }, onError("teams")),

      fs.subscribeToRequestTypes((requestTypes) => {
        set({ requestTypes });
        markLoaded("requestTypes");
      }, onError("requestTypes")),

      fs.subscribeToUsers((users) => {
        set({ users });
        markLoaded("users");
      }, onError("users")),
    ];
  },

  stopListeners: () => {
    unsubscribers.forEach((unsub) => unsub());
    unsubscribers = [];
  },

  reset: () => {
    set({
      ...initialData,
      selectedReqId: null,
      notification: null,
      isLoading: true,
      error: null,
    });
  },

  // ==========================================================
  // REQUESTS
  // State TIDAK di-set manual; onSnapshot yang mengupdate store.
  // ==========================================================
  addRequest: async (data) => {
    const actor = useAuthStore.getState().user;
    const requestId = data.requestId ?? fs.generateRequestId();

    const id = await fs.createRequest({
      ...data,
      requestId,
      requesterId: data.requesterId ?? actor?.id ?? null,
      requesterName: data.requesterName ?? actor?.name ?? null,
      requesterEmail: data.requesterEmail ?? actor?.email ?? null,
    });

    // Timeline bersifat pelengkap: kegagalannya tidak boleh membatalkan request
    try {
      await fs.addTimelineEvent({
        requestId: id,
        actorId: actor?.id ?? null,
        actorName: actor?.name ?? null,
        action: "Request Created",
        message: `Request ${requestId} dibuat.`,
      });
    } catch (err) {
      console.error("[data] gagal menulis timeline:", err);
    }

    get().showNotification(`SUCCESS: REQUEST ${requestId} GENERATED.`);
    return id;
  },

  updateRequest: async (id, data, options) => {
    const actor = useAuthStore.getState().user;
    const current = get().requests.find((r) => r.id === id);

    await fs.updateRequest(id, data);

    let action = options?.timelineAction;
    let message = options?.timelineMessage;

    if (!action) {
      if (data.status && current && data.status !== current.status) {
        action = "Status Changed";
        message = `${current.status} → ${data.status}`;
      } else {
        action = "Request Updated";
      }
    }

    try {
      await fs.addTimelineEvent({
        requestId: id,
        actorId: actor?.id ?? null,
        actorName: actor?.name ?? null,
        action,
        message: message ?? null,
      });
    } catch (err) {
      console.error("[data] gagal menulis timeline:", err);
    }

    get().showNotification(
      `SUCCESS: REQUEST ${current?.requestId ?? id} UPDATED.`
    );
  },

  deleteRequest: async (id) => {
    const current = get().requests.find((r) => r.id === id);
    await fs.deleteRequest(id);
    if (get().selectedReqId === id) set({ selectedReqId: null });
    get().showNotification(
      `SUCCESS: REQUEST ${current?.requestId ?? id} DELETED.`
    );
  },

  // ==========================================================
  // MASTER DATA
  // ==========================================================
  addTeam: async (data) => {
    const id = await fs.addTeam(data);
    get().showNotification(`SUCCESS: TEAM ${data.name} ADDED.`);
    return id;
  },
  updateTeam: async (id, data) => {
    await fs.updateTeam(id, data);
    get().showNotification("SUCCESS: TEAM UPDATED.");
  },

  addCompany: async (data) => {
    const id = await fs.addCompany(data);
    get().showNotification(`SUCCESS: COMPANY ${data.name} ADDED.`);
    return id;
  },
  updateCompany: async (id, data) => {
    await fs.updateCompany(id, data);
    get().showNotification("SUCCESS: COMPANY UPDATED.");
  },

  addRequestType: async (data) => {
    const id = await fs.addRequestType(data);
    get().showNotification(`SUCCESS: REQUEST TYPE ${data.name} ADDED.`);
    return id;
  },
  updateRequestType: async (id, data) => {
    await fs.updateRequestType(id, data);
    get().showNotification("SUCCESS: REQUEST TYPE UPDATED.");
  },

  updateUser: async (id, data) => {
    await fs.updateUser(id, data);
    get().showNotification("SUCCESS: USER UPDATED.");
  },

  // ==========================================================
  // UI
  // ==========================================================
  setSelectedReqId: (id) => set({ selectedReqId: id }),

  showNotification: (msg) => {
    if (notificationTimer) clearTimeout(notificationTimer);
    set({ notification: msg });
    notificationTimer = setTimeout(() => {
      if (get().notification === msg) set({ notification: null });
      notificationTimer = null;
    }, 3500);
  },

  clearNotification: () => {
    if (notificationTimer) clearTimeout(notificationTimer);
    notificationTimer = null;
    set({ notification: null });
  },
}));