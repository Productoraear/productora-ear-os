/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · ESPECIFICACIÓN Y VERIFICACIÓN EN TIEMPO DE DISEÑO
 * ════════════════════════════════════════════════════════════════════════════
 * `MetaCompilerSpec` es el único contrato de entrada del motor. Se valida con
 * Zod (SEC-4) y adicionalmente se somete a un triple juicio contractual:
 *
 *   1. PRECONDICIÓN  — la especificación está bien formada y es alcanzable
 *                      (fases en orden canónico, artefacto declarado, unicidad).
 *   2. POSTCONDICIÓN — el artefacto emitido NO puede romper una invariante de
 *                      negocio aunque la especificación lo intente.
 *   3. PARIDAD SSOT  — toda constante financiera declarada coincide al céntimo
 *                      con `ear-os-ssot.ts` (Zona Cero). Cero duplicación.
 *
 * Una especificación que falla cualquiera de los tres juicios no llega a
 * `TYPE_CHECK`: la FSM aborta en `HASH_VERIF` con `INVARIANT_VIOLATION`.
 * Isomorfo: sin `node:*`, sin `Date.now()`, sin `Math.random()`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';
import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  RESERVA_BLOQUEO_PCT,
  SPLIT_SOBERANO,
  LIMITE_B2G_LCSP_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
  VAT_RATE,
} from '@/lib/constants/ear-os-ssot';
import {
  META_ARTIFACT_BLOCKS,
  META_ENTRY_PHASE,
  type MetaArtifactBlock,
  type MetaFsmPhase,
} from './metacompiler-fsm';

// ─────────────────────────────────────────────────────────────────────────────
// Límites de hardening (mismo orden de magnitud que /api/admin/compile-intent)
// ─────────────────────────────────────────────────────────────────────────────

export const META_MAX_NAME = 80;
export const META_MAX_SUMMARY = 160;
export const META_MAX_NODE_ID = 96;
export const META_MAX_NODES = 32;
export const META_MAX_CHECKS = 32;
export const META_MAX_CHECK_TEXT = 280;

/**
 * Identificador de nodo: minúsculas, dígitos y guiones. Prohibido `..`, `/`,
 * `\`, espacios y caracteres de control (path traversal imposible por gramática).
 */
export const META_NODE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const nodeId = z
  .string()
  .trim()
  .min(3)
  .max(META_MAX_NODE_ID)
  .regex(META_NODE_ID_PATTERN, {
    message: 'Nodo inválido: sólo [a-z0-9-], sin rutas ni traversal.',
  });

export const MetaNodeKindSchema = z.enum(['SURFACE', 'ENGINE', 'CONNECTOR']);
export type MetaNodeKind = z.infer<typeof MetaNodeKindSchema>;

export const MetaOntologyNodeSchema = z
  .object({
    id: nodeId,
    label: z.string().trim().min(2).max(META_MAX_NAME),
    kind: MetaNodeKindSchema,
  })
  .strict();

export type MetaOntologyNode = z.infer<typeof MetaOntologyNodeSchema>;

/**
 * Bloques del artefacto que la especificación puede solicitar. El bloque
 * `GATES` sólo se emite si el autor autodeclara `includeGates: true`; el motor
 * nunca lo inventa (AF-5: nada de verde por defecto).
 */
export const MetaArtifactBlockSchema = z.enum(META_ARTIFACT_BLOCKS);
export type MetaArtifactBlockId = z.infer<typeof MetaArtifactBlockSchema>;

/** Fases inequívocas aceptadas en la especificación (IDLE/SEALED/ABORT excluidas). */
export const MetaPhaseSchema = z.enum(['HASH_VERIF', 'TYPE_CHECK', 'LINT_AST', 'GATE_EVAL']);
export const META_DECLARABLE_PHASES: readonly MetaFsmPhase[] = Object.freeze([
  'HASH_VERIF',
  'TYPE_CHECK',
  'LINT_AST',
  'GATE_EVAL',
]);

export const MetaCheckSchema = z
  .object({
    id: nodeId,
    statement: z.string().trim().min(3).max(META_MAX_CHECK_TEXT),
  })
  .strict();

export type MetaCheck = z.infer<typeof MetaCheckSchema>;

/**
 * Contrato COMPLETO de la especificación (Spec-First).
 * `.strict()`: un campo no declarado aquí se rechaza con 400, jamás se ignora
 * en silencio (misma doctrina que `compile-intent`).
 */
export const MetaCompilerSpecSchema = z
  .object({
    specId: nodeId,
    name: z.string().trim().min(3).max(META_MAX_NAME),
    summary: z.string().trim().min(8).max(META_MAX_SUMMARY),
    phases: z.array(MetaPhaseSchema).min(1).max(4),
    artifact: z
      .object({
        blocks: z.array(MetaArtifactBlockSchema).min(1).max(META_ARTIFACT_BLOCKS.length),
        includeGates: z.boolean(),
      })
      .strict(),
    ontology: z
      .object({
        nodes: z.array(MetaOntologyNodeSchema).min(1).max(META_MAX_NODES),
      })
      .strict(),
    invariants: z
      .object({
        checks: z.array(MetaCheckSchema).min(1).max(META_MAX_CHECKS),
      })
      .strict(),
    /** Trazabilidad comercial: la promesa vive en una URL o no existe (EP-3). */
    promiseUrl: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .regex(/^\/(?!\/)[^\s]*$/, { message: 'promiseUrl debe ser una ruta interna que empieza por "/".' }),
  })
  .strict();

export type MetaCompilerSpec = z.infer<typeof MetaCompilerSpecSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Constitución de diseño: valores canónicos de Zona Cero (fuente, no copia)
// ─────────────────────────────────────────────────────────────────────────────

export interface DesignConstant {
  readonly id: string;
  /** Valor exigido por la doctrina; se contrasta contra el SSOT en runtime. */
  readonly expected: number | string;
  /** Valor vivo leído de `ear-os-ssot.ts` en este mismo bundle. */
  readonly actual: number | string;
  readonly ssotSymbol: string;
  readonly invariant: string;
}

/**
 * Paridad declarada → SSOT. Si alguien edita `ear-os-ssot.ts`, `actual` cambia
 * y la paridad se rompe sola: el motor aborta sin que haya que tocar este
 * fichero. Si alguien edita `expected`, rompe la doctrina a la vista.
 */
export const DESIGN_CONSTITUTION: readonly DesignConstant[] = Object.freeze([
  { id: 'suelo-solista', expected: 350, actual: TARIFA_BASE_SOLISTA_EUR, ssotSymbol: 'TARIFA_BASE_SOLISTA_EUR', invariant: 'INV-01' },
  { id: 'tarifa-estandar', expected: 550, actual: TARIFA_ESTANDAR_SOLISTA_EUR, ssotSymbol: 'TARIFA_ESTANDAR_SOLISTA_EUR', invariant: 'INV-01' },
  { id: 'km-incluidos', expected: 100, actual: SOLISTA_KM_INCLUIDOS, ssotSymbol: 'SOLISTA_KM_INCLUIDOS', invariant: 'INV-01' },
  { id: 'logistica-km', expected: 1.5, actual: LOGISTICA_EUR_PER_KM, ssotSymbol: 'LOGISTICA_EUR_PER_KM', invariant: 'INV-01' },
  { id: 'km-exentos', expected: 50, actual: LOGISTICA_KM_EXENTOS, ssotSymbol: 'LOGISTICA_KM_EXENTOS', invariant: 'INV-01' },
  { id: 'km-hotel', expected: 200, actual: LOGISTICA_KM_HOTEL, ssotSymbol: 'LOGISTICA_KM_HOTEL', invariant: 'INV-01' },
  { id: 'suplemento-hotel', expected: 120, actual: SUPLEMENTO_HOTEL_EUR, ssotSymbol: 'SUPLEMENTO_HOTEL_EUR', invariant: 'INV-01' },
  { id: 'hora-fin-hotel', expected: 3, actual: HORA_FIN_HOTEL, ssotSymbol: 'HORA_FIN_HOTEL', invariant: 'INV-01' },
  { id: 'split-artista', expected: 0.8, actual: SPLIT_SOBERANO.artista, ssotSymbol: 'SPLIT_SOBERANO.artista', invariant: 'INV-02' },
  { id: 'split-earos', expected: 0.1, actual: SPLIT_SOBERANO.earOs, ssotSymbol: 'SPLIT_SOBERANO.earOs', invariant: 'INV-02' },
  { id: 'split-vimume', expected: 0.1, actual: SPLIT_SOBERANO.vimume, ssotSymbol: 'SPLIT_SOBERANO.vimume', invariant: 'INV-02' },
  { id: 'fianza-price-lock', expected: 100, actual: DEPOSITO_STRIPE_EUR, ssotSymbol: 'DEPOSITO_STRIPE_EUR', invariant: 'INV-03' },
  { id: 'reserva-bloqueo', expected: 0.5, actual: RESERVA_BLOQUEO_PCT, ssotSymbol: 'RESERVA_BLOQUEO_PCT', invariant: 'INV-03' },
  { id: 'techo-b2g', expected: 14250, actual: SAFE_LCSP_CEILING_EUR, ssotSymbol: 'SAFE_LCSP_CEILING_EUR', invariant: 'INV-04' },
  { id: 'limite-legal-lcsp', expected: 15000, actual: LIMITE_B2G_LCSP_EUR, ssotSymbol: 'LIMITE_B2G_LCSP_EUR', invariant: 'INV-04' },
  { id: 'limite-spl', expected: 75, actual: LIMITE_SPL_DB, ssotSymbol: 'LIMITE_SPL_DB', invariant: 'INV-13' },
  { id: 'watts-pax', expected: 12, actual: WATTS_PER_PAX, ssotSymbol: 'WATTS_PER_PAX', invariant: 'INV-13' },
  { id: 'iva', expected: 0.21, actual: VAT_RATE, ssotSymbol: 'VAT_RATE', invariant: 'INV-10' },
  { id: 'centralita', expected: '+34 693 693 048', actual: CENTRALITA_EAR_OS, ssotSymbol: 'CENTRALITA_EAR_OS', invariant: 'INV-12' },
]);

// ─────────────────────────────────────────────────────────────────────────────
// Juicio contractual
// ─────────────────────────────────────────────────────────────────────────────

export type DesignVerdict = 'PASS' | 'FAIL';

export interface DesignFinding {
  /** Prefijo estable: PRECOND / POSTCOND / PARITY. */
  readonly kind: 'PRECOND' | 'POSTCOND' | 'PARITY';
  readonly code: string;
  readonly detail: string;
}

export interface DesignVerification {
  readonly verdict: DesignVerdict;
  readonly precondition: DesignVerdict;
  readonly postcondition: DesignVerdict;
  readonly ssotParity: DesignVerdict;
  readonly findings: readonly DesignFinding[];
  readonly parityChecked: number;
  /** Fase a la que el motor debe saltar (siempre la primera del contrato). */
  readonly entryPhase: MetaFsmPhase;
}

function sameNumber(a: number, b: number): boolean {
  return Math.abs(a - b) <= 0.0001;
}

/** ¿El valor declarado coincide con el del SSOT? Strings por igualdad exacta. */
function parityHolds(constant: DesignConstant): boolean {
  if (typeof constant.expected === 'number' && typeof constant.actual === 'number') {
    return sameNumber(constant.expected, constant.actual);
  }
  return constant.expected === constant.actual;
}

function isDeclarablePhase(value: string): value is MetaFsmPhase {
  return (META_DECLARABLE_PHASES as readonly string[]).includes(value);
}

/**
 * Verificación determinista de la especificación. No lanza: devuelve un
 * informe con los tres juicios y los hallazgos con código estable.
 */
export function verifySpecDesignTime(spec: MetaCompilerSpec): DesignVerification {
  const findings: DesignFinding[] = [];

  // ── 1. PRECONDICIÓN ──────────────────────────────────────────────────────
  const declared = spec.phases.filter(isDeclarablePhase);
  if (!declared.includes('HASH_VERIF')) {
    findings.push({
      kind: 'PRECOND',
      code: 'PHASES_WITHOUT_ENTRY',
      detail: `El contrato exige HASH_VERIF como primera fase; declaradas: ${spec.phases.join(' → ')}.`,
    });
  }
  if (new Set(spec.phases).size !== spec.phases.length) {
    findings.push({
      kind: 'PRECOND',
      code: 'DUPLICATE_PHASE',
      detail: 'Hay fases repetidas: la secuencia dejaría de ser determinista.',
    });
  }
  const canonicalOrder = META_DECLARABLE_PHASES.filter((phase) => declared.includes(phase));
  if (canonicalOrder.join('>') !== declared.join('>')) {
    findings.push({
      kind: 'PRECOND',
      code: 'PHASE_ORDER',
      detail: 'Las fases deben declararse en el orden canónico del pipeline.',
    });
  }

  const seenBlocks = new Set<MetaArtifactBlock>();
  for (const block of spec.artifact.blocks) {
    if (seenBlocks.has(block)) {
      findings.push({
        kind: 'PRECOND',
        code: 'DUPLICATE_BLOCK',
        detail: `El bloque ${block} está declarado dos veces.`,
      });
    }
    seenBlocks.add(block);
  }

  const nodeIds = new Set<string>();
  for (const node of spec.ontology.nodes) {
    if (nodeIds.has(node.id)) {
      findings.push({ kind: 'PRECOND', code: 'DUPLICATE_NODE', detail: `Nodo duplicado: ${node.id}.` });
    }
    nodeIds.add(node.id);
  }

  const checkIds = new Set<string>();
  for (const check of spec.invariants.checks) {
    if (checkIds.has(check.id)) {
      findings.push({
        kind: 'PRECOND',
        code: 'DUPLICATE_CHECK',
        detail: `Invariante duplicada: ${check.id}.`,
      });
    }
    checkIds.add(check.id);
  }

  if (spec.promiseUrl.includes('?') || spec.promiseUrl.includes('#')) {
    findings.push({
      kind: 'PRECOND',
      code: 'PROMISE_URL_NOT_CANONICAL',
      detail: 'La promesa debe apuntar a una ruta canónica sin query string ni fragmento.',
    });
  }

  const precondition: DesignVerdict = findings.some((f) => f.kind === 'PRECOND') ? 'FAIL' : 'PASS';

  // ── 2. POSTCONDICIÓN (lo que el artefacto emitido no puede violar) ───────
  const postFindings: DesignFinding[] = [];
  if (spec.artifact.includeGates && !seenBlocks.has('GATES')) {
    postFindings.push({
      kind: 'POSTCOND',
      code: 'GATES_INCLUDED_WITHOUT_BLOCK',
      detail: 'includeGates exige declarar el bloque GATES; el motor no lo inventa.',
    });
  }
  if (!spec.artifact.includeGates && seenBlocks.has('GATES')) {
    postFindings.push({
      kind: 'POSTCOND',
      code: 'GATES_BLOCK_WITHOUT_FLAG',
      detail: 'El bloque GATES sólo se emite si includeGates es true.',
    });
  }
  if (!seenBlocks.has('TYPES') || !seenBlocks.has('VALIDATORS')) {
    postFindings.push({
      kind: 'POSTCOND',
      code: 'ARTIFACT_WITHOUT_CONTRACT',
      detail: 'Todo artefacto compilado debe declarar TYPES y VALIDATORS (contrato verificable).',
    });
  }
  findings.push(...postFindings);
  const postcondition: DesignVerdict = postFindings.length === 0 ? 'PASS' : 'FAIL';

  // ── 3. PARIDAD SSOT ──────────────────────────────────────────────────────
  for (const constant of DESIGN_CONSTITUTION) {
    if (!parityHolds(constant)) {
      findings.push({
        kind: 'PARITY',
        code: `SSOT_DRIFT_${constant.id.toUpperCase().replace(/-/g, '_')}`,
        detail: `${constant.ssotSymbol} = ${String(constant.actual)}; la doctrina exige ${String(constant.expected)} (${constant.invariant}).`,
      });
    }
  }
  const splitSum = SPLIT_SOBERANO.artista + SPLIT_SOBERANO.earOs + SPLIT_SOBERANO.vimume;
  if (!sameNumber(splitSum, 1)) {
    findings.push({
      kind: 'PARITY',
      code: 'SPLIT_DOES_NOT_SUM_100',
      detail: `SPLIT_SOBERANO suma ${splitSum.toFixed(4)} y debe sumar 1 (80/10/10).`,
    });
  }
  if (!sameNumber(SAFE_LCSP_CEILING_EUR, LIMITE_B2G_LCSP_EUR * 0.95)) {
    findings.push({
      kind: 'PARITY',
      code: 'B2G_CEILING_NOT_95_PCT',
      detail: 'El techo preventivo B2G debe ser exactamente el 95 % del límite LCSP.',
    });
  }
  const ssotParity: DesignVerdict = findings.some((f) => f.kind === 'PARITY') ? 'FAIL' : 'PASS';

  return {
    verdict:
      precondition === 'PASS' && postcondition === 'PASS' && ssotParity === 'PASS' ? 'PASS' : 'FAIL',
    precondition,
    postcondition,
    ssotParity,
    findings,
    parityChecked: DESIGN_CONSTITUTION.length + 2,
    entryPhase: META_ENTRY_PHASE,
  };
}

/** Especificación mínima válida (semilla de la UI y de la CLI de certificación). */
export function buildDefaultSpec(): MetaCompilerSpec {
  return {
    specId: 'omega-metacompiler-core',
    name: 'MetaCompilador Soberano',
    summary: 'Contrato de compilación determinista con paridad de Zona Cero.',
    phases: ['HASH_VERIF', 'TYPE_CHECK', 'LINT_AST', 'GATE_EVAL'],
    artifact: {
      blocks: ['HEADER', 'TYPES', 'VALIDATORS', 'GATES'],
      includeGates: true,
    },
    ontology: {
      nodes: [
        { id: 'zona-cero', label: 'Zona Cero (SSOT financiero)', kind: 'ENGINE' },
        { id: 'metacompiler', label: 'MetaCompilador /admin/compiler', kind: 'ENGINE' },
        { id: 'gates-17', label: 'Arnés de 17 compuertas', kind: 'CONNECTOR' },
      ],
    },
    invariants: {
      checks: [
        { id: 'split-80-10-10', statement: 'artista + earOs + vimume === 1 al céntimo' },
        { id: 'fianza-100', statement: 'DEPOSITO_STRIPE_EUR === 100,00 EUR' },
        { id: 'techo-b2g', statement: 'SAFE_LCSP_CEILING_EUR === 14.250,00 EUR' },
      ],
    },
    promiseUrl: '/admin/compiler',
  };
}

