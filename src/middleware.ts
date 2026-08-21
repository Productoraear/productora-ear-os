import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.get('ear_session')?.value;
  const hasToken = request.cookies.get('ear_admin_token')?.value;

  // Si intenta acceder a rutas protegidas sin cookies válidas
  if (pathname.startsWith('/admin') && (!hasSession || !hasToken)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Evitar que guarde en caché la redirección
    redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return redirectResponse;
  }

  const response = NextResponse.next();

  // Desactivar caché HTTP en todo el panel /admin para neutralizar el botón 'Atrás'
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*']
};
