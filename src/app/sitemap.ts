import type { MetadataRoute } from 'next';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { CANONICAL_SERVICES } from '@/lib/navigation/canonical-taxonomy';

/**
 * Sitemap canónico S-Class (Next.js App Router).
 * Fuente de verdad: https://productoraear.com
 *
 * Estrategia pSEO/AEO alineada a la intención de búsqueda real capturada en
 * Search Console (dj para bodas, mariachis + ciudad, alquiler pantallas led,
 * wedding planner, catering, fotógrafo, coches de boda, fincas, decoración).
 *
 * Ya NO se exportan slugs legacy sin volumen (edwin-agudelo-mariachi-6,
 * bodas-lujo, dj-eventos, cumpleanos-abuela, innovacion-social, etc.):
 * las rutas dinámicas [provincia]/[servicio] normalizan y redirigen con 301.
 */

const BASE_URL = 'https://productoraear.com';

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/bodas', priority: 1.0, changeFrequency: 'daily' },
    { path: '/mariachis', priority: 0.9, changeFrequency: 'daily' },
    { path: '/dj-para-bodas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/artistas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/artistas/edwin-agudelo', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/catering-brasas', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/alquiler-pantallas-led-madrid', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/alquiler-equipos-sonido-audiovisuales', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/fincasparaboda', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/proveedores', priority: 0.8, changeFrequency: 'daily' },
    { path: '/vimume', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/cotizador', priority: 0.9, changeFrequency: 'daily' },
    { path: '/calculadora', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/acg', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/servicios', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/arsenal', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/alquiler', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/instituciones', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/ayuntamientos', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/b2g', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/eventos', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/empresarios', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/precios', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/sos-rescate', priority: 0.5, changeFrequency: 'weekly' },
    { path: '/contacto', priority: 0.5, changeFrequency: 'monthly' },
];

/**
 * Servicios canónicos de bodas con alta intención de búsqueda demostrada.
 * Se omite 'produccion-integral', 'maestros-ceremonia' y 'decoracion' del
 * sitemap pSEO masivo (menor volumen), aunque siguen siendo resolubles.
 */
const HIGH_INTENT_SERVICE_SLUGS = new Set([
    'dj',
    'mariachis',
    'wedding-planner',
    'fotografia',
    'catering',
    'sonorizacion',
    'pantallas-led',
    'fincas',
    'coches-boda',
]);

const PROVINCES = Object.keys(PROVINCIAS_52_GRAPH).sort();
const SERVICES = CANONICAL_SERVICES.filter((s) => HIGH_INTENT_SERVICE_SLUGS.has(s.slug));

export default function sitemap(): MetadataRoute.Sitemap {
    const today = new Date();

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: today,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    // Rutas canónicas provinciales de bodas: /bodas/{provincia}
    const provinceEntries: MetadataRoute.Sitemap = PROVINCES.map((province) => ({
        url: `${BASE_URL}/bodas/${province}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Rutas canónicas de servicio: /bodas/{provincia}/{servicio}
    const serviceEntries: MetadataRoute.Sitemap = [];
    for (const province of PROVINCES) {
        for (const service of SERVICES) {
            serviceEntries.push({
                url: `${BASE_URL}/bodas/${province}/${service.slug}`,
                lastModified: today,
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    return [...staticEntries, ...provinceEntries, ...serviceEntries];
}