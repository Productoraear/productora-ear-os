/**
 * ⚡ SERVER ACTION: approveDossier - S-CLASS CLOSING PROTOCOL
 * Purpose: Securely transition dossier to pre-closed state and notify via Telegram.
 */

"use server";

import { createClient } from '@/lib/supabase/server';
import { sendTelegramNotification } from '@/lib/services/telegram';
import { LeadRouter } from '@/lib/services/leads/LeadRouter';

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
    await sendTelegramNotification(message); // TODO: Asegurar que acepte chat_id o target
  } catch (e) {
    console.error("❌ Fallo en notificación Telegram:", e);
  }

  return { success: true };
}
