/**
 * 🛡️ ANTIGRAVITY OMEGA — PURGADOR TOTAL DE IMÁGENES DE MARCAS DE TERCEROS (ZERO-LEAK)
 * =================================================================================
 * Reemplaza todas las URLs que contengan 'celebrents' u otros dominios de terceros por
 * imágenes HD curadas de la galería S-Class de Productora EAR.
 */

const fs = require('fs');
const path = require('path');

const PROVIDERS_DIR = path.join(__dirname, '../public/data/providers');
const ARTISTS_CANONICAL_PATH = path.join(__dirname, '../public/data/artists/artists_canonical.json');

const HD_PHOTO_POOLS = {
  mariachi: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop"
  ],
  dj: [
    "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop"
  ],
  solista: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop"
  ],
  banda: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"
  ],
  cuerdas: [
    "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
  ],
  flamenco: [
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543794327-59a91fb815d1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
  ]
};

function getHDPhoto(gremioTag, seed) {
  const pool = HD_PHOTO_POOLS[gremioTag] || HD_PHOTO_POOLS.solista;
  const hash = String(seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

function cleanProviderImages(item) {
  const gremio = item.gremioTag || 'solista';
  const seed = item.id || item.name || 'artist';

  const isThirdPartyLeak = (url) => {
    if (!url || typeof url !== 'string') return true;
    const lUrl = url.toLowerCase();
    return lUrl.includes('celebrents') || lUrl.includes('c2524615ca092dc557196134bcbbcdc1') || lUrl.includes('default_avatar');
  };

  // Purgar img
  if (isThirdPartyLeak(item.img)) {
    item.img = getHDPhoto(gremio, seed);
  }

  // Purgar imageUrls
  if (Array.isArray(item.imageUrls)) {
    item.imageUrls = item.imageUrls.filter(u => !isThirdPartyLeak(u));
    if (item.imageUrls.length === 0) {
      item.imageUrls = [item.img];
    }
  } else {
    item.imageUrls = [item.img];
  }

  // Purgar gallery
  if (Array.isArray(item.gallery)) {
    item.gallery = item.gallery.filter(u => !isThirdPartyLeak(u));
    if (item.gallery.length === 0) {
      item.gallery = [item.img];
    }
  } else {
    item.gallery = [item.img];
  }

  // Purgar cualquier mención a Celebrents en descripciones o campos
  if (item.source === 'Celebrents') item.source = 'Red EAR';
  if (item.description) item.description = item.description.replace(/celebrents/gi, 'Productora EAR');
  if (item.description_full) item.description_full = item.description_full.replace(/celebrents/gi, 'Productora EAR');

  return item;
}

function processAllFiles() {
  console.log('🛡️ Purgando de forma absoluta cualquier URL de Celebrents...');
  const files = ['musica.json', 'all_featured.json'];

  files.forEach(fileName => {
    const filePath = path.join(PROVIDERS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let purgedCount = 0;
      items.forEach(item => {
        const hasLeak = (item.img && item.img.includes('celebrents')) ||
                        (item.imageUrls && item.imageUrls.some(u => typeof u === 'string' && u.includes('celebrents')));
        if (hasLeak) purgedCount++;
        cleanProviderImages(item);
      });
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
      console.log(`✅ ${fileName}: ${purgedCount} registros purgados de fugas de Celebrents.`);
    }
  });

  if (fs.existsSync(ARTISTS_CANONICAL_PATH)) {
    const canonical = JSON.parse(fs.readFileSync(ARTISTS_CANONICAL_PATH, 'utf8'));
    canonical.forEach(cleanProviderImages);
    fs.writeFileSync(ARTISTS_CANONICAL_PATH, JSON.stringify(canonical, null, 2), 'utf8');
    console.log(`✅ artists_canonical.json purgado.`);
  }
}

processAllFiles();
