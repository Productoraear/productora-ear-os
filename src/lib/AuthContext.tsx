"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPaid: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isAdmin: false, 
  isPaid: false,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          // 🔄 Señal UX cliente para pre-filtro Edge
          document.cookie = "ear_auth_signal=1; path=/; SameSite=Lax";

          // 🔄 Sincronización Segura con la Base de Datos Centralizada (Server Verificación)
          const response = await fetch('/api/nexus/user/sync', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
          });
          
          if (response.ok) {
            const profile = await response.json();
            setIsAdmin(profile.role === 'ADMIN');
            setIsPaid(profile.rank !== 'NIVEL_0_EXPLORADOR');
          } else {
            console.warn('⚠️ [AUTH_CONTEXT] Fallo en sincronización de perfil DB.');
          }
        } catch (err) {
          console.error('🛑 [AUTH_CONTEXT] Error crítico de sincronización:', err);
        }
      } else {
        document.cookie = "ear_auth_signal=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        setIsAdmin(false);
        setIsPaid(false);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
          await signInWithPopup(auth, provider);
      } catch (error) {
          console.error("GÉNESIS_AUTH_FAILURE:", error);
      }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isPaid, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
