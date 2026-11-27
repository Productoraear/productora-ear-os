/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🧠 COACHES DE IA — CONTRATO CANÓNICO DE LA TRÍADA + CUARTETO (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina: `VELOCITY_MEDIA_S_CLASS`. Cuatro roles de coaching que validan el
 * output de cualquier agente antes de que toque al cliente o al CEO:
 *   · STRATEGIC_COACH     → Suelo 350 € · Techo B2G 14.250 € · Split 80/10/10 ·
 *                           Exclusividad 100 km.
 *   · TACTICAL_COACH      → Tareas atómicas · Gates CI (Exit Code 0) ·
 *                           contratos EARS · `tasks_queue.json`.
 *   · INSIGHTS_COACH      → Telemetría de embudo · CLS/Lighthouse · Clarity.
 *   · COMMUNICATION_COACH → Storyselling Velocity · desarticulación de
 *                           objeciones · WhatsApp Centralita.
 *
 * Capa PURA: 0 I/O, importable tanto desde servidor como desde componentes
 * `'use client'` sin arrastrar `node:*` ni secretos (mismo patrón que
 * `consultationTypes.ts` / `formIntakeTypes.ts`).
 * Los importes y el teléfono nacen SIEMPRE del SSOT inmutable: aquí no se
 * teclea ninguna cifra canónica (INV-01, INV-02, INV-04, INV-12).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  SOLISTA_KM_INCLUIDOS,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

/** Los cuatro roles del cuarteto de coaches de IA de EAR OS. */
export type AICoachRole =
  | 'STRATEGIC_COACH' // Foco: Suelo tarifario 350€, Techo B2G 14.250€, Split 80/10/10, Exclusividad 100km
  | 'TACTICAL_COACH' // Foco: Tareas atómicas, CI/CD Gates (Exit 0), contratos EARS, tasks_queue.json
  | 'INSIGHTS_COACH' // Foco: Telemetría de embudo, auditoría CLS/Lighthouse, analítica Clarity
  | 'COMMUNICATION_COACH'; // Foco: Storyselling Velocity, desarticulación de objeciones, WhatsApp Centralita

/** Doctrina única del cuarteto (etiqueta cerrada, comparable en compilación). */
export const COACH_DOCTRINE = 'VELOCITY_MEDIA_S_CLASS' as const;
export type CoachDoctrine = typeof COACH_DOCTRINE;

/** Roster canónico congelado (orden estable y determinista). */
export const AI_COACH_ROLES: readonly AICoachRole[] = Object.freeze([
  'STRATEGIC_COACH',
  'TACTICAL_COACH',
  'INSIGHTS_COACH',
  'COMMUNICATION_COACH',
]);

/** Cardinalidad del cuarteto (guard estructural contra roster incompleto). */
export const AI_COACH_COUNT: number = AI_COACH_ROLES.length;

/** Veredicto de una validación de output contra la doctrina del coach. */
export interface AICoachVerdict {
  readonly isCompliant: boolean;
  readonly feedback?: string;
}

/**
 * Contrato canónico que todo coach de IA debe satisfacer.
 * La firma `validateOutput` es intencionadamente síncrona y pura para poder
 * ejecutarse en el Edge y en el navegador sin efectos colaterales.
 */
export interface AICoachContract {
  role: AICoachRole;
  doctrine: 'VELOCITY_MEDIA_S_CLASS';
  coreBelief: string;
  validateOutput: (message: string) => { isCompliant: boolean; feedback?: string };
}

/* ── Utilidades puras de parsing (sin I/O, sin estado) ────────────────────── */

/** Convierte un literal decimal en formato ES (`14.250,00` / `0,05`) a número. */
function toNumber(raw: string): number {
  return Number(raw.replace(/\./g, '').replace(',', '.'));
}

/** Extrae todos los importes en euros de un mensaje. */
function extractEuroAmounts(message: string): readonly number[] {
  return [...message.matchAll(/(\d+(?:[.,]\d+)?)\s*€/g)].map((match) => toNumber(match[1]));
}

/** Etiqueta canónica del Split Soberano derivada del SSOT (`80/10/10`). */
const SPLIT_LABEL: string = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(
  SPLIT_SOBERANO.earOs * 100,
)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;

/** Dígitos de la Centralita canónica (comparación robusta a formato). */
const CENTRALITA_DIGITS: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

/** Empaqueta la lista de violaciones en un veredicto tipado. */
function toVerdict(violations: readonly string[]): AICoachVerdict {
  return violations.length === 0
    ? { isCompliant: true }
    : { isCompliant: false, feedback: violations.join(' · ') };
}

/** Foco operativo de cada rol (traducción directa de la directiva del CEO). */
export const COACH_ROLE_FOCUS: Readonly<Record<AICoachRole, string>> = Object.freeze({
  STRATEGIC_COACH:
    `Suelo tarifario ${TARIFA_BASE_SOLISTA_EUR} €, techo B2G ${AJUSTE_PREVENTIVO_B2G_EUR} €, ` +
    `Split ${SPLIT_LABEL}, exclusividad ${SOLISTA_KM_INCLUIDOS} km`,
  TACTICAL_COACH: 'Tareas atómicas, gates CI (Exit Code 0), contratos EARS, tasks_queue.json',
  INSIGHTS_COACH: 'Telemetría de embudo, auditoría CLS/Lighthouse, analítica Clarity',
  COMMUNICATION_COACH: `Storyselling Velocity, desarticulación de objeciones, WhatsApp ${CENTRALITA_EAR_OS}`,
});

/* ── Guardas doctrinales por rol (puras y deterministas) ──────────────────── */

/** STRATEGIC: protege suelo, techo B2G, split y exclusividad. */
function strategicGuard(message: string): AICoachVerdict {
  const violations: string[] = [];

  // 1. Suelo tarifario (INV-01).
  const floor = message.match(
    /(suelo|tarifa\s+base|tarifa\s+m[ií]nima|precio\s+m[ií]nimo|base\s+m[ií]nima)[^\d]{0,24}(\d{1,3}(?:[.,]\d+)?)/i,
  );
  if (floor && toNumber(floor[2]) < TARIFA_BASE_SOLISTA_EUR) {
    violations.push(`Suelo vulnerado: ${floor[2]} € < ${TARIFA_BASE_SOLISTA_EUR} €`);
  }

  // 2. Techo B2G (INV-04): sólo si el mensaje opera en territorio de contratación pública.
  if (/\b(b2g|lcsp|contrato\s+menor|licitaci[oó]n|ayuntamiento|festejos?\s+populares?)\b/i.test(message)) {
    for (const amount of extractEuroAmounts(message)) {
      if (amount > AJUSTE_PREVENTIVO_B2G_EUR) {
        violations.push(`Techo B2G excedido: ${amount} € > ${AJUSTE_PREVENTIVO_B2G_EUR} €`);
      }
    }
  }

  // 3. Split Soberano (INV-02).
  const split = message.match(/(\d{1,3})\s*\/\s*(\d{1,3})\s*\/\s*(\d{1,3})/);
  if (split) {
    const found = `${split[1]}/${split[2]}/${split[3]}`;
    if (found !== SPLIT_LABEL) violations.push(`Split inválido: ${found} ≠ ${SPLIT_LABEL}`);
  } else if (/split|reparto/i.test(message)) {
    violations.push(`Split citado sin declarar el ratio canónico ${SPLIT_LABEL}`);
  }

  // 4. Exclusividad de kilómetros (INV-01).
  if (/exclusiv|incluid/i.test(message)) {
    const km = message.match(/(\d{1,4})\s*km/i);
    if (km && toNumber(km[1]) !== SOLISTA_KM_INCLUIDOS) {
      violations.push(`Exclusividad inválida: ${km[1]} km ≠ ${SOLISTA_KM_INCLUIDOS} km`);
    }
  }

  return toVerdict(violations);
}

/** TACTICAL: protege el arnés CI, el stack npm y la evidencia ejecutable. */
function tacticalGuard(message: string): AICoachVerdict {
  const violations: string[] = [];

  const forbiddenPm = message.match(/\b(pnpm|yarn|bun)\b/i);
  if (forbiddenPm) violations.push(`Gestor prohibido: ${forbiddenPm[1]} (stack estricto npm)`);

  if (/:\s*any\b/.test(message)) violations.push('Tipo `any` implícito en ruta financiera (G-1)');

  const claimsDone = /\b(listo|completad|terminad|finalizad|cerrad|done|hecho)\b/i.test(message);
  const hasEvidence = /(exit\s*(code\s*)?0|typecheck|npm\s+run|harness|ledger|verificad|gate)/i.test(message);
  if (claimsDone && !hasEvidence) {
    violations.push('Se declara completado sin evidencia ejecutable (Exit Code 0 / gate)');
  }

  return toVerdict(violations);
}

/** INSIGHTS: protege los presupuestos de rendimiento y la trazabilidad de cifras. */
function insightsGuard(message: string): AICoachVerdict {
  const violations: string[] = [];

  const cls = message.match(/\bcls\b[^\d]{0,16}(0?[.,]\d+|\d+)/i);
  if (cls && toNumber(cls[1]) > 0.05) violations.push(`CLS ${cls[1]} > 0,05 (INV-11)`);

  const lcp = message.match(/\blcp\b[^\d]{0,16}(\d+(?:[.,]\d+)?)\s*s/i);
  if (lcp && toNumber(lcp[1]) > 2.5) violations.push(`LCP ${lcp[1]} s > 2,5 s (INV-11)`);

  const inp = message.match(/\binp\b[^\d]{0,16}(\d+)\s*ms/i);
  if (inp && toNumber(inp[1]) > 200) violations.push(`INP ${inp[1]} ms > 200 ms (INV-11)`);

  if (
    /\d+\s*%/.test(message) &&
    !/(clarity|lighthouse|telemetr|analytics|gsc|embudo|medido|sin_evidencia)/i.test(message)
  ) {
    violations.push('Cifra de embudo sin fuente trazable (SSOT / Clarity / Lighthouse)');
  }

  return toVerdict(violations);
}

/** COMMUNICATION: protege JUR-1/JUR-4 y el canal de contacto canónico (INV-12). */
function communicationGuard(message: string): AICoachVerdict {
  const violations: string[] = [];

  const brand = message.match(/\b(bodas\.net|uber|spotify|airbnb)\b/i);
  if (brand) violations.push(`Marca de terceros prohibida (JUR-4): ${brand[1]}`);

  if (/(rese[ñn]as?|testimonios?)\s+(fabricad|inventad|fals)/i.test(message)) {
    violations.push('Reseñas fabricadas prohibidas (JUR-1/JUR-4)');
  }

  if (/(whatsapp|tel[eé]fono|llama|ll[aá]manos|contacto)/i.test(message)) {
    if (!message.replace(/\D/g, '').includes(CENTRALITA_DIGITS)) {
      violations.push(`Canal de contacto sin Centralita canónica ${CENTRALITA_EAR_OS} (INV-12)`);
    }
  }

  return toVerdict(violations);
}

const GUARDS: Readonly<Record<AICoachRole, (message: string) => AICoachVerdict>> = Object.freeze({
  STRATEGIC_COACH: strategicGuard,
  TACTICAL_COACH: tacticalGuard,
  INSIGHTS_COACH: insightsGuard,
  COMMUNICATION_COACH: communicationGuard,
});

/** Creencia raíz de cada coach (texto derivado del SSOT, sin cifras tecleadas). */
const CORE_BELIEFS: Readonly<Record<AICoachRole, string>> = Object.freeze({
  STRATEGIC_COACH:
    `El suelo de ${TARIFA_BASE_SOLISTA_EUR} € es innegociable y la tarifa estándar de ` +
    `${TARIFA_ESTANDAR_SOLISTA_EUR} € incluye ${SOLISTA_KM_INCLUIDOS} km; el techo B2G ` +
    `${AJUSTE_PREVENTIVO_B2G_EUR} €, el Split ${SPLIT_LABEL} y el depósito ` +
    `${DEPOSITO_STRIPE_EUR} € deducible no se relajan jamás.`,
  TACTICAL_COACH:
    'Ninguna tarea está hecha sin Exit Code 0: se pica atómico, el arnés CI queda en verde y el hito se anexa al ledger.',
  INSIGHTS_COACH:
    'Lo que no se mide no se mejora: CLS ≤ 0,05 · LCP ≤ 2,5 s · INP ≤ 200 ms y cada cifra se rastrea a su SSOT.',
  COMMUNICATION_COACH:
    `Storyselling Velocity: se desarticula la objeción con prueba real y se cierra el paso en WhatsApp ${CENTRALITA_EAR_OS}.`,
});

/** Construye el contrato ejecutable de un rol, con guarda de mensaje vacío. */
export function createAICoachContract(role: AICoachRole): AICoachContract {
  const guard = GUARDS[role];
  return {
    role,
    doctrine: COACH_DOCTRINE,
    coreBelief: CORE_BELIEFS[role],
    validateOutput: (message: string) => {
      if (typeof message !== 'string' || message.trim().length === 0) {
        return { isCompliant: false, feedback: 'Mensaje vacío: no hay output que validar contra la doctrina.' };
      }
      return guard(message);
    },
  };
}

/** Registro canónico del cuarteto (los 4 coaches con su validador activo). */
export const AI_COACHES: Readonly<Record<AICoachRole, AICoachContract>> = Object.freeze({
  STRATEGIC_COACH: createAICoachContract('STRATEGIC_COACH'),
  TACTICAL_COACH: createAICoachContract('TACTICAL_COACH'),
  INSIGHTS_COACH: createAICoachContract('INSIGHTS_COACH'),
  COMMUNICATION_COACH: createAICoachContract('COMMUNICATION_COACH'),
});

/** Evalúa un mensaje contra la doctrina del rol indicado (API de conveniencia). */
export function evaluateCoachCompliance(role: AICoachRole, message: string): AICoachVerdict {
  return AI_COACHES[role].validateOutput(message);
}
