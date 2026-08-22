const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'demetrio_luces_navidad_2025.json');
const raw = fs.readFileSync(catalogPath, 'utf8');
const products = JSON.parse(raw);

const IMAGE_POOLS = {
  "Motivos 3D Gigantes": [
    "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=800&auto=format&fit=crop", // oso luminoso
    "https://images.unsplash.com/photo-1543258103-a62bdc069871?q=80&w=800&auto=format&fit=crop", // ciervo / reno 3d
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop", // arbol y figuras 3d
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop", // soldado / figura navideña
    "https://images.unsplash.com/photo-1543791187-df796fa11835?q=80&w=800&auto=format&fit=crop"  // esfera 3d transitable
  ],
  "Conos y Árboles Gigantes 3D": [
    "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop", // cono gigante plaza mayor
    "https://images.unsplash.com/photo-1576692155415-95f820a2c4c1?q=80&w=800&auto=format&fit=crop", // arbol monumental
    "https://images.unsplash.com/photo-1482517967863-00e15c9b451a?q=80&w=800&auto=format&fit=crop", // arbol led nocturno
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop"
  ],
  "Motivos 2D y Arcos de Calle": [
    "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?q=80&w=800&auto=format&fit=crop", // arcos de calle iluminados
    "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=800&auto=format&fit=crop", // avenida iluminada
    "https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=800&auto=format&fit=crop", // cielo estrellado callejero
    "https://images.unsplash.com/photo-1543791187-df796fa11835?q=80&w=800&auto=format&fit=crop"
  ],
  "Esferas 3D Plegables": [
    "https://images.unsplash.com/photo-1543791187-df796fa11835?q=80&w=800&auto=format&fit=crop", // bola gigante transitable
    "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop"
  ],
  "Árboles y Almendros LED": [
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop", // arbol con ramas luminosas
    "https://images.unsplash.com/photo-1482517967863-00e15c9b451a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576692155415-95f820a2c4c1?q=80&w=800&auto=format&fit=crop"
  ],
  "Twinkly Pro Smart LED": [
    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800&auto=format&fit=crop", // smart rgb lights
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=800&auto=format&fit=crop"
  ],
  "Cortinas y Mallas LED": [
    "https://images.unsplash.com/photo-1511268559489-34b624fbfcf5?q=80&w=800&auto=format&fit=crop", // cortina de micro led
    "https://images.unsplash.com/photo-1545622783-b3e021430026?q=80&w=800&auto=format&fit=crop", // cascada de luces
    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800&auto=format&fit=crop"
  ],
  "Guirnaldas Profesionales": [
    "https://images.unsplash.com/photo-1545622783-b3e021430026?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511268559489-34b624fbfcf5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?q=80&w=800&auto=format&fit=crop"
  ],
  "Elementos Decorativos y Bolas": [
    "https://images.unsplash.com/photo-1543791187-df796fa11835?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=800&auto=format&fit=crop"
  ],
  "Motivos Plásticos / Biodegradables": [
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
  ],
  "Accesorios y Montaje": [
    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?q=80&w=800&auto=format&fit=crop"
  ]
};

const DEFAULT_POOL = [
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543258103-a62bdc069871?q=80&w=800&auto=format&fit=crop"
];

products.forEach((p, idx) => {
  const pool = IMAGE_POOLS[p.category] || DEFAULT_POOL;
  // Deterministic pick based on index or SKU hash
  const imageIndex = idx % pool.length;
  p.image = pool[imageIndex];
});

fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`[OK] Asignadas imágenes de stock de alta calidad a ${products.length} productos de luces de Navidad.`);
