import fs from 'fs';
import path from 'path';

const SITEMAP_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sitemap_routes_index.json');

// Vertical 5: Embajadas & Cumbres
const V5_SERVICES = ['gala-diplomatica-oficial', 'concierto-fiesta-nacional-mexico', 'recepcion-embajada-alta-etiqueta', 'recital-cumbres-internacionales', 'audio-branding-protocolo-global'];
const V5_HUBS = ['washington-dc-embassies', 'new-york-un-galas', 'miami-consular-corps', 'mexico-city-polanco', 'bogota-chico', 'buenos-aires-recoleta', 'london-st-james', 'paris-7eme-arrondissement', 'berlin-tiergarten', 'geneva-international-centre', 'vienna-un-vienna', 'brussels-eu-quarter', 'tokyo-minato-diplomatic', 'singapore-orchard-galas', 'dubai-diplomatic-zone', 'abu-dhabi-luxury-events', 'doha-qatar-galas', 'riyadh-diplomatic-quarter', 'rome-parioli-embassies', 'madrid-paseo-de-la-castellana', 'lisbon-lapa-embassies', 'ottawa-embassy-row', 'santiago-de-chile-vitacura', 'panama-city-barrio-del-carmen', 'montevideo-carrasco'];

// Vertical 6: Discotecas VIP & Beach Clubs
const V6_SERVICES = ['show-nocturno-vip-live-performance', 'experiencia-nocturna-exclusiva-bose-f1', 'intervencion-artistica-clandestine-luxury', 'performance-sorpresa-beach-club', 'show-estelar-midnight-gala'];
const V6_HUBS = ['ibiza-ushuaia-pacha-loulou', 'mykonos-scorpios-cavo-paradiso', 'st-tropez-les-caves-du-roy', 'marbella-starlite-loulou', 'dubai-cavalli-soho-garden', 'miami-liv-story', 'las-vegas-xs-omnia', 'london-cirque-le-soir-annabels', 'paris-vip-nightclubs', 'milan-hollywood-armani', 'porto-cerro-cervo-phi-beach', 'cannes-vip-beach-clubs', 'tulum-azulik-papaya-playa', 'bali-potato-head-finns', 'st-moritz-king-club', 'courchevel-la-cave', 'miami-south-beach-vips', 'barcelona-opium-shoko', 'madrid-fabrik-gabana', 'marrakesh-pacha-the-atroell', 'cancun-hotel-zone-vips', 'los-angeles-west-hollywood-clubs', 'new-york-meatpacking-district-vips', 'santo-domingo-malecon-vips', 'punta-cana-luxury-resorts'];

// Vertical 7: Hoteles 5* GL & Palacios Globales
const V7_SERVICES = ['residencia-artistica-hotel-gran-lujo', 'concierto-privado-cenas-michelin', 'velada-acustica-bose-l1-penthouse', 'serenata-luxury-suite-experience', 'gala-aniversario-hotel-5-estrellas'];
const V7_HUBS = ['aman-resorts-global', 'four-seasons-paris-london', 'ritz-carlton-vienna-tokyo', 'mandarin-oriental-new-york-dubai', 'shangri-la-istanbul-paris', 'rosewood-london-cortona', 'st-regis-florence-new-york', 'belmond-hotel-splendido', 'dorchester-collection-london-paris', 'peninsula-hotels-tokyo-beijing', 'fairmont-monaco-san-francisco', 'sofitel-legend-cartagena', 'banyan-tree-mayakoba', 'six-senses-valencia-ibiza', 'melia-palacio-de-los-duques', 'marquis-los-cabos', 'paradisus-luxe-suites', 'hyatt-centric-luxury', 'intercontinental-cannes-madrid', 'w-hotels-barcelona-verbier', 'nobu-hotel-ibiza-dubai', 'bulgari-hotel-milan-london', 'armani-hotel-dubai-milano', 'edition-hotels-miami-reykjavik', 'conrad-hotels-algarve-tokyo'];

// Vertical 8: Bodas High-End y Elopements de Ultramar
const V8_SERVICES = ['destination-wedding-singer-tenor', 'boda-high-end-mariachi-imperial', 'ceremonia-intima-lujo-bose-s1', 'experiencia-nupcial-exclusiva-internacional', 'bodas-de-destino-mediterraneo-atlantico'];
const V8_HUBS = ['lake-como-destination-weddings', 'amalfi-coast-elopements', 'tuscany-chianti-villas', 'provence-chateaux-weddings', 'santorini-cliffside-ceremonies', 'mykonos-beach-weddings', 'ibiza-boho-chic-weddings', 'mallorca-fincas-lujo', 'marbella-beach-weddings', 'sotogrande-polo-villas', 'algarve-cliff-weddings', 'madeira-garden-weddings', 'cotswolds-country-house-weddings', 'scottish-highlands-castles', 'irish-historic-estates', 'iceland-glacier-elopements', 'swiss-alps-chalet-weddings', 'costa-rica-luxury-resorts', 'mexico-riviera-maya-luxury', 'puntacana-beach-weddings', 'cartagena-de-indias-colonial', 'san-miguel-de-allende-allende', 'buenos-aires-estancias', 'cabo-san-lucas-weddings', 'maui-hawaii-destination'];

console.log('>> [GLOBAL SITEMAP] Inyectando 500 rutas de ultra-lujo (Embajadas, VIP Clubs, Hoteles 5* GL, High-End Weddings)...');

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

function addGlobalCombinations(services, hubs, categoryPrefix) {
  for (const s of services) {
    for (const h of hubs) {
      const url = `https://www.productoraear.com/artistas/edwin-agudelo/${categoryPrefix}/${s}/${h}`;
      if (!routesSet.has(url)) {
        routesSet.add(url);
        addedCount++;
      }
    }
  }
}

addGlobalCombinations(V5_SERVICES, V5_HUBS, 'embajadas-cumbres');
addGlobalCombinations(V6_SERVICES, V6_HUBS, 'vip-clubs-beach');
addGlobalCombinations(V7_SERVICES, V7_HUBS, 'global-luxury-hotels');
addGlobalCombinations(V8_SERVICES, V8_HUBS, 'destination-weddings-high-end');

const finalRoutes = Array.from(routesSet);
fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(finalRoutes, null, 2), 'utf-8');

console.log(`>> [SUCCESS] ${addedCount} nuevas rutas globales añadidas.`);
console.log(`>> Total absoluto en sitemap_routes_index.json: ${finalRoutes.length} URLs canónicas de élite.`);
