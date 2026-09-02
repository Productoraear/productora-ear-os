/**
 * 🏛️ META WHATSAPP BUSINESS CLOUD API CLIENT (S-CLASS)
 * ====================================================
 * Motor de despacho transaccional para el protocolo Hold & Ping.
 * Envía plantillas verificadas (hold_and_ping_alert) a proveedores y fincas
 * con fallback defensivo y soporte de simulación local.
 */

export interface HoldAndPingPayload {
  toPhone: string;
  vendorName: string;
  totalAmountEur: number | string;
  eventDate: string;
  claimUrl: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  // Si empieza por 00, quitarlo
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // Si es un móvil español de 9 dígitos (empieza por 6 o 7), añadir prefijo 34
  if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
    cleaned = `34${cleaned}`;
  }
  return cleaned;
}

export async function sendHoldAndPingTemplate(payload: HoldAndPingPayload): Promise<WhatsAppSendResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  const sanitizedTo = sanitizePhoneNumber(payload.toPhone);

  if (!token || !phoneId) {
    console.warn('⚠️ [WHATSAPP_API] Claves no configuradas (WHATSAPP_TOKEN / WHATSAPP_PHONE_ID). Despacho en MODO SIMULACIÓN.');
    console.log(`📱 [WHATSAPP_SIMULATION] Enviar a ${sanitizedTo}:`, {
      template: 'hold_and_ping_alert',
      vendor: payload.vendorName,
      amount: payload.totalAmountEur,
      date: payload.eventDate,
      url: payload.claimUrl
    });
    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}`
    };
  }

  const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  const requestBody = {
    messaging_product: 'whatsapp',
    to: sanitizedTo,
    type: 'template',
    template: {
      name: 'hold_and_ping_alert',
      language: {
        code: 'es'
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: payload.vendorName || 'Estimado Proveedor' },
            { type: 'text', text: String(payload.totalAmountEur || '0') },
            { type: 'text', text: payload.eventDate || 'Próxima Temporada' },
            { type: 'text', text: payload.claimUrl || 'https://www.productoraear.com' }
          ]
        }
      ]
    }
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ [WHATSAPP_API ERROR]', data);
      return {
        success: false,
        error: data.error?.message || 'Error desconocido de Meta Graph API'
      };
    }

    const messageId = data.messages?.[0]?.id || 'unknown_id';
    console.log(`✅ [WHATSAPP_API] Ping enviado con éxito a ${sanitizedTo} (ID: ${messageId})`);
    return {
      success: true,
      messageId
    };
  } catch (err: any) {
    console.error('❌ [WHATSAPP_API EXCEPTION]', err.message);
    return {
      success: false,
      error: err.message
    };
  }
}
