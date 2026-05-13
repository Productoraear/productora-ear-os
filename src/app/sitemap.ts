import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS, OCASIONES, GUIAS } from '@/lib/constants/seo-data';

/**
 * 🛰️ GENERADOR DE SITEMAP MULTIVARIANTE (V159 - MARKETPLACE UI)
 * EAR OS GOLD - PRODUCTORAEAR.COM
 * 
 * Implementa una arquitectura de enjambre organizada por familias de intención.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ear-psi.vercel.app';

  // 1. CLÚSTER CORE (Prioridad Máxima)
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/centro-mando`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/eventos`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/descubrir`, lastModified: new Date(), priority: 1.0, changeFrequency: 'always' },
  ];

  // 2. CLÚSTER OCASIONES (Intención de Búsqueda)
  const occasionPages: MetadataRoute.Sitemap = OCASIONES.map(o => ({
    url: `${baseUrl}/ocasiones/${o.slug}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'weekly'
  }));

  // 3. CLÚSTER GUÍAS (Autoridad Informacional)
  const guidePages: MetadataRoute.Sitemap = GUIAS.map(g => ({
    url: `${baseUrl}/guias/${g.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'monthly'
  }));

  // 4. CLÚSTER SERVICIOS (Verticales)
  const servicePages: MetadataRoute.Sitemap = SERVICIOS.map(s => ({
    url: `${baseUrl}/servicios/${s.slug}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'weekly'
  }));

  // 5. CLÚSTER TERRITORIAL (Enjambre x Provincia)
  const dynamicPages: MetadataRoute.Sitemap = [];

  SERVICIOS.forEach((service) => {
    const categorySlug = service.slug;

    PROVINCIAS.forEach((province) => {
      const provinceSlug = province.toLowerCase();
      const url = `${baseUrl}/servicios/${categorySlug}/${provinceSlug}`;

      // Lógica de Prioridad S-Class
      let priority = 0.6;
      if (categorySlug.includes('mariachi') || categorySlug.includes('edwin-agudelo') || categorySlug.includes('vimume')) {
        priority = 0.8; // Foco Estratégico EAR
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
