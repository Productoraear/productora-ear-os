import { NextResponse } from 'next/server';
import { generateSitemapPartition } from '@/lib/seo/sitemapGenerator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  props: { params: Promise<{ partition: string }> }
) {
  try {
    const resolvedParams = await props.params;
    const cleanId = resolvedParams.partition.replace(/\.xml$/, '');

    const entries = await generateSitemapPartition(cleanId);

    const xmlEntries = entries
      .map(
        (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency || 'weekly'}</changefreq>
    <priority>${entry.priority ?? 0.8}</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[SITEMAP_PARTITION_ERROR]', error);
    return new NextResponse('Error generating sitemap partition', { status: 500 });
  }
}

