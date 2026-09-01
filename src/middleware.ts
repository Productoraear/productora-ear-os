import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.get('ear_session')?.value;
  const hasToken = request.cookies.get('ear_admin_token')?.value;
  const role = request.cookies.get('ear_role')?.value;

  const isDev = process.env.NODE_ENV === 'development' || request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';

  // Rutas administrativas protegidas (en localhost/dev se auto-permite para máxima agilidad operativa)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/vampire-view')) {
    if (!isDev && (!hasSession || !hasToken)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return redirectResponse;
    }
  }

  // Restricción de rutas súper-soberanas exclusivamente para Administrador CEO
  if ((pathname.startsWith('/admin/brain') || pathname.startsWith('/admin/mapear')) && role === 'editor') {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url));
    return redirectResponse;
  }

  const response = NextResponse.next();

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
