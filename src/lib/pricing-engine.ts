interface BookingParams {
  distanciaKm: number;
  horaFin: number;
  esPremium: boolean;
}

export interface RateDetails {
  subtotal: number;
  iva: number;
  total: number;
  detalles: {
    tarifaBase: number;
    kmExtra: number;
    hotel: number;
  };
}

export function calculateMariachiRate(params: BookingParams): RateDetails {
  const tarifaBase = params.esPremium ? 350 : 250;
  const kmExtra = params.distanciaKm > 50 ? (params.distanciaKm - 50) * 1.5 : 0;
  const hotel = params.horaFin >= 3 || params.distanciaKm > 200 ? 120 : 0;
  const subtotal = tarifaBase + kmExtra + hotel;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  return {
    subtotal,
    iva,
    total,
    detalles: {
      tarifaBase,
      kmExtra,
      hotel,
    },
  };
}

export type { BookingParams };