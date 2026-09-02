import { MUNICIPALITIES_DATABASE, SERVICES_DATABASE } from '@/lib/geo/spanish-municipalities';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.productoraear.com';
const CHUNK_SIZE = 1000;

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

function normalizeSlug(name: string): string {
  if (!name) return 'proveedor';
  let cleaned = name;
  if (cleaned.includes('documentos-')) {
    cleaned = cleaned.split('documentos-').pop() || cleaned;
  }
  if (cleaned.includes('/')) {
    cleaned = cleaned.split('/').pop() || cleaned;
  }
  if (cleaned.includes('\\')) {
    cleaned = cleaned.split('\\').pop() || cleaned;
  }
  return cleaned
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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
      { loc: `${BASE_URL}/soberania-tecnica`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${BASE_URL}/alquiler-pantallas-led-madrid`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${BASE_URL}/contratacion/ayuntamientos`, priority: '0.9', changefreq: 'weekly' },
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
    const tierMunicipalities = MUNICIPALITIES_DATABASE.filter((m) => m.tier === targetTier);
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
  } else if (partitionId.startsWith('providers-')) {
    // 3. Particiones masivas para los 12.739+ proveedores
    const chunkNumStr = partitionId.replace('providers-', '');
    const chunkNum = parseInt(chunkNumStr, 10);

    if (isNaN(chunkNum) || chunkNum < 1) {
      return new Response('Invalid provider chunk ID', { status: 400 });
    }

    try {
      const jsonPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const allProviders: any[] = JSON.parse(raw);

        const startIndex = (chunkNum - 1) * CHUNK_SIZE;
        const endIndex = startIndex + CHUNK_SIZE;
        const chunkProviders = allProviders.slice(startIndex, endIndex);

        for (const p of chunkProviders) {
          const rawName = p.name || 'proveedor';
          const slug = normalizeSlug(rawName);
          const claimToken = p.claimToken || '';

          // URL canónica del escaparate
          const providerLoc = `${BASE_URL}/proveedores/${slug}`;

          xmlEntries += `
  <url>
    <loc>${providerLoc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      }
    } catch (err) {
      console.error('[SITEMAP PROVIDERS CHUNK ERROR]', err);
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
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
