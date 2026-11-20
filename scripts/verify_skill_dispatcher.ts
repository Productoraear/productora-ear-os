/**
 * Arnés del Despachador de Skills: verifica los 4 cartuchos, sus guards
 * (rol, techo LCSP, esquema) y la reconciliación al céntimo.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dispatchSkill, catalogForRole, SKILL_TIMEOUT_MS } from '../src/lib/skills/dispatcher';
import { listSkillManifests, findSkill } from '../src/lib/skills/registry';
import { splitSovereignCents, formatEurosEs, eurosToCents } from '../src/lib/skills/money';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
} from '../src/lib/constants/ear-os-ssot';
import { KNOWN_GOOD_SSOT_HASH } from '../src/lib/security/ssotIntegrityGuard';

let passed = 0;
let failed = 0;
const check = (label: string, condition: boolean, detail?: string): void => {
  if (condition) {
    passed += 1;
    console.log(`  [PASS] ${label}`);
  } else {
    failed += 1;
    console.log(`  [FAIL] ${label}${detail === undefined ? '' : ` :: ${detail}`}`);
  }
};

const NOW = '2026-11-20T12:00:00.000Z';

/* ── A. REGISTRO Y MANIFIESTOS ────────────────────────────────────── */
console.log('\nA · Registro y manifiestos');
const manifests = listSkillManifests();
check('registro contiene 4 cartuchos', manifests.length === 4, String(manifests.length));
check('todos declaran coste 0 tokens', manifests.every((m) => m.externalTokenCost === 0));
check('todos declaran rol válido', manifests.every((m) => ['CEO', 'MAITRE', 'PROVEEDOR'].includes(m.role)));
check('todos declaran al menos 3 pasos', manifests.every((m) => m.steps.length >= 3));
check('catálogo CEO contiene los 4', catalogForRole('CEO').length === 4);
check('catálogo MAITRE aún vacío', catalogForRole('MAITRE').length === 0);
check('timeout del despachador = 10 s', SKILL_TIMEOUT_MS === 10_000);

/* ── B. SPLIT: reconciliación al céntimo ──────────────────────────── */
console.log('\nB · Split Soberano (reconciliación exhaustiva)');
let allReconciled = true;
let roundingMax = 0;
for (let gross = 0; gross <= 5000; gross += 1) {
  const s = splitSovereignCents(gross);
  if (!s.reconciled || s.artistCents + s.earOsCents + s.vimumeCents !== gross) allReconciled = false;
  roundingMax = Math.max(roundingMax, Math.abs(s.roundingCentsApplied));
}
check('5.001 importes concilian exactamente', allReconciled);
check('el redondeo nunca supera 2 céntimos', roundingMax <= 2, String(roundingMax));
check('9000 EUR → 7200 / 900 / 900', (() => {
  const s = splitSovereignCents(900000);
  return s.artistCents === 720000 && s.earOsCents === 90000 && s.vimumeCents === 90000;
})());
check('formato español 123456c → 1.234,56 €', formatEurosEs(123456) === '1.234,56 €', formatEurosEs(123456));
check('eurosToCents sin drift flotante', eurosToCents(0.1 + 0.2) === 30);

/* ── C. CARTUCHO 1: LIQUIDACIÓN ──────────────────────────────────── */
console.log('\nC · Cartucho 1 · Liquidación Split (.xlsx)');
const liquidationPayload = {
  eventName: 'Boda Otzarreta Aizarna',
  eventDate: '2026-12-31',
  artistLabel: 'Eduardo Martínez',
  depositPaidEur: DEPOSITO_STRIPE_EUR,
  items: [
    { concept: 'Menú de temporada 120 pax', amountEur: 7200 },
    { concept: 'Maridaje y bodega', amountEur: 1200 },
    { concept: 'Servicio de sala', amountEur: 600 },
  ],
};
const liq = await dispatchSkill('ceo-liquidation-split', liquidationPayload, { role: 'CEO', now: NOW });
check('ejecuta OK', liq.ok);
if (liq.ok) {
  const art = liq.execution.artifacts[0];
  check('un artefacto .xlsx', art.kind === 'xlsx');
  check('bytes > 0', art.byteLength > 0, String(art.byteLength));
  check('SHA-256 de 64 hex', /^[a-f0-9]{64}$/.test(art.sha256));
  check('cabecera PK', art.bytes[0] === 0x50 && art.bytes[1] === 0x4b);
  check('mode REAL', liq.execution.mode === 'REAL');
  check('bruto 9.000,00 EUR', liq.execution.summary.some((s) => s.value.startsWith('9.000,00')));
  check(
    'conciliación CUADRA',
    liq.execution.summary.some((s) => s.label === 'Conciliación' && s.value.includes('CUADRA')),
  );
  check('nombre de fichero sin acentos', !/[áéíóúñ]/.test(art.filename), art.filename);
  const text = new TextDecoder('latin1').decode(art.bytes);
  check('contiene fórmula SUM', text.includes('SUM('));
  check('contiene la hoja de reparto', text.includes('80-10-10'));
}

/* ── D. CARTUCHO 2: CONTRATO LCSP ────────────────────────────────── */
console.log('\nD · Cartucho 2 · Contrato LCSP (.pdf)');
const contractBase = {
  counterparty: 'Ayuntamiento de Toledo',
  counterpartyTaxId: 'P4500000A',
  eventDate: '2026-09-15',
  venue: 'Plaza del Ayuntamiento',
  pax: 400,
  serviceSummary: 'Actuación de mariachi monumental y sonido profesional para festejos locales.',
};
const contractOk = await dispatchSkill(
  'ceo-lcsp-contract',
  { ...contractBase, mode: 'B2G', grossEur: 9000 },
  { role: 'CEO', now: NOW },
);
check('B2G de 9.000 € bajo techo → OK', contractOk.ok);
if (contractOk.ok) {
  const text = new TextDecoder('latin1').decode(contractOk.execution.artifacts[0].bytes);
  check('PDF válido', text.startsWith('%PDF-1.4'));
  check('declara Art. 118 LCSP', text.includes('Art') && text.includes('118'));
  check('declara rider acústico', text.includes('Ley 37/2003'));
  check('declara firma pendiente', text.includes('PENDIENTE'));
  check('euro codificado en WinAnsi', text.includes('\\200'));
}
const contractOver = await dispatchSkill(
  'ceo-lcsp-contract',
  { ...contractBase, mode: 'B2G', grossEur: AJUSTE_PREVENTIVO_B2G_EUR + 1 },
  { role: 'CEO', now: NOW },
);
check('B2G sobre techo → ABORTA', !contractOver.ok);
if (!contractOver.ok) {
  check('código ABORTED_BY_POLICY', contractOver.code === 'ABORTED_BY_POLICY', contractOver.code);
  check('el error cita el techo 14.250', contractOver.error.includes('14.250'));
}
const contractB2C = await dispatchSkill(
  'ceo-lcsp-contract',
  { ...contractBase, mode: 'B2C', grossEur: 50000 },
  { role: 'CEO', now: NOW },
);
check('B2C de 50.000 € sin techo LCSP → OK', contractB2C.ok);

/* ── E. CARTUCHO 3: DOSSIER ──────────────────────────────────────── */
console.log('\nE · Cartucho 3 · Dossier por proveedor (.pdf)');
const dossier = await dispatchSkill(
  'ceo-provider-dossier',
  {
    providerName: 'Asador Etxebarri',
    category: 'Asador',
    proposedGrossEur: 9000,
    monthlyFeeEur: 0,
    valueBlocks: ['Menú de temporada con producto local', 'Aforo y logística coordinados'],
    proposalDate: '2026-11-20',
  },
  { role: 'CEO', now: NOW },
);
check('ejecuta OK', dossier.ok);
if (dossier.ok) {
  check('sin aforo → "No declarado"', dossier.execution.summary.some((s) => s.value.includes('No declarado')));
  check('directorio gratuito → Split 80/10/10', dossier.execution.summary.some((s) => s.value.includes('80/10/10')));
  check('neto proveedor 7.200,00 EUR', dossier.execution.summary.some((s) => s.value.startsWith('7.200,00')));
}
const dossierPaid = await dispatchSkill(
  'ceo-provider-dossier',
  {
    providerName: 'Finca Los Olivos',
    category: 'Finca',
    capacityPax: 250,
    proposedGrossEur: 11000,
    monthlyFeeEur: 49,
    valueBlocks: ['Plan de pago con retención del 100%'],
    proposalDate: '2026-11-20',
  },
  { role: 'CEO', now: NOW },
);
check('plan de pago → 0% comisión', dossierPaid.ok && dossierPaid.execution.summary.some((s) => s.value.includes('0% comisión')));
check('aforo declarado se pinta', dossierPaid.ok && dossierPaid.execution.summary.some((s) => s.value === '250 pax'));

/* ── F. CARTUCHO 4: AUDITORÍA FORENSE ────────────────────────────── */
console.log('\nF · Cartucho 4 · Auditoría forense (.md)');
const audit = await dispatchSkill('ceo-forensic-audit', { operator: 'Edwin Agudelo' }, { role: 'CEO', now: NOW });
check('ejecuta OK', audit.ok);
if (audit.ok) {
  const md = new TextDecoder('utf-8').decode(audit.execution.artifacts[0].bytes);
  check('informe Markdown', md.startsWith('# Informe forense'));
  check('contiene el hash de referencia', md.includes(KNOWN_GOOD_SSOT_HASH));
  check('veredicto VERIFICADO', audit.execution.summary.some((s) => s.value === 'VERIFICADO'));
  check('lista los 4 cartuchos', md.includes('Total de cartuchos: **4**'));
  check('declara 0 tokens', audit.execution.summary.some((s) => s.value === '0 tokens'));
}

/* ── G. GUARDS DEL DESPACHADOR ───────────────────────────────────── */
console.log('\nG · Guards (rol, esquema, desconocido)');
const wrongRole = await dispatchSkill('ceo-liquidation-split', liquidationPayload, { role: 'MAITRE', now: NOW });
check('MAITRE no lanza cartucho CEO', !wrongRole.ok && wrongRole.code === 'ROLE_FORBIDDEN');
const unknown = await dispatchSkill('ceo-skill-inventado', {}, { role: 'CEO', now: NOW });
check('cartucho inexistente → UNKNOWN_SKILL', !unknown.ok && unknown.code === 'UNKNOWN_SKILL');
if (!unknown.ok) check('lista los 4 disponibles', (unknown.available ?? []).length === 4);
const badInput = await dispatchSkill('ceo-liquidation-split', { eventName: 'x' }, { role: 'CEO', now: NOW });
check('payload inválido → INVALID_INPUT', !badInput.ok && badInput.code === 'INVALID_INPUT');
check('reporta los issues', !badInput.ok && (badInput.issues ?? []).length >= 3);
const badDate = await dispatchSkill(
  'ceo-liquidation-split',
  { ...liquidationPayload, eventDate: '31/12/2026' },
  { role: 'CEO', now: NOW },
);
check('fecha no ISO → rechazada', !badDate.ok && badDate.code === 'INVALID_INPUT');
check('tarifa base sigue en 350 (INV-01)', TARIFA_BASE_SOLISTA_EUR === 350);
check('findSkill devuelve el cartucho', findSkill('ceo-forensic-audit') !== null);

/* ── Artefactos de inspección ─────────────────────────────────────── */
const outDir = join(process.cwd(), '.antigravity', 'skills-out');
mkdirSync(outDir, { recursive: true });
const written: string[] = [];
for (const result of [liq, contractOk, dossier, dossierPaid, audit]) {
  if (!result.ok) continue;
  for (const artifact of result.execution.artifacts) {
    writeFileSync(join(outDir, artifact.filename), artifact.bytes);
    written.push(`${artifact.filename} (${artifact.byteLength} bytes)`);
  }
}
console.log(`\nArtefactos reales escritos en ${outDir}:`);
for (const line of written) console.log(`  - ${line}`);

console.log(`\n=== ${passed} PASS · ${failed} FAIL ===`);
if (failed > 0) process.exit(1);
