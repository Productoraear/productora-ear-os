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

const { readFileSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const strict = process.argv.includes('--strict');
const asJson = process.argv.includes('--json');

const SSOT_PATH = path.join(projectRoot, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const EXEMPT_DIRS = new Set(['node_modules', '.git', '.next', 'public', 'dist', 'coverage', '.antigravity']);
const EXEMPT_FILES = new Set(['audit_tariff_copy_drift.cjs']);
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.md', '.mdx']);
const EXTRA_FILES = ['.clinerules', '.cursorrules', 'AGENTS.md'];

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
 * @returns {string[]}
 */
function walk(dir, acc) {
    for (const entry of readdirSync(dir)) {
        if (EXEMPT_DIRS.has(entry) || EXEMPT_FILES.has(entry)) continue;
        const full = path.join(dir, entry);
        const stats = statSync(full);
        if (stats.isDirectory()) {
            walk(full, acc);
        } else if (SCAN_EXTENSIONS.has(path.extname(entry)) && stats.size < 512 * 1024) {
            acc.push(full);
        }
    }
    return acc;
}

const canonicalRate = readCanonicalRate();
const canonicalLabel = canonicalRate.toFixed(2).replace('.', ',');

const files = walk(path.join(projectRoot, 'src'), []);
for (const extra of EXTRA_FILES) {
    const full = path.join(projectRoot, extra);
    try {
        if (statSync(full).isFile()) files.push(full);
    } catch {
        /* archivo inexistente: se ignora */
    }
}
const scriptsDir = path.join(projectRoot, 'scripts');
files.push(...walk(scriptsDir, []));

/** @type {{ file: string, line: number, rate: number, text: string }[]} */
const findings = [];

for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (line.includes('legacy')) continue; // reglas de detección del propio auditor
        for (const pattern of RATE_PATTERNS) {
            pattern.regex.lastIndex = 0;
            if (!pattern.regex.test(line)) continue;
            findings.push({
                file: path.relative(projectRoot, file).replace(/\\/g, '/'),
                line: index + 1,
                rate: pattern.rate,
                text: line.trim().slice(0, 160),
            });
        }
    }
}

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
