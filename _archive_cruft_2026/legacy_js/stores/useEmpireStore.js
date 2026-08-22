import { create } from 'zustand';
export const useEmpireStore = create((set, get) => ({
    soberanos: [
        { id: '1', nombre: 'Boda Finca El Regajal', etapa: 'Negociación', valor: 18000, probabilidad: 85 },
        { id: '2', nombre: 'Evento Corporativo Airbus', etapa: 'Propuesta', valor: 25000, probabilidad: 60 }
    ],
    pipeline: 43000,
    flota: [
        { id: 'v1', modelo: 'Mercedes Maybach S680', matricula: 'EAR-001', estado: 'DISPONIBLE', bateria: 92 },
        { id: 'v2', modelo: 'Rolls-Royce Ghost', matricula: 'EAR-002', estado: 'EN_SERVICIO', bateria: 45 }
    ],
    logs: [],
    addSoberano: (s) => {
        set((state) => ({ soberanos: [s, ...state.soberanos] }));
        get().updatePipeline();
        get().addLog({ nivel: 'CRM', mensaje: `Nuevo soberano detectado: ${s.nombre}`, tipo: 'SUCCESS' });
    },
    updatePipeline: () => {
        const total = get().soberanos.reduce((acc, s) => acc + s.valor, 0);
        set({ pipeline: total });
    },
    setFlota: (f) => set({ flota: f }),
    addLog: (l) => {
        const newLog = {
            ...l,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString()
        };
        set((state) => ({ logs: [newLog, ...state.logs].slice(0, 50) }));
    }
}));
