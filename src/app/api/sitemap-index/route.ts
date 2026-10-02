import { NextResponse } from 'next/server';
import { SITEMAP_PARTITIONS } from '@/lib/seo/sitemapGenerator';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const sitemapsXml = SITEMAP_PARTITIONS.map(
    (id) => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${id}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
