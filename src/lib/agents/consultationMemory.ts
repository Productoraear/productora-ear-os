/**
 * 🧠 CONSULTATION MEMORY — MOTOR CONSULTIVO SOCRÁTICO MULTI-TURNO (S-CLASS)
 * ---------------------------------------------------------------------------
 * Erradica la AMNESIA ENTRE TURNOS del Concierge. Reconstruye los slots del
 * evento acumulando lo que el cliente ya dijo en turnos anteriores, clasifica
 * la fase de venta y dicta la SIGUIENTE PREGUNTA de mayor valor comercial.
 *
 * DOCTRINA:
 *  - Cero alucinación: un slot solo se rellena con evidencia textual del
 *    cliente. Si falta un dato, queda `null` y se pregunta; nunca se inventa.
 *  - Cero duplicidad de motores: los clasificadores `detectObjection` y
 *    `detectCloseIntent` se reutilizan del motor Astra (Zona Cero, solo lectura).
 *  - Cero cifras hardcodeadas: depósito y centralita salen del SSOT canónico.
 *
 * Server-only (Astra importa `node:crypto`). Desde el cliente, importar
 * únicamente `@/lib/agents/consultationTypes`.
 * ---------------------------------------------------------------------------
 */

import {
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { detectCloseIntent, detectObjection } from '@/lib/astra/astra-conversation-engine';
import type { AstraPhase, ObjectionType } from '@/lib/astra/astra-conversation-engine';
import { parseExplicitDate } from '@/lib/availability/findNextDate';
import { KNOWN_FINCAS, resolveCityDistance } from '@/lib/agents/geo';
import {
  EMPTY_CONSULTATION_SLOTS,
  MAX_HISTORY_TURNS,
  MAX_TURN_CHARS,
} from '@/lib/agents/consultationTypes';
import type {
  AcousticEnvironment,
  ConsultationPhase,
  ConsultationSlots,
  ConsultationSnapshot,
  ConversationTurn,
  EventType,
  SalesObjection,
} from '@/lib/agents/consultationTypes';

/* ================================================================== */
/* Cerrojo de paridad en compilación contra el motor Astra (Zona Cero) */
/* ================================================================== */

type MutuallyAssignable<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/** Si Astra renombra una fase, esta línea rompe el build (anti-deriva silenciosa). */
export const PHASE_PARITY_LOCK: MutuallyAssignable<AstraPhase, ConsultationPhase> = true;

/** Si Astra renombra una objeción, esta línea rompe el build. */
export const OBJECTION_PARITY_LOCK: MutuallyAssignable<ObjectionType, SalesObjection> = true;

/* ================================================================== */
/* Utilidades de saneado del hilo (dato NO confiable)                  */
/* ================================================================== */

const CONTROL_CHARS_RE: RegExp = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SPACES_RE: RegExp = /[ \t]+/g;
const ROLE_USER: string = 'user';
const ROLE_ASSISTANT: string = 'assistant';

/**
 * Sanea el historial recibido del cliente: descarta roles desconocidos, acota
 * longitud por turno y conserva únicamente los últimos `MAX_HISTORY_TURNS`.
 */
export function sanitizeHistory(raw: unknown): ConversationTurn[] {
  if (!Array.isArray(raw)) return [];

  const clean: ConversationTurn[] = [];
  for (const entry of raw as unknown[]) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as { role?: unknown; content?: unknown };
    const role: string = typeof record.role === 'string' ? record.role : '';
    if (role !== ROLE_USER && role !== ROLE_ASSISTANT) continue;
    if (typeof record.content !== 'string') continue;

    const content: string = record.content
      .replace(CONTROL_CHARS_RE, ' ')
      .replace(SPACES_RE, ' ')
      .trim()
      .slice(0, MAX_TURN_CHARS);
    if (content.length === 0) continue;

    clean.push({ role: role === ROLE_USER ? 'user' : 'assistant', content });
  }

  return clean.slice(-MAX_HISTORY_TURNS);
}

/* ================================================================== */
/* Extracción de evidencia (determinista, cero IA, cero invención)     */
/* ================================================================== */

const KM_RE: RegExp = /(\d{1,4})\s*(?:km|kms|kil[oó]metros?)\b/i;
const PAX_RE: RegExp = /(\d{1,4})\s*(?:pax|personas|invitad[oa]s?|comensales|asistentes)\b/i;
const END_HOUR_AT_RE: RegExp =
  /(?:a las|hasta las|termin(?:ando|ar)|acab(?:ando|ar))\s*(?:las\s*)?(\d{1,2})(?::(\d{2}))?/i;
const END_HOUR_TOKEN_RE: RegExp = /(\d{1,2}):(\d{2})\s*(?:h|hs|horas)?/i;
const END_HOUR_CONTEXT_RE: RegExp = /a las|hasta las|termin|acab|fin de fiesta|madrugada|hora de fin/i;
const BUDGET_RE: RegExp = /(\d{2,6})(?:[.,](\d{1,2}))?\s*(?:€|eur\b|euros?\b)/i;
const BUDGET_CONTEXT_RE: RegExp = /presupuesto|budget|gastar|dispongo|disponer|m[aá]ximo|tope/i;
const DEPOSIT_WORD_RE: RegExp = /dep[oó]sito|se[ñn]al|fianza/i;
const ACOUSTIC_CONCERN_RE: RegExp = /ruido|decibel|dba|sonido|bose|limitador|vecinos|ac[uú]stic/i;
const EXTERIOR_RE: RegExp = /exterior|jard[ií]n|terraza|aire libre|intemperie|patio|al fresco/i;
const INTERIOR_RE: RegExp = /interior|sal[oó]n|comedor|carpa|iglesia|bodega|indoor/i;

/** Patrones de tipología de evento, en orden de prioridad comercial. */
const EVENT_PATTERNS: readonly (readonly [EventType, RegExp])[] = [
  ['boda', /\bboda\b|\benlace\b|\bcasamiento\b|\bnovios?\b/i],
  ['serenata', /\bserenata\b|\bmariachi\b|\bma[ñn]anitas\b|\bbolero\b/i],
  ['cumpleaños', /\bcumplea[ñn]os\b|\baniversario\b|\bhomenaje\b/i],
  ['festejo', /\bfestejo\b|\bfiestas?\b|\bverbena\b|\bplaza\b|\bconcierto\b/i],
  ['corporativo', /\bempresa\b|\bcorporativ|\bconvenci[oó]n\b|\bincentivo\b|\bteam building\b/i],
  ['b2g', /\bayuntamiento\b|\blicitaci|\bb2g\b|\blcsp\b|\bcontrato menor\b/i],
  ['vimume', /\bvimume\b|\bresidencia\b|\bsenior\b|\balzheimer\b|\bgeri[aá]tric|\bcentro de d[ií]a\b/i],
];

function parseHour(candidate: string | undefined): number | null {
  if (!candidate) return null;
  const hour: number = Number(candidate);
  return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : null;
}

function extractEndHour(message: string): number | null {
  const atMatch: RegExpMatchArray | null = message.match(END_HOUR_AT_RE);
  if (atMatch) {
    const hour: number | null = parseHour(atMatch[1]);
    if (hour !== null) return hour;
  }
  if (END_HOUR_CONTEXT_RE.test(message)) {
    const tokenMatch: RegExpMatchArray | null = message.match(END_HOUR_TOKEN_RE);
    if (tokenMatch) {
      const hour: number | null = parseHour(tokenMatch[1]);
      if (hour !== null) return hour;
    }
  }
  return null;
}

function extractBudget(message: string): number | null {
  if (!BUDGET_CONTEXT_RE.test(message) || DEPOSIT_WORD_RE.test(message)) return null;
  const match: RegExpMatchArray | null = message.match(BUDGET_RE);
  if (!match) return null;
  const whole: number = Number(match[1]);
  const cents: string = match[2] ? `.${match[2]}` : '';
  const value: number = Number(`${whole}${cents}`);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Extrae los slots evidenciables de UN mensaje del cliente.
 * Todo lo que no aparezca literalmente en el texto queda `null`.
 */
export function extractSlots(message: string): ConsultationSlots {
  const lower: string = message.toLowerCase();

  const cityHit = resolveCityDistance(lower);
  const kmMatch: RegExpMatchArray | null = message.match(KM_RE);
  const paxMatch: RegExpMatchArray | null = message.match(PAX_RE);
  const explicitDate = parseExplicitDate(message);
  const fincaName: string | null =
    KNOWN_FINCAS.find((finca: string) => lower.includes(finca.toLowerCase())) ?? null;

  let eventType: EventType | null = null;
  for (const [type, pattern] of EVENT_PATTERNS) {
    if (pattern.test(message)) {
      eventType = type;
      break;
    }
  }

  let environment: AcousticEnvironment | null = null;
  if (EXTERIOR_RE.test(message)) environment = 'exterior';
  else if (INTERIOR_RE.test(message)) environment = 'interior';

  const paxValue: number = paxMatch ? Number(paxMatch[1]) : 0;

  return {
    eventType,
    fincaName,
    city: cityHit ? cityHit.city : null,
    distanceKm: kmMatch
      ? Math.max(0, Number(kmMatch[1]))
      : cityHit
        ? cityHit.distanceKm
        : null,
    dateIso: explicitDate ? explicitDate.dateIso : null,
    dateLabel: explicitDate ? explicitDate.formattedSpanish : null,
    endHour: extractEndHour(message),
    pax: paxValue > 0 && paxValue <= 100000 ? paxValue : null,
    environment,
    budgetTotal: extractBudget(message),
    acousticConcern: ACOUSTIC_CONCERN_RE.test(message),
    closingIntent: detectCloseIntent(message),
  };
}

/**
 * Fusiona dos fotografías de slots conservando el dato más reciente NO nulo.
 * Los flags booleanos son acumulativos (una vez declarados, se recuerdan).
 */
export function mergeSlots(
  previous: ConsultationSlots,
  next: ConsultationSlots,
): ConsultationSlots {
  return {
    eventType: next.eventType ?? previous.eventType,
    fincaName: next.fincaName ?? previous.fincaName,
    city: next.city ?? previous.city,
    distanceKm: next.distanceKm ?? previous.distanceKm,
    dateIso: next.dateIso ?? previous.dateIso,
    dateLabel: next.dateLabel ?? previous.dateLabel,
    endHour: next.endHour ?? previous.endHour,
    pax: next.pax ?? previous.pax,
    environment: next.environment ?? previous.environment,
    budgetTotal: next.budgetTotal ?? previous.budgetTotal,
    acousticConcern: previous.acousticConcern || next.acousticConcern,
    closingIntent: previous.closingIntent || next.closingIntent,
  };
}

/**
 * Reconstruye la memoria del hilo: replaya los turnos del CLIENTE (los del
 * asistente se ignoran para no contaminar los slots con datos generados por
 * el modelo) y fusiona el mensaje actual al final.
 */
export function collectSlots(
  history: readonly ConversationTurn[],
  currentMessage: string,
): ConsultationSlots {
  let slots: ConsultationSlots = EMPTY_CONSULTATION_SLOTS;
  for (const turn of history) {
    if (turn.role !== 'user') continue;
    slots = mergeSlots(slots, extractSlots(turn.content));
  }
  return mergeSlots(slots, extractSlots(currentMessage));
}




/* ================================================================== */
/* Síntesis para el prompt (bloque de memoria legible por el LLM)      */
/* ================================================================== */

/** Etiquetas humanas por tipología de evento. */
export const EVENT_LABEL: Readonly<Record<EventType, string>> = Object.freeze({
  boda: 'boda',
  serenata: 'serenata / mariachi',
  cumpleaños: 'cumpleaños o aniversario',
  festejo: 'festejo popular o concierto',
  corporativo: 'evento corporativo',
  b2g: 'licitación B2G de ayuntamiento',
  vimume: 'sesión VIMUME en centro senior',
});

/** Etiquetas de objeción para el prompt consultivo. */
export const OBJECTION_LABEL: Readonly<Record<Exclude<SalesObjection, null>, string>> = Object.freeze({
  PRECIO: 'sensibilidad al precio',
  CONSULTA_FAMILIAR: 'necesita consultarlo en familia',
  COMPARACION: 'está comparando con la competencia',
});

/** Resumen en una línea de lo ya confirmado (vacío si no hay nada). */
export function summarizeSlots(slots: ConsultationSlots): string {
  const parts: string[] = [];
  if (slots.eventType) parts.push(EVENT_LABEL[slots.eventType]);
  if (slots.fincaName) parts.push(`en ${slots.fincaName}`);
  else if (slots.city) parts.push(`en ${slots.city}`);
  if (slots.dateLabel) parts.push(`el ${slots.dateLabel}`);
  if (slots.pax !== null) parts.push(`para ${slots.pax} invitados`);
  if (slots.endHour !== null) parts.push(`con fin previsto a las ${slots.endHour}:00`);
  if (slots.environment) parts.push(`en ${slots.environment}`);
  if (slots.budgetTotal !== null) parts.push(`con presupuesto declarado de ${slots.budgetTotal} €`);
  return parts.join(' ');
}

/**
 * Construye el bloque "memoria de la conversación" que se inyecta en el
 * system prompt. Solo lista hechos declarados por el cliente: cero invención.
 */
export function buildConversationMemoryBlock(slots: ConsultationSlots): string {
  const lines: string[] = [];
  if (slots.eventType) lines.push(`- Tipo de evento: ${EVENT_LABEL[slots.eventType]}`);
  if (slots.fincaName) lines.push(`- Recinto / finca mencionado: ${slots.fincaName}`);
  if (slots.city) {
    lines.push(
      slots.distanceKm !== null
        ? `- Localidad: ${slots.city} (${slots.distanceKm} km desde el Hub Méntrida)`
        : `- Localidad: ${slots.city}`,
    );
  }
  if (slots.dateLabel) lines.push(`- Fecha solicitada por el cliente: ${slots.dateLabel}`);
  if (slots.endHour !== null) lines.push(`- Hora de fin prevista: ${slots.endHour}:00`);
  if (slots.pax !== null) lines.push(`- Aforo declarado: ${slots.pax} invitados`);
  if (slots.environment) lines.push(`- Ambiente: ${slots.environment}`);
  if (slots.budgetTotal !== null) lines.push(`- Presupuesto declarado por el cliente: ${slots.budgetTotal} €`);
  if (slots.acousticConcern) lines.push('- El cliente ha mostrado preocupación por el ruido / la acústica.');
  if (slots.closingIntent) lines.push('- El cliente ya ha expresado intención de reservar o bloquear fecha.');
  return lines.length > 0 ? lines.join('\n') : '- Sin datos confirmados todavía: es un cliente nuevo.';
}

/**
 * Siguiente pregunta de mayor valor comercial (una sola por turno).
 * Prioriza el dato que desbloquea la cotización exacta y el cierre.
 */
export function nextBestQuestion(slots: ConsultationSlots): string {
  if (slots.eventType === null) {
    return '¿Qué vais a celebrar exactamente (boda, serenata, cumpleaños, festejo o evento de empresa)?';
  }
  if (slots.city === null && slots.fincaName === null) {
    return '¿En qué localidad o recinto será? Con eso calculo el desplazamiento exacto desde el Hub Méntrida.';
  }
  if (slots.dateIso === null) {
    return '¿Qué fecha tenéis en mente? Compruebo la agenda real y os confirmo al instante.';
  }
  if (slots.pax === null) {
    return '¿Cuántos invitados calculáis? Lo necesito para dimensionar el rider acústico.';
  }
  if (slots.endHour === null) {
    return '¿A qué hora os gustaría terminar? Si se alarga de madrugada se activa el protocolo de nocturnidad.';
  }
  if (slots.environment === null) {
    return '¿Será al aire libre o en interior? Cambia por completo el diseño acústico conforme a la Ley 37/2003.';
  }
  return `Con esto ya tengo todo para cerrar. ¿Bloqueamos la fecha con el depósito de ${DEPOSITO_STRIPE_EUR} € (100% deducible del total) o preferís que os llame la dirección al ${CENTRALITA_EAR_OS}?`;
}

/**
 * Máquina de estados consultiva: clasifica la fase de venta y la objeción.
 * Reutiliza los clasificadores del motor Astra (Zona Cero, sin modificarlo).
 */
export function resolveConsultationState(
  slots: ConsultationSlots,
  history: readonly ConversationTurn[],
  currentMessage: string,
): ConsultationSnapshot {
  const objection: SalesObjection = detectObjection(currentMessage);

  let phase: ConsultationPhase;
  if (detectCloseIntent(currentMessage)) {
    phase = 'CIERRE_STRIPE';
  } else if (objection !== null) {
    phase = 'MANEJO_OBJECIONES';
  } else if (slots.dateIso !== null || slots.city !== null || slots.pax !== null) {
    phase = 'COTIZACION';
  } else {
    phase = 'DESCUBRIMIENTO';
  }

  return {
    phase,
    objection,
    nextQuestion: nextBestQuestion(slots),
    slots,
    turnCount: history.length + 1,
  };
}
