"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPaid: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

interface UserSyncProfile {
  role?: string;
  rank?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isPaid: false,
  loading: true,
  signInWithGoogle: async (): Promise<void> => {},
  logout: async (): Promise<void> => {},
});

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null): Promise<void> => {
        setUser(firebaseUser);

        if (firebaseUser) {
          try {
            const idToken: string = await firebaseUser.getIdToken();
            // 🔄 Señal UX cliente para pre-filtro Edge
            document.cookie = "ear_auth_signal=1; path=/; SameSite=Lax";

            // 🔄 Sincronización Segura con la Base de Datos Centralizada (Server Verificación)
            const response: Response = await fetch("/api/nexus/user/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            });

            if (response.ok) {
              const profile: UserSyncProfile =
                (await response.json()) as UserSyncProfile;
              setIsAdmin(profile.role === "ADMIN");
              setIsPaid(profile.rank !== "NIVEL_0_EXPLORADOR");
            } else {
              console.warn(
                "⚠️ [AUTH_CONTEXT] Fallo en sincronización de perfil DB.",
              );
            }
          } catch (err: unknown) {
            console.error(
              "🛑 [AUTH_CONTEXT] Error crítico de sincronización:",
              err,
            );
          }
        } else {
          document.cookie =
            "ear_auth_signal=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
          setIsAdmin(false);
          setIsPaid(false);
        }

        setLoading(false);
      },
    );
    return (): void => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      console.error("GÉNESIS_AUTH_FAILURE:", error);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isPaid, loading, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);