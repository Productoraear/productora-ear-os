/**
 * 🧠 CONSULTATION TYPES — CONTRATO MULTI-TURNO DEL CONCIERGE (ISOMÓRFICO)
 * ---------------------------------------------------------------------------
 * Módulo 100% libre de dependencias: puede importarse desde componentes
 * cliente (`EarConcierge.tsx`) sin arrastrar `node:crypto` ni el motor Astra.
 *
 * El motor server (`consultationMemory.ts`) mantiene un CERROJO DE PARIDAD en
 * compilación contra `AstraPhase` / `ObjectionType` del motor Astra (Zona Cero):
 * si la máquina de estados cambia allí, el build rompe aquí en vez de
 * desincronizarse en silencio.
 * ---------------------------------------------------------------------------
 */

/** Turno de conversación tal y como viaja por la red (dato NO confiable). */
export type ConversationRole = 'user' | 'assistant';

export interface ConversationTurn {
  readonly role: ConversationRole;
  readonly content: string;
}

/** Límites defensivos del hilo (anti-DoS de contexto y anti-inflación de tokens). */
export const MAX_HISTORY_TURNS: number = 12;
export const MAX_TURN_CHARS: number = 2000;

/** Tipología de evento detectada en lenguaje natural. */
export type EventType =
  | 'boda'
  | 'serenata'
  | 'cumpleaños'
  | 'festejo'
  | 'corporativo'
  | 'b2g'
  | 'vimume';

/** Contexto acústico declarado por el cliente (Ley 37/2003 del Ruido). */
export type AcousticEnvironment = 'exterior' | 'interior';

/** Fase de la máquina consultiva (gemela de `AstraPhase`, Zona Cero). */
export type ConsultationPhase =
  | 'DESCUBRIMIENTO'
  | 'COTIZACION'
  | 'MANEJO_OBJECIONES'
  | 'CIERRE_STRIPE';

/** Objeción comercial detectada (gemela de `ObjectionType`, Zona Cero). */
export type SalesObjection = 'PRECIO' | 'CONSULTA_FAMILIAR' | 'COMPARACION' | null;

/**
 * Slots del evento recordados entre turnos. Todos nullable: `null` significa
 * "el cliente todavía no lo ha dicho" (JAMÁS se rellena con datos inventados).
 */
export interface ConsultationSlots {
  readonly eventType: EventType | null;
  readonly fincaName: string | null;
  readonly city: string | null;
  readonly distanceKm: number | null;
  readonly dateIso: string | null;
  readonly dateLabel: string | null;
  readonly endHour: number | null;
  readonly pax: number | null;
  readonly environment: AcousticEnvironment | null;
  readonly budgetTotal: number | null;
  readonly acousticConcern: boolean;
  readonly closingIntent: boolean;
}

/** Estado consultivo devuelto al cliente para persistir el hilo. */
export interface ConsultationSnapshot {
  readonly phase: ConsultationPhase;
  readonly objection: SalesObjection;
  readonly nextQuestion: string;
  readonly slots: ConsultationSlots;
  readonly turnCount: number;
}

/** Slots vacíos canónicos (primer turno de un hilo nuevo). */
export const EMPTY_CONSULTATION_SLOTS: ConsultationSlots = Object.freeze({
  eventType: null,
  fincaName: null,
  city: null,
  distanceKm: null,
  dateIso: null,
  dateLabel: null,
  endHour: null,
  pax: null,
  environment: null,
  budgetTotal: null,
  acousticConcern: false,
  closingIntent: false,
});
