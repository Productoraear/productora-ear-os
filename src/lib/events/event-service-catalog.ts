/**
 * ════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO CANÓNICO DE SERVICIOS DE UN EVENTO COMPLETO · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * 122 servicios distribuidos en los 11 gremios publicados del Data Lake.
 * Sustituye el enfoque "un solo proveedor = un solo carrito": un evento real
 * necesita finca + catering + música + técnica + foto + flores + transporte +
 * planner + moda + servicios auxiliares (y VIMUME cuando hay mayores).
 *
 * REGLAS:
 *  · `marketReferenceEur` es una REFERENCIA ORIENTATIVA de mercado para
 *    priorizar y dimensionar el carrito. NO es un precio de venta y NUNCA
 *    se cobra: el dinero real vive en `ear-os-ssot.ts` (depósito 100 € /
 *    garantía 1 € de simulación).
 *  · Cada servicio declara su `providerCategory`, que es la que usa el
 *    matcher contra el Data Lake.
 *  · Cero `any`, cero servicios inventados fuera de los gremios existentes.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  inferCalendarKindFromCategory,
  type CalendarEntityKind,
} from '@/lib/calendar/entity-calendar-types';

/** Gremios publicados del Data Lake (`public/data/providers/*.json`). */
export type EventProviderCategory =
  | 'finca'
  | 'catering'
  | 'musica'
  | 'foto'
  | 'decoracion'
  | 'sonido'
  | 'moda'
  | 'transporte'
  | 'wedding'
  | 'servicios'
  | 'senior_care';

/** Momento del evento en el que se consume el servicio. */
export type EventPhase =
  | 'pre-boda'
  | 'ceremonia'
  | 'coctel'
  | 'banquete'
  | 'fiesta'
  | 'post-boda'
  | 'transversal';

export interface EventServiceDefinition {
  readonly id: string;
  readonly name: string;
  readonly providerCategory: EventProviderCategory;
  readonly calendarKind: CalendarEntityKind;
  readonly phase: EventPhase;
  /** Imprescindible para celebrar el evento (si falta, el plan está incompleto). */
  readonly essential: boolean;
  /** Peso relativo 1-10 en la experiencia global (prioriza el barrido). */
  readonly weight: number;
  /** Referencia orientativa de mercado en EUR (nunca se cobra desde aquí). */
  readonly marketReferenceEur: number;
}

type ServiceSeed = readonly [
  id: string,
  name: string,
  providerCategory: EventProviderCategory,
  phase: EventPhase,
  essential: 0 | 1,
  weight: number,
  marketReferenceEur: number,
];

/**
 * Semilla compacta: [id, nombre, gremio, fase, esencial, peso, referencia €].
 * 122 servicios = 11 gremios × 8-14 partidas reales de un evento.
 */
const SERVICE_SEEDS: readonly ServiceSeed[] = [
  // ── FINCA & ESPACIO (10) ────────────────────────────────────────────────
  ['finca-alquiler', 'Alquiler exclusivo de finca', 'finca', 'transversal', 1, 10, 4500],
  ['finca-ceremonia-jardin', 'Jardín para ceremonia simbólica', 'finca', 'ceremonia', 1, 8, 900],
  ['finca-coctel-terraza', 'Terraza o patio de cóctel', 'finca', 'coctel', 1, 6, 600],
  ['finca-salon-banquete', 'Salón de banquete climatizado', 'finca', 'banquete', 1, 9, 1200],
  ['finca-suite-nupcial', 'Suite nupcial con desayuno', 'finca', 'post-boda', 0, 5, 450],
  ['finca-alojamiento-invitados', 'Alojamiento para invitados', 'finca', 'post-boda', 0, 4, 1800],
  ['finca-parking', 'Parking privado con señalización', 'finca', 'transversal', 0, 3, 0],
  ['finca-generador-electrico', 'Grupo electrógeno de respaldo', 'finca', 'transversal', 0, 4, 350],
  ['finca-plan-lluvia', 'Plan B cubierto por lluvia', 'finca', 'transversal', 1, 7, 500],
  ['finca-hora-limite', 'Ampliación de horario de celebración', 'finca', 'fiesta', 0, 3, 400],

  // ── CATERING (12) ───────────────────────────────────────────────────────
  ['catering-menu-gala', 'Menú de gala sentado', 'catering', 'banquete', 1, 10, 85],
  ['catering-coctel-bienvenida', 'Cóctel de bienvenida', 'catering', 'coctel', 1, 8, 28],
  ['catering-estaciones', 'Estaciones gastronómicas en vivo', 'catering', 'banquete', 0, 5, 35],
  ['catering-barra-libre', 'Barra libre con coctelería de autor', 'catering', 'fiesta', 0, 7, 22],
  ['catering-vegetariano', 'Menú vegetariano / vegano', 'catering', 'banquete', 1, 6, 78],
  ['catering-alergenos', 'Protocolo de alérgenos certificado', 'catering', 'banquete', 1, 7, 0],
  ['catering-menu-infantil', 'Menú infantil', 'catering', 'banquete', 0, 4, 32],
  ['catering-tarta-nupcial', 'Tarta nupcial de autor', 'catering', 'banquete', 0, 6, 380],
  ['catering-brasas', 'Brasas / asador en directo', 'catering', 'banquete', 0, 5, 45],
  ['catering-recena', 'Recena nocturna', 'catering', 'fiesta', 0, 4, 18],
  ['catering-staff-sala', 'Equipo de sala y maître', 'catering', 'banquete', 1, 8, 900],
  ['catering-residuos', 'Gestión de residuos y limpieza final', 'catering', 'post-boda', 0, 3, 250],

  // ── MÚSICA & ANIMACIÓN (14) ─────────────────────────────────────────────
  ['musica-ceremonia', 'Música en directo para la ceremonia', 'musica', 'ceremonia', 1, 9, 350],
  ['musica-coctel', 'Ambiente musical de cóctel', 'musica', 'coctel', 1, 7, 350],
  ['musica-banquete', 'Actuación de banquete', 'musica', 'banquete', 0, 7, 600],
  ['musica-mariachi', 'Mariachi de gala', 'musica', 'banquete', 0, 6, 600],
  ['musica-cuarteto-cuerdas', 'Cuarteto de cuerdas', 'musica', 'ceremonia', 0, 6, 520],
  ['musica-solista', 'Solista tenor / soprano', 'musica', 'ceremonia', 0, 6, 350],
  ['musica-piano', 'Pianista de escenario', 'musica', 'coctel', 0, 5, 480],
  ['musica-dj', 'DJ profesional con cabina', 'musica', 'fiesta', 1, 8, 750],
  ['musica-saxo-live', 'Saxofonista en directo', 'musica', 'fiesta', 0, 5, 380],
  ['musica-orquesta', 'Orquesta o banda de verbena', 'musica', 'fiesta', 0, 7, 1500],
  ['musica-hora-loca', 'Animación de hora loca', 'musica', 'fiesta', 0, 4, 450],
  ['musica-percusion', 'Percusión africana / batucada', 'musica', 'coctel', 0, 4, 420],
  ['musica-karaoke', 'Karaoke o fiesta vocal', 'musica', 'fiesta', 0, 2, 250],
  ['musica-ensayo', 'Ensayo y prueba conjunta', 'musica', 'pre-boda', 0, 3, 150],

  // ── FOTO & VÍDEO (10) ───────────────────────────────────────────────────
  ['foto-reportaje-boda', 'Reportaje fotográfico completo', 'foto', 'transversal', 1, 10, 1800],
  ['foto-pre-boda', 'Sesión pre-boda', 'foto', 'pre-boda', 0, 5, 450],
  ['foto-post-boda', 'Sesión post-boda trash the dress', 'foto', 'post-boda', 0, 3, 400],
  ['video-cine-boda', 'Videografía cinematográfica', 'foto', 'transversal', 1, 9, 2200],
  ['video-teaser', 'Teaser social vertical', 'foto', 'post-boda', 0, 5, 550],
  ['video-drone', 'Cobertura aérea con dron', 'foto', 'transversal', 0, 5, 480],
  ['foto-cabina', 'Photocall / cabina de fotos', 'foto', 'fiesta', 0, 4, 420],
  ['foto-instantanea', 'Fotografía instantánea para invitados', 'foto', 'coctel', 0, 3, 300],
  ['video-live-stream', 'Retransmisión en directo', 'foto', 'ceremonia', 0, 4, 650],
  ['foto-album', 'Álbum editorial y caja de archivo', 'foto', 'post-boda', 0, 5, 700],

  // ── DECORACIÓN & FLORISTERÍA (12) ───────────────────────────────────────
  ['deco-arco-floral', 'Arco o altar floral', 'decoracion', 'ceremonia', 1, 8, 850],
  ['deco-ramo-novia', 'Ramo de novia y botonier', 'decoracion', 'transversal', 1, 7, 220],
  ['deco-centros-mesa', 'Centros de mesa', 'decoracion', 'banquete', 1, 7, 45],
  ['deco-mesa-planos', 'Mesa de planos / seating chart', 'decoracion', 'coctel', 0, 4, 260],
  ['deco-iluminacion-ambiental', 'Iluminación ambiental cónica', 'decoracion', 'banquete', 1, 6, 700],
  ['deco-telones', 'Telones y techos textiles', 'decoracion', 'banquete', 0, 6, 1200],
  ['deco-mobiliario', 'Mobiliario lounge y sillas de autor', 'decoracion', 'coctel', 0, 6, 900],
  ['deco-invitaciones', 'Papelería e invitaciones', 'decoracion', 'pre-boda', 1, 5, 350],
  ['deco-candy-bar', 'Candy bar o mesa dulce', 'decoracion', 'fiesta', 0, 3, 480],
  ['deco-letras-luminosas', 'Letras o neones personalizados', 'decoracion', 'fiesta', 0, 3, 380],
  ['deco-flores-pasillo', 'Pétalos y pasillo ceremonial', 'decoracion', 'ceremonia', 0, 4, 200],
  ['deco-montaje-desmontaje', 'Montaje y desmontaje de decoración', 'decoracion', 'transversal', 1, 5, 450],
];


const SERVICE_SEEDS_PART2: readonly ServiceSeed[] = [
  // ── TÉCNICA / SONIDO & LED (12) ─────────────────────────────────────────
  ['tecnica-sonido-ceremonia', 'Sonorización de ceremonia', 'sonido', 'ceremonia', 1, 8, 450],
  ['tecnica-sonido-banquete', 'Sonorización de banquete', 'sonido', 'banquete', 1, 8, 650],
  ['tecnica-microfonos', 'Microfonía inalámbrica profesional', 'sonido', 'transversal', 1, 7, 280],
  ['tecnica-pantalla-led', 'Pantalla LED de escenario', 'sonido', 'banquete', 0, 6, 1400],
  ['tecnica-proyeccion', 'Proyección y mapping', 'sonido', 'banquete', 0, 5, 900],
  ['tecnica-iluminacion-escenario', 'Iluminación de escenario DMX', 'sonido', 'fiesta', 1, 7, 750],
  ['tecnica-estructura', 'Estructura y tarima homologada', 'sonido', 'transversal', 0, 6, 1100],
  ['tecnica-limitador', 'Limitador acústico homologado', 'sonido', 'transversal', 1, 6, 320],
  ['tecnica-discoteca-movil', 'Discoteca móvil completa', 'sonido', 'fiesta', 0, 7, 1200],
  ['tecnica-tecnico-guardia', 'Técnico de guardia durante el evento', 'sonido', 'transversal', 0, 5, 300],
  ['tecnica-efectos-especiales', 'Máquina de humo, chispas frías o CO2', 'sonido', 'fiesta', 0, 3, 380],
  ['tecnica-energia', 'Cuadro eléctrico y distribución', 'sonido', 'transversal', 0, 5, 420],

  // ── MODA & COMPLEMENTOS (10) ────────────────────────────────────────────
  ['moda-vestido-novia', 'Vestido de novia de autor', 'moda', 'transversal', 1, 9, 2200],
  ['moda-traje-novio', 'Traje de novio a medida', 'moda', 'transversal', 1, 8, 950],
  ['moda-vestidos-invitadas', 'Vestuario de invitadas', 'moda', 'transversal', 0, 4, 600],
  ['moda-joyeria', 'Joyas y alianzas', 'moda', 'ceremonia', 1, 7, 1200],
  ['moda-zapatos', 'Calzado de ceremonia', 'moda', 'transversal', 0, 5, 320],
  ['moda-tocados', 'Tocados y peluquería nupcial', 'moda', 'transversal', 0, 5, 280],
  ['moda-maquillaje', 'Maquillaje y estilismo', 'moda', 'transversal', 0, 5, 350],
  ['moda-sastreria-arreglos', 'Arreglos y sastrería', 'moda', 'pre-boda', 0, 3, 180],
  ['moda-traje-invitado', 'Trajes para invitados', 'moda', 'transversal', 0, 3, 450],
  ['moda-complementos', 'Complementos y lencería nupcial', 'moda', 'transversal', 0, 2, 220],

  // ── TRANSPORTE & LOGÍSTICA (10) ─────────────────────────────────────────
  ['transporte-coche-novia', 'Coche clásico para los novios', 'transporte', 'ceremonia', 1, 7, 550],
  ['transporte-autobus-invitados', 'Autobuses para invitados', 'transporte', 'transversal', 0, 6, 850],
  ['transporte-lanzaderas', 'Lanzaderas hotel-finca', 'transporte', 'fiesta', 0, 5, 600],
  ['transporte-vip', 'Transfer VIP del artista', 'transporte', 'transversal', 0, 4, 280],
  ['transporte-camion-carga', 'Camión de carga y descarga', 'transporte', 'transversal', 1, 6, 450],
  ['transporte-grupo-electrogeno', 'Transporte de generador', 'transporte', 'transversal', 0, 3, 300],
  ['transporte-appartamiento', 'Traslado de equipo técnico', 'transporte', 'transversal', 0, 4, 320],
  ['transporte-parking-valet', 'Valet parking', 'transporte', 'coctel', 0, 3, 380],
  ['transporte-taxi-seguro', 'Taxis de regreso asegurados', 'transporte', 'fiesta', 0, 4, 260],
  ['transporte-coordinacion', 'Coordinación logística de flota', 'transporte', 'transversal', 0, 4, 200],

  // ── WEDDING PLANNER & CEREMONIA (12) ────────────────────────────────────
  ['wedding-planner-360', 'Wedding planner dirección 360', 'wedding', 'transversal', 1, 9, 2500],
  ['wedding-coordinacion-dia', 'Coordinación del día D', 'wedding', 'transversal', 1, 8, 900],
  ['wedding-oficiante', 'Oficiante o maestro de ceremonia', 'wedding', 'ceremonia', 1, 7, 450],
  ['wedding-protocolo', 'Protocolo y orden del día', 'wedding', 'transversal', 0, 5, 380],
  ['wedding-guest-manager', 'Atención y gestión de invitados', 'wedding', 'transversal', 0, 5, 420],
  ['wedding-senales', 'Señalética y cartelería del evento', 'wedding', 'transversal', 0, 3, 180],
  ['wedding-padrinos', 'Coordinación de padrinos y familia', 'wedding', 'ceremonia', 0, 4, 200],
  ['wedding-planificacion', 'Planificación y cronograma', 'wedding', 'pre-boda', 1, 6, 600],
  ['wedding-seguro', 'Seguro de responsabilidad civil del evento', 'wedding', 'transversal', 1, 6, 350],
  ['wedding-licencias', 'Licencias y permisos municipales', 'wedding', 'pre-boda', 0, 5, 300],
  ['wedding-accesibilidad', 'Accesibilidad y movilidad reducida', 'wedding', 'transversal', 0, 4, 250],
  ['wedding-liquidacion', 'Liquidación y cierre de proveedores', 'wedding', 'post-boda', 0, 4, 150],
];


const SERVICE_SEEDS_PART3: readonly ServiceSeed[] = [
  // ── SERVICIOS COMPLEMENTARIOS (12) ──────────────────────────────────────
  ['servicios-wedding-planner-aux', 'Asistente de planner en sala', 'servicios', 'transversal', 0, 4, 280],
  ['servicios-guardarropa', 'Guardarropa y atención de sala', 'servicios', 'coctel', 0, 3, 180],
  ['servicios-limpieza', 'Limpieza durante y después del evento', 'servicios', 'post-boda', 1, 5, 420],
  ['servicios-seguridad', 'Seguridad y control de accesos', 'servicios', 'transversal', 0, 5, 600],
  ['servicios-banos-vip', 'Baños portátiles VIP', 'servicios', 'transversal', 0, 5, 750],
  ['servicios-climatizacion', 'Climatización o calefacción de carpa', 'servicios', 'transversal', 0, 5, 850],
  ['servicios-carpa', 'Carpa o jaima de recepción', 'servicios', 'banquete', 0, 7, 2400],
  ['servicios-hielo-bebidas', 'Suministro de hielo y bebidas extra', 'servicios', 'fiesta', 0, 3, 260],
  ['servicios-ninos', 'Animación y ludoteca infantil', 'servicios', 'banquete', 0, 4, 480],
  ['servicios-mascotas', 'Cuidador de mascotas del evento', 'servicios', 'transversal', 0, 2, 180],
  ['servicios-regalos', 'Detalles y regalos para invitados', 'servicios', 'post-boda', 0, 3, 350],
  ['servicios-fuegos', 'Espectáculo pirotécnico autorizado', 'servicios', 'fiesta', 0, 3, 900],

  // ── VIMUME · CENTROS SENIOR (8) ─────────────────────────────────────────
  ['senior-neuroacustica', 'Sesión de neuro-musicoterapia 40 Hz', 'senior_care', 'transversal', 1, 9, 480],
  ['senior-terapia-grupal', 'Terapia musical grupal', 'senior_care', 'transversal', 1, 8, 380],
  ['senior-fisioterapia', 'Fisioterapia acompañada de música', 'senior_care', 'transversal', 0, 6, 320],
  ['senior-psicologia', 'Apoyo psicológico y desescalada', 'senior_care', 'transversal', 1, 7, 400],
  ['senior-enfermeria', 'Cobertura de enfermería durante la sesión', 'senior_care', 'transversal', 1, 7, 350],
  ['senior-informe-clinico', 'Informe clínico y certificado RSC', 'senior_care', 'post-boda', 1, 6, 250],
  ['senior-formacion-staff', 'Formación al personal del centro', 'senior_care', 'pre-boda', 0, 5, 300],
  ['senior-adaptacion-espacio', 'Adaptación acústica del espacio', 'senior_care', 'pre-boda', 0, 5, 420],
];

/** Construye el catálogo final, derivando el calendario de cada gremio. */
function toDefinition(seed: ServiceSeed): EventServiceDefinition {
  const [id, name, providerCategory, phase, essential, weight, marketReferenceEur] = seed;
  return {
    id,
    name,
    providerCategory,
    calendarKind: inferCalendarKindFromCategory(providerCategory),
    phase,
    essential: essential === 1,
    weight,
    marketReferenceEur,
  };
}

/** CATÁLOGO CANÓNICO COMPLETO (122 servicios, inmutable). */
export const EVENT_SERVICE_CATALOG: readonly EventServiceDefinition[] = Object.freeze(
  [...SERVICE_SEEDS, ...SERVICE_SEEDS_PART2, ...SERVICE_SEEDS_PART3].map(toDefinition),
);

export const EVENT_SERVICE_BY_ID: Readonly<Record<string, EventServiceDefinition>> = Object.freeze(
  Object.fromEntries(EVENT_SERVICE_CATALOG.map((service) => [service.id, service] as const)),
);

/** Nº total de partidas del catálogo (invariante de cobertura). */
export const EVENT_SERVICE_TOTAL = EVENT_SERVICE_CATALOG.length;

/** Servicios de un gremio concreto, ordenados por peso descendente. */
export function servicesByCategory(
  category: EventProviderCategory,
): readonly EventServiceDefinition[] {
  return EVENT_SERVICE_CATALOG.filter((service) => service.providerCategory === category).sort(
    (a, b) => b.weight - a.weight,
  );
}

/** Servicios imprescindibles (el plan no puede cerrarse sin ellos). */
export const ESSENTIAL_EVENT_SERVICES: readonly EventServiceDefinition[] = Object.freeze(
  EVENT_SERVICE_CATALOG.filter((service) => service.essential),
);

/** Distribución por gremio (auditoría de cobertura). */
export function catalogCoverage(): Readonly<Record<EventProviderCategory, number>> {
  const coverage = {
    finca: 0,
    catering: 0,
    musica: 0,
    foto: 0,
    decoracion: 0,
    sonido: 0,
    moda: 0,
    transporte: 0,
    wedding: 0,
    servicios: 0,
    senior_care: 0,
  } satisfies Record<EventProviderCategory, number>;

  for (const service of EVENT_SERVICE_CATALOG) {
    coverage[service.providerCategory] += 1;
  }
  return coverage;
}
