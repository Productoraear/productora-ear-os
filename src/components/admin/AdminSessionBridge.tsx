'use client';

import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * 🌉 ADMIN SESSION BRIDGE (BLINDAJE P0 — W41_T03)
 * ============================================================================
 * El ID token de Firebase caduca (1 h por defecto) mientras que el middleware
 * de Edge trabaja con cookies. Este bridge, montado UNA sola vez en el shell
 * administrativo, mantiene ambos mundos sincronizados:
 *   · Usuario presente → POST /api/admin/session (emite __session + ear_role).
 *   · Usuario ausente → DELETE /api/admin/session (limpia la sesión).
 *
 * No pinta DOM: solo telemetría de sesión en segundo plano. Si Firebase no está
 * configurado (entorno local sin credenciales) no rompe el render.
 * ============================================================================
 */
export function AdminSessionBridge(): ReactElement | null {
    useEffect(() => {
        const firebaseAuth = auth as Auth | null;
        if (!firebaseAuth) return;

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            try {
                if (!user) {
                    await fetch('/api/admin/session', {
                        method: 'DELETE',
                        cache: 'no-store',
                    });
                    return;
                }

                const token = await user.getIdToken();
                await fetch('/api/admin/session', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
            } catch (err) {
                console.warn(
                    '[ADMIN_SESSION_BRIDGE] No se pudo sincronizar la sesión:',
                    err instanceof Error ? err.message : String(err)
                );
            }
        });

        return () => unsubscribe();
    }, []);

    return null;
}

export default AdminSessionBridge;
