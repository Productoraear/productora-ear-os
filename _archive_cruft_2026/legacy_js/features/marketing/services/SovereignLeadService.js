export class SovereignLeadService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!SovereignLeadService.instance) {
            SovereignLeadService.instance = new SovereignLeadService();
        }
        return SovereignLeadService.instance;
    }
    async captureLead(data) {
        console.log(`[LEAD_CAPTURE]: ${data.email} | Interest: ${data.interest}`);
        // Simulación de persistencia en Supabase
        // await supabase.from('leads').insert(data);
        // Notificación al Comandante
        const isInstitutional = /\.(gob|es)$/i.test(data.email);
        const msg = `🎯 NUEVO LEAD CAPTURADO: ${data.name || 'Anónimo'}\n` +
            `Email: ${data.email}\n` +
            `Interés: ${data.interest}\n` +
            `Origen: ${data.source}\n` +
            `${isInstitutional ? '⚠️ ATENCIÓN: PERFIL INSTITUCIONAL DETECTADO.' : ''}`;
        // Notificaría vía Telegram/Astra
        console.log(`[ALERT]: ${msg}`);
    }
}
export const leadService = SovereignLeadService.getInstance();
