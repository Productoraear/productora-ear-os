import fs from 'fs';
import path from 'path';

const SITEMAP_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sitemap_routes_index.json');

// Vertical 10: Magnates, Fincas Privadas y Yates (NDA)
const V10_SERVICES = [
  'private-estate-tenor-gala-performance',
  'superyacht-exclusive-latin-concert',
  'family-office-private-event-mariachi-imperial',
  'ultra-luxury-elopement-secret-estate',
  'discreet-vip-soiree-bose-f1'
];

const V10_HUBS = [
  'private-island-baleares', 'sardinia-private-costa-smeralda-estate', 'côte-d-azur-private-chateau', 'lake-como-private-villa-balbiano', 'ibiza-private-seafront-mansion',
  'marbella-sierra-blanca-mega-estate', 'monaco-penthouse-private-galas', 'st-moritz-private-chalet-galas', 'courchevel-private-lodge', 'megyacht-anchorage-monaco',
  'megyacht-anchorage-ibiza', 'megyacht-anchorage-sardinia', 'dubai-palm-jumeirah-private-palace', 'geneva-lakefront-private-estate', 'zurichberg-private-villas',
  'london-mayfair-private-townhouse', 'paris-neuilly-sur-seine-villas', 'sotogrande-upper-estates', 'mallorca-puerto-andratx-villas', 'gstaad-exclusive-chalets',
  'cap-ferret-private-villas', 'porto-cervo-private-docks', 'st-tropez-les-parcs-villas', 'greece-private-aegean-islands', 'caribbean-private-st-barth-villas'
];

console.log('>> [ULTRA-LUXURY SITEMAP] Inyectando 125 rutas de Magnates y Fincas Privadas (NDA)...');

let existingRoutes = [];
if (fs.existsSync(SITEMAP_DATA_PATH)) {
  try {
    existingRoutes = JSON.parse(fs.readFileSync(SITEMAP_DATA_PATH, 'utf-8'));
  } catch (e) {
    existingRoutes = [];
  }
}

const routesSet = new Set(existingRoutes);
let addedCount = 0;

for (const s of V10_SERVICES) {
  for (const h of V10_HUBS) {
    const url = `https://www.productoraear.com/artistas/edwin-agudelo/private-magnates-nda/${s}/${h}`;
    if (!routesSet.has(url)) {
      routesSet.add(url);
      addedCount++;
    }
  }
}

const finalRoutes = Array.from(routesSet);
fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(finalRoutes, null, 2), 'utf-8');

console.log(`>> [SUCCESS] ${addedCount} nuevas rutas de ultra-lujo inyectadas.`);
console.log(`>> Total absoluto en sitemap_routes_index.json: ${finalRoutes.length} URLs canónicas de élite global.`);
