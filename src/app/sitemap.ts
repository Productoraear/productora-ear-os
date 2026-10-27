import type { MetadataRoute } from 'next';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { MARIACHI_LANDINGS } from '@/lib/mariachi/mariachiLandingCatalog';
import { OTZARRETA_LANDINGS } from '@/lib/seo/otzarreta-dominance-engine';
import { MARIACHI_LANDINGS as CENTRALITA_LANDINGS } from '@/lib/seo/centralita-mariachis-dominance-engine';
import { EVENT_LANDINGS } from '@/lib/seo/ear-eventos-dominance-engine';

// Google indexa el host www (ver GSC export 2026-10-24: el 100% de las páginas son www.productoraear.com).
// El sitemap DEBE declarar el mismo host canónico o Google parte la autoridad entre www y no-www.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

interface StaticRoute {
    path: string;
    priority: number;
    changeFrequency: ChangeFrequency;
}

// Rutas estáticas vendibles: captación, checkout, firma de contratos y páginas estructurales reales.
// Sin doorway, sin bloques duplicados, sin páginas huérfanas.
const STATIC_ROUTES: StaticRoute[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/reservar/solista', priority: 1.0, changeFrequency: 'daily' },
    { path: '/reservar/contrato', priority: 0.95, changeFrequency: 'daily' },
    { path: '/reservar/aceptar', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/panel/reservas', priority: 0.85, changeFrequency: 'daily' },
    { path: '/bodas', priority: 1.0, changeFrequency: 'daily' },
    { path: '/fincas', priority: 0.95, changeFrequency: 'daily' },
    { path: '/fincas/villa-escorial-park', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/fincas/jardines-la-cartuja', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/proveedores', priority: 0.95, changeFrequency: 'daily' },
    { path: '/artistas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/artistas/edwin-agudelo', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/artistas/mariachi-mexicanto', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/academia', priority: 0.9, changeFrequency: 'daily' },
    { path: '/calculadora', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/cotizador', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/presupuesto', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/checkout/presupuesto', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/vimume', priority: 0.95, changeFrequency: 'daily' },
    { path: '/mariachis', priority: 0.95, changeFrequency: 'daily' },
    { path: '/mariachis/unirse', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/centralita-mariachis', priority: 0.95, changeFrequency: 'daily' },
    { path: '/productora-ear', priority: 0.95, changeFrequency: 'daily' },
    { path: '/dj-para-bodas', priority: 0.9, changeFrequency: 'daily' },
    { path: '/catering-de-brasas', priority: 0.85, changeFrequency: 'weekly' },
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

// Rutas hiperlocales de dinero VERIFICADAS en Google Search Console (export 2026-10-24):
// páginas reales de venta que ya rankean en top 10 y reciben clics. Incluirlas en el sitemap
// concentra el presupuesto de rastreo en lo que convierte, en lugar del spray doorway.
const GSC_VERIFIED_MONEY_ROUTES: StaticRoute[] = [
    { path: '/arsenal/alquiler-sonido/rubi', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/ciudad-real/mariachi-gala/alcazar-de-san-juan', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/zaragoza/catering-brasas/zaragoza', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/toledo/edwin-agudelo-mariachi-6/talavera-de-la-reina', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/murcia/mariachi-gala/yecla', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/toledo/bodas-lujo/escalona', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/bilbao/sonido-iluminacion/getxo', priority: 0.9, changeFrequency: 'daily' },
    { path: '/bodas/toledo/catering-brasas/ocana', priority: 0.85, changeFrequency: 'daily' },
    { path: '/bodas/ciudad-real/catering-brasas/daimiel', priority: 0.85, changeFrequency: 'daily' },
    { path: '/arsenal/alquiler-sonido/bilbao', priority: 0.85, changeFrequency: 'daily' },
    { path: '/bodas/zaragoza/mariachi-gala/calatayud', priority: 0.85, changeFrequency: 'daily' },
    { path: '/bodas/granada/catering-brasas/baza', priority: 0.85, changeFrequency: 'daily' },
    { path: '/bodas/cadiz/mariachi-gala/arcos-de-la-frontera', priority: 0.85, changeFrequency: 'daily' },
    { path: '/arsenal/altavoces-line-array/mostoles', priority: 0.85, changeFrequency: 'daily' },
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

    // Sub-landings mariachi de intención (transaccionales), derivadas del
    // catálogo SSOT `MARIACHI_LANDINGS`. Cada una es una página real de venta.
    for (const landing of MARIACHI_LANDINGS) {
        entries.push({
            url: `${BASE_URL}/mariachis/${landing.slug}`,
            lastModified,
            changeFrequency: landing.slug === 'fiestas-patronales' ? 'weekly' : 'daily',
            priority: 0.85,
        });
    }

    // Clúster Otzarreta · Gipuzkoa: hub + 126 landings con entidad verificada
    // (72 geo + 54 intención). Sin entidad verificada detrás no hay URL.
    entries.push({
        url: `${BASE_URL}/otzarreta`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.95,
    });
    for (const landing of OTZARRETA_LANDINGS) {
        entries.push({
            url: `${BASE_URL}${landing.path}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: landing.kind === 'geo' ? 0.8 : 0.75,
        });
    }

    // Clúster Centralita de Mariachis · España + Europa: hub + 220 landings
    // (160 geo + 60 intención) con operador verificado y depósito deducible.
    for (const landing of CENTRALITA_LANDINGS) {
        entries.push({
            url: `${BASE_URL}${landing.path}`,
            lastModified,
            changeFrequency: landing.band === 'europa' ? 'weekly' : 'daily',
            priority: landing.kind === 'geo' ? 0.8 : 0.75,
        });
    }

    // Clúster Productora EAR · Bodas y eventos en España: hub + 268 landings
    // (208 provinciales + 60 intención) sobre las 52 provincias del SSOT.
    for (const landing of EVENT_LANDINGS) {
        entries.push({
            url: `${BASE_URL}${landing.path}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: landing.kind === 'geo' ? 0.8 : 0.75,
        });
    }

    // Páginas hiperlocales de dinero ya verificadas en GSC (top 10, con clics).
    for (const route of GSC_VERIFIED_MONEY_ROUTES) {
        entries.push({
            url: `${BASE_URL}${route.path}`,
            lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        });
    }

    return entries;
}
