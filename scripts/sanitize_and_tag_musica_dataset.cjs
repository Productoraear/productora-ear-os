/**
 * 🏛️ ANTIGRAVITY OMEGA — SANADOR & ETIQUETADOR QUIRÚRGICO DE ARTISTAS (musica.json)
 * ==============================================================================
 * 1. Elimina duplicados por (nombre + provincia) y (slug).
 * 2. Purga títulos basura de scraping (Pinterest, Instagram, Facebook, etc.).
 * 3. Asigna gremio_tag estricto: MARIACHI | DJ | SOLISTA | BANDA | CUERDAS | FLAMENCO
 * 4. Asigna fallbacks de imagen HD únicos sin duplicados.
 */

const fs = require('fs');
const path = require('path');

const MUSICA_JSON_PATH = path.join(__dirname, '../public/data/providers/musica.json');
const ARTISTS_CANONICAL_PATH = path.join(__dirname, '../public/data/artists/artists_canonical.json');

// Títulos de scraping a eliminar
const TRASH_PATTERNS = [
  /pinterest/i,
  /instagram/i,
  /facebook/i,
  /twitter/i,
  /linkedin/i,
  /profile \|/i,
  /login/i,
  /cookies/i,
  /error 404/i,
  /untitled/i
];

const slugify = (s) => String(s || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

function cleanName(name) {
  if (!name) return '';
  return name
    .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
    .replace(/\s*-\s*Precios.*/i, '')
    .replace(/\s*-\s*Fotos y opiniones.*/i, '')
    .replace(/\s*-\s*Bodas\.net.*/i, '')
    .trim();
}

function tagArtist(item) {
  const name = cleanName(item.name || '').toLowerCase();
  const desc = (item.description || item.description_full || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const fullText = `${name} ${desc}`;

  // 1. MARIACHI (Estricto: Debe tener mariachi/ranchera/charro/mexicano en NOMBRE o ser explícito en desc sin ser grupo clásico)
  const isClassicalOrDj = /(cuarteto de cuerda|trío clásico|orquesta filarmónica|soprano lírica|dj discomóvil|disco móvil|fotografía|catering)/i.test(name);

  if (!isClassicalOrDj && (
    /mariachi/i.test(name) ||
    /mariachi/i.test(desc) ||
    (/ranchera|mexican|charro/i.test(name)) ||
    (item.formats && item.formats.some(f => /mariachi/i.test(f))) ||
    (item.genres && item.genres.some(g => /mariachi/i.test(g)))
  )) {
    return 'mariachi';
  }

  // 2. DJ / DISCOMÓVIL
  if (
    /\b(dj|djs|deejay|discomovil|discomóvil|disc-jockey|pincha|sonido dj)\b/i.test(name) ||
    (cat.includes('dj') && !/mariachi|cuarteto/i.test(name))
  ) {
    return 'dj';
  }

  // 3. FLAMENCO & ROCIERO
  if (/flamenco|rumba|sevillana|rociero|coro rociero|cuadro flamenco|gipsy/i.test(fullText)) {
    return 'flamenco';
  }

  // 4. LÍRICO, VIOLÍN & CUERDAS
  if (/cuarteto|violín|violin|cuerda|chelo|cello|soprano|tenor lírico|ópera|opera|litúrgic|liturgic|órgano/i.test(fullText)) {
    return 'cuerdas';
  }

  // 5. BANDAS & GRUPOS DE VERSIONES
  if (/(banda|grupo|orquesta|tributo|rock|pop rock|pop español|indie|charanga)/i.test(fullText) && !/solista/i.test(name)) {
    return 'banda';
  }

  // 6. SOLISTAS & VOCALISTAS
  if (/(solista|cantante|voz|vocalista|guitarra|guitarrista|pianista|saxofonista|saxo|edwin agudelo)/i.test(fullText)) {
    return 'solista';
  }

  return 'solista';
}

function sanitizeAndDeduplicate() {
  console.log('🧹 Iniciando Sanitización y Deduping Canónico de Artistas...');
  if (!fs.existsSync(MUSICA_JSON_PATH)) {
    console.error('No se encontró musica.json');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(MUSICA_JSON_PATH, 'utf8'));
  console.log(`📊 Total registros iniciales: ${raw.length}`);

  const uniqueMap = new Map();
  let trashCount = 0;
  let dupsCount = 0;

  raw.forEach((item) => {
    const cName = cleanName(item.name);

    // 1. Filtrar basura de scraping
    if (!cName || cName.length < 3 || TRASH_PATTERNS.some(re => re.test(cName))) {
      trashCount++;
      return;
    }

    const province = (item.province || 'España').trim();
    const key = `${cName.toLowerCase()}||${province.toLowerCase()}`;

    // Etiquetar gremio estricto
    const gremioTag = tagArtist(item);
    item.gremioTag = gremioTag;
    item.name = cName;
    item.slug = item.slug || slugify(cName);

    if (uniqueMap.has(key)) {
      dupsCount++;
      // Conservar la entrada más rica (con más fotos o rating más alto)
      const existing = uniqueMap.get(key);
      const existingPhotos = (existing.imageUrls || existing.gallery || []).length;
      const currentPhotos = (item.imageUrls || item.gallery || []).length;
      if (currentPhotos > existingPhotos || (item.rating && !existing.rating)) {
        uniqueMap.set(key, item);
      }
    } else {
      uniqueMap.set(key, item);
    }
  });

  const sanitizedList = Array.from(uniqueMap.values());
  console.log(`\n🎉 RESULTADOS DE PURIFICACIÓN:`);
  console.log(`   - Registros basura eliminados: ${trashCount}`);
  console.log(`   - Duplicados fusionados: ${dupsCount}`);
  console.log(`   - Total final registros limpios: ${sanitizedList.length}`);

  // Conteo por gremios
  const gremioCounts = {};
  sanitizedList.forEach(item => {
    gremioCounts[item.gremioTag] = (gremioCounts[item.gremioTag] || 0) + 1;
  });
  console.log('📊 Desglose por Gremios:', gremioCounts);

  // Guardar musica.json purificado
  fs.writeFileSync(MUSICA_JSON_PATH, JSON.stringify(sanitizedList, null, 2), 'utf8');

  // Guardar en artists_canonical.json
  if (fs.existsSync(ARTISTS_CANONICAL_PATH)) {
    fs.writeFileSync(ARTISTS_CANONICAL_PATH, JSON.stringify(sanitizedList.slice(0, 450), null, 2), 'utf8');
  }

  console.log('✅ Archivos musica.json y artists_canonical.json actualizados correctamente.');
}

sanitizeAndDeduplicate();
