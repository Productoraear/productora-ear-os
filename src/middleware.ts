import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🛡️ MIDDLEWARE OMEGA V133 - EAR OS GOLD
 * Protocolo de Seguridad S-Class + Geo-Dominancia Predictiva.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. BYPASS DE RUTAS PÚBLICAS (Soberanía de Acceso)
  const publicRoutes = ['/', '/the-signal', '/artistas', '/eventos', '/bodas', '/arsenal', '/business', '/social', '/login', '/vimume'];
  
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  const isStatic = pathname.startsWith('/_next') || 
                   (pathname.startsWith('/api') && !pathname.startsWith('/api/admin')) || 
                   pathname.includes('favicon.ico') ||
                   pathname.includes('.');

  if (isPublic || isStatic) {
    const response = NextResponse.next();
    // Inyectar Geo-Data para el Neural Canvas
    const city = (request as any).geo?.city || 'Valencia';
    const country = (request as any).geo?.country || 'ES';
    response.headers.set('x-ear-geo-city', encodeURIComponent(city));
    response.headers.set('x-ear-geo-country', country);
    return response;
  }

  // 2. VALIDACIÓN ESTRICTA PARA NÚCLEO DATA (Admin, Nexus & Dashboard)
  const isSovereign = request.cookies.has('ear_os_auth_token') || request.cookies.has('sb-access-token');
  const isProtected = pathname.startsWith('/admin') || 
                       pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/portal') || 
                       pathname.startsWith('/nexus') ||
                       pathname.startsWith('/api/admin');

  if (isProtected && !isSovereign) {
    console.warn(`🛡️ [NEXUS SHIELD] Acceso denegado a ${pathname}. Redirigiendo a /login.`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const city = (request as any).geo?.city || 'Valencia';
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
