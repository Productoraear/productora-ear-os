import { MetadataRoute } from 'next';

/**
 * 🤖 CONFIGURACIÓN DE ROBOTS (AEO COMPLIANCE)
 * VIMUME OS - PRODUCTORAEAR.COM
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/', 
          '/api/', 
          '/_next/', 
          '/static/', 
          '/centro-mando', 
          '/dashboard', 
          '/nexus', 
          '/portal', 
          '/cotizador',
          '/configurador',
          '/descubrir',
          '/soberania-tecnica'
        ],
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
    sitemap: 'https://www.productoraear.com/sitemap.xml',
  };
}
