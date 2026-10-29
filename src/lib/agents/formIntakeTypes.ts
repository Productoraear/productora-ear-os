/**
 * 🧾 CONTRATO DE INGESTA DE FORMULARIOS → FLOTA Ω (S-CLASS)
 * ----------------------------------------------------------------------------
 * Tipos compartidos entre cliente (formularios React) y servidor (motor +
 * `/api/agents/intake`). Este fichero NO importa nada de Node: puede viajar al
 * bundle del navegador sin arrastrar `node:fs` ni secretos.
 *
 * Doctrina:
 *  - El formulario nunca habla con n8n ni con Stripe: habla con la flota.
 *  - La respuesta NO devuelve datos personales (solo veredicto + trazas), de
 *    modo que un XSS/reflejo no puede exfiltrar el teléfono del cliente.
 * ----------------------------------------------------------------------------
 */
import type { AgentId } from './agentBus';

/** Superficies de captación reales del ecosistema EAR OS. */
export type IntakeFormType =
  | 'booking_request'
  | 'quote_request'
  | 'lead_capture'
  | 'provider_claim'
  | 'artist_application'
  | 'finca_alliance'
  | 'vimume_clinic'
  | 'gift_serenata';

/** Acción de cierre que el recibo ofrece al usuario (siempre con destino real). */
export type IntakeNextActionKind = 'stripe' | 'whatsapp';

/**
 * Campos aceptados. Todos opcionales a nivel de tipo: el motor exige los
 * obligatorios según la ruta (`INTAKE_ROUTES[formType].requiredFields`).
 */
export interface IntakeFields {
  readonly clientName?: string;
  readonly clientPhone?: string;
  readonly clientEmail?: string;
  /** ISO-8601 (`YYYY-MM-DD` o fecha completa). */
  readonly eventDate?: string;
  readonly eventLocation?: string;
  /** Distancia declarada (km). Si falta, se resuelve por población o por defecto. */
  readonly distanceKm?: number;
  readonly pax?: number;
  readonly budgetEur?: number;
  /** Hora de fin 0-23 (para suplemento de hotel de madrugada). */
  readonly endHour?: number;
  readonly providerId?: string;
  readonly providerName?: string;
  readonly category?: string;
  readonly company?: string;
  readonly taxId?: string;
  readonly website?: string;
  readonly service?: string;
  readonly message?: string;
  readonly sourcePath?: string;
  readonly locale?: string;
  // ── Vertical Artist Career / VIMUME ──
  readonly artistName?: string;
  readonly discipline?: string;
  readonly socialFollowers?: number;
  readonly monthlyListeners?: number;
  readonly catalogSize?: number;
  readonly sessions?: number;
}

export interface IntakeRequest {
  readonly formType: IntakeFormType;
  readonly fields: IntakeFields;
  /** Clave de idempotencia del cliente (una por apertura de formulario). */
  readonly idempotencyKey?: string;
}

/** Un salto real del bus: qué agente habló, con qué intención y qué contestó. */
export interface IntakeStep {
  readonly agent: AgentId;
  readonly intent: string;
  readonly ok: boolean;
  readonly summary: string;
}

/** Cotización SSOT derivada del formulario (no estimación de marketing). */
export interface IntakeQuote {
  readonly distanceKm: number;
  readonly distanceSource: 'explicit' | 'city' | 'category' | 'default';
  readonly city: string | null;
  readonly context: string;
  readonly base: number;
  readonly logistica: number;
  readonly hotel: number;
  readonly total: number;
  readonly deposito: number;
  readonly restoTrasDeposito: number;
  readonly minDba: number;
  readonly maxDba: number;
  readonly watts: number;
}

export interface IntakeNextAction {
  readonly kind: IntakeNextActionKind;
  readonly label: string;
  readonly href: string;
}

/** Resultado canónico: lo único que el navegador recibe del servidor. */
export interface FormIntakeResult {
  readonly intakeId: string;
  readonly formType: IntakeFormType;
  readonly qualified: boolean;
  readonly score: number;
  readonly agentUsed: AgentId;
  readonly headline: string;
  readonly steps: readonly IntakeStep[];
  readonly quote: IntakeQuote | null;
  readonly nextAction: IntakeNextAction;
  /** `true` si esta misma petición ya se procesó (idempotencia real). */
  readonly duplicate: boolean;
  /** `true` si la traza quedó registrada en el ledger append-only. */
  readonly ledgered: boolean;
  readonly timestamp: string;
}
