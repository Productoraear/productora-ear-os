import { MUNICIPALITIES_DATABASE, SERVICES_DATABASE } from '@/lib/geo/spanish-municipalities';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.productoraear.com';

const TODAS_PROVINCIAS_52 = [
  'madrid', 'toledo', 'barcelona', 'valencia', 'sevilla', 'malaga', 'zaragoza', 'murcia',
  'palma', 'las-palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon',
  'vitoria', 'coruna', 'granada', 'oviedo', 'cartagena', 'santa-cruz', 'pamplona', 'almeria',
  'burgos', 'albacete', 'castellon', 'santander', 'logrono', 'badajoz', 'huelva', 'salamanca',
  'lerida', 'leon', 'cadiz', 'jaen', 'orense', 'gerona', 'lugo', 'caceres', 'guadalajara',
  'tarragona', 'pontevedra', 'zamora', 'avila', 'segovia', 'cuenca', 'huesca', 'soria',
  'teruel', 'ceuta', 'melilla'
];

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: Request, context: RouteContext) {
  const resolvedParams = await context.params;
  const rawId = resolvedParams.id || '';
  const partitionId = rawId.replace(/\.xml$/, '');
  const now = new Date().toISOString().split('T')[0];

  let xmlEntries = '';

  if (partitionId === 'core') {
    const staticUrls = [
      { loc: `${BASE_URL}`, priority: '1.0', changefreq: 'daily' },
      { loc: `${BASE_URL}/cotizador`, priority: '0.9', changefreq: 'daily' },
      { loc: `${BASE_URL}/checkout/presupuesto`, priority: '0.9', changefreq: 'daily' },
      { loc: `${BASE_URL}/artistas`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${BASE_URL}/artistas/edwin-agudelo`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${BASE_URL}/proveedores`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${BASE_URL}/vimume`, priority: '1.0', changefreq: 'daily' },
      { loc: `${BASE_URL}/vimume/b2g`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${BASE_URL}/catering-brasas`, priority: '0.9', changefreq: 'daily' },
      { loc: `${BASE_URL}/soberania-tecnica`, priority: '0.7', changefreq: 'monthly' }
    ];

    for (const item of staticUrls) {
      xmlEntries += `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
    }
  } else if (partitionId === 'provincias') {
    for (const prov of TODAS_PROVINCIAS_52) {
      xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${prov}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      for (const service of SERVICES_DATABASE) {
        xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${prov}/${service.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }
  } else if (partitionId === 'tier1' || partitionId === 'tier2' || partitionId === 'tier3') {
    const targetTier = partitionId === 'tier1' ? 1 : partitionId === 'tier2' ? 2 : 3;
    const tierMunicipalities = MUNICIPALITIES_DATABASE.filter(m => m.tier === targetTier);
    const priority = targetTier === 1 ? '0.8' : targetTier === 2 ? '0.7' : '0.6';

    for (const muni of tierMunicipalities) {
      for (const service of SERVICES_DATABASE) {
        xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${muni.provinceSlug}/${service.slug}/${muni.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }
    }
  } else {
    return new Response('Sitemap partition not found', { status: 404 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}
