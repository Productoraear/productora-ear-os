import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  resolveVerticalFromHost,
  isPathAllowedForVertical,
  checkVerticalCircuitBreaker,
} from '@/lib/domains/sovereign-domain-registry';

/**
 * EAR OS Edge Middleware (S-Class)
 * - P0: Aislamiento y enrutamiento Multi-Dominio (W49_T02)
 *   Inyecta x-ear-vertical y x-ear-vertical-name, valida rutas permitidas por vertical
 *   y gestiona el circuit-breaker independiente sin tumbar el resto del ecosistema.
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

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ROUTE-GATING · DARK LAUNCHING (SUELO DE MARMOL)
 * ════════════════════════════════════════════════════════════════════════════
 * Lista blanca de rutas certificadas para clientes e inversores. Cualquier
 * ruta en taller que NO figure aquí se repliega con 307 a `/celebraciones`
 * (o a `/` si la propia ruta de destino no fuese certificada): cero 404
 * visibles, cero páginas a medio construir expuestas en producción.
 *
 * INVARIANTES:
 *   · El gating es FAIL-OPEN SOLO para `/api`, `/_next`, assets y `/admin`:
 *     el escaparate se blinda, la telemetría y el back-office no se rompen.
 *   · Las rutas certificadas se comparan por PREFIJO SEGMENTADO
 *     (`/presupuesto/x` cuenta como `/presupuesto`), nunca por `startsWith`
 *     crudo — de lo contrario `/presupuesto-oculto` colaría.
 *   · `307` (no 301): preserva método y cuerpo, y no se cachea como permanente
 *     mientras la ruta siga en taller.
 * ════════════════════════════════════════════════════════════════════════════
 */
const CERTIFIED_PRODUCTION_ROUTES: readonly string[] = Object.freeze([
  '/',
  '/artistas',
  '/mariachis', // Added
  '/reservar/solista', // Added
  '/otzarreta',
  '/calendario',
  '/gobiernos',
  '/celebraciones',
  '/profesionales',
  '/restaurante-otzarreta',
  // `/restaurante-otzarreta` es un alias que hace `redirect('/otzarreta')`
  // (src/app/(public)/restaurante-otzarreta/page.tsx). Sin certificar el
  // destino, el viaje era alias → /otzarreta → GATE → /celebraciones: la ficha
  // insignia del asador NUNCA llegaba a un cliente real (medido en producción
  // el 2026-11-21). Se certifica el destino para que el alias aterrice en la ficha.
  '/proveedores',
  '/fincas',
  '/seating-planner',
  '/presupuesto',
  '/portal/proveedor',
  '/login',
]);

/** Rutas que escapan al gating aunque no estén certificadas (back-office y assets). */
const ROUTE_GATING_BYPASS_PREFIXES: readonly string[] = Object.freeze([
  '/api',
  '/_next',
  '/admin',
  '/command-center',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
]);

function isCertifiedRoute(pathname: string): boolean {
  // La raíz sólo coincide exactamente: `/` como prefijo certificaría todo.
  if (pathname === '/') {
    return true;
  }
  return CERTIFIED_PRODUCTION_ROUTES.some(
    (route) => route !== '/' && (pathname === route || pathname.startsWith(`${route}/`))
  );
}

/**
 * Huellas de las rutas dinámicas certificadas (`/calendario/[kind]/[slug]`).
 * Se comparan contra la ruta REAL; comparar la plantilla literalmente nunca
 * coincide con una URL viva y dejaría el calendario fuera del gating.
 */
const CERTIFIED_DYNAMIC_ROUTE_PATTERNS: readonly RegExp[] = Object.freeze([
  /^\/calendario\/[^/]+\/[^/]+\/?$/,
]);

function matchesCertifiedDynamicRoute(pathname: string): boolean {
  return CERTIFIED_DYNAMIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * ¿La ruta aterriza en un page.tsx REAL del App Router?
 *
 * Guarda estructural (P0 2026-11-21): `startsWith(prefix)` certificaba también
 * URLs hijas inexistentes (`/proveedores/loquesea`), que el cliente veía como
 * 404 dentro de una superficie que se declara certificada. Se mantiene una
 * lista explícita por razones de coste en Edge (sin fs): sólo los segmentos
 * que existen en disco como páginas públicas y que queremos abrir al cliente.
 */
function isKnownPublicSegment(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return false;
  const [head, second] = segments;
  if (head === 'proveedores') {
    // /proveedores/[slug] (ficha) y /proveedores/dashboard. Nunca rutas de admin.
    return segments.length === 2 && second !== 'dashboard';
  }
  if (head === 'fincas') {
    return segments.length === 2;
  }
  if (head === 'calendario') {
    return matchesCertifiedDynamicRoute(pathname);
  }
  return false;
}

function isRouteGatingBypassed(pathname: string): boolean {
  return ROUTE_GATING_BYPASS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix)
  );
}

function isFileRequest(pathname: string): boolean {
  // Assets estáticos servidos desde /public (logos, imágenes, fuentes).
  return /\.[a-z0-9]{2,5}$/i.test(pathname);
}

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
  const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;

  // 0. CANDADO DE SEGURIDAD SSL (HSTS & HTTPS Enforcement)
  // En producción, forzar redirección 301 inmediata si el tráfico entra sin cifrar (HTTP)
  const proto = request.headers.get('x-forwarded-proto');
  const isLocalhost =
    rawHost.includes('localhost') ||
    rawHost.includes('127.0.0.1') ||
    rawHost.includes(':3007') ||
    rawHost.startsWith('82.29.179.172:8000');
  if (proto === 'http' && !isLocalhost) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    httpsUrl.host = rawHost;
    const sslRedirect = NextResponse.redirect(httpsUrl, 301);
    sslRedirect.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    sslRedirect.headers.set('X-Content-Type-Options', 'nosniff');
    return sslRedirect;
  }

  // 0.5. GEO-BLOQUEO ADVERSARIAL S-CLASS: RESTRICCIÓN DE TRÁFICO DESDE COLOMBIA (CO)
  const clientCountry =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('geoip-country-code') ||
    request.headers.get('x-geo-country');

  if (clientCountry && clientCountry.trim().toUpperCase() === 'CO') {
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          error: 'GEO_RESTRICTED',
          message: 'Acceso restringido para el territorio de Colombia (CO). Operativa exclusiva en España y UE.',
          country: 'CO',
        },
        {
          status: 403,
          headers: {
            'x-ear-geoblock': 'restricted-territory-CO',
            'x-robots-tag': 'noindex, nofollow',
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    return new NextResponse(
      `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Acceso Restringido por Zona Geográfica · Productora EAR</title>
  <style>
    body {
      background: #050507;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      max-width: 520px;
      width: 100%;
      background: #09090d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #f87171;
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 12px;
      color: #ffffff;
    }
    p {
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .legal-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 14px;
      font-size: 12px;
      color: #71717a;
      line-height: 1.5;
      margin-bottom: 24px;
      text-align: left;
    }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: #ecb613;
      color: #000000;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      border-radius: 12px;
      transition: background 0.2s;
    }
    .cta-btn:hover {
      background: #ffd643;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span>🛡️ Geo-Restricción Activa · CO (Colombia)</span>
    </div>
    <h1>Acceso No Disponible en su Territorio</h1>
    <p>
      El acceso a productoraear.com y sus plataformas satélite se encuentra restringido para conexiones detectadas desde Colombia.
    </p>
    <div class="legal-box">
      <strong>Ámbito Contractual Soberano:</strong><br/>
      Nuestros servicios de contratación artística, espacios para bodas y catering operan exclusivamente dentro del territorio nacional de España y el marco regulatorio de la Unión Europea (Art. 118 LCSP).
    </div>
    <a href="https://wa.me/34693693048?text=Consulta%20Institucional%20Internacional" class="cta-btn">
      Atención Centralita (+34 693 693 048)
    </a>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-ear-geoblock': 'restricted-territory-CO',
          'x-robots-tag': 'noindex, nofollow',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  // 1. Resolución de la unidad de negocio soberana por Host (W49_T02)
  const vertical = resolveVerticalFromHost(rawHost);

  // 2. Circuit-Breaker por vertical (aislamiento de fallos)
  const circuit = checkVerticalCircuitBreaker(vertical);
  if (!circuit.operational && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/admin')) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Mantenimiento · ${vertical.name}</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="background:#050507;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;box-sizing:border-box;"><div style="max-width:540px;text-align:center;padding:32px;background:#09090d;border:1px solid rgba(255,255,255,0.1);border-radius:24px;"><h1 style="color:${vertical.themeAccent};font-size:22px;margin-bottom:12px;">${vertical.name}</h1><p style="color:#aaa;font-size:14px;line-height:1.6;margin-bottom:24px;">${circuit.notice || vertical.maintenanceNotice}</p><a href="https://wa.me/34693693048" style="display:inline-block;padding:12px 24px;background:${vertical.themeAccent};color:#000;font-weight:bold;text-decoration:none;border-radius:12px;font-size:13px;">Contactar por WhatsApp (${vertical.conciergePhone})</a></div></body></html>`,
      {
        status: 503,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-ear-vertical': vertical.id,
          'x-ear-vertical-status': 'maintenance',
          'retry-after': '300',
        },
      }
    );
  }

  // 3. ROUTE-GATING · DARK LAUNCHING: cualquier ruta no certificada refluye con
  //    307 hacia el escaparate público (cero 404 visibles para cliente o inversor).
  //    Se evalúa ANTES del aislamiento por vertical para que una ruta en taller
  //    no dependa del host: siempre aterriza en suelo de mármol.
  //    Guarda estructural (P0 2026-11-21): el gate sólo puede absorber URLs de
  //    taller que EXISTEN como página. Un prefijo certificado no debe tragarse
  //    rutas hijas inexistentes (`/proveedores/loquesea` → 404 nativo), y las
  //    URLs de conversión vivas (`/proveedores`, `/calendario/[kind]/[slug]`)
  //    jamás deben caer en el escaparate: eso era la canibalización medida.
  const isCertified = isCertifiedRoute(url.pathname) || isKnownPublicSegment(url.pathname);
  if (!isRouteGatingBypassed(url.pathname) && !isFileRequest(url.pathname) && !isCertified) {
    const fallback = '/';
    const gatedResponse = NextResponse.redirect(new URL(fallback, request.url), 307);
    gatedResponse.headers.set('x-ear-vertical', vertical.id);
    gatedResponse.headers.set('x-ear-route-gating', 'redirected-to-certified-route');
    gatedResponse.headers.set('x-ear-route-gating-sank', url.pathname.slice(0, 96));
    return gatedResponse;
  }

  // 4. Aislamiento de rutas por vertical (un visitante de fincasparaboda no entra en /vimume)
  if (!isPathAllowedForVertical(vertical, url.pathname)) {
    const redirectTarget = new URL(vertical.defaultHomePath, request.url);
    const response = NextResponse.redirect(redirectTarget);
    response.headers.set('x-ear-vertical', vertical.id);
    response.headers.set('x-ear-vertical-redirected', 'route-not-allowed-in-vertical');
    return response;
  }

  // Inyectar cabeceras de verticalidad en la petición aguas abajo
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ear-vertical', vertical.id);
  requestHeaders.set('x-ear-vertical-name', vertical.name);

  // 5. Redirecciones 301 Canónicas hacia el Hub Central de Mariachis (/mariachis)
  if (url.pathname.startsWith('/centralita-mariachis')) {
    const provinceMatch = url.pathname.match(/\/centralita-mariachis\/([^/?#]+)/);
    const targetPath = provinceMatch && provinceMatch[1] && !provinceMatch[1].startsWith('red')
      ? `/mariachis/red/${provinceMatch[1]}`
      : '/mariachis';
    return NextResponse.redirect(new URL(targetPath, request.url), 301);
  }
  if (url.pathname === '/servicios/mariachis' || url.pathname === '/artistas/mariachis') {
    return NextResponse.redirect(new URL('/mariachis', request.url), 301);
  }

  // 6. Panel de administración y command-center blindados contra accesos sin sesión.
  if (isProtectedAdminPath(url.pathname)) {
    if (!hasValidAdminSession(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', `${url.pathname}${url.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 7. Interceptar URLs de referidos / afiliados (ej. productoraear.com/f/MIRAFLORES)
  if (url.pathname.startsWith('/f/')) {
    const affiliateCode = url.pathname.replace('/f/', '').toUpperCase();

    const redirectUrl = new URL(`/bodas?aff=${affiliateCode}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);
    response.headers.set('x-ear-vertical', vertical.id);

    return response;
  }

  // 8. Interceptar links directos de fincas (/fincas/[slug]?ref=[code])
  if (url.searchParams.has('ref')) {
    const affiliateCode = url.searchParams.get('ref')!.toUpperCase();
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set(AFFILIATE_COOKIE, affiliateCode, AFFILIATE_COOKIE_OPTIONS);
    response.headers.set('x-ear-vertical', vertical.id);

    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('x-ear-vertical', vertical.id);
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};