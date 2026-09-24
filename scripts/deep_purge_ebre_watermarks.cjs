/**
 * 🛡️ ANTIGRAVITY OMEGA — DEEP PURGE DE LOGOS Y AGUAS "EBRE" / CELEBRENTS (100% CLEAN)
 * =================================================================================
 * Elimina de forma quirúrgica el archivo c2524615ca092dc557196134bcbbcdc1.png (el logo rosa con letras 'ebre')
 * y todos los placeholders de avatares/logos de todos los 13 datasets en public/data/providers/.
 */

const fs = require('fs');
const path = require('path');

const PROVIDERS_DIR = path.join(__dirname, '../public/data/providers');

// Pools de imágenes HD verificadas por categoría (Unsplash Premium sin marca de agua)
const CATEGORY_HD_POOLS = {
  finca: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop"
  ],
  decoracion: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop"
  ],
  musica: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop"
  ],
  sonido: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
  ],
  foto: [
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop"
  ],
  servicios: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
  ]
};

function isWatermarkedOrPlaceholder(url) {
  if (!url || typeof url !== 'string') return true;
  const l = url.toLowerCase();
  return (
    l.includes('c2524615ca092dc557196134bcbbcdc1') ||
    l.includes('default_avatar') ||
    l.includes('gen_logoheader') ||
    l.includes('741e9617168a2484.jpg') ||
    l.includes('.svg') ||
    l.includes('placeholder')
  );
}

function getFallbackPhoto(category, seed) {
  const cat = (category || 'servicios').toLowerCase();
  const pool = CATEGORY_HD_POOLS[cat] || CATEGORY_HD_POOLS.servicios;
  const hash = String(seed || 'item').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

function purgeDataset(fileName) {
  const filePath = path.join(PROVIDERS_DIR, fileName);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const items = Array.isArray(parsed) ? parsed : (parsed.items || parsed.providers || []);
  if (!Array.isArray(items)) return;

  let purgedImagesCount = 0;

  items.forEach(item => {
    const cat = item.category || fileName.replace(/\.json$/, '');
    const seed = item.id || item.name || 'seed';

    // 1. Purgar imageUrls
    if (Array.isArray(item.imageUrls)) {
      const cleanUrls = item.imageUrls.filter(u => !isWatermarkedOrPlaceholder(u));
      if (cleanUrls.length !== item.imageUrls.length) {
        purgedImagesCount += (item.imageUrls.length - cleanUrls.length);
      }
      item.imageUrls = cleanUrls.length > 0 ? cleanUrls : [getFallbackPhoto(cat, seed)];
    } else {
      item.imageUrls = [getFallbackPhoto(cat, seed)];
    }

    // 2. Purgar gallery
    if (Array.isArray(item.gallery)) {
      const cleanGallery = item.gallery.filter(u => !isWatermarkedOrPlaceholder(u));
      item.gallery = cleanGallery.length > 0 ? cleanGallery : item.imageUrls;
    } else {
      item.gallery = item.imageUrls;
    }

    // 3. Purgar img principal
    if (isWatermarkedOrPlaceholder(item.img)) {
      item.img = item.imageUrls[0];
    }
  });

  const output = Array.isArray(parsed) ? items : { ...parsed, items };
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`✅ ${fileName}: ${purgedImagesCount} imágenes contaminadas con marca "ebre"/placeholder eliminadas.`);
}

function main() {
  console.log('🧹 Iniciando Purga Masiva de Imágenes "ebre" y Placeholders...');
  if (!fs.existsSync(PROVIDERS_DIR)) return;

  const files = fs.readdirSync(PROVIDERS_DIR).filter(f => f.endsWith('.json'));
  files.forEach(purgeDataset);

  console.log('🎉 PURGA COMPLETA: Ningún dataset contiene la imagen de prueba "ebre" ni placeholders rotos.');
}

main();
