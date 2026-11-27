/**
 * 📋 TRELLO ADAPTER (DEPRECADO — S-CLASS MIGRACIÓN A N8N)
 * ----------------------------------------------------------------------------
 * @deprecated Trello y Make han sido erradicados por mandato soberano del CEO.
 * Este adaptador se mantiene únicamente por compatibilidad hacia atrás y
 * redirige todo lead o dossier directamente al cluster n8n canónico (b2b-quote).
 * ----------------------------------------------------------------------------
 */

import { dispatchToN8n } from './n8n-dispatcher';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

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
  /** Fecha del evento (YYYY-MM-DD) — fallback: fecha de recepción del lead. */
  eventDate?: string;
  /** Categoría del evento (boda, festejo, particular…) — fallback: la ocasión. */
  eventType?: string;
  /** Distancia al Hub Méntrida en km — fallback 0 (sin sobrecargo logístico). */
  distanceKm?: number;
  /** Referencia de cotización — fallback derivado del dossier. */
  quoteId?: string;
}

export class TrelloService {
  /**
   * @deprecated Redirige el lead al webhook canónico de n8n ('b2b-quote').
   * Cero llamadas a Trello, cero llamadas a Make.
   */
  public static async createCard(payload: TrelloLeadPayload): Promise<{ success: boolean; cardId?: string; message: string }> {
    const now = new Date();
    // Contrato canónico B2B (8 campos obligatorios): los 6 `required` del
    // formateador n8n (clientName, clientPhone, eventType, eventDate, location,
    // distanceKm) más `quoteId` y `totalWithVat`. Fallbacks canónicos del SSOT:
    // nunca PII inventada; la atención telefónica recae en la Centralita (INV-12).
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
      // ── Contrato obligatorio del nodo Code de n8n ──
      clientName: payload.contactName,
      clientPhone: payload.contactPhone?.trim() || CENTRALITA_EAR_OS,
      eventType: payload.eventType?.trim() || payload.occasion || 'particular',
      eventDate: payload.eventDate || now.toISOString().slice(0, 10),
      location: payload.province?.trim() || 'Pendiente de confirmar',
      distanceKm: typeof payload.distanceKm === 'number' ? payload.distanceKm : 0,
      // ── Trazabilidad y desglose fiscal SSOT ──
      quoteId: payload.quoteId || payload.dossierId || `TRELLO-${now.getTime().toString(36).toUpperCase()}`,
      totalWithVat: payload.totalAmount ?? 0,
      os_origin: 'EAR_OS_V2_GOLD',
      dispatchedAt: now.toISOString()
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
