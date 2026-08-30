/**
 * 🏛️ TELEGRAM NOTIFIER SERVICE — B2G HUNTER ALERTS
 * Gobernanza Antigravity Omega v4.1 (SSOT S-Class)
 * 
 * Envío de alertas push estructuradas a Telegram (+34 693 693 048)
 * cuando el escáner PLACSP detecta licitaciones y contratos menores
 * con Match Score >= 90% (Art. 118 LCSP < 15.000 €).
 */

export interface B2GTenderAlertPayload {
  id: string;
  expedienteRef: string;
  title: string;
  organoContratante: string;
  municipio: string;
  provincia: string;
  dir3Code?: string;
  cpvCode: string;
  cpvDescription?: string;
  importeBase: number;
  importeConIVA?: number;
  fechaPublicacion?: string;
  fechaLimite: string;
  diasRestantes?: number;
  tipoContrato?: 'MENOR' | 'NEGOCIADO_SIN_PUB' | 'ABIERTO';
  isLCSPCompliant?: boolean;
  vimumeCompatible: boolean;
  matchScore: number;
  matchReasons?: string[];
  status?: string;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Envía una alerta estructurada de licitación B2G al canal/chat de Telegram configurado.
 * Manejo defensivo: Si faltan credenciales, registra log de advertencia sin lanzar excepción.
 */
export async function sendB2GTelegramAlert(tender: B2GTenderAlertPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [B2G TELEGRAM NOTIFIER] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados en variables de entorno. Notificación omitida.');
    return false;
  }

  const baseFormatted = tender.importeBase.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const vimumeBadge = tender.vimumeCompatible 
    ? `${tender.matchScore}% (&lt;75 dB SPL - Certificado)` 
    : `${tender.matchScore}% (Estándar Festejos)`;

  const actionUrl = `https://www.productoraear.com/admin/flota?tab=b2g&id=${encodeURIComponent(tender.id)}`;

  const messageHtml = [
    `🏛️ <b>NUEVA LICITACIÓN B2G DETECTADA</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `• <b>Municipio:</b> ${escapeHtml(tender.municipio)} (${escapeHtml(tender.provincia)})`,
    `• <b>Importe Base:</b> ${baseFormatted} € (IVA excl.)`,
    `• <b>Órgano:</b> ${escapeHtml(tender.organoContratante)}`,
    `• <b>Expediente:</b> <code>${escapeHtml(tender.expedienteRef)}</code>`,
    `• <b>Plazo Presentación:</b> <b>${escapeHtml(tender.fechaLimite)}</b>`,
    `• <b>Match Score:</b> ${vimumeBadge}`,
    `• <b>Régimen:</b> Art. 118 LCSP (Contrato Menor)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 <a href="${actionUrl}"><b>Generar Expediente Art. 118 (1-Clic)</b></a>`,
    `📞 Retención EAR: +34 693 693 048`
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`❌ [B2G TELEGRAM ERROR] HTTP ${response.status}:`, errBody);
      return false;
    }

    const data = await response.json();
    if (data.ok) {
      console.log(`✅ [B2G TELEGRAM ALERT DISPATCHED] Alerta enviada para licitación ${tender.id} (${tender.municipio})`);
      return true;
    } else {
      console.error(`❌ [B2G TELEGRAM RESPONSE ERROR]:`, data.description);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ [B2G TELEGRAM NETWORK ERROR]:`, error?.message || error);
    return false;
  }
}
