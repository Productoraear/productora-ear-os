const fs = require('fs');
const path = require('path');
const { resplitPartition } = require('./resplit_edge_partition.cjs');

const PROVINCE_SYNONYMS = {
  'orense': 'Ourense',
  'ourense': 'Ourense',
  'la coruna': 'A Coruña',
  'a coruna': 'A Coruña',
  'coruna': 'A Coruña',
  'baleares': 'Illes Balears',
  'illes balears': 'Illes Balears',
  'mallorca': 'Illes Balears',
  'menorca': 'Illes Balears',
  'ibiza': 'Illes Balears',
  'las palmas': 'Las Palmas',
  'tenerife': 'Santa Cruz de Tenerife',
  'santa cruz de tenerife': 'Santa Cruz de Tenerife',
  'vizcaya': 'Bizkaia',
  'bizkaia': 'Bizkaia',
  'guipuzcoa': 'Gipuzkoa',
  'gipuzkoa': 'Gipuzkoa',
  'alava': 'Álava',
  'araba': 'Álava',
  'navarra': 'Navarra',
  'la rioja': 'La Rioja',
  'rioja': 'La Rioja',
  'asturias': 'Asturias',
  'cantabria': 'Cantabria',
  'madrid': 'Madrid',
  'toledo': 'Toledo',
  'barcelona': 'Barcelona',
  'valencia': 'Valencia',
  'sevilla': 'Sevilla',
  'malaga': 'Málaga',
  'cadiz': 'Cádiz',
  'alicante': 'Alicante',
  'zaragoza': 'Zaragoza',
  'murcia': 'Murcia',
  'granada': 'Granada',
  'cordoba': 'Córdoba',
  'badajoz': 'Badajoz',
  'valladolid': 'Valladolid',
  'girona': 'Girona',
  'gerona': 'Girona',
  'tarragona': 'Tarragona',
  'lleida': 'Lleida',
  'lerida': 'Lleida',
  'castellon': 'Castellón',
  'huelva': 'Huelva',
  'jaen': 'Jaén',
  'almeria': 'Almería',
  'caceres': 'Cáceres',
  'ciudad real': 'Ciudad Real',
  'cuenca': 'Cuenca',
  'guadalajara': 'Guadalajara',
  'albacete': 'Albacete',
  'burgos': 'Burgos',
  'salamanca': 'Salamanca',
  'leon': 'León',
  'zamora': 'Zamora',
  'palencia': 'Palencia',
  'segovia': 'Segovia',
  'avila': 'Ávila',
  'soria': 'Soria',
  'huesca': 'Huesca',
  'teruel': 'Teruel',
  'lugo': 'Lugo',
  'pontevedra': 'Pontevedra'
};

function normalize(s) {
  if (!s) return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function refine() {
  const manifestPath = path.join(__dirname, '../public/data/providers/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const chunks =
    manifest && manifest.finca && Array.isArray(manifest.finca.chunks)
      ? manifest.finca.chunks
      : ['finca.json'];

  let corrected = 0;
  for (const chunk of chunks) {
    const filePath = path.join(__dirname, '../public/data/providers', chunk);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const f of data) {
      const normAddr = normalize(f.address || '');
      // Try to match from address
      let found = null;
      for (const [syn, canonical] of Object.entries(PROVINCE_SYNONYMS)) {
        if (
          normAddr.endsWith(syn) ||
          normAddr.includes(', ' + syn) ||
          normAddr.includes('(' + syn + ')') ||
          normAddr.includes(' ' + syn + ',') ||
          normAddr.includes(' ' + syn)
        ) {
          found = canonical;
          break;
        }
      }
      if (found && found !== f.province) {
        f.province = found;
        corrected++;
      }
    }

    // SIEMPRE minificado: el pretty-print inflaba la partición y rompía el SHA-256.
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  }

  console.log(`Refined province mapping for ${corrected} more fincas!`);

  // Cerrojo de integridad: re-empaqueta el gremio y refresca count/sizeKB/sha256.
  resplitPartition('finca', { manifest });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log('[INTEGRITY] Partición finca reconciliada con manifest.json (SHA-256 refrescado).');
}

refine();
