import { NextResponse } from 'next/server';
import { generateSitemapPartition } from '@/lib/seo/sitemapGenerator';
import { normalizePartitionParam, renderUrlsetXml } from '@/lib/seo/sitemapRegistry';
import { resolveSitemapOrigin } from '@/lib/seo/canonicalSite';
import {
  buildEventShardEntries,
  parseEventShardId,
} from '@/lib/seo/eventSitemapPlanner';

/**
 * PARTICIÓN PÚBLICA DE SITEMAP · `GET /sitemaps/{0..5}.xml`
 *
 * SEC-2 · role: public | tenant: global.
 * SEC-1 · Ruta cerrada por defecto: un id no canónico responde 404, no 500 ni
 *         una partición vacía con 200 (un 200 vacío se lee como "todo bien").
 *
 * Espejo público de `/api/sitemap/[partition]`: misma generación
 * (`generateSitemapPartition`) y mismo render (`renderUrlsetXml`), pero servido
 * fuera de `/api/` para que `Disallow: /api/` no bloquee el rastreo.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: Request,
  props: { params: Promise<{ partition: string }> }
): Promise<NextResponse> {
  const resolvedParams = await props.params;
  const origin = resolveSitemapOrigin();

  // ── Familia 1: shards del catálogo de eventos (`eventos-0001.xml`) ──────
  // Se comprueban ANTES que las particiones 0..5 porque su id no es numérico.
  const eventShardCandidate = resolvedParams.partition.replace(/\.xml$/i, '').trim().toLowerCase();
  if (eventShardCandidate.startsWith('eventos-')) {
    if (parseEventShardId(eventShardCandidate) === null) {
      return new NextResponse('Shard de eventos no canónico', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    try {
      const entries = buildEventShardEntries(eventShardCandidate, origin);

      return new NextResponse(renderUrlsetXml(entries, origin), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Sitemap-Partition': eventShardCandidate,
          'X-Sitemap-Urls': String(entries.length),
        },
      });
    } catch (error) {
      console.error('[SITEMAP_EVENT_SHARD_ERROR]', eventShardCandidate, error);
      return new NextResponse('Error generando shard de eventos', {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  // ── Familia 2: particiones canónicas 0..5 ──────────────────────────────
  const cleanId = normalizePartitionParam(resolvedParams.partition);

  if (!cleanId) {
    return new NextResponse('Partición de sitemap no canónica', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const entries = await generateSitemapPartition(cleanId);

    return new NextResponse(renderUrlsetXml(entries), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Sitemap-Partition': cleanId,
        'X-Sitemap-Urls': String(entries.length),
      },
    });
  } catch (error) {
    console.error('[SITEMAP_PARTITION_PUBLIC_ERROR]', cleanId, error);
    return new NextResponse('Error generando partición de sitemap', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
