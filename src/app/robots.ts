import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

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
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    };
}
