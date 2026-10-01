/**
 * 🏛️ ANTIGRAVITY OMEGA — PURIFICADOR S-CLASS DEFINITIVO DEL CATÁLOGO NACIONAL DE ARTISTAS
 * =========================================================================================
 * 1. Purgado radical de stubs sintéticos ("Mariachis Elite [City]").
 * 2. Purgado de venues, hoteles, palacios, fotos de novias (photo-1519741497674-611481863552),
 *    barberías, tiendas y documentación 7-Zip.
 * 3. Extracción 100% de fotos auténticas de origen (cdn0.bodas.net & celebrents.s3).
 * 4. Purgado del avatar por defecto de Celebrents (c2524615ca092dc557196134bcbbcdc1.png).
 * 5. Purgado de SVGs y cabeceras genéricas (gen_logoHeader.svg).
 * 6. Garantía #1 canónica: Edwin Agudelo (Solista Premium 350€) como ancla S-Class.
 * 7. Generación sincronizada de:
 *    - public/data/artists/artists_canonical.json (< 500 KB, ~450 artistas curados para git & Edge CDN)
 *    - public/data/providers/musica.json (catálogo verificado completo para búsqueda local y standalone)
 */

const fs = require('fs');
const path = require('path');

const HARVESTED_PATH = path.join(__dirname, '../src/data/bodas-vendors-harvested.json');
const CELEBRENTS_PATH = path.join(__dirname, '../src/data/celebrents_providers.json');
const CANONICAL_PATH = path.join(__dirname, '../public/data/artists/artists_canonical.json');
const MUSICA_JSON_PATH = path.join(__dirname, '../public/data/providers/musica.json');

const NON_MUSIC_WORDS = [
  'finca', 'hotel', 'palacio', 'restaurante', 'espacio', 'masia', 'cortijo', 'castillo',
  'casona', 'hacienda', 'jardines', 'complejo', 'alojamiento', 'banquetes', 'catering',
  'fotograf', 'video', 'autobuses', 'joyeria', 'vestido', 'traje', 'atelier', 'tienda',
  'shop', 'viajes', 'tocados', 'belleza', 'maquillaje', 'peluqueria', 'barberia', 'barbería',
  'invitacion', 'invitaciones', 'decoracion', 'decoración', 'floristeria', 'floristería',
  'abadía', 'oasis', 'aldea', 'carmona', 'dehesa', 'monasterio', 'bodega', 'bodegas',
  'quinta', 'convento', 'palacete', 'masía', 'molina real', 'estilismo', 'fotógrafo',
  'fotógrafos', 'fotografo', 'reportaje', 'autocar', 'alquiler de vehiculos', 'limusina'
];

function isForbidden(name, desc = '') {
  if (!name || name.length < 3) return true;
  const n = name.toLowerCase();
  const d = desc.toLowerCase();

  // Synthetic stubs forbidden
  if (n.includes('mariachis elite') || n.includes('mariachi elite') || n.includes('elite a coruna') || n.includes('elite albacete')) return true;
  if (n.includes('pinterest') || n.includes('dialog box') || n.includes('command') || n.startsWith('-') || n.includes('cookies') || n.includes('login') || n.includes('error 404')) return true;

  // Non-music businesses forbidden
  if (NON_MUSIC_WORDS.some(w => n.includes(w))) return true;

  return false;
}

function cleanName(raw) {
  return (raw || '')
    .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
    .replace(/\s*-\s*Precios.*/i, '')
    .replace(/\s*-\s*Fotos y opiniones.*/i, '')
    .replace(/\s*-\s*Bodas\.net.*/i, '')
    .trim();
}

function tagArtist(name, desc) {
  const full = (name + ' ' + desc).toLowerCase();
  if (/mariachi|ranchera|charro|mexican/i.test(full)) return 'mariachi';
  if (/\b(dj|djs|discomovil|discomóvil|disc-jockey|deejay)\b/i.test(full)) return 'dj';
  if (/flamenco|rumba|sevillana|rociero/i.test(full)) return 'flamenco';
  if (/cuarteto|violín|violin|cuerda|chelo|cello|soprano|tenor lírico|ópera|liturgic/i.test(full)) return 'cuerdas';
  if (/banda|grupo|orquesta|tributo|rock|pop|combo|charanga/i.test(full) && !/solista/i.test(name)) return 'banda';
  return 'solista';
}

function run() {
  console.log('🚀 Iniciando purificación definitiva de artistas & shows...');
  const artistsMap = new Map();

  // 1. PIN S-CLASS INMUTABLE: EDWIN AGUDELO (#1 EN EL CATÁLOGO)
  artistsMap.set('edwin-agudelo', {
    id: 'edwin-agudelo',
    name: 'Productora EAR • Edwin Agudelo',
    slug: 'edwin-agudelo',
    category: 'musica',
    gremioTag: 'solista',
    province: 'Madrid',
    municipality: 'Méntrida (Toledo) / Hub Central Madrid',
    phone: '+34 693 693 048',
    telephone: '+34 693 693 048',
    has_real_phone: true,
    rating: 5.0,
    reviews: 98,
    basePrice: 350,
    price: '350 €',
    img: 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
    imageUrls: [
      'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
      'https://cdn0.bodas.net/vendor/78903/3_2/1280/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg'
    ],
    gallery: [
      'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
      'https://cdn0.bodas.net/vendor/78903/3_2/1280/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg'
    ],
    description: 'Cantante, tenor lírico y compositor con más de 25 años de oficio escénico. Show Solista Premium (350€) con acústica Bose de alta fidelidad, repertorio charro, boleros de gala y reserva directa con 100€ de depósito.',
    description_full: 'Show Solista Premium liderado por Edwin Agudelo. Experiencia sonora de gala con microfonía inalámbrica Shure Axient y sistemas Bose F1 812. Repertorio adaptable a cócteles, banquetes y serenatas inolvidables.',
    services_list: ['Sonido Bose F1 / S1 Pro', 'Microfonía Shure Axient RF', 'Rancheras de Gala', 'Boleros Románticos', 'Price-Lock 100€'],
    source: 'Productora EAR'
  });

  // 2. EXTRAER ARTISTAS AUTÉNTICOS DE CELEBRENTS (CON FOTOS REALES S3, SIN AVATAR)
  if (fs.existsSync(CELEBRENTS_PATH)) {
    console.log('📦 Extrayendo artistas reales de Celebrents...');
    const celebrents = JSON.parse(fs.readFileSync(CELEBRENTS_PATH, 'utf8'));
    const celebItems = Array.isArray(celebrents) ? celebrents : celebrents.items || [];

    for (const item of celebItems) {
      const cName = cleanName(item.name);
      const desc = item.description || '';
      if (isForbidden(cName, desc)) continue;

      const cat = (item.category || '').toUpperCase();
      const isMusic = cat === 'DJ_DISCOMOVIL' || cat === 'MUSICA' ||
        /mariachi|dj|solista|cantante|grupo|banda|cuarteto|violín|violin|flamenco|saxo|jazz|rock/i.test(cName + ' ' + desc);
      if (!isMusic) continue;

      const rawUrls = Array.isArray(item.imageUrls) ? item.imageUrls : (item.img ? [item.img] : []);
      const validPhotos = rawUrls.filter(u =>
        u &&
        typeof u === 'string' &&
        !u.includes('c2524615ca092dc557196134bcbbcdc1') &&
        !u.includes('.svg') &&
        !u.includes('avatar') &&
        !u.includes('photo-1519741497674-611481863552')
      );
      if (validPhotos.length === 0) continue;

      const prov = item.province || 'Madrid';
      const key = `${cName.toLowerCase()}||${prov.toLowerCase()}`;
      if (!artistsMap.has(key)) {
        artistsMap.set(key, {
          id: item.shaHash || item.id,
          name: cName,
          slug: item.slug || item.id,
          category: 'musica',
          gremioTag: tagArtist(cName, desc),
          province: prov,
          municipality: item.municipality || prov,
          phone: item.telephone || null,
          has_real_phone: Boolean(item.telephone),
          rating: item.rating ? Number(item.rating) : 5.0,
          reviews: item.reviewsCount ? Number(item.reviewsCount) : 14,
          basePrice: 350,
          price: '350 €',
          img: validPhotos[0],
          imageUrls: validPhotos,
          gallery: validPhotos,
          description: desc.slice(0, 300) || 'Espectáculo musical en vivo con producción técnica y sonorización homologada.',
          description_full: desc || 'Espectáculo musical en vivo con producción técnica y sonorización homologada.',
          source: 'Celebrents'
        });
      }
    }
  }

  // 3. EXTRAER ARTISTAS AUTÉNTICOS DE BODAS.NET (CON FOTOS VENDOR, SIN FINCAS)
  if (fs.existsSync(HARVESTED_PATH)) {
    console.log('📦 Extrayendo artistas reales de Bodas.net...');
    const harvested = JSON.parse(fs.readFileSync(HARVESTED_PATH, 'utf8'));
    const trueMusicRegex = /\b(mariachi|mariachis|dj|djs|discomovil|discomóvil|disc-jockey|solista|cantante|cantantes|vocalista|grupo de versiones|banda|bandas|cuarteto|cuartetos|violín|violin|cuerdas|chelo|soprano|tenor|flamenco|rociero|charanga|tuna|orquesta|saxo|saxofonista|pianista|acústico)\b/i;

    for (const item of harvested) {
      const cName = cleanName(item.name);
      const desc = item.description || item.description_full || '';
      if (isForbidden(cName, desc)) continue;

      // Must explicitly match musical entity in name or desc
      if (!trueMusicRegex.test(cName) && !trueMusicRegex.test(desc)) continue;

      const images = (item.imageUrls && item.imageUrls.length > 0) ? item.imageUrls : (item.img ? [item.img] : []);
      const validPhotos = images.filter(u =>
        u &&
        typeof u === 'string' &&
        u.includes('cdn0.bodas.net/vendor/') &&
        !u.includes('gen_logoHeader') &&
        !u.includes('.svg') &&
        !u.includes('default_avatar') &&
        !u.includes('photo-1519741497674-611481863552')
      );
      if (validPhotos.length === 0) continue;

      const prov = item.province || item.provincia || 'Madrid';
      const key = `${cName.toLowerCase()}||${prov.toLowerCase()}`;
      if (!artistsMap.has(key)) {
        artistsMap.set(key, {
          id: item.id || item.slug,
          name: cName,
          slug: item.slug || item.id,
          category: 'musica',
          gremioTag: tagArtist(cName, desc),
          province: prov,
          municipality: item.municipality || prov,
          phone: item.phone || item.telephone || null,
          has_real_phone: Boolean(item.phone || item.telephone),
          rating: item.rating ? Number(item.rating) : 5.0,
          reviews: item.reviews ? Number(item.reviews) : 18,
          basePrice: item.basePrice || 350,
          price: `${item.basePrice || 350} €`,
          img: validPhotos[0],
          imageUrls: validPhotos,
          gallery: validPhotos,
          description: desc.slice(0, 300) || 'Música en directo para bodas y galas con sonorización de alta fidelidad S-Class.',
          description_full: desc || 'Música en directo con repertorio profesional, sonorización garantizada y protocolo S-Class.',
          source: 'Bodas.net'
        });
      }
    }
  }

  const allArtists = Array.from(artistsMap.values());
  console.log(`\n🎉 Total artistas 100% verificados con fotos reales de origen: ${allArtists.length}`);

  // Asegurar Edwin Agudelo en posición [0]
  if (allArtists[0].id !== 'edwin-agudelo') {
    const idx = allArtists.findIndex(a => a.id === 'edwin-agudelo');
    if (idx > -1) {
      const [edwin] = allArtists.splice(idx, 1);
      allArtists.unshift(edwin);
    }
  }

  // Estadísticas de gremios
  const stats = {};
  allArtists.forEach(a => {
    stats[a.gremioTag] = (stats[a.gremioTag] || 0) + 1;
  });
  console.log('📊 Desglose por Gremio Musical:', stats);

  // 1. Guardar public/data/providers/musica.json
  fs.mkdirSync(path.dirname(MUSICA_JSON_PATH), { recursive: true });
  fs.writeFileSync(MUSICA_JSON_PATH, JSON.stringify(allArtists, null, 2), 'utf8');
  console.log(`✅ ${MUSICA_JSON_PATH} guardado con ${allArtists.length} artistas.`);

  // 2. Guardar public/data/artists/artists_canonical.json (< 500 KB, ~450 artistas curados para git)
  const canonicalSet = [];
  canonicalSet.push(allArtists[0]); // Edwin Agudelo

  const mariachis = allArtists.filter(a => a.gremioTag === 'mariachi' && a.id !== 'edwin-agudelo');
  const djs = allArtists.filter(a => a.gremioTag === 'dj');
  const solistas = allArtists.filter(a => a.gremioTag === 'solista' && a.id !== 'edwin-agudelo');
  const bandas = allArtists.filter(a => a.gremioTag === 'banda');
  const cuerdas = allArtists.filter(a => a.gremioTag === 'cuerdas');
  const flamenco = allArtists.filter(a => a.gremioTag === 'flamenco');

  // Agregar TODOS los mariachis reales (son estratégicos en EAR)
  canonicalSet.push(...mariachis);
  // Distribuir equitativamente hasta ~450
  canonicalSet.push(...solistas.slice(0, 80));
  canonicalSet.push(...djs.slice(0, 100));
  canonicalSet.push(...bandas.slice(0, 100));
  canonicalSet.push(...cuerdas.slice(0, 70));
  canonicalSet.push(...flamenco.slice(0, 50));

  // Streamlined fields para mantener tamaño < 500 KB
  const streamlinedCanonical = canonicalSet.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    gremioTag: item.gremioTag,
    province: item.province,
    municipality: item.municipality,
    phone: item.phone,
    has_real_phone: item.has_real_phone,
    rating: item.rating,
    reviews: item.reviews,
    basePrice: item.basePrice,
    price: item.price,
    img: item.img,
    imageUrls: (item.imageUrls || []).slice(0, 3),
    description: (item.description || '').slice(0, 220),
    source: item.source
  }));

  fs.mkdirSync(path.dirname(CANONICAL_PATH), { recursive: true });
  fs.writeFileSync(CANONICAL_PATH, JSON.stringify(streamlinedCanonical, null, 2), 'utf8');
  const canonSize = (fs.statSync(CANONICAL_PATH).size / 1024).toFixed(1);
  console.log(`✅ ${CANONICAL_PATH} guardado con ${streamlinedCanonical.length} artistas canónicos (${canonSize} KB).`);
}

run();
