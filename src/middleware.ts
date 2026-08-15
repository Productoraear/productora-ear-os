import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🛡️ MIDDLEWARE OMEGA — EAR OS GOLD (MVP-P1-01B)
 * Protocolo de Seguridad S-Class + Prefiltro Perimetral Edge.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rutas protegidas que requieren señal de autenticación
  const isProtected = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/nexus') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/vault') ||
    pathname.startsWith('/artist') ||
    pathname.startsWith('/studio');

  // 2. Comprobación de señal de sesión (Firebase client signal / Sovereign cookies)
  const hasAuthSignal = 
    request.cookies.has('ear_auth_signal') ||
    request.cookies.has('ear_os_auth_token') ||
    request.cookies.has('sb-access-token');

  if (isProtected && !hasAuthSignal) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const city = (request as any).geo?.city || 'Madrid';
  const country = (request as any).geo?.country || 'ES';
  response.headers.set('x-ear-geo-city', encodeURIComponent(city));
  response.headers.set('x-ear-geo-country', country);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
