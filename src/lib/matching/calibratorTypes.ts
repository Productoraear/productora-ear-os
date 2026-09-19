/**
 * 🏛️ NEURAL SENATE CALIBRATOR — 200 DIMENSIONES BILATERALES
 * Finca ↔ Pareja. Tipos inmutables del Motor de Matchmaking Bilateral.
 */

export type DimensionType =
  | 'slider'
  | 'toggle'
  | 'select'
  | 'multi-select'
  | 'scale'
  | 'date'
  | 'text';

export type DimensionValue = string | number | boolean | string[] | null | undefined;

export interface CalibrationDimension {
  id: number;
  pillar: number;
  pillarName: string;
  label: string;
  type: DimensionType;
  side: 'couple' | 'provider' | 'artist' | 'providerService';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: DimensionValue;
  weight: number;
  isKnockout: boolean;
  tooltip?: string;
}

export interface CoupleCalibration {
  dimensions: Record<number, DimensionValue>;
  completedAt?: string;
  completionPercent: number;
}

export interface ProviderCalibration {
  providerId: string;
  providerName: string;
  presetSlug: string;
  dimensions: Record<number, DimensionValue>;
  completedAt?: string;
  completionPercent: number;
  calibratedBy: 'self' | 'admin';
  lastModifiedBy?: string;
}

export type AffinityTier =
  | 'EXACT_MATCH'
  | 'HIGH_COMPATIBILITY'
  | 'POTENTIAL_FIT'
  | 'DISMISSED';

export interface DimensionMatchDetail {
  dimensionId: number;
  label: string;
  coupleValue: DimensionValue;
  providerValue: DimensionValue;
  matchPercent: number;
  isKnockout: boolean;
  passed: boolean;
}

export interface BilateralMatchResult {
  coupleScore: number;
  providerScore: number;
  bilateralScore: number;
  affinityTier: AffinityTier;
  coupleStrengths: string[];
  providerStrengths: string[];
  warnings: string[];
  knockouts: string[];
  estimatedTotalEur: number;
  costPerGuestEur: number;
  dimensionBreakdown: DimensionMatchDetail[];
}

/* ────────────────────────────────────────────────────────────────
   CATÁLOGO CENTRAL DE LAS 200 DIMENSIONES (SSOT único del motor)
   ──────────────────────────────────────────────────────────────── */

type DimensionOptions = Partial<
  Pick<
    CalibrationDimension,
    'options' | 'min' | 'max' | 'step' | 'defaultValue' | 'weight' | 'isKnockout' | 'tooltip'
  >
>;

function defaultDimensionValue(type: DimensionType, opts: DimensionOptions): DimensionValue {
  switch (type) {
    case 'toggle':
      return false;
    case 'multi-select':
      return [];
    case 'select':
      return opts.options?.[0] ?? '';
    case 'slider':
    case 'scale':
      return opts.min ?? 0;
    case 'date':
    case 'text':
      return '';
    default:
      return null;
  }
}

/* ────────────────────────────────────────────────────────────────
   TAXONOMÍA SUPREMA FINCAS (SSOT canónico B1.01)
   Arrays inmutables aplicados SIMÉTRICAMENTE a Pareja y Finca.
   Resuelven colisiones de strings con Bodas.net.
   ──────────────────────────────────────────────────────────────── */

export const CANONICAL_TYPOLOGIES = [
  'Palacio',
  'Castillo',
  'Cortijo',
  'Masía',
  'Cigarral',
  'Invernadero',
  'Bodega',
  'Vanguardista',
  'Casa Rural',
  'Hacienda',
  'Pazo',
  'Monasterio',
  'Convento',
  'Ermita',
  'Mas',
  'Molino',
  'Fábrica Industrial',
  'Loft Urbano',
  'Hotel Boutique',
  'Dehesa',
  'Finca Rústica',
  'Yate'
] as const;

export const CANONICAL_ENVIRONMENTS = [
  'Jardines',
  'Sierra',
  'Pinar',
  'Viñedos',
  'Ribera',
  'Costa',
  'Campo',
  'Urbano',
  'Olivos',
  'Dehesa',
  'Acantilado',
  'Isla',
  'Embalse',
  'Desierto'
] as const;

export const CANONICAL_DECORATIVE_STYLES = [
  'Rústico-Chic',
  'Provenzal',
  'Industrial',
  'Minimalista',
  'Barroco',
  'Boho',
  'Tropical',
  'Clásico-Elegante',
  'Mediterráneo',
  'Nórdico',
  'Vintage',
  'Art-Decó',
  'Moderno',
  'Romántico',
  'Étnico',
  'Glam'
] as const;

export type CanonicalTypology = (typeof CANONICAL_TYPOLOGIES)[number];
export type CanonicalEnvironment = (typeof CANONICAL_ENVIRONMENTS)[number];
export type CanonicalDecorativeStyle = (typeof CANONICAL_DECORATIVE_STYLES)[number];

function build(
  side: 'couple' | 'provider',
  pillar: number,
  pillarName: string,
  startId: number,
  rows: Array<[string, DimensionType, DimensionOptions?]>
): CalibrationDimension[] {
  return rows.map(([label, type, opts = {}], i) => {
    const id = startId + i;
    return {
      id,
      pillar,
      pillarName,
      label,
      type,
      side,
      options: opts.options,
      min: opts.min,
      max: opts.max,
      step: opts.step,
      defaultValue: opts.defaultValue ?? defaultDimensionValue(type, opts),
      weight: opts.weight ?? 1,
      isKnockout: opts.isKnockout ?? false,
      tooltip: opts.tooltip ?? label
    };
  });
}

const BLOQUE_A = [
  /* P1 — Atmósfera y Estilo Visual (10) */
  ...build('couple', 1, 'Atmósfera y Estilo Visual', 1, [
    ['Tipología Arquitectónica Deseada', 'multi-select', { options: [...CANONICAL_TYPOLOGIES] as unknown as string[], weight: 3, isKnockout: true }],
    ['Entorno Paisajístico Preferido', 'multi-select', { options: [...CANONICAL_ENVIRONMENTS] as unknown as string[], weight: 2 }],
    ['Estilo Decorativo Dominante', 'multi-select', { options: [...CANONICAL_DECORATIVE_STYLES] as unknown as string[], weight: 2 }],
    ['Plan B Climatológico Exigido', 'select', { options: ['Salón acristalado', 'Carpa fija', 'Nave rehabilitada', 'Invernadero', 'Sin necesidad (solo exterior)'], weight: 2 }],
    ['Libertad de Decoración Personalizada', 'toggle', { weight: 1 }],
    ['Iluminación Nocturna Base Incluida', 'toggle', { weight: 1 }],
    ['Vegetación y Jardín Cuidado', 'scale', { min: 1, max: 5, step: 1, defaultValue: 1, weight: 1 }],
    ['Piscina o Zona de Agua Visible', 'toggle', { weight: 1 }],
    ['Fotografía de Exteriores Premium', 'scale', { min: 1, max: 5, step: 1, defaultValue: 1, weight: 1 }],
    ['Ambiente Sonoro Natural', 'select', { options: ['Silencio absoluto rural', 'Sonido de agua', 'Campo con fauna', 'No relevante'], weight: 1 }]
  ]),
  /* P2 — Presupuesto y Ticket Económico (12) */
  ...build('couple', 2, 'Presupuesto y Ticket Económico', 11, [
    ['Presupuesto Total Objetivo (€)', 'slider', { min: 12000, max: 120000, step: 1000, defaultValue: 35000, weight: 3 }],
    ['Precio Máximo Menú Adulto (€/pax)', 'slider', { min: 80, max: 250, step: 5, defaultValue: 150, weight: 2 }],
    ['Tolerancia de Sobrecoste (%)', 'slider', { min: 0, max: 30, step: 1, defaultValue: 10, weight: 1 }],
    ['Acepta Gasto Mínimo Obligatorio de Finca', 'toggle', { weight: 2 }],
    ['Precio Máximo Menú Infantil (€/pax)', 'slider', { min: 30, max: 80, step: 5, defaultValue: 50, weight: 1 }],
    ['Acepta Canon de Alquiler Independiente', 'toggle', { weight: 2 }],
    ['Presupuesto Reservado para Música en Vivo', 'slider', { min: 0, max: 5000, step: 100, defaultValue: 1000, weight: 1 }],
    ['Presupuesto Reservado para Decoración Floral', 'slider', { min: 0, max: 8000, step: 100, defaultValue: 1500, weight: 1 }],
    ['Preferencia de Pago Fraccionado', 'select', { options: ['Todo al contratar', '50/50', 'Tres plazos', 'Financiación'], weight: 1 }],
    ['Acepta Fianza Reembolsable de Daños', 'toggle', { weight: 1 }],
    ['Divisa de Facturación Esperada', 'select', { options: ['EUR', 'GBP', 'USD'], weight: 0.5 }],
    ['Necesita Factura con IVA Desglosado', 'toggle', { weight: 0.5 }]
  ]),
  /* P3 — Gastronomía y Cocina (10) */
  ...build('couple', 3, 'Gastronomía y Cocina', 23, [
    ['Modelo Culinario Preferido', 'select', { options: ['Cocina propia', 'Catering homologado exclusivo', 'Libertad de catering'], weight: 2 }],
    ['Formato de Cóctel', 'select', { options: ['Cóctel largo (18-24 pases)', 'Cóctel breve (8-12 pases)', 'Sin cóctel'], weight: 1 }],
    ['Formato de Menú Sentado', 'select', { options: ['3 platos + postre', '5 pases degustación', 'Buffet libre', 'Estaciones temáticas'], weight: 2 }],
    ['Estaciones Gastronómicas Deseadas', 'multi-select', { options: ['Jamón ibérico', 'Quesos artesanos', 'Pulpo', 'Sushi', 'Brasa', 'Arroces', 'Showcooking'], weight: 1 }],
    ['Dietas Especiales Obligatorias', 'multi-select', { options: ['Celíacos', 'Veganos', 'Halal', 'Kosher', 'Alergias severas'], weight: 2 }],
    ['Prueba de Menú Incluida', 'toggle', { weight: 1 }],
    ['Nivel de Gastronomía Esperado', 'scale', { min: 1, max: 5, step: 1, defaultValue: 3, weight: 2 }],
    ['Maridaje de Vinos Curado', 'toggle', { weight: 1 }],
    ['Tarta Nupcial Incluida en Menú', 'toggle', { weight: 1 }],
    ['Recena Nocturna Incluida', 'select', { options: ['Pulled pork', 'Minihamburguesas', 'Churros', 'Pizza horno', 'Mesa dulce', 'No necesaria'], weight: 1 }]
  ]),
  /* P4 — Barra Libre y Horarios de Fiesta (10) */
  ...build('couple', 4, 'Barra Libre y Horarios de Fiesta', 33, [
    ['Horas de Barra Libre Incluidas', 'slider', { min: 2, max: 8, step: 1, defaultValue: 4, weight: 2 }],
    ['Gama de Marcas Spirits', 'select', { options: ['Estándar', 'Premium (Hendrick\'s, Monkey 47...)', 'Ultra-Premium'], weight: 1 }],
    ['Cócteles de Autor Personalizados', 'toggle', { weight: 1 }],
    ['Hora Límite Mínima de Fiesta', 'select', { options: ['2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 'Sin límite'], weight: 3, isKnockout: true }],
    ['Zona de Fiesta Exterior Nocturna', 'toggle', { weight: 1 }],
    ['DJ Residente vs Traer DJ Propio', 'select', { options: ['DJ propio obligatorio', 'DJ residente aceptado', 'Indiferente'], weight: 1 }],
    ['Música en Vivo durante Cena', 'toggle', { weight: 1 }],
    ['Pista de Baile Dedicada', 'scale', { min: 1, max: 5, step: 1, defaultValue: 3, weight: 1 }],
    ['Zona Chill-Out Separada', 'toggle', { weight: 1 }],
    ['After-Party en Sala Separada', 'toggle', { weight: 1 }]
  ]),
  /* P5 — Exclusividad y Ceremonia In Situ (10) */
  ...build('couple', 5, 'Exclusividad y Ceremonia In Situ', 43, [
    ['Exclusividad Absoluta (1 boda/día)', 'toggle', { weight: 3 }],
    ['Ceremonia Civil Legal In Situ', 'toggle', { weight: 3, isKnockout: true }],
    ['Capilla Consagrada para Boda Religiosa', 'toggle', { weight: 2 }],
    ['Sesión Fotográfica Privada de Exteriores', 'toggle', { weight: 1 }],
    ['Tipo de Ceremonia Preferida', 'select', { options: ['Civil legal', 'Religiosa católica', 'Simbólica/laica', 'Interreligiosa'], weight: 2 }],
    ['Número Máximo de Bodas Simultáneas Toleradas', 'slider', { min: 1, max: 4, step: 1, defaultValue: 1, weight: 1 }],
    ['Espacio de Ceremonia al Aire Libre', 'toggle', { weight: 1 }],
    ['Instalación de Altar/Escenario Propia', 'select', { options: ['Incluida por finca', 'Hay que montar'], weight: 1 }],
    ['Ensayo de Ceremonia Previo', 'toggle', { weight: 1 }],
    ['Preparación de Novios In Situ', 'toggle', { weight: 1 }]
  ]),
  /* P6 — Alojamiento y Logística (10) */
  ...build('couple', 6, 'Alojamiento y Logística', 53, [
    ['Suite Nupcial de Cortesía', 'toggle', { weight: 1 }],
    ['Habitaciones para Familiares (nº camas)', 'slider', { min: 0, max: 60, step: 2, defaultValue: 10, weight: 2 }],
    ['Desayuno Post-Boda para Alojados', 'toggle', { weight: 1 }],
    ['Piscina Accesible Día Siguiente', 'toggle', { weight: 1 }],
    ['Acceso Autobuses Gran Tonaje (55 plz)', 'toggle', { weight: 2, isKnockout: true }],
    ['Plazas de Parking Privado Mínimas', 'slider', { min: 20, max: 300, step: 10, defaultValue: 60, weight: 1 }],
    ['Accesibilidad Universal (PMR)', 'toggle', { weight: 1 }],
    ['Servicio de Shuttle/Transfer', 'toggle', { weight: 1 }],
    ['Late Check-Out para Novios', 'toggle', { weight: 1 }],
    ['Zona de Juegos/Animación Infantil', 'toggle', { weight: 1 }]
  ]),
  /* P7 — Cánones y Proveedores Externos (10) */
  ...build('couple', 7, 'Cánones y Proveedores Externos', 63, [
    ['Canon por Fotógrafo Externo', 'select', { options: ['0 € (libertad)', 'Hasta 300 €', 'Hasta 600 €', 'Inaceptable cualquier canon'], weight: 2 }],
    ['Canon por Músico/DJ Externo', 'select', { options: ['0 € (libertad)', 'Hasta 300 €', 'Hasta 500 €', 'Inaceptable'], weight: 2 }],
    ['Canon por Floristería Externa', 'select', { options: ['0 € (libertad)', 'Hasta 200 €', 'Inaceptable'], weight: 1 }],
    ['Canon por Catering Externo', 'select', { options: ['0 € (libertad)', 'Porcentaje', 'Inaceptable'], weight: 2 }],
    ['Homologación EAR OS Aceptada como Exención', 'toggle', { weight: 1 }],
    ['Seguro RC Aportado por Proveedor', 'select', { options: ['Lo aportamos', 'La finca lo exige'], weight: 1 }],
    ['Proveedor de Videografía Libre', 'toggle', { weight: 1 }],
    ['Proveedor de Candy Bar / Repostería Libre', 'toggle', { weight: 1 }],
    ['Coordinador de Bodas Propio de la Finca', 'select', { options: ['Incluido y deseado', 'Incluido pero prescindible', 'No necesario'], weight: 1 }],
    ['Acepta Protocolo de Montaje 24h Antes', 'toggle', { weight: 1 }]
  ]),
  /* P8 — Acústica y Normativa Ambiental (8) */
  ...build('couple', 8, 'Acústica y Normativa Ambiental', 73, [
    ['Nivel SPL Mínimo Aceptable en Exterior', 'slider', { min: 65, max: 95, step: 1, defaultValue: 75, weight: 2 }],
    ['Limitador Acústico Municipal Tolerado', 'toggle', { weight: 2 }],
    ['Hora de Corte de Música Exterior', 'select', { options: ['22:00', '23:00', '00:00', 'Sin corte'], weight: 2 }],
    ['Conexión Eléctrica Trifásica para Escenario', 'toggle', { weight: 2, isKnockout: true }],
    ['Potencia Eléctrica Mínima (kW)', 'slider', { min: 5, max: 40, step: 1, defaultValue: 10, weight: 1 }],
    ['Acepta Generador Externo', 'toggle', { weight: 1 }],
    ['Homologación Acústica EAR OS', 'toggle', { weight: 1 }],
    ['Acepta Fuegos Artificiales / Pirotecnia', 'toggle', { weight: 1 }]
  ]),
  /* P9 — Fecha, Temporada y Disponibilidad (10) */
  ...build('couple', 9, 'Fecha, Temporada y Disponibilidad', 81, [
    ['Fecha Objetivo de Boda', 'date', { weight: 3 }],
    ['Flexibilidad de Fecha', 'select', { options: ['Exacta', '±2 semanas', '±1 mes', '±3 meses', 'Sin fecha fija'], weight: 2 }],
    ['Día de la Semana Preferido', 'multi-select', { options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], weight: 1 }],
    ['Temporada Preferida', 'multi-select', { options: ['Primavera', 'Verano', 'Otoño', 'Invierno'], weight: 2 }],
    ['Acepta Descuento por Día Laborable', 'toggle', { weight: 1 }],
    ['Plazo de Anticipación (meses)', 'slider', { min: 1, max: 36, step: 1, defaultValue: 6, weight: 1 }],
    ['Hora de Inicio de Ceremonia', 'select', { options: ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00'], weight: 1 }],
    ['Duración Total Deseada del Evento (h)', 'slider', { min: 6, max: 16, step: 1, defaultValue: 10, weight: 1 }],
    ['Ensayo/Preboda el Día Anterior', 'toggle', { weight: 1 }],
    ['Brunch Post-Boda al Día Siguiente', 'toggle', { weight: 1 }]
  ]),
  /* P10 — Ubicación y Distancia (10) */
  ...build('couple', 10, 'Ubicación y Distancia', 91, [
    ['Provincia(s) Preferida(s)', 'multi-select', { options: ['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'], weight: 2 }],
    ['Distancia Máxima desde Ciudad de Residencia (km)', 'slider', { min: 10, max: 300, step: 10, defaultValue: 150, weight: 1 }],
    ['Ciudad de Residencia de la Pareja', 'text', { weight: 1 }],
    ['Acepta Finca en Zona Rural Aislada', 'toggle', { weight: 1 }],
    ['Distancia Máxima a Hospital/Urgencias (km)', 'slider', { min: 5, max: 50, step: 1, defaultValue: 30, weight: 1 }],
    ['Altitud Máxima Tolerada (msnm)', 'slider', { min: 0, max: 1500, step: 50, defaultValue: 800, weight: 0.5 }],
    ['Proximidad a Aeropuerto (km)', 'slider', { min: 10, max: 200, step: 5, defaultValue: 100, weight: 1 }],
    ['Invitados Internacionales (%)', 'slider', { min: 0, max: 100, step: 5, defaultValue: 0, weight: 1 }],
    ['Necesita Transporte Público Cercano', 'toggle', { weight: 1 }],
    ['Zona Climática Preferida', 'select', { options: ['Mediterráneo', 'Continental', 'Atlántico', 'Subtropical', 'Indiferente'], weight: 1 }]
  ])
];

const BLOQUE_B = [
  /* P11 — Economía (12) */
  ...build('provider', 11, 'Perfil de Cliente Ideal — Economía', 101, [
    ['Ticket Medio Mínimo por Boda (€)', 'slider', { min: 5000, max: 80000, step: 500, defaultValue: 15000, weight: 3 }],
    ['Ticket Medio Máximo por Boda (€)', 'slider', { min: 15000, max: 150000, step: 500, defaultValue: 60000, weight: 2 }],
    ['Precio Menú Adulto Actual (€/pax)', 'slider', { min: 70, max: 300, step: 5, defaultValue: 120, weight: 2 }],
    ['Precio Menú Infantil Actual (€/pax)', 'slider', { min: 25, max: 100, step: 5, defaultValue: 50, weight: 1 }],
    ['Canon de Alquiler Fijo (€)', 'slider', { min: 0, max: 15000, step: 250, defaultValue: 2500, weight: 1 }],
    ['Gasto Mínimo Obligatorio en Sábado (€)', 'slider', { min: 0, max: 40000, step: 500, defaultValue: 15000, weight: 2 }],
    ['Acepta Financiación/Pago Fraccionado', 'toggle', { weight: 1 }],
    ['Fianza de Daños Reembolsable (€)', 'slider', { min: 0, max: 5000, step: 100, defaultValue: 500, weight: 1 }],
    ['Canon por Fotógrafo Externo (€)', 'slider', { min: 0, max: 1000, step: 50, defaultValue: 0, weight: 1 }],
    ['Canon por Músico/DJ Externo (€)', 'slider', { min: 0, max: 1000, step: 50, defaultValue: 0, weight: 1 }],
    ['Canon por Floristería Externa (€)', 'slider', { min: 0, max: 500, step: 25, defaultValue: 0, weight: 1 }],
    ['Descuento por Día Laborable (%)', 'slider', { min: 0, max: 40, step: 5, defaultValue: 10, weight: 1 }]
  ]),
  /* P12 — Aforo y Formato (10) */
  ...build('provider', 12, 'Perfil de Cliente Ideal — Aforo y Formato', 113, [
    ['Aforo Mínimo Rentable (pax)', 'slider', { min: 30, max: 200, step: 5, defaultValue: 80, weight: 2 }],
    ['Aforo Máximo Legal (pax)', 'slider', { min: 50, max: 600, step: 10, defaultValue: 300, weight: 3, isKnockout: true }],
    ['Aforo Ideal / Sweet Spot (pax)', 'slider', { min: 80, max: 400, step: 10, defaultValue: 150, weight: 2 }],
    ['Acepta Bodas Íntimas (<60 pax)', 'toggle', { weight: 1 }],
    ['Acepta Bodas Multitudinarias (>300 pax)', 'toggle', { weight: 1 }],
    ['Formato de Evento Preferido', 'multi-select', { options: ['Boda completa', 'Cóctel-only', 'Ceremonia-only', 'Preboda/rehearsal', 'Recepción'], weight: 1 }],
    ['Acepta Eventos Corporativos', 'toggle', { weight: 1 }],
    ['Acepta Cumpleaños y Comuniones', 'toggle', { weight: 1 }],
    ['Acepta Eventos B2G/Institucionales', 'toggle', { weight: 1 }],
    ['Número Máximo de Eventos por Semana', 'slider', { min: 1, max: 7, step: 1, defaultValue: 2, weight: 1 }]
  ]),
  /* P13 — Infraestructura y Servicios Propios (12) */
  ...build('provider', 13, 'Infraestructura y Servicios Propios', 123, [
    ['Cocina Propia con Chef', 'toggle', { weight: 2 }],
    ['Catering Exclusivo Homologado', 'select', { options: ['Sí, exclusiva', 'Acepta cualquier catering'], weight: 2 }],
    ['Tiene Alojamiento In Situ', 'toggle', { weight: 2 }],
    ['Nº de Habitaciones Disponibles', 'slider', { min: 0, max: 40, step: 1, defaultValue: 10, weight: 1 }],
    ['Nº de Camas/Plazas Alojamiento', 'slider', { min: 0, max: 80, step: 2, defaultValue: 20, weight: 2 }],
    ['Suite Nupcial de Cortesía Incluida', 'select', { options: ['Sí', 'Con coste adicional', 'No'], weight: 1 }],
    ['Piscina Accesible para Eventos', 'toggle', { weight: 1 }],
    ['Tiene Capilla/Ermita Consagrada', 'toggle', { weight: 2 }],
    ['Ceremonia Civil Legal Autorizada', 'select', { options: ['Sí (con concejal)', 'Solo simbólica'], weight: 3, isKnockout: true }],
    ['Tiene Sala Insonorizada/Limitador', 'toggle', { weight: 1 }],
    ['Tiene Generador de Emergencia', 'toggle', { weight: 1 }],
    ['Conexión Eléctrica Trifásica (Amperaje)', 'select', { options: ['16A', '32A', '63A', '125A'], weight: 2, isKnockout: true }]
  ]),
  /* P14 — Estilo y Tipología (10) */
  ...build('provider', 14, 'Estilo y Tipología del Espacio', 135, [
    ['Tipología Arquitectónica', 'multi-select', { options: [...CANONICAL_TYPOLOGIES] as unknown as string[], weight: 3, isKnockout: true }],
    ['Entorno Paisajístico', 'multi-select', { options: [...CANONICAL_ENVIRONMENTS] as unknown as string[], weight: 2 }],
    ['Plan B Climatológico Disponible', 'select', { options: ['Salón acristalado', 'Carpa fija', 'Nave', 'Invernadero', 'No tiene'], weight: 2 }],
    ['Estilo Decorativo de la Finca', 'multi-select', { options: [...CANONICAL_DECORATIVE_STYLES] as unknown as string[], weight: 2 }],
    ['Superficie Total de Jardines (m²)', 'slider', { min: 100, max: 50000, step: 500, defaultValue: 5000, weight: 1 }],
    ['Iluminación Nocturna Permanente', 'toggle', { weight: 1 }],
    ['Nº de Espacios Diferenciados', 'slider', { min: 1, max: 10, step: 1, defaultValue: 4, weight: 1 }],
    ['Tiene Mirador/Terraza Panorámica', 'toggle', { weight: 1 }],
    ['Antigüedad del Edificio Principal', 'select', { options: ['<50 años', '50-100', '100-300', '300-500', '>500 años', 'Moderno'], weight: 1 }],
    ['Patrimonio Histórico Protegido (BIC)', 'toggle', { weight: 1 }]
  ]),
  /* P15 — Gastronomía del Proveedor (10) */
  ...build('provider', 15, 'Gastronomía del Proveedor', 145, [
    ['Tipo de Cóctel Estándar (nº pases)', 'slider', { min: 6, max: 30, step: 1, defaultValue: 12, weight: 1 }],
    ['Formato de Menú Habitual', 'select', { options: ['3 platos sentados', '5 pases degustación', 'Buffet', 'Estaciones'], weight: 2 }],
    ['Incluye Prueba de Menú Gratuita', 'toggle', { weight: 1 }],
    ['Umbral de Pax para Prueba Gratuita', 'slider', { min: 50, max: 200, step: 10, defaultValue: 100, weight: 1 }],
    ['Ofrece Estaciones Temáticas', 'multi-select', { options: ['Jamón', 'Quesos', 'Pulpo', 'Sushi', 'Brasa', 'Arroces', 'Showcooking'], weight: 1 }],
    ['Protocolo de Dietas Especiales', 'multi-select', { options: ['Celíacos', 'Veganos', 'Halal', 'Kosher', 'Alergias severas'], weight: 2 }],
    ['Sommelier / Maridaje Disponible', 'toggle', { weight: 1 }],
    ['Tarta Nupcial Incluida', 'toggle', { weight: 1 }],
    ['Recena Nocturna Disponible', 'multi-select', { options: ['Pulled pork', 'Minihamburguesas', 'Churros', 'Pizza', 'Mesa dulce'], weight: 1 }],
    ['Nivel Gastronómico Autopercibido', 'scale', { min: 1, max: 5, step: 1, defaultValue: 3, weight: 1 }]
  ]),
  /* P16 — Barra Libre y Fiesta del Proveedor (10) */
  ...build('provider', 16, 'Barra Libre y Fiesta del Proveedor', 155, [
    ['Horas de Barra Libre Incluidas en Menú', 'slider', { min: 2, max: 8, step: 1, defaultValue: 4, weight: 2 }],
    ['Precio Hora Extra de Barra (€/pax)', 'slider', { min: 5, max: 20, step: 1, defaultValue: 10, weight: 1 }],
    ['Gama de Spirits Disponible', 'select', { options: ['Estándar', 'Premium', 'Ultra-Premium'], weight: 1 }],
    ['Cócteles de Autor Disponibles', 'toggle', { weight: 1 }],
    ['Hora Límite Absoluta de Fiesta', 'select', { options: ['2:00', '3:00', '4:00', '5:00', '6:00', 'Sin límite'], weight: 3, isKnockout: true }],
    ['Zona de Fiesta Exterior Nocturna', 'toggle', { weight: 1 }],
    ['DJ Residente Propio', 'toggle', { weight: 1 }],
    ['Pista de Baile Dedicada (m²)', 'slider', { min: 20, max: 300, step: 10, defaultValue: 80, weight: 1 }],
    ['Zona Chill-Out Separada', 'toggle', { weight: 1 }],
    ['After-Party en Sala Independiente', 'toggle', { weight: 1 }]
  ]),
  /* P17 — Logística y Accesos del Proveedor (8) */
  ...build('provider', 17, 'Logística y Accesos del Proveedor', 165, [
    ['Plazas de Parking Privado', 'slider', { min: 0, max: 500, step: 10, defaultValue: 100, weight: 1 }],
    ['Acceso Autobuses Gran Tonaje', 'toggle', { weight: 2, isKnockout: true }],
    ['Accesibilidad Universal PMR', 'select', { options: ['100% adaptado', 'Parcial', 'No adaptado'], weight: 1 }],
    ['Servicio de Shuttle Propio', 'toggle', { weight: 1 }],
    ['Distancia a Hospital más Cercano (km)', 'slider', { min: 1, max: 60, step: 1, defaultValue: 15, weight: 1 }],
    ['Distancia al Aeropuerto más Cercano (km)', 'slider', { min: 5, max: 200, step: 5, defaultValue: 80, weight: 1 }],
    ['Altitud del Recinto (msnm)', 'slider', { min: 0, max: 1500, step: 50, defaultValue: 600, weight: 0.5 }],
    ['Hora Máxima de Llegada de Proveedores Externos', 'select', { options: ['08:00', '10:00', '12:00', '14:00'], weight: 1 }]
  ]),
  /* P18 — Acústica y Normativa del Proveedor (8) */
  ...build('provider', 18, 'Acústica y Normativa del Proveedor', 173, [
    ['Límite SPL Exterior Autorizado (dBA)', 'slider', { min: 60, max: 100, step: 1, defaultValue: 85, weight: 2 }],
    ['Tiene Limitador Acústico Municipal', 'toggle', { weight: 2 }],
    ['Hora de Corte de Música Exterior', 'select', { options: ['22:00', '23:00', '00:00', 'Sin corte'], weight: 2 }],
    ['Potencia Eléctrica Disponible para Escenario (kW)', 'slider', { min: 3, max: 60, step: 1, defaultValue: 20, weight: 1 }],
    ['Acepta Generador Externo del Proveedor', 'toggle', { weight: 1 }],
    ['Acepta Fuegos Artificiales / Pirotecnia', 'toggle', { weight: 1 }],
    ['Tiene Certificación Acústica EAR OS', 'toggle', { weight: 1 }],
    ['Vecinos Colindantes a Menos de 200m', 'toggle', { weight: 1 }]
  ]),
  /* P19 — Calendario y Disponibilidad del Proveedor (10) */
  ...build('provider', 19, 'Calendario y Disponibilidad del Proveedor', 181, [
    ['Meses de Apertura para Bodas', 'multi-select', { options: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], weight: 2 }],
    ['Días Disponibles por Semana', 'multi-select', { options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], weight: 2 }],
    ['Bodas por Fin de Semana Máximo', 'slider', { min: 1, max: 4, step: 1, defaultValue: 1, weight: 1 }],
    ['Exclusividad 1 Boda/Día Garantizada', 'toggle', { weight: 2 }],
    ['Acepta Montaje desde el Viernes', 'toggle', { weight: 1 }],
    ['Acepta Evento de Preboda/Rehearsal', 'toggle', { weight: 1 }],
    ['Acepta Brunch Post-Boda', 'toggle', { weight: 1 }],
    ['Plazo Mínimo de Reserva (meses)', 'slider', { min: 1, max: 18, step: 1, defaultValue: 3, weight: 1 }],
    ['Descuento por Reserva con +12 Meses', 'slider', { min: 0, max: 20, step: 1, defaultValue: 5, weight: 1 }],
    ['Fecha de Cierre de Temporada', 'date', { weight: 1 }]
  ]),
  /* P20 — Filtros de Captación Inteligente (10) */
  ...build('provider', 20, 'Filtros de Captación Inteligente — Anti-Lead-Basura', 191, [
    ['Solo Recibir Leads con Depósito 1 € Verificado', 'toggle', { weight: 3, isKnockout: true }],
    ['Solo Recibir Leads con Fecha Confirmada', 'toggle', { weight: 2, isKnockout: true }],
    ['Radio Máximo de Procedencia de Pareja (km)', 'slider', { min: 20, max: 500, step: 10, defaultValue: 300, weight: 1 }],
    ['Presupuesto Mínimo Declarado por la Pareja (€)', 'slider', { min: 8000, max: 50000, step: 500, defaultValue: 12000, weight: 2, isKnockout: true }],
    ['Nº Mínimo de Invitados Declarados por Pareja', 'slider', { min: 30, max: 200, step: 5, defaultValue: 50, weight: 2, isKnockout: true }],
    ['Acepta Parejas sin Provincia Definida', 'toggle', { weight: 1 }],
    ['Solo Mostrar a Parejas con Todos los Filtros ≥ 85% Match', 'toggle', { weight: 1 }],
    ['Bloquear Leads Repetidos del Mismo Email/Teléfono', 'toggle', { weight: 1 }],
    ['Notificación Instantánea por WhatsApp de Lead Cualificado', 'toggle', { weight: 1 }],
    ['Resumen Semanal de Leads con Score < 65% (Descartados)', 'toggle', { weight: 1 }]
  ])
];

export const CALIBRATION_DIMENSIONS: CalibrationDimension[] = [
  ...BLOQUE_A,
  ...BLOQUE_B
];

/* ────────────────────────────────────────────────────────────────
   MAPAS DE EMPAREJAMIENTO BILATERAL
   Cada dimensión de pareja (1-100) se cruza con su contraparte
   de finca (101-200). null = sin contraparte directa (evaluación neutral).
   ──────────────────────────────────────────────────────────────── */

export const COUPLE_TO_PROVIDER_PAIRS: Record<number, number | null> = {
  1: 135, 2: 136, 3: 138, 4: 137, 5: 138, 6: 140, 7: 139, 8: 129, 9: 139, 10: 180,
  11: 102, 12: 103, 13: null, 14: 106, 15: 104, 16: 105, 17: 110, 18: 111, 19: 107, 20: 108, 21: null, 22: null,
  23: 123, 24: 145, 25: 146, 26: 149, 27: 150, 28: 147, 29: 154, 30: 151, 31: 152, 32: 153,
  33: 155, 34: 157, 35: 158, 36: 159, 37: 160, 38: 161, 39: null, 40: 162, 41: 163, 42: 164,
  43: 184, 44: 131, 45: 130, 46: null, 47: 131, 48: 183, 49: null, 50: null, 51: 186, 52: 128,
  53: 128, 54: 127, 55: null, 56: 129, 57: 166, 58: 165, 59: 167, 60: 168, 61: null, 62: null,
  63: 109, 64: 110, 65: 111, 66: 124, 67: 179, 68: null, 69: 109, 70: null, 71: null, 72: 185,
  73: 173, 74: 174, 75: 175, 76: 134, 77: 176, 78: 177, 79: 179, 80: 178,
  81: 181, 82: null, 83: 182, 84: 181, 85: 112, 86: 188, 87: null, 88: null, 89: 186, 90: 187,
  91: null, 92: null, 93: null, 94: null, 95: 169, 96: 171, 97: 170, 98: null, 99: null, 100: null
};

/* Dimensiones de proveedor que actúan como compuerta de negocio
   (filtro anti-lead-basura y umbrales de aforo/economía). */
export const PROVIDER_GATE_DIMENSION_IDS: number[] = [
  101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112,
  113, 114, 115, 116, 117,
  191, 192, 193, 194, 195, 197
];

/* Valores de select que expresan "indiferencia" y no penalizan. */
export const NEUTRAL_SELECT_VALUES = new Set<string>([
  'Sin necesidad (solo exterior)',
  'No relevante',
  'No necesario',
  'No necesaria',
  'No necesarios',
  'Sin fecha fija',
  'Indiferente',
  'Sin corte',
  'Sin límite',
  'No necesaria'
]);

export function getCoupleDimensions(): CalibrationDimension[] {
  return CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
}

export function getProviderDimensions(): CalibrationDimension[] {
  return CALIBRATION_DIMENSIONS.filter((d) => d.side === 'provider');
}

export function getDimensionsByPillar(
  side: 'couple' | 'provider' | 'artist' | 'providerService',
  pillar: number
): CalibrationDimension[] {
  return CALIBRATION_DIMENSIONS.filter((d) => d.side === side && d.pillar === pillar);
}

export function getDimensionById(id: number): CalibrationDimension | undefined {
  return CALIBRATION_DIMENSIONS.find((d) => d.id === id);
}