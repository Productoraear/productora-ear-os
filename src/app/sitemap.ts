import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS, OCASIONES, GUIAS } from '@/lib/constants/seo-data';
import { HIGH_VALUE_VARIANTS } from '@/lib/artists/matrix';
import { generateTotalMatrix } from '@/config/seo-matrix';

const now = new Date();
const baseUrl = 'https://productoraear.com';

const unique = <T extends { url: string }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true)));
};

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/vimume`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/hermes`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/nosotros`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/investigacion`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/inversion`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/roadmap`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/centros`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/eventos`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/contacto`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/contacto`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/eventos`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas/edwin-agudelo`, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/artists`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artists/roster`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artists/releases`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artists/press`, lastModified: now, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/servicios`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/presupuesto`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/afiliados`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/dossier`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
  ];

  const occasionPages = OCASIONES.map(o => ({ url: `${baseUrl}/ocasiones/${o.slug}`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' as const }));
  const guidePages = GUIAS.map(g => ({ url: `${baseUrl}/guias/${g.slug}`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' as const }));
  const servicePages = SERVICIOS.map(s => ({ url: `${baseUrl}/servicios/${s.slug}`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' as const }));
  const matrixPages = HIGH_VALUE_VARIANTS.map(v => ({ url: `${baseUrl}/artistas/${v.slug}`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' as const, indexable: (v as any).indexable ?? true }));

  const dynamicPages = [] as any[];
  SERVICIOS.forEach(service => {
    PROVINCIAS.forEach(province => {
      const url = `${baseUrl}/servicios/${service.slug}/${province.toLowerCase()}`;
      const priority = /mariachi|edwin-agudelo|vimume/.test(service.slug) ? 0.8 : 0.6;
      dynamicPages.push({ url, lastModified: now, changeFrequency: 'monthly' as const, priority, indexable: priority >= 0.8 });
    });
  });

  const provinceEntries = PROVINCIAS.map(p => ({ url: `${baseUrl}/servicios/mariachis/${p}`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' as const }));

  // Generador de Nodos Infinitos (Geo-AI S-Class)
  const matrixCombinations = generateTotalMatrix().map(combo => ({
    url: `${baseUrl}/servicios/mariachis/${combo.provincia}/${combo.evento}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: 'weekly' as const
  }));

  return unique([
    ...corePages,
    ...occasionPages,
    ...guidePages,
    ...servicePages,
    ...dynamicPages.filter(p => p.indexable !== false),
    ...matrixPages.filter(p => p.indexable !== false),
    ...provinceEntries,
    ...matrixCombinations
  ].map(({ indexable, ...rest }: any) => rest));
}
