import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Whitelist de endpoints transaccionales públicos que no deben ser bloqueados
const PUBLIC_API_WHITELIST = [
  '/api/astra/payment-intent',
  '/api/stripe/webhook',
  '/api/quote',
  '/api/chat/concierge'
];

// ── ENRUTAMIENTO MULTI-TENANT EDGE (Portafolio Hostinger) ──────────────────────
// Rewrite transparente: preserva la barra de direcciones del navegador y el
// aislamiento de sesiones/Stripe. Solo actúa sobre la raíz '/' de cada dominio.
interface TenantRoute {
  match: (host: string) => boolean;
  target: string;
}

const TENANT_ROUTES: TenantRoute[] = [
  { match: (host) => host.includes('fincasparaboda.com'), target: '/fincas' },
  { match: (host) => host.includes('viajemusicalporlamemoria.com'), target: '/vimume' },
  { match: (host) => host.includes('artistaseuropa.com'), target: '/artistas' },
  { match: (host) => host.includes('mariachis'), target: '/simulacion-mariachis' }
];

function resolveTenantRewrite(host: string, pathname: string): string | null {
  if (pathname !== '/') return null;
  const route = TENANT_ROUTES.find((r) => r.match(host));
  return route ? route.target : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? request.nextUrl.hostname;


  const hasSession = request.cookies.get('ear_session')?.value;
  const hasToken = request.cookies.get('ear_admin_token')?.value;
  const role = request.cookies.get('ear_role')?.value;

  const isDev = process.env.NODE_ENV === 'development' || 
                request.nextUrl.hostname === 'localhost' || 
                request.nextUrl.hostname === '127.0.0.1';

  // 1. BLINDAJE DATA LAKE & RUTAS ADMIN (/admin/:path*)
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
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. PROTECCIÓN ANTI-SCRAPING API PRIVADA (/api/:path*)
  if (pathname.startsWith('/api/')) {
    const isPublic = PUBLIC_API_WHITELIST.some(route => pathname.startsWith(route));
    if (!isPublic && !isDev) {
      const userAgent = request.headers.get('user-agent') || '';
      const isScraper = /python|curl|wget|scrapy|httpclient|postman/i.test(userAgent);
      if (isScraper) {
        return new NextResponse(
          JSON.stringify({ error: 'Access Denied: Automated scraping prohibited' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 3. ENRUTAMIENTO MULTI-TENANT EDGE (Portafolio Hostinger)
  // Rewrite transparente de la raíz '/' según el dominio entrante.
  // Preserva /api/*, _next/*, favicon y los guards de /admin/* (ya resueltos arriba).
  const tenantTarget = resolveTenantRewrite(host, pathname);
  const response = tenantTarget
    ? NextResponse.rewrite(new URL(tenantTarget, request.url))
    : NextResponse.next();


  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');

  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/api/:path*',
    '/reservar/:path*',
    '/vimume/:path*'
  ],
};

