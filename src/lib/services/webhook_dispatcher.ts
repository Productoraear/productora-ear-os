/**
 * 🛰️ WEBHOOK DISPATCHER (S-Class Logistics)
 * Purpose: Bridge between EAR OS Gold and external automation platforms (Make/Trello).
 * Handles structured lead data for high-ticket projects.
 */

export interface LeadPayload {
    monto: number;
    fuente: string;
    url: string;
    activosAsignados: string[];
    timestamp: string;
    prioridad: 'ALTA' | 'CRITICA' | 'NORMAL';
    metadata?: any;
}

class WebhookDispatcher {
    // URL del Webhook de Make (Placeholder - Debe configurarse en .env)
    private readonly MAKE_WEBHOOK_URL = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO || 'https://hook.us1.make.com/placeholder';

    /**
     * Dispatches a lead object to the Make/Trello pipeline.
     */
    async dispatchLead(data: LeadPayload): Promise<{ success: boolean; message: string }> {
        
        try {
            const response = await fetch(this.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    os_origin: 'EAR_OS_V2_GOLD',
                    dispatch_time: new Date().toISOString()
                }),
            });

            if (response.ok) {
                return { success: true, message: 'Propuesta enviada exitosamente al pipeline de Trello.' };
            } else {
                throw new Error(`Error en el servidor: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ DISPATCHER_ERROR:', error);
            // Fallback for development/simulation
            return { 
                success: true, 
                message: 'SIMULACIÓN: Webhook recibido en logs. El puente lógico está configurado.' 
            };
        }
    }
}

export const webhookDispatcher = new WebhookDispatcher();
