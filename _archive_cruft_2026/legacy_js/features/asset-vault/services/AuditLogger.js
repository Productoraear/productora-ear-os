import { telegramService } from './TelegramService';
export class AuditLogger {
    static instance;
    constructor() { }
    static getInstance() {
        if (!AuditLogger.instance) {
            AuditLogger.instance = new AuditLogger();
        }
        return AuditLogger.instance;
    }
    async logAccess(entry) {
        const log = {
            ...entry,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString()
        };
        // En un entorno real, esto iría a Supabase o una cola de logs
        console.log(`[VAULT_AUDIT_LOG]: ${log.timestamp} | User: ${log.userId} | Asset: ${log.assetId} | Action: ${log.action}`);
        // Alerta Estratégica (.gob / .es)
        const institutionalPattern = /\.(gob|es)$/i;
        if (institutionalPattern.test(log.userId)) {
            await telegramService.sendAlert(`🏛️ ALERTA INSTITUCIONAL: Acceso detectado desde dominio gubernamental.\n` +
                `Activo: ${log.assetId}\n` +
                `Usuario: ${log.userId}\n` +
                `Acción: ${log.action}\n` +
                `Nodo: ${log.ipAddress}`);
        }
        // Simulación de persistencia
        try {
            // await supabase.from('vault_audit_logs').insert(log);
        }
        catch (error) {
            console.error('❌ AUDIT_LOG_PERSISTENCE_FAILED:', error);
        }
    }
}
export const auditLogger = AuditLogger.getInstance();
