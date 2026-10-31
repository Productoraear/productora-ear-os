import { NextResponse } from 'next/server';
import { resolveSitemapOrigin } from '@/lib/seo/canonicalSite';
import { buildSitemapIndexEntries, renderSitemapIndexXml } from '@/lib/seo/sitemapRegistry';
import { getEventShardIds, getEventShardPublicPath } from '@/lib/seo/eventSitemapPlanner';

/**
 * ÍNDICE MAESTRO DE SITEMAPS · `GET /sitemap-index.xml`
 *
 * SEC-2 · role: public | tenant: global.
 * AF-1 · Telemetría honesta: `X-Sitemap-Children` y `X-Sitemap-Origin` describen
 *        lo que este proceso acaba de componer, no una constante de adorno.
 *
 * Por qué una ruta propia y no `/api/sitemap-index`:
 *   robots.txt declara `Disallow: /api/`. Un sitemap servido bajo /api/ queda
 *   bloqueado para el rastreador (Google no puede descargarlo aunque robots.txt
 *   lo declare). Este índice vive en la raíz, fuera de toda zona prohibida, y es
 *   el ÚNICO URL que hay que dar de alta en Search Console: al leerlo, Google
 *   descubre el sitemap curado (~778 URLs que venden), el predictivo por
 *   temperatura y las 6 particiones del catálogo masivo (~6.370 URLs medidas
 *   el 2026-10-30).
 *
 * Todos los <loc> nacen en el host final (www). Cero saltos 308 dentro del
 * sitemap: un <loc> que redirige es presupuesto de rastreo tirado.
 */
export const runtime = 'nodejs';

// ISR: el índice solo cambia con el día. 1 h de caché evita que cada visita de
// GSC regenere XML y mantiene el fichero servible desde la CDN de Coolify.
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  const origin = resolveSitemapOrigin();
  const lastmod = new Date().toISOString().split('T')[0];

  // Shards del catálogo de eventos (hub + 8 familias + 300 intenciones +
  // 15.600 intención×provincia). Se derivan del inventario real, no de una
  // constante: si mañana la taxonomía crece, el índice crece solo.
  const eventShardPaths = getEventShardIds()
    .map((shardId) => getEventShardPublicPath(shardId))
    .filter((path): path is string => path !== null);

  const entries = buildSitemapIndexEntries(origin, lastmod, eventShardPaths);

  return new NextResponse(renderSitemapIndexXml(entries), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Sitemap-Children': String(entries.length),
      'X-Sitemap-Event-Shards': String(eventShardPaths.length),
      'X-Sitemap-Origin': origin,
    },
  });
}
