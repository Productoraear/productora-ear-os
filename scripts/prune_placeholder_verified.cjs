'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// W37_T02 — PODA QUIRÚRGICA DE PLACEHOLDERS (DOCTRINA DEL DATO VERIFICADO)
// Regla SSOT: verified:true  <=>  existe al menos un teléfono REAL verificable.
// Centralita (+34 693 693 048), vacío, repetido o inválido => verified:false.
// PROHIBIDO re-hardcodear verified:true: el flag se recalcula SIEMPRE.
//
// Motor de escritura: autómata JSON incremental (streaming elemento a elemento).
// Motivo: los data lakes pesan 390 MB; JSON.parse + JSON.stringify globales
// revientan el heap y el límite V8 de ~512 MB por cadena. Aquí el pico de
// memoria es UN registro, no el fichero.
// Garantías: salida a .tmp -> re-escaneo de validación de conteo -> rename
// atómico. Si algo falla, el lake original queda intacto. Idempotente.
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const PLACEHOLDER_CANON = '+34693693048';
const CHUNK_BYTES = 1 << 20;
const FLUSH_CHARS = 1 << 20;

const PHONE_KEY_RE = /^(phone|telephone|telefono|telefonos|tel|movil|whatsapp|mobile)$/;
const DIACRITICS_RE = /[\u0300-\u036f]/g;

function isPhoneKey(key) {
    const plain = String(key).normalize('NFD').replace(DIACRITICS_RE, '').toLowerCase();
    return PHONE_KEY_RE.test(plain);
}

function normalizePhone(raw) {
    if (raw === null || raw === undefined) return null;
    const text = String(raw).trim();
    if (!text) return null;
    let cleaned = text.replace(/[^0-9+]/g, '');
    if (!cleaned) return null;
    if (cleaned.startsWith('00')) {
        cleaned = `+${cleaned.slice(2)}`;
    }
    if (cleaned.startsWith('+')) {
        const digits = cleaned.slice(1);
        if (!/^\d{9,15}$/.test(digits)) return null;
        if (digits.length === 11 && digits.startsWith('34')) return `+34${digits.slice(2)}`;
        return `+${digits}`;
    }
    if (/^34\d{9}$/.test(cleaned)) return `+${cleaned}`;
    if (/^[6789]\d{8}$/.test(cleaned)) return `+34${cleaned}`;
    if (/^\d{9,15}$/.test(cleaned)) return `+${cleaned}`;
    return null;
}

function isVerifiablePhone(raw) {
    const normalized = normalizePhone(raw);
    if (normalized === null) return false;
    if (normalized === PLACEHOLDER_CANON) return false;
    if (/^\+34(\d)\1{8}$/.test(normalized)) return false;
    return true;
}

// Devuelve el primer teléfono verificable del registro (cualquier clave válida).
function pickVerifiablePhone(record) {
    for (const key of Object.keys(record)) {
        if (!isPhoneKey(key)) continue;
        const value = record[key];
        if (isVerifiablePhone(value)) return normalizePhone(value);
    }
    return null;
}

function pruneRecord(record) {
    if (record === null || typeof record !== 'object' || Array.isArray(record)) return false;
    const verified = pickVerifiablePhone(record) !== null;
    record.verified = verified;
    return verified;
}

function createWriter(target) {
    const fd = fs.openSync(target, 'w');
    let parts = [];
    let pending = 0;
    return {
        write(text) {
            parts.push(text);
            pending += text.length;
            if (pending >= FLUSH_CHARS) this.flush();
        },
        flush() {
            if (parts.length === 0) return;
            fs.writeSync(fd, parts.join(''));
            parts = [];
            pending = 0;
        },
        close() {
            this.flush();
            fs.closeSync(fd);
        },
        abort() {
            try {
                fs.closeSync(fd);
            } catch {
                // fd ya cerrado: no-op deliberado
            }
        },
    };
}

// Recorre la raíz array de un JSON sin cargarlo en memoria.
async function forEachTopLevelElement(filePath, onElement) {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: CHUNK_BYTES });
    let pending = '';
    let started = false;
    let closed = false;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let elementStart = -1;
    let elementParts = [];
    let count = 0;

    for await (const chunk of stream) {
        pending += chunk;
        const length = pending.length;
        let i = 0;
        while (i < length) {
            if (depth === 0) {
                const code = pending.charCodeAt(i);
                if (code === 32 || code === 9 || code === 10 || code === 13 || code === 44) {
                    i += 1;
                    continue;
                }
                if (!started) {
                    if (code !== 91) throw new Error(`Raiz JSON no es un array: ${filePath}`);
                    started = true;
                    i += 1;
                    continue;
                }
                if (code === 93) {
                    closed = true;
                    i += 1;
                    continue;
                }
                if (code === 123 || code === 91) {
                    depth = 1;
                    elementStart = i;
                    i += 1;
                    continue;
                }
                i += 1;
                continue;
            }
            const code = pending.charCodeAt(i);
            if (inString) {
                if (escaped) escaped = false;
                else if (code === 92) escaped = true;
                else if (code === 34) inString = false;
                i += 1;
                continue;
            }
            if (code === 34) {
                inString = true;
                i += 1;
                continue;
            }
            if (code === 123 || code === 91) {
                depth += 1;
                i += 1;
                continue;
            }
            if (code === 125 || code === 93) {
                depth -= 1;
                if (depth === 0) {
                    // Si el elemento arrancó en un chunk anterior, su prefijo ya
                    // escaneado vive en elementParts: NUNCA se re-escanea.
                    const tail = elementStart >= 0
                        ? pending.slice(elementStart, i + 1)
                        : pending.slice(0, i + 1);
                    const prefix = elementStart >= 0 ? '' : elementParts.join('');
                    const text = prefix + tail;
                    elementStart = -1;
                    elementParts = [];
                    i += 1;
                    count += 1;
                    await onElement(text, count);
                    continue;
                }
                i += 1;
                continue;
            }
            i += 1;
        }
        // Compactación SIN rebobinar el cursor: se conserva el prefijo del
        // elemento en curso y se descarta lo ya consumido entre elementos.
        if (depth > 0) {
            if (elementStart >= 0) {
                elementParts = [pending.slice(elementStart)];
                elementStart = -1;
            } else {
                elementParts.push(pending);
            }
        } else {
            elementStart = -1;
            elementParts = [];
        }
        pending = '';
    }

    if (!started) throw new Error(`JSON vacio o invalido: ${filePath}`);
    if (!closed) throw new Error(`Array JSON sin cerrar: ${filePath}`);
    if (depth !== 0 || inString) throw new Error(`Estructura JSON truncada: ${filePath}`);
    return count;
}

async function pruneFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP (no existe): ${filePath}`);
        return null;
    }

    const tmpPath = `${filePath}.poda.tmp`;
    const writer = createWriter(tmpPath);
    let verifiedTrue = 0;
    let verifiedFalse = 0;
    let total = 0;

    try {
        writer.write('[');
        await forEachTopLevelElement(filePath, async (text, index) => {
            let record;
            try {
                record = JSON.parse(text);
            } catch {
                // Forense: se conserva el fragmento exacto para auditoría manual.
                const dumpPath = `${filePath}.corrupt-${index}.json`;
                try {
                    fs.writeFileSync(dumpPath, text, 'utf8');
                } catch {
                    // sin volcado disponible
                }
                throw new Error(
                    `Registro JSON corrupto (index=${index}, ${text.length} chars) en ${filePath}: ` +
                    `fragmento volcado en ${dumpPath}`,
                );
            }
            if (pruneRecord(record)) verifiedTrue += 1;
            else verifiedFalse += 1;
            total += 1;
            writer.write(`${index === 1 ? '' : ','}${JSON.stringify(record)}`);
        });
        writer.write(']');
        writer.close();

        const written = await forEachTopLevelElement(tmpPath, async () => {});
        if (written !== total) {
            throw new Error(`Conteo inconsistente en ${filePath}: escrito=${written} esperado=${total}`);
        }

        fs.renameSync(tmpPath, filePath);
    } catch (error) {
        writer.abort();
        try {
            fs.unlinkSync(tmpPath);
        } catch {
            // tmp inexistente o ya renombrado
        }
        throw error;
    }

    const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
    console.log(
        `PASS ${path.basename(filePath)}: ${total} reg | verified:true=${verifiedTrue} ` +
        `verified:false=${verifiedFalse} | ${kb} KB`,
    );
    return { file: filePath, total, verifiedTrue, verifiedFalse };
}

const EDGE_DIR = path.join(__dirname, '..', 'public', 'data', 'providers');
const EDGE_FILES = [
    'finca.json', 'catering.json', 'musica.json', 'foto.json', 'decoracion.json',
    'servicios.json', 'moda.json', 'transporte.json', 'sonido.json', 'wedding.json', 'senior_care.json',
];

const LAKE_FILES = [
    'src/data/all_providers_database.json',
    'src/data/vampirized_providers.json',
];

async function main() {
    const onlyArg = process.argv.slice(2).find((arg) => arg.startsWith('--only='));
    const only = onlyArg ? path.basename(onlyArg.slice('--only='.length)) : null;

    console.log('═══════ PODA EDGE (public/data/providers — sirve a producción) ═══════');
    const results = [];
    for (const file of EDGE_FILES) {
        if (only && file !== only) continue;
        const pruned = await pruneFile(path.join(EDGE_DIR, file));
        if (pruned) results.push(pruned);
    }

    console.log('\n═══════ PODA DATA LAKES (src/data — SSOT de ingesta, gitignored) ═══════');
    for (const file of LAKE_FILES) {
        if (only && path.basename(file) !== only) continue;
        const pruned = await pruneFile(path.join(__dirname, '..', file));
        if (pruned) results.push(pruned);
    }

    const totalRecords = results.reduce((acc, r) => acc + r.total, 0);
    const totalTrue = results.reduce((acc, r) => acc + r.verifiedTrue, 0);
    const totalFalse = results.reduce((acc, r) => acc + r.verifiedFalse, 0);

    console.log('\n═══════ RESUMEN GLOBAL DE LA PODA ═══════');
    console.log(`Ficheros podados: ${results.length}`);
    console.log(`Registros procesados: ${totalRecords}`);
    console.log(`verified:true  (teléfono real verifiable): ${totalTrue}`);
    console.log(`verified:false (centralita/vacío/repetido): ${totalFalse}`);
    console.log(JSON.stringify({
        files: results.length,
        records: totalRecords,
        verifiedTrue: totalTrue,
        verifiedFalse: totalFalse,
    }));
}

main().catch((error) => {
    console.error('PODA ABORTADA — el fichero original permanece intacto.');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
