/**
 * 🧾 AUDITOR DE DERIVA TARIFARIA (COPY vs SSOT SELLADO)
 * ============================================================================
 * Detecta menciones de tarifa por kilómetro en código/documentación y las
 * compara con la tarifa canonizada en `src/lib/constants/ear-os-ssot.ts`.
 *
 * Modo por defecto: INFORMATIVO (exit 0) — sirve para dimensionar la deriva
 * sin bloquear el pipeline. Con `--strict` (exit 1) se convierte en gate duro.
 *
 * Uso:
 *   node scripts/audit_tariff_copy_drift.cjs [--strict] [--json]
 *
 * Coste: $0,00 · sin red · solo lectura de disco.
 * ============================================================================
 */

'use strict';

const { readFileSync } = require('node:fs');
const { readFile, readdir, stat } = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const strict = process.argv.includes('--strict');
const asJson = process.argv.includes('--json');

const SSOT_PATH = path.join(projectRoot, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const EXEMPT_DIRS = new Set([
    'node_modules',
    '.git',
    '.next',
    'public',
    'dist',
    'coverage',
    '.antigravity',
    '__pycache__',
    'graphify-out',
    'scratch',
    '.venv',
]);
const EXEMPT_FILES = new Set(['audit_tariff_copy_drift.cjs']);
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.md', '.mdx']);
const EXTRA_FILES = ['.clinerules', '.cursorrules', 'AGENTS.md'];
const CONCURRENCY = 64;
const MAX_FILE_BYTES = 512 * 1024;
const KM_BYTES = Buffer.from('km', 'utf8');
const EURO_BYTES = Buffer.from('€', 'utf8');

/** Tarifas por km aceptadas: cuantos más patrones, más deriva cazada. */
const RATE_PATTERNS = [
    { rate: 1.5, regex: /1[,.]50?\s*€\s*\/\s*km/g },
    { rate: 0.75, regex: /0[,.]75\s*€\s*\/\s*km/g },
    { rate: 0.5, regex: /0[,.]50\s*€\s*\/\s*km/g },
];

/**
 * Lee la tarifa canónica del SSOT por parseo textual (sin transpilador).
 * @returns {number}
 */
function readCanonicalRate() {
    const source = readFileSync(SSOT_PATH, 'utf8');
    const match = source.match(/LOGISTICA_EUR_PER_KM\s*:\s*number\s*=\s*([0-9.]+)\s*;/);
    if (!match) {
        throw new Error('No se pudo leer LOGISTICA_EUR_PER_KM del SSOT.');
    }
    return Number(match[1]);
}

/**
 * @param {string} dir
 * @param {string[]} acc
 * @returns {Promise<string[]>}
 */
async function walk(dir, acc) {
    const entries = await readdir(dir, { withFileTypes: true });
    const subdirs = [];
    for (const entry of entries) {
        if (EXEMPT_DIRS.has(entry.name) || EXEMPT_FILES.has(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            subdirs.push(walk(full, acc));
        } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
            acc.push(full);
        }
    }
    if (subdirs.length > 0) {
        await Promise.all(subdirs);
    }
    return acc;
}

/**
 * Escanea un archivo buscando menciones de tarifa por km.
 * @param {string} file
 * @returns {Promise<{ file: string, line: number, rate: number, text: string }[]>}
 */
async function scanFile(file) {
    const buf = await readFile(file);
    if (buf.length >= MAX_FILE_BYTES) {
        return [];
    }
    // Pre-filtro sin pérdida: todo patrón en RATE_PATTERNS exige '€' y 'km' en UTF-8.
    if (!buf.includes(KM_BYTES) || !buf.includes(EURO_BYTES)) {
        return [];
    }

    const content = buf.toString('utf8');

    /** @type {{ file: string, line: number, rate: number, text: string }[]} */
    const fileFindings = [];
    const relFile = path.relative(projectRoot, file).replace(/\\/g, '/');
    const lines = content.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (line.includes('legacy')) continue; // reglas de detección del propio auditor
        for (const pattern of RATE_PATTERNS) {
            pattern.regex.lastIndex = 0;
            if (!pattern.regex.test(line)) continue;
            fileFindings.push({
                file: relFile,
                line: index + 1,
                rate: pattern.rate,
                text: line.trim().slice(0, 160),
            });
        }
    }
    return fileFindings;
}

async function main() {
    const canonicalRate = readCanonicalRate();
    const canonicalLabel = canonicalRate.toFixed(2).replace('.', ',');

    const [srcFiles, scriptsFiles] = await Promise.all([
        walk(path.join(projectRoot, 'src'), []),
        walk(path.join(projectRoot, 'scripts'), []),
    ]);
    srcFiles.sort();
    scriptsFiles.sort();

    /** @type {string[]} */
    const extraResolved = [];
    for (const extra of EXTRA_FILES) {
        const full = path.join(projectRoot, extra);
        try {
            if ((await stat(full)).isFile()) extraResolved.push(full);
        } catch {
            /* archivo inexistente: se ignora */
        }
    }

    const files = [...srcFiles, ...extraResolved, ...scriptsFiles];

    /** @type {{ file: string, line: number, rate: number, text: string }[][]} */
    const results = new Array(files.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < files.length) {
            const idx = nextIndex;
            nextIndex += 1;
            results[idx] = await scanFile(files[idx]);
        }
    }

    const workerCount = Math.min(CONCURRENCY, files.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    const findings = results.flat();

    const drift = findings.filter((finding) => finding.rate !== canonicalRate);
    const aligned = findings.filter((finding) => finding.rate === canonicalRate);
    const driftByFile = new Map();
    for (const finding of drift) {
        driftByFile.set(finding.file, (driftByFile.get(finding.file) || 0) + 1);
    }

    const report = {
        canonicalRateEurPerKm: canonicalRate,
        canonicalLabel: `${canonicalLabel} €/km`,
        mentionsTotal: findings.length,
        mentionsAligned: aligned.length,
        mentionsDrifted: drift.length,
        filesWithDrift: driftByFile.size,
        driftByRate: Object.fromEntries(
            [...new Set(drift.map((finding) => finding.rate))]
                .sort((a, b) => a - b)
                .map((rate) => [String(rate), drift.filter((finding) => finding.rate === rate).length]),
        ),
        topDriftFiles: [...driftByFile.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([file, count]) => ({ file, count })),
    };

    if (asJson) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        console.log('── AUDITORÍA DE DERIVA TARIFARIA (copy vs SSOT) ──');
        console.log(`SSOT LOGISTICA_EUR_PER_KM = ${report.canonicalLabel}`);
        console.log(`Menciones totales: ${report.mentionsTotal} · alineadas: ${report.mentionsAligned} · en deriva: ${report.mentionsDrifted}`);
        console.log(`Archivos con deriva: ${report.filesWithDrift}`);
        console.log(`Deriva por tarifa: ${JSON.stringify(report.driftByRate)}`);
        if (report.topDriftFiles.length > 0) {
            console.log('Top archivos en deriva:');
            for (const entry of report.topDriftFiles) {
                console.log(`  ${entry.count.toString().padStart(2, ' ')} × ${entry.file}`);
            }
        }
        console.log(report.mentionsDrifted === 0
            ? '✅ Cero deriva: todo el copy coincide con la tarifa sellada.'
            : '⚠️  Deriva detectada: el copy comercial difiere de la tarifa sellada. Requiere sanción del CEO (SSOT o copy).');
    }

    process.exitCode = strict && report.mentionsDrifted > 0 ? 1 : 0;
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
