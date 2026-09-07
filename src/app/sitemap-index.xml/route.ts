import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.productoraear.com';
const PARTITIONS = ['0', '1', '2', '3', '4'];

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const sitemapsXml = PARTITIONS.map(
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
