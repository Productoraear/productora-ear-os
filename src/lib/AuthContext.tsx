"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ═══════════════════════════════════════════════════════════════
// 🛡️ LISTA BLANCA DINÁSTICA - SOBERANÍA ABSOLUTA
// Solo estos usuarios tienen ACCESO ROOT (Administrador Supremo)
// ═══════════════════════════════════════════════════════════════
const DYNASTY_WHITELIST = [
  'productoraear@gmail.com',
  'edwin.agudelo@productora-ear.com',       // Edwin Alberto Agudelo Restrepo  
  'adriana.lenis@productora-ear.com',        // Luz Adriana Lenis Luna
  'leire.agudelo@productora-ear.com',        // Leire Naiara Agudelo Espinosa
];

// Nombres display para validación extendida
const DYNASTY_NAMES = [
  'Edwin Alberto Agudelo Restrepo',
  'Luz Adriana Lenis Luna',
  'Leire Naiara Agudelo Espinosa',
];

export type AuthRole = 'root' | 'admin' | 'operator' | 'user' | 'guest';

interface AuthState {
  user: User | null;
  loading: boolean;
  authRole: AuthRole;
  isDynasty: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Determina el nivel de acceso según la Lista Blanca Dinástica.
 */
function resolveAuthRole(user: User | null): AuthRole {
  if (!user) return 'guest';
  
  const email = user.email?.toLowerCase() || '';
  const displayName = user.displayName || '';
  
  // Validación Dinástica: email en whitelist O nombre en dynasty
  const isDynasty = DYNASTY_WHITELIST.includes(email) || 
                    DYNASTY_NAMES.some(name => 
                      displayName.toLowerCase().includes(name.toLowerCase().split(' ')[0])
                    );
  
  if (isDynasty) return 'root';
  
  // Cualquier otro usuario autenticado
  return 'user';
}

function checkIsDynasty(user: User | null): boolean {
  if (!user) return false;
  const email = user.email?.toLowerCase() || '';
  return DYNASTY_WHITELIST.includes(email) || 
         DYNASTY_NAMES.some(name => 
           (user.displayName || '').toLowerCase().includes(name.toLowerCase().split(' ')[0])
         );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Error con Google Sign-In');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    }
  };

  const authRole = resolveAuthRole(user);
  const isDynasty = checkIsDynasty(user);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authRole,
      isDynasty,
      isAuthenticated: !!user,
      signInWithEmail,
      signInWithGoogle,
      registerWithEmail,
      signOut,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

/**
 * Hook de guardia: redirige si no tiene el rol mínimo requerido.
 */
export function useRequireRole(minimumRole: AuthRole): boolean {
  const { authRole, loading } = useAuth();
  const roleHierarchy: AuthRole[] = ['guest', 'user', 'operator', 'admin', 'root'];
  
  if (loading) return false;
  
  const currentLevel = roleHierarchy.indexOf(authRole);
  const requiredLevel = roleHierarchy.indexOf(minimumRole);
  
  return currentLevel >= requiredLevel;
}
