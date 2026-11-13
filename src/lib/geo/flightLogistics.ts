// Motor de Rutas Aéreas, Viáticos y Google Flights Deep Linking EAR OS
export interface EuropeanCityLogistics {
  city: string;
  country: string;
  airportCode: string;
  flightCostPerPerson: number;
  hotelIndividualBedPerPerson: number;
  dietasPerPerson: number;
}

export const INTERNATIONAL_HUBS: Record<string, EuropeanCityLogistics> = {
  bruselas: {
    city: "Bruselas",
    country: "Bélgica",
    airportCode: "BRU",
    flightCostPerPerson: 220,
    hotelIndividualBedPerPerson: 110,
    dietasPerPerson: 60,
  },
  paris: {
    city: "París",
    country: "Francia",
    airportCode: "CDG",
    flightCostPerPerson: 200,
    hotelIndividualBedPerPerson: 130,
    dietasPerPerson: 70,
  },
  londres: {
    city: "Londres",
    country: "Reino Unido",
    airportCode: "LHR",
    flightCostPerPerson: 230,
    hotelIndividualBedPerPerson: 140,
    dietasPerPerson: 80,
  },
  ginebra: {
    city: "Ginebra",
    country: "Suiza",
    airportCode: "GVA",
    flightCostPerPerson: 250,
    hotelIndividualBedPerPerson: 160,
    dietasPerPerson: 90,
  },
};

/**
 * Genera el Deep Link a Google Flights preconfigurado con origen MAD,
 * destino oficial, fechas y número de asientos para el ensamble.
 */
export function buildGoogleFlightsUrl(
  destinationAirport: string,
  eventDateStr: string,
  passengerCount: number = 1
): string {
  // Fecha de salida: día del evento; fecha de regreso: día siguiente
  const departureDate = eventDateStr || "2026-11-28";
  let returnDate = departureDate;
  try {
    const d = new Date(departureDate);
    d.setDate(d.getDate() + 1);
    returnDate = d.toISOString().split("T")[0];
  } catch {
    returnDate = departureDate;
  }

  // Enlace directo de búsqueda oficial en Google Flights
  const query = `flights from MAD to ${destinationAirport} on ${departureDate} returning ${returnDate}`;
  return `[suspicious link removed]{encodeURIComponent(query)}&curr=EUR`;
}

export function calculateTourPricing(
  musicianCount: number,
  destinationCityKey: string,
  eventDate: string = "2026-11-28"
) {
  const cityKey = destinationCityKey.toLowerCase();
  const hub = INTERNATIONAL_HUBS[cityKey] || INTERNATIONAL_HUBS["bruselas"];

  // 1. Caché Artístico: Edwin 550 € fijos + 200 € por cada músico adicional
  const edwinFee = 550;
  const additionalMusicians = Math.max(0, musicianCount - 1);
  const additionalMusiciansFee = additionalMusicians * 200;
  const totalArtisticFee = edwinFee + additionalMusiciansFee;

  // 2. Viáticos por Persona (Vuelo estimado + Cama individual + Dietas)
  const viaticosPerPerson = hub.flightCostPerPerson + hub.hotelIndividualBedPerPerson + hub.dietasPerPerson;
  const totalViaticos = viaticosPerPerson * musicianCount;

  // 3. Totales y Anticipo Stripe (50%)
  const grandTotal = totalArtisticFee + totalViaticos;
  const depositToPayNow = Math.round(grandTotal * 0.5);

  const googleFlightsUrl = buildGoogleFlightsUrl(hub.airportCode, eventDate, musicianCount);

  return {
    hub,
    musicianCount,
    edwinFee,
    additionalMusicians,
    additionalMusiciansFee,
    totalArtisticFee,
    viaticosPerPerson,
    totalViaticos,
    grandTotal,
    depositToPayNow,
    googleFlightsUrl,
    specs: {
      bedPolicy: "Habitaciones con camas individuales para cada músico",
      flightPolicy: "Vuelos coordinados I/V con equipaje de gala e instrumentos",
      arrivalProtocol: "Presencia en el recinto 2h antes del show",
    },
  };
}