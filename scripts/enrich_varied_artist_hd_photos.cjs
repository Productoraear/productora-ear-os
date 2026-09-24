/**
 * 🎨 ENRIQUECEDOR DE DIVERSIDAD FOTOGRÁFICA HD PARA ARTISTAS Y MARIACHIS
 * Asigna fotos HD únicas de conciertos, mariachis y espectáculos en directo
 * para evitar repeticiones visuales en el catálogo.
 */

const fs = require('fs');
const path = require('path');

const MUSICA_JSON_PATH = path.join(__dirname, '../public/data/providers/musica.json');
const ARTISTS_CANONICAL_PATH = path.join(__dirname, '../public/data/artists/artists_canonical.json');

const MARIACHI_HD_PHOTOS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445985543468-b421a9e5420b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop"
];

const GENERAL_ARTIST_HD_PHOTOS = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543794327-59a91fb815d1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1200&auto=format&fit=crop"
];

function stringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function enrichImages(items) {
  items.forEach((item, idx) => {
    const isMariachi = item.gremioTag === 'mariachi' || (item.name || '').toLowerCase().includes('mariachi');
    const pool = isMariachi ? MARIACHI_HD_PHOTOS : GENERAL_ARTIST_HD_PHOTOS;
    const seedStr = `${item.id || ''}_${item.name || ''}_${item.province || ''}_${idx}`;
    const hash = stringHash(seedStr);
    const selectedPhoto = pool[hash % pool.length];

    const currentImg = item.img || '';
    const isBouquetOrGeneric = currentImg.includes('519741497674') || currentImg.includes('8632') || currentImg.includes('46203') || currentImg.includes('celebrents');

    if (isMariachi || isBouquetOrGeneric || !currentImg) {
      item.img = selectedPhoto;
      item.imageUrls = [selectedPhoto, pool[(hash + 1) % pool.length], pool[(hash + 2) % pool.length]];
      item.gallery = item.imageUrls;
    }
  });
}

function main() {
  console.log('🎨 Enriqueciendo diversidad de fotos HD para Mariachis y Artistas...');
  if (fs.existsSync(MUSICA_JSON_PATH)) {
    const items = JSON.parse(fs.readFileSync(MUSICA_JSON_PATH, 'utf8'));
    enrichImages(items);
    fs.writeFileSync(MUSICA_JSON_PATH, JSON.stringify(items, null, 2), 'utf8');
    console.log(`✅ musica.json actualizado con fotos variadas HD para ${items.length} artistas.`);
  }

  if (fs.existsSync(ARTISTS_CANONICAL_PATH)) {
    const canonical = JSON.parse(fs.readFileSync(ARTISTS_CANONICAL_PATH, 'utf8'));
    enrichImages(canonical);
    fs.writeFileSync(ARTISTS_CANONICAL_PATH, JSON.stringify(canonical, null, 2), 'utf8');
    console.log(`✅ artists_canonical.json actualizado.`);
  }
}

main();
