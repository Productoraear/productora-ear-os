import os

print("🛡️ INSTALANDO PROTOCOLO DE CIERRE DE SESIÓN MILITAR Y ANTI-BFCACHE...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. CREAR ENDPOINT DEDICADO DE LOGOUT (/api/auth/logout/route.ts)
logout_dir = os.path.join(base_dir, "src", "app", "api", "auth", "logout")
os.makedirs(logout_dir, exist_ok=True)

logout_code = """import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Sesión Soberana destruida y purgada con éxito.' 
  });

  // Expiración atómica de todas las cookies administrativas
  const expiredOpts = {
    httpOnly: false,
    path: '/',
    expires: new Date(0), // Expiración inmediata (1970)
    maxAge: 0
  };

  response.cookies.set('ear_session', '', expiredOpts);
  response.cookies.set('ear_admin_token', '', expiredOpts);
  response.cookies.set('ear_role', '', expiredOpts);

  // Inyección de cabeceras para forzar la purga del caché en el navegador
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}
"""

with open(os.path.join(logout_dir, "route.ts"), "w", encoding="utf-8") as f:
    f.write(logout_code)

print("✅ Endpoint /api/auth/logout instalado.")

# 2. ACTUALIZAR MIDDLEWARE CON BLINDAJE NO-STORE PARA RUTAS ADMIN
middleware_path = os.path.join(base_dir, "src", "middleware.ts")

middleware_code = """import { NextResponse } from 'next/server';
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
"""

with open(middleware_path, "w", encoding="utf-8") as f:
    f.write(middleware_code)

print("✅ Middleware actualizado: Bloqueado el botón 'Atrás' mediante No-Store HTTP Headers.")
