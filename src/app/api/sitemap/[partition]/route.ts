import { NextResponse } from 'next/server';
import { generateSitemapPartition } from '@/lib/seo/sitemapGenerator';
import { normalizePartitionParam, renderUrlsetXml } from '@/lib/seo/sitemapRegistry';

/**
 * SEC-2 · role: public | tenant: global.
 *
 * LEGACY / COMPATIBILIDAD · `GET /api/sitemap/{0..5}.xml`
 *
 * La ruta pública canónica es `GET /sitemaps/{0..5}.xml`, fuera de /api/, porque
 * robots.txt declara `Disallow: /api/`: Google no puede descargar un sitemap
 * alojado bajo /api/ aunque el índice lo referencie. Antes de este cambio el
 * índice maestro apuntaba justo aquí y las ~6.370 URLs del catálogo masivo eran
 * invisibles para el rastreador.
 *
 * Se mantiene por compatibilidad, con el MISMO render escapado que la ruta
 * pública (`renderUrlsetXml`) y cerrada por defecto ante ids no canónicos.
 */
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: Request,
  props: { params: Promise<{ partition: string }> }
) {
  const resolvedParams = await props.params;
  const cleanId = normalizePartitionParam(resolvedParams.partition);

  if (!cleanId) {
    return new NextResponse('Partición de sitemap no canónica', { status: 404 });
  }

  try {
    const entries = await generateSitemapPartition(cleanId);

    return new NextResponse(renderUrlsetXml(entries), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Link: `</sitemaps/${cleanId}.xml>; rel="canonical"`,
        'X-Sitemap-Partition': cleanId,
        'X-Sitemap-Urls': String(entries.length),
      },
    });
  } catch (error) {
    console.error('[SITEMAP_PARTITION_ERROR]', cleanId, error);
    return new NextResponse('Error generating sitemap partition', { status: 500 });
  }
}


