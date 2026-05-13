/**
 * 🌌 BUCLE DEL IMPERIO - NIVEL 10: DOMINANCIA TOTAL
 * Orquestador autónomo de la Productora de Eventos S-Class.
 */

import { astraService } from './ai/AstraService';
import { useEmpireStore } from '@/stores/useEmpireStore';
import { supabase as supabaseClient } from './auth_nexus';

export interface EventoSoberano {
    id: string;
    tipo: 'VAMPIRIZACION' | 'PROCESAMIENTO_ASTRA' | 'ASIGNACION_FLOTA' | 'CIERRE_VENTA';
    mensaje: string;
    estado: 'EXITO' | 'ADVERTENCIA' | 'CRITICO';
    timestamp: Date;
}

class BucleImperio {
    private estaActivo: boolean = false;
    private observadores: ((evento: EventoSoberano) => void)[] = [];

    /**
     * Ejecuta el ciclo autónomo de dominancia (Empire Loop).
     */
    public async executeAutonomousCycle() {
        if (this.estaActivo) return;
        this.estaActivo = true;
        this.emitir({
            id: `init-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            tipo: 'VAMPIRIZACION',
            mensaje: 'IGNICIÓN SOBERANA: Iniciando ciclo de dominancia total.',
            estado: 'EXITO',
            timestamp: new Date()
        });
        
        this.runLoop();
    }

    public desactivarModoSoberano() {
        this.estaActivo = false;
        this.emitir({
            id: `stop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            tipo: 'VAMPIRIZACION',
            mensaje: 'Soberanía manual reestablecida por el Administrador.',
            estado: 'ADVERTENCIA',
            timestamp: new Date()
        });
    }

    private async runLoop() {
        while (this.estaActivo) {
            try {
                // 1. VAMPIRIZACIÓN (Bodas.net / Scrapers)
                this.emitir({
                    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    tipo: 'VAMPIRIZACION',
                    mensaje: 'Vampirizando Soberanos de alta gama en Bodas.net y Google Trends...',
                    estado: 'EXITO',
                    timestamp: new Date()
                });
                await this.esperar(3000);

                // 2. PROCESAMIENTO ASTRA (Oráculo de Precios)
                this.emitir({
                    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    tipo: 'PROCESAMIENTO_ASTRA',
                    mensaje: 'Astra calculando Escudo de Riesgo Logístico para evento de +15k...',
                    estado: 'EXITO',
                    timestamp: new Date()
                });
                await this.esperar(4000);

                // 3. ASIGNACIÓN DE FLOTA (Logística)
                this.emitir({
                    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    tipo: 'ASIGNACION_FLOTA',
                    mensaje: 'Desplegando Activos Tácticos: Unidad Móvil DJ y Equipo Audiovisual Premium.',
                    estado: 'EXITO',
                    timestamp: new Date()
                });
                await this.esperar(3000);

                // 4. CIERRE DE VENTA (Generación de Ingresos)
                const ingresos = Math.floor(Math.random() * 8000) + 12000;
                this.emitir({
                    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    tipo: 'CIERRE_VENTA',
                    mensaje: `CONTRATO CERRADO: €${ingresos.toLocaleString()} inyectados en la Caja del Imperio.`,
                    estado: 'EXITO',
                    timestamp: new Date()
                });

                await this.esperar(10000); // Frecuencia del ciclo

            } catch (error: any) {
                this.emitir({
                    id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    tipo: 'VAMPIRIZACION',
                    mensaje: `FALLO EN SINAPSIS: ${error.message}. Reintentando protocolo...`,
                    estado: 'CRITICO',
                    timestamp: new Date()
                });
                await this.esperar(5000);
            }
        }
    }

    private esperar(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public suscribir(callback: (evento: EventoSoberano) => void) {
        this.observadores.push(callback);
        return () => {
            this.observadores = this.observadores.filter(cb => cb !== callback);
        };
    }

    private async emitir(evento: EventoSoberano) {
        // 1. Enlazar con el Store Global (Zustand)
        const { addLog } = useEmpireStore.getState();
        const mapearTipo = (estado: string): 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' => {
            if (estado === 'EXITO') return 'SUCCESS';
            if (estado === 'ADVERTENCIA') return 'WARNING';
            if (estado === 'CRITICO') return 'ERROR';
            return 'INFO';
        };

        addLog({
            nivel: evento.tipo,
            mensaje: evento.mensaje,
            tipo: mapearTipo(evento.estado)
        });

        // 2. Persistencia en Supabase (Sinapsis Global)
        const checkSession = async () => {
            const { data } = await supabaseClient.auth.getSession();
            if (!data.session) return; // Skip if not synced

            try {
                await supabaseClient.from('system_logs').insert([{
                    type: evento.tipo,
                    message: evento.mensaje,
                    status: evento.estado,
                    timestamp: new Date().toISOString()
                }]);
            } catch (error) {
                console.error('[EmpireLoop] Error persistiendo en Supabase:', error);
            }
        };
        
        checkSession();
        
        this.observadores.forEach(cb => cb(evento));
    }
}

export const empireLoop = new BucleImperio();
