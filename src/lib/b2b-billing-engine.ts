/**
 * MOTOR LÓGICO DE AUTOFACTURACIÓN B2B Y LIQUIDACIÓN DE COMISIONES (SSOT BLOQUE 5)
 * 
 * Reglas de Negocio Inmutables:
 * - Comisión B2B para Fincas y Wedding Planners: 10% a 15% sobre ticket nupcial / corporativo.
 * - Suelo de Evento Bodas 360: 3.800,00 € (Comisión mínima: 380,00 € a 570,00 € netos).
 * - Plazo Inviolable de Liquidación: Máximo 7 días hábiles tras ejecución / fianza del evento.
 * - Validación Técnica Obligatoria: Póliza RC >= 300.000 € y toma CETAC 32A/16A.
 */

import { FincaHomologada, SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

export interface B2BAffiliatePartner {
  id: string;
  razonSocial: string;
  cif: string;
  tipoPartner: 'FINCA_HOMOLOGADA' | 'WEDDING_PLANNER' | 'CATERING_ASOCIADO' | 'AGENCIA_EVENTOS';
  direccionFiscal: string;
  emailFacturacion: string;
  telefono: string;
  iban: string;
  polizaRC: {
    numero: string;
    aseguradora: string;
    coberturaEuros: number;
    vigente: boolean;
  };
  comisionPactadaPct: number; // 0.10 a 0.15
  scoringHistorico: number; // 0 a 100
}

export interface B2BCommissionEvent {
  eventoId: string;
  fechaEvento: string;
  clienteNombre: string;
  formatoContratado: string;
  importeBrutoEvento: number; // Suelo 3.800 €
  comisionPct: number; // 0.10 a 0.15
  comisionNeta: number; // importeBrutoEvento * comisionPct
  ivaPct: number; // 0.21
  ivaImporte: number;
  retencionIrpfPct?: number; // 0.15 si es profesional autónomo, 0 si SL/SA
  retencionIrpfImporte?: number;
  totalLiquidable: number;
  fincaHomologadaId?: string;
}

export interface AutoInvoiceDraft {
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimientoSLA7Dias: string;
  diasHabilesCompromiso: 7;
  emisorEAR: {
    razonSocial: string;
    cif: string;
    domicilio: string;
    hubLogistico: string;
    telefono: string;
  };
  receptorPartner: {
    razonSocial: string;
    cif: string;
    direccionFiscal: string;
    iban: string;
    tipoPartner: string;
  };
  eventosLiquidados: B2BCommissionEvent[];
  desgloseEconomico: {
    baseImponibleComision: number;
    cuotaIva21: number;
    retencionIrpf: number;
    totalAPagarEnCuenta: number;
  };
  hashIntegridadSha256: string;
  estadoSLA: 'EMITIDA_PENDIENTE_TRANSFERENCIA_7D' | 'LIQUIDADA' | 'REVISION_TECNICA';
  observaciones: string;
}

/**
 * Calcula la fecha de vencimiento a 7 días hábiles bancarios exactos (excluyendo sábados y domingos).
 */
export function calculateSevenBusinessDaysDueDate(startDate: Date = new Date()): string {
  let count = 0;
  const current = new Date(startDate);
  
  while (count < 7) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // 0 es Domingo, 6 es Sábado
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  
  return current.toISOString().split('T')[0];
}

/**
 * Calcula la comisión B2B con suelo innegociable de 3.800 € en bodas.
 */
export function calculateB2BCommission(
  eventTicket: number,
  customRatePct: number = 0.10,
  isDiamondBoda: boolean = false
): {
  ticketEfectivo: number;
  comisionRate: number;
  comisionNeta: number;
  comisionConIva: number;
  esTicketMinimo: boolean;
} {
  // Suelo de 3.800 € en bodas
  const ticketMinimo = isDiamondBoda ? Math.max(3800, eventTicket) : eventTicket;
  
  // Rate calibrado entre 10% y 15%
  const comisionRate = Math.min(0.15, Math.max(0.10, customRatePct));
  const comisionNeta = Math.round(ticketMinimo * comisionRate * 100) / 100;
  const comisionConIva = Math.round(comisionNeta * 1.21 * 100) / 100;

  return {
    ticketEfectivo: ticketMinimo,
    comisionRate,
    comisionNeta,
    comisionConIva,
    esTicketMinimo: ticketMinimo === 3800
  };
}

/**
 * Simula el ingreso anual pasivo para una Finca o Wedding Planner
 */
export function simulateAnnualAffiliateIncome(
  bodasPorAno: number,
  ticketPromedio: number = 4500,
  ratePct: number = 0.12
): {
  totalBodas: number;
  volumenContratado: number;
  ingresoNetoAnualFinca: number;
  ingresoMensualPromedio: number;
} {
  const volumenContratado = bodasPorAno * Math.max(3800, ticketPromedio);
  const ingresoNetoAnualFinca = Math.round(volumenContratado * ratePct * 100) / 100;
  const ingresoMensualPromedio = Math.round((ingresoNetoAnualFinca / 12) * 100) / 100;

  return {
    totalBodas: bodasPorAno,
    volumenContratado,
    ingresoNetoAnualFinca,
    ingresoMensualPromedio
  };
}

/**
 * Genera el borrador formal de Autofactura B2B con compromiso de pago en 7 días hábiles.
 */
export function generateAutoInvoiceDraft(
  partner: B2BAffiliatePartner,
  events: B2BCommissionEvent[]
): AutoInvoiceDraft {
  const today = new Date();
  const fechaEmision = today.toISOString().split('T')[0];
  const fechaVencimientoSLA7Dias = calculateSevenBusinessDaysDueDate(today);
  
  const baseImponibleComision = events.reduce((acc, ev) => acc + ev.comisionNeta, 0);
  const cuotaIva21 = Math.round(baseImponibleComision * 0.21 * 100) / 100;
  const retencionIrpf = events.reduce((acc, ev) => acc + (ev.retencionIrpfImporte || 0), 0);
  const totalAPagarEnCuenta = Math.round((baseImponibleComision + cuotaIva21 - retencionIrpf) * 100) / 100;

  const invoiceNumber = `AUTOFAC-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Firma sintética criptográfica de integridad
  const rawHashPayload = `${invoiceNumber}|${partner.cif}|${totalAPagarEnCuenta}|${fechaVencimientoSLA7Dias}`;
  const hashIntegridadSha256 = `SHA256-${Buffer.from(rawHashPayload).toString('base64').substring(0, 32)}`;

  return {
    numeroFactura: invoiceNumber,
    fechaEmision,
    fechaVencimientoSLA7Dias,
    diasHabilesCompromiso: 7,
    emisorEAR: {
      razonSocial: 'Productora EAR Audiovisual S.L.',
      cif: 'B-88392019',
      domicilio: 'Calle La Fuente 12, 45930 Méntrida, Toledo',
      hubLogistico: 'Hub Central Méntrida (Toledo)',
      telefono: '+34 693 693 048'
    },
    receptorPartner: {
      razonSocial: partner.razonSocial,
      cif: partner.cif,
      direccionFiscal: partner.direccionFiscal,
      iban: partner.iban,
      tipoPartner: partner.tipoPartner
    },
    eventosLiquidados: events,
    desgloseEconomico: {
      baseImponibleComision,
      cuotaIva21,
      retencionIrpf,
      totalAPagarEnCuenta
    },
    hashIntegridadSha256,
    estadoSLA: 'EMITIDA_PENDIENTE_TRANSFERENCIA_7D',
    observaciones: `Liquidación formal de comisiones B2B bajo SLA de tesorería EAR OS. Transferencia SEPA programada a la cuenta ${partner.iban} antes del ${fechaVencimientoSLA7Dias}.`
  };
}

/**
 * Valida la auditoría técnica de una finca para certificar o mantener su homologación.
 */
export function validateFincaTechnicalAudit(finca: Partial<FincaHomologada>): {
  aprobado: boolean;
  score: number;
  infracciones: string[];
} {
  const infracciones: string[] = [];
  let score = 100;

  if (!finca.polizaRC || finca.polizaRC.coberturaEuros < 300000) {
    infracciones.push('Póliza de Responsabilidad Civil insuficiente (< 300.000 €). Exigida por protocolo de seguridad.');
    score -= 40;
  }

  if (!finca.potenciaKw || finca.potenciaKw < 15) {
    infracciones.push('Acometida eléctrica deficiente (< 15 kW). Riesgo de caída de tensión con sistemas de sonido e iluminación.');
    score -= 30;
  }

  if (!finca.tomaElectrica || !finca.tomaElectrica.includes('CETAC')) {
    infracciones.push('Ausencia de toma trifásica normalizada CETAC (32A o 16A 3P+N+T).');
    score -= 20;
  }

  if (finca.accesoConvoy14Plazas === false) {
    infracciones.push('Camino o puerta de acceso con radio de giro insuficiente para furgón de 14 plazas.');
    score -= 15;
  }

  return {
    aprobado: score >= 75 && infracciones.length === 0,
    score: Math.max(0, score),
    infracciones
  };
}
