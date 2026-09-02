/**
 * 🎛️ AIRBNB-STYLE ULTRA-FILTERS & TECHNICAL SPECIFICATIONS SCHEMA (S-CLASS)
 * Cobertura de 6 dimensiones: Espacio, Electricidad, Rider Técnico, Protocolo, Logística y Compliance B2G.
 */

export interface VenueSpaceFilters {
  venueType: 'jardin-finca' | 'salon-carpa' | 'teatro-auditorio' | 'plaza-exterior' | 'piso-chalet';
  ceilingAcoustics: 'reverberacion-alta' | 'acustica-controlada' | 'abierto-sin-paredes';
  noiseRestriction: 'limitador-opcat' | 'sin-limitador' | 'residencial-sensible';
}

export interface ElectricalLogisticsFilters {
  powerSupply: 'monofasica-220v' | 'trifasica-32a' | 'grupo-electrogeno';
  stageAccess: 'pie-calle' | 'montacargas-ascensor' | 'escaleras-sin-ascensor';
  cableDistance: 'menor-15m' | '15-50m' | 'mayor-50m';
}

export interface TechnicalRiderFilters {
  lightingTier: 'basica-escena' | 'robotica-led-cabezas' | 'humo-denso-fuego-frio' | 'arquitectonica-finca';
  trussStructures: 'sin-truss' | 'truss-t' | 'puente-luces-6x4' | 'escenario-homologado';
  soundMicrophony: string[]; // ['solapa-diadema', 'presidencia-discursos', 'grabacion-multipista']
}

export interface EventProtocolFilters {
  performanceMoments: string[]; // ['entrada-sorpresa', 'coctel-bienvenida', 'banquete', 'barra-libre', 'ceremonia']
  rehearsalLevel: 'prueba-t120' | 'ensayo-dia-previo';
}

export interface StaffLogisticsFilters {
  accommodationRequired: boolean; // >300km o noche
  cateringStaffOption: 'cliente-invita' | 'dieta-compensada';
}

export interface ComplianceB2GFilters {
  billingType: 'particular-iva' | 'empresa-b2b' | 'ayuntamiento-b2g';
  safetyInsurance: 'rc-estandar-1m' | 'rc-ampliada-2m' | 'plan-prl-requerido';
}

export interface SClassUltraFilters {
  space: VenueSpaceFilters;
  electrical: ElectricalLogisticsFilters;
  rider: TechnicalRiderFilters;
  protocol: EventProtocolFilters;
  logistics: StaffLogisticsFilters;
  compliance: ComplianceB2GFilters;
}

export const DEFAULT_ULTRA_FILTERS: SClassUltraFilters = {
  space: {
    venueType: 'jardin-finca',
    ceilingAcoustics: 'acustica-controlada',
    noiseRestriction: 'sin-limitador'
  },
  electrical: {
    powerSupply: 'monofasica-220v',
    stageAccess: 'pie-calle',
    cableDistance: '15-50m'
  },
  rider: {
    lightingTier: 'basica-escena',
    trussStructures: 'sin-truss',
    soundMicrophony: ['presidencia-discursos']
  },
  protocol: {
    performanceMoments: ['coctel-bienvenida'],
    rehearsalLevel: 'prueba-t120'
  },
  logistics: {
    accommodationRequired: false,
    cateringStaffOption: 'cliente-invita'
  },
  compliance: {
    billingType: 'particular-iva',
    safetyInsurance: 'rc-estandar-1m'
  }
};

/**
 * Calcula el impacto en el precio y las especificaciones del Rider técnico derivado de los ultra-filtros.
 */
export function calculateFilterSurcharges(filters: SClassUltraFilters): {
  surchargeAmount: number;
  riderSpecs: string[];
  activeCount: number;
} {
  let surcharge = 0;
  const specs: string[] = [];
  let count = 0;

  // 1. Espacio & Acústica
  if (filters.space.venueType === 'jardin-finca') {
    specs.push('Calibración acústica para campo abierto con dispersión Bose F1');
  } else if (filters.space.venueType === 'piso-chalet') {
    specs.push('Atenuación acústica de baja vibración (Inteligibilidad a bajo volumen)');
    count++;
  } else if (filters.space.venueType === 'plaza-exterior') {
    specs.push('Array acústico de alta presión con refuerzo en sub-graves 12 W/pax');
    surcharge += 150;
    count++;
  }

  if (filters.space.noiseRestriction === 'limitador-opcat') {
    specs.push('Compatibilidad con limitador acústico municipal OPCAT (Control de picos)');
    count++;
  } else if (filters.space.noiseRestriction === 'residencial-sensible') {
    specs.push('Directividad cardioide para evitar fugas a zonas vecinales');
    count++;
  }

  // 2. Electricidad & Logística
  if (filters.electrical.powerSupply === 'grupo-electrogeno') {
    surcharge += 280;
    specs.push('Cuadro de protección eléctrica con estabilizador para grupo electrógeno');
    count++;
  } else if (filters.electrical.powerSupply === 'trifasica-32a') {
    specs.push('Acometida CETAC Trifásica 32A/63A');
    count++;
  }

  if (filters.electrical.stageAccess === 'escaleras-sin-ascensor') {
    surcharge += 90;
    specs.push('Plus de porteo técnico manual por tramos de escalera');
    count++;
  }

  if (filters.electrical.cableDistance === 'mayor-50m') {
    surcharge += 60;
    specs.push('Tirada de manguera de señal balanceada y corriente >50m');
    count++;
  }

  // 3. Rider & Iluminación
  if (filters.rider.lightingTier === 'robotica-led-cabezas') {
    surcharge += 350;
    specs.push('Puente de iluminación DMX con 4 cabezas móviles Beam/Wash');
    count++;
  } else if (filters.rider.lightingTier === 'humo-denso-fuego-frio') {
    surcharge += 450;
    specs.push('Efectos especiales: Máquina de humo bajo criogénico + 2 fuentes de fuego frío');
    count++;
  } else if (filters.rider.lightingTier === 'arquitectonica-finca') {
    surcharge += 400;
    specs.push('Baño de color arquitectónico perimetral inalámbrico (IP65)');
    count++;
  }

  if (filters.rider.trussStructures === 'puente-luces-6x4') {
    surcharge += 500;
    specs.push('Estructura Trussing 6x4m homologada con visado de carga');
    count++;
  } else if (filters.rider.trussStructures === 'escenario-homologado') {
    surcharge += 850;
    specs.push('Tarima escénica homologada antideslizante con escalera de acceso');
    count++;
  }

  if (filters.rider.soundMicrophony.includes('solapa-diadema')) {
    surcharge += 80;
    specs.push('Micrófono de diadema Shure Axient Digital para oficiante/novios');
    count++;
  }
  if (filters.rider.soundMicrophony.includes('grabacion-multipista')) {
    surcharge += 220;
    specs.push('Grabación multipista de audio directo en vivo 32-bit float');
    count++;
  }

  // 4. Protocolo & Ensayos
  if (filters.protocol.rehearsalLevel === 'ensayo-dia-previo') {
    surcharge += 180;
    specs.push('Ensayo presencial con director técnico y novios en víspera del evento');
    count++;
  }
  if (filters.protocol.performanceMoments.length > 2) {
    surcharge += (filters.protocol.performanceMoments.length - 2) * 90;
    specs.push(`Cobertura extendida para ${filters.protocol.performanceMoments.length} momentos del evento`);
    count++;
  }

  // 5. Dietas & Pernocta
  if (filters.logistics.accommodationRequired) {
    surcharge += 250;
    specs.push('Alojamiento y dietas de staff técnico y artistas garantizadas');
    count++;
  }
  if (filters.logistics.cateringStaffOption === 'dieta-compensada') {
    surcharge += 75;
    specs.push('Dieta de staff compensada directamente en factura');
    count++;
  }

  // 6. Compliance & Seguros
  if (filters.compliance.safetyInsurance === 'rc-ampliada-2m') {
    surcharge += 120;
    specs.push('Póliza de Responsabilidad Civil ampliada a 2.000.000 €');
    count++;
  }
  if (filters.compliance.billingType === 'ayuntamiento-b2g') {
    specs.push('Expediente y memoria administrativa Art. 118 LCSP con código DIR3');
    count++;
  }

  return {
    surchargeAmount: surcharge,
    riderSpecs: specs,
    activeCount: count
  };
}
