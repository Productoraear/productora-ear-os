export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.productoraear.com';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  const sitemaps = [
    { loc: `${BASE_URL}/sitemap/core.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/provincias.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier1.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier2.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier3.xml`, lastmod: now },
  ];

  const xmlEntries = sitemaps
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}
