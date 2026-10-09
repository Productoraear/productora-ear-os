import { NextRequest, NextResponse } from 'next/server';
import { promises as dns } from 'dns';

export const runtime = 'nodejs';

/**
 * 🛡️ MEDIA PROXY (S-CLASS HARDENED)
 * ----------------------------------------------------------------------------
 * Defensa en profundidad contra SSRF y contra la contaminación del índice de
 * Google (el "caballo de troya" cdn0.bodas.net):
 *  1. Allowlist estricta de dominios de imagen (nada de fetch arbitrario).
 *  2. Resolución DNS + bloqueo de IPs privadas/loopback/link-local (anti-SSRF
 *     y anti-DNS-rebinding; protege 169.254.169.254 y redes internas).
 *  3. Header X-Robots-Tag: noindex, nofollow para que las respuestas del proxy
 *     NUNCA entren al índice de Google ni drenen crawl budget.
 *  4. Cache inmutable solo tras descarga correcta.
 * ----------------------------------------------------------------------------
 */

// Dominios de imagen legítimos usados por el frontend (cdn de proveedores y
// Unsplash). Cualquier otro host es rechazado con 403.
const ALLOWED_HOST_SUFFIXES = [
  '.bodas.net',
  'unsplash.com',
  '.unsplash.com'
] as const;

const IPV4_PRIVATE_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0a000000, 0x0affffff], // 10.0.0.0/8
  [0xac100000, 0xac1fffff], // 172.16.0.0/12
  [0xc0a80000, 0xc0a8ffff], // 192.168.0.0/16
  [0x7f000000, 0x7fffffff], // 127.0.0.0/8
  [0xa9fe0000, 0xa9feffff], // 169.254.0.0/16 (link-local / cloud metadata)
  [0x64400000, 0x647fffff]  // 100.64.0.0/10 (CGNAT)
];

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((suffix) => host === suffix.replace(/^\./, '') || host.endsWith(suffix));
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true; // no parseable => bloquear
  const num = ((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3];
  return IPV4_PRIVATE_RANGES.some(([lo, hi]) => num >= lo && num <= hi);
}

function isPrivateIp(ip: string): boolean {
  if (ip.includes(':')) {
    const norm = ip.toLowerCase();
    return (
      norm === '::1' ||
      norm === '::' ||
      norm.startsWith('fe80:') || // link-local
      norm.startsWith('fc') ||
      norm.startsWith('fd') ||    // unique local (ULA)
      /^f[cd]/i.test(norm)
    );
  }
  return isPrivateIpv4(ip);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL no proporcionada', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(imageUrl);
  } catch {
    return new NextResponse('URL no válida', { status: 400 });
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return new NextResponse('Protocolo no permitido', { status: 400 });
  }

  if (!isAllowedHost(target.hostname)) {
    return new NextResponse('Dominio de imagen no permitido', {
      status: 403,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    });
  }

  try {
    // Anti-SSRF / anti-DNS-rebinding: bloquea cualquier resolución a IP interna.
    const addresses = await dns.lookup(target.hostname, { all: true });
    if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
      return new NextResponse('Destino de red no permitido', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow' }
      });
    }

    const response = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.bodas.net/'
      }
    });

    if (!response.ok) {
      return new NextResponse('Error al obtener la imagen', {
        status: response.status,
        headers: { 'X-Robots-Tag': 'noindex, nofollow' }
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });
  } catch (error: unknown) {
    console.error('MEDIA_PROXY_ERROR:', error);
    return new NextResponse('Error interno del proxy', {
      status: 500,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    });
  }
}