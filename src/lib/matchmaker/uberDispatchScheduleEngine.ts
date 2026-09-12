import { getDistanceKmFromMentrida, calculateLogisticsFee } from '@/features/search/utils/mentridaDistanceEngine';

export interface TimeSlotBooking {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  durationMinutes: number;
  location: string;
  lat: number;
  lng: number;
}

export interface TaxAndPriceBreakdown {
  basePrice: number;
  vatRate: number; // 0.21
  vatAmount: number;
  logisticsFee: number;
  distanceKm: number;
  requiresLodging: boolean;
  totalGrossPrice: number;
  stripeDeposit: number; // 100.00 €
}

export interface ScheduleFeasibilityResult {
  isFeasible: boolean;
  marginMinutes: number;
  requiredBufferMinutes: number;
  travelMinutes: number;
  reason: string;
}

export interface UberFailoverResult {
  cascadeTriggered: boolean;
  originalVendorId: string;
  assignedVendorId: string;
  assignedVendorName: string;
  reason: string;
  status: 'REASSIGNED_SUCCESS' | 'NO_CANDIDATE_FOUND';
}

const MINIMUM_BUFFER_MINUTES = 60; // 1 hora de margen obligatoria entre bolos

/**
 * Calcula el desglose financiero completo con impuestos (IVA 21%), logística y depósito Stripe
 */
export function calculateFullTaxBreakdown(
  basePrice: number,
  province: string = 'Madrid',
  endHour: number = 3,
  gpsCoords?: { lat: number; lng: number } | null
): TaxAndPriceBreakdown {
  const distanceKm = getDistanceKmFromMentrida(province, gpsCoords);
  const logistics = calculateLogisticsFee(distanceKm, endHour);
  const vatRate = 0.21;
  const vatAmount = Math.round(basePrice * vatRate * 100) / 100;
  const totalGrossPrice = Math.round((basePrice + vatAmount + logistics.totalLogisticsFee) * 100) / 100;

  return {
    basePrice,
    vatRate,
    vatAmount,
    logisticsFee: logistics.totalLogisticsFee,
    distanceKm,
    requiresLodging: logistics.requiresLodging,
    totalGrossPrice,
    stripeDeposit: 100.0
  };
}

/**
 * Convierte un string de hora HH:MM a minutos desde las 00:00
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Estima tiempo de trayecto en minutos entre dos ubicaciones GPS (aprox. 1 min/km + 15 min margen urbano)
 */
export function estimateTravelMinutes(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = Math.round(R * c);
  return Math.max(15, Math.round(km * 1.1 + 15));
}

/**
 * Evalúa si un proveedor puede cumplir dos contrataciones consecutivas respetando el buffer mínimo de 60 min
 */
export function checkScheduleFeasibility(
  existingBooking: TimeSlotBooking,
  newBooking: TimeSlotBooking
): ScheduleFeasibilityResult {
  if (existingBooking.date !== newBooking.date) {
    return {
      isFeasible: true,
      marginMinutes: 1440,
      requiredBufferMinutes: MINIMUM_BUFFER_MINUTES,
      travelMinutes: 0,
      reason: 'Fechas distintas. Disponibilidad completa.'
    };
  }

  const gig1Start = parseTimeToMinutes(existingBooking.startTime);
  const gig1End = gig1Start + existingBooking.durationMinutes;

  const gig2Start = parseTimeToMinutes(newBooking.startTime);

  const travelMinutes = estimateTravelMinutes(
    existingBooking.lat,
    existingBooking.lng,
    newBooking.lat,
    newBooking.lng
  );

  const requiredBufferMinutes = travelMinutes + MINIMUM_BUFFER_MINUTES;
  const marginMinutes = gig2Start - gig1End;

  if (marginMinutes >= requiredBufferMinutes) {
    return {
      isFeasible: true,
      marginMinutes,
      requiredBufferMinutes,
      travelMinutes,
      reason: `Margen suficiente (${marginMinutes} min disponibles vs ${requiredBufferMinutes} min requeridos de tránsito + buffer).`
    };
  }

  return {
    isFeasible: false,
    marginMinutes,
    requiredBufferMinutes,
    travelMinutes,
    reason: `Conflicto de horario: Se requieren ${requiredBufferMinutes} min (${travelMinutes} min viaje + 60 min buffer) pero solo se dispone de ${marginMinutes} min.`
  };
}

/**
 * Cascada de Relevo Automático Tipo Uber
 * Si un cliente prolonga horas extra y el buffer es insuficiente, reasigna al siguiente grupo homologado
 */
export function triggerUberFailoverCascade(
  failedBooking: TimeSlotBooking,
  candidatePool: Array<{ id: string; name: string; category: string; rating: number }>
): UberFailoverResult {
  const alternativeCandidates = candidatePool.filter(c => c.id !== failedBooking.vendorId);

  if (alternativeCandidates.length === 0) {
    return {
      cascadeTriggered: true,
      originalVendorId: failedBooking.vendorId,
      assignedVendorId: failedBooking.vendorId,
      assignedVendorName: failedBooking.vendorName,
      reason: 'No hay candidatos de reemplazo en la zona.',
      status: 'NO_CANDIDATE_FOUND'
    };
  }

  // Seleccionar el mejor candidato alternativo (por rating/homologación S-Class)
  const bestReplacement = alternativeCandidates.sort((a, b) => b.rating - a.rating)[0];

  return {
    cascadeTriggered: true,
    originalVendorId: failedBooking.vendorId,
    assignedVendorId: bestReplacement.id,
    assignedVendorName: bestReplacement.name,
    reason: `Horas extra en evento previo consumieron el buffer de tránsito. Reasociado automáticamente a ${bestReplacement.name} (Relevo Tipo Uber S-Class).`,
    status: 'REASSIGNED_SUCCESS'
  };
}
