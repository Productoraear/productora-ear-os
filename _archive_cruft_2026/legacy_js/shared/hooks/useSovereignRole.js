'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/services/auth_nexus';
/**
 * 🕵️‍♂️ USE SOVEREIGN ROLE - INTENT DETECTION ENGINE
 * Detecta la intención del usuario basándose en la ruta y la sesión.
 */
export function useSovereignRole() {
    const pathname = usePathname();
    const [role, setRole] = useState('ROLE_GUEST');
    useEffect(() => {
        const detectRole = () => {
            // 1. Detección por Ruta (Hard Intent)
            if (pathname.startsWith('/admin'))
                return 'ROLE_ADMIN';
            if (pathname.startsWith('/panel/artista'))
                return 'ROLE_ARTIST';
            if (pathname.startsWith('/panel/proveedor'))
                return 'ROLE_PROVIDER';
            if (pathname.startsWith('/panel/afiliado'))
                return 'ROLE_AFFILIATE';
            if (pathname.startsWith('/panel/cliente'))
                return 'ROLE_CLIENT';
            // VIMUME & Institucional -> B2G Context
            if (pathname.startsWith('/vimume') || pathname.startsWith('/proyectos/vimume'))
                return 'ROLE_B2G';
            // Eventos Corporativos -> B2B
            if (pathname.startsWith('/eventos') || pathname.startsWith('/empresarios'))
                return 'ROLE_B2B';
            // 2. Detección por Sesión
            const user = auth.currentUser;
            if (user) {
                if (user.email?.endsWith('@productoraear.com'))
                    return 'ROLE_ADMIN';
                return 'ROLE_CLIENT';
            }
            return 'ROLE_GUEST';
        };
        setRole(detectRole());
    }, [pathname]);
    return {
        role,
        isAdmin: role === 'ROLE_ADMIN',
        isArtist: role === 'ROLE_ARTIST',
        isProvider: role === 'ROLE_PROVIDER',
        isAffiliate: role === 'ROLE_AFFILIATE',
        isClient: role === 'ROLE_CLIENT',
        isGuest: role === 'ROLE_GUEST',
        isB2G: role === 'ROLE_B2G',
        isB2B: role === 'ROLE_B2B',
        isB2C: role === 'ROLE_B2C'
    };
}
