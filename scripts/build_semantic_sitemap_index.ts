import fs from 'fs';
import path from 'path';

const SITEMAP_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sitemap_routes_index.json');
const DATA_DIR = path.dirname(SITEMAP_DATA_PATH);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Matriz de servicios canónicos y provincias para cruce semántico
const SERVICIOS = [
  'mariachis',
  'musica-para-bodas',
  'sonorizacion-eventos',
  'conciertos-fiestas-patronales',
  'iluminacion-navidad',
  'viaje-musical-por-la-memoria'
];

const PROVINCIAS = [
  'madrid', 'toledo', 'cadiz', 'sevilla', 'barcelona', 'valencia', 'malaga', 'alicante',
  'zaragoza', 'murcia', 'granada', 'cordoba', 'valladolid', 'baleares', 'las-palmas',
  'santa-cruz-de-tenerife', 'asturias', 'a-coruna', 'albacete', 'almeria', 'avila',
  'badajoz', 'burgos', 'caceres', 'cantabria', 'castellon', 'ciudad-real', 'cuenca',
  'girona', 'guadalajara', 'guipuzcoa', 'huelva', 'huesca', 'jaen', 'la-rioja', 'leon',
  'lleida', 'lugo', 'navarra', 'ourense', 'palencia', 'pontevedra', 'salamanca',
  'segovia', 'soria', 'tarragona', 'teruel', 'valencia', 'zamora', 'bizkaia', 'araba'
];

console.log('>> [SITEMAP BUILDER] Generando matriz semántica de indexación...');

const routes: string[] = [
  'https://www.productoraear.com',
  'https://www.productoraear.com/contratacion/ayuntamientos',
  'https://www.productoraear.com/contratacion/ayuntamientos/mentrida',
  'https://www.productoraear.com/contratacion/ayuntamientos/navalcarnero',
  'https://www.productoraear.com/vimume',
  'https://www.productoraear.com/artistas',
  'https://www.productoraear.com/artistas/edwin-agudelo',
  'https://www.productoraear.com/arsenal/luces-navidad'
];

// Generar combinaciones semánticas servicio x provincia
for (const s of SERVICIOS) {
  for (const p of PROVINCIAS) {
    routes.push(`https://www.productoraear.com/servicios/${s}/${p}`);
  }
}

// Cargar municipios cosechados si existen
const VENDORS_PATH = path.join(process.cwd(), 'src', 'data', 'bodas-vendors-harvested.json');
if (fs.existsSync(VENDORS_PATH)) {
  try {
    const raw = fs.readFileSync(VENDORS_PATH, 'utf-8');
    const vendors = JSON.parse(raw);
    const setMuni = new Set<string>();
    for (const v of vendors) {
      if (v.municipio && typeof v.municipio === 'string') {
        const norm = v.municipio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');
        if (norm) setMuni.add(norm);
      }
    }
    for (const m of setMuni) {
      routes.push(`https://www.productoraear.com/bodas/madrid/mariachis/${m}`);
      routes.push(`https://www.productoraear.com/bodas/toledo/mariachis/${m}`);
    }
  } catch (e) {
    console.log('   [!] Error parcial leyendo vendors:', e);
  }
}

fs.writeFileSync(SITEMAP_DATA_PATH, JSON.stringify(routes, null, 2), 'utf-8');
console.log(`>> [SUCCESS] ${routes.length} rutas semánticas consolidadas en ${SITEMAP_DATA_PATH}`);
