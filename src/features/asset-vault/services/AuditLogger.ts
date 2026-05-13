import { AuditLogEntry } from '../model/types';
import { telegramService } from './TelegramService';

export class AuditLogger {
  private static instance: AuditLogger;
  
  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public async logAccess(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const log: AuditLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString()
    };

    // En un entorno real, esto iría a Supabase o una cola de logs
    console.log(`[VAULT_AUDIT_LOG]: ${log.timestamp} | User: ${log.userId} | Asset: ${log.assetId} | Action: ${log.action}`);
    
    // Alerta Estratégica (.gob / .es)
    const institutionalPattern = /\.(gob|es)$/i;
    if (institutionalPattern.test(log.userId)) {
      await telegramService.sendAlert(
        `🏛️ ALERTA INSTITUCIONAL: Acceso detectado desde dominio gubernamental.\n` +
        `Activo: ${log.assetId}\n` +
        `Usuario: ${log.userId}\n` +
        `Acción: ${log.action}\n` +
        `Nodo: ${log.ipAddress}`
      );
    }

    // Simulación de persistencia
    try {
      // await supabase.from('vault_audit_logs').insert(log);
    } catch (error) {
      console.error('❌ AUDIT_LOG_PERSISTENCE_FAILED:', error);
    }
  }
}

export const auditLogger = AuditLogger.getInstance();
