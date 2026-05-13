import { telegramService } from '../../features/asset-vault/services/TelegramService';
import { LeadScoreResult } from '../../features/lead-capture/model/leadScoreCalculator';

export async function sendInstitutionalWebhook(email: string, asset: string, analytics: LeadScoreResult) {
  const payload = {
    event: 'INSTITUTIONAL_LEAD_DETECTED',
    timestamp: new Date().toISOString(),
    prospect: {
      email,
      category: analytics.category,
      score: analytics.score,
      priority: analytics.priority,
      isVIP: analytics.isVIP
    },
    context: {
      action: 'VAULT_INTERACTION',
      asset_targeted: asset,
      platform: 'EAR_OS_GOLD_V2'
    }
  };

  const message = 
    `🏛️ RADAR DETECTÓ CAZA B2G\n` +
    `--------------------------\n` +
    `Prospecto: ${email}\n` +
    `Categoría: ${analytics.category}\n` +
    `Asset: ${asset}\n` +
    `Score: ${analytics.score} Pts\n` +
    `Prioridad: ${analytics.priority}\n` +
    `VIP: ${analytics.isVIP ? '✅ SÍ' : '❌ NO'}\n` +
    `--------------------------\n` +
    `Payload: ${JSON.stringify(payload, null, 2)}`;

  await telegramService.sendAlert(message);
  
  return payload;
}
