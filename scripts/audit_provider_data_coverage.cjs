#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * AUDIT_PROVIDER_DATA_COVERAGE.CJS — CENSO FORENSE CAMPO A CAMPO (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════════
 * MISIÓN:
 *   Medir el ÚLTIMO BIT real de cada proveedor: teléfono, WhatsApp, web, email,
 *   redes sociales, coordenadas GPS, dirección, provincia, categoría, imagen...
 *   Sin cargar el data lake completo en RAM (escáner JSON por streaming).
 *
 * SALIDA:
 *   reports/PROVIDER_DATA_COVERAGE.json  (censo completo)
 *   Resumen ejecutivo JSON por consola.
 *
 * DOCTRINA (AGENTS.md §8):
 *   verified:true SOLO con teléfono real verificable. Placeholder de centralita
 *   (+34 693 693 048) o vacío NO es teléfono de proveedor.
 * ════════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SSOT = path.join(ROOT, 'src', 'data', 'all_providers_database.json');
const EDGE_DIR = path.join(ROOT, 'public', 'data', 'providers');
const OUT = path.join(ROOT, 'reports', 'PROVIDER_DATA_COVERAGE.json');

const CENTRALITA = '+34 693 693 048';

/* ─────────────────────────── HELPERS DE CAMPO ─────────────────────────── */

const FIELD_ALIASES = {
    phone: [/^(phone|telefono|tel[eé]fono|telephone|tel|movil|m[oó]vil|mobile|phone_number|contact_phone|telefono_contacto)$/i],
    whatsapp: [/^(whatsapp|whats_app|wa|whatsapp_number|telefono_whatsapp)$/i],
    web: [/^(web|website|url|site|web_url|website_url|homepage|pagina_web|p[aá]gina_web|dominio)$/i],
    email: [/^(email|mail|correo|email_address|correo_electronico|correo_electr[oó]nico)$/i],
    instagram: [/^(instagram|instagram_url|ig|insta)$/i],
    facebook: [/^(facebook|facebook_url|fb|fanpage)$/i],
    tiktok: [/^(tiktok|tiktok_url)$/i],
    twitter: [/^(twitter|twitter_url)$/i],
    youtube: [/^(youtube|youtube_url|canal_youtube)$/i],
    linkedin: [/^(linkedin|linkedin_url)$/i],
    pinterest: [/^(pinterest|pinterest_url)$/i],
    lat: [/^(lat|latitude|latitud|gps_lat|geo_lat|coord_lat)$/i],
    lng: [/^(lng|lon|long|longitude|longitud|gps_lng|gps_lon|geo_lng|coord_lng)$/i],
    coordinates: [/^(coordinates|coords|gps|geolocation|ubicacion_gps|geo)$/i],
    address: [/^(address|direccion|direcci[oó]n|street|calle|address_line|direccion_completa)$/i],
    city: [/^(city|ciudad|municipio|localidad|town)$/i],
    province: [/^(province|provincia|state|region|comunidad)$/i],
    postalCode: [/^(postal_code|postcode|zip|zip_code|cp|codigo_postal|c[oó]digo_postal)$/i],
    category: [/^(category|categoria|categor[ií]a|gremio|sector|type|tipo)$/i],
    subcategory: [/^(subcategory|subcategoria|subcategor[ií]a|especialidad)$/i],
    rating: [/^(rating|valoracion|valoraci[oó]n|stars|estrellas|score)$/i],
    reviews: [/^(reviews|review_count|num_reviews|opiniones|resenas|rese[ñn]as)$/i],
    price: [/^(price|precio|basePrice|base_price|price_from|precio_desde)$/i],
    image: [/^(img|image|imagen|photo|foto|logo|cover|main_image|imagen_principal)$/i],
    description: [/^(description|descripcion|descripci[oó]n|about|resumen|bio)$/i],
    verified: [/^(verified|verificado|is_verified|verif)$/i],
    source: [/^(source|fuente|origin|origen|source_url|url_origen|scraped_from)$/i],
    id: [/^(id|_id|uuid|provider_id|vendor_id)$/i],
    name: [/^(name|nombre|title|business_name|razon_social|raz[oó]n_social)$/i],
    slug: [/^(slug|permalink|handle)$/i]
};

function hasValue(v) {
    if (v == null) return false;
    if (typeof v === 'string') {
        const s = v.trim();
        return s !== '' && s !== 'null' && s !== 'undefined' && s !== 'N/A' && s !== 'NA';
    }
    if (typeof v === 'number') return Number.isFinite(v) && v !== 0;
    if (typeof v === 'boolean') return v === true;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
}

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function isPlaceholderPhone(p) {
    const n = normPhone(p);
    if (!n) return false;
    return n === normPhone(CENTRALITA);
}

function isRealPhone(p) {
    const n = normPhone(p);
    if (!n) return false;
    if (isPlaceholderPhone(p)) return false;
    return n.length >= 9;
}

function pick(record, aliasKey) {
    const aliases = FIELD_ALIASES[aliasKey] || [];
    for (const k of Object.keys(record)) {
        for (const re of aliases) {
            if (re.test(k)) {
                const v = record[k];
                if (hasValue(v)) return { key: k, value: v };
            }
        }
    }
    return null;
}

function normCategory(raw) {
    const s = String(raw == null ? '' : raw)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    if (!s) return 'servicios';
    const map = {
        finca: 'finca', fincas: 'finca', espacios: 'finca', hacienda: 'finca',
        catering: 'catering', banquetes: 'catering',
        musica: 'musica', dj: 'musica', mariachi: 'musica',
        foto: 'foto', fotografia: 'foto', fotografo: 'foto', video: 'foto', videografia: 'foto',
        decoracion: 'decoracion', flores: 'decoracion', floristeria: 'decoracion',
        servicios: 'servicios', 'wedding planner': 'servicios', animacion: 'servicios',
        moda: 'moda', novias: 'moda', trajes: 'moda', vestidos: 'moda',
        transporte: 'transporte', coches: 'transporte', autobuses: 'transporte',
        sonido: 'sonido', iluminacion: 'sonido', luces: 'sonido',
        wedding: 'wedding', boda: 'wedding', bodas: 'wedding',
        'senior care': 'senior_care', residencias: 'senior_care', residencia: 'senior_care', senior: 'senior_care', geriatrico: 'senior_care'
    };
    if (map[s]) return map[s];
    for (const [k, v] of Object.entries(map)) {
        if (s.includes(k)) return v;
    }
    return s.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'servicios';
}

/* ───────────────────── ESCÁNER JSON POR STREAMING ───────────────────── */

/**
 * Recorre un array JSON de objetos de primer nivel sin cargarlo completo.
 * Invoca onRecord(obj) por cada elemento y libera memoria.
 */
async function scanJsonArray(file, onRecord) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 1024 * 1024 });
        let depth = 0;
        let inString = false;
        let escaped = false;
        let started = false;
        let buf = '';
        let count = 0;

        stream.on('data', (chunk) => {
            for (let i = 0; i < chunk.length; i++) {
                const ch = chunk[i];
                if (!started) {
                    if (ch === '[') { started = true; depth = 1; }
                    continue;
                }
                if (inString) {
                    buf += ch;
                    if (escaped) escaped = false;
                    else if (ch === '\\') escaped = true;
                    else if (ch === '"') inString = false;
                    continue;
                }
                if (ch === '"') { inString = true; buf += ch; continue; }
                if (ch === '{') { depth++; buf += ch; continue; }
                if (ch === '}') {
                    depth--;
                    if (depth === 1) {
                        try {
                            onRecord(JSON.parse(buf + '}'));
                            count++;
                        } catch (err) {
                            onRecord(null);
                        }
                        buf = '';
                    } else {
                        buf += ch;
                    }
                    continue;
                }
                if (ch === '[') { depth++; buf += ch; continue; }
                if (ch === ']') {
                    depth--;
                    if (depth === 0) {
                        stream.destroy();
                        resolve(count);
                        return;
                    }
                    buf += ch;
                    continue;
                }
                if (depth >= 2) buf += ch;
            }
        });
        stream.on('end', () => resolve(count));
        stream.on('error', reject);
    });
}

/* ─────────────────────────────── CENSO ─────────────────────────────── */

const fieldStats = {};
for (const key of Object.keys(FIELD_ALIASES)) {
    fieldStats[key] = { present: 0, missing: 0, sample: null };
}

const keyFrequency = new Map();
let total = 0;
let corrupt = 0;
let realPhone = 0;
let placeholderPhone = 0;
let noPhone = 0;
let verifiedTrue = 0;
let verifiedTrueWithoutRealPhone = 0;
let withWebAndPhone = 0;
let withSocialAndPhone = 0;
let withGpsAndPhone = 0;
let fullStack = 0;

const uniqueRealPhones = new Set();
const uniquePhoneToName = new Map();
const duplicatePhoneRecords = { count: 0, examples: [] };
const perCategory = {};
const sourceDomains = new Map();

async function census(file) {
    if (!fs.existsSync(file)) {
        console.error(`[CENSO] FUENTE INEXISTENTE: ${file}`);
        return 0;
    }
    const sizeMB = (fs.statSync(file).size / 1048576).toFixed(1);
    console.error(`[CENSO] Escaneando ${path.basename(file)} (${sizeMB} MB) por streaming...`);

    return scanJsonArray(file, (record) => {
        total++;
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            corrupt++;
            return;
        }

        for (const k of Object.keys(record)) {
            keyFrequency.set(k, (keyFrequency.get(k) || 0) + 1);
        }

        const found = {};
        for (const key of Object.keys(FIELD_ALIASES)) {
            const hit = pick(record, key);
            if (hit) {
                fieldStats[key].present++;
                found[key] = hit.value;
                if (!fieldStats[key].sample) fieldStats[key].sample = String(hit.value).slice(0, 80);
            } else {
                fieldStats[key].missing++;
            }
        }

        let phoneValue = found.phone || null;
        if (!phoneValue && found.whatsapp) phoneValue = found.whatsapp;
        const real = isRealPhone(phoneValue);
        if (real) realPhone++;
        else if (isPlaceholderPhone(phoneValue)) placeholderPhone++;
        else noPhone++;

        const vRaw = record.verified ?? record.verificado ?? record.is_verified ?? null;
        const isVerified = vRaw === true || vRaw === 'true';
        if (isVerified) {
            verifiedTrue++;
            if (!real) verifiedTrueWithoutRealPhone++;
        }

        if (real) {
            const n = normPhone(phoneValue);
            const name = String(found.name || '').toLowerCase().trim();
            if (uniqueRealPhones.has(n)) {
                duplicatePhoneRecords.count++;
                if (duplicatePhoneRecords.examples.length < 15) {
                    duplicatePhoneRecords.examples.push({
                        phone: n,
                        kept: uniquePhoneToName.get(n) || '(sin nombre)',
                        duplicate: name || '(sin nombre)'
                    });
                }
            } else {
                uniqueRealPhones.add(n);
                uniquePhoneToName.set(n, name || '(sin nombre)');
            }
        }

        if (real) {
            const hasWeb = Boolean(found.web);
            const hasSocial = Boolean(found.instagram || found.facebook || found.tiktok || found.twitter || found.youtube || found.linkedin);
            const hasGps = Boolean((found.lat && found.lng) || found.coordinates);
            if (hasWeb) withWebAndPhone++;
            if (hasSocial) withSocialAndPhone++;
            if (hasGps) withGpsAndPhone++;
            if (hasWeb && hasSocial && hasGps) fullStack++;
        }

        const cat = normCategory(found.category || 'servicios');
        if (!perCategory[cat]) {
            perCategory[cat] = { total: 0, realPhone: 0, verified: 0, web: 0, social: 0, gps: 0, email: 0 };
        }
        perCategory[cat].total++;
        if (real) perCategory[cat].realPhone++;
        if (isVerified && real) perCategory[cat].verified++;
        if (found.web) perCategory[cat].web++;
        if (found.instagram || found.facebook) perCategory[cat].social++;
        if ((found.lat && found.lng) || found.coordinates) perCategory[cat].gps++;
        if (found.email) perCategory[cat].email++;

        if (found.web) {
            const m = String(found.web).match(/^(?:https?:\/\/)?(?:www\.)?([^/\s]+)/i);
            if (m && m[1]) {
                const d = m[1].toLowerCase();
                sourceDomains.set(d, (sourceDomains.get(d) || 0) + 1);
            }
        }
    });
}

/* ───────────────────── COMPARATIVA CON PARTICIONES EDGE ───────────────────── */

function edgeCensus() {
    let edgeFiles = [];
    const manifestPath = path.join(EDGE_DIR, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            for (const [key, entry] of Object.entries(manifest)) {
                if (key.startsWith('_')) continue;
                if (!entry || typeof entry !== 'object') continue;
                if (!Array.isArray(entry.chunks)) continue;
                edgeFiles.push(...entry.chunks);
            }
        } catch {
            edgeFiles = [];
        }
    }
    if (edgeFiles.length === 0) {
        edgeFiles = fs.existsSync(EDGE_DIR)
            ? fs.readdirSync(EDGE_DIR).filter((f) => /^(finca|catering|musica|foto|decoracion|servicios|moda|transporte|sonido|wedding|senior_care)(__\d+)?\.json$/.test(f))
            : [];
    }
    const result = {
        files: {},
        totalPublished: 0,
        withWeb: 0,
        withSocial: 0,
        withGps: 0,
        withEmail: 0,
        withWhatsapp: 0,
        verifiedTrue: 0,
        distinctSchemas: 0,
        fields: {}
    };
    for (const f of edgeFiles) {
        const full = path.join(EDGE_DIR, f);
        let arr;
        try {
            arr = JSON.parse(fs.readFileSync(full, 'utf8'));
        } catch (e) {
            result.files[f] = { error: e.message };
            continue;
        }
        if (!Array.isArray(arr)) {
            result.files[f] = { error: 'no-array' };
            continue;
        }
        const stat = { count: arr.length, withWeb: 0, withSocial: 0, withGps: 0, withEmail: 0, withWhatsapp: 0, verifiedTrue: 0 };
        for (const r of arr) {
            const keys = Object.keys(r).sort().join(',');
            result.fields[keys] = (result.fields[keys] || 0) + 1;
            const hasWeb = hasValue(r.web) || hasValue(r.website);
            const hasSocial = hasValue(r.instagram) || hasValue(r.facebook) || hasValue(r.tiktok) || hasValue(r.twitter) || hasValue(r.youtube) || hasValue(r.linkedin);
            const hasGps = (hasValue(r.lat) && hasValue(r.lng)) || hasValue(r.coordinates);
            if (hasWeb) stat.withWeb++;
            if (hasSocial) stat.withSocial++;
            if (hasGps) stat.withGps++;
            if (hasValue(r.email)) stat.withEmail++;
            if (hasValue(r.whatsapp)) stat.withWhatsapp++;
            if (r.verified === true) stat.verifiedTrue++;
        }
        result.totalPublished += arr.length;
        result.withWeb += stat.withWeb;
        result.withSocial += stat.withSocial;
        result.withGps += stat.withGps;
        result.withEmail += stat.withEmail;
        result.withWhatsapp += stat.withWhatsapp;
        result.verifiedTrue += stat.verifiedTrue;
        result.files[f] = stat;
    }
    result.distinctSchemas = Object.keys(result.fields).length;
    return result;
}

/* ─────────────────────────────── MAIN ─────────────────────────────── */

async function main() {
    const started = Date.now();
    await census(SSOT);

    const edge = edgeCensus();

    const pct = (n, d) => (d === 0 ? 0 : Number(((n / d) * 100).toFixed(2)));
    const coverage = {};
    for (const key of Object.keys(fieldStats)) {
        coverage[key] = {
            present: fieldStats[key].present,
            missing: fieldStats[key].missing,
            pct: pct(fieldStats[key].present, total),
            sample: fieldStats[key].sample
        };
    }

    const topKeys = Array.from(keyFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 60)
        .map(([k, c]) => ({ key: k, count: c, pct: pct(c, total) }));

    const report = {
        meta: {
            generado: new Date().toISOString(),
            fuente: path.relative(ROOT, SSOT),
            tamanoMB: Number((fs.statSync(SSOT).size / 1048576).toFixed(1)),
            doctrina: 'verified:true SOLO con teléfono real (no centralita, no vacío)',
            duracionSeg: 0
        },
        totales: {
            registros: total,
            corruptos: corrupt,
            telefonoReal: realPhone,
            telefonoPlaceholderCentralita: placeholderPhone,
            sinTelefono: noPhone,
            verifiedTrue,
            verifiedTrueSinTelefonoReal: verifiedTrueWithoutRealPhone,
            telefonosUnicosReales: uniqueRealPhones.size,
            registrosDuplicadosPorTelefono: duplicatePhoneRecords.count,
            proveedoresConWebYTelefono: withWebAndPhone,
            proveedoresConRedesYTelefono: withSocialAndPhone,
            proveedoresConGpsYTelefono: withGpsAndPhone,
            proveedoresFullStack: fullStack
        },
        coberturaPctSobreTotal: {
            telefonoReal: pct(realPhone, total),
            web: coverage.web.pct,
            email: coverage.email.pct,
            instagram: coverage.instagram.pct,
            facebook: coverage.facebook.pct,
            whatsapp: coverage.whatsapp.pct,
            gps: Number((((coverage.lat.present + coverage.coordinates.present) / Math.max(total, 1)) * 100).toFixed(2)),
            direccion: coverage.address.pct,
            categoria: coverage.category.pct,
            imagen: coverage.image.pct,
            rating: coverage.rating.pct
        },
        campos: coverage,
        topKeys,
        porCategoria: perCategory,
        duplicadosEjemplos: duplicatePhoneRecords.examples,
        topDominiosWeb: Array.from(sourceDomains.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25),
        edge
    };

    report.meta.duracionSeg = Number(((Date.now() - started) / 1000).toFixed(1));

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');

    const resumen = {
        fuenteMB: report.meta.tamanoMB,
        registros: total,
        telefonoReal: `${realPhone} (${pct(realPhone, total)}%)`,
        centralitaPlaceholder: `${placeholderPhone} (${pct(placeholderPhone, total)}%)`,
        sinTelefono: noPhone,
        telefonosUnicos: uniqueRealPhones.size,
        duplicadosPorTelefono: duplicatePhoneRecords.count,
        verifiedFalsePositives: verifiedTrueWithoutRealPhone,
        web: `${coverage.web.present} (${coverage.web.pct}%)`,
        email: `${coverage.email.present} (${coverage.email.pct}%)`,
        instagram: `${coverage.instagram.present} (${coverage.instagram.pct}%)`,
        facebook: `${coverage.facebook.present} (${coverage.facebook.pct}%)`,
        whatsapp: `${coverage.whatsapp.present} (${coverage.whatsapp.pct}%)`,
        gps: `${coverage.lat.present} (${coverage.lat.pct}%)`,
        fullStackPhoneWebSocialGps: fullStack,
        edgePublicado: edge.totalPublished,
        edgeConWeb: edge.withWeb,
        edgeConRedes: edge.withSocial,
        edgeConGps: edge.withGps,
        edgeConEmail: edge.withEmail,
        edgeVerifiedTrue: edge.verifiedTrue,
        edgeEsquemasDistintos: edge.distinctSchemas,
        duracionSeg: report.meta.duracionSeg,
        salida: path.relative(ROOT, OUT)
    };

    console.log(JSON.stringify(resumen, null, 2));
}

main().catch((err) => {
    console.error('[CENSO] ERROR FATAL:', err);
    process.exit(1);
});
