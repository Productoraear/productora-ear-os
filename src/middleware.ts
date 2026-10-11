import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * EAR OS Edge Middleware (S-Class)
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

  // P0: Panel de administración y command-center blindados contra accesos sin sesión.
  if (isProtectedAdminPath(url.pathname)) {
    if (!hasValidAdminSession(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', `${url.pathname}${url.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Interceptar URLs de referidos / afiliados (ej. productoraear.com/f/MIRAFLORES)
  if (url.pathname.startsWith('/f/')) {
    const affiliateCode = url.pathname.replace('/f/', '').toUpperCase();

    const redirectUrl = new URL(`/bodas?aff=${affiliateCode}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);

    return response;
  }

  // Interceptar links directos de fincas (/fincas/[slug]?ref=[code])
  if (url.searchParams.has('ref')) {
    const affiliateCode = url.searchParams.get('ref')!.toUpperCase();
    const response = NextResponse.next();

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);

    return response;
  }

  return NextResponse.next();
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