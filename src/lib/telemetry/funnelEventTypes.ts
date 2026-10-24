/**
 * 🛰️ FUNNEL EVENT TYPES (S-CLASS · FUENTE ÚNICA DE EVENTOS DE CONVERSIÓN)
 * ----------------------------------------------------------------------------
 * Tipos puros compartidos entre el tracker de cliente y el endpoint de ingesta.
 * Mantener en sincronía 1:1 con el enum `FunnelEventType` de prisma/schema.prisma.
 * Módulo neutro: no importa Prisma ni React (sin side-effects).
 * ----------------------------------------------------------------------------
 */

export const FUNNEL_EVENT_NAMES = [
  'FUNNEL_STARTED',
  'STEP_REACHED',
  'QUOTE_VIEWED',
  'LEAD_SUBMITTED',
  'DEPOSIT_INITIATED',
  'DEPOSIT_CONFIRMED',
  'DEPOSIT_ERROR',
  'FUNNEL_ABANDONED',
] as const;

export type FunnelEventName = (typeof FUNNEL_EVENT_NAMES)[number];

/** Eventos que representan una conversión comercial (disparan despacho n8n). */
export const CONVERSION_EVENT_NAMES: readonly FunnelEventName[] = [
  'LEAD_SUBMITTED',
  'DEPOSIT_INITIATED',
  'DEPOSIT_CONFIRMED',
] as const;

export function isConversionEvent(name: FunnelEventName): boolean {
  return (CONVERSION_EVENT_NAMES as readonly string[]).includes(name);
}
