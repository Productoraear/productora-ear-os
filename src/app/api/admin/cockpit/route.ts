import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAdminCockpitSnapshot } from '@/lib/admin/cockpit-aggregator';

/**
 * SEC-2 · Matriz de autorización
 *   role  : admin (solo sesión admin válida)
 *   tenant: ear-os
 * La autorización se comprueba en el servidor, nunca en el cliente (SEC-1).
 */

export const dynamic = 'force-dynamic';

const FIREBASE_SESSION_COOKIE = '__session';
const EAR_ADMIN_TOKEN_COOKIE = 'ear_admin_token';
const EAR_ROLE_COOKIE = 'ear_role';

/**
 * Réplica fiel de `hasValidAdminSession` de `src/middleware.ts`.
 * El matcher del middleware excluye `/api`, por eso esta ruta se cierra a sí misma.
 */
function hasValidAdminSession(request: NextRequest): boolean {
  const firebaseSession = request.cookies.get(FIREBASE_SESSION_COOKIE)?.value;
  if (firebaseSession) return true;

  const token = request.cookies.get(EAR_ADMIN_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(EAR_ROLE_COOKIE)?.value;
  return Boolean(token) && (role === 'admin' || role === 'editor');
}

export async function GET(request: NextRequest) {
  // SEC-1 · La ruta nace cerrada: el caso negativo se escribe antes del camino feliz.
  if (!hasValidAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Fail-closed sin base de datos configurada (el esquema usa POSTGRES_PRISMA_URL).
  if (!process.env.POSTGRES_PRISMA_URL) {
    return NextResponse.json({ ok: false, error: 'database_not_configured' }, { status: 503 });
  }

  const snapshot = await buildAdminCockpitSnapshot();

  // AF-1 / AF-5 · Si la sonda no pudo ejecutarse, jamás devolvemos OK.
  if (!snapshot.probed) {
    return NextResponse.json(
      { ok: false, error: 'database_unavailable', data: { dbFailure: snapshot.dbFailure } },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: true, data: snapshot },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
