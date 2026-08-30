import { MetadataRoute } from 'next';
import { SPANISH_MUNICIPALITIES } from '@/lib/geo/spanish-municipalities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. RUTAS ESTÁTICAS CORE & HUBS DE CONVERSIÓN S-CLASS (Prioridad 1.0 - 0.8)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/cotizador`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/checkout/presupuesto`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/artistas`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/artistas/edwin-agudelo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/proveedores`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vimume`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/vimume/b2g`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/vimume/experiencia`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/alquiler-pantallas-led-madrid`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/catering-brasas`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/soberania-tecnica`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // 2. RUTAS pSEO DE LAS 52 PROVINCIAS (Prioridad 0.8)
  const provincialRoutes: MetadataRoute.Sitemap = TODAS_PROVINCIAS_52.map((prov) => ({
    url: `${BASE_URL}/bodas/${prov}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 3. RUTAS pSEO DE SERVICIOS POR PROVINCIA (Prioridad 0.7)
  const provincialServiceRoutes: MetadataRoute.Sitemap = [];
  for (const prov of TODAS_PROVINCIAS_52) {
    for (const serv of CORE_SERVICES) {
      provincialServiceRoutes.push({
        url: `${BASE_URL}/bodas/${prov}/${serv}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }
  }

  // 4. RUTAS pSEO DE MUNICIPIOS ESTRATÉGICOS DE ESPAÑA (Prioridad 0.6)
  const municipalRoutes: MetadataRoute.Sitemap = [];
  for (const muni of SPANISH_MUNICIPALITIES) {
    for (const service of CORE_SERVICES) {
      municipalRoutes.push({
        url: `${BASE_URL}/bodas/${muni.provinceSlug}/${service}/${muni.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: muni.isCoreHub ? 0.8 : 0.6,
      });
    }
  }

  return [
    ...staticRoutes,
    ...provincialRoutes,
    ...provincialServiceRoutes,
    ...municipalRoutes
  ];
}
