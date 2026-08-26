import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';

  // 1. Rutas Estáticas Troncales
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/bodas',
    '/eventos',
    '/mobile-fusion',
    '/checkout/presupuesto',
    '/vimume',
    '/proveedores',
    '/ocasiones/ayuntamientos',
    '/artistas/edwin-agudelo',
    '/artistas/cumpleanos',
    '/soberania-tecnica',
    '/arsenal',
    '/empresarios',
    '/chofer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Helper para extracción segura de slug sin colisión de tipos TypeScript
  const extractSlug = (item: any): string | null => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    return item.slug || item.id || String(item);
  };

  // 2. Generación Programática Masiva (SEO Geolocalizado: Provincias x Servicios)
  const weddingProgrammaticRoutes: MetadataRoute.Sitemap = [];

  if (Array.isArray(PROVINCIAS) && Array.isArray(SERVICIOS)) {
    for (const prov of PROVINCIAS) {
      const provSlug = extractSlug(prov);
      for (const serv of SERVICIOS) {
        const servSlug = extractSlug(serv);
        if (provSlug && servSlug) {
          weddingProgrammaticRoutes.push({
            url: `${baseUrl}/bodas/${provSlug}/${servSlug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  }

  return [...staticRoutes, ...weddingProgrammaticRoutes];
}
