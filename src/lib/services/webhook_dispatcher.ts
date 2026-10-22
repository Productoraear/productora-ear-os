/**
 * 🛰️ WEBHOOK DISPATCHER (S-CLASS SOVEREIGN GATEWAY)
 * ----------------------------------------------------------------------------
 * Re-export canónico y tipado estricto hacia n8n-dispatcher.
 * Erradicación total de Make/Trello y fachadas simuladas.
 * ----------------------------------------------------------------------------
 */

import {
    dispatchToN8n,
    fireAndForgetN8n,
    type N8nWebhookSlug,
    type N8nDispatchResult
} from './n8n-dispatcher';

export type { N8nWebhookSlug, N8nDispatchResult };

export interface LeadPayload {
    monto: number;
    fuente: string;
    url: string;
    activosAsignados: string[];
    timestamp: string;
    prioridad: 'ALTA' | 'CRITICA' | 'NORMAL';
    metadata?: Record<string, unknown>;
}

export async function dispatchLead(
    slug: N8nWebhookSlug,
    payload: Record<string, unknown>
): Promise<N8nDispatchResult> {
    return dispatchToN8n(slug, payload);
}

class WebhookDispatcher {
    /**
     * Despacha un prospecto al orquestador n8n (b2b-quote / call-center-intake).
     */
    async dispatchLead(data: LeadPayload): Promise<{ success: boolean; message: string }> {
        const payload: Record<string, unknown> = {
            monto: data.monto,
            fuente: data.fuente,
            url: data.url,
            activosAsignados: data.activosAsignados,
            timestamp: data.timestamp,
            prioridad: data.prioridad,
            metadata: data.metadata ?? {},
            os_origin: 'EAR_OS_V2_GOLD',
            dispatch_time: new Date().toISOString()
        };

        const result = await dispatchToN8n('b2b-quote', payload);

        if (result.delivered) {
            return {
                success: true,
                message: 'Propuesta despachada exitosamente al cluster n8n.'
            };
        }

        return {
            success: false,
            message: `Fallo de entrega n8n (${result.lastError ?? 'desconocido'}). Evento encolado en DLQ.`
        };
    }
}

export const webhookDispatcher = new WebhookDispatcher();
export { fireAndForgetN8n, dispatchToN8n };
