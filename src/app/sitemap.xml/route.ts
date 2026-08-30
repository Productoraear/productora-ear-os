import { SPANISH_MUNICIPALITIES } from '@/lib/geo/spanish-municipalities';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.productoraear.com';

const CORE_SERVICES = [
  'mariachi-gala',
  'bodas-lujo',
  'catering-brasas',
  'alquiler-pantallas-led',
  'sonido-iluminacion'
];

const TODAS_PROVINCIAS_52 = [
  'madrid', 'toledo', 'barcelona', 'valencia', 'sevilla', 'malaga', 'zaragoza', 'murcia',
  'palma', 'las-palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon',
  'vitoria', 'coruna', 'granada', 'oviedo', 'cartagena', 'santa-cruz', 'pamplona', 'almeria',
  'burgos', 'albacete', 'castellon', 'santander', 'logrono', 'badajoz', 'huelva', 'salamanca',
  'lerida', 'leon', 'cadiz', 'jaen', 'orense', 'gerona', 'lugo', 'caceres', 'guadalajara',
  'tarragona', 'pontevedra', 'zamora', 'avila', 'segovia', 'cuenca', 'huesca', 'soria',
  'teruel', 'ceuta', 'melilla'
];

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${BASE_URL}`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/cotizador`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/checkout/presupuesto`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/artistas`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/artistas/edwin-agudelo`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/proveedores`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/vimume`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/vimume/b2g`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/vimume/experiencia`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/alquiler-pantallas-led-madrid`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/catering-brasas`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/soberania-tecnica`, priority: '0.7', changefreq: 'monthly' }
  ];

  let xmlEntries = '';

  // 1. Static Routes
  for (const item of staticUrls) {
    xmlEntries += `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
  }

  // 2. Provincial Routes
  for (const prov of TODAS_PROVINCIAS_52) {
    xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${prov}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  // 3. Provincial Service Routes
  for (const prov of TODAS_PROVINCIAS_52) {
    for (const serv of CORE_SERVICES) {
      xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${prov}/${serv}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  }

  // 4. Strategic Municipalities
  for (const muni of SPANISH_MUNICIPALITIES) {
    for (const serv of CORE_SERVICES) {
      xmlEntries += `
  <url>
    <loc>${BASE_URL}/bodas/${muni.provinceSlug}/${serv}/${muni.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${muni.isCoreHub ? '0.8' : '0.6'}</priority>
  </url>`;
    }
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
