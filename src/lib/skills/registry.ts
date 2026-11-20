/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · REGISTRO ÚNICO DEL DESPACHADOR
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de cartuchos, igual que `admin-navigation.ts` lo es de la
 * navegación: el despachador, la ruta HTTP, la herramienta MCP y el rack del
 * CEO leen de aquí. Dar de alta una habilidad la publica en los cuatro sitios.
 *
 * Regla de admisión: un cartucho sólo entra si su `run` es PURO respecto a la
 * red (cero llamadas a APIs de pago) y devuelve bytes reales con su SHA-256.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { SkillDefinition } from './skill-contract';
import type { SkillArtifactKind, SkillManifest } from './skill-contract';

import { liquidationSplitSkill } from './skills/liquidation-split';
import { lcspContractSkill } from './skills/lcsp-contract';
import { providerDossierSkill } from './skills/provider-dossier';
import { forensicAuditSkill } from './skills/forensic-audit';

/** Unión discriminada de todos los cartuchos disponibles. */
export type AnySkillDefinition =
  | typeof liquidationSplitSkill
  | typeof lcspContractSkill
  | typeof providerDossierSkill
  | typeof forensicAuditSkill;

/**
 * Registro ordenado por valor de negocio: primero el dinero, después el
 * contrato, después el cierre comercial y por último la auditoría.
 */
export const SKILL_REGISTRY: readonly SkillDefinition<unknown>[] = [
  liquidationSplitSkill as SkillDefinition<unknown>,
  lcspContractSkill as SkillDefinition<unknown>,
  providerDossierSkill as SkillDefinition<unknown>,
  forensicAuditSkill as SkillDefinition<unknown>,
];

/** Manifiestos públicos: lo que la UI pinta antes de ejecutar nada. */
export function listSkillManifests(): readonly SkillManifest[] {
  return SKILL_REGISTRY.map((skill) => skill.manifest);
}

/** Búsqueda por identificador estable. */
export function findSkill(id: string): SkillDefinition<unknown> | null {
  return SKILL_REGISTRY.find((skill) => skill.manifest.id === id) ?? null;
}

/** ¿El formato delegado está admitido? Guard contra ids inventados. */
export function isSkillArtifactKind(value: string): value is SkillArtifactKind {
  return value === 'xlsx' || value === 'pdf' || value === 'md' || value === 'json';
}
