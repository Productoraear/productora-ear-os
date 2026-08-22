class EmpireLoopService {
    subscriptores = [];
    intervaloId = null;
    ejecutando = false;
    suscribir(callback) {
        this.subscriptores.push(callback);
    }
    emitir(tipo, mensaje, estado = 'NORMAL') {
        const evento = {
            id: Math.random().toString(36).substring(7),
            tipo,
            mensaje,
            estado,
            timestamp: new Date()
        };
        this.subscriptores.forEach(sub => sub(evento));
    }
    executeAutonomousCycle() {
        if (this.ejecutando)
            return;
        this.ejecutando = true;
        this.emitir('VAMPIRIZACION', 'IGNICIÓN SOBERANA: Iniciando ciclo de dominancia total.', 'ADVERTENCIA');
        this.intervaloId = setInterval(() => {
            // 1. Vampirización
            this.emitir('VAMPIRIZACION', 'Vampirizando Soberanos de alta gama en Bodas.net y Google Trends...');
            // 2. Astra (Retrasado 3s)
            setTimeout(() => {
                this.emitir('PROCESAMIENTO_ASTRA', 'Astra calculando Escudo de Riesgo Logístico para evento de +15k...');
            }, 3000);
            // 3. Flota (Retrasado 7s)
            setTimeout(() => {
                this.emitir('ASIGNACION_FLOTA', 'Desplegando Activos Tácticos: Unidad Móvil DJ y Equipo Audiovisual Premium.');
            }, 7000);
            // 4. Cierre (Retrasado 10s)
            setTimeout(() => {
                const ticket = Math.floor(Math.random() * (25000 - 12000 + 1) + 12000);
                this.emitir('CIERRE_VENTA', `CONTRATO CERRADO: €${ticket.toLocaleString()} inyectados en la Caja del Imperio.`, 'NORMAL');
            }, 10000);
        }, 15000); // Un ciclo cada 15 segundos
    }
    desactivarModoSoberano() {
        if (this.intervaloId) {
            clearInterval(this.intervaloId);
            this.intervaloId = null;
        }
        this.ejecutando = false;
        this.emitir('VAMPIRIZACION', 'Soberanía manual reestablecida por el Administrador.', 'CRITICO');
    }
}
export const empireLoop = new EmpireLoopService();
