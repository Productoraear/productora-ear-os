import { MetadataRoute } from 'next';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';

/**
 * 🛰️ GENERADOR DE SITEMAP ESTÁTICO (V126 - FINAL STITCH)
 * EAR OS GOLD - PRODUCTORAEAR.COM
 * 
 * Garantiza indexación de las 2,022 rutas sin dependencia de DB en tiempo de build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://productoraear.com';

  // 1. Páginas Core (Prioridad Máxima)
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/centro-mando`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/admin/configurador`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/eventos`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
  ];

  // 2. Generación del Enjambre (Marketplace x Territorio)
  const dynamicPages: MetadataRoute.Sitemap = [];

  SERVICIOS.forEach((service) => {
    const categorySlug = service.slug;

    PROVINCIAS.forEach((province) => {
      const provinceSlug = province.toLowerCase();
      const url = `${baseUrl}/servicios/${categorySlug}/${provinceSlug}`;

      // Lógica de Prioridad Omega
      let priority = 0.7;
      if (categorySlug.includes('mariachi') || categorySlug.includes('mundial') || categorySlug.includes('sonorizacion')) {
        priority = 1.0; // Foco Estratégico
      }

      dynamicPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
      });
    });
  });

  return [...corePages, ...dynamicPages];
}
