import { MetadataRoute } from 'next';
import { SPANISH_MUNICIPALITIES } from '@/lib/geo/spanish-municipalities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';
const URLS_PER_SITEMAP = 5000;

const CORE_SERVICES = [
  'mariachi-gala',
  'bodas-lujo',
  'catering-brasas',
  'alquiler-pantallas-led',
  'sonido-iluminacion'
];

export async function generateSitemaps() {
  const totalUrls = SPANISH_MUNICIPALITIES.length * CORE_SERVICES.length;
  const totalChunks = Math.max(1, Math.ceil(totalUrls / URLS_PER_SITEMAP));

  return Array.from({ length: totalChunks }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = id === 0 ? [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/cotizador`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/checkout/presupuesto`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/artistas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vimume/b2g`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/alquiler-pantallas-led-madrid`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/proveedores`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/catering-brasas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ] : [];

  const pSeoUrls: MetadataRoute.Sitemap = [];

  for (const muni of SPANISH_MUNICIPALITIES) {
    for (const service of CORE_SERVICES) {
      pSeoUrls.push({
        url: `${BASE_URL}/bodas/${muni.provinceSlug}/${service}/${muni.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: muni.isCoreHub ? 0.8 : 0.6,
      });
    }
  }

  const startIndex = id * URLS_PER_SITEMAP;
  const endIndex = startIndex + URLS_PER_SITEMAP;
  const chunkedPSeoUrls = pSeoUrls.slice(startIndex, endIndex);

  return [...staticRoutes, ...chunkedPSeoUrls];
}
