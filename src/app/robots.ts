import { MetadataRoute } from 'next';

/**
 * 🤖 CONFIGURACIÓN DE ROBOTS (AEO COMPLIANCE)
 * EAR OS V2 GOLD - PRODUCTORAEAR.COM
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/static/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      }
    ],
    sitemap: 'https://productoraear.com/sitemap.xml',
  };
}
