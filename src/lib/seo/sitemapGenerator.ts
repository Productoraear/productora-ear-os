import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { CHRISTMAS_LIGHTING_PRODUCTS } from '@/data/luces-navidad';
import { MUNICIPALITIES_DATASET, SERVICES_PSEO_EXPANDED } from '@/lib/constants/spanish-municipalities';
import { MUNICIPALITIES_DATABASE } from '@/lib/geo/spanish-municipalities';
import { isProviderPublic } from '@/lib/providers/visibility';
import { CANONICAL_GREMIO_SLUGS } from '@/lib/seo/searchIntentEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import curatedProviders from '@/data/curated_providers.json';
import sitemapRoutes from '@/data/sitemap_routes_index.json';
import gscIntentData from '@/data/telemetry/gsc-sitemap-intent-landings.json';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

export const SITEMAP_PARTITIONS = ['0', '1', '2', '3', '4', '5'] as const;

// Servicios prioritarios regionales por provincia
const REGIONAL_SERVICES = [
  'dj',
  'mariachis',
  'sonido-iluminacion',
  'catering-brasas',
  'fotografia',
  'fincas',
  'wedding-planner',
  'pantallas-led',
  'coches-boda',
  'alquiler-pantallas-led',
  'fiestas-patronales-ayuntamientos'
];

// Función ultra-estricta de sanitización y validación de slugs (RFC 3986 & XML Sitemap SOTA)
const sanitizeSlug = (input: unknown): string | null => {
  if (!input || typeof input !== 'string') return null;
  const clean = input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos diacríticos
    .replace(/[^a-z0-9\-]/g, '-')    // Reemplazar caracteres no estándar y espacios por guiones
    .replace(/-+/g, '-')             // Colapsar guiones múltiples
    .replace(/^-|-$/g, '');          // Recortar guiones iniciales o finales

  // Longitud canónica válida
  if (clean.length < 3 || clean.length > 70) return null;

  // Filtro anti-basura y anti-scraping artifacts
  if (
    clean.includes('base-de-datos') ||
    clean.includes('bodasnet') ||
    clean.includes('undefined') ||
    clean.includes('null') ||
    clean.includes('test') ||
    (clean.startsWith('prov-slug-') && clean.length > 45)
  ) {
    return null;
  }

  return clean;
};

// Helper para deduplicación y filtro inmutable RFC 3986
function createEntryBuilder() {
  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (
    url: string,
    priority: number,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly'
  ) => {
    const cleanUrl = url.trim().replace(/\/+$/, '');

    // FILTRO INMUTABLE S-CLASS: Bloqueo estricto de cualquier URL con espacios o caracteres no RFC 3986
    if (/[\s()<>"'{}\\]/.test(cleanUrl)) {
      return;
    }

    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);
      entries.push({
        url: cleanUrl,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency,
        priority
      });
    }
  };

  return { addEntry, entries };
}

export async function generateSitemapPartition(partitionId: string): Promise<MetadataRoute.Sitemap> {
  const { addEntry, entries } = createEntryBuilder();

  switch (partitionId) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 0: CORE — Páginas estructurales, checkout, artistas, fincas, catálogo
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '0': {
      // Checkout transaccional & captación inmediata (P0 REVENUE)
      addEntry(`${BASE_URL}`, 1.0, 'daily');
      addEntry(`${BASE_URL}/reservar`, 1.0, 'daily');
      addEntry(`${BASE_URL}/reservar/solista`, 1.0, 'daily');
      addEntry(`${BASE_URL}/bodas`, 1.0, 'daily');
      addEntry(`${BASE_URL}/mariachis`, 0.95, 'daily');
      addEntry(`${BASE_URL}/dj-para-bodas`, 0.95, 'daily');
      addEntry(`${BASE_URL}/bodas/dj`, 1.0, 'daily');
      addEntry(`${BASE_URL}/artistas`, 0.95, 'daily');
      addEntry(`${BASE_URL}/artistas/edwin-agudelo`, 0.95, 'weekly');
      addEntry(`${BASE_URL}/artistas/representacion`, 0.95, 'daily');
      addEntry(`${BASE_URL}/catering-brasas`, 0.95, 'weekly');
      addEntry(`${BASE_URL}/arroces`, 0.98, 'daily');
      addEntry(`${BASE_URL}/alquiler-pantallas-led-madrid`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/alquiler-equipos-sonido-audiovisuales`, 0.90, 'weekly');

      // Fincas Homologadas S-Class & Directorios
      addEntry(`${BASE_URL}/fincas`, 0.95, 'daily');
      addEntry(`${BASE_URL}/fincasparaboda`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/fincas-landing`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/fincas/portal-demostrativo`, 0.85, 'weekly');

      const fincaProvinces = new Set(
        SCLASS_12_FINCAS_HOMOLOGADAS.map((f) => normalizeForUrl(f.provincia)),
      );
      for (const prov of fincaProvinces) {
        addEntry(`${BASE_URL}/fincas/${prov}`, 0.85, 'weekly');
      }
      for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
        addEntry(
          `${BASE_URL}/fincas/${finca.slug}`,
          finca.slug === 'villa-escorial-park' ? 1.0 : 0.90,
          finca.slug === 'villa-escorial-park' ? 'daily' : 'weekly'
        );
      }
      addEntry(`${BASE_URL}/fincas/jardines-la-cartuja`, 0.90, 'weekly');

      // Directorio y Proveedores
      addEntry(`${BASE_URL}/directorio`, 0.96, 'daily');
      addEntry(`${BASE_URL}/proveedores`, 0.96, 'daily');
      addEntry(`${BASE_URL}/proveedores-servicios`, 0.96, 'daily');

      // VIMUME & Neuroacústica
      addEntry(`${BASE_URL}/vimume`, 0.95, 'daily');
      addEntry(`${BASE_URL}/vimume/propuesta`, 0.98, 'daily');
      addEntry(`${BASE_URL}/vimume/archivo-clinico`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/vimume/clinica`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/vimume/centros`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/vimume/familia`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/asociaciones`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/investigacion`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/terapia-ocupacional`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/piloto-5-centros`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/fondos-europeos`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/vimume/inversion`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/proyectos/vimume/alzheimer`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/proyectos/vimume/ods-2030`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/proyectos/vimume/silver-economy`, 0.85, 'weekly');

      // Herramientas y Calculadoras
      addEntry(`${BASE_URL}/cotizador`, 0.90, 'daily');
      addEntry(`${BASE_URL}/calculadora`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/acg`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/servicios`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/categorias`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/arsenal`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/arsenal/luces-navidad`, 0.95, 'daily');
      addEntry(`${BASE_URL}/alquiler`, 0.92, 'daily');
      addEntry(`${BASE_URL}/instituciones`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/instituciones/catalogo-360`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/ayuntamientos`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/ocasiones/ayuntamientos`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/b2g`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/eventos`, 0.95, 'daily');
      addEntry(`${BASE_URL}/eventos/municipales`, 0.95, 'daily');
      addEntry(`${BASE_URL}/empresarios`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/sos-rescate`, 0.90, 'daily');
      addEntry(`${BASE_URL}/contacto`, 0.60, 'monthly');

      // Hubs de Rango S-Class
      addEntry(`${BASE_URL}/mariachis/unirse`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/simulacion-mariachis`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/alianzas`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/academia`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/academia/oraculo`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/voicestudio/studio-pro`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/artistas/estudio`, 0.88, 'weekly');
      addEntry(`${BASE_URL}/neural-journey`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/oraculo`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/afiliados`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/precios`, 0.80, 'weekly');
      addEntry(`${BASE_URL}/presupuesto`, 0.80, 'weekly');
      addEntry(`${BASE_URL}/soberania-tecnica`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/the-signal`, 0.75, 'weekly');
      addEntry(`${BASE_URL}/dossier`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/reclamar-perfil`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/blog`, 0.85, 'daily');
      addEntry(`${BASE_URL}/blog/auditoria-fincas-b2b`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/lcsp-ayuntamientos-118`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/vimume-evidencia-clinica`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/b2g`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/casos-clinicos`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/impacto-social`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/investigacion`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/tecnica-sonora`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/aviso-legal`, 0.30, 'yearly');
      addEntry(`${BASE_URL}/privacidad`, 0.30, 'yearly');
      addEntry(`${BASE_URL}/cookies`, 0.30, 'yearly');

      // Artistas roster S-Class
      const rosterArtists = [
        'edwin-agudelo',
        'mariachi-mexicanto',
        'mariachi-vargas-madrid',
        'mariachi-sol-castilla',
        'cuarteto-cuerdas-gala',
        'dj-eventos-sound'
      ];
      for (const art of rosterArtists) {
        addEntry(`${BASE_URL}/artistas/${art}`, 0.85, 'weekly');
      }
      addEntry(`${BASE_URL}/artistas/edwin-agudelo/ultra-luxury-nda`, 0.75, 'monthly');

      // Catálogo oficial 2026 de alumbrado monumental (530+ productos)
      try {
        for (const prod of CHRISTMAS_LIGHTING_PRODUCTS) {
          if (prod.canonicalUrl) {
            addEntry(`${BASE_URL}${prod.canonicalUrl}`, 0.80, 'weekly');
          }
        }
      } catch (err) {
        console.warn('[SITEMAP-0] Error leyendo catálogo de luces de Navidad:', err);
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 1: TERRITORIAL — 52 provincias × servicios regionales
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '1': {
      const provinceSlugs = Object.keys(PROVINCIAS_52_GRAPH);
      for (const prov of provinceSlugs) {
        addEntry(`${BASE_URL}/bodas/${prov}`, 0.85, 'weekly');
        addEntry(`${BASE_URL}/bodas/${prov}/eventos`, 0.85, 'weekly');
        addEntry(`${BASE_URL}/b2g/${prov}`, 0.85, 'weekly');

        // Servicios regionales de bodas S-Class
        for (const s of REGIONAL_SERVICES) {
          addEntry(`${BASE_URL}/bodas/${prov}/${s}`, 0.90, 'weekly');
        }

        for (const serv of CANONICAL_GREMIO_SLUGS) {
          addEntry(`${BASE_URL}/servicios/${serv}/${prov}`, 0.90, 'weekly');
        }
      }

      // Alquiler de Arsenal Audiovisual por poblaciones (S-Class pSEO >90% único)
      for (const muni of MUNICIPALITIES_DATABASE) {
        if (muni.slug) {
          addEntry(`${BASE_URL}/alquiler/${muni.slug}`, 0.88, 'weekly');
        }
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 2: PSEO — Municipios × servicios expandidos (alta conversión)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '2': {
      const servicePseoList = SERVICES_PSEO_EXPANDED || [];
      for (const provKey of Object.keys(MUNICIPALITIES_DATASET)) {
        const towns = MUNICIPALITIES_DATASET[provKey] || [];
        for (const t of towns) {
          // Anti-duplicados: Evitar /bodas/madrid/dj/madrid cuando la provincia coincide con el municipio
          if (!t.slug || t.slug.toLowerCase() === provKey.toLowerCase()) continue;
          for (const s of servicePseoList) {
            const sPath = s.path || s.id;
            if (sPath) {
              addEntry(`${BASE_URL}/bodas/${provKey}/${sPath}/${t.slug}`, 0.75, 'weekly');
            }
          }
        }
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 3: PROVEEDORES CURADOS (all_providers_database.json)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '3': {
      try {
        const rawProviders = curatedProviders as any;
        const providersList: Array<{ slug?: string; atomic_specs?: { slug?: string }; id?: string; name?: string }> =
          Array.isArray(rawProviders) ? rawProviders : (rawProviders?.default || []);

        providersList.forEach(provider => {
          if (!isProviderPublic(provider)) return;
          const hasSemanticSlug = provider.slug && !provider.slug.toLowerCase().startsWith('prov-');
          const rawSlug = hasSemanticSlug
            ? provider.slug!
            : (provider.name || provider.atomic_specs?.slug || provider.slug || provider.id);
          const validSlug = sanitizeSlug(rawSlug);
          if (validSlug) {
            addEntry(`${BASE_URL}/proveedores/${validSlug}`, 0.70, 'weekly');
          }
        });
      } catch (err) {
        console.warn('[SITEMAP-3] Error procesando curated_providers:', err);
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 4: RUTAS ESTRATÉGICAS Y PROVEEDORES (sitemap_routes_index.json)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '4': {
      try {
        const rawRoutes = sitemapRoutes as any;
        const routes: string[] = Array.isArray(rawRoutes) ? rawRoutes : (rawRoutes?.default || []);

        for (const routeUrl of routes) {
          if (routeUrl && typeof routeUrl === 'string') {
            addEntry(routeUrl, 0.75, 'weekly');
          }
        }
      } catch (err) {
        console.warn('[SITEMAP-4] Error procesando sitemap_routes_index:', err);
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 5: GSC INTENT LANDINGS (gsc-sitemap-intent-landings.json)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '5': {
      try {
        const rawIntents = gscIntentData as any;
        const intentObj = rawIntents?.default || rawIntents || {};
        const allIntents: Array<{ canonicalUrl?: string; internalPath?: string; opportunityScore?: number }> =
          intentObj.allIntents || (Array.isArray(rawIntents) ? rawIntents : []);

        for (const item of allIntents) {
          if (!item.canonicalUrl) continue;
          // Ponderación dinámica de prioridad según Opportunity Score
          const opp = item.opportunityScore || 0;
          const priority = opp > 20 ? 0.95 : opp > 10 ? 0.85 : 0.75;
          addEntry(item.canonicalUrl, priority, 'daily');
        }
      } catch (err) {
        console.warn('[SITEMAP-5] Error procesando gsc-sitemap-intent-landings:', err);
      }
      break;
    }

    default:
      break;
  }

  return entries;
}
