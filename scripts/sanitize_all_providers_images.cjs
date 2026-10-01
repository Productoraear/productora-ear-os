const fs = require('fs');
const path = require('path');

const PROVIDERS_DIR = path.join(__dirname, '..', 'public', 'data', 'providers');

// Curated high-resolution Unsplash pools per category (S-Class aesthetic, 1200x800+, vibrant OLED compatible)
const SCLASS_HD_POOLS = {
  finca: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
  ],
  catering: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=1200&auto=format&fit=crop'
  ],
  sonido: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1200&auto=format&fit=crop'
  ],
  musica: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop'
  ],
  foto: [
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=1200&auto=format&fit=crop'
  ],
  decoracion: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop'
  ],
  transporte: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop'
  ],
  servicios: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop'
  ],
  moda: [
    'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop'
  ],
  wedding: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
  ]
};

function isSubstandardImage(url) {
  if (!url || typeof url !== 'string') return true;
  const u = url.toLowerCase().trim();
  if (u.includes('.svg')) return true;
  if (u.includes('gen_logoheader')) return true;
  if (u.includes('default_avatar')) return true;
  if (u.includes('741e9617168a2484.jpg')) return true;
  if (u.includes('c2524615ca092dc557196134bcbbcdc1')) return true;
  if (u.includes('cobi%2fmedia%2fcct61%2fcache')) return true;
  if (u.includes('/cct61/cache/')) return true;
  if (u.includes('celebrents.s3.amazonaws.com')) return true;
  if (u.includes('photo-1519741497674-611481863552')) return true; // generic bouquet
  return false;
}

function getHDReplacement(category, seed) {
  const cat = (category || 'servicios').toLowerCase().trim();
  const pool = SCLASS_HD_POOLS[cat] || SCLASS_HD_POOLS.servicios;
  const hash = String(seed || 'seed')
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

function sanitizeProviderItem(item, categoryFallback) {
  const cat = item.category || categoryFallback;
  const seed = item.id || item.slug || item.name || 'prov';

  // Check main image
  let mainImg = item.img;
  if (isSubstandardImage(mainImg)) {
    mainImg = getHDReplacement(cat, seed);
  }

  // Check imageUrls
  let imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
  imageUrls = imageUrls.filter(u => !isSubstandardImage(u));
  if (imageUrls.length === 0) {
    imageUrls = [mainImg];
  }

  // Check gallery
  let gallery = Array.isArray(item.gallery) ? item.gallery : [];
  gallery = gallery.filter(u => !isSubstandardImage(u));
  if (gallery.length === 0) {
    gallery = [mainImg];
  }

  return {
    ...item,
    img: mainImg,
    imageUrls,
    gallery
  };
}

async function run() {
  console.log('🏛️ INICIANDO SANITIZACIÓN GLOBAL S-CLASS DE IMÁGENES...');

  const files = fs.readdirSync(PROVIDERS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');

  let totalProviders = 0;
  let totalReplaced = 0;

  for (const file of files) {
    const filePath = path.join(PROVIDERS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      if (!Array.isArray(data)) continue;

      const catName = file.replace('.json', '');
      let fileReplaced = 0;

      const sanitized = data.map(item => {
        totalProviders++;
        const wasDirty = isSubstandardImage(item.img);
        if (wasDirty) {
          fileReplaced++;
          totalReplaced++;
        }
        return sanitizeProviderItem(item, catName);
      });

      fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8');
      console.log(`✅ ${file}: ${data.length} procesados | ${fileReplaced} imágenes de baja resolución sustituidas por HD S-Class.`);
    } catch (err) {
      console.error(`❌ Error en ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 SANITIZACIÓN COMPLETADA: ${totalProviders} proveedores auditados | ${totalReplaced} imágenes pixeladas o de baja resolución purificadas.`);
}

run();
