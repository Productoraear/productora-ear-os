/**
 * CANONICAL SITE ORIGIN — una sola verdad para todo lo que ve el rastreador.
 *
 * Hallazgo medido en producción (2026-10-30):
 *   GET https://www.productoraear.com/api/sitemap-index devolvía hijos con host
 *   `https://productoraear.com/...` (apex). Ese host responde 308 → www
 *   (next.config.ts, redirects: productoraear.com/:path* → www). Un sitemap cuyos
 *   <loc> apuntan a redirecciones desperdicia presupuesto de rastreo y GSC lo
 *   reporta como "página con redirección", no como URL indexable.
 *
 * Este módulo cierra esa fuga: todo `<loc>` nace en el host final (www) o, en
 * entornos no productivos (localhost / preview de Coolify), en el host real de
 * ese entorno — jamás en un host que redirige.
 *
 * SEC-2 · role: public | tenant: global (solo origen, cero datos).
 */

export const CANONICAL_SITE_ORIGIN = 'https://www.productoraear.com';

const CANONICAL_HOST = 'www.productoraear.com';
const APEX_HOST = 'productoraear.com';

/**
 * Devuelve el `origin` canónico (sin path, sin barra final) a partir de una URL
 * cruda. Reglas, en orden:
 *  1. Valor vacío / no parseable → CANONICAL_SITE_ORIGIN.
 *  2. Protocolo distinto de http(s) → CANONICAL_SITE_ORIGIN.
 *  3. Apex `productoraear.com` → `https://www.productoraear.com` (mata el 308).
 *  4. Cualquier otro host (localhost, IP de Coolify, preview) → se respeta tal cual,
 *     porque ahí la producción no existe y mentir con www rompería los enlaces.
 */
export function resolveCanonicalOrigin(raw?: string | null): string {
  const candidate = (raw ?? '').trim();
  if (!candidate) return CANONICAL_SITE_ORIGIN;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return CANONICAL_SITE_ORIGIN;
    }

    if (parsed.hostname === APEX_HOST) {
      return `https://${CANONICAL_HOST}`;
    }

    return parsed.origin;
  } catch {
    return CANONICAL_SITE_ORIGIN;
  }
}

/** Igual que `resolveCanonicalOrigin`, leyendo `NEXT_PUBLIC_BASE_URL`. */
export function resolveCanonicalOriginFromEnv(): string {
  return resolveCanonicalOrigin(process.env.NEXT_PUBLIC_BASE_URL);
}

/**
 * Origen que se publica en sitemaps y robots.txt.
 *
 * Regla de producción, sin excepciones: `https://www.productoraear.com`.
 * Motivo: `NEXT_PUBLIC_BASE_URL` es una variable de build. Si el build de Coolify
 * la trae apuntando a la IP del VPS (`http://82.29.179.172:8000`) o a un dominio
 * de preview, el sitemap publicaría `<loc>` con esa IP — basura pública que
 * Google intentaría rastrear y que ningún cliente podría abrir con TLS válido.
 * Un sitemap es una promesa pública: aquí se blinda contra un `.env` mal puesto.
 *
 * Escotilla documentada para verificar un entorno que NO es producción:
 *   SITEMAP_FORCE_ORIGIN="https://staging.ejemplo.com" node ...
 * Es server-only (sin prefijo NEXT_PUBLIC_), así que nunca viaja al navegador.
 */
export function resolveSitemapOrigin(): string {
  const override = (process.env.SITEMAP_FORCE_ORIGIN ?? '').trim();
  if (override) return resolveCanonicalOrigin(override);

  if (process.env.NODE_ENV === 'production') return CANONICAL_SITE_ORIGIN;

  // Desarrollo local: se respeta el host real (localhost:3007) para que los
  // enlaces del sitemap abran algo. Aquí no hay promesa pública que proteger.
  return resolveCanonicalOrigin(process.env.NEXT_PUBLIC_BASE_URL);
}

/**
 * Fuerza que un `<loc>` de sitemap apunte al host final y sea absoluto.
 *
 * Por qué existe: la partición 5 se construye con `canonicalUrl` procedente de
 * telemetría GSC (`gsc-sitemap-intent-landings.json`), y la partición 0 con
 * `canonicalUrl` del catálogo de alumbrado. Son datos de terceros/exportaciones:
 * si un día traen el apex, el sitemap publicaría URLs que responden 308 y Google
 * las ignoraría como "página con redirección". El escapado XML no arregla eso;
 * esto sí, y se aplica en el ÚNICO punto donde se escribe `<loc>`.
 *
 * Garantía estructural: cualquier `<loc>` servido por este sistema nace en el
 * origen canónico, sea cual sea la calidad del dato de entrada.
 */
export function toCanonicalLoc(rawUrl: string, origin: string): string {
  const value = (rawUrl ?? '').trim();
  if (!value) return origin;

  // Ruta relativa: se absolutiza contra el origen canónico.
  if (value.startsWith('/')) return `${origin}${value}`;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return value;
    if (parsed.hostname === APEX_HOST) {
      return `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return value;
  } catch {
    // Cadena no parseable: se descarta la parte de host, no se inventa una URL.
    return value.startsWith('//') ? `${origin}${value.replace(/^\/\/[^/]+/, '')}` : value;
  }
}
