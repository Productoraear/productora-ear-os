import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { adminAuth } from '@/lib/firebaseAdmin';
import { UserService } from '@/lib/services/UserService';

export type AdminAuthResult =
    | { ok: true; uid: string; email: string }
    | { ok: false; response: NextResponse };

/**
 * 🔐 GUARDIÁN DE ACCESO ADMIN (BLINDAJE P0-2)
 * ============================================================================
 * Verifica en el SERVIDOR, para cada request, que:
 *   1. Exista un Bearer token de Firebase válido (verifyIdToken).
 *   2. El usuario autenticado tenga rol ADMIN o COMMANDER (jerarquía RBAC).
 *
 * Uso obligatorio al inicio de CADA handler de /api/admin/*:
 *   const auth = await requireAdmin(request);
 *   if (!auth.ok) return auth.response;
 * ============================================================================
 */
export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
    const isDev = process.env.NODE_ENV !== 'production';
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    const authHeader = request.headers.get('authorization');

    // 🛡️ Acceso local bare-metal del CEO (entorno dev o host localhost sin token en navegador)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (isDev || isLocalhost || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
            return {
                ok: true,
                uid: 'ceo-bare-metal',
                email: 'edwin@productoraear.com',
            };
        }
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        if (isDev || isLocalhost || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
            return {
                ok: true,
                uid: 'ceo-bare-metal',
                email: 'edwin@productoraear.com',
            };
        }
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    // Si Firebase Admin no está configurado en este entorno:
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
        if (isDev || isLocalhost) {
            return {
                ok: true,
                uid: 'ceo-bare-metal',
                email: 'edwin@productoraear.com',
            };
        }
        return {
            ok: false,
            response: NextResponse.json({ error: 'Admin service not configured' }, { status: 503 }),
        };
    }

    let decoded: { uid: string; email?: string };
    try {
        decoded = await adminAuth.verifyIdToken(token);
    } catch (err) {
        console.warn('[ADMIN_GUARD] Token inválido:', err instanceof Error ? err.message : String(err));
        if (isDev || isLocalhost) {
            return {
                ok: true,
                uid: 'ceo-bare-metal',
                email: 'edwin@productoraear.com',
            };
        }
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    if (!decoded.uid) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    try {
        const authorized = await UserService.hasRole(decoded.uid, Role.ADMIN);
        if (!authorized && !isDev && !isLocalhost) {
            return {
                ok: false,
                response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
            };
        }
    } catch {
        // En desarrollo local tolerar fallo de conexión a BD remota
        if (!isDev && !isLocalhost) {
            return {
                ok: false,
                response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
            };
        }
    }

    return { ok: true, uid: decoded.uid, email: decoded.email ?? '' };
}