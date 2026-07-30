import { NextResponse } from 'next/server';
/**
 * 🛡️ MIDDLEWARE OMEGA V134 - VIMUME OS
 * Protocolo de Seguridad S-Class + Geo-Dominancia Predictiva.
 */
export default function proxy(request) {
    const { pathname } = request.nextUrl;
    // 1. BYPASS DE RUTAS PÚBLICAS (Soberanía de Acceso)
    const publicRoutes = ['/', '/the-signal', '/artistas', '/eventos', '/bodas', '/arsenal', '/business', '/social', '/login', '/vimume', '/blog', '/contacto'];
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    const isStatic = pathname.startsWith('/_next') ||
        (pathname.startsWith('/api') && !pathname.startsWith('/api/admin')) ||
        pathname.includes('favicon.ico') ||
        pathname.includes('.');
    if (isPublic || isStatic) {
        const response = NextResponse.next();
        // Inyectar Geo-Data para el Neural Canvas
        const city = request.geo?.city || 'Valencia';
        const country = request.geo?.country || 'ES';
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
        pathname.startsWith('/studio/artist') ||
        pathname.startsWith('/api/admin');
    if (isProtected && !isSovereign) {
        console.warn(`🛡️ [NEXUS SHIELD] Acceso denegado a ${pathname}. Redirigiendo a /login.`);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }
    // 3. ROLE VALIDATION FOR TALENT STUDIO
    if (pathname.startsWith('/studio/artist')) {
        const token = request.cookies.get('sb-access-token')?.value || request.cookies.get('ear_os_auth_token')?.value;
        if (token) {
            try {
                // Decodificación básica del JWT para extraer el rol en el Edge Runtime
                const payloadBase64 = token.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64));
                const userRole = payload.role || payload.user_metadata?.role;
                if (userRole !== 'ARTIST' && userRole !== 'COMMANDER' && userRole !== 'ADMIN') {
                    console.warn(`🛡️ [TALENT OS VETO] Rol ${userRole} insuficiente para ${pathname}.`);
                    return NextResponse.redirect(new URL('/the-signal', request.url));
                }
            }
            catch (e) {
                console.error("❌ [AUTH ERROR] Error decodificando token en middleware:", e);
            }
        }
    }
    const response = NextResponse.next();
    const city = request.geo?.city || 'Valencia';
    const country = request.geo?.country || 'ES';
    response.headers.set('x-ear-geo-city', encodeURIComponent(city));
    response.headers.set('x-ear-geo-country', country);
    return response;
}
export { proxy, proxy as middleware };
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
