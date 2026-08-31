import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.productoraear.com';
const CHUNK_SIZE = 1000;

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  // 1. Sub-sitemaps estructurales y territoriales
  const sitemaps = [
    { loc: `${BASE_URL}/sitemap/core.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/provincias.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier1.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier2.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap/tier3.xml`, lastmod: now },
  ];

  // 2. Calcular dinámicamente las particiones para los 12.739+ proveedores
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const list: any[] = JSON.parse(raw);
      const totalProviders = list.length;
      const totalChunks = Math.ceil(totalProviders / CHUNK_SIZE);

      for (let i = 1; i <= totalChunks; i++) {
        sitemaps.push({
          loc: `${BASE_URL}/sitemap/providers-${i}.xml`,
          lastmod: now,
        });
      }
    }
  } catch (err) {
    console.warn('[SITEMAP INDEX] Error calculando chunks de proveedores:', err);
  }

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
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
