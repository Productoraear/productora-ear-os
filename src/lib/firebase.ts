import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// NÚCLEO DE IDENTIDAD S-CLASS (Con Fallback Seguro para Build & CI/CD)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBespokeBuildValidationKey0000000",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "productora-ear.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "productora-ear",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "productora-ear.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1029384756:web:a1b2c3d4e5f6g7h8",
  measurementId: "G-W0JKLSZRQV"
};

// Initialize Firebase with failsafe logic
let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn("⚠️ [FIREBASE] Inicialización diferida por entorno:", err);
  app = {} as any;
  auth = {} as any;
  db = {} as any;
  storage = {} as any;
}


export { app, auth, db, storage };

