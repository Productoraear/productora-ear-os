/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · MOTOR DE ORQUESTACIÓN LOCAL (ZERO-TOKEN)
 * ════════════════════════════════════════════════════════════════════════════
 * Gobierna la FSM `IDLE → HASH_VERIF → TYPE_CHECK → LINT_AST → GATE_EVAL →
 * SEALED | ABORT` sin una sola llamada a un LLM remoto.
 *
 * Reglas de honestidad embebidas:
 *   - `evidence[]` es APPEND-ONLY: jamás se borra una línea de evidencia.
 *   - `SIN_EVIDENCIA` nunca se degrada a `PASS`: aborta con `NO_EVIDENCE`.
 *   - `SEALED` exige que TODAS las fases declaradas hayan pasado.
 *   - El motor NO toca Zona Cero: sólo invoca el centinela `verifySsotIntegrity`.
 *
 * Diseño anti-pérdida de estado (bug medido el 2026-11-20):
 *   El estado NO se guarda en un objeto mutable compartido entre closures. La
 *   transición es una función PURA (`transition`) que recibe el estado actual y
 *   devuelve el sucesor; el llamante lo asigna en una `let` local. Además, cada
 *   fase declara su PRECONDICIÓN (`expect`), de modo que una transición desde un
 *   estado inesperado aborta con `ILLEGAL_TRANSITION` en lugar de continuar.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { sha256OfText } from './metacompiler-hash';
import { KNOWN_GOOD_SSOT_HASH, verifySsotIntegrity } from '@/lib/security/ssotIntegrityGuard';
import {
  isMetaFsmPhase,
  nextState,
  resolveAbortReason,
  type MetaAbortReason,
  type MetaFsmPhase,
  type MetaFsmState,
  type MetaVerdict,
} from './metacompiler-fsm';
import {
  DESIGN_CONSTITUTION,
  MetaCompilerSpecSchema,
  verifySpecDesignTime,
  type DesignVerification,
  type MetaCompilerSpec,
} from './metacompiler-spec';
import { emitArtifact, type EmittedArtifact } from './metacompiler-emitter';
import type { MetaCompilerRuntime, PlatformSnapshot } from './metacompiler-runtime';

/** Una línea de evidencia. `sha256` es nulo si la fase no produjo bytes. */
export interface MetaEvidenceLine {
  readonly seq: number;
  readonly phase: MetaFsmPhase | 'IDLE';
  readonly verdict: MetaVerdict;
  readonly exitCode: 0 | 1;
  readonly command: string;
  readonly detail: string;
  readonly sha256: string | null;
  readonly ts: string;
}

/** Una transición de la FSM. `reason` sólo existe cuando se sella ABORT. */
export interface MetaFsmTraceLine {
  readonly seq: number;
  readonly from: MetaFsmState;
  readonly to: MetaFsmState;
  readonly phase: MetaFsmPhase | null;
  readonly verdict: MetaVerdict | null;
  readonly reason: MetaAbortReason | null;
}

export interface MetaCompilerResult {
  readonly specId: string | null;
  readonly state: MetaFsmState;
  readonly abortReason: MetaAbortReason | null;
  readonly design: DesignVerification | null;
  readonly artifact: EmittedArtifact | null;
  readonly evidence: readonly MetaEvidenceLine[];
  readonly trace: readonly MetaFsmTraceLine[];
  readonly ssot: {
    readonly computedHash: string;
    readonly referenceHash: string;
    readonly intact: boolean;
    readonly invariantsOk: boolean;
    readonly violated: readonly string[];
  } | null;
  readonly platform: PlatformSnapshot | null;
  readonly stats: {
    readonly phasesRun: number;
    readonly phasesPassed: number;
    readonly evidenceLines: number;
    readonly parityChecked: number;
    readonly nodesSeeded: number;
  };
  /** Sello determinista: dos compilaciones idénticas ⇒ mismo hash. */
  readonly sealHash: string;
  readonly checkedAt: string;
  /** Contrato AF-1: toda salida declara cómo se obtuvo. */
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL' | 'SIMULADO';
  readonly isoTimestamp: string;
}

export interface MetaCompileOptions {
  /** Timestamp ISO con el que se fechan las líneas de evidencia. */
  readonly now: string;
  /** Runtime inyectado (local o server-only). Obligatorio: no hay runtime implícito. */
  readonly runtime: MetaCompilerRuntime;
  /** Si es true, siembra los nodos de ontología del runtime (idempotente). */
  readonly seedOntology?: boolean;
}

/** Estado interno de una ejecución. `state` es el único campo que muta. */
interface RunState {
  readonly spec: MetaCompilerSpec;
  readonly evidence: MetaEvidenceLine[];
  readonly trace: MetaFsmTraceLine[];
  design: DesignVerification | null;
  artifact: EmittedArtifact | null;
  ssot: MetaCompilerResult['ssot'];
  platform: PlatformSnapshot | null;
  phasesRun: number;
  phasesPassed: number;
  nodesSeeded: number;
  abortReason: MetaAbortReason | null;
}

function readSsot(): NonNullable<MetaCompilerResult['ssot']> {
  const report = verifySsotIntegrity();
  return {
    computedHash: report.computedHash,
    referenceHash: report.referenceHash,
    intact: report.intact,
    invariantsOk: report.invariantsOk,
    violated: report.violatedInvariants,
  };
}

function safeEmit(spec: MetaCompilerSpec): EmittedArtifact | null {
  try {
    return emitArtifact(spec);
  } catch {
    return null;
  }
}

function phaseOf(state: MetaFsmState): MetaFsmPhase | null {
  if (state === 'HASH_VERIF') return 'HASH_VERIF';
  if (state === 'TYPE_CHECK') return 'TYPE_CHECK';
  if (state === 'LINT_AST') return 'LINT_AST';
  if (state === 'GATE_EVAL') return 'GATE_EVAL';
  return null;
}

/**
 * Transición PURA de la FSM. Registra la línea de traza y devuelve el sucesor.
 *
 * Precondición: `current === expected`. Si no se cumple, la transición es
 * ilegal y se devuelve `ABORT` — nunca se continúa desde un estado inesperado.
 * No muta ningún objeto compartido: el llamante asigna el valor devuelto.
 */
function transition(
  run: RunState,
  current: MetaFsmState,
  expected: MetaFsmState,
  verdict: MetaVerdict,
  invariantsOk?: boolean,
): MetaFsmState {
  const successor = nextState(current, verdict);
  // Fase evaluada en este paso: en IDLE la fase es HASH_VERIF.
  const phase: MetaFsmPhase | null = current === 'IDLE' ? 'HASH_VERIF' : phaseOf(current);

  // Precondición: sólo se transita desde el estado que la fase declara.
  if (current !== expected) {
    run.abortReason = 'ILLEGAL_TRANSITION';
    run.trace.push({ seq: run.trace.length + 1, from: current, to: 'ABORT', phase, verdict, reason: run.abortReason });
    return 'ABORT';
  }
  if (successor === null) {
    run.abortReason = 'ILLEGAL_TRANSITION';
    run.trace.push({ seq: run.trace.length + 1, from: current, to: 'ABORT', phase, verdict, reason: run.abortReason });
    return 'ABORT';
  }
  if (successor === 'ABORT') {
    run.abortReason = phase === null ? 'NO_EVIDENCE' : resolveAbortReason(phase, verdict, invariantsOk);
    run.trace.push({ seq: run.trace.length + 1, from: current, to: 'ABORT', phase, verdict, reason: run.abortReason });
    return 'ABORT';
  }

  run.trace.push({ seq: run.trace.length + 1, from: current, to: successor, phase, verdict, reason: null });
  return successor;
}

/** Sella el resultado. Único camino de salida del motor. */
function seal(
  run: RunState,
  state: MetaFsmState,
  declaredPhases: number,
  now: string,
): MetaCompilerResult {
  const sealed =
    state === 'SEALED' &&
    run.abortReason === null &&
    run.phasesRun === declaredPhases &&
    run.phasesPassed === declaredPhases;
  const finalState: MetaFsmState = sealed ? 'SEALED' : 'ABORT';
  const abortReason: MetaAbortReason | null = sealed ? null : (run.abortReason ?? 'NO_EVIDENCE');
  const sealHash = sha256OfText(
    JSON.stringify({
      specId: run.spec.specId,
      state: finalState,
      abortReason,
      evidence: run.evidence.map((line) => ({
        seq: line.seq,
        phase: line.phase,
        verdict: line.verdict,
        sha256: line.sha256,
      })),
    }),
  );

  return {
    specId: run.spec.specId,
    state: finalState,
    abortReason,
    design: run.design,
    artifact: run.artifact,
    evidence: run.evidence,
    trace: run.trace,
    ssot: run.ssot,
    platform: run.platform,
    stats: {
      phasesRun: run.phasesRun,
      phasesPassed: run.phasesPassed,
      evidenceLines: run.evidence.length,
      parityChecked: run.design?.parityChecked ?? DESIGN_CONSTITUTION.length,
      nodesSeeded: run.nodesSeeded,
    },
    sealHash,
    checkedAt: now,
    probed: true,
    source: 'live',
    mode: 'REAL',
    isoTimestamp: now,
  };
}

export const ENGINE_VERSION_MARKER = 'ENGINE_V2_CLEAN_2026_11_20';

/** Registra una línea de evidencia (append-only). */
function push(
  run: RunState,
  phase: MetaFsmPhase | 'IDLE',
  verdict: MetaVerdict,
  command: string,
  detail: string,
  hash: string | null,
  now: string,
): void {
  run.evidence.push({
    seq: run.evidence.length + 1,
    phase,
    verdict,
    exitCode: verdict === 'PASS' ? 0 : 1,
    command,
    detail,
    sha256: hash,
    ts: now,
  });
}

/**
 * Compila una especificación NO tipada. Nunca lanza por culpa de la entrada:
 * devuelve `ABORT` con evidencia. El llamante (route handler) sólo traduce a
 * 500 un fallo del propio runtime.
 */
export async function compileMetaSpec(
  rawSpec: unknown,
  options: MetaCompileOptions,
): Promise<MetaCompilerResult> {
  const { now, runtime } = options;

  // ── PRECONDICIÓN ZOD (SEC-4): sin spec válida no se puede ni arrancar ────
  const parsed = MetaCompilerSpecSchema.safeParse(rawSpec);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join(' | ');
    const invalidRun: RunState = {
      spec: { ...(rawSpec as MetaCompilerSpec), specId: 'invalid-spec' },
      evidence: [],
      trace: [],
      design: null,
      artifact: null,
      ssot: null,
      platform: null,
      phasesRun: 0,
      phasesPassed: 0,
      nodesSeeded: 0,
      abortReason: 'ILLEGAL_TRANSITION',
    };
    push(invalidRun, 'IDLE', 'FAIL', 'zod(MetaCompilerSpecSchema)', `Especificacion invalida: ${detail}`, null, now);
    return seal(invalidRun, 'ABORT', 0, now);
  }

  const run: RunState = {
    spec: parsed.data,
    evidence: [],
    trace: [],
    design: null,
    artifact: null,
    ssot: null,
    platform: null,
    phasesRun: 0,
    phasesPassed: 0,
    nodesSeeded: 0,
    abortReason: null,
  };
  const declaredPhases = run.spec.phases.length;

  // ── FASE 1 · HASH_VERIF: paridad de Zona Cero y juicio de diseño ────────
  run.phasesRun += 1;
  const design = verifySpecDesignTime(run.spec);
  const ssot = readSsot();
  const hashOk =
    ssot.computedHash === ssot.referenceHash &&
    ssot.computedHash === KNOWN_GOOD_SSOT_HASH &&
    ssot.intact;
  const hashVerdict: MetaVerdict = design.verdict === 'PASS' && hashOk ? 'PASS' : 'FAIL';
  run.design = design;
  run.ssot = ssot;
  if (hashVerdict === 'PASS') run.phasesPassed += 1;
  push(
    run,
    'HASH_VERIF',
    hashVerdict,
    'verifySsotIntegrity() + verifySpecDesignTime(spec)',
    [
      `ssot_computed=${ssot.computedHash}`,
      `ssot_reference=${ssot.referenceHash}`,
      `invariantes=${ssot.invariantsOk ? 'OK' : ssot.violated.join(';')}`,
      `precondicion=${design.precondition}`,
      `postcondicion=${design.postcondition}`,
      `paridad_ssot=${design.ssotParity} (${design.parityChecked} constantes)`,
      `hallazgos=${design.findings.length === 0 ? '0' : design.findings.map((f) => f.code).join(',')}`,
    ].join(' · '),
    ssot.computedHash,
    now,
  );
  const afterHash = transition(run, 'IDLE', 'IDLE', hashVerdict, ssot.invariantsOk);
  if (afterHash !== 'HASH_VERIF') {
    return seal(run, afterHash, declaredPhases, now);
  }

  // ── FASE 2 · TYPE_CHECK: contrato de tipos del artefacto emitido ────────
  run.phasesRun += 1;
  const artifact = safeEmit(run.spec);
  run.artifact = artifact;
  const typeVerdict: MetaVerdict = artifact === null ? 'FAIL' : 'PASS';
  if (typeVerdict === 'PASS') run.phasesPassed += 1;
  push(
    run,
    'TYPE_CHECK',
    typeVerdict,
    'emitArtifact(spec)',
    artifact === null
      ? 'La emision lanzo una excepcion: contrato de tipos no verificable.'
      : `bytes=${artifact.bytes} · lineas=${artifact.lines} · bloques=${artifact.blocks.join(',')}`,
    artifact === null ? null : sha256OfText(artifact.artifact),
    now,
  );
  const afterType = transition(run, afterHash, 'HASH_VERIF', typeVerdict);
  if (afterType !== 'TYPE_CHECK' || artifact === null) {
    return seal(run, afterType, declaredPhases, now);
  }

  // ── FASE 3 · LINT_AST: auditoría estática del artefacto ─────────────────
  run.phasesRun += 1;
  const lintVerdict: MetaVerdict = artifact.astValid ? 'PASS' : 'FAIL';
  if (lintVerdict === 'PASS') run.phasesPassed += 1;
  push(
    run,
    'LINT_AST',
    lintVerdict,
    'auditArtifactAst(artifact)',
    `diagnosticos=${artifact.diagnostics.length === 0 ? '0' : artifact.diagnostics.join(';')}`,
    sha256OfText(artifact.artifact),
    now,
  );
  const afterLint = transition(run, afterType, 'TYPE_CHECK', lintVerdict);
  if (afterLint !== 'LINT_AST') {
    return seal(run, afterLint, declaredPhases, now);
  }

  // ── FASE 4 · GATE_EVAL: sondas de plataforma y sembrado idempotente ─────
  run.phasesRun += 1;
  const detailParts: string[] = [];
  let seedAvailable = options.seedOntology !== true;
  try {
    run.platform = await runtime.platformSnapshot();
  } catch {
    run.platform = null;
  }
  const platform = run.platform;

  let gateVerdict: MetaVerdict = 'SIN_EVIDENCIA';
  if (platform === null) {
    detailParts.push('platformSnapshot() no respondio: sin evidencia de plataforma.');
  } else {
    detailParts.push(`catalogo=${platform.sectorCount} sectores/${platform.categoryCount} categorias`);
    if (options.seedOntology === true) {
      try {
        const seeded = await runtime.seedOntology(run.spec.ontology.nodes);
        run.nodesSeeded = seeded.total;
        seedAvailable = true;
        detailParts.push(
          `ontologia=insertados:${seeded.inserted},omitidos:${seeded.skipped},total:${seeded.total}`,
        );
      } catch {
        detailParts.push('ontologia= sembrado no disponible en este runtime');
      }
    }
    const gates = await runtime.probeGates();
    detailParts.push(`arnes=${gates.total} compuertas`);
    const catalogOk = platform.sectorCount > 0 && platform.categoryCount > 0;
    const gatesOk = gates.total > 0;
    gateVerdict = catalogOk && gatesOk && seedAvailable ? 'PASS' : 'SIN_EVIDENCIA';
  }

  if (gateVerdict === 'PASS') run.phasesPassed += 1;
  push(
    run,
    'GATE_EVAL',
    gateVerdict,
    'runtime.platformSnapshot() + runtime.seedOntology() + runtime.probeGates()',
    detailParts.join(' · '),
    platform === null ? null : sha256OfText(JSON.stringify(platform.sectors)),
    now,
  );
  const afterGate = transition(run, afterLint, 'LINT_AST', gateVerdict);
  if (afterGate !== 'GATE_EVAL') {
    return seal(run, afterGate, declaredPhases, now);
  }

  // Última transición: GATE_EVAL + PASS ⇒ SEALED. Sólo se ejecuta si se llegó
  // realmente a GATE_EVAL, para no sobrescribir el motivo de aborto original.
  const afterSeal = transition(run, afterGate, 'GATE_EVAL', gateVerdict);

  return seal(run, afterSeal, declaredPhases, now);
}

