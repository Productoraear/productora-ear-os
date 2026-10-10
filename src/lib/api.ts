export interface LeadData {
  type: 'artist_candidate' | 'business_audit' | 'fan_access';
  source: string;
  section: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface EventRequestData {
  type: 'event' | 'wedding';
  service: string;
  client_info: Record<string, unknown>;
  budget_range?: string;
  timestamp: string;
}

export interface QuoteData {
  type: string;
  amount: number;
  currency: string;
  concept?: string;
  breakdown: Record<string, unknown>;
  client_id?: string;
  timestamp: string;
}

export interface ApiSuccessResponse {
  success: true;
}

export interface LeadResponse extends ApiSuccessResponse {
  leadId: string;
}

export interface EventRequestResponse extends ApiSuccessResponse {
  requestId: string;
}

export interface QuoteResponse extends ApiSuccessResponse {
  quoteId: string;
}

export interface TelemetryResponse extends ApiSuccessResponse {}

export interface ApiService {
  submitLead: (lead: LeadData) => Promise<LeadResponse>;
  submitEventRequest: (request: EventRequestData) => Promise<EventRequestResponse>;
  submitQuote: (quote: QuoteData) => Promise<QuoteResponse>;
  trackEvent: (eventName: string, data: Record<string, unknown>) => Promise<TelemetryResponse>;
}

const BASE_URL = '/api';

const delay = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const generateLeadId = (): string =>
  `EAR-L-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

/**
 * Servicio API para el Ecosistema EAR
 * Maneja la persistencia de datos críticos de negocio.
 */
export const api: ApiService = {
  /**
   * Registra un nuevo lead (Candidaturas, Auditorías, Suscripciones)
   */
  submitLead: async (lead: LeadData): Promise<LeadResponse> => {
    console.log(`[API] Enviando Lead a ${BASE_URL}/leads`, lead);

    await delay(1200);

    // Aquí iría el fetch real:
    // const response = await fetch(`${BASE_URL}/leads`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(lead)
    // });
    // return response.json();

    return { success: true, leadId: generateLeadId() };
  },

  /**
   * Registra una solicitud de evento o boda
   */
  submitEventRequest: async (request: EventRequestData): Promise<EventRequestResponse> => {
    console.log(`[API] Enviando Solicitud de Evento a ${BASE_URL}/events`, request);
    await delay(1500);
    return { success: true, requestId: `REQ-${Date.now()}` };
  },

  /**
   * Guarda una cotización confirmada desde el calculador
   */
  submitQuote: async (quote: QuoteData): Promise<QuoteResponse> => {
    console.log(`[API] Enviando Cotización a ${BASE_URL}/quotes`, quote);
    await delay(1000);
    return { success: true, quoteId: `QUT-${Math.floor(Math.random() * 10000)}` };
  },

  /**
   * Telemetría en tiempo real para eventos de comportamiento (Tripwire)
   */
  trackEvent: async (
    eventName: string,
    data: Record<string, unknown>
  ): Promise<TelemetryResponse> => {
    console.log(`[TELEMETRÍA] ${eventName}:`, data);
    // En producción esto dispararía a Mixpanel, PostHog o Supabase Realtime
    return { success: true };
  },
};