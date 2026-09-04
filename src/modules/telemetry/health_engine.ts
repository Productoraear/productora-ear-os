export interface SystemHealthStatus {
  modulo: string;
  estado: 'ONLINE' | 'STANDBY' | 'OPTIMIZADO';
  latenciaMs: number;
}

export const SYSTEM_HEALTH_CHECK: SystemHealthStatus[] = [
  { modulo: 'Cockpit B2G & Magnates NDA', estado: 'ONLINE', latenciaMs: 14 },
  { modulo: 'Motor de Afiliados Nativo', estado: 'OPTIMIZADO', latenciaMs: 8 },
  { modulo: 'Pasarela de Conversión WhatsApp', estado: 'ONLINE', latenciaMs: 11 },
  { modulo: 'Base SSOT Histórica (Edwin Agudelo)', estado: 'OPTIMIZADO', latenciaMs: 5 },
  { modulo: 'Orquestador de Enjambre (GPU RX 7900 XTX)', estado: 'ONLINE', latenciaMs: 22 }
];
