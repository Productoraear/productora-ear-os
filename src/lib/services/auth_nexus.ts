import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// ============================================================================
// 🌌 THE AUTH NEXUS (Single Source of Truth)
// ============================================================================
// Propósito: Resolver la fricción Multi-Auth documentada en el INFORME FORENSE.
// Firebase Auth manda en el cliente. Supabase confía en Firebase vía JWT.
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-build.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

// 1. SUPABASE CLIENT
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// 2. FIREBASE CLIENT
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);

// 3. THE BRIDGE: Firebase -> Supabase
export const syncSClassAuth = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token,
          });
          
          if (error) {
            if (error.status === 403) {
              console.warn('⚠️ [AUTH NEXUS] Supabase devolvió 403. Probablemente falta configurar Firebase como proveedor en el Dashboard de Supabase. Operando en modo degradado.');
            } else {
              throw error;
            }
          }
        } catch (err) {
          console.warn('⚠️ [AUTH NEXUS] Supabase sync falló — operando solo con Firebase:', err);
        }
    } else {
      try {
        await supabase.auth.signOut();
      } catch (_) { /* Silencioso */ }
    }
    
    callback(firebaseUser);
  });
};
