import { MetadataRoute } from 'next';

/**
 * 🤖 DIRECTIVA CANÓNICA DE RASTREO ROBOTS.TXT (S-CLASS SEO & AEO)
 * Desbloqueo total del catálogo territorial y relacional para Googlebot, Bingbot y Motores de IA (GEO).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.productoraear.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/nexus/',
          '/portal/',
          '/*?*', // Bloquea parámetros de query innecesarios para preservar Crawl Budget
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/nexus/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
