import fs from 'fs';
import path from 'path';

const SITEMAP_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sitemap_routes_index.json');

// Vertical 9: Ferias Equinas y Shows a Caballo en Europa
const V9_SERVICES = [
  'canto-a-caballo-alta-escuela-gala',
  'espectaculo-ecuestre-mariachi-sinfonico',
  'clausura-salon-del-caballo-tenor',
  'exhibicion-ecuestre-rancheras-en-vivo',
  'gala-ecuestre-internacional-bose-f1'
];

const V9_HUBS = [
  'sevilla-sicab-palacio-congresos', 'jerez-feria-del-caballo-ifeca', 'madrid-ifema-salon-del-caballo-madrid-horse-week',
  'barcelona-polo-club-real-clube', 'paris-nord-villepinte-salon-du-cheval', 'saumur-cadre-noir-france',
  'chantilly-grandes-ecuries-france', 'deauville-poule-d-essai-hippodrome', 'lyon-equita-chlyon',
  'verona-fieracavalli-italia', 'roma-piazza-di-siena-csio', 'milano-san-siro-gallop',
  'aachen-chio-germany', 'stuttgart-german-masters', 'hamburg-derby-park', 'frankfurt-festhalle-pferdedorf',
  'ginebra-palexpo-concours-hippique', 'basilea-switzerland-show-jumping', 'el-tiergarten-berlin-equestrian',
  'lisbon-fap-feira-agropecuaria', 'golega-feira-nacional-do-cavalo-portugal', 'brussels-stephenex-masters',
  'waregem-koers-belgium', 'valencia-csi-aneguil', 'jerez-recreo-las-cadenas-real-escuela'
];

console.log('>> [EQUESTRIAN SITEMAP] Inyectando 125 rutas de espectáculos ecuestres de alta escuela...');

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

for (const s of V9_SERVICES) {
  for (const h of V9_HUBS) {
    const url = `https://www.productoraear.com/artistas/edwin-agudelo/ferias-ecuestres-alta-escuela/${s}/${h}`;
    if (!routesSet.has(url)) {
      routesSet.add(url);
      addedCount++;
    }
  }
}

const finalRoutes = Array.from(routesSet);
fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(finalRoutes, null, 2), 'utf-8');

console.log(`>> [SUCCESS] ${addedCount} nuevas rutas ecuestres inyectadas.`);
console.log(`>> Total absoluto en sitemap_routes_index.json: ${finalRoutes.length} URLs canónicas.`);
