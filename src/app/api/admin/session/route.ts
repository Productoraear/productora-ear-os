import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from '@prisma/client';
import { adminAuth } from '@/lib/firebaseAdmin';
import { UserService } from '@/lib/services/UserService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🔐 PUENTE DE SESIÓN ADMIN (BLINDAJE P0 — W41_T03)
 * ============================================================================
 * El middleware de Edge (`src/middleware.ts`) exige, para entrar en /admin y
 * /command-center, una de estas dos pruebas de sesión:
 *   1. `__session` presente  ·  2. `ear_admin_token` + `ear_role` ∈ {admin, editor}
 *
 * Este endpoint EMITE y LIMPIA esas cookies. Regla de oro: la cookie SOLO se
 * emite después de verificar de verdad el ID token de Firebase (verifyIdToken)
 * y el rol RBAC (UserService.hasRole → jerarquía ADMIN/COMMANDER). Nunca se
 * emite a ciegas: una cookie sin verificar convertiría el panel en fachada.
 *
 * POST   → verifica token + rol y fija __session (HttpOnly) y ear_role.
 * DELETE → limpia __session, ear_admin_token (legado) y ear_role.
 * GET    → estado de sesión (no revela el token).
 * ============================================================================
 */

const FIREBASE_SESSION_COOKIE = '__session';
const EAR_ADMIN_TOKEN_COOKIE = 'ear_admin_token';
const EAR_ROLE_COOKIE = 'ear_role';
const SESSION_MAX_AGE_SECONDS = 3600;

const NO_STORE_HEADERS: Record<string, string> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
};

function jsonResponse(body: unknown, status = 200): NextResponse {
    return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
        return jsonResponse({ ok: false, error: 'Unauthorized: Missing token' }, 401);
    }

    if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
        return jsonResponse({ ok: false, error: 'System Error: Admin service not configured' }, 503);
    }

    let decoded: { uid: string; email?: string };
    try {
        decoded = await adminAuth.verifyIdToken(token);
    } catch (err) {
        console.warn(
            '[ADMIN_SESSION] Token inválido:',
            err instanceof Error ? err.message : String(err)
        );
        return jsonResponse({ ok: false, error: 'Unauthorized: Invalid token' }, 401);
    }

    if (!decoded.uid) {
        return jsonResponse({ ok: false, error: 'Unauthorized: No UID in token' }, 401);
    }

    let authorized: boolean;
    try {
        authorized = await UserService.hasRole(decoded.uid, Role.ADMIN);
    } catch (err) {
        console.error('[ADMIN_SESSION] Error checking role:', err);
        return jsonResponse({ ok: false, error: 'System Error: Role check failed' }, 500);
    }

    if (!authorized) {
        return jsonResponse({ ok: false, error: 'Forbidden: Requires ADMIN role' }, 403);
    }

    const secure = isProduction();
    const response = jsonResponse({ ok: true, uid: decoded.uid, role: 'admin' });

    // Cookie de sesión opaca para el cliente: el token nunca es legible por JS.
    response.cookies.set(FIREBASE_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    });

    // Marca de rol legible por el shell (el middleware la compara con admin/editor).
    response.cookies.set(EAR_ROLE_COOKIE, 'admin', {
        httpOnly: false,
        sameSite: 'lax',
        secure,
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
}

export async function DELETE(): Promise<NextResponse> {
    const secure = isProduction();
    const response = jsonResponse({ ok: true });

    for (const name of [FIREBASE_SESSION_COOKIE, EAR_ADMIN_TOKEN_COOKIE, EAR_ROLE_COOKIE]) {
        response.cookies.set(name, '', {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
            maxAge: 0,
        });
    }

    return response;
}

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();
    const session = cookieStore.get(FIREBASE_SESSION_COOKIE)?.value;
    const role = cookieStore.get(EAR_ROLE_COOKIE)?.value;

    return jsonResponse({
        ok: true,
        authenticated: Boolean(session),
        role: role ?? null,
    });
}
