/**
 * 📜 EAR OS V2 — TIPOS DE DOMINIO PARA PROPUESTAS S-CLASS (VANGUARDIA OMEGA)
 * ------------------------------------------------------------------
 * Contratos de datos inmutables para el motor de cotizaciones,
 * telemetría, firma digital, desglose por fases y split soberano 80/10/10.
 */

export type ProposalStatus = 
  | 'borrador'
  | 'enviado'
  | 'visto'
  | 'en_conversacion'
  | 'ganado'
  | 'perdido'
  | 'expirado';

export type EventPhase = 
  | 'ceremonia'
  | 'coctel'
  | 'banquete'
  | 'baile'
  | 'fiesta'
  | 'iluminacion'
  | 'logistica';

export interface ProposalLineItem {
  id: string;
  codigo?: string;
  fase: EventPhase;
  capitulo: string; // 'Artistas' | 'Sonorización' | 'Iluminación' | 'Efectos' | 'Logística' | 'Fincas' | 'Catering' | 'Fotografía' | 'Decoración' | 'Transporte' | 'Wedding_Planning' | 'Servicios'
  descripcion: string;
  unidad: string;
  medicion: number;
  precioUnitarioCéntimos: number; // en céntimos
  totalCéntimos: number; // en céntimos (precioUnitarioCéntimos * medicion)
  esOpcional: boolean;
  seleccionada: boolean; // si el cliente la tiene activa
  esAmarilla: boolean; // fuera de catálogo o confianza baja
  proveedorVerificado: boolean; // TRUE: Catálogo EAR / ficha verificada | FALSE: Tarifa en homologación
  motivoIa?: string;

  // 🏛️ Vinculación con la Mega Base de Datos (85.946 Proveedores en public/data/providers/)
  proveedorId?: string;
  proveedorNombre?: string;
  proveedorGremio?: string;
  proveedorSlug?: string;
  proveedorImagen?: string;
  proveedorTelefono?: string;
  proveedorRating?: number;
  proveedorReviews?: number;
  detallesTecnicos?: Record<string, string | number | boolean>;
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
  fincaId?: string; // ID en finca.json (9.559 fincas)
  fincaCapacidadPax?: number;
  cateringNombre?: string;
  cateringId?: string; // ID en catering.json (4.096 caterings)
  cateringPrecioPax?: number;
  poblacion: string;
  provincia: string;
  fechaEvento: string;
  paxEstimado: number;
  horaInicio?: string;
  horaFin?: string;
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

export interface ProposalQuestion {
  id: string;
  fecha: string;
  hora: string;
  texto: string;
  respondida: boolean;
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
  imagenesAdjuntas?: string[]; // URLs o Base64 de notas de campo, WhatsApp, etc.
  dudas?: ProposalQuestion[];
  stripePaymentIntentId?: string;
  priceLockHash?: string;
}

export interface ReadingTelemetryEvent {
  token: string;
  visitanteId: string;
  visitaNumero: number;
  seccion?: 'cabecera' | 'resumen' | 'capitulos' | 'opcionales' | 'total' | 'firma' | 'stripe' | 'dudas';
  duracionSegundos?: number;
  ip?: string;
  ciudad?: string;
  pais?: string;
  dispositivo?: string;
  ts: number;
}
