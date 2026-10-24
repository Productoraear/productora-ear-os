import type { MetadataRoute } from 'next';

// Host canónico alineado con lo que Google ya indexa (www). Ver GSC export 2026-10-24.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/_next/', '/assets/', '/images/', '/fonts/', '/llms.txt', '/llms-full.txt'],
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
        sitemap: [`${BASE_URL}/sitemap.xml`],
        host: BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    };
}
