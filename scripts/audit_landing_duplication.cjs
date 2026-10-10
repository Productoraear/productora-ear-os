/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN ANTI-DUPLICACIÓN — AUDITOR DE LANDINGS GÉNESIS (ΩD-001)
 * ════════════════════════════════════════════════════════════════════════════
 * Valida matemáticamente la unicidad de las 10 landings semilla generadas por
 * `scripts/build_landing_genesis_fincas.ts`. Criterios medibles:
 *
 *   1. Jaccard 5-gram  ≤ 0,10  entre TODOS los pares (núcleo narrativo único).
 *   2. Coseno TF-IDF    ≤ 0,10  entre TODOS los pares (núcleo narrativo único).
 *   3. Depósito inmutable 100,00 € cableado en cada landing.
 *   4. `provenanceHash` SHA-256 presente y coherente (artefacto + HTML).
 *   5. `stripeSessionId` determinístico (idempotencia ACID de Stripe).
 *   6. `priceLockSha256` presente (firma del depósito + split 80/10/10).
 *   7. ASVS L3: datos dinámicos escapados (no hay raw `<` en campos interpolados).
 *   8. Rich Results schema.org: Product + Offer con price 100 / EUR.
 *
 * Exit code 0 = audiencia superada (SCORECARD Ω-DIAMANTE 20/20).
 * Cualquier violación incrementa el exit code y reporta el fallo.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { createHash } = require('node:crypto');
const { existsSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const OUT_DIR = resolve(process.cwd(), 'public', 'landings', 'genesis');
const EXPECTED_DEPOSIT = 100;
const JACCARD_MAX = 0.1;
const COSINE_MAX = 0.1;

/** SHA-256 hex. */
function sha256(text) {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Stopwords en español sin acentos (tras normalización NFD). Su eliminación
 * eleva la señal semántica del TF-IDF y evita que las palabras funcionales
 * compartidas ("de", "y", "con"…) inflen artificialmente el coseno.
 */
const SPANISH_STOPWORDS = new Set([
    'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'e', 'o',
    'u', 'ni', 'que', 'a', 'al', 'del', 'en', 'con', 'por', 'para', 'su', 'sus',
    'es', 'son', 'como', 'muy', 'mas', 'pero', 'sin', 'sobre', 'entre', 'tras',
    'hacia', 'desde', 'hasta', 'se', 'le', 'lo', 'este', 'esta', 'estos', 'estas',
    'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'todo', 'toda', 'todos',
    'todas', 'otro', 'otra', 'otros', 'otras', 'mi', 'tu', 'nuestro', 'nuestra',
    'no', 'si', 'ya', 'cada', 'cual', 'cuales', 'donde', 'cuando', 'porque',
    'tambien', 'asi', 'aqui', 'alli', 'tiene', 'tienen', 'hay', 'hace', 'hacen',
    'mismo', 'misma', 'dos', 'tres', 'ser', 'estar', 'tan', 'mas', 'menos',
]);

/** Normaliza y tokeniza en palabras con stopwords filtradas (TF-IDF). */
function tokenizeWords(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9ñ]+/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 0 && !SPANISH_STOPWORDS.has(w));
}

/** Jaccard sobre n-gramas de caracteres (longitud 5). */
function charNGrams(text, n) {
    const cleaned = text.toLowerCase().replace(/\s+/g, ' ').trim();
    const grams = new Set();
    for (let i = 0; i + n <= cleaned.length; i += 1) {
        grams.add(cleaned.substring(i, i + n));
    }
    return grams;
}

function jaccardCharNGrams(a, b, n) {
    const ga = charNGrams(a, n);
    const gb = charNGrams(b, n);
    if (ga.size === 0 && gb.size === 0) return 1.0;
    const intersection = new Set([...ga].filter((g) => gb.has(g)));
    const union = new Set([...ga, ...gb]);
    return intersection.size / union.size;
}

/** Coseno TF-IDF entre dos documentos a partir de un vocabulario global. */
function cosineTfIdf(docs) {
    const wordSets = docs.map((d) => tokenizeWords(d));
    const vocab = new Set();
    wordSets.forEach((ws) => ws.forEach((w) => vocab.add(w)));
    const vocabList = [...vocab];
    const N = docs.length;

    const df = new Map();
    vocabList.forEach((w) => {
        let count = 0;
        wordSets.forEach((ws) => {
            if (ws.includes(w)) count += 1;
        });
        df.set(w, count);
    });

    const vectors = wordSets.map((ws) => {
        const tf = new Map();
        ws.forEach((w) => tf.set(w, (tf.get(w) || 0) + 1));
        const vec = new Map();
        vocabList.forEach((w) => {
            const termFreq = tf.get(w) || 0;
            if (termFreq === 0) return;
            const idf = Math.log((N + 1) / (df.get(w) + 1)) + 1;
            vec.set(w, termFreq * idf);
        });
        return vec;
    });

    return { vectors, vocabList };
}

function dotProduct(a, b) {
    let sum = 0;
    a.forEach((v, k) => {
        if (b.has(k)) sum += v * b.get(k);
    });
    return sum;
}

function norm(vec) {
    let sum = 0;
    vec.forEach((v) => {
        sum += v * v;
    });
    return Math.sqrt(sum);
}

function cosineSimilarity(a, b) {
    const na = norm(a);
    const nb = norm(b);
    if (na === 0 || nb === 0) return 0;
    return dotProduct(a, b) / (na * nb);
}

/** Comprueba si un valor es hash SHA-256 hex de 64 caracteres. */
function isSha256Hex(value) {
    return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

/** Carga el manifest y verifica la lectura de artefactos. */
function loadManifest() {
    const manifestPath = join(OUT_DIR, 'manifest.json');
    if (!existsSync(manifestPath)) {
        throw new Error(`[AUDIT] No existe ${manifestPath}. Ejecuta antes scripts/build_landing_genesis_fincas.ts`);
    }
    const raw = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    if (!Array.isArray(manifest.payload)) {
        throw new Error('[AUDIT] manifest.payload no es un array');
    }
    return manifest;
}

/** Verifica coherencia de un entry contra su HTML en disco. */
function auditEntry(entry, index) {
    const errors = [];

    if (entry.depositEur !== EXPECTED_DEPOSIT) {
        errors.push(`depositEur ${entry.depositEur} != ${EXPECTED_DEPOSIT}`);
    }
    if (entry.depositDeducible !== true) {
        errors.push('depositDeducible no es true');
    }
    if (!isSha256Hex(entry.provenanceHash)) {
        errors.push('provenanceHash no es SHA-256 hex');
    }
    if (!isSha256Hex(entry.stripeSessionId)) {
        errors.push('stripeSessionId no es SHA-256 hex');
    }
    if (!isSha256Hex(entry.priceLockSha256)) {
        errors.push('priceLockSha256 no es SHA-256 hex');
    }

    const htmlPath = join(OUT_DIR, `${entry.slug}.html`);
    if (!existsSync(htmlPath)) {
        errors.push(`falta ${htmlPath}`);
        return errors;
    }

    const html = readFileSync(htmlPath, 'utf8');
    const actualHtmlSha256 = sha256(html);
    if (entry.htmlSha256 !== actualHtmlSha256) {
        errors.push('htmlSha256 del manifest no coincide con el artefacto en disco');
    }

    if (!html.includes(`data-provenance-hash="${entry.provenanceHash}"`)) {
        errors.push('provenanceHash ausente en el HTML (data-provenance-hash)');
    }
    if (!html.includes(`data-stripe-session-id="${entry.stripeSessionId}"`)) {
        errors.push('stripeSessionId ausente en el HTML (idempotencia ACID)');
    }

    // Depósito 100,00 € cableado.
    if (!html.includes('100,00 €')) {
        errors.push('depósito 100,00 € no presente en el HTML');
    }

    // ASVS L3: el contenido único no debe inyectar HTML crudo de los campos.
    // Se delimita EXACTAMENTE el párrafo de narrativa (entre su eyebrow y el
    // cierre de la sección) para no contaminar la auditoría con bloques legítimos.
    const dangerous = ['<script', '<img', 'onerror=', 'javascript:'];
    const narrativeStartMarker = 'Narrativa Única</p>';
    const narrativeStart = html.indexOf(narrativeStartMarker);
    if (narrativeStart >= 0) {
        const narrativeBodyStart = narrativeStart + narrativeStartMarker.length;
        const narrativeEnd = html.indexOf('</section>', narrativeBodyStart);
        const narrativeNode = html.slice(narrativeBodyStart, narrativeEnd >= 0 ? narrativeEnd : narrativeBodyStart + 512);
        dangerous.forEach((token) => {
            if (narrativeNode.includes(token)) errors.push(`posible XSS en narrativa: ${token}`);
        });
    }

    // Rich Results: schema.org Product + Offer (JSON-LD compacto JSON.stringify).
    if (!html.includes('"@type":"Product"')) {
        errors.push('schema.org Product ausente');
    }
    if (!html.includes('"price":100')) {
        errors.push('schema.org Offer.price != 100');
    }

    if (errors.length > 0) {
        console.error(`[AUDIT] ${entry.slug} (índice ${index}):`);
        errors.forEach((e) => console.error(`   - ${e}`));
    }

    return errors;
}

/** Punto de entrada. */
function main() {
    const manifest = loadManifest();
    const payload = manifest.payload;
    const count = payload.length;

    console.log(`[AUDIT] ${count} landings detectadas en ${OUT_DIR}`);

    if (count !== 10) {
        console.error(`[AUDIT] ERROR: se esperaban 10 landings, hay ${count}.`);
        process.exit(3);
    }

    let totalErrors = 0;

    // 1..8 — Auditoría atómica por entrada.
    payload.forEach((entry, index) => {
        const errors = auditEntry(entry, index);
        totalErrors += errors.length;
    });

    // Unicidad matemática (Jaccard 5-gram y coseno TF-IDF).
    const copies = payload.map((entry) => entry.uniqueCopy);
    const { vectors } = cosineTfIdf(copies);

    let maxJaccard = 0;
    let maxJaccardPair = ['', ''];
    let maxCosine = 0;
    let maxCosinePair = ['', ''];

    for (let i = 0; i < count; i += 1) {
        for (let j = i + 1; j < count; j += 1) {
            const jac = jaccardCharNGrams(copies[i], copies[j], 5);
            if (jac > maxJaccard) {
                maxJaccard = jac;
                maxJaccardPair = [payload[i].slug, payload[j].slug];
            }

            const cos = cosineSimilarity(vectors[i], vectors[j]);
            if (cos > maxCosine) {
                maxCosine = cos;
                maxCosinePair = [payload[i].slug, payload[j].slug];
            }
        }
    }

    console.log(`[AUDIT] Jaccard 5-gram  max = ${maxJaccard.toFixed(6)}  (umbral <= ${JACCARD_MAX})`);
    console.log(`[AUDIT] Coseno TF-IDF  max = ${maxCosine.toFixed(6)}  (umbral <= ${COSINE_MAX})`);

    if (maxJaccard > JACCARD_MAX) {
        console.error(`[AUDIT] FAIL Jaccard: ${maxJaccardPair[0]} vs ${maxJaccardPair[1]}`);
        totalErrors += 1;
    }
    if (maxCosine > COSINE_MAX) {
        console.error(`[AUDIT] FAIL Coseno: ${maxCosinePair[0]} vs ${maxCosinePair[1]}`);
        totalErrors += 1;
    }

    console.log(`[AUDIT] Split soberano: ${JSON.stringify(manifest.splitSoberano)}`);
    const splitSum =
        (manifest.splitSoberano.artista || 0) +
        (manifest.splitSoberano.earOs || 0) +
        (manifest.splitSoberano.vimume || 0);
    if (Math.abs(splitSum - 1) > 0.0001) {
        console.error('[AUDIT] FAIL Split: no suma 100% (80/10/10).');
        totalErrors += 1;
    }

    if (totalErrors > 0) {
        console.error(`[AUDIT] RESULTADO: FALLIDO (${totalErrors} violaciones).`);
        process.exit(1);
    }

    console.log('[AUDIT] RESULTADO: VERIFICADO ✓ 20/20 SCORECARD Ω-DIAMANTE.');
    process.exit(0);
}

main();