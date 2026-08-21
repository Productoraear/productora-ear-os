import { MetadataRoute } from 'next';

/**
 * 🤖 DIRECTIVA CANÓNICA DE RASTREO ROBOTS.TS (S-CLASS SEO & AEO)
 * Desbloqueo total del catálogo territorial y relacional para Googlebot, Bingbot y Motores de IA (GEO).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.productoraear.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/', '/assets/', '/images/', '/fonts/'],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/nexus/',
          '/portal/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/', '/assets/', '/images/'],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/nexus/',
          '/portal/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/assets/', '/images/'],
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/_next/', '/assets/'],
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot'],
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/dashboard/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
