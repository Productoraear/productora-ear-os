const fs = require('fs');
const path = require('path');

const BACKUP_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\raw_monoliths';
const TARGET_DIR = path.join(__dirname, '..', 'public', 'data', 'providers');

const CATEGORIES = [
  { file: 'finca.json', category: 'finca', targetRecords: 1200, defaultPrice: 2500, label: 'Fincas & Espacios' },
  { file: 'catering.json', category: 'catering', targetRecords: 1000, defaultPrice: 2000, label: 'Catering & Gastro' },
  { file: 'musica.json', category: 'musica', targetRecords: 1200, defaultPrice: 350, label: 'Música & Shows' },
  { file: 'foto.json', category: 'foto', targetRecords: 1200, defaultPrice: 900, label: 'Fotografía & Vídeo' },
  { file: 'decoracion.json', category: 'decoracion', targetRecords: 900, defaultPrice: 500, label: 'Flores & Decoración' },
  { file: 'servicios.json', category: 'servicios', targetRecords: 1000, defaultPrice: 300, label: 'Ceremonia & Protocolo' },
  { file: 'moda.json', category: 'moda', targetRecords: 1000, defaultPrice: 900, label: 'Moda Nupcial' },
  { file: 'transporte.json', category: 'transporte', targetRecords: 800, defaultPrice: 400, label: 'Flotas & Autobuses' },
  { file: 'sonido.json', category: 'sonido', targetRecords: 1000, defaultPrice: 450, label: 'Audiovisuales & Luces' },
  { file: 'wedding.json', category: 'wedding', targetRecords: 700, defaultPrice: 1200, label: 'Wedding Planners' },
  { file: 'senior_care.json', category: 'senior_care', targetRecords: 800, defaultPrice: 1500, label: 'VIMUME Senior Care' }
];

const PROVINCES_MAP = {
  'madrid': 'Madrid',
  'toledo': 'Toledo',
  'barcelona': 'Barcelona',
  'valencia': 'Valencia',
  'sevilla': 'Sevilla',
  'malaga': 'Málaga',
  'málaga': 'Málaga',
  'alicante': 'Alicante',
  'cadiz': 'Cádiz',
  'cádiz': 'Cádiz',
  'baleares': 'Baleares',
  'illes balears': 'Baleares',
  'coruña': 'A Coruña',
  'a coruña': 'A Coruña',
  'zaragoza': 'Zaragoza',
  'asturias': 'Asturias',
  'murcia': 'Murcia',
  'valladolid': 'Valladolid',
  'granada': 'Granada',
  'cordoba': 'Córdoba',
  'córdoba': 'Córdoba',
  'las palmas': 'Las Palmas',
  'tenerife': 'Santa Cruz de Tenerife',
  'badajoz': 'Badajoz',
  'cantabria': 'Cantabria',
  'castellon': 'Castellón',
  'castellón': 'Castellón',
  'ciudad real': 'Ciudad Real',
  'cuenca': 'Cuenca',
  'guadalajara': 'Guadalajara',
  'huelva': 'Huelva',
  'jaen': 'Jaén',
  'jaén': 'Jaén',
  'leon': 'León',
  'león': 'León',
  'lleida': 'Lleida',
  'lugo': 'Lugo',
  'navarra': 'Navarra',
  'ourense': 'Ourense',
  'palencia': 'Palencia',
  'pontevedra': 'Pontevedra',
  'la rioja': 'La Rioja',
  'rioja': 'La Rioja',
  'salamanca': 'Salamanca',
  'segovia': 'Segovia',
  'soria': 'Soria',
  'tarragona': 'Tarragona',
  'teruel': 'Teruel',
  'alava': 'Álava',
  'álava': 'Álava',
  'albacete': 'Albacete',
  'almeria': 'Almería',
  'almería': 'Almería',
  'avila': 'Ávila',
  'ávila': 'Ávila',
  'burgos': 'Burgos',
  'caceres': 'Cáceres',
  'cáceres': 'Cáceres',
  'gipuzkoa': 'Gipuzkoa',
  'guipuzcoa': 'Gipuzkoa',
  'huesca': 'Huesca',
  'bizkaia': 'Bizkaia',
  'vizcaya': 'Bizkaia',
  'zamora': 'Zamora'
};

function normalizeProvince(raw) {
  if (!raw || typeof raw !== 'string') return 'Madrid';
  const clean = raw.toLowerCase().trim();
  for (const [k, v] of Object.entries(PROVINCES_MAP)) {
    if (clean.includes(k)) return v;
  }
  return raw.trim();
}

const manifestData = {};

CATEGORIES.forEach(({ file, category, targetRecords, defaultPrice, label }) => {
  const sourcePath = path.join(BACKUP_DIR, file);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[WARN] Source file not found: ${sourcePath}`);
    return;
  }

  console.log(`[PROCESS] Processing ${file} (${label})...`);
  const rawContent = fs.readFileSync(sourcePath, 'utf8');
  let rawList = [];
  try {
    rawList = JSON.parse(rawContent);
  } catch (err) {
    console.error(`[ERROR] Parsing ${file}:`, err.message);
    return;
  }

  // Agrupar por provincia
  const byProv = {};
  const seenNames = new Set();

  rawList.forEach((item) => {
    if (!item) return;
    const nameStr = item.name || item.nombre;
    if (!nameStr) return;
    const nameKey = String(nameStr).toLowerCase().trim();
    if (seenNames.has(nameKey)) return;
    seenNames.add(nameKey);

    const prov = normalizeProvince(item.province || item.location?.province || item.provincia || item.municipio);
    if (!byProv[prov]) byProv[prov] = [];
    byProv[prov].push(item);
  });

  const provKeys = Object.keys(byProv);
  let curated = [];

  // Ordenar cada provincia y recoger proporcionalmente
  provKeys.forEach((prov) => {
    const provItems = byProv[prov];
    provItems.sort((a, b) => {
      const aScore = (a.rating || 0) * 10 + (a.img ? 5 : 0) + (a.phone ? 2 : 0);
      const bScore = (b.rating || 0) * 10 + (b.img ? 5 : 0) + (b.phone ? 2 : 0);
      return bScore - aScore;
    });

    // Cuota proporcional: Madrid / Barcelona reciben hasta 350, otras según tamaño
    let provLimit = 30;
    if (prov === 'Madrid') provLimit = 380;
    else if (prov === 'Barcelona') provLimit = 150;
    else if (['Toledo', 'Valencia', 'Sevilla', 'Málaga', 'Alicante'].includes(prov)) provLimit = 60;
    else provLimit = Math.min(30, provItems.length);

    const selected = provItems.slice(0, provLimit).map((item) => {
      const name = String(item.name || item.nombre).trim();
      const img = item.img || (Array.isArray(item.gallery) && item.gallery[0]) || (Array.isArray(item.imageUrls) && item.imageUrls[0]) || null;
      const phone = item.phone || item.telephone || item.telefono || '+34 693 693 048';
      const priceNum = typeof item.basePrice === 'number' ? item.basePrice : defaultPrice;
      const priceStr = item.price ? String(item.price) : `${priceNum.toLocaleString()} €`;
      const desc = item.description || item.description_full || `${label} verificado en ${prov}. Producción y sonido garantizado S-Class.`;

      return {
        id: String(item.id || item.slug || `prov-${category}-${Math.random().toString(36).slice(2, 8)}`),
        name: name,
        slug: String(item.slug || item.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
        category: category,
        province: prov,
        address: item.address || item.direccion ? String(item.address || item.direccion).trim() : `${prov}, España`,
        phone: phone,
        telephone: phone,
        img: img,
        basePrice: priceNum,
        price: priceStr,
        rating: Number(item.rating || 5.0),
        reviews: Number(item.reviews || 22),
        description: desc.slice(0, 140).trim(),
        services_list: Array.isArray(item.services_list) ? item.services_list.slice(0, 4) : ['Servicio S-Class', 'Garantía EAR'],
        capacidadMaxPax: item.capacidadMaxPax || null
      };
    });

    curated = curated.concat(selected);
  });

  // Limitar al máximo estricto para mantener el archivo < 900 KB
  if (curated.length > targetRecords) {
    curated = curated.slice(0, targetRecords);
  }

  const targetPath = path.join(TARGET_DIR, file);
  const jsonOutput = JSON.stringify(curated);
  fs.writeFileSync(targetPath, jsonOutput, 'utf8');

  const sizeKB = (Buffer.byteLength(jsonOutput, 'utf8') / 1024).toFixed(1);
  console.log(`[DONE] ${file}: ${curated.length} providers across ${provKeys.length} provinces (${sizeKB} KB) -> OK`);

  manifestData[category] = {
    count: curated.length,
    sizeKB: sizeKB
  };
});

// Guardar manifest.json
const manifestPath = path.join(TARGET_DIR, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
console.log('[SUCCESS] Updated manifest.json with all edge partitions.');
