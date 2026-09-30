import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * EAR OS Edge Middleware (S-Class)
 * Intercepta rutas de Fincas Afiliadas (/finca/[slug] o /f/[affiliateCode])
 * Inyecta la cookie inmutable 'ear_affiliate_code' para el Split 80/10/10 
 * y redirige a la landing page canónica.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Interceptar URLs de referidos / afiliados (ej. productoraear.com/f/MIRAFLORES)
  if (url.pathname.startsWith('/f/')) {
    const affiliateCode = url.pathname.replace('/f/', '').toUpperCase();
    
    // Redirigimos a la home o a la landing de bodas con el parámetro de afiliado
    const redirectUrl = new URL(`/bodas?aff=${affiliateCode}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Inyectar cookie inmutable para que Stripe Metadata la capture en el Checkout
    response.cookies.set('ear_affiliate_code', affiliateCode, {
      httpOnly: false, // Permitimos que el cliente (Checkout) lo lea para el Stripe Metadata
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días de persistencia de atribución
    });

    return response;
  }

  // Interceptar links directos de fincas (/fincas/[slug]?ref=[code])
  if (url.searchParams.has('ref')) {
    const affiliateCode = url.searchParams.get('ref')!.toUpperCase();
    const response = NextResponse.next();
    
    response.cookies.set('ear_affiliate_code', affiliateCode, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    
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
