import type { MetadataRoute } from 'next';
import { resolveSitemapOrigin } from '@/lib/seo/canonicalSite';

/**
 * robots.txt — declara TODOS los sitemaps públicos, no solo el curado.
 *
 * Hallazgo medido el 2026-10-30 en producción (439 bytes de respuesta):
 *   `Sitemap: https://www.productoraear.com/sitemap.xml`
 * Es decir, el rastreador solo recibía el `<urlset>` curado (~778 URLs) y nunca
 * supo que existían las 6 particiones del catálogo masivo. Un sitemap que no se
 * declara ni se enlaza desde otro sitemap no se descubre: GSC reportaba un
 * puñado de URLs frente a las ~7.150 reales.
 *
 * Orden de declaración = orden de rastreo deseado:
 *   1. /sitemap-index.xml      índice maestro (hijos: curado + predictivo + 6 particiones)
 *   2. /sitemap.xml            rutas curadas que venden (dinero primero)
 *   3. /sitemap-predictivo.xml temperatura de lead (CALIENTE/TEMPLADO/FRIO)
 *
 * Las particiones NO se declaran aquí: viven bajo /sitemaps/ y se descubren por
 * el índice maestro. Declararlas tres veces solo duplica el rastreo.
 */
const BASE_URL = resolveSitemapOrigin();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/_next/',
                    '/assets/',
                    '/images/',
                    '/fonts/',
                    '/llms.txt',
                    '/llms-full.txt',
                    // Sitemaps públicos: deben ser rastreables aunque un día se
                    // endurezca el Disallow de abajo. Un sitemap bloqueado es
                    // un sitemap invisible.
                    '/sitemap.xml',
                    '/sitemap-index.xml',
                    '/sitemap-predictivo.xml',
                    '/sitemaps/',
                ],
                disallow: [
                    '/api/',
                    '/admin/',
                    '/dashboard',
                    '/checkout',
                    '/dossier/',
                    '/propuesta/',
                    '/nexus/',
                    '/portal/',
                    '/login',
                    '/proveedores/prov-',
                ],
            },
        ],
        sitemap: [
            `${BASE_URL}/sitemap-index.xml`,
            `${BASE_URL}/sitemap.xml`,
            `${BASE_URL}/sitemap-predictivo.xml`,
        ],
        host: BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    };
}

