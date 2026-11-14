import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from '@prisma/client';
import { adminAuth } from '@/lib/firebaseAdmin';
import { UserService } from '@/lib/services/UserService';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🔐 POST /api/auth/session — SINGLE SIGN-ON SOBERANO (RBAC)
 * ============================================================================
 * Autenticación centralizada conforme a la directiva de Arquitectura Soberana:
 *   1. Recibe el Firebase ID Token vía Authorization: Bearer <token>.
 *   2. Verifica el token con Firebase Admin.
 *   3. Obtiene el rol en base de datos PostgreSQL (UserService / Prisma).
 *   4. Fija la cookie de sesión HttpOnly `__session` y la cookie `ear_role`.
 *   5. Devuelve la URL de redirección canónica según el rol:
 *      - ADMIN / COMMANDER / ARQUITECTO -> /admin/control
 *      - ARTIST -> /portal/artista
 *      - PROVIDER -> /proveedores/dashboard
 *      - Otros -> /
 * ============================================================================
 */

const FIREBASE_SESSION_COOKIE = '__session';
const EAR_ADMIN_TOKEN_COOKIE = 'ear_admin_token';
const EAR_ROLE_COOKIE = 'ear_role';
const SESSION_MAX_AGE_SECONDS = 3600 * 24; // 24 horas

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

function resolveRedirectPath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
    case Role.COMMANDER:
    case Role.ARQUITECTO:
      return '/admin/control';
    case Role.ARTIST:
      return '/portal/artista';
    case Role.PROVIDER:
      return '/proveedores/dashboard';
    default:
      return '/portal/artista'; // Por defecto para cuentas autenticadas de creadores
  }
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
      '[AUTH_SESSION] Token inválido:',
      err instanceof Error ? err.message : String(err)
    );
    return jsonResponse({ ok: false, error: 'Unauthorized: Invalid token' }, 401);
  }

  if (!decoded.uid) {
    return jsonResponse({ ok: false, error: 'Unauthorized: No UID in token' }, 401);
  }

  // Lookup del usuario en PostgreSQL
  let user = await prisma.user.findFirst({
    where: { OR: [{ id: decoded.uid }, { firebaseUid: decoded.uid }] },
    select: { id: true, role: true, email: true }
  });

  if (!user && decoded.email) {
    // Si no existe, lo crea o sincroniza mediante UserService
    const profile = await UserService.getOrCreateProfile(decoded.uid, decoded.email);
    if (profile) {
      user = { id: profile.id, role: profile.role, email: profile.email };
    }
  }

  const userRole = user?.role || Role.EXPLORADOR;
  const redirectUrl = resolveRedirectPath(userRole);
  const secure = isProduction();

  const response = jsonResponse({
    ok: true,
    uid: decoded.uid,
    role: userRole.toLowerCase(),
    redirectUrl
  });

  // Cookie HttpOnly segura
  response.cookies.set(FIREBASE_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  // Marca de rol para el middleware Edge
  const effectiveEdgeRole = ([Role.ADMIN, Role.COMMANDER, Role.ARQUITECTO] as Role[]).includes(userRole)
    ? 'admin'
    : userRole.toLowerCase();

  response.cookies.set(EAR_ROLE_COOKIE, effectiveEdgeRole, {
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

