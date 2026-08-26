import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';

  const routes = [
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
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
