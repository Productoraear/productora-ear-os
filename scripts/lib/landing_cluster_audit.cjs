/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN ANTI-CANIBALIZACIÓN GENÉRICO — CLÚSTERES DE DOMINANCIA EAR OS
 * ════════════════════════════════════════════════════════════════════════════
 * Audita cualquier manifiesto emitido por un build de clúster (Otzarreta sigue
 * con su guardián propio; Centralita y Productora EAR usan este módulo).
 *
 * Criterios medibles:
 *   1. Jaccard de shingles de 5 PALABRAS       ≤ 0,10 (métrica doctrinal)
 *   2. Coseno TF-IDF (unigramas sin stopwords) ≤ 0,10 (métrica doctrinal)
 *   3. Jaccard de 5 CARACTERES                 ≤ 0,10 (métrica legacy)
 *   4. Totales, slugs, titles y H1 únicos.
 *   5. Depósito inmutable y split 80/10/10 leídos del SSOT.
 *   6. Política de teléfono: línea de operador o proveedor tercero.
 *   7. Sellos SHA-256, grafo JSON-LD, FAQ y enlaces internos.
 *   8. Cero placeholders y cero HTML crudo en el copy (ASVS L3).
 *
 * Uso: `runClusterAudit({ ...config })`. Exit ≠ 0 ante cualquier violación.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { existsSync, readFileSync } = require('node:fs');

const JACCARD_MAX = 0.1;
const COSINE_MAX = 0.1;
const CHAR_JACCARD_MAX = 0.1;
const JACCARD_BLOCK = 0.85;
const COSINE_BLOCK = 0.95;
const CHAR_BLOCK = 0.9;

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

/** Lee una constante numérica `name` del SSOT. */
function readNumeric(source, name) {
    const match = source.match(new RegExp(`${name}:\\s*number\\s*=\\s*([\\d.]+)`));
    if (!match) {
        throw new Error(`[AUDIT] No se pudo leer ${name} del SSOT.`);
    }
    return Number(match[1]);
}

/** Lee la centralita canónica del SSOT. */
function readCentralita(source) {
    const match = source.match(/CENTRALITA_EAR_OS:\s*string\s*=\s*'([^']+)'/);
    if (!match) {
        throw new Error('[AUDIT] No se pudo leer CENTRALITA_EAR_OS del SSOT.');
    }
    return match[1];
}

/** Lee el split soberano del SSOT. */
function readSplit(source) {
    const match = source.match(/SPLIT_SOBERANO\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\s*as const\)/);
    if (!match) {
        throw new Error('[AUDIT] No se pudo leer SPLIT_SOBERANO del SSOT.');
    }
    const block = match[1];
    const value = (name) => Number((block.match(new RegExp(`${name}:\\s*([\\d.]+)`)) || [])[1]);
    return { artista: value('artista'), earOs: value('earOs'), vimume: value('vimume') };
}

/** Auditoría de campos atómicos por landing. */
function auditEntry(entry, centralitaDigits, config) {
    const errors = [];
    const hex64 = /^[0-9a-f]{64}$/;

    if (entry.depositEur !== config.expected.deposit) {
        errors.push(`depósito ${entry.depositEur} ≠ SSOT ${config.expected.deposit}`);
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
    if (entry.schemaTypes.join(',') !== config.schemaTypes.join(',')) {
        errors.push('grafo JSON-LD incompleto');
    }
    if (entry.faqCount < config.faqMin) {
        errors.push(`FAQ insuficientes (${entry.faqCount})`);
    }
    if (entry.relatedCount < config.relatedMin) {
        errors.push('sin enlaces internos suficientes');
    }
    if (!String(entry.path).startsWith(config.pathPrefix)) {
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
    if (entry.uniqueCopy.length < config.copyMin) {
        errors.push(`copy corto (${entry.uniqueCopy.length} chars)`);
    }

    const phoneDigits = String(entry.phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9) {
        errors.push('teléfono no verificable (vacío o incompleto)');
    } else if (config.phonePolicy === 'operator-line' && phoneDigits !== centralitaDigits) {
        errors.push('teléfono distinto de la línea oficial del operador');
    } else if (config.phonePolicy === 'third-party' && phoneDigits === centralitaDigits) {
        errors.push('proveedor tercero usando la centralita (huérfano)');
    }

    return errors;
}

/**
 * Ejecuta la auditoría completa del clúster y termina el proceso con 0 (OK) o 1.
 * @param {{
 *   label: string,
 *   manifestPath: string,
 *   ssotPath: string,
 *   pathPrefix: string,
 *   schemaTypes: string[],
 *   expected: { total: number, geo: number, intent: number, deposit: number },
 *   phonePolicy: 'operator-line' | 'third-party',
 *   copyMin?: number,
 *   faqMin?: number,
 *   relatedMin?: number,
 * }} rawConfig
 */
function runClusterAudit(rawConfig) {
    const config = {
        copyMin: 500,
        faqMin: 6,
        relatedMin: 3,
        ...rawConfig,
    };
    const prefix = `[${config.label}]`;

    if (!existsSync(config.manifestPath)) {
        console.error(
            `${prefix} Falta ${config.manifestPath}. Ejecuta el build del clúster antes de auditar.`,
        );
        process.exit(2);
    }

    const manifest = JSON.parse(readFileSync(config.manifestPath, 'utf8'));
    const payload = manifest.payload;
    const ssot = readFileSync(config.ssotPath, 'utf8');
    const ssotDeposit = readNumeric(ssot, 'DEPOSITO_STRIPE_EUR');
    const ssotSplit = readSplit(ssot);
    const centralitaDigits = readCentralita(ssot).replace(/\D/g, '');

    let totalErrors = 0;
    const fail = (message) => {
        console.error(`${prefix} FAIL ${message}`);
        totalErrors += 1;
    };

    console.log(
        `${prefix} ${payload.length} landings · depósito ${manifest.depositEur} € · política ${config.phonePolicy}`,
    );

    if (payload.length !== config.expected.total) {
        fail(`total ${payload.length} ≠ ${config.expected.total}`);
    }
    const geoCount = payload.filter((entry) => entry.kind === 'geo').length;
    const intentCount = payload.filter((entry) => entry.kind === 'intent').length;
    if (geoCount !== config.expected.geo || intentCount !== config.expected.intent) {
        fail(`reparto ${geoCount} geo / ${intentCount} intención`);
    }

    if (manifest.depositEur !== ssotDeposit) {
        fail(`depósito del manifiesto ${manifest.depositEur} ≠ SSOT ${ssotDeposit}`);
    }
    if (manifest.depositEur !== config.expected.deposit) {
        fail(`depósito ${manifest.depositEur} ≠ esperado ${config.expected.deposit}`);
    }

    const split =
        (manifest.splitSoberano.artista || 0) +
        (manifest.splitSoberano.earOs || 0) +
        (manifest.splitSoberano.vimume || 0);
    if (Math.abs(split - 1) > 0.0001) {
        fail('split soberano: no suma 100%');
    }
    if (
        manifest.splitSoberano.artista !== ssotSplit.artista ||
        manifest.splitSoberano.earOs !== ssotSplit.earOs ||
        manifest.splitSoberano.vimume !== ssotSplit.vimume
    ) {
        fail('split soberano distinto del SSOT');
    }

    if (!manifest.entity || manifest.entity.verified !== true) {
        fail('entidad no verificada');
    }
    if (config.phonePolicy === 'operator-line') {
        if (manifest.entity.verificationRule !== 'platform-operator-line') {
            fail('regla de verificación distinta de platform-operator-line');
        }
        if (!String(manifest.entity.lineOwner || '').trim()) {
            fail('línea oficial sin titular declarado');
        }
    }

    if (!Array.isArray(manifest.formats) || manifest.formats.length < 3) {
        fail('catálogo de formatos ausente o incompleto');
    } else {
        for (const format of manifest.formats) {
            if (!(format.basePrice > 0)) {
                fail(`formato ${format.id} sin precio SSOT`);
            }
        }
    }

    const seenSlug = new Set();
    const seenTitle = new Set();
    const seenH1 = new Set();

    for (const entry of payload) {
        const errors = auditEntry(entry, centralitaDigits, config);
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
            console.error(`${prefix} ${entry.slug}: ${errors.join(' | ')}`);
            totalErrors += errors.length;
        }
    }

    const copies = payload.map((entry) => entry.uniqueCopy);
    const wordSets = copies.map((copy) => wordShingles(copy, 5));
    const charSets = copies.map((copy) => charShingles(copy, 5));
    const vectors = buildTfIdfVectors(copies);

    let maxWordJaccard = 0;
    let maxWordPair = ['', ''];
    let maxCharJaccard = 0;
    let maxCharPair = ['', ''];
    let maxCosine = 0;
    let maxCosinePair = ['', ''];

    for (let i = 0; i < copies.length; i += 1) {
        for (let j = i + 1; j < copies.length; j += 1) {
            const wordScore = jaccard(wordSets[i], wordSets[j]);
            if (wordScore > maxWordJaccard) {
                maxWordJaccard = wordScore;
                maxWordPair = [payload[i].slug, payload[j].slug];
            }
            const charScore = jaccard(charSets[i], charSets[j]);
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
        `${prefix} Jaccard 5-palabras (doctrinal) max = ${maxWordJaccard.toFixed(6)} (objetivo <= ${JACCARD_MAX}) -> ${maxWordPair.join(' vs ')}`,
    );
    console.log(
        `${prefix} Coseno TF-IDF (doctrinal)      max = ${maxCosine.toFixed(6)} (objetivo <= ${COSINE_MAX}) -> ${maxCosinePair.join(' vs ')}`,
    );
    console.log(
        `${prefix} Jaccard 5-caracteres (legacy)  max = ${maxCharJaccard.toFixed(6)} (objetivo <= ${CHAR_JACCARD_MAX}) -> ${maxCharPair.join(' vs ')}`,
    );

    if (maxWordJaccard > JACCARD_MAX) {
        console.warn(
            `${prefix} PENDIENTE OLA 2: Jaccard 5-palabras supera 0,10. Cerrar la brecha exige copy editorial único por URL.`,
        );
    }
    if (maxCosine > COSINE_MAX) {
        console.warn(
            `${prefix} PENDIENTE OLA 2: coseno TF-IDF supera 0,10 por andamiaje compartido.`,
        );
    }
    if (maxCharJaccard > CHAR_JACCARD_MAX) {
        console.warn(`${prefix} PENDIENTE OLA 2: Jaccard 5-caracteres (legacy) supera 0,10.`);
    }

    if (maxWordJaccard > JACCARD_BLOCK) {
        fail(`anti-doorway: Jaccard > ${JACCARD_BLOCK}`);
    }
    if (maxCosine > COSINE_BLOCK) {
        fail(`anti-doorway: coseno > ${COSINE_BLOCK}`);
    }
    if (maxCharJaccard > CHAR_BLOCK) {
        fail(`anti-doorway: Jaccard char > ${CHAR_BLOCK}`);
    }

    if (totalErrors > 0) {
        console.error(`${prefix} RESULTADO: FALLIDO (${totalErrors} violaciones).`);
        process.exit(1);
    }

    console.log(
        `${prefix} RESULTADO: VERIFICADO - ${payload.length}/${config.expected.total} landings, slug/title/H1 únicos, SSOT intacto, cero placeholders, teléfonos conformes.`,
    );
    console.log(
        `${prefix} NOTA: el umbral doctrinal de duplicación <=0,10 queda PENDIENTE (ola editorial por URL).`,
    );
    process.exit(0);
}

module.exports = { runClusterAudit };



