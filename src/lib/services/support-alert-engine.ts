/**
 * 🚨 SUPPORT ALERT ENGINE (S-CLASS — ESCALADO DE PRIORIDAD)
 * ----------------------------------------------------------------------------
 * Motor central de soporte y monitorización de EAR OS. Ante un fallo (webhook
 * n8n caído, CRON fallido, depósito Stripe no confirmado, uptime crítico),
 * despacha alertas por los tres canales con prioridad escalonada:
 *
 *   CRITICAL → Telegram + WhatsApp centralita + Email
 *   WARNING  → Telegram + WhatsApp centralita
 *   INFO     → Telegram
 *
 * DOCTRINA "LO CONSTRUIDO NO PUEDE FALLAR" (AGENTS.md §11):
 *  - Ningún canal bloquea a los demás: si Telegram falla, WhatsApp y Email
 *    siguen su curso. Cada despacho se intenta de forma independiente.
 *  - Centralita S-Class (+34 693 693 048) como único teléfono de leads huérfanos.
 * ----------------------------------------------------------------------------
 */

import { CENTRALITA } from '@/lib/phone-constants';
import { sendTelegramNotification } from '@/lib/services/telegram';

export type SupportSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SupportAlertPayload {
    severity: SupportSeverity;
    title: string;
    detail: string;
    /** Sistema o componente origen (ej. 'n8n-webhook', 'vercel-cron', 'stripe'). */
    source: string;
    /** Datos de contexto opcionales, serializados en el cuerpo del mensaje. */
    metadata?: Record<string, unknown>;
}

export interface SupportAlertResult {
    severity: SupportSeverity;
    telegram: boolean;
    whatsapp: boolean;
    email: boolean;
    notifiedAt: string;
}

const RESEND_API = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'Productora EAR <notificaciones@productoraear.com>';

function getResendKey(): string {
    return (process.env.RESEND_API_KEY || '').replace(/['"]/g, '').trim();
}

/** Número de la centralita normalizado para la API de WhatsApp. */
function sanitizePhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2);
    }
    if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
        cleaned = `34${cleaned}`;
    }
    return cleaned;
}

/** Envía un mensaje de texto libre por WhatsApp Cloud API (no plantilla). */
async function sendWhatsAppText(toPhone: string, message: string): Promise<boolean> {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId) {
        console.warn('⚠️ [SUPPORT-ALERT] WhatsApp no configurado. Omitiendo canal WhatsApp.');
        return false;
    }

    const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: sanitizePhoneNumber(toPhone),
                type: 'text',
                text: { body: message }
            })
        });
        if (res.ok) {
            return true;
        }
        console.error('❌ [SUPPORT-ALERT] WhatsApp falló:', res.status);
        return false;
    } catch (reason) {
        const messageText = reason instanceof Error ? reason.message : String(reason);
        console.error('❌ [SUPPORT-ALERT] WhatsApp excepción:', messageText);
        return false;
    }
}

/** Envía un email de alerta vía Resend con fallback de simulación. */
async function sendAlertEmail(subject: string, textBody: string): Promise<boolean> {
    const key = getResendKey();
    if (!key) {
        console.log(`📧 [SUPPORT-ALERT SIMULACIÓN] Asunto: ${subject}`);
        return false;
    }

    try {
        const res = await fetch(RESEND_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                from: FROM_ADDRESS,
                to: [CENTRALITA.emailDisplay],
                subject,
                html: `<pre style="font-family:monospace;color:#e5e5e5;background:#09090d;padding:24px;border-radius:12px;">${escapeHtml(textBody)}</pre>`
            })
        });
        if (res.ok) {
            return true;
        }
        console.error('❌ [SUPPORT-ALERT] Email falló:', res.status);
        return false;
    } catch (reason) {
        const messageText = reason instanceof Error ? reason.message : String(reason);
        console.error('❌ [SUPPORT-ALERT] Email excepción:', messageText);
        return false;
    }
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
}

function formatMetadata(metadata?: Record<string, unknown>): string {
    if (!metadata || Object.keys(metadata).length === 0) {
        return '';
    }
    const lines = Object.entries(metadata).map(([key, value]) => `   ${key}: ${String(value)}`);
    return `\n${lines.join('\n')}`;
}

function buildMessage(payload: SupportAlertPayload): string {
    const icon = payload.severity === 'CRITICAL' ? '🔴' : payload.severity === 'WARNING' ? '🟠' : '🔵';
    return [
        `${icon} *SOPORTE EAR OS — ${payload.severity}*`,
        `*${payload.title}*`,
        payload.detail,
        `_Origen: ${payload.source}_`,
        formatMetadata(payload.metadata)
    ].filter(Boolean).join('\n');
}

/**
 * Despacha una alerta de soporte con escalado por severidad. Nunca lanza:
 * si un canal falla, intenta los restantes y devuelve el resultado.
 */
export async function dispatchSupportAlert(payload: SupportAlertPayload): Promise<SupportAlertResult> {
    const message = buildMessage(payload);
    const subject = `[SOPORTE ${payload.severity}] ${payload.title}`;

    let telegram = false;
    let whatsapp = false;
    let email = false;

    try {
        await sendTelegramNotification(message);
        telegram = true;
    } catch (reason) {
        console.error('❌ [SUPPORT-ALERT] Telegram falló:', reason instanceof Error ? reason.message : String(reason));
    }

    if (payload.severity === 'WARNING' || payload.severity === 'CRITICAL') {
        whatsapp = await sendWhatsAppText(CENTRALITA.phone, message);
    }

    if (payload.severity === 'CRITICAL') {
        email = await sendAlertEmail(subject, message);
    }

    return {
        severity: payload.severity,
        telegram,
        whatsapp,
        email,
        notifiedAt: new Date().toISOString()
    };
}

/**
 * Atajo CRITICAL para fallos que exigen atención inmediata (noche incluida).
 * Escala a los tres canales: Telegram + WhatsApp + Email.
 */
export function dispatchCriticalSupportAlert(payload: Omit<SupportAlertPayload, 'severity'>): Promise<SupportAlertResult> {
    return dispatchSupportAlert({ ...payload, severity: 'CRITICAL' });
}

/**
 * Atajo WARNING para degradaciones que requieren atención pero no urgencia.
 * Escala a Telegram + WhatsApp.
 */
export function dispatchWarningSupportAlert(payload: Omit<SupportAlertPayload, 'severity'>): Promise<SupportAlertResult> {
    return dispatchSupportAlert({ ...payload, severity: 'WARNING' });
}