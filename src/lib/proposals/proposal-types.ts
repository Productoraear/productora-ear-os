/**
 * 📜 EAR OS V2 — TIPOS DE DOMINIO PARA PROPUESTAS S-CLASS
 * ------------------------------------------------------------------
 * Contratos de datos inmutables para el motor de cotizaciones,
 * telemetría, firma digital y split soberano 80/10/10.
 */

export type ProposalStatus = 
  | 'borrador'
  | 'enviado'
  | 'visto'
  | 'en_conversacion'
  | 'ganado'
  | 'perdido'
  | 'expirado';

export interface ProposalLineItem {
  id: string;
  codigo?: string;
  capitulo: string;
  descripcion: string;
  unidad: string;
  medicion: number;
  precioUnitarioCéntimos: number; // en céntimos
  totalCéntimos: number; // en céntimos (precioUnitarioCéntimos * medicion)
  esOpcional: boolean;
  seleccionada: boolean; // si el cliente la tiene activa
  esAmarilla: boolean; // fuera de catálogo o confianza baja
  motivoIa?: string;
}

export interface ProposalSignature {
  fecha: string;
  hora: string;
  ip: string;
  dispositivo: string;
  pngBase64: string;
}

export interface ProposalClientData {
  nombre: string;
  email: string;
  telefono: string;
  fincaOEspacio: string;
  poblacion: string;
  provincia: string;
  fechaEvento: string;
  paxEstimado: number;
}

export interface SovereignSplitBreakdown {
  artistaCéntimos: number; // 80%
  earOsCéntimos: number;   // 10%
  vimumeCéntimos: number;  // 10%
  totalCéntimos: number;
}

export interface ProposalBudgetTotals {
  baseCéntimos: number;
  ivaPct: number;
  ivaImporteCéntimos: number;
  totalCéntimos: number;
  depositoStripeCéntimos: number; // 10000 (100,00 €)
  split: SovereignSplitBreakdown;
}

export interface SovereignProposal {
  id: string;
  numero: string; // ej. "EAR-2026-089"
  token: string;  // token público indescifrable
  titulo: string;
  estado: ProposalStatus;
  cliente: ProposalClientData;
  lineas: ProposalLineItem[];
  ivaPct: number; // 21
  descuentoPct: number;
  caducidadDias: number; // por defecto 14
  creadoEn: string;
  enviadoEn?: string;
  expiraEn: string;
  respondidoEn?: string;
  firma?: ProposalSignature;
  stripePaymentIntentId?: string;
  priceLockHash?: string;
}

export interface ReadingTelemetryEvent {
  token: string;
  visitanteId: string;
  visitaNumero: number;
  seccion?: 'cabecera' | 'resumen' | 'capitulos' | 'opcionales' | 'total' | 'firma' | 'stripe';
  duracionSegundos?: number;
  ip?: string;
  ciudad?: string;
  pais?: string;
  dispositivo?: string;
  ts: number;
}
