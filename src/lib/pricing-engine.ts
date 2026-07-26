export interface BookingParams {
  distanciaKm: number;
  horaFin: number; // Formato 24h (ej: 23)
  esPremium: boolean;
}

export const calculateMariachiRate = (params: BookingParams) => {
  const TARIFA_BASE = 350; // Madrid Soloista Premium
  const PRECIO_KM = 2;
  const COSTE_HOTEL = 150; // Tarifa plana hotel
  
  let total = TARIFA_BASE;
  
  // 1. Cálculo por Kilometraje
  if (params.distanciaKm > 0) {
    total += (params.distanciaKm * PRECIO_KM);
  }
  
  // 2. Lógica de Hospedaje (Regla S-Class)
  // > 200km Y termina después de las 22:00h
  if (params.distanciaKm > 200 && params.horaFin >= 22) {
    total += COSTE_HOTEL;
  }
  
  // En España el IVA de espectáculos puede ser 21% o 10%, usamos 21% como estándar para corporate/general
  const iva = total * 0.21;
  const totalConIva = total + iva;
  
  return {
    subtotal: total,
    iva: iva,
    total: totalConIva,
    detalles: {
      tarifaBase: TARIFA_BASE,
      kmExtra: params.distanciaKm * PRECIO_KM,
      hotel: (params.distanciaKm > 200 && params.horaFin >= 22) ? COSTE_HOTEL : 0
    }
  };
};
