import { create } from 'zustand';

export interface Soberano {
  id: string;
  nombre: string;
  etapa: string;
  valor: number;
  probabilidad: number;
}

export interface ActivoFlota {
  id: string;
  modelo: string;
  matricula: string;
  estado: 'DISPONIBLE' | 'EN_SERVICIO' | 'MANTENIMIENTO';
  bateria: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  nivel: string;
  mensaje: string;
  tipo: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

interface EmpireState {
  soberanos: Soberano[];
  pipeline: number;
  flota: ActivoFlota[];
  logs: SystemLog[];
  
  // Acciones
  addSoberano: (s: Soberano) => void;
  updatePipeline: () => void;
  setFlota: (f: ActivoFlota[]) => void;
  addLog: (l: Omit<SystemLog, 'id' | 'timestamp'>) => void;
}

export const useEmpireStore = create<EmpireState>((set, get) => ({
  soberanos: [],
  pipeline: 0,
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
    const newLog: SystemLog = {
      ...l,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString()
    };
    set((state) => ({ logs: [newLog, ...state.logs].slice(0, 50) }));
  }
}));
