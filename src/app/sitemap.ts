import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { CHRISTMAS_LIGHTING_PRODUCTS } from '@/data/luces-navidad';
import { MUNICIPALITIES_DATASET, SERVICES_PSEO_EXPANDED } from '@/lib/constants/spanish-municipalities';
import { isProviderPublic } from '@/lib/providers/visibility';

const BASE_URL = 'https://www.productoraear.com';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITEMAP INDEX STRATEGY (SOTA GSC)
// Particiones:
//   0 = core (páginas estructurales + artistas + checkout + catálogo luces)
//   1 = territorial (52 provincias × servicios regionales)
//   2 = pseo (municipios × servicios expandidos — alta conversión)
//   3 = proveedores-curados (all_providers_database.json)
//   4 = proveedores-cosechados (bodas-vendors-harvested.json)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function generateSitemaps() {
  return [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];
}

// Servicios prioritarios por provincia
const REGIONAL_SERVICES = [
  'mariachis',
  'sonido-iluminacion',
  'dj',
  'alquiler-pantallas-led',
  'catering-brasas',
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

// Helper para deduplicación y filtro inmutable
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

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const partitionId = await props.id;
  const { addEntry, entries } = createEntryBuilder();

  switch (partitionId) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 0: CORE — Páginas estructurales, checkout, artistas, catálogo
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '0': {
      // Checkout transaccional & captación inmediata (P0 REVENUE)
      addEntry(`${BASE_URL}/reservar/solista`, 1.0, 'daily');
      addEntry(`${BASE_URL}/vimume/propuesta`, 0.98, 'daily');
      addEntry(`${BASE_URL}/arroces`, 0.98, 'daily');
      addEntry(`${BASE_URL}/catering-brasas`, 0.95, 'weekly');
      addEntry(`${BASE_URL}/artistas/representacion`, 0.95, 'daily');
      addEntry(`${BASE_URL}/eventos/municipales`, 0.95, 'daily');
      addEntry(`${BASE_URL}/instituciones/catalogo-360`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/vimume/archivo-clinico`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/fincas`, 0.92, 'weekly');
      addEntry(`${BASE_URL}/estudio-diseno`, 0.85, 'weekly');

      // Páginas estructurales
      addEntry(`${BASE_URL}`, 1.0, 'daily');
      addEntry(`${BASE_URL}/eventos`, 0.95, 'daily');
      addEntry(`${BASE_URL}/artistas`, 0.95, 'daily');
      addEntry(`${BASE_URL}/bodas`, 0.95, 'daily');
      addEntry(`${BASE_URL}/vimume`, 0.90, 'daily');
      addEntry(`${BASE_URL}/academia`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/calculadora`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/alquiler-equipos-sonido-audiovisuales`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/alquiler-pantallas-led-madrid`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/ocasiones/ayuntamientos`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/b2g`, 0.90, 'weekly');
      addEntry(`${BASE_URL}/arsenal`, 0.85, 'weekly');
      addEntry(`${BASE_URL}/arsenal/luces-navidad`, 0.95, 'daily');
      addEntry(`${BASE_URL}/contacto`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/cotizador`, 0.80, 'weekly');
      addEntry(`${BASE_URL}/precios`, 0.80, 'weekly');
      addEntry(`${BASE_URL}/presupuesto`, 0.80, 'weekly');
      addEntry(`${BASE_URL}/soberania-tecnica`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/the-signal`, 0.75, 'weekly');
      addEntry(`${BASE_URL}/dossier`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/empresarios`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/reclamar-perfil`, 0.75, 'monthly');
      addEntry(`${BASE_URL}/blog`, 0.85, 'daily');
      addEntry(`${BASE_URL}/blog/auditoria-fincas-b2b`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/lcsp-ayuntamientos-118`, 0.80, 'monthly');
      addEntry(`${BASE_URL}/blog/vimume-evidencia-clinica`, 0.80, 'monthly');
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
        addEntry(`${BASE_URL}/artistas/${art}`, 0.80, 'weekly');
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

        for (const serv of REGIONAL_SERVICES) {
          addEntry(`${BASE_URL}/servicios/${serv}/${prov}`, 0.85, 'weekly');
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
          if (t.slug) {
            for (const s of servicePseoList) {
              const sPath = s.path || s.id;
              if (sPath) {
                addEntry(`${BASE_URL}/bodas/${provKey}/${sPath}/${t.slug}`, 0.75, 'weekly');
              }
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
        const curatedPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
        if (fs.existsSync(curatedPath)) {
          const raw = fs.readFileSync(curatedPath, 'utf-8');
          const allProviders: Array<{ slug?: string; atomic_specs?: { slug?: string }; id?: string; name?: string }> = JSON.parse(raw);

          allProviders.forEach(provider => {
            if (!isProviderPublic(provider)) return;
            const rawSlug = provider.slug || provider.atomic_specs?.slug || provider.id;
            const validSlug = sanitizeSlug(rawSlug);
            if (validSlug) {
              addEntry(`${BASE_URL}/proveedores/${validSlug}`, 0.70, 'weekly');
            }
          });
        }
      } catch (err) {
        console.warn('[SITEMAP-3] Error leyendo all_providers_database:', err);
      }
      break;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTITION 4: PROVEEDORES COSECHADOS (bodas-vendors-harvested.json)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    case '4': {
      try {
        const harvestedPath = path.join(process.cwd(), 'src', 'data', 'bodas-vendors-harvested.json');
        if (fs.existsSync(harvestedPath)) {
          const raw = fs.readFileSync(harvestedPath, 'utf-8');
          const harvestedVendors: Array<{ slug?: string; id?: string; name?: string }> = JSON.parse(raw);

          for (const v of harvestedVendors) {
            if (!isProviderPublic(v)) continue;
            const rawSlug = v.slug || v.id || v.name;
            const validSlug = sanitizeSlug(rawSlug);
            if (validSlug) {
              addEntry(`${BASE_URL}/proveedores/${validSlug}`, 0.65, 'monthly');
            }
          }
        }
      } catch (err) {
        console.warn('[SITEMAP-4] Error leyendo bodas-vendors-harvested:', err);
      }
      break;
    }

    default:
      break;
  }

  return entries;
}
