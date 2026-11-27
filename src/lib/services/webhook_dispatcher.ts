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
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export type { N8nWebhookSlug, N8nDispatchResult };

export interface LeadPayload {
    monto: number;
    fuente: string;
    url: string;
    activosAsignados: string[];
    timestamp: string;
    prioridad: 'ALTA' | 'CRITICA' | 'NORMAL';
    metadata?: Record<string, unknown>;
    /** Contrato canónico B2B (8 campos) — fallbacks canónicos del SSOT si no se informan. */
    clientName?: string;
    clientPhone?: string;
    eventType?: string;
    eventDate?: string;
    location?: string;
    distanceKm?: number;
    quoteId?: string;
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
        // Contrato canónico B2B (8 campos obligatorios): los 6 `required` del
        // formateador n8n (clientName, clientPhone, eventType, eventDate, location,
        // distanceKm) más `quoteId` y `totalWithVat`. Fallbacks canónicos del SSOT:
        // nunca PII inventada; la atención telefónica recae en la Centralita (INV-12).
        const now = new Date();
        const payload: Record<string, unknown> = {
            monto: data.monto,
            fuente: data.fuente,
            url: data.url,
            activosAsignados: data.activosAsignados,
            timestamp: data.timestamp,
            prioridad: data.prioridad,
            metadata: data.metadata ?? {},
            // ── Contrato obligatorio del nodo Code de n8n ──
            clientName: data.clientName?.trim() || 'Cliente Directo EAR OS',
            clientPhone: data.clientPhone?.trim() || CENTRALITA_EAR_OS,
            eventType: data.eventType?.trim() || 'particular',
            eventDate: data.eventDate || now.toISOString().slice(0, 10),
            location: data.location?.trim() || 'Pendiente de confirmar',
            distanceKm: typeof data.distanceKm === 'number' ? data.distanceKm : 0,
            // ── Trazabilidad y desglose fiscal SSOT ──
            quoteId: data.quoteId || `LEAD-${now.getTime().toString(36).toUpperCase()}`,
            totalWithVat: data.monto,
            os_origin: 'EAR_OS_V2_GOLD',
            dispatch_time: now.toISOString()
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
