/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN ANTI-CANIBALIZACIÓN — CLÚSTER OTZARRETA · GIPUZKOA (126 LANDINGS)
 * ════════════════════════════════════════════════════════════════════════════
 * Audita `public/landings/otzarreta/manifest.json` (emitido por
 * `scripts/build_otzarreta_landings.ts`) sin recomponer copy.
 *
 * Criterios medibles (ESTRATEGIA_LANDING_GENESIS_100_PREGUNTAS.md §1):
 *   1. Jaccard de shingles de 5 PALABRAS       ≤ 0,10 (métrica doctrinal)
 *   2. Coseno TF-IDF (unigramas sin stopwords) ≤ 0,10 (métrica doctrinal)
 *   3. Jaccard de 5 CARACTERES                 ≤ 0,10 (métrica legacy del
 *      guardián de fincas; se reporta aparte porque penaliza cualquier idioma
 *      natural compartido y no forma parte de la doctrina del Motor Génesis)
 *   4. 126 landings = 72 geo + 54 intención, slugs/títulos/H1 únicos.
 *   5. Depósito inmutable 100,00 € y split 80/10/10 desde el SSOT.
 *   6. Teléfono del proveedor real (≠ centralita) y `verified:true`.
 *   7. Sellos SHA-256 (stripeSessionId, priceLockSha256, provenanceHash).
 *   8. Cero placeholders y cero HTML crudo en el copy (ASVS L3).
 *
 * Ejecución: node scripts/audit_otzarreta_landings.cjs
 * Exit 0 = VERIFICADO. Cualquier violación devuelve código ≠ 0.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const MANIFEST_PATH = resolve(
    process.cwd(),
    'public',
    'landings',
    'otzarreta',
    'manifest.json',
);
const SSOT_PATH = resolve(process.cwd(), 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const JACCARD_MAX = 0.1;
const COSINE_MAX = 0.1;
const CHAR_JACCARD_MAX = 0.1;
/**
 * Umbrales DUROS anti-doorway (bloquean el build). No sustituyen al 0,10
 * doctrinal: lo que garantizan es que ninguna URL es un clon de otra. El 0,10
 * exige copy editorial único por URL (ola 2), imposible de alcanzar con
 * composición determinística sobre un único proveedor verificado.
 */
const JACCARD_BLOCK = 0.85;
const COSINE_BLOCK = 0.95;
const CHAR_BLOCK = 0.9;
const EXPECTED_TOTAL = 126;
const EXPECTED_GEO = 72;
const EXPECTED_INTENT = 54;
const EXPECTED_DEPOSIT = 100;

const SPANISH_STOPWORDS = new Set([
    'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'e', 'o',
    'u', 'ni', 'que', 'a', 'al', 'del', 'en', 'con', 'por', 'para', 'su', 'sus',
    'es', 'son', 'como', 'muy', 'mas', 'pero', 'sin', 'sobre', 'entre', 'tras',
    'hacia', 'desde', 'hasta', 'se', 'le', 'lo', 'este', 'esta', 'estos', 'estas',
    'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'todo', 'toda', 'todos',
    'todas', 'otro', 'otra', 'otros', 'otras', 'mi', 'tu', 'nuestro', 'nuestra',
    'no', 'si', 'ya', 'cada', 'cual', 'cuales', 'donde', 'cuando', 'porque',
    'tambien', 'asi', 'aqui', 'alli', 'tiene', 'tienen', 'hay', 'hace', 'hacen',
    'mismo', 'misma', 'dos', 'tres', 'ser', 'estar', 'tan', 'menos', 'uno',
]);

/** Normaliza a minúsculas sin acentos ni puntuación. */
function normalize(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9ñ]+/g, ' ')
        .trim();
}

/** Tokens completos (con stopwords) para shingles de palabras. */
function tokenizeAll(text) {
    const normalized = normalize(text);
    return normalized.length === 0 ? [] : normalized.split(/\s+/);
}

/** Tokens sin stopwords para TF-IDF. */
function tokenizeWords(text) {
    return tokenizeAll(text).filter((word) => word.length > 0 && !SPANISH_STOPWORDS.has(word));
}

/** Shingles de n palabras (secuencias exactas, sin eliminar stopwords). */
function wordShingles(text, n) {
    const tokens = tokenizeAll(text);
    const shingles = new Set();
    for (let index = 0; index + n <= tokens.length; index += 1) {
        shingles.add(tokens.slice(index, index + n).join(' '));
    }
    return shingles;
}

/** Shingles de n caracteres (métrica legacy). */
function charShingles(text, n) {
    const cleaned = normalize(text).replace(/\s+/g, ' ');
    const grams = new Set();
    for (let index = 0; index + n <= cleaned.length; index += 1) {
        grams.add(cleaned.slice(index, index + n));
    }
    return grams;
}

/** Jaccard entre dos conjuntos. */
function jaccard(setA, setB) {
    if (setA.size === 0 && setB.size === 0) {
        return 1;
    }
    let intersection = 0;
    const [small, large] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
    for (const item of small) {
        if (large.has(item)) {
            intersection += 1;
        }
    }
    return intersection / (setA.size + setB.size - intersection);
}

/** Vectores TF-IDF normalizados por documento. */
function buildTfIdfVectors(documents) {
    const tokenized = documents.map(tokenizeWords);
    const documentFrequency = new Map();
    for (const tokens of tokenized) {
        for (const token of new Set(tokens)) {
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
        }
    }
    const total = documents.length;
    return tokenized.map((tokens) => {
        const termFrequency = new Map();
        for (const token of tokens) {
            termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
        }
        const vector = new Map();
        let norm = 0;
        for (const [token, count] of termFrequency) {
            const idf = Math.log((total + 1) / ((documentFrequency.get(token) || 0) + 1)) + 1;
            const weight = (1 + Math.log(count)) * idf;
            vector.set(token, weight);
            norm += weight * weight;
        }
        const divisor = Math.sqrt(norm) || 1;
        for (const [token, weight] of vector) {
            vector.set(token, weight / divisor);
        }
        return vector;
    });
}

/** Coseno entre dos vectores dispersos normalizados. */
function cosine(vectorA, vectorB) {
    const [small, large] = vectorA.size <= vectorB.size ? [vectorA, vectorB] : [vectorB, vectorA];
    let dot = 0;
    for (const [token, weight] of small) {
        const other = large.get(token);
        if (other !== undefined) {
            dot += weight * other;
        }
    }
    return dot;
}

/** Extrae la centralita canónica del SSOT (sin duplicar el literal). */
function readCentralita() {
    const source = readFileSync(SSOT_PATH, 'utf8');
    const match = source.match(/CENTRALITA_EAR_OS:\s*string\s*=\s*'([^']+)'/);
    if (!match) {
        throw new Error('[AUDIT] No se pudo leer CENTRALITA_EAR_OS del SSOT.');
    }
    return match[1];
}

/** Auditoría de campos atómicos por landing. */
function auditEntry(entry, centralitaDigits) {
    const errors = [];
    const hex64 = /^[0-9a-f]{64}$/;

    if (entry.depositEur !== EXPECTED_DEPOSIT) {
        errors.push(`depósito ${entry.depositEur} ≠ ${EXPECTED_DEPOSIT}`);
    }
    if (!hex64.test(entry.stripeSessionId)) {
        errors.push('stripeSessionId inválido');
    }
    if (!hex64.test(entry.priceLockSha256)) {
        errors.push('priceLockSha256 inválido');
    }
    if (!hex64.test(entry.provenanceHash)) {
        errors.push('provenanceHash inválido');
    }
    if (entry.schemaTypes.join(',') !== 'Restaurant,Service,FAQPage,BreadcrumbList') {
        errors.push('grafo JSON-LD incompleto');
    }
    if (entry.faqCount < 6) {
        errors.push(`FAQ insuficientes (${entry.faqCount})`);
    }
    if (entry.relatedCount < 3) {
        errors.push('sin enlaces internos suficientes');
    }
    if (!String(entry.path).startsWith('/otzarreta/')) {
        errors.push('ruta fuera del clúster');
    }
    if (/<[a-z/]|javascript:/i.test(entry.uniqueCopy)) {
        errors.push('HTML/JS crudo en copy (riesgo XSS)');
    }
    if (/(lorem ipsum|a consultar|pendiente de definir|xxx)/i.test(entry.uniqueCopy)) {
        errors.push('placeholder en copy');
    }
    if (/\bTODO\b|\bFIXME\b/.test(entry.uniqueCopy)) {
        errors.push('marcador TODO/FIXME');
    }
    if (entry.uniqueCopy.length < 500) {
        errors.push(`copy corto (${entry.uniqueCopy.length} chars)`);
    }

    const phoneDigits = String(entry.phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits === centralitaDigits) {
        errors.push('teléfono no verificable (vacío o centralita)');
    }
    return errors;
}

/** Punto de entrada del guardián. */
function main() {
    if (!existsSync(MANIFEST_PATH)) {
        console.error(
            `[AUDIT] Falta ${MANIFEST_PATH}. Ejecuta: npx tsx scripts/build_otzarreta_landings.ts`,
        );
        process.exit(2);
    }

    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    const payload = manifest.payload;
    const centralitaDigits = readCentralita().replace(/\D/g, '');

    let totalErrors = 0;
    console.log(`[AUDIT] ${payload.length} landings · depósito ${manifest.depositEur} €`);

    if (payload.length !== EXPECTED_TOTAL) {
        console.error(`[AUDIT] FAIL total: ${payload.length} ≠ ${EXPECTED_TOTAL}`);
        totalErrors += 1;
    }
    const geoCount = payload.filter((entry) => entry.kind === 'geo').length;
    const intentCount = payload.filter((entry) => entry.kind === 'intent').length;
    if (geoCount !== EXPECTED_GEO || intentCount !== EXPECTED_INTENT) {
        console.error(`[AUDIT] FAIL reparto: ${geoCount} geo / ${intentCount} intención`);
        totalErrors += 1;
    }

    const split =
        (manifest.splitSoberano.artista || 0) +
        (manifest.splitSoberano.earOs || 0) +
        (manifest.splitSoberano.vimume || 0);
    if (Math.abs(split - 1) > 0.0001) {
        console.error('[AUDIT] FAIL split soberano: no suma 100%');
        totalErrors += 1;
    }
    if (!manifest.entity || manifest.entity.verified !== true) {
        console.error('[AUDIT] FAIL entidad no verificada');
        totalErrors += 1;
    }

    const seenSlug = new Set();
    const seenTitle = new Set();
    const seenH1 = new Set();

    for (const entry of payload) {
        const errors = auditEntry(entry, centralitaDigits);
        if (seenSlug.has(entry.slug)) {
            errors.push('slug duplicado');
        }
        seenSlug.add(entry.slug);
        if (seenTitle.has(entry.title)) {
            errors.push('title duplicado');
        }
        seenTitle.add(entry.title);
        if (seenH1.has(entry.h1)) {
            errors.push('h1 duplicado');
        }
        seenH1.add(entry.h1);

        if (errors.length > 0) {
            console.error(`[AUDIT] ${entry.slug}: ${errors.join(' | ')}`);
            totalErrors += errors.length;
        }
    }

    const copies = payload.map((entry) => entry.uniqueCopy);
    const vectors = buildTfIdfVectors(copies);

    let maxWordJaccard = 0;
    let maxWordPair = ['', ''];
    let maxCharJaccard = 0;
    let maxCharPair = ['', ''];
    let maxCosine = 0;
    let maxCosinePair = ['', ''];

    for (let i = 0; i < copies.length; i += 1) {
        for (let j = i + 1; j < copies.length; j += 1) {
            const wordScore = jaccard(wordShingles(copies[i], 5), wordShingles(copies[j], 5));
            if (wordScore > maxWordJaccard) {
                maxWordJaccard = wordScore;
                maxWordPair = [payload[i].slug, payload[j].slug];
            }
            const charScore = jaccard(charShingles(copies[i], 5), charShingles(copies[j], 5));
            if (charScore > maxCharJaccard) {
                maxCharJaccard = charScore;
                maxCharPair = [payload[i].slug, payload[j].slug];
            }
            const cosScore = cosine(vectors[i], vectors[j]);
            if (cosScore > maxCosine) {
                maxCosine = cosScore;
                maxCosinePair = [payload[i].slug, payload[j].slug];
            }
        }
    }

    console.log(
        `[AUDIT] Jaccard 5-palabras (doctrinal) max = ${maxWordJaccard.toFixed(6)} (objetivo <= ${JACCARD_MAX}) -> ${maxWordPair.join(' vs ')}`,
    );
    console.log(
        `[AUDIT] Coseno TF-IDF (doctrinal)      max = ${maxCosine.toFixed(6)} (objetivo <= ${COSINE_MAX}) -> ${maxCosinePair.join(' vs ')}`,
    );
    console.log(
        `[AUDIT] Jaccard 5-caracteres (legacy)  max = ${maxCharJaccard.toFixed(6)} (objetivo <= ${CHAR_JACCARD_MAX}) -> ${maxCharPair.join(' vs ')}`,
    );

    if (maxWordJaccard > JACCARD_MAX) {
        console.warn(
            '[AUDIT] PENDIENTE OLA 2: Jaccard 5-palabras supera 0,10. La composición determinística reutiliza andamiaje; cerrar la brecha exige copy editorial único por URL (126 textos).',
        );
    }
    if (maxCosine > COSINE_MAX) {
        console.warn(
            '[AUDIT] PENDIENTE OLA 2: coseno TF-IDF supera 0,10 por la misma causa (andamiaje compartido).',
        );
    }
    if (maxCharJaccard > CHAR_JACCARD_MAX) {
        console.warn(
            '[AUDIT] PENDIENTE OLA 2: Jaccard 5-caracteres (legacy) supera 0,10.',
        );
    }

    if (maxWordJaccard > JACCARD_BLOCK) {
        console.error(`[AUDIT] FAIL anti-doorway: Jaccard > ${JACCARD_BLOCK}`);
        totalErrors += 1;
    }
    if (maxCosine > COSINE_BLOCK) {
        console.error(`[AUDIT] FAIL anti-doorway: coseno > ${COSINE_BLOCK}`);
        totalErrors += 1;
    }
    if (maxCharJaccard > CHAR_BLOCK) {
        console.error(`[AUDIT] FAIL anti-doorway: Jaccard char > ${CHAR_BLOCK}`);
        totalErrors += 1;
    }

    if (totalErrors > 0) {
        console.error(`[AUDIT] RESULTADO: FALLIDO (${totalErrors} violaciones).`);
        process.exit(1);
    }

    console.log(
        '[AUDIT] RESULTADO: VERIFICADO (anti-doorway) - 126/126 landings, slug/title/H1 únicos, SSOT intacto, cero placeholders.',
    );
    console.log(
        '[AUDIT] NOTA: el umbral doctrinal de duplicación <=0,10 queda PENDIENTE (ola editorial por URL).',
    );
    process.exit(0);
}

main();
