// src/store/useDataStore.ts
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
    data: Partial<Pick<User, "name" | "role" | "active" | "companyId">>
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
    console.log("[useDataStore] initListeners dipanggil");
    
    // ✅ Hindari listener ganda
    get().stopListeners();
    
    set({ isLoading: true, error: null });

    const loaded = new Set<Source>();
    
    const markLoaded = (source: Source) => {
      if (loaded.has(source)) {
        console.log(`[useDataStore] ${source} sudah dimuat sebelumnya`);
        return;
      }
      
      loaded.add(source);
      console.log(
        `[useDataStore] ${source} loaded (${loaded.size}/${ALL_SOURCES.length})`
      );
      
      // ✅ Hanya tandai loading selesai jika SEMUA sumber sudah loaded
      if (loaded.size === ALL_SOURCES.length) {
        console.log("[useDataStore] ✅ SEMUA data selesai dimuat!");
        set({ isLoading: false });
      }
    };

    const onError = (source: Source) => (err: Error) => {
      console.error(`[useDataStore] ❌ Error loading ${source}:`, err);
      set({ error: `Gagal memuat ${source}: ${err.message}` });
      markLoaded(source); // jangan biarkan UI loading selamanya
    };

    try {
      unsubscribers = [
        // ✅ Subscribe Requests
        fs.subscribeToRequests(
          (requests) => {
            console.log(
              `[useDataStore] Requests updated: ${requests.length} items`
            );
            set({ requests });
            markLoaded("requests");
          },
          onError("requests")
        ),

        // ✅ Subscribe Companies
        fs.subscribeToCompanies(
          (companies) => {
            console.log(
              `[useDataStore] Companies updated: ${companies.length} items`
            );
            set({ companies });
            markLoaded("companies");
          },
          onError("companies")
        ),

        // ✅ Subscribe Teams
        fs.subscribeToTeams(
          (teams) => {
            console.log(
              `[useDataStore] Teams updated: ${teams.length} items`
            );
            set({ teams });
            markLoaded("teams");
          },
          onError("teams")
        ),

        // ✅ Subscribe RequestTypes
        fs.subscribeToRequestTypes(
          (requestTypes) => {
            console.log(
              `[useDataStore] RequestTypes updated: ${requestTypes.length} items`
            );
            set({ requestTypes });
            markLoaded("requestTypes");
          },
          onError("requestTypes")
        ),

        // ✅ Subscribe Users
        fs.subscribeToUsers(
          (users) => {
            console.log(
              `[useDataStore] Users updated: ${users.length} items`
            );
            set({ users });
            markLoaded("users");
          },
          onError("users")
        ),
      ];

      console.log(
        `[useDataStore] ${unsubscribers.length} listeners berhasil didaftarkan`
      );
    } catch (err) {
      console.error("[useDataStore] ❌ Error setting up listeners:", err);
      set({
        error: `Gagal setup listeners: ${err instanceof Error ? err.message : String(err)}`,
        isLoading: false,
      });
    }
  },

  stopListeners: () => {
    console.log(
      `[useDataStore] Menghentikan ${unsubscribers.length} listeners...`
    );
    unsubscribers.forEach((unsub, idx) => {
      try {
        unsub();
        console.log(`[useDataStore] Listener ${idx + 1} berhasil dihentikan`);
      } catch (err) {
        console.error(
          `[useDataStore] Error menghentikan listener ${idx + 1}:`,
          err
        );
      }
    });
    unsubscribers = [];
  },

  reset: () => {
    console.log("[useDataStore] Reset state");
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
    console.log("[useDataStore] addRequest dipanggil", data);
    
    const actor = useAuthStore.getState().user;
    const requestId = data.requestId ?? fs.generateRequestId();

    try {
      const id = await fs.createRequest({
        ...data,
        requestId,
        requesterId: data.requesterId ?? actor?.id ?? null,
        requesterName: data.requesterName ?? actor?.name ?? null,
        requesterEmail: data.requesterEmail ?? actor?.email ?? null,
      });

      console.log(`[useDataStore] Request ${requestId} berhasil dibuat dengan ID: ${id}`);

      // ✅ Timeline bersifat pelengkap: kegagalannya tidak boleh membatalkan request
      try {
        await fs.addTimelineEvent({
          requestId: id,
          actorId: actor?.id ?? null,
          actorName: actor?.name ?? null,
          action: "Request Created",
          message: `Request ${requestId} dibuat.`,
        });
        console.log(`[useDataStore] Timeline event berhasil ditambahkan untuk ${requestId}`);
      } catch (err) {
        console.warn("[useDataStore] ⚠️ Gagal menulis timeline (non-critical):", err);
      }

      get().showNotification(`SUCCESS: REQUEST ${requestId} GENERATED.`);
      return id;
    } catch (err) {
      console.error("[useDataStore] ❌ Error addRequest:", err);
      const msg = err instanceof Error ? err.message : String(err);
      get().showNotification(`ERROR: ${msg}`);
      throw err;
    }
  },

  updateRequest: async (id, data, options) => {
    console.log("[useDataStore] updateRequest dipanggil", { id, data });
    
    const actor = useAuthStore.getState().user;
    const current = get().requests.find((r) => r.id === id);

    try {
      await fs.updateRequest(id, data);
      console.log(`[useDataStore] Request ${id} berhasil di-update`);

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
        console.log(`[useDataStore] Timeline event "${action}" berhasil ditambahkan`);
      } catch (err) {
        console.warn("[useDataStore] ⚠️ Gagal menulis timeline (non-critical):", err);
      }

      get().showNotification(
        `SUCCESS: REQUEST ${current?.requestId ?? id} UPDATED.`
      );
    } catch (err) {
      console.error("[useDataStore] ❌ Error updateRequest:", err);
      const msg = err instanceof Error ? err.message : String(err);
      get().showNotification(`ERROR: ${msg}`);
      throw err;
    }
  },

  deleteRequest: async (id) => {
    console.log("[useDataStore] deleteRequest dipanggil", { id });
    
    const current = get().requests.find((r) => r.id === id);

    try {
      await fs.deleteRequest(id);
      console.log(`[useDataStore] Request ${id} berhasil dihapus`);
      
      if (get().selectedReqId === id) {
        set({ selectedReqId: null });
      }
      
      get().showNotification(
        `SUCCESS: REQUEST ${current?.requestId ?? id} DELETED.`
      );
    } catch (err) {
      console.error("[useDataStore] ❌ Error deleteRequest:", err);
      const msg = err instanceof Error ? err.message : String(err);
      get().showNotification(`ERROR: ${msg}`);
      throw err;
    }
  },

  // ==========================================================
  // MASTER DATA
  // ==========================================================
  addTeam: async (data) => {
    console.log("[useDataStore] addTeam dipanggil", data);
    try {
      const id = await fs.addTeam(data);
      console.log(`[useDataStore] Team ${data.name} berhasil ditambahkan dengan ID: ${id}`);
      get().showNotification(`SUCCESS: TEAM ${data.name} ADDED.`);
      return id;
    } catch (err) {
      console.error("[useDataStore] ❌ Error addTeam:", err);
      throw err;
    }
  },

  updateTeam: async (id, data) => {
    console.log("[useDataStore] updateTeam dipanggil", { id, data });
    try {
      await fs.updateTeam(id, data);
      console.log(`[useDataStore] Team ${id} berhasil di-update`);
      get().showNotification("SUCCESS: TEAM UPDATED.");
    } catch (err) {
      console.error("[useDataStore] ❌ Error updateTeam:", err);
      throw err;
    }
  },

  addCompany: async (data) => {
    console.log("[useDataStore] addCompany dipanggil", data);
    try {
      const id = await fs.addCompany(data);
      console.log(`[useDataStore] Company ${data.name} berhasil ditambahkan dengan ID: ${id}`);
      get().showNotification(`SUCCESS: COMPANY ${data.name} ADDED.`);
      return id;
    } catch (err) {
      console.error("[useDataStore] ❌ Error addCompany:", err);
      throw err;
    }
  },

  updateCompany: async (id, data) => {
    console.log("[useDataStore] updateCompany dipanggil", { id, data });
    try {
      await fs.updateCompany(id, data);
      console.log(`[useDataStore] Company ${id} berhasil di-update`);
      get().showNotification("SUCCESS: COMPANY UPDATED.");
    } catch (err) {
      console.error("[useDataStore] ❌ Error updateCompany:", err);
      throw err;
    }
  },

  addRequestType: async (data) => {
    console.log("[useDataStore] addRequestType dipanggil", data);
    try {
      const id = await fs.addRequestType(data);
      console.log(`[useDataStore] RequestType ${data.name} berhasil ditambahkan dengan ID: ${id}`);
      get().showNotification(`SUCCESS: REQUEST TYPE ${data.name} ADDED.`);
      return id;
    } catch (err) {
      console.error("[useDataStore] ❌ Error addRequestType:", err);
      throw err;
    }
  },

  updateRequestType: async (id, data) => {
    console.log("[useDataStore] updateRequestType dipanggil", { id, data });
    try {
      await fs.updateRequestType(id, data);
      console.log(`[useDataStore] RequestType ${id} berhasil di-update`);
      get().showNotification("SUCCESS: REQUEST TYPE UPDATED.");
    } catch (err) {
      console.error("[useDataStore] ❌ Error updateRequestType:", err);
      throw err;
    }
  },

  updateUser: async (id, data) => {
    console.log("[useDataStore] updateUser dipanggil", { id, data });
    try {
      await fs.updateUser(id, data);
      console.log(`[useDataStore] User ${id} berhasil di-update`);
      get().showNotification("SUCCESS: USER UPDATED.");
    } catch (err) {
      console.error("[useDataStore] ❌ Error updateUser:", err);
      throw err;
    }
  },

  // ==========================================================
  // UI
  // ==========================================================
  setSelectedReqId: (id) => {
    console.log("[useDataStore] setSelectedReqId:", id);
    set({ selectedReqId: id });
  },

  showNotification: (msg) => {
    console.log("[useDataStore] showNotification:", msg);
    if (notificationTimer) clearTimeout(notificationTimer);
    set({ notification: msg });
    notificationTimer = setTimeout(() => {
      if (get().notification === msg) set({ notification: null });
      notificationTimer = null;
    }, 3500);
  },

  clearNotification: () => {
    console.log("[useDataStore] clearNotification");
    if (notificationTimer) clearTimeout(notificationTimer);
    notificationTimer = null;
    set({ notification: null });
  },
}));