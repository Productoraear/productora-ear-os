import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// NÚCLEO DE IDENTIDAD S-CLASS (Hardcoded para Sesión de Despliegue)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-W0JKLSZRQV"
};

// Initialize Firebase with failsafe logic
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Failsafe en entornos locales o de desarrollo sin credenciales remotas
    if (typeof window === 'undefined') {
      console.warn("⚠️ [FIREBASE] Credenciales de Firebase no presentes. Modo offline activo.");
    }
  }
} catch (err: any) {
  console.warn("⚠️ [FIREBASE] Advertencia al inicializar Firebase SDK:", err.message);
}

export { app, auth, db, storage };
