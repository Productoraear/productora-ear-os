/**
 * 🛰️ LEAD ROUTER SERVICE - S-CLASS CLASSIFICATION
 * Purpose: Categorize leads by domain and context for optimal fulfillment.
 */

import { LeadChannel, LeadRoutingResult } from '@/types/dossier';

const FREEMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

export class LeadRouter {
  public static route(email: string, occasionSlug: string): LeadRoutingResult {
    const domain = email.split('@')[1]?.toLowerCase();
    
    // 1. INSTITUTIONAL CHECK (.gob.es, .es de ayuntamientos, etc.)
    if (domain?.endsWith('.gob.es') || domain?.includes('ayto-') || domain?.includes('ayuntamiento')) {
      return {
        channel: 'INSTITUTIONAL',
        reason: 'Dominio gubernamental o institucional detectado.',
        priority: 100
      };
    }

    // 2. FREEMAIL CHECK (B2C / Operativo estándar)
    if (domain && FREEMAIL_DOMAINS.includes(domain)) {
      return {
        channel: 'OPERATIVE',
        reason: 'Uso de correo personal/freemail.',
        priority: occasionSlug === 'bodas' ? 70 : 40
      };
    }

    // 3. B2B CHECK (Dominio privado/corporativo)
    if (domain) {
      return {
        channel: 'B2B',
        reason: 'Dominio corporativo privado detectado.',
        priority: occasionSlug === 'corporativo' ? 90 : 60
      };
    }

    return {
      channel: 'OPERATIVE',
      reason: 'Clasificación por defecto.',
      priority: 30
    };
  }

  public static getTelegramTarget(channel: LeadChannel): string {
    // Estos IDs deberían venir de variables de entorno
    switch (channel) {
      case 'INSTITUTIONAL': return process.env.TELEGRAM_INSTITUTIONAL_ID || 'admin_chat';
      case 'B2B': return process.env.TELEGRAM_B2B_ID || 'sales_chat';
      case 'OPERATIVE': return process.env.TELEGRAM_OPERATIVE_ID || 'ops_chat';
      default: return 'admin_chat';
    }
  }
}
