import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// ============================================================================
// 🌌 THE AUTH NEXUS (Single Source of Truth)
// ============================================================================
// Propósito: Resolver la fricción Multi-Auth documentada en el INFORME FORENSE.
// Firebase Auth manda en el cliente. Supabase confía en Firebase vía JWT.
// ============================================================================

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = (rawSupabaseUrl && (rawSupabaseUrl.startsWith('http://') || rawSupabaseUrl.startsWith('https://')))
  ? rawSupabaseUrl
  : 'https://ear-os-production.supabase.co';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🔒 FAIL-CLOSED SUPABASE (BLINDAJE SESSION_SECRET P0): sin anon key real, el NEXUS no se instancia.
if (!supabaseAnonKey || supabaseAnonKey.includes('dummy_anon_key_placeholder')) {
  throw new Error('[AUTH_NEXUS] NEXT_PUBLIC_SUPABASE_ANON_KEY no configurada (fail-closed).');
}

// 1. SUPABASE CLIENT
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// 2. FIREBASE CLIENT
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// 🔒 FAIL-CLOSED FIREBASE (BLINDAJE SESSION_SECRET P0): sin apiKey real, el NEXUS no se instancia.
if (!firebaseApiKey || firebaseApiKey === 'dummy_firebase_key') {
  throw new Error('[AUTH_NEXUS] NEXT_PUBLIC_FIREBASE_API_KEY no configurada (fail-closed).');
}

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'productora-ear.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'productora-ear',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'productora-ear.appspot.com',
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
            console.warn('⚠️ [AUTH NEXUS] Supabase devolvió 403. Operando en modo degradado.');
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
      } catch (err) {
        console.warn('⚠️ [AUTH NEXUS] SignOut error:', err);
      }
    }
    callback(firebaseUser);
  });
};

export default { supabase, auth, syncSClassAuth };
