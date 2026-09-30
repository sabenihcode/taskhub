"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { COLLECTIONS, mapUserDoc } from "./firestore";
import type { User } from "@/types";

// ==============================================
// SIGN IN / SIGN OUT
// ==============================================
export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase Auth belum siap.");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

// ==============================================
// AUTH STATE LISTENER
// ==============================================
export function subscribeAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  if (!auth) {
    // Tanpa ini aplikasi akan terjebak di "Checking session..." jika config belum terisi
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ==============================================
// USER PROFILE  ->  users/{uid}
// ==============================================
export async function getUserProfile(uid: string): Promise<User | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? mapUserDoc(snap.id, snap.data()) : null;
}

/**
 * Ambil profil user; jika belum ada, buat otomatis dengan role "user".
 * Sesuai rules: create hanya boleh untuk dokumen milik sendiri.
 * Untuk admin/manager, ubah field `role` manual di Firebase Console.
 */
export async function ensureUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  if (!db) throw new Error("Firestore belum siap.");

  const ref = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return mapUserDoc(snap.id, snap.data());

  const now = Timestamp.now();
  const profile = {
    email: firebaseUser.email ?? "",
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    role: "user",
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(ref, profile);
  return mapUserDoc(firebaseUser.uid, profile);
}

// ==============================================
// ERROR MESSAGE
// ==============================================
export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau password salah.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-disabled":
      return "Akun ini dinonaktifkan.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
    case "auth/network-request-failed":
      return "Koneksi bermasalah. Periksa internet kamu.";
    default:
      return "Login gagal. Silakan coba lagi.";
  }
}