"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: Date | string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ uid?: string; error?: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success?: boolean; error?: string }>;
  logout: () => Promise<{ success?: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name:
                firebaseUser.displayName ||
                userData?.name ||
                "User",
              role: userData?.role || "user",
              createdAt: userData?.createdAt?.toDate?.(),
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Still set basic user info
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || "User",
              role: "user",
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const register = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      // ✅ Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Update display name
      await updateProfile(userCredential.user, { displayName: name });

      // ✅ Save additional data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role: "user", // First user becomes admin (check below)
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ✅ Check if this is the first user → make admin
      const usersSnapshot = await getDocs(
        query(collection(db, "users"), limit(2))
      );
      if (usersSnapshot.size === 1) {
        // First user! Make admin
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          { role: "admin" },
          { merge: true }
        );
      }

      return { uid: userCredential.user.uid };
    } catch (error: any) {
      console.error("Register error:", error);
      return { error: getErrorMessage(error.code) };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { error: getErrorMessage(error.code) };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { error: "Gagal logout" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Error message mapping
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Email sudah terdaftar",
    "auth/invalid-email": "Format email tidak valid",
    "auth/weak-password": "Password terlalu lemah (min. 6 karakter)",
    "auth/user-not-found": "Email tidak terdaftar",
    "auth/wrong-password": "Password salah",
    "auth/too-many-requests": "Terlalu banyak percobaan, coba lagi nanti",
    "auth/network-request-failed": "Koneksi internet bermasalah",
    "auth/invalid-credential": "Email atau password salah",
    "auth/operation-not-allowed": "Operasi tidak diizinkan",
    "auth/user-disabled": "Akun dinonaktifkan",
  };

  return messages[code] || "Terjadi kesalahan, silakan coba lagi";
}

// Tambahan import
import { collection, query, limit, getDocs } from "firebase/firestore";