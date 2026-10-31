/**
 * EVENT INTENT TAXONOMY — SSOT de las tipologías de evento de EAR OS.
 *
 * Qué resuelve: hasta hoy la cobertura pSEO de eventos vivía en listas sueltas
 * (`SERVICES_PSEO_EXPANDED`, `SEO_NODES`, `CANONICAL_GREMIO_SLUGS`) sin una
 * taxonomía única que dijera CUÁNTAS tipologías de evento existen y cuál es su
 * contexto acústico, su público y su demanda. Eso hacía imposible planificar
 * cobertura: no se podía auditar un universo que no estaba declarado.
 *
 * Aquí se declara UNA vez, y sólo aquí:
 *  · 8 familias canónicas de evento (corporativo, empresarial, particular,
 *    diplomático, ferias-congresos, institucional B2G, hostelería-turismo,
 *    social-comunitario),
 *  · 300 tipologías de evento (EVENT_INTENT_TARGET), cada una con slug único,
 *    público, contexto acústico, mix de servicios canónicos, estacionalidad y
 *    nivel de demanda,
 *  · los perfiles acústicos por contexto (rider Ley 37/2003) que consumen las
 *    landings y el sonómetro.
 *
 * Reglas duras (no negociables):
 *  · `services` sólo contiene slugs de `CANONICAL_SERVICES`
 *    (src/lib/navigation/canonical-taxonomy.ts). Un servicio inventado aquí
 *    produce un enlace muerto: se audita en scripts/verify_event_sitemap_coverage.ts.
 *  · Cero precios en este módulo. Todo importe sale de `ear-os-ssot.ts`
 *    (INV-01, INV-03, INV-10). Aquí sólo hay taxonomía.
 *  · Los slugs son ASCII, minúsculas y RFC 3986 (sin acentos, sin espacios).
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales.
 */

import { CANONICAL_SERVICES } from '@/lib/navigation/canonical-taxonomy';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. VOCABULARIO CERRADO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EVENT_FAMILY_IDS = [
  'corporativo',
  'empresarial',
  'particular',
  'diplomatico',
  'ferias-congresos',
  'institucional-b2g',
  'hosteleria-turismo',
  'social-comunitario',
] as const;

export type EventFamilyId = (typeof EVENT_FAMILY_IDS)[number];

export const ACOUSTIC_CONTEXTS = [
  'plaza',
  'finca',
  'interior-gala',
  'residencia',
  'institucional',
  'exterior-dia',
  'sala-multitud',
] as const;

export type AcousticContext = (typeof ACOUSTIC_CONTEXTS)[number];

/** Público comprador. B2D = cuerpo diplomático / delegaciones. */
export type EventAudience = 'B2B' | 'B2C' | 'B2G' | 'B2E' | 'B2D';

export type EventSeason =
  | 'todo-el-ano'
  | 'primavera'
  | 'verano'
  | 'otono'
  | 'invierno'
  | 'mayo-septiembre'
  | 'diciembre-enero';

/** 1 = intención de altísima demanda (se publica primero), 3 = cola larga. */
export type DemandTier = 1 | 2 | 3;

/** Universo objetivo declarado. El auditor falla si el catálogo no lo alcanza. */
export const EVENT_INTENT_TARGET = 300;

export interface EventFamily {
  id: EventFamilyId;
  label: string;
  /** Frase de contexto que usan las landings (una por familia, no plantilla vacía). */
  narrative: string;
  defaultAudience: EventAudience;
  /** Quién firma: rol real del comprador, no "el cliente". */
  buyerRole: string;
}

export const EVENT_FAMILIES: readonly EventFamily[] = [
  {
    id: 'corporativo',
    label: 'Eventos corporativos',
    narrative:
      'Convenciones, lanzamientos y ceremonias internas donde el sonido no puede fallar: la marca se juega su credibilidad en 40 minutos de escenario.',
    defaultAudience: 'B2B',
    buyerRole: 'Dirección de marketing o eventos',
  },
  {
    id: 'empresarial',
    label: 'Eventos empresariales',
    narrative:
      'Actos con comprador técnico y presupuesto aprobado: inauguraciones, firmas, asambleas y presentaciones con factura, NIF y pliego.',
    defaultAudience: 'B2B',
    buyerRole: 'Dirección general o compras',
  },
  {
    id: 'particular',
    label: 'Celebraciones particulares',
    narrative:
      'Bodas, aniversarios y ceremonias familiares donde el criterio estético manda y el depósito protege la fecha del cliente.',
    defaultAudience: 'B2C',
    buyerRole: 'Cliente final (novios, familia, anfitrión)',
  },
  {
    id: 'diplomatico',
    label: 'Actos diplomáticos y protocolo',
    narrative:
      'Recepciones oficiales, visitas de delegación y actos bilaterales donde el protocolo, la puntualidad y la discreción son requisitos de entrada.',
    defaultAudience: 'B2D',
    buyerRole: 'Cancillería, protocolo o agregaduría',
  },
  {
    id: 'ferias-congresos',
    label: 'Ferias, congresos y exposiciones',
    narrative:
      'Recintos con varios escenarios simultáneos, horario de montaje cerrado y necesidad de refuerzo sonoro por stand y por sala.',
    defaultAudience: 'B2B',
    buyerRole: 'Dirección de feria o comité organizador',
  },
  {
    id: 'institucional-b2g',
    label: 'Actos institucionales y B2G',
    narrative:
      'Contratación pública sujeta al Art. 118 LCSP: memoria técnica, seguro de RC y presupuesto cerrado por debajo del techo de contrato menor.',
    defaultAudience: 'B2G',
    buyerRole: 'Concejalía, secretaría general o contratación',
  },
  {
    id: 'hosteleria-turismo',
    label: 'Hotelería, turismo y gastronomía',
    narrative:
      'Espacios con aforo variable y normativa de ruido propia: el rider se adapta al horario del establecimiento, no al revés.',
    defaultAudience: 'B2B',
    buyerRole: 'Dirección de hotel, resort o restaurante',
  },
  {
    id: 'social-comunitario',
    label: 'Eventos sociales y comunitarios',
    narrative:
      'Actos con propósito: recaudación, asociaciones, centros de mayores y comunidad educativa, con presión sonora contenida por protocolo.',
    defaultAudience: 'B2C',
    buyerRole: 'Asociación, fundación o dirección del centro',
  },
];

export const EVENT_FAMILY_BY_ID: Readonly<Record<EventFamilyId, EventFamily>> = EVENT_FAMILIES.reduce(
  (acc, family) => {
    acc[family.id] = family;
    return acc;
  },
  {} as Record<EventFamilyId, EventFamily>
);

export function isEventFamilyId(value: string): value is EventFamilyId {
  return (EVENT_FAMILY_IDS as readonly string[]).includes(value);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. RIDER ACÚSTICO POR CONTEXTO (Ley 37/2003 · INV-13)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AcousticProfile {
  label: string;
  minDb: number;
  maxDb: number;
  /** Medio técnico exigido para sostener el rango sin sanción. */
  control: string;
  note: string;
}

export const ACOUSTIC_PROFILES: Readonly<Record<AcousticContext, AcousticProfile>> = {
  plaza: {
    label: 'Plaza o recinto ferial abierto',
    minDb: 90,
    maxDb: 102,
    control: 'Limitador telemático homologado con registro horario',
    note: 'Festejos populares: el rango se sostiene con limitador y medición en fachada de vivienda.',
  },
  finca: {
    label: 'Finca o jardín privado',
    minDb: 85,
    maxDb: 90,
    control: 'Rider de exteriores con caída controlada hacia linderos',
    note: 'Exteriores 85-90 dBA; en el interior del salón se baja a 80-85 dBA.',
  },
  'interior-gala': {
    label: 'Salón de gala cubierto',
    minDb: 70,
    maxDb: 80,
    control: 'Ajuste por aforo y microfonía inalámbrica',
    note: 'Cóctel y solista: acústica de gala, sin acoples ni saturación de sala.',
  },
  residencia: {
    label: 'Residencia o centro sociosanitario',
    minDb: 65,
    maxDb: 75,
    control: 'Protocolo no invasivo 40 Hz con control de armónicos',
    note: 'Programa de estimulación, no tratamiento médico. Límite de salud pública < 75 dB SPL.',
  },
  institucional: {
    label: 'Salón institucional o auditorio',
    minDb: 70,
    maxDb: 78,
    control: 'PA de refuerzo con inteligibilidad STI',
    note: 'Actos con himno, discursos y turnos de palabra: prioridad inteligibilidad sobre potencia.',
  },
  'exterior-dia': {
    label: 'Exterior diurno',
    minDb: 80,
    maxDb: 90,
    control: 'Direccionalidad y horario dentro de ordenanza municipal',
    note: 'Actos de día: se compensa el ruido de fondo sin invadir viviendas próximas.',
  },
  'sala-multitud': {
    label: 'Sala o recinto de gran aforo',
    minDb: 90,
    maxDb: 102,
    control: 'Line array con limitador y técnico FOH dedicado',
    note: 'Más de 1.000 asistentes: 12 W/pax como base de cálculo del sistema.',
  },
};

export function getAcousticProfile(context: AcousticContext): AcousticProfile {
  return ACOUSTIC_PROFILES[context];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. LAS 300 TIPOLOGÍAS DE EVENTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface EventIntent {
  /** Identificador de URL. Único en TODO el catálogo (no por familia). */
  slug: string;
  label: string;
  family: EventFamilyId;
  audience: EventAudience;
  context: AcousticContext;
  /** Slugs de `CANONICAL_SERVICES`. Nunca inventados. */
  services: readonly string[];
  season: EventSeason;
  demandTier: DemandTier;
}

/** Fila compacta: [slug, label, audiencia, contexto, servicios, estación, demanda]. */
type IntentRow = readonly [
  string,
  string,
  EventAudience,
  AcousticContext,
  string,
  EventSeason,
  DemandTier,
];

// ── FAMILIA 1 · CORPORATIVO (40) ───────────────────────────────────────
const CORPORATIVO_ROWS: readonly IntentRow[] = [
  ['convencion-anual-empresa', 'Convención anual de empresa', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['kickoff-comercial', 'Kickoff comercial de año', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led,dj', 'diciembre-enero', 1],
  ['lanzamiento-producto', 'Lanzamiento de producto', 'B2B', 'interior-gala', 'produccion-integral,pantallas-led,sonorizacion', 'todo-el-ano', 1],
  ['cena-gala-empresa', 'Cena de gala de empresa', 'B2B', 'interior-gala', 'musica-ceremonia,sonorizacion', 'diciembre-enero', 1],
  ['evento-incentivo', 'Evento de incentivo para equipos', 'B2B', 'finca', 'produccion-integral,dj,catering', 'primavera', 2],
  ['team-building-musical', 'Team building musical', 'B2B', 'interior-gala', 'animacion,sonorizacion', 'todo-el-ano', 2],
  ['aniversario-empresa', 'Aniversario de empresa', 'B2B', 'interior-gala', 'produccion-integral,pantallas-led,musica-ceremonia', 'todo-el-ano', 1],
  ['presentacion-resultados', 'Presentación de resultados anuales', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'invierno', 1],
  ['roadshow-comercial', 'Roadshow comercial multi-ciudad', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,dj', 'todo-el-ano', 2],
  ['apertura-delegacion', 'Apertura de delegación', 'B2B', 'interior-gala', 'sonorizacion,catering,decoracion', 'todo-el-ano', 2],
  ['afterwork-corporativo', 'Afterwork corporativo', 'B2B', 'interior-gala', 'dj,sonorizacion', 'todo-el-ano', 1],
  ['gala-premios-internos', 'Gala de premios internos', 'B2B', 'interior-gala', 'produccion-integral,maestros-ceremonia,pantallas-led', 'diciembre-enero', 1],
  ['evento-marca-experiencial', 'Evento de marca experiencial', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['pop-up-store-musica', 'Pop-up store con música en directo', 'B2B', 'exterior-dia', 'musica-ceremonia,sonorizacion', 'verano', 3],
  ['activacion-promocional', 'Activación promocional en calle', 'B2B', 'exterior-dia', 'animacion,sonorizacion', 'todo-el-ano', 2],
  ['evento-prensa', 'Evento de prensa', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['rueda-de-prensa', 'Rueda de prensa', 'B2B', 'institucional', 'sonorizacion', 'todo-el-ano', 1],
  ['summit-interno', 'Summit interno de directivos', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion', 'invierno', 2],
  ['offsite-directivos', 'Offsite de directivos', 'B2B', 'finca', 'produccion-integral,catering,dj', 'otono', 2],
  ['retiro-consejo', 'Retiro de consejo de administración', 'B2B', 'finca', 'sonorizacion,catering', 'todo-el-ano', 2],
  ['onboarding-empleados', 'Jornada de onboarding de empleados', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['celebracion-jubilacion', 'Celebración de jubilación corporativa', 'B2B', 'interior-gala', 'musica-ceremonia,catering', 'todo-el-ano', 2],
  ['homenaje-empleado', 'Homenaje a empleado histórico', 'B2B', 'interior-gala', 'musica-ceremonia,maestros-ceremonia', 'todo-el-ano', 2],
  ['evento-navidad-empresa', 'Cena de Navidad de empresa', 'B2B', 'interior-gala', 'dj,sonorizacion,catering', 'diciembre-enero', 1],
  ['fin-de-ano-corporativo', 'Fin de año corporativo', 'B2B', 'sala-multitud', 'dj,produccion-integral,sonorizacion', 'diciembre-enero', 1],
  ['aniversario-marca', 'Aniversario de marca', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led', 'todo-el-ano', 2],
  ['convencion-franquicias', 'Convención de franquicias', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,dj', 'invierno', 2],
  ['encuentro-distribuidores', 'Encuentro de distribuidores', 'B2B', 'interior-gala', 'sonorizacion,catering', 'otono', 2],
  ['feria-interna-proveedores', 'Feria interna de proveedores', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 3],
  ['formacion-corporativa-musical', 'Formación corporativa con música', 'B2B', 'interior-gala', 'animacion,sonorizacion', 'todo-el-ano', 3],
  ['hackathon-corporativo', 'Hackathon corporativo', 'B2B', 'sala-multitud', 'sonorizacion,catering,pantallas-led', 'todo-el-ano', 3],
  ['demo-day-startup', 'Demo day de startup', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led,maestros-ceremonia', 'todo-el-ano', 2],
  ['evento-inversores', 'Evento con inversores', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['cena-relacional-clientes', 'Cena relacional con clientes clave', 'B2B', 'interior-gala', 'musica-ceremonia,catering,sonorizacion', 'todo-el-ano', 2],
  ['evento-fidelizacion', 'Evento de fidelización de clientes', 'B2B', 'finca', 'produccion-integral,dj,catering', 'verano', 2],
  ['experiencia-vip-clientes', 'Experiencia VIP para clientes', 'B2B', 'finca', 'coches-boda,produccion-integral,musica-ceremonia', 'todo-el-ano', 2],
  ['congreso-corporativo', 'Congreso corporativo', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,produccion-integral', 'todo-el-ano', 1],
  ['evento-sostenibilidad-esg', 'Evento de sostenibilidad y ESG', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['town-hall-hibrido', 'Town hall híbrido con streaming', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['evento-streaming-marca', 'Evento de marca retransmitido en directo', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led,sonorizacion', 'todo-el-ano', 2],
];

// ── FAMILIA 2 · EMPRESARIAL (38) ───────────────────────────────────────
const EMPRESARIAL_ROWS: readonly IntentRow[] = [
  ['junta-general-accionistas', 'Junta general de accionistas', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'primavera', 1],
  ['presentacion-plan-estrategico', 'Presentación del plan estratégico', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'invierno', 1],
  ['inauguracion-planta', 'Inauguración de planta industrial', 'B2B', 'exterior-dia', 'sonorizacion,produccion-integral,catering', 'todo-el-ano', 2],
  ['apertura-fabrica', 'Apertura de fábrica', 'B2B', 'exterior-dia', 'sonorizacion,produccion-integral,pantallas-led', 'todo-el-ano', 2],
  ['inauguracion-oficinas', 'Inauguración de oficinas corporativas', 'B2B', 'interior-gala', 'sonorizacion,catering,decoracion', 'todo-el-ano', 1],
  ['feria-industrial-sector', 'Feria industrial del sector', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'otono', 2],
  ['jornada-tecnica-sectorial', 'Jornada técnica sectorial', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['mesa-redonda-sector', 'Mesa redonda sectorial', 'B2B', 'institucional', 'sonorizacion', 'todo-el-ano', 2],
  ['networking-sectorial', 'Networking sectorial', 'B2B', 'interior-gala', 'sonorizacion,dj,catering', 'todo-el-ano', 1],
  ['almuerzo-empresarial', 'Almuerzo empresarial', 'B2B', 'interior-gala', 'musica-ceremonia,catering', 'todo-el-ano', 1],
  ['desayuno-de-trabajo', 'Desayuno de trabajo con ponencia', 'B2B', 'interior-gala', 'sonorizacion', 'todo-el-ano', 2],
  ['evento-camara-comercio', 'Evento de cámara de comercio', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['mision-comercial', 'Misión comercial internacional', 'B2B', 'institucional', 'sonorizacion,produccion-integral', 'todo-el-ano', 2],
  ['encuentro-exportadores', 'Encuentro de exportadores', 'B2B', 'interior-gala', 'sonorizacion', 'otono', 3],
  ['presentacion-memoria-anual', 'Presentación de memoria anual', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'primavera', 1],
  ['asamblea-cooperativa', 'Asamblea de cooperativa', 'B2B', 'interior-gala', 'sonorizacion', 'invierno', 2],
  ['convencion-socios', 'Convención de socios', 'B2B', 'sala-multitud', 'sonorizacion,dj,catering', 'otono', 2],
  ['apertura-franquicia', 'Apertura de franquicia', 'B2B', 'exterior-dia', 'sonorizacion,animacion', 'todo-el-ano', 2],
  ['showroom-automotriz', 'Showroom automotriz', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion,produccion-integral', 'todo-el-ano', 2],
  ['test-drive-vip', 'Test drive VIP', 'B2B', 'exterior-dia', 'coches-boda,sonorizacion,catering', 'primavera', 2],
  ['presentacion-inmobiliaria', 'Presentación de promoción inmobiliaria', 'B2B', 'interior-gala', 'pantallas-led,sonorizacion,decoracion', 'todo-el-ano', 2],
  ['entrega-llaves-promocion', 'Entrega de llaves de promoción', 'B2B', 'interior-gala', 'sonorizacion,animacion,catering', 'todo-el-ano', 2],
  ['evento-constructora', 'Evento de constructora', 'B2B', 'exterior-dia', 'sonorizacion,produccion-integral', 'todo-el-ano', 3],
  ['colocacion-primera-piedra', 'Colocación de primera piedra', 'B2B', 'exterior-dia', 'sonorizacion,produccion-integral,fotografia', 'todo-el-ano', 2],
  ['inauguracion-nave-logistica', 'Inauguración de nave logística', 'B2B', 'exterior-dia', 'sonorizacion,produccion-integral', 'todo-el-ano', 3],
  ['evento-agroalimentario', 'Evento agroalimentario', 'B2B', 'exterior-dia', 'sonorizacion,catering,animacion', 'otono', 2],
  ['presentacion-vinos-bodega', 'Presentación de añada en bodega', 'B2B', 'finca', 'catering,musica-ceremonia,sonorizacion', 'otono', 1],
  ['cata-empresarial', 'Cata empresarial dirigida', 'B2B', 'interior-gala', 'catering,sonorizacion', 'todo-el-ano', 2],
  ['evento-farmaceutico', 'Evento de laboratorio farmacéutico', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['congreso-medico-privado', 'Congreso médico privado', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,produccion-integral', 'todo-el-ano', 1],
  ['evento-firma-legal', 'Evento de firma legal', 'B2B', 'institucional', 'sonorizacion,catering', 'todo-el-ano', 2],
  ['celebracion-fusion', 'Celebración de fusión empresarial', 'B2B', 'interior-gala', 'produccion-integral,catering,musica-ceremonia', 'todo-el-ano', 2],
  ['jornada-rrhh', 'Jornada de recursos humanos', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['feria-empleo-empresa', 'Feria de empleo corporativa', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'primavera', 3],
  ['evento-startup-pitch', 'Evento de pitch para startups', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led,maestros-ceremonia', 'todo-el-ano', 2],
  ['encuentro-business-angels', 'Encuentro de business angels', 'B2B', 'institucional', 'sonorizacion,catering', 'otono', 3],
  ['gala-empresarial-camara', 'Gala empresarial de cámara', 'B2B', 'interior-gala', 'produccion-integral,maestros-ceremonia,musica-ceremonia', 'diciembre-enero', 1],
  ['ceremonia-firma-convenio', 'Ceremonia de firma de convenio', 'B2B', 'institucional', 'sonorizacion,fotografia,produccion-integral', 'todo-el-ano', 2],
];

// ── FAMILIA 3 · PARTICULAR (55) ────────────────────────────────────────
const PARTICULAR_ROWS: readonly IntentRow[] = [
  ['boda-civil', 'Boda civil', 'B2C', 'interior-gala', 'musica-ceremonia,dj,fotografia', 'mayo-septiembre', 1],
  ['boda-religiosa', 'Boda religiosa', 'B2C', 'interior-gala', 'musica-ceremonia,decoracion,fotografia', 'mayo-septiembre', 1],
  ['boda-destino', 'Boda destino en España', 'B2C', 'finca', 'produccion-integral,wedding-planner,musica-ceremonia', 'mayo-septiembre', 1],
  ['boda-playa', 'Boda en la playa', 'B2C', 'exterior-dia', 'sonorizacion,musica-ceremonia,fotografia', 'verano', 1],
  ['boda-finca', 'Boda en finca', 'B2C', 'finca', 'fincas,sonorizacion,catering', 'mayo-septiembre', 1],
  ['pedida-de-mano', 'Pedida de mano con serenata', 'B2C', 'interior-gala', 'mariachis,musica-ceremonia', 'todo-el-ano', 1],
  ['despedida-soltero', 'Despedida de soltero', 'B2C', 'sala-multitud', 'dj,animacion,sonorizacion', 'primavera', 2],
  ['preboda', 'Fiesta de preboda', 'B2C', 'finca', 'dj,catering,sonorizacion', 'mayo-septiembre', 2],
  ['cena-ensayo-boda', 'Cena de ensayo de boda', 'B2C', 'interior-gala', 'musica-ceremonia,catering', 'mayo-septiembre', 2],
  ['brunch-postboda', 'Brunch posterior a la boda', 'B2C', 'finca', 'catering,musica-ceremonia', 'mayo-septiembre', 3],
  ['aniversario-boda', 'Aniversario de boda', 'B2C', 'interior-gala', 'mariachis,catering,musica-ceremonia', 'todo-el-ano', 1],
  ['renovacion-votos', 'Renovación de votos', 'B2C', 'finca', 'musica-ceremonia,fotografia,decoracion', 'mayo-septiembre', 2],
  ['bautizo', 'Bautizo', 'B2C', 'interior-gala', 'musica-ceremonia,catering,fotografia', 'todo-el-ano', 1],
  ['primera-comunion', 'Primera comunión', 'B2C', 'interior-gala', 'musica-ceremonia,catering,animacion', 'primavera', 1],
  ['confirmacion', 'Confirmación', 'B2C', 'interior-gala', 'musica-ceremonia,catering', 'primavera', 2],
  ['cumpleanos-adulto', 'Cumpleaños de adulto', 'B2C', 'interior-gala', 'dj,catering,sonorizacion', 'todo-el-ano', 1],
  ['cumpleanos-infantil', 'Cumpleaños infantil', 'B2C', 'exterior-dia', 'animacion,sonorizacion,catering', 'todo-el-ano', 1],
  ['cumpleanos-sorpresa', 'Cumpleaños sorpresa', 'B2C', 'interior-gala', 'mariachis,dj,sonorizacion', 'todo-el-ano', 1],
  ['quinceanera-xv-anos', 'Quinceañera (XV años)', 'B2C', 'sala-multitud', 'dj,produccion-integral,fotografia', 'todo-el-ano', 1],
  ['sweet-sixteen', 'Fiesta Sweet 16', 'B2C', 'sala-multitud', 'dj,animacion,pantallas-led', 'todo-el-ano', 2],
  ['graduacion-bachillerato', 'Graduación de bachillerato', 'B2C', 'sala-multitud', 'dj,pantallas-led,fotografia', 'primavera', 1],
  ['graduacion-universidad', 'Graduación universitaria', 'B2C', 'sala-multitud', 'produccion-integral,pantallas-led,fotografia', 'primavera', 1],
  ['fin-de-curso', 'Fiesta de fin de curso', 'B2C', 'exterior-dia', 'dj,animacion,sonorizacion', 'verano', 1],
  ['jubilacion-particular', 'Jubilación familiar', 'B2C', 'interior-gala', 'musica-ceremonia,catering,mariachis', 'todo-el-ano', 2],
  ['homenaje-familiar', 'Homenaje familiar', 'B2C', 'interior-gala', 'mariachis,musica-ceremonia,fotografia', 'todo-el-ano', 2],
  ['reunion-familiar', 'Reunión familiar', 'B2C', 'finca', 'catering,musica-ceremonia', 'verano', 2],
  ['comida-familiar', 'Comida familiar numerosa', 'B2C', 'interior-gala', 'catering,musica-ceremonia', 'todo-el-ano', 2],
  ['barbacoa-privada', 'Barbacoa privada', 'B2C', 'finca', 'catering,sonorizacion,dj', 'verano', 2],
  ['fiesta-jardin', 'Fiesta en jardín', 'B2C', 'finca', 'sonorizacion,dj,decoracion', 'verano', 2],
  ['fiesta-piscina', 'Fiesta en piscina', 'B2C', 'exterior-dia', 'dj,sonorizacion,animacion', 'verano', 3],
  ['fiesta-tematica', 'Fiesta temática', 'B2C', 'interior-gala', 'dj,animacion,decoracion', 'todo-el-ano', 2],
  ['halloween-privado', 'Fiesta de Halloween privada', 'B2C', 'interior-gala', 'dj,animacion,decoracion', 'otono', 2],
  ['nochevieja-privada', 'Nochevieja privada', 'B2C', 'interior-gala', 'dj,catering,sonorizacion', 'diciembre-enero', 1],
  ['reyes-magos-casa', 'Visita de Reyes Magos a domicilio', 'B2C', 'exterior-dia', 'animacion,fotografia,sonorizacion', 'diciembre-enero', 2],
  ['navidad-familiar', 'Comida de Navidad familiar', 'B2C', 'interior-gala', 'catering,musica-ceremonia,mariachis', 'diciembre-enero', 1],
  ['santo-personal', 'Celebración del santo', 'B2C', 'interior-gala', 'mariachis,catering,dj', 'todo-el-ano', 2],
  ['baby-shower', 'Baby shower', 'B2C', 'interior-gala', 'catering,decoracion,animacion', 'todo-el-ano', 2],
  ['revelacion-genero', 'Revelación de género', 'B2C', 'finca', 'decoracion,animacion,fotografia', 'todo-el-ano', 2],
  ['bienvenida-bebe', 'Bienvenida del bebé', 'B2C', 'interior-gala', 'catering,decoracion,fotografia', 'todo-el-ano', 3],
  ['adopcion-celebracion', 'Celebración de adopción', 'B2C', 'interior-gala', 'catering,fotografia,animacion', 'todo-el-ano', 3],
  ['aniversario-pareja', 'Aniversario de pareja', 'B2C', 'interior-gala', 'mariachis,musica-ceremonia,catering', 'todo-el-ano', 1],
  ['san-valentin-privado', 'Cena de San Valentín', 'B2C', 'interior-gala', 'musica-ceremonia,mariachis,catering', 'invierno', 1],
  ['cena-romantica', 'Cena romántica con música en directo', 'B2C', 'interior-gala', 'musica-ceremonia,mariachis', 'todo-el-ano', 1],
  ['propuesta-matrimonio', 'Propuesta de matrimonio', 'B2C', 'finca', 'mariachis,musica-ceremonia,fotografia', 'todo-el-ano', 1],
  ['micro-boda', 'Microboda de menos de 30 invitados', 'B2C', 'finca', 'musica-ceremonia,fincas,fotografia', 'mayo-septiembre', 2],
  ['elopement', 'Elopement (boda íntima de dos)', 'B2C', 'finca', 'musica-ceremonia,fotografia,fincas', 'mayo-septiembre', 2],
  ['boda-intima', 'Boda íntima', 'B2C', 'interior-gala', 'musica-ceremonia,catering,fotografia', 'todo-el-ano', 1],
  ['boda-multitudinaria', 'Boda multitudinaria de más de 300 invitados', 'B2C', 'sala-multitud', 'produccion-integral,sonorizacion,dj', 'mayo-septiembre', 2],
  ['boda-segunda-vuelta', 'Segunda boda', 'B2C', 'finca', 'musica-ceremonia,dj,catering', 'todo-el-ano', 1],
  ['boda-intercultural', 'Boda intercultural', 'B2C', 'finca', 'mariachis,musica-ceremonia,dj', 'todo-el-ano', 2],
  ['boda-tematica', 'Boda temática', 'B2C', 'finca', 'decoracion,produccion-integral,musica-ceremonia', 'mayo-septiembre', 2],
  ['boda-invernal', 'Boda de invierno', 'B2C', 'interior-gala', 'musica-ceremonia,catering,decoracion', 'invierno', 2],
  ['boda-nocturna', 'Boda nocturna', 'B2C', 'finca', 'sonorizacion,dj,decoracion', 'mayo-septiembre', 2],
  ['ceremonia-laica', 'Ceremonia laica', 'B2C', 'finca', 'maestros-ceremonia,musica-ceremonia,decoracion', 'todo-el-ano', 1],
  ['fiesta-aniversario-plata', 'Bodas de plata', 'B2C', 'interior-gala', 'mariachis,catering,musica-ceremonia', 'todo-el-ano', 2],
];

// ── FAMILIA 4 · DIPLOMÁTICO (27) ───────────────────────────────────────
const DIPLOMATICO_ROWS: readonly IntentRow[] = [
  ['recepcion-embajada', 'Recepción en embajada', 'B2D', 'institucional', 'sonorizacion,musica-ceremonia,catering', 'todo-el-ano', 1],
  ['fiesta-nacional-embajada', 'Fiesta nacional de una embajada', 'B2D', 'institucional', 'sonorizacion,musica-ceremonia,produccion-integral', 'otono', 2],
  ['visita-delegacion-extranjera', 'Visita de delegación extranjera', 'B2D', 'institucional', 'sonorizacion,produccion-integral', 'todo-el-ano', 2],
  ['cena-oficial-consulado', 'Cena oficial de consulado', 'B2D', 'interior-gala', 'musica-ceremonia,catering,sonorizacion', 'todo-el-ano', 1],
  ['acto-protocolo-embajada', 'Acto de protocolo en embajada', 'B2D', 'institucional', 'sonorizacion,maestros-ceremonia', 'todo-el-ano', 1],
  ['recepcion-consular', 'Recepción consular', 'B2D', 'interior-gala', 'musica-ceremonia,catering', 'todo-el-ano', 2],
  ['evento-cooperacion-internacional', 'Evento de cooperación internacional', 'B2D', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['encuentro-camara-bilateral', 'Encuentro de cámara bilateral', 'B2D', 'interior-gala', 'sonorizacion,catering', 'todo-el-ano', 2],
  ['summit-embajadores', 'Cumbre de embajadores', 'B2D', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'primavera', 2],
  ['homenaje-cuerpo-diplomatico', 'Homenaje al cuerpo diplomático', 'B2D', 'institucional', 'musica-ceremonia,sonorizacion,maestros-ceremonia', 'todo-el-ano', 2],
  ['gala-internacional', 'Gala internacional', 'B2D', 'interior-gala', 'produccion-integral,musica-ceremonia,maestros-ceremonia', 'diciembre-enero', 1],
  ['semana-cultural-pais', 'Semana cultural de un país', 'B2D', 'exterior-dia', 'musica-ceremonia,sonorizacion,decoracion', 'todo-el-ano', 2],
  ['exposicion-cultural-embajada', 'Exposición cultural en sede diplomática', 'B2D', 'institucional', 'pantallas-led,sonorizacion,decoracion', 'todo-el-ano', 3],
  ['concierto-himno-protocolo', 'Concierto con himno y protocolo', 'B2D', 'institucional', 'musica-ceremonia,sonorizacion,produccion-integral', 'todo-el-ano', 1],
  ['acreditacion-prensa-internacional', 'Acreditación de prensa internacional', 'B2D', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 3],
  ['inauguracion-sede-consular', 'Inauguración de sede consular', 'B2D', 'interior-gala', 'sonorizacion,catering,produccion-integral', 'todo-el-ano', 2],
  ['visita-oficial-ministro', 'Visita oficial de ministro', 'B2D', 'institucional', 'sonorizacion,produccion-integral', 'todo-el-ano', 2],
  ['delegacion-comercial-extranjera', 'Delegación comercial extranjera', 'B2D', 'interior-gala', 'sonorizacion,catering,pantallas-led', 'todo-el-ano', 2],
  ['foro-empresarial-bilateral', 'Foro empresarial bilateral', 'B2D', 'sala-multitud', 'produccion-integral,pantallas-led,sonorizacion', 'otono', 2],
  ['recepcion-ong-internacional', 'Recepción de ONG internacional', 'B2D', 'interior-gala', 'sonorizacion,catering', 'todo-el-ano', 3],
  ['acto-naciones-unidas', 'Acto conmemorativo de Naciones Unidas', 'B2D', 'institucional', 'sonorizacion,musica-ceremonia', 'otono', 2],
  ['evento-delegacion-ue', 'Evento de delegación de la Unión Europea', 'B2D', 'institucional', 'produccion-integral,sonorizacion,pantallas-led', 'primavera', 2],
  ['recepcion-cuerpo-consular', 'Recepción del cuerpo consular', 'B2D', 'interior-gala', 'musica-ceremonia,catering,sonorizacion', 'todo-el-ano', 2],
  ['ceremonia-condecoracion', 'Ceremonia de condecoración', 'B2D', 'institucional', 'musica-ceremonia,sonorizacion,maestros-ceremonia', 'todo-el-ano', 1],
  ['acto-neutralidad-protocolo', 'Acto de protocolo neutral', 'B2D', 'institucional', 'sonorizacion', 'todo-el-ano', 3],
  ['evento-intercultural-diplomatico', 'Evento intercultural diplomático', 'B2D', 'exterior-dia', 'musica-ceremonia,animacion,sonorizacion', 'todo-el-ano', 2],
  ['despedida-agregado', 'Despedida de agregado diplomático', 'B2D', 'interior-gala', 'musica-ceremonia,catering,fotografia', 'todo-el-ano', 3],
];

// ── FAMILIA 5 · FERIAS Y CONGRESOS (40) ────────────────────────────────
const FERIAS_ROWS: readonly IntentRow[] = [
  ['feria-comercial', 'Feria comercial', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,produccion-integral', 'todo-el-ano', 1],
  ['salon-sectorial', 'Salón sectorial', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'otono', 2],
  ['congreso-nacional', 'Congreso nacional', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['congreso-internacional', 'Congreso internacional', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led,sonorizacion', 'todo-el-ano', 1],
  ['expo-industrial', 'Exposición industrial', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'otono', 2],
  ['feria-agroalimentaria', 'Feria agroalimentaria', 'B2B', 'exterior-dia', 'sonorizacion,catering,animacion', 'otono', 2],
  ['salon-turismo', 'Salón de turismo', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion', 'invierno', 2],
  ['feria-tecnologia', 'Feria de tecnología', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion,produccion-integral', 'todo-el-ano', 1],
  ['feria-automotriz', 'Feria automovilística', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led,sonorizacion', 'todo-el-ano', 2],
  ['expo-inmobiliaria', 'Exposición inmobiliaria', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion,decoracion', 'primavera', 2],
  ['feria-nupcial', 'Feria nupcial', 'B2C', 'sala-multitud', 'decoracion,pantallas-led,sonorizacion', 'invierno', 1],
  ['expo-boda', 'Expo boda', 'B2C', 'sala-multitud', 'decoracion,sonorizacion,pantallas-led', 'invierno', 2],
  ['feria-artesania', 'Feria de artesanía', 'B2C', 'exterior-dia', 'sonorizacion,animacion,decoracion', 'verano', 2],
  ['mercado-navideno-empresa', 'Mercado navideño corporativo', 'B2B', 'exterior-dia', 'decoracion,sonorizacion,animacion', 'diciembre-enero', 2],
  ['feria-del-libro', 'Feria del libro', 'B2C', 'exterior-dia', 'sonorizacion,animacion', 'primavera', 2],
  ['congreso-medico', 'Congreso médico', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['congreso-juridico', 'Congreso jurídico', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['congreso-educativo', 'Congreso educativo', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['simposio-cientifico', 'Simposio científico', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led,produccion-integral', 'todo-el-ano', 2],
  ['workshop-sectorial', 'Workshop sectorial', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['masterclass-sector', 'Masterclass del sector', 'B2B', 'interior-gala', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['mesa-expositiva', 'Zona de mesas expositoras', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 3],
  ['stand-ferial', 'Refuerzo sonoro de stand ferial', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['inauguracion-feria', 'Inauguración de feria', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,maestros-ceremonia', 'todo-el-ano', 2],
  ['clausura-feria', 'Clausura de feria', 'B2B', 'sala-multitud', 'sonorizacion,maestros-ceremonia,musica-ceremonia', 'todo-el-ano', 2],
  ['entrega-premios-feria', 'Entrega de premios de feria', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led,maestros-ceremonia', 'todo-el-ano', 2],
  ['congreso-gastronomia', 'Congreso de gastronomía', 'B2B', 'interior-gala', 'catering,sonorizacion,pantallas-led', 'otono', 2],
  ['salon-belleza', 'Salón de belleza y estética', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion,decoracion', 'primavera', 2],
  ['feria-moda', 'Feria de moda', 'B2B', 'sala-multitud', 'produccion-integral,pantallas-led,dj', 'primavera', 1],
  ['feria-mueble-decoracion', 'Feria de mueble y decoración', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion,decoracion', 'invierno', 3],
  ['expo-energias-renovables', 'Expo de energías renovables', 'B2B', 'sala-multitud', 'pantallas-led,sonorizacion', 'otono', 2],
  ['salon-logistica', 'Salón de logística', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'otono', 3],
  ['feria-seguridad', 'Feria de seguridad', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'invierno', 3],
  ['expo-salud', 'Expo de salud', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'primavera', 2],
  ['congreso-enfermeria', 'Congreso de enfermería', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['jornada-cientifica', 'Jornada científica', 'B2B', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['congreso-ingenieria', 'Congreso de ingeniería', 'B2B', 'sala-multitud', 'sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['feria-universitaria', 'Feria universitaria', 'B2C', 'sala-multitud', 'sonorizacion,animacion,pantallas-led', 'primavera', 2],
  ['expo-educativa', 'Expo educativa', 'B2C', 'sala-multitud', 'sonorizacion,pantallas-led,animacion', 'primavera', 2],
  ['cumbre-empresarial-feria', 'Cumbre empresarial de feria', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 1],
];

// ── FAMILIA 6 · INSTITUCIONAL B2G (35) ─────────────────────────────────
const INSTITUCIONAL_ROWS: readonly IntentRow[] = [
  ['fiestas-patronales', 'Fiestas patronales', 'B2G', 'plaza', 'produccion-integral,sonorizacion,pantallas-led', 'verano', 1],
  ['fiestas-mayores-barrio', 'Fiestas mayores de barrio', 'B2G', 'plaza', 'sonorizacion,dj,animacion', 'verano', 1],
  ['romeria', 'Romería', 'B2G', 'exterior-dia', 'sonorizacion,animacion,catering', 'primavera', 1],
  ['procesion-religiosa', 'Procesión religiosa', 'B2G', 'plaza', 'sonorizacion,musica-ceremonia', 'primavera', 1],
  ['cabalgata-reyes', 'Cabalgata de Reyes', 'B2G', 'plaza', 'sonorizacion,animacion,produccion-integral', 'diciembre-enero', 1],
  ['carnaval-municipal', 'Carnaval municipal', 'B2G', 'plaza', 'sonorizacion,dj,pantallas-led', 'invierno', 1],
  ['semana-santa-procesion', 'Procesión de Semana Santa', 'B2G', 'plaza', 'sonorizacion,musica-ceremonia', 'primavera', 1],
  ['corpus-christi', 'Corpus Christi', 'B2G', 'plaza', 'sonorizacion,musica-ceremonia,decoracion', 'primavera', 2],
  ['feria-de-agosto', 'Feria de agosto', 'B2G', 'plaza', 'produccion-integral,sonorizacion,dj', 'verano', 1],
  ['feria-de-septiembre', 'Feria de septiembre', 'B2G', 'plaza', 'produccion-integral,sonorizacion,pantallas-led', 'otono', 1],
  ['verbena-popular', 'Verbena popular', 'B2G', 'plaza', 'sonorizacion,dj,animacion', 'verano', 1],
  ['hoguera-san-juan', 'Hoguera de San Juan', 'B2G', 'plaza', 'sonorizacion,dj,produccion-integral', 'verano', 2],
  ['fallas-municipales', 'Fallas municipales', 'B2G', 'plaza', 'produccion-integral,sonorizacion,animacion', 'primavera', 2],
  ['fiesta-cosecha', 'Fiesta de la cosecha', 'B2G', 'exterior-dia', 'sonorizacion,catering,animacion', 'otono', 2],
  ['dia-de-la-comunidad', 'Día de la comunidad autónoma', 'B2G', 'plaza', 'produccion-integral,sonorizacion,musica-ceremonia', 'primavera', 2],
  ['acto-institucional-municipal', 'Acto institucional municipal', 'B2G', 'institucional', 'sonorizacion,produccion-integral', 'todo-el-ano', 1],
  ['toma-de-posesion', 'Toma de posesión de cargo', 'B2G', 'institucional', 'sonorizacion,musica-ceremonia', 'todo-el-ano', 2],
  ['homenaje-a-la-bandera', 'Homenaje a la bandera', 'B2G', 'plaza', 'sonorizacion,musica-ceremonia,produccion-integral', 'todo-el-ano', 2],
  ['acto-civico-homenaje', 'Acto cívico de homenaje', 'B2G', 'institucional', 'sonorizacion,musica-ceremonia', 'todo-el-ano', 2],
  ['inauguracion-instalacion-municipal', 'Inauguración de instalación municipal', 'B2G', 'institucional', 'sonorizacion,produccion-integral,pantallas-led', 'todo-el-ano', 1],
  ['entrega-premios-municipales', 'Entrega de premios municipales', 'B2G', 'institucional', 'produccion-integral,maestros-ceremonia,musica-ceremonia', 'diciembre-enero', 2],
  ['gala-deporte-municipal', 'Gala del deporte municipal', 'B2G', 'institucional', 'produccion-integral,pantallas-led,maestros-ceremonia', 'invierno', 2],
  ['concierto-fiestas-lcsp', 'Concierto de fiestas por contrato menor', 'B2G', 'plaza', 'produccion-integral,sonorizacion,pantallas-led', 'verano', 1],
  ['festival-municipal-musica', 'Festival municipal de música', 'B2G', 'plaza', 'produccion-integral,sonorizacion,pantallas-led', 'verano', 1],
  ['ciclo-cultura-ayuntamiento', 'Ciclo cultural del ayuntamiento', 'B2G', 'institucional', 'sonorizacion,musica-ceremonia', 'otono', 2],
  ['semana-cultural-municipal', 'Semana cultural municipal', 'B2G', 'institucional', 'sonorizacion,animacion,pantallas-led', 'primavera', 2],
  ['campana-navidad-ayuntamiento', 'Campaña de Navidad del ayuntamiento', 'B2G', 'plaza', 'produccion-integral,decoracion,sonorizacion', 'diciembre-enero', 1],
  ['alumbrado-navidieno-acto', 'Encendido de alumbrado navideño', 'B2G', 'plaza', 'decoracion,produccion-integral,pantallas-led', 'diciembre-enero', 1],
  ['cabalgata-verano', 'Cabalgata de verano', 'B2G', 'plaza', 'sonorizacion,animacion,produccion-integral', 'verano', 2],
  ['acto-internacional-ciudad', 'Acto internacional de ciudad', 'B2G', 'institucional', 'produccion-integral,sonorizacion', 'todo-el-ano', 2],
  ['hermanamiento-ciudades', 'Hermanamiento de ciudades', 'B2G', 'institucional', 'musica-ceremonia,sonorizacion,catering', 'todo-el-ano', 2],
  ['jornada-participacion-ciudadana', 'Jornada de participación ciudadana', 'B2G', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 3],
  ['evento-juventud-ayuntamiento', 'Evento de juventud del ayuntamiento', 'B2G', 'exterior-dia', 'dj,sonorizacion,animacion', 'verano', 2],
  ['evento-mayores-ayuntamiento', 'Evento para mayores del ayuntamiento', 'B2G', 'interior-gala', 'musica-ceremonia,catering,sonorizacion', 'todo-el-ano', 2],
  ['mercado-medieval-municipal', 'Mercado medieval municipal', 'B2G', 'plaza', 'sonorizacion,animacion,decoracion', 'otono', 2],
];

// ── FAMILIA 7 · HOSTELERÍA Y TURISMO (32) ──────────────────────────────
const HOSTELERIA_ROWS: readonly IntentRow[] = [
  ['apertura-hotel', 'Apertura de hotel', 'B2B', 'interior-gala', 'sonorizacion,produccion-integral,catering', 'todo-el-ano', 1],
  ['aniversario-hotel', 'Aniversario de hotel', 'B2B', 'interior-gala', 'musica-ceremonia,catering,sonorizacion', 'todo-el-ano', 2],
  ['gala-hotelera', 'Gala hotelera', 'B2B', 'interior-gala', 'produccion-integral,maestros-ceremonia,musica-ceremonia', 'invierno', 2],
  ['evento-resort', 'Evento en resort', 'B2B', 'finca', 'produccion-integral,dj,catering', 'verano', 1],
  ['presentacion-destino', 'Presentación de destino turístico', 'B2B', 'interior-gala', 'pantallas-led,sonorizacion,produccion-integral', 'todo-el-ano', 2],
  ['fam-trip', 'Fam trip para agencias', 'B2B', 'exterior-dia', 'catering,musica-ceremonia,sonorizacion', 'primavera', 2],
  ['press-trip', 'Press trip', 'B2B', 'exterior-dia', 'catering,sonorizacion,fotografia', 'primavera', 2],
  ['evento-turoperador', 'Evento con turoperador', 'B2B', 'interior-gala', 'sonorizacion,catering,pantallas-led', 'otono', 2],
  ['convencion-agencias-viajes', 'Convención de agencias de viajes', 'B2B', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'invierno', 2],
  ['cena-maridaje', 'Cena maridaje', 'B2B', 'interior-gala', 'catering,musica-ceremonia', 'todo-el-ano', 1],
  ['cata-vinos-hotel', 'Cata de vinos en hotel', 'B2B', 'interior-gala', 'catering,sonorizacion', 'otono', 2],
  ['brunch-hotelero', 'Brunch hotelero', 'B2B', 'interior-gala', 'catering,musica-ceremonia,dj', 'primavera', 2],
  ['pool-party-hotel', 'Pool party de hotel', 'B2B', 'exterior-dia', 'dj,sonorizacion,animacion', 'verano', 1],
  ['spa-experience-event', 'Evento de spa y bienestar', 'B2B', 'interior-gala', 'musica-ceremonia,sonorizacion,catering', 'todo-el-ano', 3],
  ['evento-playa-hotel', 'Evento en chiringuito o playa de hotel', 'B2B', 'exterior-dia', 'sonorizacion,dj,catering', 'verano', 1],
  ['terrace-session', 'Sesión de terraza con música', 'B2B', 'exterior-dia', 'dj,sonorizacion', 'primavera', 1],
  ['rooftop-party', 'Fiesta en azotea', 'B2B', 'exterior-dia', 'dj,sonorizacion,pantallas-led', 'verano', 1],
  ['evento-gastronomico', 'Evento gastronómico', 'B2B', 'interior-gala', 'catering,sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['festival-gastronomia', 'Festival gastronómico', 'B2B', 'exterior-dia', 'catering,produccion-integral,sonorizacion', 'otono', 2],
  ['apertura-restaurante', 'Apertura de restaurante', 'B2B', 'interior-gala', 'sonorizacion,catering,decoracion', 'todo-el-ano', 1],
  ['aniversario-restaurante', 'Aniversario de restaurante', 'B2B', 'interior-gala', 'musica-ceremonia,sonorizacion,catering', 'todo-el-ano', 2],
  ['noche-tematica-restaurante', 'Noche temática de restaurante', 'B2B', 'interior-gala', 'musica-ceremonia,sonorizacion,decoracion', 'todo-el-ano', 2],
  ['show-cooking', 'Show cooking', 'B2B', 'interior-gala', 'catering,sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['evento-bodega', 'Evento en bodega', 'B2B', 'finca', 'catering,musica-ceremonia,sonorizacion', 'otono', 1],
  ['vendimia', 'Fiesta de la vendimia', 'B2B', 'exterior-dia', 'sonorizacion,catering,animacion', 'otono', 2],
  ['enoturismo-evento', 'Evento de enoturismo', 'B2B', 'finca', 'catering,musica-ceremonia,decoracion', 'otono', 2],
  ['evento-camping', 'Evento en camping', 'B2B', 'exterior-dia', 'sonorizacion,dj,animacion', 'verano', 2],
  ['glamping-evento', 'Evento en alojamiento glamping', 'B2B', 'finca', 'sonorizacion,musica-ceremonia,catering', 'verano', 3],
  ['evento-casa-rural', 'Evento en casa rural', 'B2B', 'finca', 'catering,sonorizacion,musica-ceremonia', 'todo-el-ano', 2],
  ['evento-albergue', 'Evento en albergue o grupo escolar', 'B2B', 'exterior-dia', 'animacion,sonorizacion,dj', 'verano', 3],
  ['evento-balneario', 'Evento en balneario', 'B2B', 'interior-gala', 'musica-ceremonia,sonorizacion,catering', 'todo-el-ano', 3],
  ['evento-chiringuito', 'Temporada de chiringuito', 'B2B', 'exterior-dia', 'dj,sonorizacion,produccion-integral', 'verano', 2],
];

// ── FAMILIA 8 · SOCIAL Y COMUNITARIO (33) ──────────────────────────────
const SOCIAL_ROWS: readonly IntentRow[] = [
  ['gala-benefica', 'Gala benéfica', 'B2C', 'interior-gala', 'produccion-integral,maestros-ceremonia,musica-ceremonia', 'diciembre-enero', 1],
  ['evento-ong', 'Evento de ONG', 'B2C', 'interior-gala', 'sonorizacion,pantallas-led,catering', 'todo-el-ano', 2],
  ['recaudacion-solidaria', 'Acto de recaudación solidaria', 'B2C', 'interior-gala', 'produccion-integral,sonorizacion', 'todo-el-ano', 2],
  ['concierto-benefico', 'Concierto benéfico', 'B2C', 'sala-multitud', 'produccion-integral,sonorizacion,pantallas-led', 'todo-el-ano', 1],
  ['mercadillo-solidario', 'Mercadillo solidario', 'B2C', 'exterior-dia', 'sonorizacion,animacion,decoracion', 'diciembre-enero', 2],
  ['carrera-solidaria', 'Carrera solidaria', 'B2C', 'exterior-dia', 'sonorizacion,animacion,produccion-integral', 'primavera', 2],
  ['evento-asociacion', 'Evento de asociación', 'B2C', 'interior-gala', 'sonorizacion,catering', 'todo-el-ano', 2],
  ['encuentro-vecinal', 'Encuentro vecinal', 'B2C', 'plaza', 'sonorizacion,animacion,catering', 'verano', 1],
  ['fiesta-asociacion-cultural', 'Fiesta de asociación cultural', 'B2C', 'plaza', 'sonorizacion,musica-ceremonia,animacion', 'verano', 2],
  ['evento-cofradia', 'Evento de cofradía', 'B2C', 'institucional', 'sonorizacion,musica-ceremonia', 'primavera', 2],
  ['evento-hermandad', 'Evento de hermandad', 'B2C', 'institucional', 'musica-ceremonia,sonorizacion,catering', 'primavera', 2],
  ['evento-club-deportivo', 'Evento de club deportivo', 'B2C', 'exterior-dia', 'sonorizacion,animacion,pantallas-led', 'todo-el-ano', 2],
  ['gala-club', 'Gala de club', 'B2C', 'interior-gala', 'produccion-integral,maestros-ceremonia,dj', 'invierno', 2],
  ['torneo-solidario', 'Torneo solidario', 'B2C', 'exterior-dia', 'sonorizacion,animacion', 'primavera', 2],
  ['evento-escuela', 'Evento escolar', 'B2C', 'exterior-dia', 'animacion,sonorizacion', 'todo-el-ano', 2],
  ['fiesta-fin-de-curso-colegio', 'Fiesta de fin de curso del colegio', 'B2C', 'exterior-dia', 'dj,animacion,sonorizacion', 'verano', 1],
  ['graduacion-primaria', 'Graduación de primaria', 'B2C', 'interior-gala', 'sonorizacion,fotografia,animacion', 'primavera', 2],
  ['evento-amapa', 'Evento del AMPA', 'B2C', 'exterior-dia', 'animacion,sonorizacion,catering', 'todo-el-ano', 2],
  ['evento-universidad', 'Evento universitario', 'B2C', 'sala-multitud', 'sonorizacion,pantallas-led,produccion-integral', 'todo-el-ano', 2],
  ['acto-academico', 'Acto académico', 'B2C', 'institucional', 'sonorizacion,musica-ceremonia', 'todo-el-ano', 1],
  ['evento-residencia-mayores', 'Evento en residencia de mayores', 'B2C', 'residencia', 'musica-ceremonia,sonorizacion', 'todo-el-ano', 1],
  ['evento-centro-dia', 'Evento en centro de día', 'B2C', 'residencia', 'musica-ceremonia,sonorizacion,animacion', 'todo-el-ano', 1],
  ['evento-discapacidad', 'Evento de entidad de discapacidad', 'B2C', 'residencia', 'musica-ceremonia,sonorizacion,animacion', 'todo-el-ano', 2],
  ['evento-salud-mental', 'Jornada de salud mental', 'B2C', 'institucional', 'sonorizacion,musica-ceremonia', 'todo-el-ano', 2],
  ['evento-integracion', 'Evento de integración social', 'B2C', 'interior-gala', 'animacion,sonorizacion,catering', 'todo-el-ano', 2],
  ['evento-cultura-inclusiva', 'Evento de cultura inclusiva', 'B2C', 'interior-gala', 'musica-ceremonia,sonorizacion,animacion', 'todo-el-ano', 2],
  ['evento-barrio-musica', 'Fiesta de barrio con música', 'B2C', 'plaza', 'sonorizacion,dj,animacion', 'verano', 2],
  ['evento-comunidad-energetica', 'Jornada de comunidad energética', 'B2C', 'institucional', 'sonorizacion,pantallas-led', 'todo-el-ano', 3],
  ['evento-huerto-urbano', 'Jornada de huerto urbano', 'B2C', 'exterior-dia', 'sonorizacion,animacion', 'primavera', 3],
  ['evento-biblioteca', 'Actividad en biblioteca', 'B2C', 'institucional', 'musica-ceremonia,sonorizacion', 'todo-el-ano', 3],
  ['evento-museo', 'Evento en museo', 'B2C', 'institucional', 'musica-ceremonia,sonorizacion,pantallas-led', 'todo-el-ano', 2],
  ['evento-patrimonio', 'Jornada de patrimonio histórico', 'B2C', 'exterior-dia', 'sonorizacion,musica-ceremonia', 'otono', 3],
  ['evento-voluntariado', 'Encuentro de voluntariado', 'B2C', 'interior-gala', 'sonorizacion,catering', 'todo-el-ano', 3],
];

const FAMILY_ROWS: Readonly<Record<EventFamilyId, readonly IntentRow[]>> = {
  corporativo: CORPORATIVO_ROWS,
  empresarial: EMPRESARIAL_ROWS,
  particular: PARTICULAR_ROWS,
  diplomatico: DIPLOMATICO_ROWS,
  'ferias-congresos': FERIAS_ROWS,
  'institucional-b2g': INSTITUCIONAL_ROWS,
  'hosteleria-turismo': HOSTELERIA_ROWS,
  'social-comunitario': SOCIAL_ROWS,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. EXPANSIÓN Y ACCESO AL CATÁLOGO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function expandRows(family: EventFamilyId, rows: readonly IntentRow[]): EventIntent[] {
  return rows.map(([slug, label, audience, context, services, season, demandTier]) => ({
    slug,
    label,
    family,
    audience,
    context,
    services: services
      .split(',')
      .map((service) => service.trim())
      .filter((service): service is string => service.length > 0),
    season,
    demandTier,
  }));
}

/** Catálogo completo. Orden determinista: por familia declarada y orden de fila. */
export const EVENT_INTENTS: readonly EventIntent[] = EVENT_FAMILY_IDS.flatMap((family) =>
  expandRows(family, FAMILY_ROWS[family])
);

export const EVENT_INTENT_COUNT: number = EVENT_INTENTS.length;

/** Servicios canónicos válidos para una intención (fuente: CANONICAL_SERVICES). */
export const CANONICAL_EVENT_SERVICE_SLUGS: ReadonlySet<string> = new Set(
  CANONICAL_SERVICES.map((service) => service.slug)
);

const INTENT_BY_SLUG: ReadonlyMap<string, EventIntent> = new Map(
  EVENT_INTENTS.map((intent) => [intent.slug, intent] as const)
);

export function isKnownEventService(slug: string): boolean {
  return CANONICAL_EVENT_SERVICE_SLUGS.has(slug);
}

export function getEventIntent(slug: string): EventIntent | null {
  return INTENT_BY_SLUG.get(slug) ?? null;
}

export function isEventIntentSlug(slug: string): boolean {
  return INTENT_BY_SLUG.has(slug);
}

export function getIntentsByFamily(family: EventFamilyId): readonly EventIntent[] {
  return EVENT_INTENTS.filter((intent) => intent.family === family);
}

export function getIntentsByDemandTier(tier: DemandTier): readonly EventIntent[] {
  return EVENT_INTENTS.filter((intent) => intent.demandTier === tier);
}

/** Ruta canónica de una intención (sin host). */
export function buildEventIntentPath(family: EventFamilyId, slug: string): string {
  return `/eventos/${family}/${slug}`;
}

/** Ruta canónica de una intención en una provincia (sin host). */
export function buildEventIntentProvincePath(
  family: EventFamilyId,
  slug: string,
  provinceSlug: string
): string {
  return `/eventos/${family}/${slug}/${provinceSlug}`;
}

/** Ruta canónica de la ficha municipal (sin host). */
export function buildEventMunicipalityPath(provinceSlug: string, municipalitySlug: string): string {
  return `/eventos/local/${provinceSlug}/${municipalitySlug}`;
}

/**
 * Frases de búsqueda de alta demanda para una intención. Se construyen desde la
 * etiqueta y el lugar; no hay keywords inventadas ni marcadas de terceros (JUR-4).
 */
export function getIntentSearchPhrases(intent: EventIntent, placeLabel?: string): string[] {
  const base = intent.label.toLowerCase();
  const phrases = [base, `${base} precio`, `${base} contratacion`, `${base} profesional`];
  if (placeLabel) {
    phrases.push(`${base} en ${placeLabel.toLowerCase()}`);
    phrases.push(`${base} ${placeLabel.toLowerCase()} precio`);
  }
  return phrases;
}

/** Distribución por familia, para auditoría y para el hub /eventos. */
export function getEventFamilyBreakdown(): ReadonlyArray<{
  family: EventFamilyId;
  label: string;
  intents: number;
  tier1: number;
}> {
  return EVENT_FAMILIES.map((family) => {
    const intents = getIntentsByFamily(family.id);
    return {
      family: family.id,
      label: family.label,
      intents: intents.length,
      tier1: intents.filter((intent) => intent.demandTier === 1).length,
    };
  });
}

