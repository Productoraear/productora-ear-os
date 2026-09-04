import fs from 'fs';
import path from 'path';

const SITEMAP_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sitemap_routes_index.json');

// 1. Definición de las 4 Verticales Internacionales
const V1_SERVICES = [
  'guest-entertainer-tenor-mariachi',
  'headliner-vocalist-latin-crossover',
  'recital-gala-lirica-mexicana',
  'acoustic-tenor-latin-standards',
  'tributo-sinfonico-boleros-rancheras'
];
const V1_HUBS = [
  'barcelona-port', 'palma-cruise-terminal', 'monaco-harbour', 'nice-cannes', 'genova-terminal',
  'marseille-port', 'valencia-cruise', 'malaga-port', 'cadiz-atlantic', 'lisbon-cruise',
  'funchal-madeira', 'santa-cruz-tenerife', 'las-palmas-port', 'southampton', 'copenhague',
  'estocolmo', 'reykjavik', 'dubrovnik', 'corfu', 'venezia',
  'silversea-cruises', 'seabourn-luxury', 'regent-seven-seas', 'msc-yacht-club', 'viking-ocean-cruises'
];

const V2_SERVICES = [
  'tenor-solista-cenas-gala-exclusivas',
  'mariachi-imperial-luxury-resorts',
  'boleros-de-concierto-soiree-vip',
  'residencia-artistica-verano-luxury-hotel',
  'show-acustico-alta-gastronomia-bose'
];
const V2_HUBS = [
  'marbella-golden-mile', 'ibiza-luxury-villas', 'mallorca-son-vida', 'madrid-salamanca-four-seasons',
  'barcelona-passeig-de-gracia', 'costa-esmeralda-cerdegna', 'lake-como-villas', 'amalfi-coast-palaces',
  'capri-luxury-events', 'venice-san-marco', 'saint-tropez', 'paris-george-v',
  'courchevel-1850', 'gstaad-palace', 'st-moritz', 'geneva-lake-resorts',
  'zurich-luxury-galas', 'vienna-palaces', 'monaco-monte-carlo', 'santorini-caldera',
  'mykonos-vips', 'algarve-luxury-resorts', 'san-sebastian-michelin-galas', 'tenerife-costa-adeje', 'biarritz-palace'
];

const V3_SERVICES = [
  'espectaculo-mariachi-concierto-world-music',
  'embajador-cancion-mexicana-tenor-lirico',
  'crossover-sinfonico-bolero-ranchera',
  'folclore-latinoamericano-de-gala',
  'recital-patrimonio-inmaterial-unesco'
];
const V3_HUBS = [
  'womad-caceres', 'festival-cruilla-barcelona', 'veranos-de-la-villa-madrid', 'pirineos-sur',
  'la-mar-de-musicas-cartagena', 'festival-de-peralada', 'cap-roig-festival', 'starlite-ocaso-marbella',
  'rototom-sunbeach', 'couleur-cafe-brussels', 'sfinks-mixed-belgium', 'paleo-festival-nyon',
  'montreux-jazz-latin-stage', 'festival-rio-loco-toulouse', 'les-escales-saint-nazaire', 'womad-uk-charlton-park',
  'latin-grammy-showcases-europe', 'festival-latinoamericando-milano', 'caliente-festival-zurich', 'antilliaanse-feesten-belgica',
  'cologne-world-music-festival', 'berlin-kulturen-festival', 'amsterdam-roots-festival', 'oslo-world-music', 'helsinki-festival'
];

const V4_SERVICES = [
  'audio-branding-himnos-cumbres-internacionales',
  'concierto-diplomatico-fiesta-nacional-mexico',
  'recital-etiqueta-clubes-privados-europa',
  'tenor-lirico-recepciones-consulares-embajadas',
  'gala-conmemorativa-hispanidad-europa'
];
const V4_HUBS = [
  'madrid-club-financiero-genova', 'madrid-puerta-de-hierro', 'barcelona-circulo-del-liceo', 'london-mayfair-private-clubs',
  'london-belgravia-galas', 'paris-club-interallie', 'geneve-club-de-la-presse', 'zurich-barts-galas',
  'brussels-chateau-sainte-anne', 'monaco-yacht-club', 'roma-circolo-canottieri', 'milano-societa-del-giardino',
  'vienna-diplomatic-academy', 'frankfurt-banking-galas', 'andorra-la-vella-galas', 'lisboa-gremio-literario',
  'dubai-opera-latin-galas', 'valletta-malta-diplomatic', 'berlin-chancellery-diplomacy', 'den-haag-embassies',
  'luxembourg-cercle-munster', 'strasbourg-council-europe', 'marbella-villa-padierna-club', 'sotogrande-polo-club-galas', 'miami-consular-galas'
];

console.log('>> [INTERNATIONAL SITEMAP] Construyendo las 500 combinaciones maestras...');

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

function addCombinations(services, hubs, categoryPrefix) {
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

addCombinations(V1_SERVICES, V1_HUBS, 'cruceros');
addCombinations(V2_SERVICES, V2_HUBS, 'luxury-hotels');
addCombinations(V3_SERVICES, V3_HUBS, 'festivales-world-music');
addCombinations(V4_SERVICES, V4_HUBS, 'galas-diplomaticas');

const finalRoutes = Array.from(routesSet);
fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(finalRoutes, null, 2), 'utf-8');

console.log(`>> [SUCCESS] ${addedCount} nuevas rutas internacionales inyectadas.`);
console.log(`>> Total absoluto en sitemap_routes_index.json: ${finalRoutes.length} URLs canónicas.`);
