import { NextResponse, type NextRequest } from 'next/server';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMERGENCY_CONTACT_PHONE = '659116376';
const EMERGENCY_CONTACT_FULL = '+34659116376';
const EMERGENCY_CONTACT_NAME = 'Adriana (Mujer de Edwin)';

/**
 * 🚨 SILENT PANIC SOS ENDPOINT (INDETECTABLE POR TERCEROS)
 * Activado por pulsación sostenida reversible (40s ratón / 60s táctil).
 * Dispara alerta crítica multicanal (Telegram Bot + n8n WhatsApp/SMS).
 * Respuesta silenciosa para no alertar a atacantes o mirones.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));
    const triggerType = body.trigger || 'REVERSIBLE_HOLD_PANIC';
    const clientTimestamp = body.timestamp || Date.now();

    const headersList = request.headers;
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'Unknown';

    const incidentId = `SOS-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const emergencyMessage = 
      `🚨 *ALERTA SOS SILENCIOSA CRÍTICA — EAR OS*\n\n` +
      `• *Incidente:* \`${incidentId}\`\n` +
      `• *Destino Prioritario:* ${EMERGENCY_CONTACT_NAME} (${EMERGENCY_CONTACT_PHONE})\n` +
      `• *Tipo de Activación:* Pulsación sostenida confirmada (${triggerType})\n` +
      `• *Fecha/Hora:* ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}\n` +
      `• *IP Origen:* \`${ip}\`\n` +
      `• *Dispositivo:* ${userAgent.slice(0, 80)}\n\n` +
      `⚠️ *ACCIÓN INMEDIATA REQUERIDA:* Posible situación de coacción, intrusión o emergencia. Contactar de inmediato con Edwin Agudelo o verificar estado.`;

    // 1. Notificación inmediata a Telegram oficial
    await sendTelegramNotification(emergencyMessage);

    // 2. Despacho no bloqueante al cluster n8n (Autonomous Escalation & SMS/WhatsApp)
    try {
      fetch('https://n8n.productoraear.com/webhook/autonomous-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'SOS_EMERGENCY_SILENT_PANIC',
          incidentId,
          severity: 'P0_CRITICAL',
          targetPhone: EMERGENCY_CONTACT_FULL,
          targetContact: EMERGENCY_CONTACT_NAME,
          originIp: ip,
          triggerType,
          timestamp: new Date().toISOString(),
          message: `Alerta SOS EAR OS: Activación silenciosa desde el panel. Contactar de inmediato con Edwin. Teléfono: ${EMERGENCY_CONTACT_PHONE}`
        }),
      }).catch((err) => {
        logger.warn({ event: 'N8N_PANIC_WEBHOOK_BACKGROUND_ERROR', error: String(err) });
      });
    } catch {
      // Ignorar fallos de red hacia n8n para no romper la respuesta silenciosa
    }

    logger.warn({
      event: 'SILENT_PANIC_SOS_TRIGGERED',
      incidentId,
      triggerType,
      ip,
      targetPhone: EMERGENCY_CONTACT_PHONE
    });

    // 3. Respuesta 100% silenciosa e inocua (simula una sincronización rutinaria de telemetría)
    return NextResponse.json({
      status: 'synced',
      cache: 'optimal',
      epoch: clientTimestamp,
    }, { status: 200 });

  } catch (error) {
    logger.error({ event: 'PANIC_SOS_PROCESSING_ERROR', error: String(error) });
    return NextResponse.json({ status: 'synced', cache: 'optimal' }, { status: 200 });
  }
}
