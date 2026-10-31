import type { MetadataRoute } from 'next';
import { escapeXml } from '@/lib/seo/temperatureSitemapEngine';
import { resolveSitemapOrigin, toCanonicalLoc } from '@/lib/seo/canonicalSite';

/**
 * SITEMAP REGISTRY — SSOT de "qué sitemaps existen y dónde se sirven".
 *
 * Por qué existe este fichero: había tres listas vivas del mismo hecho
 * (sitemapGenerator.SITEMAP_PARTITIONS, /api/sitemap-index y robots.ts) y
 * ninguna coincidía operativamente con las otras dos. Resultado medido el
 * 2026-10-30 en producción: robots.txt declaraba un solo sitemap y el índice
 * apuntaba a particiones bajo `/api/`, que el propio robots.txt prohíbe
 * rastrear (Disallow: /api/). Google no podía ver las 6 particiones.
 *
 * Aquí se declara una sola vez:
 *  · las particiones canónicas (ids 0..5),
 *  · los sitemaps individuales ya servidos por Next (`urlset`, no índices),
 *  · la ruta pública de las particiones (fuera de /api/),
 *  · el render XML de `sitemapindex` y `urlset`, con escapado real.
 *
 * Regla dura: este módulo NO importa `sitemapGenerator` (que a su vez arrastra
 * MUNICIPALITIES_DATABASE, ~MBs). El índice maestro debe pesar kilobytes.
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales, cero secretos.
 */

/** Particiones canónicas del catálogo masivo (pSEO, proveedores, directorio, GSC). */
export const SITEMAP_PARTITION_IDS = ['0', '1', '2', '3', '4', '5'] as const;

export type SitemapPartitionId = (typeof SITEMAP_PARTITION_IDS)[number];

/** Prefijo público de las particiones: NO bajo /api/ (robots.txt bloquea /api/). */
export const PUBLIC_PARTITION_BASE_PATH = '/sitemaps';

/**
 * Sitemaps individuales (`urlset`) que Next ya sirve por convención:
 *  · /sitemap.xml            → src/app/sitemap.ts (rutas curadas que venden)
 *  · /sitemap-predictivo.xml → temperatura de lead (CALIENTE/TEMPLADO/FRIO)
 */
export const PUBLIC_SINGLE_SITEMAPS = ['/sitemap.xml', '/sitemap-predictivo.xml'] as const;

export interface SitemapIndexEntry {
  loc: string;
  lastmod: string;
}

export function isSitemapPartitionId(value: string): value is SitemapPartitionId {
  return (SITEMAP_PARTITION_IDS as readonly string[]).includes(value);
}

/**
 * Normaliza el parámetro de ruta de una partición: acepta `0` y `0.xml`.
 * Devuelve `null` si el id no es canónico (SEC-1: ruta nueva nace cerrada).
 */
export function normalizePartitionParam(value: string): SitemapPartitionId | null {
  const clean = value.replace(/\.xml$/i, '').trim();
  return isSitemapPartitionId(clean) ? clean : null;
}

/**
 * Hijos del índice maestro, en orden de prioridad de rastreo.
 *
 * `extraSitemapPaths` permite que el llamante añada sitemaps derivados de datos
 * (p. ej. los shards `eventos-NNNN` del catálogo). El registro NO los calcula:
 * así sigue sin arrastrar el dataset municipal y el índice se compone con la
 * lista exacta que le entrega su dueño.
 */
export function buildSitemapIndexEntries(
  origin: string,
  lastmod: string,
  extraSitemapPaths: readonly string[] = []
): SitemapIndexEntry[] {
  const entries: SitemapIndexEntry[] = [];

  for (const path of PUBLIC_SINGLE_SITEMAPS) {
    entries.push({ loc: `${origin}${path}`, lastmod });
  }

  for (const id of SITEMAP_PARTITION_IDS) {
    entries.push({ loc: `${origin}${PUBLIC_PARTITION_BASE_PATH}/${id}.xml`, lastmod });
  }

  for (const path of extraSitemapPaths) {
    if (!path.startsWith('/')) continue;
    entries.push({ loc: `${origin}${path}`, lastmod });
  }

  return entries;
}

/** XML `<sitemapindex>` (índice maestro). */
export function renderSitemapIndexXml(entries: readonly SitemapIndexEntry[]): string {
  const body = entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

/**
 * XML `<urlset>` (una partición). Escapa `<loc>` porque los canonicalUrl de
 * telemetría GSC pueden traer `&`: sin escapado el XML queda malformado y
 * Google descarta el fichero entero.
 *
 * Normaliza además el host de cada `<loc>` contra `origin` (`toCanonicalLoc`):
 * las particiones 0 y 5 se alimentan de `canonicalUrl` de terceros y un `<loc>`
 * en el apex se paga con un 308 que Google contabiliza como redirección.
 *
 * `lastmod` se omite si el dato no existe: nunca se inventa la fecha de hoy
 * (AF-5, prohibido el "verde por defecto").
 */
export function renderUrlsetXml(
  entries: MetadataRoute.Sitemap,
  origin: string = resolveSitemapOrigin()
): string {
  const body = entries
    .map((entry) => {
      const loc = toCanonicalLoc(entry.url, origin);
      const lines: string[] = [`    <loc>${escapeXml(loc)}</loc>`];

      const lastmod =
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : typeof entry.lastModified === 'string'
            ? entry.lastModified
            : null;

      if (lastmod) {
        lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
      }

      lines.push(`    <changefreq>${entry.changeFrequency ?? 'weekly'}</changefreq>`);
      lines.push(`    <priority>${(entry.priority ?? 0.8).toFixed(1)}</priority>`);

      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
