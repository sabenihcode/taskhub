"use client";

import { create } from "zustand";
import {
  ensureUserProfile,
  getAuthErrorMessage,
  loginWithEmail,
  logout as firebaseLogout,
  subscribeAuthState,
} from "@/firebase/auth";
import type { User, UserRole } from "@/types";

const INACTIVE_MESSAGE = "Akun ini dinonaktifkan. Hubungi admin.";
const PROFILE_ERROR_MESSAGE = "Gagal memuat profil user. Hubungi admin.";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** true sampai Firebase selesai mengecek session pertama kali */
  isInitializing: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  /** Mengembalikan fungsi unsubscribe. Panggil sekali dari AuthProvider. */
  initAuthListener: () => () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

// Mencegah hasil async lama menimpa hasil yang lebih baru
let authEventCounter = 0;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,

  login: async (email, password) => {
    set({ error: null });

    // 1. Autentikasi ke Firebase Auth
    let firebaseUser;
    try {
      firebaseUser = await loginWithEmail(email, password);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      set({ error: message });
      throw new Error(message);
    }

    // 2. Muat profil users/{uid} SEBELUM login() selesai,
    //    supaya router.push("/") tidak ditendang AuthGuard.
    try {
      const profile = await ensureUserProfile(firebaseUser);

      if (!profile.active) {
        await firebaseLogout();
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
          error: INACTIVE_MESSAGE,
        });
        throw new Error(INACTIVE_MESSAGE);
      }

      set({
        user: profile,
        isAuthenticated: true,
        isInitializing: false,
        error: null,
      });
    } catch (err) {
      if (err instanceof Error && err.message === INACTIVE_MESSAGE) throw err;

      console.error("[auth] gagal memuat profil:", err);
      await firebaseLogout().catch(() => {});
      set({
        user: null,
        isAuthenticated: false,
        isInitializing: false,
        error: PROFILE_ERROR_MESSAGE,
      });
      throw new Error(PROFILE_ERROR_MESSAGE);
    }
  },

  logout: async () => {
    await firebaseLogout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),

  initAuthListener: () =>
    subscribeAuthState(async (firebaseUser) => {
      const eventId = ++authEventCounter;

      if (!firebaseUser) {
        set({ user: null, isAuthenticated: false, isInitializing: false });
        return;
      }

      try {
        const profile = await ensureUserProfile(firebaseUser);
        if (eventId !== authEventCounter) return; // sudah ada event lebih baru

        if (!profile.active) {
          await firebaseLogout();
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            error: INACTIVE_MESSAGE,
          });
          return;
        }

        set({ user: profile, isAuthenticated: true, isInitializing: false });
      } catch (err) {
        if (eventId !== authEventCounter) return;
        console.error("[auth] gagal memuat profil:", err);
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
          error: PROFILE_ERROR_MESSAGE,
        });
      }
    }),

  hasRole: (...roles) => {
    const user = get().user;
    return !!user && roles.includes(user.role);
  },
}));