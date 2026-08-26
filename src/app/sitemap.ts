import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS, OCASIONES } from '@/lib/constants/seo-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';

  const extractSlug = (item: any): string | null => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    return item.slug || item.id || String(item);
  };

  // 1. Rutas Estáticas
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

  // 2. Matriz Bodas (Provincias x Servicios)
  const weddingRoutes: MetadataRoute.Sitemap = [];
  if (Array.isArray(PROVINCIAS) && Array.isArray(SERVICIOS)) {
    for (const prov of PROVINCIAS) {
      const provSlug = extractSlug(prov);
      for (const serv of SERVICIOS) {
        const servSlug = extractSlug(serv);
        if (provSlug && servSlug) {
          weddingRoutes.push({
            url: `${baseUrl}/bodas/${provSlug}/${servSlug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  }

  // 3. Matriz Ocasiones / Eventos (Si existen en seo-data)
  const ocasionRoutes: MetadataRoute.Sitemap = [];
  if (Array.isArray(OCASIONES)) {
    for (const oc of OCASIONES) {
      const ocSlug = extractSlug(oc);
      if (ocSlug) {
        ocasionRoutes.push({
          url: `${baseUrl}/ocasiones/${ocSlug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return [...staticRoutes, ...weddingRoutes, ...ocasionRoutes];
}
