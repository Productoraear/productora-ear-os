
import { Stat } from '../types';

export type DynamicStat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  percent?: number;
};

export const DYNAMIC_STATS: DynamicStat[] = [
  { 
    id: 'experience', 
    label: 'Años de trayectoria', 
    value: 15, 
    suffix: '+', 
    description: 'Más de 15 años creando experiencias emotivas, divertidas y memorables.', 
    percent: 90 
  },
  { 
    id: 'concerts', 
    label: 'Conciertos con éxito', 
    value: 36, 
    suffix: '', 
    description: 'Artistas de primer nivel con un 95% de efectividad y respuesta del público.', 
    percent: 95 
  },
  { 
    id: 'equipment', 
    label: 'Equipos disponibles', 
    value: 500, 
    suffix: '+', 
    description: 'Más de 500 equipos de sonido, pantallas y soluciones técnicas con amplio stock.', 
    percent: 99 
  }
];

// Mantenemos la exportación original para compatibilidad si fuera necesario
export const PERFORMANCE_STATS: Stat[] = DYNAMIC_STATS.map(s => ({
  label: s.label,
  value: `${s.value}${s.suffix || ''}`
}));
