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

export async function generateSitemaps() {
  const provList = Array.isArray(PROVINCIAS) ? PROVINCIAS : [];
  return provList.map((_, index) => ({ id: index }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';
  const provList = Array.isArray(PROVINCIAS) ? PROVINCIAS : [];
  const targetProv = provList[id] || provList[0] || 'madrid';
  const provSlug = extractSlug(targetProv);

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const servList = Array.isArray(SERVICIOS) ? SERVICIOS : [];

  for (const serv of servList) {
    const servSlug = extractSlug(serv);
    if (provSlug && servSlug) {
      sitemapEntries.push({
        url: `${baseUrl}/bodas/${provSlug}/${servSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      for (const mun of LOCALIDADES_TOP) {
        sitemapEntries.push({
          url: `${baseUrl}/bodas/${provSlug}/${servSlug}/${mun}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return sitemapEntries;
}
