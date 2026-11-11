#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DEL ARNÉS CONTRACTUAL · INGESTA DE ESCAPARATE (W43/W49)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecuta `npm run verify:showcase` y bloquea el release si alguna puerta falla.
 *
 *   PUERTA 1 · Cero duplicados en el JSON canónico resultante.
 *   PUERTA 2 · El parser es fail-closed: texto cortado, vacío o binario NO
 *              produce excepciones no controladas (siempre devuelve un seed).
 *   PUERTA 3 · `ProviderProfileSections.tsx` no emite secciones vacías ni
 *              placeholders: la proyección pública sólo pinta datos reales.
 *   PUERTA 4 · Cada clave proyectada existe en el catálogo SSOT de campos, cero
 *              PII publicada y `exposePhone === false` (I-01/INV-06/INV-12).
 *
 * Exit codes: 0 = 4/4 puertas PASS · 1 = alguna puerta FAIL · 2 = falta un
 * artefacto en disco (SIN_EVIDENCIA: no se firma un verde sin objeto que probar).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const require = createRequire(import.meta.url);

const SEED_PATH = path.join(REPO_ROOT, 'public', 'data', 'providers', 'showcase_seed_canonical.json');
const INGEST_PATH = path.join(REPO_ROOT, 'scripts', 'ingest_competitor_showcase.cjs');
const CATALOG_PATH = path.join(REPO_ROOT, 'src', 'lib', 'providers', 'provider-field-catalog.ts');
const SECTIONS_PATH = path.join(REPO_ROOT, 'src', 'components', 'providers', 'ProviderProfileSections.tsx');

interface GateResult {
  readonly id: number;
  readonly title: string;
  readonly ok: boolean;
  readonly evidence: string;
  readonly violations: readonly string[];
}

interface IngestModule {
  readonly PROJECTION_KEYS: Readonly<Record<string, (seed: unknown) => unknown>>;
  readonly buildSeed: (raw: string) => Record<string, unknown>;
  readonly cleanLines: (raw: string) => string[];
}

const gates: GateResult[] = [];
const log = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

function fail(id: number, title: string, violations: readonly string[]): void {
  gates.push({ id, title, ok: violations.length === 0, evidence: `${violations.length} violación(es)`, violations });
}

/* ─────────────────────────── Carga de artefactos ────────────────────────── */

const missing: string[] = [];
for (const [label, file] of [
  ['JSON canónico', SEED_PATH],
  ['parser', INGEST_PATH],
  ['catálogo de campos', CATALOG_PATH],
  ['proyección pública', SECTIONS_PATH],
] as const) {
  if (!existsSync(file)) missing.push(`${label}: ${path.relative(REPO_ROOT, file)}`);
}

if (missing.length > 0) {
  log('[Ω-SHOWCASE] SIN_EVIDENCIA — faltan artefactos en disco:');
  for (const item of missing) log(`   · ${item}`);
  log('   -> Ejecuta `node scripts/ingest_competitor_showcase.cjs` antes de verificar.');
  process.exit(2);
}

const seed = JSON.parse(readFileSync(SEED_PATH, 'utf8')) as Record<string, unknown>;
const ingest = require(INGEST_PATH) as IngestModule;
const sectionsSource = readFileSync(SECTIONS_PATH, 'utf8');
const catalogSource = readFileSync(CATALOG_PATH, 'utf8');

/* ─────────────────────────── PUERTA 1 · duplicados ──────────────────────── */

function findDuplicates(values: readonly string[]): string[] {
  const seen = new Map<string, number>();
  for (const value of values) seen.set(value, (seen.get(value) ?? 0) + 1);
  return [...seen.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

{
  const violations: string[] = [];
  const faq = (seed.faq as readonly { question: string; answer: string }[]) ?? [];
  const faqDuplicates = findDuplicates(faq.map((pair) => pair.question.trim().toLowerCase()));
  for (const duplicate of faqDuplicates) violations.push(`FAQ duplicada: ${duplicate}`);

  const services = (seed.identity as { servicios_ofrecidos?: readonly string[] }).servicios_ofrecidos ?? [];
  for (const duplicate of findDuplicates(services.map((item) => item.trim().toLowerCase()))) {
    violations.push(`servicio duplicado: ${duplicate}`);
  }

  const projected = (seed.providerFields as { values?: Readonly<Record<string, string>> }).values ?? {};
  for (const duplicate of findDuplicates(Object.keys(projected))) {
    violations.push(`clave de campo duplicada: ${duplicate}`);
  }

  const pii = (seed.identity as { piiDetected?: readonly { masked: string }[] }).piiDetected ?? [];
  for (const duplicate of findDuplicates(pii.map((item) => item.masked))) {
    violations.push(`PII duplicada en el registro: ${duplicate}`);
  }

  // Cero respuestas repetidas: dos preguntas con el mismo texto de respuesta
  // delatan un arrastre de bloque.
  const answers = faq.filter((pair) => pair.answer.trim().length > 40).map((pair) => pair.answer.trim());
  for (const duplicate of findDuplicates(answers)) {
    violations.push(`respuesta duplicada: ${duplicate.slice(0, 60)}…`);
  }

  fail(1, 'Cero duplicados en el JSON canónico', violations);
}

/* ──────────────────── PUERTA 2 · parser fail-closed ─────────────────────── */

{
  const violations: string[] = [];

  const cases: readonly { label: string; input: string }[] = [
    { label: 'cadena vacía', input: '' },
    { label: 'solo espacios', input: '   \n\t\n   ' },
    { label: 'texto cortado a mitad de palabra', input: 'desde el boton de mi escaparate me muestra en pantalla esto:Ir al contenido' },
    { label: 'pregunta sin respuesta', input: '¿Pregunta huérfana?\ndesde el boton campus me muestra' },
    { label: 'basura binaria', input: '\u0000\u0001\u0002\u00ff\u00fe\u0007binary\u0000junk' },
    { label: 'solo cromo de interfaz', input: 'Ir al contenido principal\nPack Start\nHazte Premium\nAtención al cliente:' },
    { label: 'marcadores sin cuerpo', input: 'desde el boton de inicio\ndesde el boton campus\n' },
    { label: 'mojibake extremo', input: 'Â¿QuÃ© incluye el pack?\nSÃ³lo texto daÃ±ado' },
    { label: 'JSON dentro del texto', input: '{"a":1,"b":[2,3]}\nnull\ntrue' },
    { label: 'longitud extrema de una línea', input: `desde el boton campus\n${'x'.repeat(50_000)}` },
    { label: 'literal null', input: 'null' },
    { label: 'literal undefined', input: 'undefined' },
  ];

  for (const testCase of cases) {
    try {
      const result = ingest.buildSeed(testCase.input) as unknown as Record<string, unknown>;
      if (result === null || typeof result !== 'object') {
        violations.push(`${testCase.label}: el parser no devolvió objeto`);
        continue;
      }
      const integrity = result.integrity as { faqTotal?: number } | undefined;
      if (integrity === undefined || typeof integrity.faqTotal !== 'number') {
        violations.push(`${testCase.label}: falta el bloque integrity`);
      }
      if (result.doctrine === undefined) {
        violations.push(`${testCase.label}: seed sin doctrina`);
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      violations.push(`${testCase.label}: EXCEPCIÓN NO CONTROLADA -> ${detail}`);
    }
  }

  // Entradas no-string: el parser debe coercionar, no reventar.
  for (const weird of [null, undefined, 0, 1, {}, []] as readonly unknown[]) {
    try {
      ingest.buildSeed(weird as unknown as string);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      violations.push(`entrada ${JSON.stringify(weird)}: EXCEPCIÓN NO CONTROLADA -> ${detail}`);
    }
  }

  fail(2, 'Parser fail-closed ante texto cortado o malformado', violations);
}

/* ──────────── PUERTA 3 · proyección pública sin placeholders ────────────── */

{
  const violations: string[] = [];
  const storeSource = readFileSync(
    path.join(REPO_ROOT, 'src', 'lib', 'providers', 'provider-profile-store.ts'),
    'utf8',
  );

  // La proyección debe cortar sin datos: cero contenedor vacío en el DOM.
  if (!/if \(sections\.length === 0\) return null;/.test(sectionsSource)) {
    violations.push('ProviderProfileSections no corta con `sections.length === 0` (renderiza un contenedor vacío)');
  }

  // Grupos FAQ/objeciones: un par sin pregunta real no puede salir.
  if (!/if \(question === undefined \|\| question\.trim\(\)\.length === 0\) continue;/.test(storeSource)) {
    violations.push('provider-profile-store no descarta pares FAQ sin pregunta');
  }

  // Una sección sólo se emite si tiene pares o campos con valor real.
  if (!/if \(pairs\.length === 0 && fields\.length === 0\) continue;/.test(storeSource)) {
    violations.push('provider-profile-store no exige pares o campos reales antes de emitir una sección');
  }

  // Cero placeholders en la proyección pública.
  const placeholderPatterns: readonly RegExp[] = [
    /lorem ipsum/i,
    /texto de ejemplo/i,
    /\bplaceholder\b/i,
    /\bTODO\b/,
    /\bFIXME\b/,
    /pendiente de rellenar/i,
  ];
  for (const pattern of placeholderPatterns) {
    if (pattern.test(sectionsSource)) violations.push(`placeholder detectado en la proyección: ${pattern}`);
  }

  // La ficha pública jamás abre el teléfono directamente (INV-06 / INV-12).
  if (/exposePhone\s*[:=]\s*true/.test(sectionsSource)) {
    violations.push('ProviderProfileSections expone `exposePhone: true`');
  }

  // El seed no puede arrastrar URLs de imagen fabricadas.
  const media = seed.media as { invented?: number; urls?: readonly string[] } | undefined;
  if (media !== undefined) {
    if ((media.invented ?? 0) !== 0) violations.push(`media.invented = ${String(media.invented)} (debe ser 0)`);
    if ((media.urls ?? []).length > 0) violations.push(`media.urls trae ${(media.urls ?? []).length} URL(s) no verificadas`);
  }

  fail(3, 'Proyección pública sin placeholders ni secciones vacías', violations);
}

/* ─────── PUERTA 4 · catálogo SSOT, cero PII y exposición bloqueada ─────── */

{
  const violations: string[] = [];

  // Cada clave proyectada debe existir literalmente en el catálogo SSOT.
  for (const key of Object.keys(ingest.PROJECTION_KEYS)) {
    if (!catalogSource.includes(`'${key}'`)) violations.push(`clave fuera del catálogo SSOT: ${key}`);
  }

  const providerFields = seed.providerFields as { values?: Readonly<Record<string, string>> } | undefined;
  const projected = providerFields?.values ?? {};
  for (const key of Object.keys(projected)) {
    const isFaq = /^faq\.\d+\.(pregunta|respuesta)$/.test(key);
    if (isFaq) {
      const index = Number.parseInt(/^faq\.(\d+)\./.exec(key)?.[1] ?? '0', 10);
      if (index < 1 || index > 6) violations.push(`FAQ fuera del rango 1..6 del catálogo: ${key}`);
      continue;
    }
    if (!catalogSource.includes(`'${key}'`)) violations.push(`campo emitido fuera del catálogo: ${key}`);
  }

  // Cero exposición de teléfono (doctrina contact-gate + depósito 100 €).
  const doctrine = seed.doctrine as { exposePhone?: boolean } | undefined;
  if (doctrine?.exposePhone !== false) violations.push('doctrine.exposePhone no es false');

  const pii = (seed.identity as { piiDetected?: readonly { expose?: boolean }[] } | undefined)?.piiDetected ?? [];
  for (const item of pii) {
    if (item.expose !== false) violations.push('un registro de PII tiene expose != false');
  }

  // Ningún valor proyectado puede contener teléfono o email literal.
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const phonePattern = /(?:\+34\s*)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/;
  for (const [key, value] of Object.entries(projected)) {
    if (emailPattern.test(value)) violations.push(`email literal en campo público ${key}`);
    if (phonePattern.test(value)) violations.push(`teléfono literal en campo público ${key}`);
  }

  // Completitud honesta: con huecos declarados no se puede firmar 100.
  const completeness = seed.completeness as { score?: number; gaps?: readonly unknown[] } | undefined;
  if (completeness !== undefined && (completeness.gaps ?? []).length > 0 && (completeness.score ?? 0) >= 100) {
    violations.push('completitud 100/100 con huecos declarados (número inflado)');
  }

  fail(4, 'Catálogo SSOT respetado, cero PII y exposePhone=false', violations);
}

/* ─────────────────────────── Veredicto final ────────────────────────────── */

log('');
log('[Ω-SHOWCASE] VERIFICADOR DEL ARNÉS CONTRACTUAL (W43/W49)');
log(`[Ω-SHOWCASE] JSON canónico: ${path.relative(REPO_ROOT, SEED_PATH).split(path.sep).join('/')}`);
log(`[Ω-SHOWCASE] Sello: ${String((seed as { selfHash?: string }).selfHash ?? 'SIN_SELLO').slice(0, 16)}…`);
log('');

const total = gates.length;
const passed = gates.filter((gate) => gate.ok).length;

for (const gate of gates) {
  log(`  ${gate.ok ? 'PASS' : 'FAIL'} · Puerta ${gate.id} — ${gate.title}`);
  log(`         ${gate.evidence}`);
  for (const violation of gate.violations) log(`         · ${violation}`);
}

log('');

if (passed === total) {
  const integrity = seed.integrity as { faqTotal?: number; providerFieldsProjected?: number } | undefined;
  const completeness = seed.completeness as { score?: number; max?: number } | undefined;
  log(`[Ω-SHOWCASE] FAQ=${String(integrity?.faqTotal ?? 0)} · campos=${String(integrity?.providerFieldsProjected ?? 0)} · completitud=${String(completeness?.score ?? 0)}/${String(completeness?.max ?? 100)}`);
  log(`[Ω-SHOWCASE] RESULTADO: ${passed}/${total} puertas VERIFICADO`);
  process.exit(0);
}

log(`[Ω-SHOWCASE] RESULTADO: ${passed}/${total} puertas — SOSPECHOSO (bloquea release)`);
process.exit(1);



