import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';

const LOCALIDADES_TOP = [
  'alcala-de-henares', 'alcobendas', 'alcorcon', 'aranjuez', 'arganda-del-rey',
  'collado-villalba', 'fuenlabrada', 'getafe', 'las-rozas', 'leganes',
  'mahadahonda', 'mostoles', 'parla', 'pozuelo-de-alarcon', 'san-sebastian-de-los-reyes',
  'talavera-de-la-reina', 'illescas', 'mentrida', 'torrijos', 'otero'
];

const extractSlug = (item: any): string | null => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  return item.slug || item.id || String(item);
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';
  const provList = Array.isArray(PROVINCIAS) ? PROVINCIAS : [];
  const servList = Array.isArray(SERVICIOS) ? SERVICIOS : [];

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

  const programmaticRoutes: MetadataRoute.Sitemap = [];

  for (const prov of provList) {
    const provSlug = extractSlug(prov);
    if (!provSlug) continue;

    for (const serv of servList) {
      const servSlug = extractSlug(serv);
      if (!servSlug) continue;

      programmaticRoutes.push({
        url: `${baseUrl}/bodas/${provSlug}/${servSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      for (const mun of LOCALIDADES_TOP) {
        programmaticRoutes.push({
          url: `${baseUrl}/bodas/${provSlug}/${servSlug}/${mun}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return [...staticRoutes, ...programmaticRoutes];
}
