/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCIERGE POLICY — POLÍTICA DURA DEL AGENTE SOBERANO FRONT-FACING (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Módulo PURO (cero `node:fs`, cero `next/*`, cero red). Lo consumen la capa
 * de herramientas MCP, el harness de verificación y el route handler.
 *
 * DOCTRINA QUE CODIFICA (`.clinerules` §3 AF y §6 SEC):
 *  · AF-1: toda salida declara `probed`, `source`, `mode`, `checkedAt`. Nunca
 *          hay "verde por defecto".
 *  · AF-2: un motor con datos sintéticos DEBE declararlo (`mode:"SIMULADO"`).
 *  · SEC-3: los secretos jamás viajan al cliente: la política se evalúa en el
 *          servidor y lo único que sale es un veredicto booleano + motivo.
 *  · JUR-1 / anti-picaresca: un teléfono de proveedor no publicable NUNCA se
 *          escribe en la respuesta del agente; se enmascara.
 *
 * CERO CIFRAS DE NEGOCIO AQUÍ: el umbral de escalado humano es un parámetro
 * de POLÍTICA (no un precio del SSOT), y la centralita se toma del SSOT.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Envoltorio de honestidad (AF-1 / AF-2)                                      */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Origen físico del dato devuelto por una herramienta. */
export type ToolSource = 'live' | 'static';

/** Modo del motor. `SIMULADO` obliga a acompañar `simulationReason`. */
export type ToolMode = 'REAL' | 'SIMULADO';

/** Vocabulario CERRADO de estado (EP-2). Cualquier otra palabra es fraude. */
export type EvidenceStatus = 'VERIFICADO' | 'SOSPECHOSO' | 'FACHADA' | 'SIN_EVIDENCIA';

/**
 * Envoltorio obligatorio de toda respuesta de herramienta.
 * No existe una respuesta de herramienta válida sin estos cuatro campos.
 */
export interface ToolEnvelope<T> {
  readonly ok: boolean;
  readonly probed: true;
  readonly source: ToolSource;
  readonly mode: ToolMode;
  readonly checkedAt: string;
  /** SHA-256 del payload determinista: prueba de no-alteración (EP-1). */
  readonly evidenceSha256: string;
  /** Motivo declarado cuando `mode === 'SIMULADO'` (AF-2). */
  readonly simulationReason: string | null;
  readonly data: T;
  /** Error tipado cuando `ok === false`. Nunca oculta un fallo con `data` vacía. */
  readonly error: string | null;
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Escalado humano fail-closed (regla de cierre nº3 del Agente Soberano)       */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Importe (en euros) a partir del cual el agente NO improvisa y transfiere el
 * control a la dirección humana. Es un umbral de POLÍTICA COMERCIAL, no un
 * precio del SSOT: por eso vive aquí y no en `ear-os-ssot.ts` (INV-10 intacto).
 */
export const HUMAN_HANDOFF_THRESHOLD_EUR: number = 5000;

/** Prefijo E.164 canónico de la línea de centralita, sin símbolos. */
const CENTRALITA_DIGITS: string = CENTRALITA_EAR_OS.replace(/\D/g, '');


export type HandoffReason =
  | 'NONE'
  | 'AMOUNT_ABOVE_THRESHOLD'
  | 'TECHNICAL_CUSTOMIZATION'
  | 'ACOUSTIC_REJECTION'
  | 'ENGINE_FAILURE';

export interface HandoffVerdict {
  /** `true` ⇒ el agente calla y cede el control a un humano. */
  readonly requiresHuman: boolean;
  readonly reason: HandoffReason;
  /** Línea pública de la dirección (SSOT). Solo cuando `requiresHuman`. */
  readonly humanPhone: string | null;
  /** Resumen estructurado que el humano recibe (nunca contiene secretos). */
  readonly handoffBrief: string;
}

export interface HandoffInput {
  readonly amountEur?: number | null;
  readonly technicalCustomization?: boolean;
  readonly acousticRejected?: boolean;
  readonly engineFailed?: boolean;
  readonly contextSummary?: string;
}

/**
 * Fail-closed: ante la duda, escala. Un agente que inventa un precio de
 * 12.000 € en lugar de pasar el control es una pérdida de facturación y un
 * riesgo jurídico (JUR-1), no una comodidad.
 */
export function evaluateHumanHandoff(input: HandoffInput): HandoffVerdict {
  const amount: number | null =
    typeof input.amountEur === 'number' && Number.isFinite(input.amountEur) ? input.amountEur : null;

  const brief = (reason: HandoffReason): HandoffVerdict => ({
    requiresHuman: true,
    reason,
    humanPhone: CENTRALITA_EAR_OS,
    handoffBrief:
      `Traspaso a dirección (${reason}). ` +
      (amount !== null ? `Importe en juego: ${amount.toFixed(2)} €. ` : '') +
      (input.contextSummary?.trim().length ? `Contexto: ${input.contextSummary.trim()}` : 'Sin contexto adicional.'),
  });

  if (input.engineFailed === true) return brief('ENGINE_FAILURE');
  if (input.acousticRejected === true) return brief('ACOUSTIC_REJECTION');
  if (amount !== null && amount > HUMAN_HANDOFF_THRESHOLD_EUR) return brief('AMOUNT_ABOVE_THRESHOLD');
  if (input.technicalCustomization === true) return brief('TECHNICAL_CUSTOMIZATION');

  return {
    requiresHuman: false,
    reason: 'NONE',
    humanPhone: null,
    handoffBrief: 'Cierre autónomo habilitado: dentro de política y con dato determinista.',
  };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Enmascarado de línea (anti-picaresca · JUR-1)                               */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Enmascara un teléfono dejando visibles 3 dígitos finales.
 * Devuelve `null` si no hay número: nunca inventa un marcador falso.
 *
 * La línea de centralita NUNCA se enmascara (es pública y es el canal oficial).
 */
export function maskPhone(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const digits: string = raw.replace(/\D/g, '');
  if (digits.length < 6) return null;
  if (digits === CENTRALITA_DIGITS) return CENTRALITA_EAR_OS;
  return `••• ••• ${digits.slice(-3)}`;
}

/**
 * Guardián de salida: detecta si un texto contiene la línea de un proveedor
 * que NO debe publicarse. El agente no puede "colar" un teléfono por copy.
 */
export function containsUnmaskedProviderPhone(text: string, providerPhone: string | null): boolean {
  if (typeof providerPhone !== 'string') return false;
  const digits: string = providerPhone.replace(/\D/g, '');
  if (digits.length < 9) return false;
  if (digits === CENTRALITA_DIGITS) return false;
  return text.replace(/\D/g, '').includes(digits);
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Presupuesto de contexto (INV-14: cero datos personales en logs/payloads)    */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Tope de caracteres del resumen que viaja al humano. */
export const MAX_HANDOFF_BRIEF_CHARS: number = 600;

/** Patrones de datos personales que jamás deben registrarse (INV-14). */
const PII_PATTERNS: readonly RegExp[] = [
  /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g, // email
  /\b\d{8}[A-HJ-NP-TV-Z]\b/gi, // DNI / NIE
  /\bES\d{22}\b/gi, // IBAN español
];

/**
 * Redacta PII de un texto antes de registrarlo o despacharlo (INV-14).
 * Trunca además al presupuesto de caracteres declarado.
 */
export function redactPii(text: string): string {
  if (typeof text !== 'string' || text.length === 0) return '';
  let out: string = text.slice(0, MAX_HANDOFF_BRIEF_CHARS);
  for (const pattern of PII_PATTERNS) {
    out = out.replace(pattern, '[REDACTADO]');
  }
  return out;
}
