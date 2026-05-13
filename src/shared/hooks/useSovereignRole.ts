'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/services/auth_nexus';

export type SovereignRole = 'ROLE_B2G' | 'ROLE_B2B' | 'ROLE_B2C' | 'ROLE_ADMIN' | 'ROLE_GUEST';

/**
 * 🕵️‍♂️ USE SOVEREIGN ROLE - INTENT DETECTION ENGINE
 * Detecta la intención del usuario basándose en la ruta y la sesión.
 */
export function useSovereignRole() {
  const pathname = usePathname();
  const [role, setRole] = useState<SovereignRole>('ROLE_GUEST');

  useEffect(() => {
    const detectRole = () => {
      // 1. Detección por Ruta (Hard Intent)
      if (pathname.startsWith('/vimume') || pathname.startsWith('/clinica')) {
        return 'ROLE_B2G';
      }
      if (pathname.startsWith('/nexus') || pathname.startsWith('/artistas')) {
        return 'ROLE_B2B';
      }
      if (pathname.startsWith('/eventos') || pathname.startsWith('/marketplace')) {
        return 'ROLE_B2C';
      }
      if (pathname.startsWith('/dashboard')) {
        return 'ROLE_ADMIN';
      }

      // 2. Detección por Sesión (Si no hay ruta específica)
      const user = auth.currentUser;
      if (user) {
        // Lógica de claims personalizada o email de administración
        if (user.email?.endsWith('@productoraear.com')) {
          return 'ROLE_ADMIN';
        }
        return 'ROLE_B2B'; // Default para usuarios registrados (Artistas)
      }

      return 'ROLE_GUEST';
    };

    setRole(detectRole());
  }, [pathname]);

  return {
    role,
    isB2G: role === 'ROLE_B2G',
    isB2B: role === 'ROLE_B2B',
    isB2C: role === 'ROLE_B2C',
    isAdmin: role === 'ROLE_ADMIN',
    isGuest: role === 'ROLE_GUEST'
  };
}
