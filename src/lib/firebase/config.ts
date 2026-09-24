import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config
console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "✅ Set" : "❌ Missing",
  authDomain: firebaseConfig.authDomain ? "✅ Set" : "❌ Missing",
  projectId: firebaseConfig.projectId ? "✅ Set" : "❌ Missing",
  storageBucket: firebaseConfig.storageBucket ? "✅ Set" : "❌ Missing",
  messagingSenderId: firebaseConfig.messagingSenderId ? "✅ Set" : "❌ Missing",
  appId: firebaseConfig.appId ? "✅ Set" : "❌ Missing",
});

// Validate config - HANYA WARNING, JANGAN THROW ERROR
if (!firebaseConfig.apiKey) {
  console.warn("⚠️ NEXT_PUBLIC_FIREBASE_API_KEY is missing");
}

if (!firebaseConfig.projectId) {
  console.warn("⚠️ NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing");
}

// Initialize Firebase (singleton pattern)
// Hanya initialize jika config lengkap
let app;
let auth;
let db;
let storage;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn("⚠️ Firebase not initialized - missing configuration");
  // @ts-ignore - Akan diisi saat runtime
  app = null;
  // @ts-ignore
  auth = null;
  // @ts-ignore
  db = null;
  // @ts-ignore
  storage = null;
}

// Export Firebase services
export { auth, db, storage };
export default app;
