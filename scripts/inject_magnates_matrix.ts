/**
 * ═══════════════════════════════════════════════════════════════════════════
 * inject_magnates_matrix.ts — Vertical 10: Magnates, Fincas Privadas & Yates
 * ANTIGRAVITY System Orchestrator × Productora EAR OS v5.0
 * ═══════════════════════════════════════════════════════════════════════════
 * PROTOCOLO ZTM: Extiende sitemap.ts existente — no duplica lógica.
 * Anti-OOM: guarda 125 rutas en magnates_nda_routes.json para sub-sitemap
 * paginado en /sitemaps/[id]/route.ts. Solo 1 entry hub en sitemap principal.
 *
 * USO (Obrero Local): npx tsx scripts/inject_magnates_matrix.ts
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.productoraear.com';
const BASE_DIR = process.cwd();
const DATA_DIR = path.join(BASE_DIR, 'src', 'data');
const SITEMAP_TS = path.join(BASE_DIR, 'src', 'app', 'sitemap.ts');
const OUTPUT_ROUTES_PATH = path.join(DATA_DIR, 'magnates_nda_routes.json');

// ─── VERTICAL 10: 5 Formatos Artísticos × 25 Enclaves = 125 combinaciones ──

const V10_SERVICES: string[] = [
  'private-estate-tenor-gala-performance',
  'superyacht-exclusive-latin-concert',
  'family-office-private-event-mariachi-imperial',
  'ultra-luxury-elopement-secret-estate',
  'discreet-vip-soiree-bose-f1',
];

const V10_HUBS: string[] = [
  // España — Ultra-premium
  'private-island-baleares',
  'ibiza-private-seafront-mansion',
  'marbella-sierra-blanca-mega-estate',
  'sotogrande-upper-estates',
  'mallorca-puerto-andratx-villas',
  // Mediterráneo
  'sardinia-private-costa-smeralda-estate',
  'porto-cervo-private-docks',
  'lake-como-private-villa-balbiano',
  'cap-ferret-private-villas',
  'st-tropez-les-parcs-villas',
  // Francia / Mónaco
  'cote-d-azur-private-chateau',
  'monaco-penthouse-private-galas',
  'paris-neuilly-sur-seine-villas',
  // Suiza / Alpes
  'st-moritz-private-chalet-galas',
  'courchevel-private-lodge',
  'gstaad-exclusive-chalets',
  'geneva-lakefront-private-estate',
  'zurichberg-private-villas',
  // Superyates — Fondeos estratégicos
  'superyacht-anchorage-monaco',
  'superyacht-anchorage-ibiza',
  'superyacht-anchorage-sardinia',
  // Ultra-lujo global
  'dubai-palm-jumeirah-private-palace',
  'london-mayfair-private-townhouse',
  'greece-private-aegean-islands',
  'caribbean-private-st-barth-villas',
];

interface MagnatesRoute {
  url: string;
  service: string;
  hub: string;
  priority: number;
  changeFrequency: 'monthly' | 'yearly';
  nda: true;
  lcspApplicable: false;
  priceFloorEur: number;
  splitSoberano: '80/10/10';
}

function getPriceFloor(hub: string): number {
  const premiumHubs = ['superyacht', 'monaco', 'dubai', 'st-barth', 'st-moritz', 'courchevel', 'gstaad'];
  return premiumHubs.some(p => hub.includes(p)) ? 18500 : 12000;
}

// ─── GENERACIÓN MATRIZ 125 RUTAS ─────────────────────────────────────────────

console.log('════════════════════════════════════════════════════════════');
console.log('[*] VERTICAL 10: Generando Matriz 125 Rutas Magnates NDA');
console.log('════════════════════════════════════════════════════════════');

const routes: MagnatesRoute[] = [];
const seen = new Set<string>();

for (const service of V10_SERVICES) {
  for (const hub of V10_HUBS) {
    const url = `${BASE_URL}/artistas/edwin-agudelo/ultra-luxury-nda/${service}/${hub}`;
    if (!seen.has(url)) {
      seen.add(url);
      routes.push({
        url, service, hub,
        priority: 0.72,
        changeFrequency: 'monthly',
        nda: true,
        lcspApplicable: false,
        priceFloorEur: getPriceFloor(hub),
        splitSoberano: '80/10/10',
      });
    }
  }
}

console.log(`  → ${routes.length} rutas generadas (target: 125)`);

// ─── PERSISTIR JSON PARA CONSUMO POR sitemaps/[id]/route.ts ─────────────────

fs.writeFileSync(OUTPUT_ROUTES_PATH, JSON.stringify(routes, null, 2), 'utf-8');
console.log(`  → Output: ${OUTPUT_ROUTES_PATH}`);

// ─── AÑADIR SECCIÓN §6 A sitemap.ts (Anti-OOM: solo 1 entry hub + referencia) ─

const SECTION_MAGNATES = `
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. VERTICAL 10: MAGNATES, FINCAS PRIVADAS & YATES (NDA) — 125 Rutas
  //    Anti-OOM: sub-sitemap en /sitemaps/magnates-nda
  //    Fuente: src/data/magnates_nda_routes.json
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  addEntry(\`\${BASE_URL}/artistas/edwin-agudelo/ultra-luxury-nda\`, 0.75, 'monthly');
`;

const currentSitemap = fs.readFileSync(SITEMAP_TS, 'utf-8');
if (!currentSitemap.includes('VERTICAL 10: MAGNATES')) {
  const updated = currentSitemap.replace('  return entries;\n}', `${SECTION_MAGNATES}\n  return entries;\n}`);
  fs.writeFileSync(SITEMAP_TS, updated, 'utf-8');
  console.log('  → sitemap.ts: Sección §6 Magnates inyectada');
} else {
  console.log('  → sitemap.ts: §6 ya presente — sin duplicación');
}

// ─── RESUMEN ─────────────────────────────────────────────────────────────────

console.log('\n════════════════════════════════════════════════════════════');
console.log('[OK] VERTICAL 10 — MAGNATES NDA MATRIX COMPLETADA');
console.log(`  Total rutas:       ${routes.length}`);
console.log(`  Servicios NDA:     ${V10_SERVICES.length}`);
console.log(`  Enclaves globales: ${V10_HUBS.length}`);
console.log(`  Precio mínimo:     12.000 – 18.500 € (referencial NDA)`);
console.log(`  Split Soberano:    80% Artista / 10% EAR / 10% VIMUME`);
console.log(`  OOM Prevention:    SÍ — 1 entry hub en sitemap principal`);
console.log('════════════════════════════════════════════════════════════');
