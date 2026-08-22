const BASE_URL = '/api'; // Placeholder para URL real del backend
/**
 * Servicio API para el Ecosistema EAR
 * Maneja la persistencia de datos críticos de negocio.
 */
export const api = {
    /**
     * Registra un nuevo lead (Candidaturas, Auditorías, Suscripciones)
     */
    submitLead: async (lead) => {
        console.log(`[API] Enviando Lead a ${BASE_URL}/leads`, lead);
        // Simulación de latencia de red
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Aquí iría el fetch real:
        // const response = await fetch(`${BASE_URL}/leads`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(lead)
        // });
        // return response.json();
        return { success: true, leadId: `EAR-L-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    },
    /**
     * Registra una solicitud de evento o boda
     */
    submitEventRequest: async (request) => {
        console.log(`[API] Enviando Solicitud de Evento a ${BASE_URL}/events`, request);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, requestId: `REQ-${Date.now()}` };
    },
    /**
     * Guarda una cotización confirmada desde el calculador
     */
    submitQuote: async (quote) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, quoteId: `QUT-${Math.floor(Math.random() * 10000)}` };
    },
    /**
     * Telemetría en tiempo real para eventos de comportamiento (Tripwire)
     */
    trackEvent: async (eventName, data) => {
        console.log(`[TELEMETRÍA] ${eventName}:`, data);
        // En producción esto dispararía a Mixpanel, PostHog o Supabase Realtime
        return { success: true };
    }
};
