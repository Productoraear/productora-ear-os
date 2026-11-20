/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · MÁQUINA DE ESTADOS DISCRETA (FSM DETERMINISTA)
 * ════════════════════════════════════════════════════════════════════════════
 * Zona Cero NO se toca. Este módulo es isomorfo (sin `node:*`): lo consume el
 * Server Component de `/admin/compiler`, el componente cliente OLED y el
 * verificador `npm run verify:metacompiler`. Una sola verdad de estados.
 *
 *   IDLE → HASH_VERIF → TYPE_CHECK → LINT_AST → GATE_EVAL → SEALED | ABORT
 *
 * Toda transición es una función TOTAL y DETERMINISTA de (estado, veredicto):
 *   - No existe transición implícita: `nextState` devuelve `null` y el motor
 *     sella `ABORT` con `ILLEGAL_TRANSITION`.
 *   - Un único punto de aborto: cualquier veredicto ≠ PASS expulsa la máquina
 *     a `ABORT`, nunca "sigue y luego vemos".
 *   - Sin Date.now() ni Math.random(): la misma especificación produce
 *     exactamente la misma secuencia de estados y los mismos SHA-256.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Estados terminales y transitorios de la máquina de estados discreta. */
export const META_FSM_STATES = [
  'IDLE',
  'HASH_VERIF',
  'TYPE_CHECK',
  'LINT_AST',
  'GATE_EVAL',
  'SEALED',
  'ABORT',
] as const;

export type MetaFsmState = (typeof META_FSM_STATES)[number];

/** Orden lineal de emisión de bloques de artefacto (uno por fase activa). */
export const META_ARTIFACT_BLOCKS = ['HEADER', 'TYPES', 'VALIDATORS', 'GATES'] as const;
export type MetaArtifactBlock = (typeof META_ARTIFACT_BLOCKS)[number];

/** Fase activa del motor. `null` en terminales (IDLE/SEALED/ABORT). */
export type MetaFsmPhase = 'HASH_VERIF' | 'TYPE_CHECK' | 'LINT_AST' | 'GATE_EVAL';

/** Verdicto de una sonda de fase. Vocabulario CERRADO (EP-2). */
export type MetaVerdict = 'PASS' | 'FAIL' | 'SIN_EVIDENCIA';
export const META_VERDICTS: readonly MetaVerdict[] = Object.freeze(['PASS', 'FAIL', 'SIN_EVIDENCIA']);

/** Códigos de motivo de aborto. Fuera de esta lista no hay motivo válido. */
export type MetaAbortReason =
  | 'ILLEGAL_TRANSITION'
  | 'HASH_MISMATCH'
  | 'INVARIANT_VIOLATION'
  | 'TYPE_ERROR'
  | 'AST_VIOLATION'
  | 'GATE_FAILURE'
  | 'NO_EVIDENCE';

export const META_ABORT_REASONS: readonly MetaAbortReason[] = Object.freeze([
  'ILLEGAL_TRANSITION',
  'HASH_MISMATCH',
  'INVARIANT_VIOLATION',
  'TYPE_ERROR',
  'AST_VIOLATION',
  'GATE_FAILURE',
  'NO_EVIDENCE',
]);

/**
 * Motivo de aborto asociado a cada fase cuando el veredicto NO es PASS.
 * `HASH_VERIF` distingue la violación de invariantes (postcondición de
 * paridad) del simple desajuste del hash SHA-256 de Zona Cero.
 */
export const PHASE_ABORT_REASON: Readonly<Record<MetaFsmPhase, MetaAbortReason>> = Object.freeze({
  HASH_VERIF: 'HASH_MISMATCH',
  TYPE_CHECK: 'TYPE_ERROR',
  LINT_AST: 'AST_VIOLATION',
  GATE_EVAL: 'GATE_FAILURE',
});

/**
 * Tabla de transición TOTAL: para cada fase activa, el único destino legal.
 * `Object.freeze` impide que un import accidental mute la máquina en runtime.
 */
export const META_TRANSITIONS: Readonly<Record<MetaFsmPhase, MetaFsmState>> = Object.freeze({
  HASH_VERIF: 'TYPE_CHECK',
  TYPE_CHECK: 'LINT_AST',
  LINT_AST: 'GATE_EVAL',
  GATE_EVAL: 'SEALED',
});

export const META_INITIAL_STATE: MetaFsmState = 'IDLE';
/** Primera fase del pipeline: congelada para que el motor no pueda arrancar en otra. */
export const META_ENTRY_PHASE: MetaFsmPhase = 'HASH_VERIF';

export function isMetaFsmState(value: unknown): value is MetaFsmState {
  return typeof value === 'string' && (META_FSM_STATES as readonly string[]).includes(value);
}

export function isMetaFsmPhase(value: unknown): value is MetaFsmPhase {
  return (
    typeof value === 'string' &&
    value !== 'IDLE' &&
    value !== 'SEALED' &&
    value !== 'ABORT' &&
    isMetaFsmState(value)
  );
}

export function isMetaVerdict(value: unknown): value is MetaVerdict {
  return typeof value === 'string' && (META_VERDICTS as readonly string[]).includes(value);
}

/** ¿Es un estado terminal? Un terminal no admite ninguna transición. */
export function isTerminalState(state: MetaFsmState): boolean {
  return state === 'SEALED' || state === 'ABORT';
}

/**
 * Transición determinista. Contrato:
 *   - `IDLE` + `PASS`  → entra en `HASH_VERIF`.
 *   - Fase activa + `PASS` → su único sucesor en `META_TRANSITIONS`.
 *   - Fase activa + `FAIL` / `SIN_EVIDENCIA` → `ABORT`.
 *   - Cualquier otro par → `null` (el llamante debe sellar ILLEGAL_TRANSITION).
 * No lanza: devolver `null` permite al motor distinguir "ilegal" de "excepción".
 */
export function nextState(current: MetaFsmState, verdict: MetaVerdict): MetaFsmState | null {
  if (current === 'IDLE') {
    return verdict === 'PASS' ? META_ENTRY_PHASE : null;
  }
  if (isTerminalState(current)) return null;
  if (!isMetaFsmPhase(current)) return null;
  return verdict === 'PASS' ? META_TRANSITIONS[current] : 'ABORT';
}

/**
 * Motivo de aborto derivado de forma determinista.
 * `invariantsOk === false` durante HASH_VERIF gana sobre `HASH_MISMATCH`:
 * una violación de negocio (split, fianza, techo B2G) es más grave y debe
 * quedar registrada con su propio código, no diluida en un desajuste de hash.
 */
export function resolveAbortReason(
  phase: MetaFsmPhase,
  verdict: MetaVerdict,
  invariantsOk?: boolean,
): MetaAbortReason {
  if (verdict === 'SIN_EVIDENCIA') return 'NO_EVIDENCE';
  if (phase === 'HASH_VERIF' && invariantsOk === false) return 'INVARIANT_VIOLATION';
  return PHASE_ABORT_REASON[phase];
}
