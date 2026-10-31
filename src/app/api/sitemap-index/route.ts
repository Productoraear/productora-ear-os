import { NextResponse } from 'next/server';
import { resolveSitemapOrigin } from '@/lib/seo/canonicalSite';
import { buildSitemapIndexEntries, renderSitemapIndexXml } from '@/lib/seo/sitemapRegistry';

/**
 * SEC-2 · role: public | tenant: global.
 *
 * LEGACY / COMPATIBILIDAD · `GET /api/sitemap-index`
 *
 * El índice canónico y declarado en robots.txt es `GET /sitemap-index.xml`
 * (src/app/sitemap-index.xml/route.ts), servido fuera de /api/ porque
 * `Disallow: /api/` impide que el rastreador descargue nada de aquí.
 *
 * Esta ruta se conserva para no romper consumidores previos y ahora comparte la
 * MISMA fuente de verdad (`sitemapRegistry`) y el MISMO origen canónico, así que
 * ya no puede divergir del índice público: mismo número de hijos, mismo host
 * final (www), cero 308 dentro del XML. Devuelve una cabecera `Link` que apunta
 * al canónico para que cualquier integración se auto-corrija.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const origin = resolveSitemapOrigin();
  const today = new Date().toISOString().split('T')[0];
  const entries = buildSitemapIndexEntries(origin, today);

  return new NextResponse(renderSitemapIndexXml(entries), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Link: `<${origin}/sitemap-index.xml>; rel="canonical"`,
      'X-Sitemap-Children': String(entries.length),
      'X-Sitemap-Origin': origin,
    },
  });
}

