/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — DESPACHADOR LOCAL DE HABILIDADES (SKILL DISPATCHER ENGINE)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecuta un cartucho del registro contra su esquema Zod y devuelve la
 * ejecución tipada. Es el único punto de entrada: la ruta HTTP y la herramienta
 * MCP llaman aquí, así que no pueden comportarse distinto.
 *
 * Garantías:
 *   · Default-deny por rol (AGENTS.md): el cartucho declara a quién sirve y el
 *     despachador lo comprueba ANTES de ejecutar (SEC-1).
 *   · Timeout estricto de 10 s (INV-17 / directiva §2): si el motor se cuelga,
 *     se aborta con `SKILL_TIMEOUT` en lugar de dejar la petición pendiente.
 *   · Cero red: ningún cartucho importa clientes HTTP. El timeout protege de
 *     un bucle infinito en CPU, no de un tercero.
 *   · Errores clasificados: `UNKNOWN_SKILL`, `ROLE_FORBIDDEN`, `INVALID_INPUT`,
 *     `ABORTED_BY_POLICY` (guard JUR), `SKILL_TIMEOUT`, `SKILL_FAILED`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { findSkill, listSkillManifests } from './registry';
import { SKILL_ROLES, type SkillExecution, type SkillManifest, type SkillRole } from './skill-contract';

/** Presupuesto máximo por cartucho (directiva §2: timeout estricto de 10 s). */
export const SKILL_TIMEOUT_MS = 10_000;

export type SkillErrorCode =
  | 'UNKNOWN_SKILL'
  | 'ROLE_FORBIDDEN'
  | 'INVALID_INPUT'
  | 'ABORTED_BY_POLICY'
  | 'SKILL_TIMEOUT'
  | 'SKILL_FAILED';

export type SkillDispatchResult =
  | { readonly ok: true; readonly execution: SkillExecution }
  | {
      readonly ok: false;
      readonly code: SkillErrorCode;
      readonly error: string;
      readonly issues?: readonly string[];
      readonly available?: readonly string[];
    };

export interface DispatchOptions {
  /** Rol del operador (validado por la capa de sesión, no por el cliente). */
  readonly role: SkillRole;
  /** Timestamp ISO inyectado para determinismo y trazabilidad. */
  readonly now?: string;
  /** Timeout alternativo (tests). Nunca superior a `SKILL_TIMEOUT_MS`. */
  readonly timeoutMs?: number;
}

/** Catálogo público de manifiestos, filtrable por rol. */
export function catalogForRole(role: SkillRole): readonly SkillManifest[] {
  return listSkillManifests().filter((manifest) => manifest.role === role);
}

function isSkillRole(value: string): value is SkillRole {
  return (SKILL_ROLES as readonly string[]).includes(value);
}

/** Ejecuta con timeout duro envolviendo la promesa del cartucho. */
async function runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('__SKILL_TIMEOUT__')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export async function dispatchSkill(
  skillId: string,
  payload: unknown,
  options: DispatchOptions,
): Promise<SkillDispatchResult> {
  const skill = findSkill(skillId);
  if (skill === null) {
    return {
      ok: false,
      code: 'UNKNOWN_SKILL',
      error: `Cartucho desconocido: ${skillId}.`,
      available: listSkillManifests().map((manifest) => manifest.id),
    };
  }

  if (!isSkillRole(options.role)) {
    return { ok: false, code: 'ROLE_FORBIDDEN', error: `Rol inválido: ${String(options.role)}.` };
  }

  // AGENTS.md · matriz de permisos: el cartucho declara su rol y se respeta.
  if (skill.manifest.role !== options.role) {
    return {
      ok: false,
      code: 'ROLE_FORBIDDEN',
      error: `El cartucho «${skill.manifest.title}» pertenece al rol ${skill.manifest.role}, no a ${options.role}.`,
    };
  }

  const parsed = skill.input.safeParse(payload ?? {});
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      error: 'Payload inválido para el cartucho.',
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.') || 'payload'}: ${issue.message}`),
    };
  }

  const timeoutMs = Math.min(options.timeoutMs ?? SKILL_TIMEOUT_MS, SKILL_TIMEOUT_MS);

  try {
    const execution = await runWithTimeout(
      skill.run(parsed.data, { now: options.now ?? new Date().toISOString() }),
      timeoutMs,
    );
    return { ok: true, execution };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : 'Error desconocido.';
    if (message === '__SKILL_TIMEOUT__') {
      return {
        ok: false,
        code: 'SKILL_TIMEOUT',
        error: `El cartucho superó el presupuesto de ${timeoutMs} ms y se abortó.`,
      };
    }
    // Los guards de política (p. ej. techo LCSP) se distinguen del fallo técnico.
    const isPolicy = message.startsWith('ABORTADO');
    return {
      ok: false,
      code: isPolicy ? 'ABORTED_BY_POLICY' : 'SKILL_FAILED',
      error: message,
    };
  }
}
