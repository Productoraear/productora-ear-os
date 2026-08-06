import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/nexus/:path*',
    '/admin/:path*',
    '/vault/:path*',
    '/artist/:path*',
  ],
};

/**
 * 🛡️ EDGE UX PRE-FILTER MIDDLEWARE
 * Previene el parpadeo de UI privada comprobando la señal ligera `ear_auth_signal`.
 * NOTA: La seguridad autoritativa de roles y datos reside 100% en el servidor
 * mediante validación JWT de Firebase Admin en /api/nexus/user/sync.
 */
export function middleware(request: NextRequest) {
  const signalCookie = request.cookies.get('ear_auth_signal');

  if (!signalCookie || !signalCookie.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
