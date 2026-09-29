const fs = require('fs');
const path = require('path');

const PROVINCES_MAP = {
  'alava': 'Álava', 'araba': 'Álava',
  'albacete': 'Albacete',
  'alicante': 'Alicante', 'alacant': 'Alicante',
  'almeria': 'Almería',
  'asturias': 'Asturias', 'gijon': 'Asturias', 'oviedo': 'Asturias',
  'avila': 'Ávila',
  'badajoz': 'Badajoz',
  'baleares': 'Baleares', 'islas baleares': 'Baleares', 'illes balears': 'Baleares', 'ibiza': 'Baleares', 'mallorca': 'Baleares', 'menorca': 'Baleares', 'formentera': 'Baleares',
  'barcelona': 'Barcelona',
  'burgos': 'Burgos',
  'caceres': 'Cáceres',
  'cadiz': 'Cádiz', 'jerez': 'Cádiz', 'jerez de la frontera': 'Cádiz',
  'cantabria': 'Cantabria', 'santander': 'Cantabria',
  'castellon': 'Castellón', 'castello': 'Castellón',
  'ceuta': 'Ceuta',
  'ciudad real': 'Ciudad Real',
  'cordoba': 'Córdoba',
  'cuenca': 'Cuenca',
  'girona': 'Girona', 'gerona': 'Girona',
  'granada': 'Granada',
  'guadalajara': 'Guadalajara',
  'guipuzcoa': 'Guipúzcoa', 'gipuzkoa': 'Guipúzcoa', 'donostia': 'Guipúzcoa', 'san sebastian': 'Guipúzcoa',
  'huelva': 'Huelva',
  'huesca': 'Huesca',
  'jaen': 'Jaén', 'baeza': 'Jaén', 'ubeda': 'Jaén',
  'la coruna': 'A Coruña', 'a coruna': 'A Coruña', 'coruna': 'A Coruña', 'santiago de compostela': 'A Coruña',
  'la rioja': 'La Rioja', 'rioja': 'La Rioja', 'logrono': 'La Rioja',
  'las palmas': 'Las Palmas', 'gran canaria': 'Las Palmas', 'lanzarote': 'Las Palmas', 'fuerteventura': 'Las Palmas',
  'leon': 'León',
  'lleida': 'Lleida', 'lerida': 'Lleida',
  'lugo': 'Lugo',
  'madrid': 'Madrid', 'aranjuez': 'Madrid', 'alcala de henares': 'Madrid',
  'malaga': 'Málaga', 'marbella': 'Málaga', 'ronda': 'Málaga',
  'melilla': 'Melilla',
  'murcia': 'Murcia', 'cartagena': 'Murcia',
  'navarra': 'Navarra', 'pamplona': 'Navarra',
  'ourense': 'Ourense', 'orense': 'Ourense',
  'palencia': 'Palencia',
  'pontevedra': 'Pontevedra', 'vigo': 'Pontevedra', 'mondariz': 'Pontevedra',
  'salamanca': 'Salamanca',
  'santa cruz de tenerife': 'Santa Cruz de Tenerife', 'tenerife': 'Santa Cruz de Tenerife', 'la palma': 'Santa Cruz de Tenerife',
  'segovia': 'Segovia',
  'sevilla': 'Sevilla',
  'soria': 'Soria',
  'tarragona': 'Tarragona',
  'teruel': 'Teruel',
  'toledo': 'Toledo', 'talavera': 'Toledo',
  'valencia': 'Valencia',
  'valladolid': 'Valladolid',
  'vizcaya': 'Vizcaya', 'bizkaia': 'Vizcaya', 'bilbao': 'Vizcaya', 'getxo': 'Vizcaya',
  'zamora': 'Zamora',
  'zaragoza': 'Zaragoza'
};

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function resolveGeo(addr, name) {
  const normAddr = norm(addr);
  const normName = norm(name);

  // 1. Si el nombre tiene explícitamente un indicador geográfico no genérico (ej. Jaén, Jerez, Pamplona, Ibiza), máxima prioridad
  for (const [k, v] of Object.entries(PROVINCES_MAP)) {
    if (k !== 'madrid' && new RegExp('\\b' + k + '\\b').test(normName)) {
      return { province: v, city: v };
    }
  }

  // 2. Si la dirección tiene datos geográficos y no es el genérico 'madrid, espana'
  if (normAddr && normAddr !== 'madrid, espana' && normAddr !== 'madrid' && normAddr !== 'espana') {
    const parts = normAddr.split(',').map(p => p.trim());
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (PROVINCES_MAP[part]) {
        return {
          province: PROVINCES_MAP[part],
          city: addr.split(',')[0].trim()
        };
      }
      for (const [k, v] of Object.entries(PROVINCES_MAP)) {
        if (part === k || part.includes(k)) {
          return {
            province: v,
            city: addr.split(',')[0].trim()
          };
        }
      }
    }
  }

  // 3. Si en el nombre decía Madrid explícitamente
  if (new RegExp('\\bmadrid\\b').test(normName)) {
    return { province: 'Madrid', city: 'Madrid' };
  }

  return { province: 'Madrid', city: (addr || '').split(',')[0].trim() || 'Madrid' };
}

const dir = path.join(process.cwd(), 'public', 'data', 'providers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'manifest.json' && f !== 'providers_canonical.json');

const stats = {
  totalProcessed: 0,
  provincesFixed: 0,
  edwinPhonesPurged: 0,
  directPhonesPreserved: 0
};

for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fileModified = false;

    for (const p of list) {
      stats.totalProcessed++;
      const isEdwinSovereign = p.id === 'prov-ear-sovereign-01' || p.slug === 'edwin-agudelo';

      // 1. Corregir geolocalización real
      const geo = resolveGeo(p.address, p.name);
      if (geo.province && p.province !== geo.province) {
        p.province = geo.province;
        if (!p.location) p.location = {};
        p.location.province = geo.province;
        p.location.city = geo.city;
        stats.provincesFixed++;
        fileModified = true;
      }

      // 2. Limpiar teléfono de la centralita en proveedores de terceros
      const rawPhone = (p.phone || p.telephone || '').replace(/\D/g, '');
      if (isEdwinSovereign) {
        p.phone = '+34 693 693 048';
        p.telephone = '+34 693 693 048';
        p.hasDirectPhone = true;
      } else if (rawPhone.includes('693693048') || rawPhone.includes('605584338') || rawPhone.includes('703831064') || rawPhone.includes('721056835') || rawPhone.includes('999999999') || rawPhone.includes('727272727') || !rawPhone) {
        p.hasDirectPhone = false;
        p.centralitaPhone = '+34 693 693 048';
        p.phone = null;
        p.telephone = null;
        stats.edwinPhonesPurged++;
        fileModified = true;
      } else if (rawPhone.length >= 9) {
        p.hasDirectPhone = true;
        stats.directPhonesPreserved++;
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(list), 'utf8');
      console.log(`[DATA-LAKE] Sanitizado archivo: ${file} (${list.length} registros)`);
    }
  } catch (err) {
    console.error(`[DATA-LAKE] Error en ${file}:`, err.message);
  }
}

console.log('=== RESUMEN DE SANITIZACIÓN ATÓMICA DATA LAKE ===');
console.log(stats);
