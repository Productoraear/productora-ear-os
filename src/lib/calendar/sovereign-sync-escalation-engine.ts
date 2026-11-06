/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🔄 EAR OS — MOTOR DE SINCRONIZACIÓN DINÁMICA & ESCALADO AUTÓNOMO AL CEO
 * ════════════════════════════════════════════════════════════════════════════
 * Gobierna las advertencias y avisos cuando:
 * 1. Un artista/proveedor bloquea o modifica fechas en su calendario.
 * 2. Un proveedor añade un producto/servicio nuevo al catálogo.
 * 3. El Admin emite una nueva política comercial o acústica.
 *
 * PROTOCOLO DE ESCALADO AUTOMÁTICO:
 * - Pre-aviso inmediato al CEO para revisión o corrección.
 * - Si es tema URGENTE (> 3 días sin resolver) -> Alerta al Responsable de Marketing.
 * - Si es tema ORDINARIO (> 15 días postergado) -> Segunda advertencia al CEO y
 *   notificación transparente al Proveedor para resolución asistida.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type AlertUrgency = 'CRITICA' | 'ALTA' | 'ORDINARIA';
export type AlertStatus = 'PENDIENTE_CEO' | 'ESCALADO_MARKETING' | 'AVISADO_PROVEEDOR' | 'RESUELTO';

export interface SovereignSystemAlert {
  readonly id: string;
  readonly entityId: string;
  readonly entityName: string;
  readonly entityType: 'ARTISTA' | 'PROVEEDOR' | 'FINCA' | 'SISTEMA';
  readonly eventKind: 'BLOQUEO_FECHA' | 'NUEVO_SERVICIO' | 'CAMBIO_POLITICA' | 'DISCREPANCIA_CATALOGO';
  readonly urgency: AlertUrgency;
  readonly description: string;
  readonly proposedAction: string;
  readonly createdAt: string;
  daysPending: number;
  status: AlertStatus;
  ceoCorrected: boolean;
  notifiedStakeholders: string[];
}

export const CENTRALITA_WHATSAPP_CEO = '+34693693048';
export const EMAIL_RESPONSABLE_MARKETING = 'marketing@productoraear.com';

/** Memoria viva de alertas operativas */
export const SOVEREIGN_ACTIVE_ALERTS: SovereignSystemAlert[] = [
  {
    id: 'alt-001',
    entityId: 'restaurante-eduardo-martinez',
    entityName: 'Restaurante Eduardo Martínez (Ezkertza Berria)',
    entityType: 'FINCA',
    eventKind: 'NUEVO_SERVICIO',
    urgency: 'ALTA',
    description: 'Se ha vinculado el Constructor Colectivo de 10 casillas con reserva de fechas 2026.',
    proposedAction: 'Validar la tarifa de exclusividad y el rider Bose F1 homologado.',
    createdAt: new Date().toISOString(),
    daysPending: 1,
    status: 'PENDIENTE_CEO',
    ceoCorrected: false,
    notifiedStakeholders: ['CEO (+34 693 693 048)'],
  },
];

/**
 * Centinela de Escalado Temporal:
 * Evalúa los días transcurridos y ejecuta el protocolo de escalado.
 */
export function processSovereignAlertEscalation(alert: SovereignSystemAlert): {
  actionTaken: string;
  newStatus: AlertStatus;
  notifyTarget: string;
} {
  // Caso 1: Urgente / Relevante y tarda más de 3 días
  if ((alert.urgency === 'CRITICA' || alert.urgency === 'ALTA') && alert.daysPending >= 3 && alert.status === 'PENDIENTE_CEO') {
    alert.status = 'ESCALADO_MARKETING';
    alert.notifiedStakeholders.push(EMAIL_RESPONSABLE_MARKETING);
    return {
      actionTaken: 'Escalado preventivo al Responsable de Marketing por superar el umbral de 3 días sin resolución.',
      newStatus: 'ESCALADO_MARKETING',
      notifyTarget: EMAIL_RESPONSABLE_MARKETING,
    };
  }

  // Caso 2: Postergado más de 15 días
  if (alert.daysPending >= 15 && alert.status !== 'AVISADO_PROVEEDOR') {
    alert.status = 'AVISADO_PROVEEDOR';
    alert.notifiedStakeholders.push(`PROVEEDOR (${alert.entityName})`);
    return {
      actionTaken: 'Aviso directo al proveedor emitido de forma transparente para acordar solución conjunta con el CEO.',
      newStatus: 'AVISADO_PROVEEDOR',
      notifyTarget: alert.entityName,
    };
  }

  return {
    actionTaken: 'Alerta en plazo ordinario de revisión del CEO.',
    newStatus: alert.status,
    notifyTarget: CENTRALITA_WHATSAPP_CEO,
  };
}

/**
 * Disparador de eventos cuando un proveedor añade un servicio o bloquea fecha
 */
export function registerEntityEvent(
  entityId: string,
  entityName: string,
  entityType: SovereignSystemAlert['entityType'],
  eventKind: SovereignSystemAlert['eventKind'],
  description: string,
  urgency: AlertUrgency = 'ALTA'
): SovereignSystemAlert {
  const newAlert: SovereignSystemAlert = {
    id: `alt-${Date.now()}`,
    entityId,
    entityName,
    entityType,
    eventKind,
    urgency,
    description,
    proposedAction: 'Revisión en panel de control por el CEO antes de consolidación definitiva.',
    createdAt: new Date().toISOString(),
    daysPending: 0,
    status: 'PENDIENTE_CEO',
    ceoCorrected: false,
    notifiedStakeholders: ['CEO (+34 693 693 048)'],
  };

  SOVEREIGN_ACTIVE_ALERTS.unshift(newAlert);
  return newAlert;
}

