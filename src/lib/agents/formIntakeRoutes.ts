/**
 * 🗺️ TABLA DE RUTAS FORMULARIO → FLOTA (fuente única, cero hardcode disperso)
 * ----------------------------------------------------------------------------
 * Cada superficie de captación declara:
 *   - agente de entrada (el que cualifica y despacha),
 *   - cadena de especialistas que aportan cálculo real (SSOT),
 *   - contexto acústico por defecto (Ley 37/2003),
 *   - campos obligatorios para poder cualificar.
 *
 * Los `AgentId` se validan contra `OMEGA_FLEET_ROSTER` por
 * `scripts/audit_form_agent_bridge.ts` (0 agentes fantasma).
 * ----------------------------------------------------------------------------
 */
import type { AgentId } from './agentBus';
import type { AcousticContext } from './pricing';
import type { IntakeFormType } from './formIntakeTypes';

/** Campo de `IntakeFields` que una ruta exige sí o sí. */
export type IntakeFieldKey =
  | 'clientName'
  | 'clientPhone'
  | 'clientEmail'
  | 'eventDate'
  | 'eventLocation'
  | 'pax'
  | 'providerId'
  | 'taxId';

export interface IntakeRouteStep {
  readonly agent: AgentId;
  readonly intent: string;
}

export interface IntakeRoute {
  readonly formType: IntakeFormType;
  readonly label: string;
  readonly entryAgent: AgentId;
  readonly entryIntent: string;
  /** Especialistas que se invocan después del entry (máx. 2: presupuesto del bus). */
  readonly chain: readonly IntakeRouteStep[];
  readonly context: AcousticContext;
  readonly requiredFields: readonly IntakeFieldKey[];
  /** ¿El formulario produce cotización económica SSOT? */
  readonly quotes: boolean;
  /** Titular del recibo mostrado al usuario. */
  readonly headline: string;
}

export const INTAKE_ROUTES: Readonly<Record<IntakeFormType, IntakeRoute>> = Object.freeze({
  booking_request: {
    formType: 'booking_request',
    label: 'Solicitud de reserva a proveedor',
    entryAgent: 'lead-intake-dispatcher',
    entryIntent: 'form_booking_request',
    chain: [
      { agent: 'logistics-pricer', intent: 'form_quote' },
      { agent: 'acoustic-rider-guard', intent: 'form_rider' },
    ],
    context: 'boda_exterior',
    requiredFields: ['clientName', 'clientPhone', 'eventLocation', 'pax'],
    quotes: true,
    headline: 'Lead cualificado y despachado al clúster n8n',
  },
  quote_request: {
    formType: 'quote_request',
    label: 'Petición de presupuesto',
    entryAgent: 'lead-intake-dispatcher',
    entryIntent: 'form_quote_request',
    chain: [
      { agent: 'logistics-pricer', intent: 'form_quote' },
      { agent: 'route-optimizer', intent: 'form_route' },
    ],
    context: 'festejo',
    requiredFields: ['clientName', 'clientPhone', 'eventLocation'],
    quotes: true,
    headline: 'Presupuesto calculado con el motor SSOT',
  },
  lead_capture: {
    formType: 'lead_capture',
    label: 'Captura de lead / dossier',
    entryAgent: 'lead-intake-dispatcher',
    entryIntent: 'form_lead_capture',
    chain: [{ agent: 'cross-sell-orchestrator', intent: 'form_cross_sell' }],
    context: 'solista',
    requiredFields: ['clientName'],
    quotes: false,
    headline: 'Lead registrado con mapa de venta cruzada',
  },
  provider_claim: {
    formType: 'provider_claim',
    label: 'Reclamo de ficha de proveedor',
    entryAgent: 'vendor-compliance-auditor',
    entryIntent: 'form_provider_claim',
    chain: [{ agent: 'venue-profiler', intent: 'form_venue_profile' }],
    context: 'boda_exterior',
    requiredFields: ['clientName', 'clientPhone', 'providerId'],
    quotes: false,
    headline: 'Ficha auditada bajo doctrina de dato verificado',
  },
  artist_application: {
    formType: 'artist_application',
    label: 'Alta de artista',
    entryAgent: 'artist-scout',
    entryIntent: 'form_artist_application',
    chain: [{ agent: 'artist-career-manager', intent: 'form_artist_roadmap' }],
    context: 'solista',
    requiredFields: ['clientName', 'clientEmail'],
    quotes: false,
    headline: 'Artista clasificado y hoja de ruta 360° emitida',
  },
  finca_alliance: {
    formType: 'finca_alliance',
    label: 'Alianza con finca / recinto',
    entryAgent: 'finca-negotiator',
    entryIntent: 'form_finca_alliance',
    chain: [{ agent: 'venue-profiler', intent: 'form_venue_profile' }],
    context: 'boda_exterior',
    requiredFields: ['clientName', 'clientPhone', 'eventLocation'],
    quotes: true,
    headline: 'Alianza de recinto negociada y perfilada',
  },
  vimume_clinic: {
    formType: 'vimume_clinic',
    label: 'Sesión VIMUME / centro socio-sanitario',
    entryAgent: 'vimume-protocol-sentinel',
    entryIntent: 'form_vimume_clinic',
    chain: [{ agent: 'clinical-report-generator', intent: 'form_vimume_report' }],
    context: 'vimume_senior',
    requiredFields: ['clientName', 'clientEmail'],
    quotes: false,
    headline: 'Protocolo 40 Hz validado e informe clínico emitido',
  },
  gift_serenata: {
    formType: 'gift_serenata',
    label: 'Serenata digital / encargo emocional',
    entryAgent: 'cross-sell-orchestrator',
    entryIntent: 'form_gift_serenata',
    chain: [{ agent: 'acoustic-rider-guard', intent: 'form_rider' }],
    context: 'solista',
    requiredFields: ['clientName', 'clientPhone'],
    quotes: true,
    headline: 'Encargo perfilado con rider y upsells reales',
  },
});

export const INTAKE_FORM_TYPES: readonly IntakeFormType[] = Object.freeze(
  Object.keys(INTAKE_ROUTES) as IntakeFormType[],
);

export function isIntakeFormType(value: unknown): value is IntakeFormType {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(INTAKE_ROUTES, value);
}
