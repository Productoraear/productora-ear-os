import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { CHRISTMAS_LIGHTING_PRODUCTS } from '@/data/luces-navidad';

const BASE_URL = 'https://www.productoraear.com';

// Servicios prioritarios por provincia
const REGIONAL_SERVICES = [
  'mariachis',
  'sonido-iluminacion',
  'dj',
  'alquiler-pantallas-led',
  'catering-brasas',
  'fiestas-patronales-ayuntamientos'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];
  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addEntry = (url: string, priority: number, changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly') => {
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push({
        url,
        lastModified: now,
        changeFrequency,
        priority
      });
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. PÁGINAS ESTRUCTURALES Y ARQUITECTURA S-CLASS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  addEntry(`${BASE_URL}/`, 1.0, 'daily');
  addEntry(`${BASE_URL}/eventos`, 0.95, 'daily');
  addEntry(`${BASE_URL}/artistas`, 0.95, 'daily');
  addEntry(`${BASE_URL}/bodas`, 0.95, 'daily');
  addEntry(`${BASE_URL}/vimume`, 0.90, 'daily');
  addEntry(`${BASE_URL}/academia`, 0.90, 'weekly');
  addEntry(`${BASE_URL}/calculadora`, 0.85, 'weekly');
  addEntry(`${BASE_URL}/alquiler-equipos-sonido-audiovisuales`, 0.90, 'weekly');
  addEntry(`${BASE_URL}/alquiler-pantallas-led-madrid`, 0.85, 'weekly');
  addEntry(`${BASE_URL}/catering-brasas`, 0.85, 'weekly');
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. MATRIZ TERRITORIAL SOBERANA (52 PROVINCIAS DE ESPAÑA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const provinceSlugs = Object.keys(PROVINCIAS_52_GRAPH);
  for (const prov of provinceSlugs) {
    // Hub provincial de bodas y eventos
    addEntry(`${BASE_URL}/bodas/${prov}`, 0.85, 'weekly');
    addEntry(`${BASE_URL}/bodas/${prov}/eventos`, 0.85, 'weekly');
    addEntry(`${BASE_URL}/b2g/${prov}`, 0.85, 'weekly');

    // Servicios verticales por provincia
    for (const serv of REGIONAL_SERVICES) {
      addEntry(`${BASE_URL}/servicios/${serv}/${prov}`, 0.85, 'weekly');
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. CATÁLOGO OFICIAL 2026 DE ALUMBRADO MONUMENTAL (530 PRODUCTOS)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  try {
    for (const prod of CHRISTMAS_LIGHTING_PRODUCTS) {
      if (prod.canonicalUrl) {
        addEntry(`${BASE_URL}${prod.canonicalUrl}`, 0.80, 'weekly');
      }
    }
  } catch (err) {
    console.warn('[SITEMAP] Error leyendo catálogo de luces de Navidad:', err);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. ARTISTAS ROSTER S-CLASS & TALENTO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. PROVEEDORES HOMOLOGADOS Y FINCAS VERIFICADAS (ALL PROVIDERS DB)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  try {
    const curatedPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
    if (fs.existsSync(curatedPath)) {
      const raw = fs.readFileSync(curatedPath, 'utf-8');
      const allProviders: any[] = JSON.parse(raw);
      
      // Indexamos hasta 3.500 proveedores con ficha técnica completa y slug/id único
      allProviders.slice(0, 3500).forEach(provider => {
        const slug = provider.id || provider.slug;
        if (slug) {
          addEntry(`${BASE_URL}/proveedores/${slug}`, 0.70, 'weekly');
        }
      });
    }
  } catch (err) {
    console.warn('[SITEMAP] Error leyendo all_providers_database:', err);
  }


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. VERTICAL 10: MAGNATES, FINCAS PRIVADAS & YATES (NDA) — 125 Rutas
  //    Anti-OOM: sub-sitemap en /sitemaps/magnates-nda
  //    Fuente: src/data/magnates_nda_routes.json
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  addEntry(`${BASE_URL}/artistas/edwin-agudelo/ultra-luxury-nda`, 0.75, 'monthly');

  return entries;
}
