import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  resolveVerticalFromHost,
  isPathAllowedForVertical,
  checkVerticalCircuitBreaker,
} from '@/lib/domains/sovereign-domain-registry';

/**
 * EAR OS Edge Middleware (S-Class)
 * - P0: Aislamiento y enrutamiento Multi-Dominio (W49_T02)
 *   Inyecta x-ear-vertical y x-ear-vertical-name, valida rutas permitidas por vertical
 *   y gestiona el circuit-breaker independiente sin tumbar el resto del ecosistema.
 * - P0: Blindaje del shell de administración (/admin/:path* y /command-center)
 *   verificando la session cookie (Firebase __session o ear_admin_token + ear_role).
 * - Atribución de afiliados (Split 80/10/10): /f/[code] y ?ref=[code].
 */
const ADMIN_PATHS: readonly string[] = ['/admin', '/command-center'];
const FIREBASE_SESSION_COOKIE = '__session';
const EAR_ADMIN_TOKEN_COOKIE = 'ear_admin_token';
const EAR_ROLE_COOKIE = 'ear_role';
const AFFILIATE_COOKIE = 'ear_affiliate_code';

const AFFILIATE_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 días de atribución
};

function isProtectedAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function hasValidAdminSession(request: NextRequest): boolean {
  const firebaseSession = request.cookies.get(FIREBASE_SESSION_COOKIE)?.value;
  if (firebaseSession) {
    return true;
  }

  const token = request.cookies.get(EAR_ADMIN_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(EAR_ROLE_COOKIE)?.value;
  return Boolean(token) && (role === 'admin' || role === 'editor');
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;

  // 1. Resolución de la unidad de negocio soberana por Host (W49_T02)
  const vertical = resolveVerticalFromHost(rawHost);

  // 2. Circuit-Breaker por vertical (aislamiento de fallos)
  const circuit = checkVerticalCircuitBreaker(vertical);
  if (!circuit.operational && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/admin')) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Mantenimiento · ${vertical.name}</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="background:#050507;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;box-sizing:border-box;"><div style="max-width:540px;text-align:center;padding:32px;background:#09090d;border:1px solid rgba(255,255,255,0.1);border-radius:24px;"><h1 style="color:${vertical.themeAccent};font-size:22px;margin-bottom:12px;">${vertical.name}</h1><p style="color:#aaa;font-size:14px;line-height:1.6;margin-bottom:24px;">${circuit.notice || vertical.maintenanceNotice}</p><a href="https://wa.me/34693693048" style="display:inline-block;padding:12px 24px;background:${vertical.themeAccent};color:#000;font-weight:bold;text-decoration:none;border-radius:12px;font-size:13px;">Contactar por WhatsApp (${vertical.conciergePhone})</a></div></body></html>`,
      {
        status: 503,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-ear-vertical': vertical.id,
          'x-ear-vertical-status': 'maintenance',
          'retry-after': '300',
        },
      }
    );
  }

  // 3. Aislamiento de rutas por vertical (un visitante de fincasparaboda no entra en /vimume)
  if (!isPathAllowedForVertical(vertical, url.pathname)) {
    const redirectTarget = new URL(vertical.defaultHomePath, request.url);
    const response = NextResponse.redirect(redirectTarget);
    response.headers.set('x-ear-vertical', vertical.id);
    response.headers.set('x-ear-vertical-redirected', 'route-not-allowed-in-vertical');
    return response;
  }

  // Inyectar cabeceras de verticalidad en la petición aguas abajo
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ear-vertical', vertical.id);
  requestHeaders.set('x-ear-vertical-name', vertical.name);

  // 4. Panel de administración y command-center blindados contra accesos sin sesión.
  if (isProtectedAdminPath(url.pathname)) {
    if (!hasValidAdminSession(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', `${url.pathname}${url.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Interceptar URLs de referidos / afiliados (ej. productoraear.com/f/MIRAFLORES)
  if (url.pathname.startsWith('/f/')) {
    const affiliateCode = url.pathname.replace('/f/', '').toUpperCase();

    const redirectUrl = new URL(`/bodas?aff=${affiliateCode}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);
    response.headers.set('x-ear-vertical', vertical.id);

    return response;
  }

  // 6. Interceptar links directos de fincas (/fincas/[slug]?ref=[code])
  if (url.searchParams.has('ref')) {
    const affiliateCode = url.searchParams.get('ref')!.toUpperCase();
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);
    response.headers.set('x-ear-vertical', vertical.id);

    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-ear-vertical', vertical.id);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};