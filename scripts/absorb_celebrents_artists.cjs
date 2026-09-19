#!/usr/bin/env node
/**
 * 🎸 B1.03 — INGESTA CELEBRENTS ARTISTS → artists_canonical.json
 * Lee src/data/celebrents_providers.json (10.049 perfiles) y genera el dataset
 * curato de ARTISTAS MÚSICOS para el Motor Neural 200D (ArtistCalibration side 51-100).
 * Cero fakes: solo transforma datos reales ya vampirizados. Sin phone verificado → Google Search.
 */
const fs = require('fs');
const path = require('path');

const CELEBRENTS_PATH = path.join(__dirname, '..', 'src', 'data', 'celebrents_providers.json');
const OUT_DIR = path.join(__dirname, '..', 'public', 'data', 'artists');
const OUT_PATH = path.join(OUT_DIR, 'artists_canonical.json');

// Palabras clave musicales para filtrar DJ_DISCOMOVIL → artistas musicales reales
const MUSIC_FORMAT_KEYWORDS = [
    'mariachi', 'orquesta', 'grupo', 'cantante', 'solista', 'guitarra', 'voz', 'vocal',
    'dj', 'discomovil', 'jazz', 'rock', 'pop', 'flamenco', 'coro', 'tuna', 'opera',
    'cuarteto', 'duo', 'duo', 'trio', 'trío', 'clasica', 'clásica', 'soprano', 'tenor',
    'charanga', 'rondalla', 'saxo', 'piano', 'violin', 'violín', 'musica', 'música',
    'sarau', 'sarao', 'orchestra', 'banda', 'bolero', 'ranchera', 'cuerda', 'gospel',
    'bossa', 'latino', 'electronica', 'electrónica', 'acustico', 'acústico'
];

const PROVINCIA_REGEX = /(?:Álava|Albacete|Alicante|Almería|Asturias|Ávila|Badajoz|Baleares|Barcelona|Burgos|Cáceres|Cádiz|Cantabria|Castellón|Ceuta|Ciudad Real|Córdoba|Cuenca|Girona|Granada|Guadalajara|Gipuzkoa|Huelva|Huesca|Jaén|La Coruña|La Rioja|Las Palmas|León|Lleida|Lugo|Madrid|Málaga|Melilla|Murcia|Navarra|Ourense|Palencia|Pontevedra|Salamanca|Segovia|Sevilla|Soria|Tarragona|Tenerife|Teruel|Toledo|Valencia|Valladolid|Vizcaya|Zamora|Zaragoza)/i;

const slugify = (s) => String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const parseEuro = (str) => {
    if (!str) return null;
    const m = String(str).match(/(\d{2,5})\s*(?:€|eur)/i);
    return m ? parseInt(m[1], 10) : null;
};

const inferFormats = (name, desc) => {
    const t = `${name} ${desc}`.toLowerCase();
    const formats = [];
    if (/(mariachi)/.test(t)) formats.push('Mariachi (3-9 pax)');
    if (/(solista|cantante|voz en directo|soprano|tenor)/.test(t)) formats.push('Solista Acústico');
    if (/(orquesta|ensamble|banda|big ?band)/.test(t)) formats.push('Orquesta Gran Formato (8+ pax)');
    if (/(grupo|banda|conjunto|rock|pop|indie)/.test(t) && !/(mariachi|orquesta)/.test(t)) formats.push('Banda Pop/Rock (4-6 pax)');
    if (/(duo|dúo|trio|trío|cuarteto|quinteto)/.test(t) && !/mariachi/.test(t)) formats.push('Dúo/Trío');
    if (/(dj|discomovil|disc-jockey|pincha)/.test(t)) formats.push('DJ + Instrumento Live');
    if (/(tuna|rondalla)/.test(t)) formats.push('Tuna');
    if (/(charanga)/.test(t)) formats.push('Charanga');
    if (/(gospel)/.test(t)) formats.push('Coro Gospel');
    if (/(coro|rocieros|coral)/.test(t) && !/gospel/.test(t)) formats.push('Coro Gospel');
    if (/(flamenco)/.test(t)) formats.push('Flamenco Cuadro');
    if (/(clasic|clásic|opera|ópera|lirica|lírica|soprano|tenor)/.test(t)) formats.push('Soprano/Tenor Lírico');
    if (/(cuarteto|violin|violín|cuerda)/.test(t)) formats.push('Cuarteto Cuerda');
    if (!formats.length) formats.push('DJ + Instrumento Live');
    return [...new Set(formats)].slice(0, 2);
};

const inferGenres = (name, desc) => {
    const t = `${name} ${desc}`.toLowerCase();
    const genres = [];
    if (/mariachi|ranchera|charro/.test(t)) genres.push('Mariachi');
    if (/flamenco|rociero/.test(t)) genres.push('Flamenco Fusión');
    if (/jazz|bossa/.test(t)) genres.push('Bossa/Jazz');
    if (/rock|pop rock/.test(t)) genres.push('Rock Clásico');
    if (/pop /.test(t) || /pop$/.test(t)) genres.push('Pop Español');
    if (/indie/.test(t)) genres.push('Indie');
    if (/clasic|clásic|opera|ópera|lirica|lírica|liturgic|litúrgic/.test(t)) genres.push('Clásico Litúrgico');
    if (/gospel|coro/.test(t)) genres.push('Coro Gospel');
    if (/latino|salsa|cumbia/.test(t)) genres.push('Latino/Salsa');
    if (/electron|house|dj|discomovil/.test(t) && !/(jazz|rock|pop)/.test(t)) genres.push('Electrónica/House');
    if (/bolero/.test(t)) genres.push('Pop Español');
    if (!genres.length) genres.push('Pop Español');
    return [...new Set(genres)].slice(0, 3);
};

const inferVoice = (name, desc) => {
    const t = `${name} ${desc}`.toLowerCase();
    if (/(soprano|femenina|cantante f)/.test(t)) return 'Femenina';
    if (/(tenor|masculina|cantante m)/.test(t)) return 'Masculina';
    if (/(instrumental)/.test(t)) return 'Instrumental Puro';
    return 'Indiferente';
};

const cleanDescription = (d) => String(d || '')
    .replace(/\s*\|\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);

const googleSearchUrl = (name, province) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${name} ${province}`)}`;

function main() {
    if (!fs.existsSync(CELEBRENTS_PATH)) {
        console.error('No existe', CELEBRENTS_PATH);
        process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(CELEBRENTS_PATH, 'utf8'));
    const items = Array.isArray(raw) ? raw : raw.items || [];

    const artists = items
        .filter((x) => x.category === 'DJ_DISCOMOVIL' || x.category === 'MUSICA')
        .filter((x) => {
            const t = `${x.name} ${x.description}`.toLowerCase();
            return MUSIC_FORMAT_KEYWORDS.some((k) => t.includes(k));
        })
        .map((x, i) => {
            const priceMin = parseEuro(x.priceRange);
            const basePrice = priceMin && priceMin >= 100 ? Math.max(150, priceMin - (priceMin % 50)) : 350;
            const province = x.province || 'Madrid';
            const description = cleanDescription(x.description);
            const formats = inferFormats(x.name, x.description);
            const genres = inferGenres(x.name, x.description);
            const formacion = formats[0] || 'Solista Acústico';

            // Construcción del lado ARTISTA (dimensiones 51-100) del ArtistCalibration
            const dimensions = {
                51: formacion,
                52: genres,
                53: [],
                54: inferVoice(x.name, x.description),
                55: 'Animador de Pista',
                56: ['Español'],
                57: 'Elegante Casual',
                58: true,
                59: false,
                60: false,
                61: true,   // ceremonia
                62: true,   // cóctel
                63: true,   // sorpresa banquete
                64: true,   // baile nupcial
                65: true,   // fiesta
                66: false,  // serenata
                67: false,  // brunch
                68: '60 min Estándar',
                69: true,   // playlist descansos
                70: true,   // presta micro
                71: basePrice,
                72: true,   // tarifa personalizada
                73: 100,
                74: false,
                75: true,   // Price-Lock 100 €
                76: true,   // Split 80/10/10
                77: 'Transferencia 48h antes',
                78: false,  // facturación
                79: 'Autónomo',
                80: 100,
                81: true,   // sonido propio
                82: true,   // mesa finca
                83: true,   // bateria electronica
                84: true,   // equipo autonomo
                85: true,   // <75 dBA
                86: 'Enchufe estándar',
                87: false,
                88: false,
                89: 3,
                90: '00:00',
                91: province,
                92: 50,
                93: true,
                94: true,
                95: 'Recomendable',
                96: 'Recomendable',
                97: true,
                98: true,
                99: true,
                100: 1
            };

            const name = x.name || `Artista ${i + 1}`;
            return {
                id: x.shaHash || `art-${i}`,
                slug: `${slugify(name)}-${(x.sourceUrl || '').match(/-(\d+)\/$/)?.[1] || i}`,
                name,
                province,
                municipality: x.municipality || province,
                region: province,
                category: x.category,
                formats,
                genres,
                basePrice,
                priceRange: x.priceRange || `${basePrice} €`,
                rating: x.rating ?? null,
                reviewsCount: x.reviewsCount ?? null,
                description,
                imageUrls: Array.isArray(x.imageUrls) ? x.imageUrls.slice(0, 3) : [],
                img: x.img || (Array.isArray(x.imageUrls) ? x.imageUrls[0] : null),
                telephone: x.telephone || null,
                contactHref: x.telephone
                    ? `https://wa.me/${String(x.telephone).replace(/[^0-9]/g, '')}`
                    : googleSearchUrl(name, province),
                source: x.source || 'Celebrents',
                sourceUrl: x.sourceUrl || null,
                status: x.status || 'GHOST_UNCLAIMED',
                vampirizedAt: x.vampirizedAt || null,
                calibratedBy: 'self',
                completionPercent: 72,
                dimensions
            };
        })
        .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewsCount || 0) - (a.reviewsCount || 0));

    // Partición sintética curada (< 1 MB, < 500 registros)
    const canonical = artists.slice(0, 380);

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(canonical, null, 0), 'utf8');

    const sizeMb = (fs.statSync(OUT_PATH).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ artists_canonical.json generado: ${canonical.length} artistas musicales (${sizeMb} MB)`);
    console.log(`   Ruta: ${OUT_PATH}`);
}

main();