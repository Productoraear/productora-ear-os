import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS, OCASIONES, GUIAS } from '@/lib/constants/seo-data';

/**
 * 🛰️ VIMUME OS - CANONICAL SITEMAP GENERATOR (V165.L)
 * Purpose: Architecting a high-authority search index for the VIMUME flagship and stakeholder facade.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://productoraear.com';

  // 1. CLÚSTER VIMUME (Vertical Institucional Blindada)
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/vimume`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/nosotros`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/investigacion`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/inversion`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/roadmap`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/centros`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/eventos`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/faq`, lastModified: new Date(), priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/contacto`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/eventos`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/servicios`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/dossier`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
  ];

  // 2. CLÚSTER OCASIONES (Search Intent)
  const occasionPages: MetadataRoute.Sitemap = OCASIONES.map(o => ({
    url: `${baseUrl}/ocasiones/${o.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly'
  }));

  // 3. CLÚSTER GUÍAS (Informational Authority)
  const guidePages: MetadataRoute.Sitemap = GUIAS.map(g => ({
    url: `${baseUrl}/guias/${g.slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFrequency: 'monthly'
  }));

  // 4. CLÚSTER SERVICIOS (Commercial Verticals)
  const servicePages: MetadataRoute.Sitemap = SERVICIOS.map(s => ({
    url: `${baseUrl}/servicios/${s.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly'
  }));

  // 5. CLÚSTER TERRITORIAL (SEO Swarm x Province)
  const dynamicPages: MetadataRoute.Sitemap = [];

  SERVICIOS.forEach((service) => {
    const categorySlug = service.slug;

    PROVINCIAS.forEach((province) => {
      const provinceSlug = province.toLowerCase();
      const url = `${baseUrl}/servicios/${categorySlug}/${provinceSlug}`;

      // VIMUME & Priority Logic
      let priority = 0.6;
      if (categorySlug.includes('mariachi') || categorySlug.includes('edwin-agudelo') || categorySlug.includes('vimume')) {
        priority = 0.8; 
      }

      dynamicPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
      });
    });
  });

  return [
    ...corePages, 
    ...occasionPages, 
    ...guidePages, 
    ...servicePages, 
    ...dynamicPages
  ];
}
