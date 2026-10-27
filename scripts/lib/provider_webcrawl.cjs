'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PROVIDER_WEBCRAWL.CJS — EXTRACCIÓN FORENSE DE CONTACTO EN DOMINIOS PROPIOS
 * ════════════════════════════════════════════════════════════════════════════════
 * Funciones puras (sin red) usadas por scripts/crawl_discovered_websites.cjs y
 * scripts/lib/webcrawl_merge.cjs. Doctrina CERO FACHADAS:
 *   - Un teléfono solo es válido si es español, no es centralita, no es
 *     tarificación especial y no es un placeholder evidente.
 *   - Un contacto solo se atribuye si la página confirma la identidad del
 *     proveedor (nombre/dominio) y NO es un dominio aparcado o en venta.
 *   - Cada dato viaja con provenance SHA-256 del HTML donde se encontró.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');

const CENTRALITA_DIGITS = '693693048';

const PREMIUM_PREFIXES = [
    '700', '703', '704', '705', '706', '707', '708', '709',
    '803', '806', '807', '901', '902', '905', '909'
];

const PLACEHOLDER_DIGITS = new Set([
    '600000000', '611111111', '622222222', '633333333', '644444444',
    '655555555', '666666666', '677777777', '688888888', '699999999',
    '900000000', '911111111', '922222222', '933333333', '944444444',
    '955555555', '966666666', '977777777', '988888888', '999999999'
]);

const EMAIL_BLOCKLIST = [
    'bodas.net', 'bodas.com', 'zankyou.es', 'zankyou.com', 'matrimonio.com',
    'google.com', 'google.es', 'facebook.com', 'instagram.com', 'tiktok.com',
    'youtube.com', 'linkedin.com', 'twitter.com', 'x.com', 'pinterest.com',
    'wixpress.com', 'sentry.io', 'example.com', 'dominio.com', 'tudominio.com',
    'email.com', 'mail.com', 'shopify.com', 'godaddy.com', 'squarespace.com',
    'wordpress.com', 'paginasamarillas.es', 'axesor.es', 'einforma.com',
    'infoisinfo.es', 'guiaempresas.es', 'amazon.es', 'booking.com',
    'airbnb.es', 'idealista.com'
];

const MARKETPLACE_HOSTS = [
    'bodas.net', 'bodas.com', 'zankyou.es', 'zankyou.com', 'matrimonio.com',
    'google.com', 'google.es', 'bing.com', 'facebook.com', 'instagram.com',
    'tiktok.com', 'youtube.com', 'linkedin.com', 'twitter.com', 'x.com',
    'pinterest.com', 'whatsapp.com', 'wa.me', 'wa.link', 'tripadvisor.es',
    'tripadvisor.com', 'yelp.es', 'yelp.com', 'paginasamarillas.es', 'axesor.es',
    'einforma.com', 'empresite.eleconomista.es', 'infoisinfo.es', 'guiaempresas.es',
    'foursquare.com', 'waze.com', 'apple.com', 'maps.apple.com', 'booking.com',
    'airbnb.es', 'airbnb.com', 'expedia.es', 'trivago.es', 'idealista.com',
    'fotocasa.es', 'milanuncios.com', 'wallapop.com', 'amazon.es',
    'eltenedor.es', 'thefork.es', 'just-eat.es', 'glovoapp.com',
    'doctoralia.es', 'habitissimo.es', 'cronoshare.com', 'milanuncios.es',
    'webnode.es', 'weebly.com', 'blogspot.com', 'wordpress.com', 'wix.com',
    'squarespace.com', 'godaddy.com', 'shopify.com', 'mystrikingly.com',
    'negocio.site', 'business.site', 'sites.google.com', 'linktr.ee'
];

const PARKING_SIGNALS = [
    /dominio\s+(?:est[aá]\s+)?(?:en\s+venta|aparcado|disponible)/i,
    /comprar?\s+este\s+dominio/i,
    /this\s+domain\s+(?:is|may\s+be|might\s+be)\s+for\s+sale/i,
    /domain\s+(?:is\s+)?parked/i,
    /parking[- ]page/i,
    /sedo(?:\.com)?/i,
    /dan\.com|hugedomains|afternic|undeveloped\.com/i,
    /p[aá]gina\s+en\s+construcci[oó]n/i,
    /sitio\s+web\s+no\s+disponible/i,
    /cuenta\s+suspendida|hosting\s+suspendido/i,
    /default\s+web\s+page|apache2\s+ubuntu\s+default\s+page|nginx\s+welcome/i
];

const STOP_TOKENS = new Set([
    'de', 'la', 'el', 'los', 'las', 'del', 'y', 'e', 'en', 'por', 'para', 'con',
    'the', 'and', 'of', 'sl', 'slu', 'sa', 'sau', 'cb', 'sll', 'scp', 'soc',
    'coop', 'slne', 'cif', 'nif', 'espana', 'spain', 'eventos', 'evento',
    'bodas', 'boda', 'finca', 'fincas', 'foto', 'fotos', 'fotografia',
    'servicios', 'grupo', 'estudio', 'producciones', 'spa', 'web', 'oficial'
]);

const PROVINCE_NAMES = [
    'a coruna', 'alava', 'albacete', 'alicante', 'almeria', 'asturias', 'avila',
    'badajoz', 'baleares', 'barcelona', 'bizkaia', 'burgos', 'caceres', 'cadiz',
    'cantabria', 'castellon', 'ceuta', 'ciudad real', 'cordoba', 'cuenca',
    'girona', 'granada', 'guadalajara', 'gipuzkoa', 'huelva', 'huesca', 'jaen',
    'la rioja', 'las palmas', 'leon', 'lleida', 'lugo', 'madrid', 'malaga',
    'melilla', 'murcia', 'navarra', 'ourense', 'palencia', 'pontevedra',
    'salamanca', 'santa cruz de tenerife', 'segovia', 'sevilla', 'soria',
    'tarragona', 'teruel', 'toledo', 'valencia', 'valladolid', 'zamora', 'zaragoza'
];

/* ───────────────────────────── NORMALIZACIÓN ───────────────────────────── */

function stripAccents(value) {
    return String(value == null ? '' : value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normText(value) {
    return stripAccents(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function safeFromCodePoint(code) {
    if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return ' ';
    try {
        return String.fromCodePoint(code);
    } catch (err) {
        return ' ';
    }
}

function decodeEntities(value) {
    return String(value == null ? '' : value)
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeFromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => safeFromCodePoint(parseInt(dec, 10)))
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&apos;|&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}

/** Texto plano legible: elimina script/style/noscript y colapsa espacios. */
function htmlToText(html) {
    const raw = String(html == null ? '' : html);
    const withoutBlocks = raw
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
        .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ');
    return decodeEntities(withoutBlocks.replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeUrl(raw) {
    const value = String(raw == null ? '' : raw).trim();
    if (!value) return '';
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value.replace(/^\/+/, '')}`;
    try {
        const url = new URL(withScheme);
        if (!/^https?:$/.test(url.protocol)) return '';
        url.hash = '';
        return url.toString();
    } catch (err) {
        return '';
    }
}

function hostOf(raw) {
    const url = normalizeUrl(raw);
    if (!url) return '';
    try {
        return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    } catch (err) {
        return '';
    }
}

/** Dominio registrable aproximado (sin dependencia de public suffix list). */
function registrableDomain(host) {
    const clean = String(host == null ? '' : host).toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
    if (!clean) return '';
    if (/^\d+\.\d+\.\d+\.\d+$/.test(clean)) return clean;
    const parts = clean.split('.').filter(Boolean);
    if (parts.length <= 2) return parts.join('.');
    const secondLevel = new Set(['co', 'com', 'org', 'net', 'gob', 'edu', 'nom', 'mil']);
    const suffixLength = secondLevel.has(parts[parts.length - 2]) ? 3 : 2;
    return parts.slice(-suffixLength).join('.');
}

function domainOf(raw) {
    const host = hostOf(raw);
    return host ? registrableDomain(host) : '';
}

function isMarketplaceHost(host) {
    if (!host) return true;
    return MARKETPLACE_HOSTS.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

/* ───────────────────────────── TELÉFONOS ───────────────────────────── */

function normalizePhoneDigits(raw) {
    let digits = String(raw == null ? '' : raw).replace(/[^0-9]/g, '');
    if (digits.startsWith('0034')) digits = digits.slice(4);
    else if (digits.startsWith('34') && digits.length === 11) digits = digits.slice(2);
    return digits;
}

function isValidSpanishPhone(raw) {
    const digits = normalizePhoneDigits(raw);
    if (digits.length !== 9) return false;
    if (!/^[6789]/.test(digits)) return false;
    if (PREMIUM_PREFIXES.includes(digits.slice(0, 3))) return false;
    if (digits === CENTRALITA_DIGITS) return false;
    if (PLACEHOLDER_DIGITS.has(digits)) return false;
    if (/^(\d)\1{8}$/.test(digits)) return false;
    return true;
}

function phoneKindOf(raw) {
    const digits = normalizePhoneDigits(raw);
    if (!digits) return '';
    return /^[67]/.test(digits) ? 'MOVIL' : 'FIJO';
}

function formatPhone(raw) {
    const digits = normalizePhoneDigits(raw);
    if (!digits) return '';
    return `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

/**
 * Extrae teléfonos con jerarquía de evidencia: tel: > wa.me > texto.
 * Devuelve como máximo `limit` números válidos y la lista de WhatsApp.
 */
function extractPhones(html, text, limit) {
    const max = Number.isFinite(limit) && limit > 0 ? limit : 5;
    const raw = String(html == null ? '' : html);
    const plain = text == null ? htmlToText(raw) : String(text);
    const telephones = new Map();
    const whatsappLinks = [];

    const pushPhone = (value, source) => {
        const digits = normalizePhoneDigits(value);
        if (!isValidSpanishPhone(digits)) return;
        if (telephones.has(digits)) return;
        telephones.set(digits, { digits, source, kind: phoneKindOf(digits), formatted: formatPhone(digits) });
    };

    for (const match of raw.matchAll(/tel:\s*([+0-9().\s-]{6,24})/gi)) pushPhone(match[1], 'tel_href');

    const whatsappPatterns = [
        /wa\.me\/(?:\+)?(\d{9,15})/gi,
        /api\.whatsapp\.com\/send\?(?:[^"'\s>]*?phone=)(\d{9,15})/gi,
        /whatsapp:\/\/send\?(?:[^"'\s>]*?phone=)(\d{9,15})/gi
    ];
    for (const pattern of whatsappPatterns) {
        for (const match of raw.matchAll(pattern)) {
            const digits = normalizePhoneDigits(match[1]);
            if (!isValidSpanishPhone(digits)) continue;
            if (!whatsappLinks.includes(digits)) whatsappLinks.push(digits);
            pushPhone(digits, 'whatsapp');
        }
    }
    for (const match of raw.matchAll(/wa\.link\/([A-Za-z0-9_-]{4,40})/gi)) {
        if (!whatsappLinks.includes(match[0])) whatsappLinks.push(match[0]);
    }

    const textPattern = /(?<![\d+])(?:\+34|0034)?[\s.-]?[6789](?:[\s.-]?\d){8}(?!\d)/g;
    for (const match of plain.matchAll(textPattern)) {
        pushPhone(match[0], 'page_text');
    }

    const weight = { tel_href: 0, whatsapp: 1, page_text: 2 };
    const sourceWeight = (source) => (Number.isFinite(weight[source]) ? weight[source] : 3);
    const ordered = [...telephones.values()]
        .sort((a, b) => sourceWeight(a.source) - sourceWeight(b.source))
        .slice(0, max);

    return {
        phones: ordered.map((p) => p.formatted),
        digits: ordered.map((p) => p.digits),
        kinds: ordered.map((p) => p.kind),
        sources: ordered.map((p) => p.source),
        primary: ordered.length ? ordered[0].formatted : '',
        primaryDigits: ordered.length ? ordered[0].digits : '',
        primarySource: ordered.length ? ordered[0].source : '',
        whatsapp: whatsappLinks.slice(0, 5)
    };
}

/* ───────────────────────────── EMAILS / REDES ───────────────────────────── */

function isBlockedEmail(email) {
    const value = String(email == null ? '' : email).trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) return true;
    const host = value.split('@')[1];
    if (EMAIL_BLOCKLIST.some((entry) => host === entry || host.endsWith(`.${entry}`))) return true;
    if (/^(noreply|no-reply|donotreply|postmaster|abuse|webmaster|sentry|wix)@/.test(value)) return true;
    if (/\.(png|jpe?g|gif|svg|webp|css|js)$/i.test(value)) return true;
    return false;
}

function extractEmails(html, text) {
    const raw = `${String(html == null ? '' : html)} ${text == null ? '' : text}`;
    const seen = [];
    for (const match of raw.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) {
        const email = match[0].toLowerCase().replace(/\.+$/, '');
        if (isBlockedEmail(email)) continue;
        if (!seen.includes(email)) seen.push(email);
    }
    return seen.slice(0, 3);
}

function extractSocials(html) {
    const raw = String(html == null ? '' : html);
    const socials = {};
    const patterns = {
        instagram: /https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]{2,30})/gi,
        facebook: /https?:\/\/(?:www\.)?facebook\.com\/(?!sharer|share|dialog|plugins|tr\?)([A-Za-z0-9._%-]{2,60})/gi,
        tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9._]{2,30})/gi,
        youtube: /https?:\/\/(?:www\.)?youtube\.com\/(?:channel|c|user)\/([A-Za-z0-9._-]{2,60})/gi,
        linkedin: /https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/(?:company|in)\/([A-Za-z0-9._-]{2,80})/gi
    };
    const reserved = new Set(['p', 'explore', 'reels', 'stories', 'accounts', 'about', 'privacy', 'legal', 'help']);
    for (const [kind, pattern] of Object.entries(patterns)) {
        for (const match of raw.matchAll(pattern)) {
            const handle = match[match.length - 1];
            if (!handle || reserved.has(handle.toLowerCase())) continue;
            socials[kind] = match[0].replace(/\/+$/, '');
            break;
        }
    }
    return socials;
}

/* ───────────────────────────── IDENTIDAD LEGAL ───────────────────────────── */

const CIF_LETTERS = 'JABCDEFGHI';

function validateCif(value) {
    const cif = String(value == null ? '' : value).toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (!/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/.test(cif)) return false;
    const body = cif.slice(1, 8);
    let sum = 0;
    for (let i = 0; i < 7; i++) {
        const digit = Number(body[i]);
        if (i % 2 === 0) {
            const doubled = digit * 2;
            sum += Math.floor(doubled / 10) + (doubled % 10);
        } else {
            sum += digit;
        }
    }
    const unit = (10 - (sum % 10)) % 10;
    const control = cif[8];
    const letter = CIF_LETTERS[unit];
    const prefix = cif[0];
    if (/[ABEH]/.test(prefix)) return control === String(unit);
    if (/[KPQSNW]/.test(prefix)) return control === letter;
    return control === String(unit) || control === letter;
}

function extractCif(text) {
    const plain = String(text == null ? '' : text);
    for (const match of plain.matchAll(/\b([ABCDEFGHJKLMNPQRSUVW])[\s.-]?(\d{7})[\s.-]?([0-9A-J])\b/gi)) {
        const candidate = `${match[1]}${match[2]}${match[3]}`;
        if (validateCif(candidate)) return candidate.toUpperCase();
    }
    for (const match of plain.matchAll(/N\.?I\.?F\.?[\s:.-]*(\d{8})[\s.-]?([A-Z])\b/gi)) {
        const candidate = `${match[1]}${match[2]}`.toUpperCase();
        const letter = 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(match[1]) % 23];
        if (candidate[8] === letter) return candidate;
    }
    return '';
}

function cleanCompanyName(value) {
    const out = String(value == null ? '' : value)
        .replace(/^(?:la\s+)?(?:empresa|sociedad|entidad)\s+/i, '')
        .replace(/\s+(?:con\s+)?(?:C\.?I\.?F\.?|N\.?I\.?F\.?)\b.*$/i, '')
        .replace(/\s+(?:y\s+)?(?:con\s+)?domicili\w+.*$/i, '')
        .replace(/[,;:.\-–]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (out.length < 3 || out.length > 90) return '';
    if (/^(el|la|los|las|este|esta|nuestro|nuestra)\b/i.test(out)) return '';
    return out;
}

function extractRazonSocial(text) {
    const plain = String(text == null ? '' : text);
    const patterns = [
        /(?:denominaci[oó]n\s+social|raz[oó]n\s+social)\s*(?:es|:|\-|–)?\s*([A-Z0-9][^.;\n]{2,90})/i,
        /(?:empresa\s+titular|titular\s+del\s+(?:sitio|portal|web)|titularidad\s+de)\s*(?:es|:|\-|–)?\s*([A-Z0-9][^.;\n]{2,90})/i,
        /(?:©|copyright)\s*(?:\d{4}\s*(?:-\s*\d{4})?\s*)?([A-Z0-9][^.;\n]{2,80})/i
    ];
    for (const pattern of patterns) {
        const match = pattern.exec(plain);
        if (!match) continue;
        const cleaned = cleanCompanyName(match[1]);
        if (cleaned) return cleaned;
    }
    return '';
}

function detectProvinces(text) {
    const normalized = ` ${normText(text)} `;
    const hits = [];
    for (const province of PROVINCE_NAMES) {
        if (normalized.includes(` ${province} `)) hits.push(province);
    }
    return hits;
}

/* ───────────────────────────── IDENTIDAD / FACHADAS ───────────────────────────── */

function tokenSetOf(value) {
    return new Set(normText(value).split(' ').filter((t) => t.length >= 3 && !STOP_TOKENS.has(t)));
}

/**
 * Comprueba que la página pertenece realmente al proveedor.
 * Evita atribuir el contacto de un dominio caducado, aparcado o ajeno.
 */
function identityMatchesName(name, text, domain) {
    const tokens = [...tokenSetOf(name)].filter((t) => t.length >= 4);
    const compactName = normText(name).replace(/ /g, '');
    const normalizedText = normText(text);
    const compactText = normalizedText.replace(/ /g, '');
    const matched = [];

    if (compactName.length >= 10 && compactText.includes(compactName)) matched.push('full_name');
    for (const token of tokens) {
        if (normalizedText.includes(token)) matched.push(token);
    }

    const mainToken = tokens.reduce((best, token) => (token.length > best.length ? token : best), '');
    const domainCompact = String(domain || '').replace(/[^a-z0-9]/g, '');
    const domainHit = Boolean(
        domainCompact
        && ((compactName.length >= 8 && domainCompact.includes(compactName.slice(0, 12)))
            || (mainToken.length >= 5 && domainCompact.includes(mainToken)))
    );

    const required = Math.min(2, Math.max(1, tokens.length));
    const fullNameHit = matched.includes('full_name');
    const nameConfirmed = fullNameHit
        || matched.length >= required
        || (mainToken.length >= 6 && normalizedText.includes(mainToken));
    const strength = domainHit ? 'domain' : fullNameHit ? 'full' : nameConfirmed ? 'tokens' : 'none';

    return {
        confirmed: Boolean(nameConfirmed || domainHit),
        nameConfirmed: Boolean(nameConfirmed),
        domainHit,
        strength,
        matched: [...new Set(matched)].slice(0, 8),
        mainToken
    };
}

function looksParked(text) {
    const plain = String(text == null ? '' : text);
    if (plain.trim().length < 60) return true;
    return PARKING_SIGNALS.some((pattern) => pattern.test(plain));
}

function sha256(value) {
    return crypto.createHash('sha256').update(String(value == null ? '' : value), 'utf8').digest('hex');
}

/**
 * Analiza el HTML de una página concreta del dominio del proveedor.
 * No decide la atribución final: aporta evidencia para que el merge aplique doctrina.
 */
function extractPageIntel({ html, url, providerName, domain, province }) {
    const raw = String(html == null ? '' : html);
    const text = htmlToText(raw);
    const identity = identityMatchesName(providerName, text, domain);
    const phones = extractPhones(raw, text);
    const emails = extractEmails(raw, text);
    const socials = extractSocials(raw);
    const cif = extractCif(text);
    const razonSocial = extractRazonSocial(text);
    const provinces = detectProvinces(text);
    const provinceSignal = province
        ? (provinces.includes(normText(province)) ? 'match' : (provinces.length ? 'other' : 'unknown'))
        : 'unknown';

    return {
        url,
        domain,
        provenance: sha256(raw),
        textLength: text.length,
        identity,
        phones,
        emails,
        socials,
        cif,
        razonSocial,
        provinces,
        provinceSignal,
        parked: looksParked(text)
    };
}

module.exports = {
    CENTRALITA_DIGITS,
    PREMIUM_PREFIXES,
    PLACEHOLDER_DIGITS,
    MARKETPLACE_HOSTS,
    PROVINCE_NAMES,
    stripAccents,
    normText,
    tokenSetOf,
    decodeEntities,
    htmlToText,
    normalizeUrl,
    hostOf,
    registrableDomain,
    domainOf,
    isMarketplaceHost,
    normalizePhoneDigits,
    isValidSpanishPhone,
    phoneKindOf,
    formatPhone,
    extractPhones,
    extractEmails,
    isBlockedEmail,
    extractSocials,
    validateCif,
    extractCif,
    extractRazonSocial,
    detectProvinces,
    identityMatchesName,
    looksParked,
    sha256,
    extractPageIntel
};
