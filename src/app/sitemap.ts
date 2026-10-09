import type { MetadataRoute } from 'next';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

interface StaticRoute {
    path: string;
    priority: number;
    changeFrequency: ChangeFrequency;
}

// Rutas estáticas vendibles: captación, checkout y páginas estructurales reales.
// Sin doorway, sin bloques duplicados, sin páginas huérfanas.
const STATIC_ROUTES: StaticRoute[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/bodas', priority: 1.0, changeFrequency: 'daily' },
    { path: '/fincas', priority: 0.95, changeFrequency: 'daily' },
    { path: '/proveedores', priority: 0.95, changeFrequency: 'daily' },
    { path: '/artistas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/artistas/edwin-agudelo', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/academia', priority: 0.9, changeFrequency: 'daily' },
    { path: '/calculadora', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/cotizador', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/presupuesto', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/checkout/presupuesto', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/vimume', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/mariachis', priority: 0.9, changeFrequency: 'daily' },
    { path: '/dj-para-bodas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/catering-brasas', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/arroces', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/alquiler-equipos-sonido-audiovisuales', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/alquiler-pantallas-led-madrid', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/rider-tecnico', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/b2g', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/ayuntamientos', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/empresarios', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/precios', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/servicios', priority: 0.75, changeFrequency: 'weekly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    const entries: MetadataRoute.Sitemap = [];

    for (const route of STATIC_ROUTES) {
        entries.push({
            url: `${BASE_URL}${route.path}`,
            lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        });
    }

    // Rutas provinciales reales que venden, derivadas del SSOT canónico (52 provincias).
    // /bodas/{provincia} y /fincas/{provincia} renderizan páginas dinámicas reales.
    const provinceSlugs: string[] = Object.keys(PROVINCIAS_52_GRAPH);

    for (const slug of provinceSlugs) {
        entries.push({
            url: `${BASE_URL}/bodas/${slug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        });
        entries.push({
            url: `${BASE_URL}/fincas/${slug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    }

    return entries;
}