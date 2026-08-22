import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncSClassAuth } from '@/lib/services/auth_nexus';
import { User as FirebaseUser } from 'firebase/auth';

// LISTA BLANCA DE LA DINASTÍA (Soberanía)
const SOVEREIGN_DYNASTY = [
    'productoraear@gmail.com',
    'edwin.agudelo@productoraear.com',
    'luz.adriana@productoraear.com',
    'leire.naiara@productoraear.com'
];

interface AuthUser {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    role: 'SOVEREIGN' | 'CIVILIAN' | 'GUEST';
    loading: boolean;
    login: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    role: 'GUEST', 
    loading: true, 
    login: () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [role, setRole] = useState<'SOVEREIGN' | 'CIVILIAN' | 'GUEST'>('GUEST');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ACTIVACIÓN DEL NEXO: Sincronización automática Firebase -> Supabase
        const unsubscribe = syncSClassAuth((firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const isSovereign = SOVEREIGN_DYNASTY.some(email => 
                    firebaseUser.email?.toLowerCase().includes(email.split('@')[0])
                );
                
                setUser({
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                });
                setRole(isSovereign ? 'SOVEREIGN' : 'CIVILIAN');
            } else {
                setUser(null);
                setRole('GUEST');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = () => {
        // En producción redirigiría a login, aquí mantenemos el mock de acceso
        console.warn('🔒 [AUTH] Intento de login interceptado por el Nexus.');
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
