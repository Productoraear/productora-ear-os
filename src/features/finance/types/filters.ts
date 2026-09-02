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

  if (filters.space.ceilingAcoustics === 'reverberacion-alta') {
    specs.push('Filtro notch anti-feedback y ecualización de sala correctora');
    count++;
  }

  if (filters.space.noiseRestriction === 'limitador-opcat') {
    specs.push('Conexión certificada a limitador sonométrico homologado (Cero cortes)');
    count++;
  }

  // 2. Electricidad & Accesos
  if (filters.electrical.powerSupply === 'grupo-electrogeno') {
    specs.push('Generador silenciado estabilizado AVR (Protección N+1)');
    surcharge += 190;
    count++;
  } else if (filters.electrical.powerSupply === 'trifasica-32a') {
    specs.push('Cuadro eléctrico de acometida con protecciones diferenciales');
    count++;
  }

  if (filters.electrical.stageAccess === 'escaleras-sin-ascensor') {
    specs.push('Equipo de carga y porteo manual cualificado');
    surcharge += 80;
    count++;
  }

  if (filters.electrical.cableDistance === 'mayor-50m') {
    specs.push('Tirada de manguera trifásica de gran sección (>50m) sin caída de tensión');
    surcharge += 60;
    count++;
  }

  // 3. Rider & Iluminación
  if (filters.rider.lightingTier === 'robotica-led-cabezas') {
    specs.push('Show Lumínico Robotizado con cabezas móviles DMX sincronizadas');
    surcharge += 220;
    count++;
  } else if (filters.rider.lightingTier === 'humo-denso-fuego-frio') {
    specs.push('Efectos especiales: Humo bajo criogénico + Chispas frías Geyser (Safe Indoor)');
    surcharge += 180;
    count++;
  } else if (filters.rider.lightingTier === 'arquitectonica-finca') {
    specs.push('Iluminación arquitectónica perimetral inalámbrica a batería');
    surcharge += 250;
    count++;
  }

  if (filters.rider.trussStructures === 'puente-luces-6x4') {
    specs.push('Puente Truss de aluminio certificado 6x4m con cabestrantes');
    surcharge += 290;
    count++;
  } else if (filters.rider.trussStructures === 'escenario-homologado') {
    specs.push('Tarima escénica modular homologada con barandilla y falda');
    surcharge += 450;
    count++;
  }

  // 4. Protocolo & Momentos
  if (filters.protocol.performanceMoments.length > 2) {
    const extraMoments = filters.protocol.performanceMoments.length - 2;
    specs.push(`Cobertura multi-momento (${filters.protocol.performanceMoments.join(', ')})`);
    surcharge += extraMoments * 90;
    count++;
  }

  if (filters.protocol.rehearsalLevel === 'ensayo-dia-previo') {
    specs.push('Desplazamiento técnico para ensayo general el día previo');
    surcharge += 180;
    count++;
  }

  // 5. Logística
  if (filters.logistics.accommodationRequired) {
    specs.push('Reserva hotelera y dietas de staff cubiertas por póliza EAR');
    surcharge += 120;
    count++;
  }

  // 6. Compliance B2G
  if (filters.compliance.safetyInsurance === 'rc-ampliada-2m') {
    specs.push('Póliza de Responsabilidad Civil ampliada hasta 2.000.000€');
    surcharge += 60;
    count++;
  } else if (filters.compliance.safetyInsurance === 'plan-prl-requerido') {
    specs.push('Documentación de Coordinación de Actividades Empresariales y Plan PRL visado');
    surcharge += 95;
    count++;
  }

  return {
    surchargeAmount: surcharge,
    riderSpecs: specs,
    activeCount: count
  };
}
