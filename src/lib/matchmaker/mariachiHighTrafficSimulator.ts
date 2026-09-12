import { 
  BASE_HUBS, 
  calculateHaversineDistance, 
  calculateLogisticsFee, 
  calculateAcousticRequirements 
} from '@/features/search/utils/mentridaDistanceEngine';
import { 
  checkScheduleFeasibility, 
  triggerUberFailoverCascade, 
  TimeSlotBooking 
} from './uberDispatchScheduleEngine';

export interface MariachiBookingSimulated {
  id: string;
  squadId: string;
  squadName: string;
  timeSlot: string; // e.g. "09:00 - 10:00"
  startTime: string;
  durationMinutes: number;
  municipality: string;
  lat: number;
  lng: number;
  distanceFromPlazaElipticaKm: number;
  pax: number;
  acousticWatts: number;
  basePrice: number;
  vatAmount: number;
  logisticsFee: number;
  totalGrossPrice: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERTIME_TRIGGERED' | 'UBER_REASSIGNED';
  reassignedToName?: string;
  logNotes: string;
  // 📍 NUEVOS DETALLES HIPER-PRECISOS (Google Maps Level Detail):
  venueName: string;
  exactAddress: string;
  clientAccessNotes: string;
  parkingInstructions: string;
  clientContactPerson: string;
  clientContactPhone: string;
  mariachiLeadName: string;
  mariachiPhone: string;
  mariachiVehiclePlate: string;
  depositConfirmed: boolean;
  stripePaymentId: string;
}

export interface MariachiSimulationReport {
  date: string;
  totalBookings: number;
  uniqueMariachiSquads: number;
  originBaseName: string;
  originBaseCoords: { lat: number; lng: number };
  totalGrossRevenue: number;
  totalVatAmount: number;
  totalLogisticsFee: number;
  totalAcousticWatts: number;
  successfulReassignments: number;
  cancellationRate: string; // "0%"
  slaCompliance: string; // "100%"
  bookings: MariachiBookingSimulated[];
}

const MADRID_MUNICIPALITIES_SATURDAY = [
  { 
    name: 'Alcorcón', 
    lat: 40.3458, 
    lng: -3.8249, 
    pax: 120, 
    timeSlot: '09:00 - 10:00', 
    startTime: '09:00', 
    duration: 60, 
    price: 450,
    venueName: 'Finca La Alquería (Pabellón de Cristal)',
    exactAddress: 'Autovía del Suroeste A-5, Km 12.800, 28922 Alcorcón',
    clientAccessNotes: 'Entrada de servicio por la cancela negra trasera (no por la entrada de carruajes principal). Descarga a 10 metros del porche.',
    parkingInstructions: 'Aparcamiento reservado junto al muelle de cocina y carpa de catering.',
    clientContactPerson: 'Beatriz Morales (Organizadora de Boda)',
    clientContactPhone: '+34 612 84 92 01',
    mariachiLead: 'Maestro Mateo Villalobos (Voz y Guitarrón)',
    mariachiPhone: '+34 689 33 11 05',
    plate: '8491-LMR (Mercedes-Benz Vito Larga Negra)'
  },
  { 
    name: 'Algete', 
    lat: 40.5975, 
    lng: -3.5002, 
    pax: 200, 
    timeSlot: '16:30 - 17:30', 
    startTime: '16:30', 
    duration: 60, 
    price: 480,
    venueName: 'Finca Soto de Cerrolén',
    exactAddress: 'Carretera M-103, Km 11.200, 28110 Algete',
    clientAccessNotes: 'Tomar el desvío señalizado como "Acceso a Proveedores". Portón rústico con interfono. Decir "Música EAR Mariachis".',
    parkingInstructions: 'Espacio sombreado bajo los chopos junto al patio de bodas.',
    clientContactPerson: 'Javier Aranda (Padre de la Novia)',
    clientContactPhone: '+34 634 11 90 45',
    mariachiLead: 'Maestro Emilio Cárdenas (Trompeta Principal)',
    mariachiPhone: '+34 670 45 88 12',
    plate: '3209-KVB (Volkswagen Caravelle Premium)'
  },
  { 
    name: 'Toledo', 
    lat: 39.8628, 
    lng: -4.0273, 
    pax: 250, 
    timeSlot: '12:00 - 13:00', 
    startTime: '12:00', 
    duration: 60, 
    price: 500,
    venueName: 'Hotel Cigarral El Bosque (Mirador del Tajo)',
    exactAddress: 'Carretera de Navalpino 49, 45004 Toledo',
    clientAccessNotes: 'Subir por la cuesta privada hasta el Cigarral. Punto de descarga en terraza mirador con vistas al Alcázar.',
    parkingInstructions: 'Dársena VIP de carga autorizada frente al salón imperial.',
    clientContactPerson: 'Gonzalo de la Riva (Maitre Ejecutivo)',
    clientContactPhone: '+34 609 52 31 77',
    mariachiLead: 'Maestro Santiago Reyes (Vihuela y Voz)',
    mariachiPhone: '+34 699 12 44 80',
    plate: '5012-MBN (Mercedes-Benz Clase V VIP)'
  },
  { 
    name: 'Alcalá de Henares', 
    lat: 40.4819, 
    lng: -3.3643, 
    pax: 180, 
    timeSlot: '11:00 - 12:00', 
    startTime: '11:00', 
    duration: 60, 
    price: 460,
    venueName: 'Parador de Alcalá (Convento de San Jerónimo)',
    exactAddress: 'Calle Colegios 8, 28801 Alcalá de Henares',
    clientAccessNotes: 'Entrada por el arco histórico de Calle Santo Tomás. Acceso de descarga mediante bolardo automático bajado por recepción.',
    parkingInstructions: 'Plaza reservada en parking subterráneo del Parador (gálibo 2.10m).',
    clientContactPerson: 'Lucía Santamaría (Coordinadora de Eventos)',
    clientContactPhone: '+34 622 71 83 99',
    mariachiLead: 'Maestro Valentín Silva (Violín Concertino)',
    mariachiPhone: '+34 651 89 20 34',
    plate: '9183-LXJ (Mercedes-Benz Vito Tourer)'
  },
  { 
    name: 'Móstoles', 
    lat: 40.3232, 
    lng: -3.8649, 
    pax: 150, 
    timeSlot: '13:30 - 14:30', 
    startTime: '13:30', 
    duration: 60, 
    price: 440,
    venueName: 'Finca La Ribera del Guadarrama',
    exactAddress: 'Camino de los Combos s/n, 28938 Móstoles',
    clientAccessNotes: 'Camino asfaltado hasta la verja blanca. El mariachi actuará durante el cóctel en el jardín central.',
    parkingInstructions: 'Junto a la caseta técnica de sonido exterior.',
    clientContactPerson: 'Óscar Méndez (Novio)',
    clientContactPhone: '+34 666 40 18 55',
    mariachiLead: 'Maestro Rodrigo Zapata (Trompeta y Coros)',
    mariachiPhone: '+34 682 90 14 62',
    plate: '4410-LZW (Ford Tourneo Custom Titan)'
  },
  { 
    name: 'Pozuelo de Alarcón', 
    lat: 40.4372, 
    lng: -3.8136, 
    pax: 300, 
    timeSlot: '20:00 - 21:00', 
    startTime: '20:00', 
    duration: 60, 
    price: 550,
    venueName: 'Palacete de Somosaguas (Jardines de la Marquesa)',
    exactAddress: 'Paseo de la Finca 1, 28223 Pozuelo de Alarcón',
    clientAccessNotes: 'Garita de seguridad privada La Finca. Presentar autorización "Reserva EAR OS #550". Acceso directo a explanada.',
    parkingInstructions: 'Rotonda privada reservada exclusivamente para el convoy musical.',
    clientContactPerson: 'María José Benítez (Wedding Planner)',
    clientContactPhone: '+34 618 90 23 11',
    mariachiLead: 'Maestro Fernando Carrillo (Director General Mariachi)',
    mariachiPhone: '+34 675 01 22 93',
    plate: '1129-MMM (Mercedes-Benz Sprinter VIP Black Edition)'
  },
  { 
    name: 'Guadalajara', 
    lat: 40.6327, 
    lng: -3.1669, 
    pax: 220, 
    timeSlot: '18:00 - 19:00', 
    startTime: '18:00', 
    duration: 60, 
    price: 520,
    venueName: 'Palacio de la Cotilla (Patio Mudéjar)',
    exactAddress: 'Plaza Marqués de Villamejor s/n, 19001 Guadalajara',
    clientAccessNotes: 'Zona peatonal habilitada por permiso municipal. Descarga en puerta lateral de forja.',
    parkingInstructions: 'Calle lateral reservada con conos por Policía Local.',
    clientContactPerson: 'Alonso Hurtado (Regidor de Festejos)',
    clientContactPhone: '+34 639 55 12 80',
    mariachiLead: 'Maestro Camilo Fuentes (Voz Lírica y Vihuela)',
    mariachiPhone: '+34 690 77 34 19',
    plate: '7391-KKP (Mercedes-Benz Vito Larga)'
  },
  { 
    name: 'Getafe', 
    lat: 40.3083, 
    lng: -3.7327, 
    pax: 140, 
    timeSlot: '10:30 - 11:30', 
    startTime: '10:30', 
    duration: 60, 
    price: 430,
    venueName: 'Finca El Chaparral del Cerro de los Ángeles',
    exactAddress: 'Carretera de Toledo A-42, Km 13, 28905 Getafe',
    clientAccessNotes: 'Tomar la vía de servicio hacia la ermita. Entrar por puerta corredera gris de proveedores.',
    parkingInstructions: 'Frente a la carpa de música.',
    clientContactPerson: 'Silvia Domínguez (Hermana del Novio)',
    clientContactPhone: '+34 610 23 88 47',
    mariachiLead: 'Maestro Ignacio Peña (Guitarrón Imperial)',
    mariachiPhone: '+34 647 33 09 81',
    plate: '6018-LTT (Renault Trafic SpaceClass)'
  },
  { 
    name: 'Aranjuez', 
    lat: 40.0333, 
    lng: -3.6026, 
    pax: 260, 
    timeSlot: '17:00 - 18:00', 
    startTime: '17:00', 
    duration: 60, 
    price: 490,
    venueName: 'Finca La Montaña de Aranjuez (Mirador Real)',
    exactAddress: 'Calle de la Reina s/n, 28300 Aranjuez',
    clientAccessNotes: 'Paseo arbolado junto al Tajo. Acceso por el embarcadero histórico.',
    parkingInstructions: 'Dársena de autobuses y proveedores habilitada.',
    clientContactPerson: 'Felipe Sandoval (Director de Protocolo)',
    clientContactPhone: '+34 629 14 78 30',
    mariachiLead: 'Maestro Rafael Galván (Violín y Dirección)',
    mariachiPhone: '+34 671 09 55 42',
    plate: '8310-MCR (Mercedes-Benz Clase V)'
  },
  { 
    name: 'Majadahonda', 
    lat: 40.4722, 
    lng: -3.8714, 
    pax: 190, 
    timeSlot: '15:00 - 16:00', 
    startTime: '15:00', 
    duration: 60, 
    price: 470,
    venueName: 'Finca Monte de las Encinas',
    exactAddress: 'Carretera de Boadilla a Majadahonda Km 4, 28220 Majadahonda',
    clientAccessNotes: 'Bajar por el camino de pinos hasta el templete de la ceremonia. Microfonía lista.',
    parkingInstructions: 'Detrás del pabellón acristalado.',
    clientContactPerson: 'Cristina Vega (Organizadora)',
    clientContactPhone: '+34 648 92 10 33',
    mariachiLead: 'Maestro Gabriel Rosas (Trompeta Primera)',
    mariachiPhone: '+34 680 14 77 96',
    plate: '2941-KZZ (Volkswagen Multivan Highline)'
  },
  { 
    name: 'Las Rozas', 
    lat: 40.4925, 
    lng: -3.8739, 
    pax: 210, 
    timeSlot: '21:30 - 22:30', 
    startTime: '21:30', 
    duration: 60, 
    price: 510,
    venueName: 'Finca Las Jarillas (Pinar de las Rozas)',
    exactAddress: 'Carretera de la Coruña A-6, Km 19.800, 28230 Las Rozas',
    clientAccessNotes: 'Puerta trasera junto al helipuerto privado. Anunciarse con el vigilante.',
    parkingInstructions: 'Plaza reservada con enchufe Schuko para recarga si es necesario.',
    clientContactPerson: 'Eduardo Campillo (Novio)',
    clientContactPhone: '+34 608 44 29 15',
    mariachiLead: 'Maestro Arturo Benítez (Voz Solista)',
    mariachiPhone: '+34 692 88 41 07',
    plate: '5739-LPP (Mercedes-Benz Vito Larga)'
  },
  { 
    name: 'Fuenlabrada', 
    lat: 40.2842, 
    lng: -3.7942, 
    pax: 160, 
    timeSlot: '12:30 - 13:30', 
    startTime: '12:30', 
    duration: 60, 
    price: 450,
    venueName: 'Hacienda Jacaranda Sur',
    exactAddress: 'Avenida de la Hispanidad 45, 28945 Fuenlabrada',
    clientAccessNotes: 'Entrada directa a la pérgola de verano.',
    parkingInstructions: 'Aparcamiento techado de la finca.',
    clientContactPerson: 'Patricia Salcedo (Madre de la Novia)',
    clientContactPhone: '+34 615 39 88 02',
    mariachiLead: 'Maestro Héctor Vargas (Guitarrón)',
    mariachiPhone: '+34 656 21 99 43',
    plate: '9021-MFF (Peugeot Traveller VIP)'
  },
  { 
    name: 'Leganés', 
    lat: 40.3281, 
    lng: -3.7644, 
    pax: 175, 
    timeSlot: '14:00 - 15:00', 
    startTime: '14:00', 
    duration: 60, 
    price: 440,
    venueName: 'Finca Los Olivos del Parque de Butarque',
    exactAddress: 'Paseo de la Ermita 12, 28914 Leganés',
    clientAccessNotes: 'Acceso por puerta verde con cartel "Eventos Privados".',
    parkingInstructions: 'Plaza reservada junto a la cocina exterior.',
    clientContactPerson: 'Raúl Garrido (Novio)',
    clientContactPhone: '+34 633 80 14 72',
    mariachiLead: 'Maestro Andrés Montero (Vihuela y Voz)',
    mariachiPhone: '+34 677 30 19 88',
    plate: '4182-KRR (Mercedes-Benz Vito)'
  },
  { 
    name: 'Boadilla del Monte', 
    lat: 40.4072, 
    lng: -3.8828, 
    pax: 280, 
    timeSlot: '19:30 - 20:30', 
    startTime: '19:30', 
    duration: 60, 
    price: 540,
    venueName: 'Antiguo Convento de Boadilla del Monte',
    exactAddress: 'Calle de las Monjas s/n, 28660 Boadilla del Monte',
    clientAccessNotes: 'Entrada señorial por el claustro de la encina. Descarga por el portón de madera antiguo.',
    parkingInstructions: 'Aparcamiento interior privado del convento.',
    clientContactPerson: 'Victoria Serrano (Event Planner)',
    clientContactPhone: '+34 620 95 33 17',
    mariachiLead: 'Maestro Daniel Osorio (Trompeta y Dirección)',
    mariachiPhone: '+34 693 42 11 09',
    plate: '6810-MLD (Mercedes-Benz Clase V)'
  },
  { 
    name: 'San Sebastián de los Reyes', 
    lat: 40.5469, 
    lng: -3.6264, 
    pax: 230, 
    timeSlot: '18:30 - 19:30', 
    startTime: '18:30', 
    duration: 60, 
    price: 490,
    venueName: 'Finca La Muñoza (Jardines del Pardo)',
    exactAddress: 'Carretera de Fuencarral a Alcobendas Km 3.8, 28703 San Sebastián de los Reyes',
    clientAccessNotes: 'Paso por garita de seguridad de la fundación. Seguir flechas "Pabellón de Cristal".',
    parkingInstructions: 'Junto a la caseta de control eléctrico.',
    clientContactPerson: 'Álvaro Carvajal (Wedding Planner)',
    clientContactPhone: '+34 649 12 77 65',
    mariachiLead: 'Maestro Lucas Miranda (Violín y Coros)',
    mariachiPhone: '+34 661 90 28 34',
    plate: '1904-KZL (Volkswagen Crafter Shuttle)'
  },
  { 
    name: 'Torrejón de Ardoz', 
    lat: 40.4578, 
    lng: -3.4794, 
    pax: 165, 
    timeSlot: '11:30 - 12:30', 
    startTime: '11:30', 
    duration: 60, 
    price: 450,
    venueName: 'Hacienda del Cardenal de Alcalá',
    exactAddress: 'Paseo de la Concordia 8, 28850 Torrejón de Ardoz',
    clientAccessNotes: 'Entrada lateral junto al lago artificial. Escenario preparado con toma trifásica.',
    parkingInstructions: 'Plaza reservada frente a la puerta del camerino.',
    clientContactPerson: 'Nerea Calvo (Novia)',
    clientContactPhone: '+34 617 48 93 21',
    mariachiLead: 'Maestro David Quintero (Trompeta y Guitarrón)',
    mariachiPhone: '+34 684 02 19 50',
    plate: '7520-LXN (Mercedes-Benz Vito)'
  }
];

export function runHighTrafficMariachiSimulation(injectOvertime: boolean = false): MariachiSimulationReport {
  const plazaEliptica = BASE_HUBS.MARIACHIS;
  const bookings: MariachiBookingSimulated[] = [];
  
  let totalGrossRevenue = 0;
  let totalVatAmount = 0;
  let totalLogisticsFee = 0;
  let totalAcousticWatts = 0;
  let successfulReassignments = 0;

  // 32 Agrupaciones de Mariachis S-Class (Generación de los 32 bolos del sábado)
  for (let i = 0; i < 32; i++) {
    const muni = MADRID_MUNICIPALITIES_SATURDAY[i % MADRID_MUNICIPALITIES_SATURDAY.length];
    const squadIndex = (i % 8) + 1;
    const squadId = `mariachi-squad-0${squadIndex}`;
    const squadName = `Mariachi S-Class Squad #${squadIndex} (Plaza Elíptica Hub)`;

    const distanceKm = calculateHaversineDistance(muni.lat, muni.lng, plazaEliptica.lat, plazaEliptica.lng);
    const logistics = calculateLogisticsFee(distanceKm, 2);
    const acoustic = calculateAcousticRequirements(muni.pax);

    const basePrice = muni.price;
    const vatAmount = Math.round(basePrice * 0.21 * 100) / 100;
    const totalGrossPrice = basePrice + vatAmount + logistics.totalLogisticsFee;

    let status: MariachiBookingSimulated['status'] = 'SCHEDULED';
    let reassignedToName: string | undefined = undefined;
    let logNotes = `Salida calculada desde Plaza Elíptica (${distanceKm} km). Buffer de tránsito OK.`;

    // ⚡ INYECCIÓN DE HORAS EXTRA INESPERADAS (Simulación de estrés)
    if (injectOvertime && (i === 0 || i === 4 || i === 8)) {
      status = 'OVERTIME_TRIGGERED';
      logNotes = `⚠️ Cliente solicita +5 horas extra. El tiempo restante para el siguiente bolo de las 16:30 es insuficiente (<60 min buffer).`;
      
      // Disparo de la Cascada de Relevo Uber
      const backupSquad = `Mariachi S-Class Squad #${squadIndex + 1} (Relevo Uber)`;
      reassignedToName = backupSquad;
      status = 'UBER_REASSIGNED';
      successfulReassignments++;
      logNotes += ` ⚡ CASCADA RELEVO UBER: Reasignado a ${backupSquad} con salida inmediata desde Plaza Elíptica.`;
    }

    totalGrossRevenue += totalGrossPrice;
    totalVatAmount += vatAmount;
    totalLogisticsFee += logistics.totalLogisticsFee;
    totalAcousticWatts += acoustic.wattsRms;

    bookings.push({
      id: `sim-booking-${i + 1}`,
      squadId,
      squadName,
      timeSlot: muni.timeSlot,
      startTime: muni.startTime,
      durationMinutes: muni.duration,
      municipality: `${muni.name} (Madrid)`,
      lat: muni.lat,
      lng: muni.lng,
      distanceFromPlazaElipticaKm: distanceKm,
      pax: muni.pax,
      acousticWatts: acoustic.wattsRms,
      basePrice,
      vatAmount,
      logisticsFee: logistics.totalLogisticsFee,
      totalGrossPrice,
      status,
      reassignedToName,
      logNotes,
      // Metadatos de precisión hiper-detallados:
      venueName: muni.venueName,
      exactAddress: muni.exactAddress,
      clientAccessNotes: muni.clientAccessNotes,
      parkingInstructions: muni.parkingInstructions,
      clientContactPerson: muni.clientContactPerson,
      clientContactPhone: muni.clientContactPhone,
      mariachiLeadName: muni.mariachiLead,
      mariachiPhone: muni.mariachiPhone,
      mariachiVehiclePlate: muni.plate,
      depositConfirmed: true,
      stripePaymentId: `pi_stripe_100_lock_sha256_${i + 1}_verified`
    });
  }

  return {
    date: 'Próximo Sábado 20 de Septiembre de 2026',
    totalBookings: 32,
    uniqueMariachiSquads: 8,
    originBaseName: plazaEliptica.name,
    originBaseCoords: { lat: plazaEliptica.lat, lng: plazaEliptica.lng },
    totalGrossRevenue: Math.round(totalGrossRevenue * 100) / 100,
    totalVatAmount: Math.round(totalVatAmount * 100) / 100,
    totalLogisticsFee: Math.round(totalLogisticsFee * 100) / 100,
    totalAcousticWatts,
    successfulReassignments,
    cancellationRate: '0%',
    slaCompliance: '100%',
    bookings
  };
}
