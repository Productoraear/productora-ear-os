/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — DESPACHADOR DE HOJAS DE RUTA Y LOGÍSTICA DE EVENTOS
 * ════════════════════════════════════════════════════════════════════════════
 * Cálculo determinista de dietas, desplazamientos y alojamientos:
 *  - 100 km incluidos en la tarifa estándar (radio base desde Méntrida o Hub).
 *  - 0,50 €/km adicional para distancias superiores a 100 km.
 *  - 80,00 € de dieta y alojamiento en hotel para distancias > 250 km o fin > 02:00.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface LogisticsCalculationInput {
  originHub: string;
  destinationMunicipality: string;
  roundTripKm: number;
  eventEndTime?: string; // HH:mm format, e.g. "03:30"
  customExtraKmEur?: number;
  customHotelEur?: number;
}

export interface LogisticsDispatchReport {
  originHub: string;
  destinationMunicipality: string;
  totalRoundTripKm: number;
  includedKm: number;
  billableExtraKm: number;
  extraKmRateEur: number;
  extraKmCostEur: number;
  hotelRequired: boolean;
  hotelCostEur: number;
  hotelReason?: string;
  totalLogisticsCostEur: number;
  calculatedAt: string;
}

export function dispatchLogisticsRoute(input: LogisticsCalculationInput): LogisticsDispatchReport {
  const includedKm = 100;
  const extraKmRate = input.customExtraKmEur ?? 0.50;
  const hotelRate = input.customHotelEur ?? 80.00;

  const totalKm = Math.max(0, input.roundTripKm);
  const billableExtraKm = Math.max(0, totalKm - includedKm);
  const extraKmCostEur = Math.round(billableExtraKm * extraKmRate * 100) / 100;

  let hotelRequired = false;
  let hotelReason: string | undefined;

  // Hotel trigger 1: Long distance (> 250 km)
  if (totalKm > 250) {
    hotelRequired = true;
    hotelReason = `Distancia ida y vuelta (${totalKm} km) supera el umbral seguro de retorno de 250 km.`;
  }

  // Hotel trigger 2: Late night finish (> 02:00 AM)
  if (input.eventEndTime) {
    const [hours] = input.eventEndTime.split(':').map(Number);
    if (!isNaN(hours) && (hours >= 2 && hours <= 6)) {
      hotelRequired = true;
      hotelReason = `Finalización del evento (${input.eventEndTime}) en horario nocturno crítico exige pernocta para prevención de riesgos laborales (PRL).`;
    }
  }

  const hotelCostEur = hotelRequired ? hotelRate : 0.00;
  const totalLogisticsCostEur = Math.round((extraKmCostEur + hotelCostEur) * 100) / 100;

  return {
    originHub: input.originHub,
    destinationMunicipality: input.destinationMunicipality,
    totalRoundTripKm: totalKm,
    includedKm,
    billableExtraKm,
    extraKmRateEur: extraKmRate,
    extraKmCostEur,
    hotelRequired,
    hotelCostEur,
    hotelReason,
    totalLogisticsCostEur,
    calculatedAt: new Date().toISOString()
  };
}
