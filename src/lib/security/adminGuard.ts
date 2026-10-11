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
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 }),
        };
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized: Empty token' }, { status: 401 }),
        };
    }

    // Si Firebase Admin no está configurado en producción, es un fallo crítico.
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'System Error: Admin service not configured' }, { status: 503 }),
        };
    }

    let decoded: { uid: string; email?: string };
    try {
        decoded = await adminAuth.verifyIdToken(token);
    } catch (err) {
        console.warn('[ADMIN_GUARD] Token inválido:', err instanceof Error ? err.message : String(err));
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 }),
        };
    }

    if (!decoded.uid) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized: No UID in token' }, { status: 401 }),
        };
    }

    try {
        const authorized = await UserService.hasRole(decoded.uid, Role.ADMIN);
        if (!authorized) {
            return {
                ok: false,
                response: NextResponse.json({ error: 'Forbidden: Requires ADMIN role' }, { status: 403 }),
            };
        }
    } catch (err) {
        console.error('[ADMIN_GUARD] Error checking role:', err);
        return {
            ok: false,
            response: NextResponse.json({ error: 'System Error: Role check failed' }, { status: 500 }),
        };
    }

    return { ok: true, uid: decoded.uid, email: decoded.email ?? '' };
}