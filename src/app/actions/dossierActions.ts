/**
 * ⚡ SERVER ACTION: approveDossier - S-CLASS CLOSING PROTOCOL
 * Purpose: Securely transition dossier to pre-closed state and notify via Telegram.
 */

"use server";

import { createClient } from '@/lib/supabase/server';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { LeadRouter } from '@/lib/services/leads/LeadRouter';
import { TrelloService } from '@/lib/services/trello';
import { EmailService } from '@/lib/services/emailService';

export async function approveDossier(dossierId: string, token: string) {
  const supabase = createClient();

  // 1. VALIDACIÓN FORENSE DE ESTADO
  const { data: dossier, error: fetchError } = await supabase
    .from('dossier_proposals')
    .select('*')
    .eq('id', dossierId)
    .single();

  if (fetchError || !dossier) {
    return { success: false, error: 'Dossier no encontrado.' };
  }

  // Comprobar expiración
  if (new Date(dossier.expires_at) < new Date()) {
    return { success: false, error: 'Esta propuesta ha expirado.' };
  }

  // Comprobar transición permitida
  if (!['draft', 'sent', 'approved'].includes(dossier.status)) {
    return { success: false, error: `Transición no permitida desde estado: ${dossier.status}` };
  }

  // 2. SOFT RESERVE LOGIC (48 horas de exclusividad)
  const reservationExpiresAt = new Date();
  reservationExpiresAt.setHours(reservationExpiresAt.getHours() + 48);

  // 3. ATOMIC UPDATE
  const { error: updateError } = await supabase
    .from('dossier_proposals')
    .update({
      status: 'pre-closed',
      approved_at: new Date().toISOString(),
      reservation_expires_at: reservationExpiresAt.toISOString()
    })
    .eq('id', dossierId);

  if (updateError) {
    return { success: false, error: 'Error al actualizar el estado de la propuesta.' };
  }

  // 4. TELEGRAM NOTIFICATION (Server-Side)
  const telegramTarget = LeadRouter.getTelegramTarget(dossier.channel as any);
  const message = `
🤝 *PRE-CIERRE DE DOSSIER DETECTADO*
ID: \`${dossier.id}\`
Cliente: *${dossier.contact_name}*
Canal: \`${dossier.channel}\`
Ocasión: \`${dossier.occasion_slug}\`
Prioridad: \`${dossier.priority_score}%\`

📦 *Activos Reservados (48h):*
${dossier.selected_assets.map((a: string) => `- ${a}`).join('\n')}

🚀 _EAR OS GOLD: Protocolo de Cierre Activado._
  `.trim();

  try {
    await sendTelegramNotification(message, dossier.telegram_target || undefined);
  } catch (e) {
    console.error("❌ Fallo en notificación Telegram:", e);
  }

  return { success: true };
}

export async function createDossierFromLead(leadData: {
  contactName: string;
  contactEmail: string;
  occasion: string;
  selectedAssets: string[];
}) {
  const supabase = createClient();

  // 1. LEAD ROUTING (S-Class Strategy)
  const routing = LeadRouter.route(leadData.contactEmail, leadData.occasion);

  // 2. DOSSIER GENERATION
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 168); // 1 semana de validez

  const { data: dossier, error: createError } = await supabase
    .from('dossier_proposals')
    .insert([{
      token: Math.random().toString(36).substring(2, 15),
      status: 'sent',
      expires_at: expiresAt.toISOString(),
      contact_name: leadData.contactName,
      contact_email: leadData.contactEmail,
      occasion_slug: leadData.occasion,
      selected_assets: leadData.selectedAssets,
      channel: routing.channel,
      routing_reason: routing.reason,
      priority_score: routing.priority,
      telegram_target: LeadRouter.getTelegramTarget(routing.channel)
    }])
    .select()
    .single();

  if (createError || !dossier) {
    console.error("❌ DOSSIER_CREATE_ERROR:", createError);
    return { success: false, error: 'Error al generar la propuesta técnica.' };
  }

  // 3. TELEGRAM ALERT (Lead Ingestion)
  const message = `
🚀 *NUEVO LEAD DETECTADO (Dossier)*
ID: \`${dossier.id}\`
Cliente: *${dossier.contact_name}*
Email: \`${dossier.contact_email}\`
Canal: \`${dossier.channel}\`
Motivo: _${dossier.routing_reason}_

📦 *Interés en:*
${dossier.selected_assets.map((a: string) => `- ${a}`).join('\n')}

_EAR OS GOLD: Iniciando ciclo de conversión._
  `.trim();

  try {
    await sendTelegramNotification(message, dossier.telegram_target);
  } catch (e) {
    console.error("❌ Fallo en notificación Telegram (Lead):", e);
  }

  // 4. TRELLO AUTOMATION DISPATCH
  try {
    await TrelloService.createCard({
      dossierId: dossier.id,
      contactName: leadData.contactName,
      contactEmail: leadData.contactEmail,
      occasion: leadData.occasion,
      selectedAssets: leadData.selectedAssets,
      channel: routing.channel,
      priority: routing.priority > 75 ? 'CRITICA' : routing.priority > 50 ? 'ALTA' : 'NORMAL'
    });
  } catch (trelloErr) {
    console.error("❌ Fallo en sincronización Trello:", trelloErr);
  }

  // 5. EMAIL TRANSACCIONAL & NURTURING MAILERLITE
  try {
    await EmailService.sendDossierEmail({
      toEmail: leadData.contactEmail,
      toName: leadData.contactName,
      dossierId: dossier.id,
      occasion: leadData.occasion,
      selectedAssets: leadData.selectedAssets,
      token: dossier.token
    });
  } catch (emailErr) {
    console.error("❌ Fallo en despacho de email transaccional:", emailErr);
  }

  return { success: true, dossierId: dossier.id };
}
