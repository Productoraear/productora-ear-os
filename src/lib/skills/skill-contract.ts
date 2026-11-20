/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · CONTRATO COMÚN DEL DESPACHADOR
 * ════════════════════════════════════════════════════════════════════════════
 * Tríada de gobernanza (AGENTS.md / SKILL.md / HERRAMIENTA):
 *   1. AGENTS.md  → qué rol invoca qué habilidad      (`role`)
 *   2. SKILL.md   → flujo procedural estricto         (`steps` + `outputs`)
 *   3. Herramienta → ejecución local a 0 tokens       (`run`, puro)
 *
 * Todo lo de este módulo es PURO (sin `node:fs`, sin Prisma, sin red) para que
 * el mismo contrato se pueda validar en el navegador antes de viajar al
 * servidor, igual que ya hace la FSM del MetaCompilador.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

/** Rol autorizado a disparar el cartucho (AGENTS.md → matriz de permisos). */
export const SKILL_ROLES = ['CEO', 'MAITRE', 'PROVEEDOR'] as const;
export type SkillRole = (typeof SKILL_ROLES)[number];

/** Formato del artefacto que devuelve la habilidad. */
export const SKILL_ARTIFACT_KINDS = ['xlsx', 'pdf', 'md', 'json'] as const;
export type SkillArtifactKind = (typeof SKILL_ARTIFACT_KINDS)[number];

export const ARTIFACT_MIME: Readonly<Record<SkillArtifactKind, string>> = Object.freeze({
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  md: 'text/markdown; charset=utf-8',
  json: 'application/json; charset=utf-8',
});

/** Un artefacto ya construido, con su integridad declarada. */
export interface SkillArtifact {
  readonly kind: SkillArtifactKind;
  /** Nombre de fichero sin ruta (lo compone el despachador, nunca el cliente). */
  readonly filename: string;
  readonly bytes: Uint8Array;
  /** SHA-256 de los bytes reales: permite auditar que no se alteró. */
  readonly sha256: string;
  readonly byteLength: number;
}

/** Paso procedural declarado (SKILL.md): se muestra en la UI antes de ejecutar. */
export interface SkillStep {
  readonly id: string;
  readonly label: string;
}

/**
 * Resultado de una ejecución. `mode` es la ley anti-fachada (AF-2):
 * `REAL` = bytes generados en esta petición; `SIMULADO` = maqueta con datos
 * sintéticos y `disclaimer` obligatorio.
 */
export interface SkillExecution {
  readonly skill: string;
  readonly title: string;
  readonly role: SkillRole;
  readonly mode: 'REAL' | 'SIMULADO';
  readonly probed: true;
  readonly checkedAt: string;
  readonly artifacts: readonly SkillArtifact[];
  /** Filas de resumen legibles por el CEO (no JSON crudo). */
  readonly summary: readonly { readonly label: string; readonly value: string }[];
  /** Evidencia forense del cálculo (qué constantes SSOT se aplicaron). */
  readonly evidence: readonly string[];
}

/** Manifest de un cartucho: lo que la UI pinta sin ejecutar nada. */
export interface SkillManifest {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly role: SkillRole;
  readonly artifactKind: SkillArtifactKind;
  readonly steps: readonly SkillStep[];
  /** Coste declarado en tokens de API externa. Siempre 0: es local. */
  readonly externalTokenCost: 0;
}

/** Entrada común: payload validado por cada habilidad con su propio Zod. */
export interface SkillRunContext {
  /** Timestamp ISO inyectado: mantiene el determinismo fuera del motor. */
  readonly now: string;
}

export interface SkillDefinition<TInput> {
  readonly manifest: SkillManifest;
  readonly input: z.ZodType<TInput>;
  readonly run: (input: TInput, context: SkillRunContext) => Promise<SkillExecution>;
}
