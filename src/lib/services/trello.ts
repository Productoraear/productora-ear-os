/**
 * 📋 TRELLO ADAPTER (DEPRECADO — S-CLASS MIGRACIÓN A N8N)
 * ----------------------------------------------------------------------------
 * @deprecated Trello y Make han sido erradicados por mandato soberano del CEO.
 * Este adaptador se mantiene únicamente por compatibilidad hacia atrás y
 * redirige todo lead o dossier directamente al cluster n8n canónico (b2b-quote).
 * ----------------------------------------------------------------------------
 */

import { dispatchToN8n } from './n8n-dispatcher';

export interface TrelloLeadPayload {
  dossierId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  occasion: string;
  province?: string;
  totalAmount?: number;
  depositAmount?: number;
  selectedAssets: string[];
  priority?: 'ALTA' | 'CRITICA' | 'NORMAL';
  channel?: string;
  token?: string;
}

export class TrelloService {
  /**
   * @deprecated Redirige el lead al webhook canónico de n8n ('b2b-quote').
   * Cero llamadas a Trello, cero llamadas a Make.
   */
  public static async createCard(payload: TrelloLeadPayload): Promise<{ success: boolean; cardId?: string; message: string }> {
    const n8nPayload: Record<string, unknown> = {
      source: 'dossier-trello-adapter',
      dossierId: payload.dossierId ?? null,
      contactName: payload.contactName,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone ?? null,
      occasion: payload.occasion,
      province: payload.province ?? null,
      totalAmount: payload.totalAmount ?? null,
      depositAmount: payload.depositAmount ?? 100,
      selectedAssets: payload.selectedAssets,
      priority: payload.priority ?? 'ALTA',
      channel: payload.channel ?? 'INBOUND_WEB',
      os_origin: 'EAR_OS_V2_GOLD',
      dispatchedAt: new Date().toISOString()
    };

    const result = await dispatchToN8n('b2b-quote', n8nPayload);

    if (result.delivered) {
      console.log(`📋 [N8N DISPATCH] Lead ${payload.contactName} transferido con éxito a n8n.`);
      return {
        success: true,
        message: 'Prospecto transferido exitosamente al cluster n8n.'
      };
    }

    console.warn(`⚠️ [N8N DISPATCH WARNING] Lead encolado en DLQ para reintento: ${result.lastError ?? 'desconocido'}`);
    return {
      success: true,
      message: 'Prospecto recibido y encolado en DLQ de EAR OS.'
    };
  }
}
