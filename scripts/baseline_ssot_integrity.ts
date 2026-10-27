/**
 * 🔐 BASELINING SANCIONADO DEL SSOT FINANCIERO (EAR OS · ZONA CERO)
 * ---------------------------------------------------------------------------
 * El hash `KNOWN_GOOD_SSOT_HASH` de `ssotIntegrityGuard.ts` JAMÁS se edita a
 * mano. Este script es el único procedimiento autorizado de re-sellado:
 *
 *   1. Verifica los invariantes de negocio (split 80/10/10, depósito 100 €,
 *      techo B2G, rider acústico, logística sancionada).
 *   2. Calcula el SHA-256 canónico del bloque SSOT.
 *   3. Con `--seal` sustituye el hash de referencia SOLO si los invariantes
 *      están intactos (si hay una violación, aborta con Exit Code 1).
 *
 * Uso:
 *   npx --no-install tsx scripts/baseline_ssot_integrity.ts          (audita)
 *   npx --no-install tsx scripts/baseline_ssot_integrity.ts --seal   (sella)
 * ---------------------------------------------------------------------------
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    KNOWN_GOOD_SSOT_HASH,
    computeSsotHash,
    validateSsotInvariants,
} from '../src/lib/security/ssotIntegrityGuard';

const HASH_PATTERN: RegExp = /export const KNOWN_GOOD_SSOT_HASH = '[a-f0-9]{64}';/;
const scriptDir: string = path.dirname(fileURLToPath(import.meta.url));
const guardPath: string = path.resolve(scriptDir, '../src/lib/security/ssotIntegrityGuard.ts');

const wantsSeal: boolean = process.argv.includes('--seal');
const computedHash: string = computeSsotHash();
const violations: readonly string[] = validateSsotInvariants();
const referenceHash: string = KNOWN_GOOD_SSOT_HASH;

console.log('── SSOT INTEGRITY BASELINE ─────────────────────────────────────');
console.log(`hash calculado   : ${computedHash}`);
console.log(`hash referencia  : ${referenceHash}`);
console.log(`coincide         : ${computedHash === referenceHash ? 'SÍ' : 'NO'}`);
console.log(`invariantes      : ${violations.length === 0 ? 'OK' : `VIOLADOS (${violations.length})`}`);
for (const violation of violations) console.log(`   ✘ ${violation}`);

if (violations.length > 0) {
    console.error('\nBASELINE ABORTADO: corrige los invariantes antes de sellar.');
    process.exit(1);
}

if (!wantsSeal) {
    console.log('\nModo auditoría. Para re-sellar (sanción del CEO): --seal');
    process.exit(computedHash === referenceHash ? 0 : 1);
}

const source: string = readFileSync(guardPath, 'utf8');
const nextSource: string = source.replace(
    HASH_PATTERN,
    `export const KNOWN_GOOD_SSOT_HASH = '${computedHash}';`,
);

if (nextSource === source) {
    console.log('\nEl hash ya estaba sellado. Nada que escribir.');
    process.exit(0);
}

writeFileSync(guardPath, nextSource, 'utf8');

const sealed: string = readFileSync(guardPath, 'utf8');
if (!sealed.includes(`KNOWN_GOOD_SSOT_HASH = '${computedHash}'`)) {
    console.error('\nFALLO DE SELLADO: el hash no quedó escrito en el guardián.');
    process.exit(1);
}

console.log(`\n✔ SSOT SELLADO: ${computedHash}`);
console.log('Registra la sanción en el commit antes del push a origin (Coolify).');
process.exit(0);
