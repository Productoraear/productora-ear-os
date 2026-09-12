// src/lib/seo/arsenalPoblacionesEngine.ts
//
// 🏛️ MOTOR pSEO DE ALQUILER DE ARSENAL POR POBLACIONES (S-CLASS 2026)
// Cobertura completa de poblaciones de España bajo /alquiler/[poblacion]
// Permutación de 5 estructuras DOM y unicidad léxica > 90% (< 10% de solapamiento)

import { MUNICIPALITIES_DATABASE, Municipality } from '../geo/spanish-municipalities';
import { PROVINCE_COORDINATES } from '@/features/search/utils/mentridaDistanceEngine';

export type PopulationArchetype = 
  | 'metropoli'
  | 'corona_metropolitana'
  | 'zona_cero_toledo'
  | 'historica_destino'
  | 'fiestas_patronales_b2g';

export type LayoutBlockId = 
  | 'hero' 
  | 'acoustic' 
  | 'hardware' 
  | 'logistics' 
  | 'valueStack' 
  | 'faqs';

export interface LocalizedArsenalItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  recommendedFor: string;
  priceDisplay: string;
  priceNumeric: number;
  specs: string[];
  badge: string;
  imageUrl: string;
}

export interface LocalizedFAQ {
  question: string;
  answer: string;
  category: string;
}

export interface ArsenalPoblacionProfile {
  slug: string;
  poblacionName: string;
  provinceName: string;
  autonomousCommunity: string;
  archetype: PopulationArchetype;
  layoutOrder: LayoutBlockId[];
  distanceKm: number;
  transitMinutes: number;
  mainAccessHighway: string;
  recommendedVehicle: string;
  maxDbLimit: number;
  isZonaCeroMentrida: boolean;
  h1: string;
  h2Subtitle: string;
  heroBadge: string;
  leadParagraph: string;
  secondaryParagraph: string;
  tertiaryParagraph: string;
  technicalPackName: string;
  technicalPackSummary: string;
  items: LocalizedArsenalItem[];
  faqs: LocalizedFAQ[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERMUTACIÓN DE LAYOUT (5 VARIANTES DOM)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const LAYOUT_VARIANTS: LayoutBlockId[][] = [
  ['hero', 'hardware', 'acoustic', 'logistics', 'valueStack', 'faqs'],
  ['hero', 'acoustic', 'hardware', 'logistics', 'valueStack', 'faqs'],
  ['hero', 'logistics', 'hardware', 'valueStack', 'acoustic', 'faqs'],
  ['hero', 'valueStack', 'hardware', 'acoustic', 'logistics', 'faqs'],
  ['hero', 'hardware', 'logistics', 'acoustic', 'valueStack', 'faqs']
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIONES DE HASH FNV-1a DETERMINISTA Y DECORRELACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash);
}

export function getHash(slug: string, salt: number): number {
  let h = 0x811c9dc5;
  const str = `${slug}__salt_${salt * 997 + 31}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}

export function pick<T>(slug: string, salt: number, list: T[]): T {
  const h = getHash(slug, salt);
  return list[h % list.length];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLASIFICACIÓN DE ARQUETIPO TERRITORIAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function resolveArchetype(municipality: Municipality): PopulationArchetype {
  const s = municipality.slug.toLowerCase();
  const prov = municipality.province.toLowerCase();

  // 1. Zona Cero Méntrida & Cercanías Toledo
  if (['mentrida', 'illescas', 'toledo', 'torrijos', 'fuensalida', 'talavera-de-la-reina', 'valmojado', 'camarena', 'navalcarnero', 'aranjuez'].includes(s)) {
    return 'zona_cero_toledo';
  }

  // 2. Metrópolis
  if ((municipality.tier === 1 && (municipality.population || 0) > 180000) || ['madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'bilbao', 'valladolid', 'palma'].includes(s)) {
    return 'metropoli';
  }

  // 3. Villas Históricas & Destino
  if (['el-escorial', 'chinchon', 'pedraza', 'segovia', 'siguenza', 'cuenca', 'avila', 'caceres', 'santillana-del-mar', 'albarracin', 'ronda', 'ibiza', 'san-lorenzo-de-el-escorial'].includes(s) || (municipality.hasFincas && municipality.tier === 3)) {
    return 'historica_destino';
  }

  // 4. Corona Metropolitana
  if (prov === 'madrid' || ['alcorcon', 'mostoles', 'getafe', 'leganes', 'fuenlabrada', 'alcala-de-henares', 'torrejon-de-ardoz', 'las-rozas', 'pozuelo-de-alarcon', 'majadahonda', 'alcobendas', 'san-sebastian-de-los-reyes', 'parla', 'pinto', 'valdemoro', 'coslada', 'rivas-vaciamadrid', 'tres-cantos', 'boadilla-del-monte', 'arganda-del-rey'].includes(s)) {
    return 'corona_metropolitana';
  }

  // 5. Municipios Fiestas Patronales / B2G
  return 'fiestas_patronales_b2g';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CÁLCULO LOGÍSTICO Y VIAL DESDE HUBS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function resolveHighwayAndTransit(slug: string, province: string, distanceKm: number) {
  const pLow = province.toLowerCase();
  const sLow = slug.toLowerCase();

  let highway = 'Autovía A-42 / A-5';
  if (sLow.includes('alcorcon') || sLow.includes('mostoles') || sLow.includes('navalcarnero') || sLow.includes('badajoz') || pLow.includes('toledo') || pLow.includes('caceres')) {
    highway = 'Autovía del Suroeste A-5 (E-90)';
  } else if (sLow.includes('getafe') || sLow.includes('leganes') || sLow.includes('parla') || sLow.includes('illescas')) {
    highway = 'Autovía de Toledo A-42';
  } else if (sLow.includes('rozas') || sLow.includes('majadahonda') || sLow.includes('pozuelo') || sLow.includes('escorial') || pLow.includes('avila') || pLow.includes('segovia')) {
    highway = 'Autovía del Noroeste A-6 y M-50';
  } else if (sLow.includes('alcala') || sLow.includes('torrejon') || sLow.includes('guadalajara') || pLow.includes('zaragoza')) {
    highway = 'Autovía del Nordeste A-2';
  } else if (sLow.includes('aranjuez') || sLow.includes('pinto') || sLow.includes('valdemoro') || pLow.includes('ciudad real') || pLow.includes('cordoba') || pLow.includes('sevilla')) {
    highway = 'Autovía de Andalucía A-4';
  } else if (pLow.includes('valencia') || pLow.includes('albacete') || pLow.includes('cuenca') || pLow.includes('alicante')) {
    highway = 'Autovía del Este A-3';
  } else if (pLow.includes('barcelona') || pLow.includes('girona') || pLow.includes('tarragona')) {
    highway = 'Corredor AP-7 / A-2 Express';
  } else if (pLow.includes('vizcaya') || pLow.includes('guipuzcoa') || pLow.includes('alava') || pLow.includes('navarra')) {
    highway = 'Eje Cantábrico A-1 / AP-68';
  }

  const speedKmh = distanceKm <= 60 ? 75 : 90;
  const transitMinutes = Math.max(20, Math.round((distanceKm / speedKmh) * 60));

  let recommendedVehicle = 'Mercedes-Benz Sprinter L2H2 Taller Móvil';
  if (distanceKm <= 40) {
    recommendedVehicle = 'Furgón Isotermo Ligero de Intervención Rápida';
  } else if (distanceKm > 250) {
    recommendedVehicle = 'Camión Rígido Carrozado 7.5T con Plataforma Elevadora Dhollandia';
  } else if (distanceKm > 90) {
    recommendedVehicle = 'Iveco Daily 35S18 Extra Larga de Transporte Técnico';
  }

  return { highway, transitMinutes, recommendedVehicle };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERADOR COMBINATORIO DE NARRATIVAS (SLOT-BASED SYNTHESIS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function buildUniqueNarratives(
  townName: string,
  provinceName: string,
  archetype: PopulationArchetype,
  distanceKm: number,
  highway: string,
  vehicle: string,
  maxDbLimit: number,
  slug: string,
  watts: number,
  pax: number,
  transitMinutes: number
) {
  const town = townName;
  const prov = provinceName;
  const km = distanceKm;
  const min = transitMinutes;
  const db = maxDbLimit;

  // H1 (25 variantes)
  const h1Pool = [
    `Alquiler de sonido profesional y pantallas led en ${town} (${prov})`,
    `Sonorizacion de alta definicion e iluminacion para eventos en ${town}`,
    `Infraestructura tecnica audiovisual y altavoces bose en ${town} (${prov})`,
    `Arsenal audiovisual homologado con escenarios y sonido directo en ${town}`,
    `Equipamiento sonoro de gama alta y pantallas gigantes en ${town}`,
    `Suministro tecnico de audio, video e iluminacion perimetral en ${town}`,
    `Montaje audiovisual integral con microfonia blindada y luces en ${town}`,
    `Alquiler de material audiovisual para bodas y galas en ${town} (${prov})`,
    `Dotacion electroacustica calibrada y pantallas de alta luminosidad en ${town}`,
    `Servicio tecnico de audio profesional y estructuras escenicas en ${town}`,
    `Alquiler de columnas acusticas y pantallas de video modular en ${town}`,
    `Instalacion de sonido directo y tecnologia audiovisual avanzada en ${town}`,
    `Productora audiovisual en ${town}: sonido, pantallas e iluminacion`,
    `Alquiler de equipos tecnicos para celebraciones y congresos en ${town}`,
    `Sistemas audiovisuales de precision y sonido calibrado en ${town}`,
    `Despliegue de sonorizacion para bodas y festejos en ${town} (${prov})`,
    `Equipos de sonido para directos y pantallas led en ${town}`,
    `Alquiler audiovisual de vanguardia y microfonia inalambrica en ${town}`,
    `Sonorizacion integral con limitacion de decibelios en ${town} (${prov})`,
    `Arsenal tecnico para eventos corporativos y sociales en ${town}`,
    `Alquiler de altavoces line array y focos robotizados en ${town}`,
    `Produccion tecnica de eventos y alquiler de pantallas en ${town} (${prov})`,
    `Suministro de audio directo e iluminacion arquitectonica en ${town}`,
    `Equipamiento electroacustico certificado para recintos de ${town}`,
    `Alquiler de tarimas escenicas y sonido profesional en ${town} (${prov})`
  ];
  const h1 = pick(slug, 1, h1Pool);

  // H2 (25 variantes)
  const h2Pool = [
    `Presión sonora certificada a 12 W por persona (${watts} W RMS), limitador a ${db} dB y transporte por ${highway} en ${town}.`,
    `Equipos homologados con microfonía blindada, reserva de 100 € en Stripe y logística en ${km} km hacia ${town} (${prov}).`,
    `Despliegue audiovisual directo desde base central hacia ${town} con técnico especialista in situ en ${prov}.`,
    `Garantía de redundancia N+1 en procesado digital para cero fallos en los eventos de ${town} (${prov}).`,
    `Pantallas LED de 3.840 Hz y cajas acústicas de directividad controlada para celebraciones en ${town}.`,
    `Alquiler profesional llave en mano con transporte en ${vehicle}, montaje y ajuste RTA en ${town}.`,
    `Material audiovisual propio de Productora EAR con asistencia técnica continua a lo largo de la ${highway} en ${town}.`,
    `Configuración técnica personalizada para fincas y salones de ${town}, respetando el límite de ${db} dB en ${prov}.`,
    `Dotación técnica integral de ${watts} W con soporte en carretera por la ${highway} hacia ${town}.`,
    `Sonorización calibrada in situ en ${town} con atenuación nocturna homologada para ${pax} comensales en ${prov}.`,
    `Muro de pantallas LED Novastar y columnas biamplificadas preparadas para el evento en ${town}.`,
    `Cobertura electroacústica homogénea para ${pax} asistentes con transporte directo a ${town} por la ${highway}.`,
    `Servicio técnico llave en mano con vehículo ${vehicle} arribando con 2 horas de margen a ${town}.`,
    `Infraestructura de alta fidelidad con microfonía Shure y cableado blindado en recintos de ${town} (${prov}).`,
    `Protección acústica estricta a ${db} dB y pantallas de 5.500 nits para citas exclusivas en ${town}.`,
    `Suministro de audio y video profesional con contrato garantizado mediante señal de 100 € en ${town}.`,
    `Instalación de sonido para directos y discursos con operador de cabina durante toda la velada en ${town}.`,
    `Respaldo logístico propio recorriendo ${km} km por la ${highway} hasta el recinto de ${town} en ${min} min.`,
    `Acústica orientable que entrega ${watts} vatios de fidelidad tímbrica para los ${pax} invitados en ${town}.`,
    `Equipamiento técnico para bodas y galas en ${town} con limitación de decibelios certificada en ${prov}.`,
    `Despacho directo de altavoces Bose y trusses certificados para montaje seguro en ${town}.`,
    `Operativa audiovisual de vanguardia con control digital de mezclas y soporte presencial en ${town}.`,
    `Producción técnica integral con seguro de carga y transporte por la ${highway} hacia ${town} (${prov}).`,
    `Tecnología escénica de élite con pantallas modulares y sonido envolvente para celebraciones en ${town}.`,
    `Calidad sonora garantizada con procesadores DSP y fianza asegurada en Stripe para tu fecha en ${town}.`
  ];
  const h2Subtitle = pick(slug, 202, h2Pool);

  const heroBadgePool = [
    `STOCK TÉCNICO EN ${town.toUpperCase()} • 12 W/PAX`,
    `LOGÍSTICA OFICIAL • ${km} KM A ${town.toUpperCase()} POR ${highway.toUpperCase()}`,
    `ARSENAL HOMOLOGADO EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `POTENCIA ACÚSTICA CALIBRADA • MÁX ${db} DB EN ${town.toUpperCase()}`,
    `COBERTURA TÉCNICA OFICIAL EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `DESPLIEGUE DIRECTO A ${town.toUpperCase()} • SONIDO PROFESIONAL`,
    `INFRAESTRUCTURA AUDIOVISUAL EN ${town.toUpperCase()} • S-CLASS`,
    `SONORIZACIÓN CERTIFICADA EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `DOTACIÓN TÉCNICA GARANTIZADA EN ${town.toUpperCase()}`,
    `PANTALLAS LED Y AUDIO EN ${town.toUpperCase()} • ENLACE ${highway.toUpperCase()}`,
    `SISTEMA ELECTROACÚSTICO HOMOLOGADO EN ${town.toUpperCase()}`,
    `ALQUILER TÉCNICO PARA EVENTOS EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `PARQUE AUDIOVISUAL ASIGNADO A ${town.toUpperCase()}`,
    `ASISTENCIA TÉCNICA IN SITU EN ${town.toUpperCase()}`,
    `DISPONIBILIDAD CONFIRMADA EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `SUMINISTRO AUDIOVISUAL DIRECTO A ${town.toUpperCase()}`,
    `CONVOY TÉCNICO EN RUTA A ${town.toUpperCase()} • ${min} MIN`,
    `EQUIPAMIENTO DE DIRECTO EN ${town.toUpperCase()} (${prov.toUpperCase()})`,
    `PRESIÓN SONORA CONTROLADA EN ${town.toUpperCase()} • ${watts} W`,
    `RESERVA OFICIAL DE ARSENAL EN ${town.toUpperCase()}`,
    `MATERIAL PROPIO DE PRODUCTORA EAR EN ${town.toUpperCase()}`,
    `LOGÍSTICA RÁPIDA A ${town.toUpperCase()} • VÍA ${highway.toUpperCase()}`,
    `SOLUCIÓN AUDIOVISUAL INTEGRAL EN ${town.toUpperCase()}`,
    `CONFIGURACIÓN TÉCNICA DE ALTA GAMA EN ${town.toUpperCase()}`,
    `DESPACHO AUDIOPROFESIONAL PARA ${town.toUpperCase()} (${prov.toUpperCase()})`
  ];
  const heroBadge = pick(slug, 203, heroBadgePool);

  // Lead 1 (25 variantes)
  const lead1Pool = [
    `En ${town}, el alquiler de sonido profesional traslada a ${town} una potencia acustica calibrada a ${watts} W RMS para ${pax} comensales en ${prov}.`,
    `Para los eventos celebrados en ${town}, nuestro equipo despliega en ${town} una dotacion de ${watts} vatios que cubre a ${pax} asistentes en ${prov}.`,
    `Garantizamos en ${town} un suministro directo, abasteciendo los espacios de ${town} con ${watts} W de presion lineal para ${pax} personas en ${prov}.`,
    `La sonorizacion en ${town} se ejecuta con sistemas orientables en ${town} que entregan ${watts} vatios para ${pax} invitados en ${prov}.`,
    `Dotamos a las fincas y salones de ${town} con un parque sonoro en ${town} que proporciona ${watts} W continuos para ${pax} comensales en ${prov}.`,
    `Abordamos el montaje tecnico en ${town} instalando cajas calculadas en ${town} para proyectar ${watts} W RMS sobre ${pax} asistentes en ${prov}.`,
    `El compromiso audiovisual en ${town} aporta una cobertura en ${town} de ${watts} vatios para el aforo de ${pax} personas en ${prov}.`,
    `Organizar un directo en ${town} cuenta con el respaldo en ${town} de ${watts} W de sonido equilibrado para ${pax} asistentes en ${prov}.`,
    `Los actos sociales en ${town} disfrutan de un rendimiento en ${town} de ${watts} vatios envolviendo a ${pax} participantes en ${prov}.`,
    `Suministramos a los recintos de ${town} una infraestructura sónica en ${town} de ${watts} W dimensionada para ${pax} invitados en ${prov}.`,
    `La acústica en ${town} queda resuelta en ${town} con columnas colineales que distribuyen ${watts} vatios entre ${pax} personas en ${prov}.`,
    `Proporcionamos en ${town} una experiencia sonora en ${town} con ${watts} W ajustados para ${pax} oyentes en ${prov}.`,
    `El público de ${town} percibe en ${town} cada nota musical con ${watts} vatios calculados para ${pax} personas en ${prov}.`,
    `Fijamos el estándar acústico en ${town} entregando en ${town} ${watts} W de potencia limpia para ${pax} comensales en ${prov}.`,
    `Cada rincón de ${town} recibe en ${town} un campo sonoro alimentado por ${watts} vatios para ${pax} personas en ${prov}.`,
    `Desplegamos en ${town} una arquitectura de audio en ${town} que suministra ${watts} W para los ${pax} invitados en ${prov}.`,
    `La dispersión sónica en ${town} se calibra en ${town} con analizador para que ${watts} vatios rindan ante ${pax} personas en ${prov}.`,
    `Equipamos cualquier recinto de ${town} con amplificación en ${town} de ${watts} W ideada para ${pax} asistentes en ${prov}.`,
    `La celebración en ${town} adquiere empaque acústico en ${town} con ${watts} vatios balanceados para ${pax} comensales en ${prov}.`,
    `Atendemos los requerimientos de ${town} aportando en ${town} una dotación de ${watts} W para ${pax} personas en ${prov}.`,
    `Nuestra propuesta sonora en ${town} asegura en ${town} discursos impecables con ${watts} vatios para ${pax} asistentes en ${prov}.`,
    `La cobertura electroacústica en ${town} alcanza en ${town} a toda la audiencia con ${watts} W para ${pax} oyentes en ${prov}.`,
    `Diseñamos para ${town} una configuración en ${town} de satélites con ${watts} vatios nítidos ante ${pax} personas en ${prov}.`,
    `La fidelidad de palabra en ${town} se proyecta en ${town} sin ecos con ${watts} W orientados para ${pax} participantes en ${prov}.`,
    `El espacio de celebración en ${town} se transforma en ${town} con sonido envolvente de ${watts} vatios para ${pax} comensales en ${prov}.`
  ];

  // Lead 2 (25 variantes)
  const lead2Pool = [
    `Las pantallas led instaladas en ${town} operan en ${town} con procesadores Novastar a 3.840 Hz luciendo con nitidez en ${prov}.`,
    `Integramos muros de vídeo en ${town} con píxel pitch fino en ${town} para proyecciones corporativas y nupciales en ${prov}.`,
    `La visualización gráfica en ${town} se apoya en paneles en ${town} de 5.500 nits visibles bajo sol directo en ${prov}.`,
    `Desplegamos lienzos digitales en ${town} que reproducen en ${town} contenidos en 4K nativo para los espectadores de ${prov}.`,
    `El soporte visual en ${town} incluye pantallas en ${town} de emisión continua libres de parpadeos en ${prov}.`,
    `Equipamos el escenario en ${town} con fondos de vídeo en ${town} de aleación ligera para conferencias en ${prov}.`,
    `Los asistentes de ${town} visualizan en ${town} cada detalle en módulos led de 16 bits en ${prov}.`,
    `Montamos estructuras de vídeo en ${town} con calibración cromática en ${town} por panel para eventos de ${prov}.`,
    `La tecnología de imagen en ${town} garantiza en ${town} un ángulo de 160 grados para el auditorio en ${prov}.`,
    `Aportamos pantallas gigantes en ${town} con conectividad HDMI y SDI en ${town} para galas en ${prov}.`,
    `El contenido visual en ${town} se proyecta en ${town} en paneles de bajo consumo térmico en ${prov}.`,
    `Los monitores en ${town} entregan en ${town} una colorimetría fiel para actos de alto standing en ${prov}.`,
    `La emisión de vídeo en ${town} se sincroniza en ${town} con escaladores UHD sin retardo visual en ${prov}.`,
    `Configuramos pantallas para exterior en ${town} con chasis estanco IP65 en ${town} resistente a lluvia en ${prov}.`,
    `El fondo de escenario en ${town} deslumbra en ${town} por su contraste de negros profundos en ${prov}.`,
    `Las presentaciones en ${town} ganan impacto en ${town} mediante pantallas de paso fino P2.9 en ${prov}.`,
    `El sistema de vídeo en ${town} procesa en ${town} gráficos complejos mediante tarjetas Novastar en ${prov}.`,
    `Instalamos muros de leds curvables en ${town} envolviendo en ${town} la presidencia con brillo regulable en ${prov}.`,
    `La claridad visual en ${town} está asegurada en ${town} por procesamiento HDR de 10 bits en ${prov}.`,
    `Los vídeos proyectados en ${town} se contemplan en ${town} con colores vibrantes sobre paneles modulares en ${prov}.`,
    `Para eventos diurnos en ${town}, los paneles de exterior en ${town} vencen reflejos solares con 5.000 nits en ${prov}.`,
    `La infraestructura visual de ${town} cuenta en ${town} con cuadros balanceados evitando caídas de señal en ${prov}.`,
    `Ofrecemos en ${town} pantallas led portátiles en ${town} sobre peana pesada que cuidan pavimentos en ${prov}.`,
    `La retransmisión en directo en ${town} se emite en ${town} sobre paneles sincronizados por fibra en ${prov}.`,
    `Los asistentes a la gala de ${town} disfrutan en ${town} de escenografía digital interactiva con transiciones en ${prov}.`
  ];

  // Lead 3 (25 variantes)
  const lead3Pool = [
    `El control del volumen en ${town} se supervisa en ${town} con limitadores homologados a ${db} dB cumpliendo normativa de ${prov}.`,
    `Ajustamos la presión acústica en ${town} fijando en ${town} un umbral máximo de ${db} decibelios medido en linde de ${prov}.`,
    `Protegemos la convivencia en ${town} aplicando en ${town} filtros DSP que contienen graves en ${db} dB en ${prov}.`,
    `La limitación sonora en ${town} se regula en ${town} electrónicamente a ${db} dB para evitar incidencias en ${prov}.`,
    `Calibramos decibelios en ${town} bajo el techo legal en ${town} de ${db} dB fijado por ordenanzas de ${prov}.`,
    `Garantizamos un sonido respetuoso en ${town} que no supera en ${town} los ${db} dB en fachada exterior en ${prov}.`,
    `El procesador de audio en ${town} mantiene en ${town} la dinámica musical en la cota de ${db} dB en ${prov}.`,
    `Verificamos con analizador en ${town} que la emisión sonora en ${town} se mantenga estable en ${db} dB en ${prov}.`,
    `La respuesta tonal en ${town} queda optimizada en ${town} respetando la franja nocturna de ${db} dB en ${prov}.`,
    `El operador técnico en ${town} monitoriza en ${town} sonómetros oficiales preservando el descanso a ${db} dB en ${prov}.`,
    `La emisión de decibelios en ${town} se frena en ${town} automáticamente al alcanzar ${db} dB en ${prov}.`,
    `Atenuamos frecuencias en ${town} asegurando en ${town} que el sonómetro marque menos de ${db} dB en ${prov}.`,
    `Configuramos la compresión en ${town} logrando en ${town} pegada musical sin quebrar los ${db} dB en ${prov}.`,
    `La tranquilidad en ${town} se apoya en un control calibrado en ${town} a ${db} dB con registro en ${prov}.`,
    `El sistema de audio en ${town} opera en ${town} bajo certificación que no excede ${db} dB en ${prov}.`,
    `Aseguramos que el evento en ${town} suene con contundencia en ${town} bajo el umbral de ${db} dB en ${prov}.`,
    `El sonómetro en ${town} certifica en ${town} que el volumen permanece acotado a ${db} dB en ${prov}.`,
    `La calibración electroacústica en ${town} previene sanciones en ${town} conteniendo el nivel en ${db} dB en ${prov}.`,
    `Los subwoofers en ${town} operan en modo cardioide en ${town} evitando proyectar más de ${db} dB atrás en ${prov}.`,
    `Controlamos el aislamiento en ${town} con atenuadores en ${town} asegurando un techo de ${db} dB en ${prov}.`,
    `El protocolo sonoro en ${town} vela en ${town} por los ${db} dB legales sin restar pegada al bombo en ${prov}.`,
    `Las mediciones en ${town} arrojan lecturas confortables en ${town} inferiores a ${db} dB durante la velada en ${prov}.`,
    `Mantenemos la presión en ${town} con un corte en ${town} que respeta el umbral de ${db} dB en ${prov}.`,
    `La celebración en ${town} discurre con serenidad en ${town} gracias a limitación a ${db} dB en mesa en ${prov}.`,
    `El técnico de sonido en ${town} cuida en ${town} que la música suene con cuerpo sin rebasar ${db} dB en ${prov}.`
  ];
  const leadParagraph = `${pick(slug, 2, lead1Pool)} ${pick(slug, 3, lead2Pool)} ${pick(slug, 4, lead3Pool)}`;

  // Secondary 1 (25 variantes)
  const sec1Pool = [
    `El transporte hacia ${town} parte desde Méntrida recorriendo ${km} km por la ${highway} a bordo de un ${vehicle} asignado a ${town}.`,
    `Despachamos el convoy hacia ${town} a través de la ${highway} completando ${km} km en ${min} minutos de ruta directa a ${town}.`,
    `La dotación viaja asegurada hacia ${town} por la ${highway} en nuestro ${vehicle} arribando con dos horas de margen a ${town}.`,
    `Cubrimos el trayecto directo hasta ${town} en ${min} minutos por la ${highway} con furgón técnico acondicionado para ${town}.`,
    `La operativa de flete enlaza con ${town} a lo largo de ${km} km por la ${highway} garantizando puntualidad en la descarga en ${town}.`,
    `El equipo de transporte llega a ${town} tras circular por la ${highway} posicionando el ${vehicle} en el recinto de ${town}.`,
    `Gestionamos el traslado a ${town} recorriendo ${km} km por la vía ${highway} optimizando la llegada a los recintos de ${town}.`,
    `Nuestra flota accede a ${town} por la autovía ${highway} en unos ${min} minutos iniciando la descarga técnica en ${town}.`,
    `El itinerario hacia ${town} transcurre por la ${highway} con seguimiento GPS durante los ${km} km de viaje hacia ${town}.`,
    `Coordinamos la llegada escalonada a ${town} en ${min} minutos por la ${highway} para acceder limpiamente al espacio de ${town}.`,
    `El furgón técnico arriba a ${town} tras recorrer ${km} km por la ${highway} con el inventario completo para ${town}.`,
    `Planificamos la salida hacia ${town} con margen holgado para cubrir ${km} km por la ${highway} en ${min} minutos hasta ${town}.`,
    `Los equipos viajan a ${town} en flight-cases acolchados tras ${min} minutos de ruta por la ${highway} hacia ${town}.`,
    `Garantizamos una entrega puntual en ${town} circulando por la ${highway} durante ${km} km con conductor hacia ${town}.`,
    `El despliegue en carretera hacia ${town} cubre ${km} km por la ${highway} sin desvíos para montar en ${town}.`,
    `El vehículo de carga se desplaza a ${town} por la ${highway} completando el trayecto de ${km} km en ${min} minutos hacia ${town}.`,
    `Supervisamos el tránsito a ${town} vía satélite asegurando que los ${km} km por la ${highway} se cumplan hacia ${town}.`,
    `La llegada a ${town} se programa con antelación suficiente tras circular ${km} km por la autovía ${highway} a ${town}.`,
    `Nuestro chófer transporta el material a ${town} en ${min} minutos por la ${highway} respetando las normas viales hacia ${town}.`,
    `El convoy audiovisual accede al término de ${town} por la ${highway} recorriendo ${km} km de forma directa hacia ${town}.`,
    `Iniciamos la jornada técnica viajando a ${town} por la ${highway} para descargar en el recinto tras ${min} minutos hacia ${town}.`,
    `La logística propia hacia ${town} garantiza que los ${km} km por la ${highway} se recorran en un ${vehicle} para ${town}.`,
    `Los altavoces y pantallas llegan a ${town} tras ${km} km por la ${highway} con seguro a todo riesgo hacia ${town}.`,
    `El flete hasta ${town} se realiza con vehículo taller equipado para solventar necesidades tras ${min} minutos de ruta a ${town}.`,
    `Aseguramos la presencia del material en ${town} mediante itinerario directo por la ${highway} en ${min} minutos a ${town}.`
  ];

  // Secondary 2 (25 variantes)
  const sec2Pool = [
    `El tendido de cables en ${town} se efectúa en ${town} con mangueras libres de oxígeno protegidas por pasacables para ${pax} comensales.`,
    `Conectamos la instalación en ${town} mediante cuadros de acometida en ${town} con magnetotérmicos individuales para ${watts} W.`,
    `Canalizamos la energía en ${town} con distribuidores homologados en ${town} que previenen sobrecargas en la red general de ${prov}.`,
    `Protegemos la alimentación en ${town} utilizando diferenciales en ${town} de 30 mA y corrección activa de factor de potencia.`,
    `Estructuramos las líneas de señal en ${town} con cableado apantallado en ${town} que elimina zumbidos de masa en ${prov}.`,
    `El conexionado eléctrico en ${town} se adapta en ${town} tanto a tomas industriales CETAC como a monofásicos Schuko de 230V.`,
    `Garantizamos la seguridad en ${town} fijando torres elevadoras en ${town} con eslingas de acero certificadas para carga pesada.`,
    `El montaje en ${town} utiliza peanas lastradas en ${town} y anclajes certificados que soportan ráfagas de viento en ${prov}.`,
    `Desplegamos pasacables de seguridad en ${town} manteniendo en ${town} las zonas de paso libres de tropiezos para ${pax} invitados.`,
    `Revisamos los voltajes de acometida en ${town} antes del encendido en ${town} para asegurar suministro estable para ${watts} W.`,
    `La distribución de potencia en ${town} se equilibra en tres fases en ${town} para no sobrecargar líneas del recinto de ${prov}.`,
    `Protegemos los equipos en ${town} mediante estabilizadores en ${town} que neutralizan microcortes en la red de ${prov}.`,
    `El cableado de audio en ${town} se tiende en ${town} por zonas técnicas ocultas preservando la estética decorativa de ${prov}.`,
    `Instalamos regletas con interruptor diferencial en ${town} para un corte de emergencia inmediato si fuera preciso en ${town}.`,
    `Las mangueras multipar en ${town} conectan el escenario de ${town} con la mesa de control sin pérdidas de señal en ${prov}.`,
    `Fijamos los proyectores de luz en ${town} con doble garra y cable de acero en ${town} cumpliendo normativas vigentes en ${prov}.`,
    `La acometida temporal en ${town} se verifica con multímetro en ${town} confirmando tierra física antes de alimentar ${watts} W.`,
    `Canalizamos las tiradas digitales en ${town} con cables EtherCON blindados en ${town} para control de audio en ${prov}.`,
    `El despliegue de corriente en ${town} separa las líneas en ${town} evitando chasquidos en altavoces durante el evento de ${prov}.`,
    `Aseguramos la integridad del tendido en ${town} usando fundas ignífugas en ${town} y pasamuros homologados para ${pax} personas.`,
    `Los cuadros CETAC en ${town} disponen de amperímetro en ${town} para controlar consumos en tiempo real para ${watts} W.`,
    `El tendido exterior en ${town} se realiza con conexiones estancas IP67 en ${town} impidiendo entrada de humedad en ${prov}.`,
    `Instalamos pasacables modulares en ${town} capaces de soportar tráfico rodado en ${town} sin dañar líneas técnicas en ${prov}.`,
    `La conexión a tierra en ${town} se mide meticulosamente en ${town} asegurando relación señal-ruido óptima para ${watts} W.`,
    `Revisamos magnetotérmicos del espacio en ${town} coordinando en ${town} el reparto de cargas con mantenimiento de ${prov}.`
  ];

  // Secondary 3 (25 variantes)
  const sec3Pool = [
    `El ingeniero realiza en ${town} la alineación de fase en ${town} entre subgraves y agudos mediante analizador RTA para ${watts} W.`,
    `Comprobamos la respuesta de sala en ${town} mediante barrido en ${town} para corregir cancelaciones acústicas ante ${pax} personas.`,
    `El protocolo técnico en ${town} concluye en ${town} con test de microfonía inalámbrica certificando cero cortes de RF en ${prov}.`,
    `Ajustamos la ecualización paramétrica en ${town} adaptando en ${town} el tiro de sonido a la morfología de pista para ${watts} W.`,
    `Verificamos la cobertura acústica en ${town} caminando en ${town} por el perímetro del recinto para ${pax} comensales en ${prov}.`,
    `Sincronizamos audio e iluminación en ${town} mediante mesa digital en ${town} para transiciones elegantes ante ${pax} personas.`,
    `El especialista técnico valida en ${town} la latencia cero en ${town} en los retornos de escenario para directos en ${prov}.`,
    `Efectuamos pruebas de enlace de vídeo en ${town} asegurando en ${town} reproducción nítida de contenidos en pantallas de ${prov}.`,
    `El equipo de Productora EAR supervisa en ${town} la señal DMX en ${town} con máxima velocidad en focos para ${pax} personas.`,
    `Finalizamos la calibración en ${town} dejando niveles balanceados en ${town} para evitar saturaciones durante la fiesta en ${prov}.`,
    `Alineamos el retardo milimétrico en ${town} en columnas secundarias en ${town} para sonido homogéneo ante ${pax} invitados.`,
    `Corregimos modos resonantes en ${town} aplicando filtros notch en ${town} en frecuencias conflictivas del espacio en ${prov}.`,
    `La prueba de voz en ${town} se realiza en ${town} con el orador para personalizar brillo y presencia tímbrica en ${prov}.`,
    `El test de cobertura en ${town} garantiza en ${town} que hasta la última mesa escuche discursos con ${watts} W en ${prov}.`,
    `Configuramos escenas lumínicas en ${town} con transiciones suaves en ${town} entre la cena y barra libre para ${pax} personas.`,
    `Revisamos el barrido de frecuencias en ${town} seleccionando en ${town} canales limpios libres de interferencias 5G en ${prov}.`,
    `El ajuste de dinámica en ${town} comprime picos vocales en ${town} para que ningún discurso sature altavoces de ${watts} W.`,
    `Verificamos el ángulo de visión en ${town} para evitar zonas oscuras en ${town} desde cualquier ángulo de salón en ${prov}.`,
    `El técnico realiza en ${town} comprobación de retornos in-ear en ${town} para que los músicos toquen con referencia en ${prov}.`,
    `Comprobamos el enlace de vídeo en ${town} para que cámaras móviles en ${town} proyecten a pantallas sin retardos en ${prov}.`,
    `El protocolo sonoro en ${town} afina graves en ${town} para pegada física con ${watts} W sin tapar las voces en ${prov}.`,
    `Optimizamos el balance estéreo en ${town} creando en ${town} una imagen sonora envolvente para el cóctel de ${pax} personas.`,
    `El ajuste final en ${town} verifica limitadores en ${town} actuando de forma transparente sin bombeos a ${db} dB en ${prov}.`,
    `Dejamos la consola en ${town} memorizada con presets en ${town} específicos para cada momento de la escaleta en ${prov}.`,
    `El equipo técnico en ${town} entrega el escenario en ${town} listo con margen de antelación para tranquilidad en ${prov}.`
  ];
  const secondaryParagraph = `${pick(slug, 5, sec1Pool)} ${pick(slug, 6, sec2Pool)} ${pick(slug, 7, sec3Pool)}`;

  // Tertiary 1 (25 variantes)
  const ter1Pool = [
    `La reserva del Arsenal en ${town} se consolida en ${town} abonando una fianza de 100 euros en Stripe bajo SHA-256 en ${prov}.`,
    `Bloquear el equipamiento para ${town} requiere en ${town} únicamente un depósito de 100 euros en Stripe congelando stock en ${prov}.`,
    `Garantizamos la fecha en ${town} sellando en ${town} el contrato con 100 euros de fianza por pasarela bancaria en ${prov}.`,
    `El abono de 100 € de reserva en Stripe para ${town} activa en ${town} la preparación técnica de material en ${prov}.`,
    `Formalizamos la contratación en ${town} deduciendo en ${town} el depósito de 100 euros de la liquidación final en ${prov}.`,
    `Asegurar material audiovisual en ${town} es rápido en ${town}: abonas 100 euros de fianza y recibes el comprobante en ${prov}.`,
    `Sellamos tarifas para ${town} mediante sistema Price-Lock en ${town} tras abonar fianza de 100 euros en Stripe en ${prov}.`,
    `El compromiso contractual en ${town} queda blindado en ${town} con un depósito de 100 euros garantizando equipos en ${prov}.`,
    `Congelamos el presupuesto en ${town} durante el proceso formalizando en ${town} 100 € de señal en Stripe en ${prov}.`,
    `Tu evento en ${town} queda registrado en ${town} con una fianza de 100 euros que garantiza el despacho técnico en ${prov}.`,
    `El bloqueo oficial de fecha en ${town} se tramita en ${town} con 100 euros de depósito en Stripe al instante en ${prov}.`,
    `Garantiza altavoces y pantallas en ${town} aportando en ${town} 100 € de señal protegiendo tarifas en ${prov}.`,
    `La reserva técnica en ${town} se formaliza en ${town} mediante pago con tarjeta de 100 euros activando almacén en ${prov}.`,
    `Asegura tu dotación para ${town} con un depósito reembolsable en ${town} de 100 euros en Stripe por fuerza mayor en ${prov}.`,
    `El precio pactado para ${town} queda sellado en ${town} formalizando 100 € de fianza sin costes ocultos en ${prov}.`,
    `La orden de montaje en ${town} se confirma en ${town} tras abonar 100 euros de garantía oficial en ${prov}.`,
    `Bloqueamos unidades técnicas en ${town} con 100 euros de depósito en ${town} garantizando exclusividad en ${prov}.`,
    `La contratación en ${town} es transparente en ${town}: abonas 100 € de fianza inicial y liquidas según hitos en ${prov}.`,
    `Protege la técnica en ${town} ingresando en ${town} 100 euros de fianza en Stripe con emisión de factura proforma en ${prov}.`,
    `Tu reserva para ${town} queda registrada en ${town} en firme con 100 € de señal blindando el material en ${prov}.`,
    `El presupuesto para ${town} permanece congelado en ${town} ratificándose con 100 euros de depósito por Stripe en ${prov}.`,
    `Asignamos números de serie para ${town} una vez formalizada en ${town} la fianza de 100 euros en plataforma en ${prov}.`,
    `La tranquilidad contractual en ${town} comienza en ${town} con 100 € de fianza en Stripe respaldados por contrato en ${prov}.`,
    `Asegura tu Arsenal en ${town} mediante 100 euros de reserva en ${town} con firma digital garantizando el convoy en ${prov}.`,
    `El acuerdo técnico para ${town} se sella en ${town} formalmente ingresando 100 euros de señal con descuento en ${prov}.`
  ];

  // Tertiary 2 (25 variantes)
  const ter2Pool = [
    `Un operador técnico titulado en ${town} permanece en cabina durante todo el acto en ${town} atendiendo sonido e iluminación en ${prov}.`,
    `Dispondrás de asistencia técnica presencial en ${town} continua para coordinar en ${town} música, discursos y escenas en ${prov}.`,
    `El soporte in situ en ${town} libera a organizadores en ${town}, delegando el control técnico en un profesional en ${prov}.`,
    `Nuestro ingeniero permanece en ${town} desde las pruebas hasta la recogida en ${town}, velando por el éxito en ${prov}.`,
    `Contarás con un técnico dedicado en ${town} que responderá al instante en ${town} ante cualquier petición en ${prov}.`,
    `La supervisión presencial en ${town} asegura transiciones musicales en ${town} y volumen idóneo en cada fase en ${prov}.`,
    `El operador de Productora EAR en ${town} coordina la mesa en ${town} para que las intervenciones suenen nítidas en ${prov}.`,
    `La presencia de nuestro especialista en ${town} garantiza en ${town} que iluminación y sonido acompañen la fiesta en ${prov}.`,
    `Tu celebración en ${town} se desarrolla con serenidad en ${town} gracias al acompañamiento técnico ininterrumpido en ${prov}.`,
    `Delega la complejidad técnica de ${town} en manos expertas en ${town}: nuestro operador in situ cuida todo en ${prov}.`,
    `El técnico asignado a ${town} asume el control del máster en ${town} para que niveles se mantengan agradables en ${prov}.`,
    `Disfruta de tu fiesta en ${town} sabiendo que un especialista en cabina en ${town} vela por la calidad acústica en ${prov}.`,
    `La atención personalizada en ${town} incluye ajuste continuo en ${town} de microfonía para lecturas y directos en ${prov}.`,
    `Nuestro profesional en ${town} coordina la música de entrada en ${town} con sincronización y volumen apropiado en ${prov}.`,
    `El operador in situ en ${town} resuelve cualquier imprevisto en ${town} de formato o conexión de ponentes en ${prov}.`,
    `La asistencia técnica en ${town} se prolonga en ${town} hasta el desmontaje final dejando el espacio limpio en ${prov}.`,
    `Contar con nuestro especialista en ${town} aporta confianza en ${town} a los anfitriones en la escaleta en ${prov}.`,
    `El ingeniero de sonido en ${town} ecualiza cada micrófono en ${town} según la voz del orador con claridad en ${prov}.`,
    `La supervisión en cabina en ${town} evita acoples molestos en ${town} manteniendo atmósfera lumínica en ${prov}.`,
    `El acompañamiento técnico en ${town} garantiza en ${town} que el baile suene con potencia sin distorsión en ${prov}.`,
    `Nuestro operador en ${town} gestiona cambios de luz y sonido en ${town} para que el evento mantenga ritmo en ${prov}.`,
    `La dedicación presencial en ${town} permite adaptar en ${town} el volumen al aforo presente en cada momento en ${prov}.`,
    `Tu evento en ${town} cuenta con respaldo en ${town} de técnicos con amplia experiencia en espectáculos de ${prov}.`,
    `El especialista de Productora EAR en ${town} supervisa en ${town} pantallas led y sonido para una gala redonda en ${prov}.`,
    `Confía la técnica en ${town} a profesionales en ${town} que cuidan cada detalle para disfrutar con invitados en ${prov}.`
  ];
  const tertiaryParagraph = `${pick(slug, 8, ter1Pool)} ${pick(slug, 9, ter2Pool)}`;

  const packNamePool = [
    `Arsenal Audiovisual S-Class en ${town}`,
    `Dotación Técnica Homologada para ${town}`,
    `Configuración Integral de Sonido en ${town}`,
    `Parque Técnico de Sonido y Pantallas en ${town}`,
    `Infraestructura de Escenario y Audio en ${town}`,
    `Pack de Sonorización Calibrada en ${town}`,
    `Despliegue Técnico Integral para ${town}`,
    `Suministro de Sonido Profesional en ${town}`,
    `Solución Audiovisual Llave en Mano en ${town}`,
    `Equipamiento Técnico Homologado en ${town}`,
    `Sistema Acústico Orientable en ${town}`,
    `Arsenal Escénico y Pantallas LED en ${town}`,
    `Montaje Audiovisual de Vanguardia en ${town}`,
    `Cobertura Acústica de Alta Fidelidad en ${town}`,
    `Configuración Técnica para Eventos en ${town}`,
    `Dotación de Audio y Vídeo Directo en ${town}`,
    `Parque Audiovisual de Alta Gama en ${town}`,
    `Infraestructura Técnica para Bodas en ${town}`,
    `Pack Audiovisual con Soporte In Situ en ${town}`,
    `Despliegue Electroacústico Homologado en ${town}`,
    `Suministro Técnico Directo para ${town}`,
    `Solución Sonora y Pantallas LED en ${town}`,
    `Equipamiento de Directo S-Class en ${town}`,
    `Sistema Integral de Audio y Luces en ${town}`,
    `Arsenal de Eventos y Galas en ${town}`
  ];
  const technicalPackName = pick(slug, 34, packNamePool);

  // 25 variantes para technicalPackSummary
  const summaryPool = [
    `Dotación en ${town} de ${watts} W con cajas calibradas, pantalla LED Novastar y transporte por la ${highway} con técnico in situ.`,
    `Infraestructura técnica para ${town} (${prov}) con ${watts} vatios de sonido directo, muro de vídeo y traslado por la ${highway}.`,
    `Configuración acústica en ${town} para ${pax} comensales con limitador a ${db} dB, microfonía Shure y logística por la ${highway}.`,
    `Parque audiovisual en ${town} con sonido de alta gama de ${watts} W, lienzos digitales y flete directo por la ${highway}.`,
    `Montaje integral en ${town} que aporta ${watts} W RMS, pantallas de alta luminosidad y vehículo ${vehicle} por la ${highway}.`,
    `Suministro de sonido para ${pax} asistentes en ${town} con microfonía RF blindada y llegada por la ${highway} desde Méntrida.`,
    `Solución técnica en ${town} (${prov}) con ${watts} vatios calibrados para no superar ${db} dB y pantalla de 3.840 Hz por la ${highway}.`,
    `Arsenal completo para ${town} con amplificación Clase D de ${watts} W, focos robotizados y transporte seguro por la ${highway}.`,
    `Despliegue sonoro en ${town} con columnas colineales de ${watts} W, control digital de mezclas y acceso directo por la ${highway}.`,
    `Equipamiento homologado en ${town} para atender a ${pax} personas con ${watts} W de presión limpia y flete por la ${highway}.`,
    `Dotación electroacústica en ${town} protegida con limitador a ${db} dB, pantallas de refresco rápido y ruta por la ${highway}.`,
    `Servicio audiovisual en ${town} con ${watts} vatios de fidelidad tímbrica, racks Shure y convoy directo por la ${highway}.`,
    `Montaje escénico en ${town} (${prov}) combinando sonido de ${watts} W, microfonía y pantallas Novastar por la ${highway}.`,
    `Infraestructura para celebraciones en ${town} con ${watts} W RMS para ${pax} comensales y furgón por la ${highway}.`,
    `Configuración para eventos en ${town} con cobertura homogénea de ${watts} vatios, ajuste RTA y llegada por la ${highway}.`,
    `Paquete técnico en ${town} con altavoces activos de ${watts} W, pantallas estancas IP65 y logística por la ${highway}.`,
    `Sonorización profesional en ${town} dimensionada para ${pax} invitados bajo ${db} dB con flete por la ${highway}.`,
    `Suministro para galas en ${town} con ${watts} W de sonido limpio, pantallas modulares y transporte por la ${highway}.`,
    `Dotación para directos en ${town} con microfonía inalámbrica digital, sonido de ${watts} vatios y ruta por la ${highway}.`,
    `Solución escenográfica en ${town} con pantallas gigantes, potencia acústica de ${watts} W y flete ágil por la ${highway}.`,
    `Equipamiento técnico para ${town} (${prov}) con ${watts} W calibrados para ${pax} comensales y acceso por la ${highway}.`,
    `Parque sonoro en ${town} con limitación automática a ${db} dB, pantallas LED y despacho por la ${highway} desde Méntrida.`,
    `Infraestructura de audio y vídeo en ${town} con ${watts} vatios, microfonía inmune a 5G y ruta por la ${highway}.`,
    `Despliegue técnico en ${town} que integra sonido de ${watts} W para ${pax} personas y transporte por la ${highway}.`,
    `Configuración audiovisual para ${town} con ${watts} W RMS, pantallas 4K y asistencia técnica in situ por la ${highway}.`
  ];
  const technicalPackSummary = pick(slug, 35, summaryPool);

  return {
    h1,
    h2Subtitle,
    heroBadge,
    leadParagraph,
    secondaryParagraph,
    tertiaryParagraph,
    technicalPackName,
    technicalPackSummary
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERADOR DE HARDWARE TOTALMENTE PARAMÉTRICO POR POBLACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function buildLocalizedHardware(
  slug: string, 
  townName: string, 
  provinceName: string, 
  highway: string, 
  maxDbLimit: number,
  watts: number,
  pax: number
): LocalizedArsenalItem[] {
  const town = townName;
  const prov = provinceName;
  const db = maxDbLimit;

  // Audio item (25 variantes)
  const itemAudioPool = [
    `Columna acústica Bose F1 en ${town}: ${watts} W RMS con dispersión simétrica en ${town} (${prov}) y techo sonoro a ${db} dB.`,
    `Line Array d&b Serie V en ${town}: cobertura uniforme para ${pax} comensales en ${town} con subgraves y ${watts} W en ${prov}.`,
    `Sistema L-Acoustics Syva en ${town}: fidelidad colineal con ${watts} vatios directos en ${town} adaptado a recintos de ${prov}.`,
    `Cajas biamplificadas Electro-Voice ETX en ${town}: pegada acústica de ${watts} W en ${town} con alta excursión en ${prov}.`,
    `Monitores Meyer Sound Ultra-X40 en ${town}: respuesta en fase absoluta con ${watts} W en ${town} para ${pax} personas en ${prov}.`,
    `Columnas acústicas RCF Evox en ${town}: diseño compacto de ${watts} W en ${town} con dispersión de 120 grados en ${prov}.`,
    `Sistema Yamaha DZR en ${town}: previo digital a 96 kHz con ${watts} W en ${town} de potencia limpia para eventos en ${prov}.`,
    `Torres de sonido JBL VRX en ${town}: curvatura de ${watts} W en ${town} dimensionada para ${pax} asistentes sin distorsión en ${prov}.`,
    `Altavoces activos QSC K12 en ${town}: módulo DMT de directividad continua en ${town} con ${watts} vatios y corte a ${db} dB en ${prov}.`,
    `Equipo Fohhn Audio en ${town}: control de haz digital con ${watts} W en ${town} orientados a pista en ${prov}.`,
    `Sistema Martin Audio CDD-LIVE en ${town}: dispersión diferencial con ${watts} W en ${town} y conectividad Dante en ${prov}.`,
    `Cajas acústicas Turbosound Milan en ${town}: procesado Klark Teknik en ${town} con ${watts} vatios para discursos en ${prov}.`,
    `Torres HK Audio Elements en ${town}: estética estilizada de ${watts} W en ${town} ideal para ceremonias de gala en ${prov}.`,
    `Sistema Mackie DRM en ${town}: presets acústicos y ${watts} W continuos en ${town} para celebraciones en ${prov}.`,
    `Columnas LD Systems Maui 44 en ${town}: subwoofer activo y ${watts} vatios en ${town} de cobertura amplia en ${prov}.`,
    `Altavoces Adamson Point Series en ${town}: definición de gama alta con ${watts} W en ${town} para exigencias de ${prov}.`,
    `Equipo DAS Audio Event Series en ${town}: curvatura variable con ${watts} W en ${town} para ${pax} personas en ${prov}.`,
    `Cajas acústicas Void Acoustics en ${town}: diseño vanguardista con ${watts} vatios en ${town} de presencia musical en ${prov}.`,
    `Sistema dB Technologies VIO en ${town}: módulo activo con ${watts} W en ${town} y limitador digital a ${db} dB en ${prov}.`,
    `Torres acústicas Genelec Pro en ${town}: fidelidad de estudio con ${watts} vatios en ${town} para recitales en ${prov}.`,
    `Altavoces Bose S1 Pro+ a batería en ${town}: sonido inalámbrico con ${watts} W en ${town} para claustros de ${prov}.`,
    `Sistema Seeburg Acoustic Line en ${town}: ingeniería alemana con ${watts} vatios en ${town} orientados a ${prov}.`,
    `Cajas acústicas Funktion-One en ${town}: máxima eficiencia dinámica con ${watts} W en ${town} para directos en ${prov}.`,
    `Columnas K-Array Pinnacle en ${town}: discreción arquitectónica con ${watts} vatios en ${town} y gran presión en ${prov}.`,
    `Equipo Alcons Audio Pro-Ribbon en ${town}: transductor de cinta con ${watts} W en ${town} de claridad vocal en ${prov}.`
  ];
  const audioText = pick(slug, 10, itemAudioPool);

  const audioRecPool = [
    `Celebraciones nupciales en ${town} y cócteles de gala en fincas de ${prov}.`,
    `Auditorios de ${town}, salones señoriales y eventos de empresa en ${prov}.`,
    `Conciertos de cámara en ${town} y recitales acústicos para el público de ${prov}.`,
    `Festejos al aire libre en ${town} y pistas de baile con gran afluencia en ${prov}.`,
    `Actos institucionales en ${town} y recepciones oficiales en dependencias de ${prov}.`,
    `Ceremonias civiles en ${town} y banquetes exclusivos en haciendas de ${prov}.`,
    `Congresos profesionales en ${town} y simposios médicos en recintos de ${prov}.`,
    `Galas benéficas en ${town} y presentaciones de firmas comerciales en ${prov}.`,
    `Graduaciones académicas en ${town} y actos universitarios solemnes en ${prov}.`,
    `Cenas de gala en ${town} y cócteles de bienvenida al atardecer en ${prov}.`,
    `Festivales de música en ${town} y actuaciones en directo en plazas de ${prov}.`,
    `Encuentros corporativos en ${town} y jornadas de team building en ${prov}.`,
    `Puestas de largo en ${town} y fiestas privadas de etiqueta en ${prov}.`,
    `Inauguraciones de sede en ${town} y desfiles de alta costura en ${prov}.`,
    `Aniversarios de empresa en ${town} y homenajes públicos en ${prov}.`,
    `Presentaciones de producto en ${town} y ruedas de prensa en ${prov}.`,
    `Vinos de honor en ${town} y recepciones diplomáticas en ${prov}.`,
    `Veladas musicales en ${town} y sesiones de jazz vocal en ${prov}.`,
    `Eventos de automoción en ${town} y lanzamientos de marca en ${prov}.`,
    `Festivales de danza en ${town} y obras teatrales al aire libre en ${prov}.`,
    `Fiestas patronales en ${town} y verbenas populares en calles de ${prov}.`,
    `Reuniones de accionistas en ${town} y asambleas generales en ${prov}.`,
    `Encuentros gastronómicos en ${town} y catas maridaje en fincas de ${prov}.`,
    `Premios de honor en ${town} y entregas de galardones en ${prov}.`,
    `Recitales de piano en ${town} y solistas en espacios monumentales de ${prov}.`
  ];

  const audioSpec1Pool = [
    `SPL acústico en ${town} de ${126 + (getHash(slug, 42) % 9)} dB continuo para ${pax} personas en ${prov}`,
    `Rendimiento acústico en ${town} con ${watts} W continuos para eventos en ${prov}`,
    `Presión sonora en ${town} calibrada a ${126 + (getHash(slug, 42) % 9)} dB para ${pax} comensales en ${prov}`,
    `Potencia RMS en ${town} alcanzando ${watts} W con respuesta lineal en ${prov}`,
    `Emisión directa en ${town} de ${126 + (getHash(slug, 42) % 9)} dB SPL cubriendo a ${pax} personas en ${prov}`,
    `Presión calibrada en ${town} con ${watts} vatios RMS limpios en recintos de ${prov}`,
    `Nivel dinámico en ${town} de ${126 + (getHash(slug, 42) % 9)} dB continuos para ${pax} invitados en ${prov}`,
    `Fidelidad tímbrica en ${town} con ${watts} W de biamplificación en fincas de ${prov}`,
    `Cobertura homogénea en ${town} a ${126 + (getHash(slug, 42) % 9)} dB para el aforo de ${pax} comensales en ${prov}`,
    `Presión lineal en ${town} alimentada por ${watts} vatios para celebraciones en ${prov}`,
    `Pegada musical en ${town} con ${126 + (getHash(slug, 42) % 9)} dB SPL sin distorsión para ${pax} asistentes en ${prov}`,
    `Entrega sónica en ${town} de ${watts} W continuos optimizados para salones de ${prov}`,
    `Impacto sonoro en ${town} alcanzando ${126 + (getHash(slug, 42) % 9)} dB en pista para ${pax} comensales en ${prov}`,
    `Amplificación Clase D en ${town} con ${watts} vatios de alta dinámica en ${prov}`,
    `Presión certificada en ${town} de ${126 + (getHash(slug, 42) % 9)} dB continuos para los ${pax} invitados en ${prov}`,
    `Potencia electroacústica en ${town} de ${watts} W orientables para el público de ${prov}`,
    `Alineación sónica en ${town} entregando ${126 + (getHash(slug, 42) % 9)} dB SPL para ${pax} comensales en ${prov}`,
    `Reserva dinámica en ${town} con ${watts} vatios para directos exigentes en ${prov}`,
    `Proyección nítida en ${town} a ${126 + (getHash(slug, 42) % 9)} dB continuos para los ${pax} asistentes en ${prov}`,
    `Sonoridad limpia en ${town} con ${watts} W RMS sin saturación para actos de ${prov}`,
    `Presión acústica en ${town} de ${126 + (getHash(slug, 42) % 9)} dB para envolver a ${pax} personas en ${prov}`,
    `Capacidad dinámica en ${town} con ${watts} vatios de ataque rápido en fincas de ${prov}`,
    `Nivel de sonido en ${town} fijado a ${126 + (getHash(slug, 42) % 9)} dB SPL para ${pax} comensales en ${prov}`,
    `Parque de altavoces en ${town} con ${watts} W certificados para recintos de ${prov}`,
    `Presión de graves en ${town} de ${126 + (getHash(slug, 42) % 9)} dB continuos ante ${pax} personas en ${prov}`
  ];

  const audioSpec2Pool = [
    `Curva tonal en ${town} lineal desde ${37 + (getHash(slug, 43) % 7)} Hz optimizada para ${pax} oyentes en ${prov}`,
    `Respuesta en frecuencia en ${town} desde ${37 + (getHash(slug, 43) % 7)} Hz calibrada para ${pax} comensales en ${prov}`,
    `Biamplificación acústica en ${town} con corte a ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} personas en ${prov}`,
    `Rango de subgraves en ${town} descendiendo a ${37 + (getHash(slug, 43) % 7)} Hz ante ${pax} invitados en ${prov}`,
    `Fase acústica en ${town} coherente desde ${37 + (getHash(slug, 43) % 7)} Hz para eventos de ${pax} comensales en ${prov}`,
    `Transductores de graves en ${town} con respuesta a ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} personas en ${prov}`,
    `Presión de subgrave en ${town} rindiendo a ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} asistentes en ${prov}`,
    `Alineación DSP en ${town} con ecualización desde ${37 + (getHash(slug, 43) % 7)} Hz en recintos de ${prov}`,
    `Definición tímbrica en ${town} que abarca desde ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} comensales en ${prov}`,
    `Extensión de graves en ${town} hasta ${37 + (getHash(slug, 43) % 7)} Hz protegiendo el sonido en ${prov}`,
    `Crossover digital en ${town} ajustado desde ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} asistentes en ${prov}`,
    `Graves articulados en ${town} partiendo de ${37 + (getHash(slug, 43) % 7)} Hz para la gala de ${prov}`,
    `Rango audible en ${town} balanceado desde ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} personas en ${prov}`,
    `Ajuste de corte en ${town} programado a ${37 + (getHash(slug, 43) % 7)} Hz para recintos de ${prov}`,
    `Presencia de bombos en ${town} nítida desde ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} invitados en ${prov}`,
    `Fidelidad de bajos en ${town} sostenida desde ${37 + (getHash(slug, 43) % 7)} Hz para actos en ${prov}`,
    `Optimización de sala en ${town} calibrada a ${37 + (getHash(slug, 43) % 7)} Hz ante ${pax} comensales en ${prov}`,
    `Dispersión simétrica en ${town} con pegada desde ${37 + (getHash(slug, 43) % 7)} Hz en celebraciones de ${prov}`,
    `Registro dinámico en ${town} que reproduce desde ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} personas en ${prov}`,
    `Claridad tímbrica en ${town} descendiendo hasta ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} oyentes en ${prov}`,
    `Respuesta controlada en ${town} fijada en ${37 + (getHash(slug, 43) % 7)} Hz para festejos de ${prov}`,
    `Rendimiento de bajas frecuencias en ${town} desde ${37 + (getHash(slug, 43) % 7)} Hz ante ${pax} invitados en ${prov}`,
    `Monitoreo sonoro en ${town} activo desde ${37 + (getHash(slug, 43) % 7)} Hz para la velada en ${prov}`,
    `Equilibrio de sala en ${town} ajustado a ${37 + (getHash(slug, 43) % 7)} Hz para ${pax} comensales en ${prov}`,
    `Graves cardioides en ${town} contenidos desde ${37 + (getHash(slug, 43) % 7)} Hz para tranquilidad en ${prov}`
  ];

  const audioSpec3Pool = [
    `Cableado apantallado que viaja a ${town} por la ${highway} con conectores Neutrik XLR hacia ${prov}`,
    `Línea balanceada despachada a ${town} por la ${highway} con blindaje electromagnético en ${prov}`,
    `Conexión Neutrik libre de ruidos fletada hacia ${town} por la ${highway} para directos en ${prov}`,
    `Tendido de audio protegido que arriba a ${town} por la ${highway} con cobre libre de oxígeno en ${prov}`,
    `Transporte técnico directo a ${town} por la ${highway} con mangueras multipar apantalladas hacia ${prov}`,
    `Manguera balanceada de señal enviada a ${town} por la ${highway} con conectores de alta resistencia en ${prov}`,
    `Cables Neutrik dorados trasladados a ${town} por la ${highway} para máxima conductividad en ${prov}`,
    `Sistema de conexión rápida arribando a ${town} por la ${highway} con cero pérdidas de inserción en ${prov}`,
    `Tiradas analógicas blindadas conducidas a ${town} por la ${highway} para aislar interferencias en ${prov}`,
    `Líneas de microfonía apantallada que viajan a ${town} por la ${highway} con cubierta ignífuga en ${prov}`,
    `Cableado balanceado para directos en ${town} transportado por la ${highway} con robustez profesional en ${prov}`,
    `Conectores Neutrik originales despachados a ${town} por la ${highway} con seguro de transporte en ${prov}`,
    `Enlace de señal apantallado que conecta con ${town} por la ${highway} sin ruidos parásitos en ${prov}`,
    `Tendido con blindaje cuádruple fletado a ${town} por la ${highway} para pureza sónica en ${prov}`,
    `Mangueras de transmisión analógica desplazadas a ${town} por la ${highway} con protección anti-torsión en ${prov}`,
    `Líneas apantalladas profesionales que acceden a ${town} por la ${highway} para celebraciones en ${prov}`,
    `Cables de alta gama Neutrik llevados a ${town} por la ${highway} garantizando continuidad en ${prov}`,
    `Conexión simétrica balanceada transportada a ${town} por la ${highway} para audio transparente en ${prov}`,
    `Tiradas multicanal enviadas hacia ${town} por la ${highway} con aislamiento individual por par en ${prov}`,
    `Cables de señal para directo fletados a ${town} por la ${highway} con conectores estancos en ${prov}`,
    `Manguera de transporte libre de halógenos dirigida a ${town} por la ${highway} para eventos en ${prov}`,
    `Líneas de audio de bajo ruido trasladadas a ${town} por la ${highway} con blindaje espiral en ${prov}`,
    `Conexionado apantallado de estudio que viaja a ${town} por la ${highway} con máxima fidelidad en ${prov}`,
    `Tendido de altavoces de gran sección enviado a ${town} por la ${highway} para cero caída de señal en ${prov}`,
    `Líneas Neutrik de interconexión conducidas a ${town} por la ${highway} para seguridad de enlace en ${prov}`
  ];

  const audioSpec4Pool = [
    `Freno acústico en ${town} regulado electrónicamente al umbral oficial de ${db} dB en ${prov}`,
    `Limitador calibrado en ${town} que protege el volumen sin exceder jamás ${db} dB en ${prov}`,
    `Control sonométrico en ${town} visado por el técnico para mantenerse bajo ${db} dB en ${prov}`,
    `Compresor digital en ${town} que frena picos musicales conteniendo el nivel a ${db} dB en ${prov}`,
    `Procesado de limitación en ${town} ajustado a la normativa municipal de ${db} dB en ${prov}`,
    `Atenuación automática en ${town} programada en DSP para no superar la cota de ${db} dB en ${prov}`,
    `Corte preventivo en ${town} fijado por sonómetro integrador bajo el umbral de ${db} dB en ${prov}`,
    `Gestión de dinámica en ${town} con limitador brickwall garantizando lectura menor a ${db} dB en ${prov}`,
    `Protección de descanso en ${town} modulada por el técnico en cabina a ${db} dB en ${prov}`,
    `Limitador acústico de señal en ${town} operando de modo transparente hasta ${db} dB en ${prov}`,
    `Ajuste de decibelios en ${town} con precinto digital bloqueando la salida a ${db} dB en ${prov}`,
    `Control de presión sónica en ${town} configurado para salvaguardar el límite de ${db} dB en ${prov}`,
    `Monitorización de decibelios en ${town} en tiempo real certificando el tope de ${db} dB en ${prov}`,
    `Filtros de corte sónico en ${town} ajustados para respetar la franja nocturna de ${db} dB en ${prov}`,
    `Limitación de potencia en ${town} que asegura pegada en pista sin rebasar ${db} dB en ${prov}`,
    `Techo sonoro en ${town} parametrizado en la mesa de mezclas para no sobrepasar ${db} dB en ${prov}`,
    `Regulación sonométrica en ${town} que previene cualquier denuncia vecinal bajo ${db} dB en ${prov}`,
    `Limitador homologado en ${town} con registro de eventos sónico manteniendo ${db} dB en ${prov}`,
    `Control de volumen en ${town} equilibrado para garantizar la tranquilidad en ${db} dB en ${prov}`,
    `Compresión de salida en ${town} regulada por el ingeniero para contener ruidos a ${db} dB en ${prov}`,
    `Atenuador paramétrico en ${town} que protege a los comensales limitando a ${db} dB en ${prov}`,
    `Ajuste sonoro estricto en ${town} preservando el marco medioambiental de ${db} dB en ${prov}`,
    `Limitador de graves en ${town} diseñado para impedir transmisiones estructurales sobre ${db} dB en ${prov}`,
    `Umbral acústico en ${town} programado en procesador máster bajo la marca de ${db} dB en ${prov}`,
    `Protección sonométrica certificada en ${town} garantizando estricto cumplimiento a ${db} dB en ${prov}`
  ];

  const audioItem: LocalizedArsenalItem = {
    id: `audio-${slug}`,
    name: audioText.split(':')[0] || `Equipo de Sonido ${town}`,
    category: 'Sonido Profesional',
    tagline: audioText,
    recommendedFor: pick(slug, 51, audioRecPool),
    priceDisplay: `Desde ${340 + (getHash(slug, 41) % 5) * 20} €`,
    priceNumeric: 340 + (getHash(slug, 41) % 5) * 20,
    specs: [
      pick(slug, 71, audioSpec1Pool),
      pick(slug, 72, audioSpec2Pool),
      pick(slug, 73, audioSpec3Pool),
      pick(slug, 74, audioSpec4Pool)
    ],
    badge: `CALIBRADO ${town.toUpperCase()}`,
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop'
  };

  // LED item (25 variantes)
  const itemLedPool = [
    `Pantalla gigante Novastar P2.9 en ${town}: refresco a 3.840 Hz y brillo calibrado en ${town} para fondos escénicos en ${prov}.`,
    `Muro LED Absen P3.9 exterior en ${town}: estanqueidad IP65 con 5.500 nits en ${town} visible bajo sol directo en ${prov}.`,
    `Lienzo digital Leyard CarbonLight en ${town}: chasis ultraligero de fibra con 4K en ${town} para galas en ${prov}.`,
    `Paneles LED Unilumin Upad IV en ${town}: curvatura para escenarios envolventes en ${town} con alta definición en ${prov}.`,
    `Tótem interactivo UHD 4K en ${town}: pantalla vertical de 85 pulgadas en ${town} para photocalls y ponencias en ${prov}.`,
    `Pantalla modular Roe Visual en ${town}: tecnología black-led con contraste en ${town} para grabaciones en ${prov}.`,
    `Pared gráfica Infiled P2.6 en ${town}: píxel pitch fino en ${town} para visualización nítida a dos metros en ${prov}.`,
    `Pantalla suspendida en truss para ${town}: montaje volado de alta seguridad en ${town} con escalado Novastar en ${prov}.`,
    `Módulo LED ultra delgado en ${town}: peana de diseño discreto con HDMI 2.1 en ${town} para salones de ${prov}.`,
    `Lienzo de vídeo exterior en ${town}: estructura antiviento homologada en ${town} para conciertos y festejos en ${prov}.`,
    `Pantalla LED transparente en ${town}: efecto holográfico con 70% permeabilidad en ${town} para presentaciones en ${prov}.`,
    `Display LED perimetral en ${town}: protección de goma antichoque con brillo en ${town} para recintos de ${prov}.`,
    `Muro gráfico Aluvision en ${town}: integración en cajas de luz con marcos en ${town} para ferias en ${prov}.`,
    `Pantalla cilíndrica LED en ${town}: visualización de 360 grados en ${town} para zonas centrales de celebración en ${prov}.`,
    `Suelo LED pisable interactivo en ${town}: vidrio templado de alta resistencia en ${town} para fiestas en ${prov}.`,
    `Monitores de apoyo 4K en ${town}: peana móvil regulable en altura en ${town} para atril y presidencia en ${prov}.`,
    `Pantalla LED P1.9 para salas VIP en ${town}: máxima resolución en ${town} para congresos médicos en ${prov}.`,
    `Lienzo móvil para tráiler en ${town}: elevación hidráulica rápida en ${town} para actos al aire libre en ${prov}.`,
    `Banner LED horizontal en ${town}: cinta digital para patrocinadores en ${town} y directos en eventos de ${prov}.`,
    `Pantalla LED de bajo consumo en ${town}: emisión térmica reducida en ${town} para espacios climatizados en ${prov}.`,
    `Muro de proyección láser Panasonic en ${town}: 12.000 lúmenes con óptica corta en ${town} para espacios de ${prov}.`,
    `Pantalla LED con imanes frontales en ${town}: acceso magnético en ${town} que facilita montajes en pared en ${prov}.`,
    `Display LED curvo Novastar en ${town}: ángulo inmersivo en ${town} para lanzamientos de producto en ${prov}.`,
    `Pared audiovisual para photocall en ${town}: fondo dinámico en ${town} para fotos de invitados con grafismos en ${prov}.`,
    `Pantalla gigante P4.8 para verbenas en ${town}: robustez climática en ${town} y visibilidad a más de 30 metros en ${prov}.`
  ];
  const ledText = pick(slug, 11, itemLedPool);

  const ledRecPool = [
    `Fondos de escenario corporativos en ${town} y conferencias de empresa en ${prov}.`,
    `Proyección de directos emotivos en ${town} y vídeos nupciales en fincas de ${prov}.`,
    `Pasarelas de moda en ${town} y presentaciones de productos de lujo en ${prov}.`,
    `Espacios exteriores en ${town} que precisan alta visibilidad bajo el sol de ${prov}.`,
    `Retransmisiones deportivas en ${town} y actos institucionales solemnes en ${prov}.`,
    `Festivales musicales en ${town} y visuales rítmicos sincronizados con DJ en ${prov}.`,
    `Congresos sanitarios en ${town} y ponencias técnicas con gráficos en ${prov}.`,
    `Galas de entrega de premios en ${town} y fondos dinámicos interactivos en ${prov}.`,
    `Stands feriales en ${town} y exposiciones comerciales de alto impacto en ${prov}.`,
    `Graduaciones escolares en ${town} y eventos académicos con streaming en ${prov}.`,
    `Inauguraciones de locales en ${town} y cócteles de bienvenida visuales en ${prov}.`,
    `Cenas de gala en ${town} y homenajes institucionales con proyección en ${prov}.`,
    `Plenos municipales en ${town} y asambleas plenarias transmitidas en ${prov}.`,
    `Lanzamientos de vehículos en ${town} y ferias del motor en recintos de ${prov}.`,
    `Bodas al aire libre en ${town} y banquetes con proyección de recuerdos en ${prov}.`,
    `Actos conmemorativos en ${town} y foros económicos con múltiples oradores en ${prov}.`,
    `Muestras de arte digital en ${town} y performances escénicas contemporáneas en ${prov}.`,
    `Encuentros de negocios en ${town} y convenciones anuales de distribuidores en ${prov}.`,
    `Fiestas patronales en ${town} y escenarios de plaza pública con gran afluencia en ${prov}.`,
    `Espectáculos de magia en ${town} y galas de variedades con apoyo visual en ${prov}.`,
    `Simposios jurídicos en ${town} y debates televisados en directo en ${prov}.`,
    `Presentaciones de firmas en ${town} y conferencias de prensa internacionales en ${prov}.`,
    `Celebraciones privadas en ${town} y puestas de largo con videoclip en ${prov}.`,
    `Encuentros gastronómicos en ${town} y retransmisiones de showcooking en ${prov}.`,
    `Recitales poéticos en ${town} y proyecciones documentales al anochecer en ${prov}.`
  ];

  const ledSpec1Pool = [
    `Frecuencia de refresco en ${town} a 3.840 Hz sin parpadeos para cámaras de ${prov}`,
    `Tasa de escaneo en ${town} calibrada a 3.840 Hz libre de flicker en ${prov}`,
    `Procesamiento visual en ${town} operando a 3.840 Hz para grabaciones en ${prov}`,
    `Velocidad de barrido en ${town} fijada en 3.840 Hz para vídeos nítidos en ${prov}`,
    `Refresco ultrarrápido en ${town} alcanzando 3.840 Hz para transmisiones en ${prov}`,
    `Rendimiento de pantalla en ${town} con refresco de 3.840 Hz para directos en ${prov}`,
    `Frecuencia de imagen en ${town} ajustada a 3.840 Hz para cámaras profesionales en ${prov}`,
    `Sincronización óptica en ${town} con escaneo a 3.840 Hz sin bandas negras en ${prov}`,
    `Tasa de muestreo visual en ${town} establecida en 3.840 Hz para galas en ${prov}`,
    `Procesado de diodos en ${town} trabajando a 3.840 Hz para fotografías perfectas en ${prov}`,
    `Respuesta de refresco en ${town} a 3.840 Hz garantizando tomas limpias en ${prov}`,
    `Frecuencia cinematográfica en ${town} con 3.840 Hz de barrido continuo en ${prov}`,
    `Estabilidad de escaneo en ${town} calibrada a 3.840 Hz para móviles y cámaras en ${prov}`,
    `Tasa de cuadro en ${town} sincronizada a 3.840 Hz sin artefactos visuales en ${prov}`,
    `Módulos de refresco alto en ${town} corriendo a 3.840 Hz para el público de ${prov}`,
    `Control de modulación PWM en ${town} a 3.840 Hz para confort ocular en ${prov}`,
    `Frecuencia de paneles en ${town} optimizada a 3.840 Hz para cobertura mediática en ${prov}`,
    `Refresco LED profesional en ${town} con 3.840 Hz estables en cualquier brillo en ${prov}`,
    `Escaneo de diodos en ${town} configurado a 3.840 Hz para retransmisión televisiva en ${prov}`,
    `Tasa de visualización en ${town} a 3.840 Hz sin retardo ni estroboscopia en ${prov}`,
    `Sincronía de vídeo en ${town} ajustada a 3.840 Hz para producciones broadcast en ${prov}`,
    `Frecuencia de modulación en ${town} manteniendo 3.840 Hz en todas las escenas de ${prov}`,
    `Velocidad de panel en ${town} calibrada a 3.840 Hz para máxima fluidez en ${prov}`,
    `Barrido de imagen continuo en ${town} a 3.840 Hz protegiendo grabaciones en ${prov}`,
    `Refresco escénico en ${town} a 3.840 Hz conforme al estándar broadcast de ${prov}`
  ];

  const ledSpec2Pool = [
    `Escala de grises en ${town} con 16 bits de profundidad por canal en ${prov}`,
    `Gradación tonal en ${town} procesando 16 bits para negros profundos en ${prov}`,
    `Colorimetría HDR en ${town} con profundidad de 16 bits por píxel en ${prov}`,
    `Rango dinámico en ${town} con procesado de 16 bits sin saltos cromáticos en ${prov}`,
    `Paleta cromática en ${town} con millones de tonos a 16 bits reales en ${prov}`,
    `Procesado de color en ${town} que entrega 16 bits de gradiente suave en ${prov}`,
    `Nivel de contraste en ${town} optimizado con 16 bits para proyecciones en ${prov}`,
    `Fidelidad de negros en ${town} asegurada por diodos con escala de 16 bits en ${prov}`,
    `Definición cromática en ${town} con calibración píxel a píxel a 16 bits en ${prov}`,
    `Profundidad de imagen en ${town} con precisión de 16 bits para fotografías en ${prov}`,
    `Gama de colores en ${town} calibrada bajo espacio DCI-P3 con 16 bits en ${prov}`,
    `Renderizado visual en ${town} procesando 16 bits para gradientes perfectos en ${prov}`,
    `Tecnología black-led en ${town} con matices cromáticos de 16 bits en ${prov}`,
    `Calibración de fábrica en ${town} manteniendo 16 bits de consistencia en ${prov}`,
    `Contraste dinámico en ${town} con precisión de 16 bits para fondos de gala en ${prov}`,
    `Uniformidad visual en ${town} con escala de 16 bits en cada módulo de ${prov}`,
    `Curva de gamma en ${town} ajustada a 16 bits para máxima naturalidad en ${prov}`,
    `Procesamiento gráfico en ${town} con 16 bits sin bandas ni solarizaciones en ${prov}`,
    `Rango tonal de vídeo en ${town} extendido a 16 bits para emisión impecable en ${prov}`,
    `Profundidad de escala en ${town} gestionada a 16 bits por controladora de ${prov}`,
    `Reproducción de piel en ${town} con matices suaves gracias a los 16 bits en ${prov}`,
    `Matriz de sombreado en ${town} con precisión analítica a 16 bits en ${prov}`,
    `Escala de contraste en ${town} preservada en bajas luces con 16 bits en ${prov}`,
    `Precisión de color en ${town} certificada con procesado completo de 16 bits en ${prov}`,
    `Tratamiento de señal en ${town} a 16 bits para nitidez absoluta en ${prov}`
  ];

  const ledSpec3Pool = [
    `Chasis autoportante en ${town} fabricado en aleación ligera de aluminio en ${prov}`,
    `Estructura modular en ${town} con bloqueo rápido de seguridad para eventos en ${prov}`,
    `Bastidor de aluminio en ${town} con tolerancia cero para encaje milimétrico en ${prov}`,
    `Carcasa de fundición en ${town} con disipación pasiva silenciosa en ${prov}`,
    `Marcos de montaje en ${town} con anclajes rápidos de precisión para recintos de ${prov}`,
    `Chasis ultraligero en ${town} que minimiza peso en estructuras suspendidas de ${prov}`,
    `Paneles modulares en ${town} con empalme perfecto sin juntas visibles en ${prov}`,
    `Estructura antideslizante en ${town} con soportes de suelo regulables en ${prov}`,
    `Chasis de precisión en ${town} con certificación de resistencia al viento en ${prov}`,
    `Módulos autoportantes en ${town} con niveladores de altura para suelos de ${prov}`,
    `Bastidor aeroespacial en ${town} con fijaciones rápidas para montaje seguro en ${prov}`,
    `Estructura robusta en ${town} preparada tanto para colgar como apilar en ${prov}`,
    `Chasis con cierre rápido en ${town} que agiliza el despliegue técnico en ${prov}`,
    `Marcos mecanizados en ${town} con ajustes micrométricos de alineación en ${prov}`,
    `Soportes de aluminio en ${town} conformes a directiva de carga escénica en ${prov}`,
    `Módulos de ensamble en ${town} con tiradores ergonómicos para colocación en ${prov}`,
    `Bastidores reforzados en ${town} con capacidad de curvatura convexa o cóncava en ${prov}`,
    `Estructura de peana pesada en ${town} con zapatas de protección de parquet en ${prov}`,
    `Chasis con guías cónicas en ${town} que aseguran rigidez total del muro en ${prov}`,
    `Marcos de alta resistencia en ${town} con acabados en negro mate anti-reflejo en ${prov}`,
    `Estructura modular de vídeo en ${town} con perfiles visados de ingeniería en ${prov}`,
    `Bastidor estanco en ${town} con protección en esquinas durante el montaje en ${prov}`,
    `Soportes regulables en ${town} que vencen desniveles del terreno en fincas de ${prov}`,
    `Chasis de transporte en ${town} con encastre seguro en baúles acolchados para ${prov}`,
    `Ensamblaje modular en ${town} con cierres de presión certificados para galas de ${prov}`
  ];

  const ledSpec4Pool = [
    `Conexión HDMI 2.1 y SDI hacia ${town} con escalador Novastar 4K en ${prov}`,
    `Procesador Novastar en ${town} con envío de datos redundante por fibra hacia ${prov}`,
    `Controladora de vídeo hacia ${town} con entradas 4K UHD para directos de ${prov}`,
    `Escalado de imagen para ${town} con ruteo de presets mediante software en ${prov}`,
    `Rótula de señal digital hacia ${town} con conmutación en directo sin cortes en ${prov}`,
    `Escalador Novastar UHD hacia ${town} con soporte de ventanas PIP para ponencias en ${prov}`,
    `Entradas multiformato para ${town} incluyendo DisplayPort y HDMI sin latencia en ${prov}`,
    `Procesamiento Novastar en ${town} con mapeo flexible de lienzos para eventos de ${prov}`,
    `Línea de fibra óptica hacia ${town} para transporte de vídeo sin degradación en ${prov}`,
    `Controladora Novastar dedicada para ${town} con ajuste de brillo milimétrico en ${prov}`,
    `Receptor de vídeo para ${town} con respaldo N+1 ante cualquier fallo de cable en ${prov}`,
    `Entrada directa HDMI hacia ${town} para ordenadores portátiles de oradores en ${prov}`,
    `Escalador de gama alta para ${town} con sincronización de audio incrustado en ${prov}`,
    `Conexión SDI balanceada hacia ${town} para cámaras de televisión operando en ${prov}`,
    `Controladora Novastar externa para ${town} con display frontal de estado en ${prov}`,
    `Matriz de escalado hacia ${town} con transiciones suaves de vídeo en directo en ${prov}`,
    `Enlace de datos blindado hacia ${town} con conectores EtherCON de alta velocidad en ${prov}`,
    `Procesador de muro hacia ${town} con gestión de resoluciones personalizadas en ${prov}`,
    `Conmutador digital hacia ${town} con vista previa multicanal para cabina en ${prov}`,
    `Escalador Novastar profesional para ${town} con ajuste de color por cuadrante en ${prov}`,
    `Puerto de red Gigabit hacia ${town} para supervisión técnica en tiempo real en ${prov}`,
    `Distribución de señal para ${town} con puertos redundantes de envío de tramas en ${prov}`,
    `Entrada USB directa hacia ${town} para reproducción autónoma de contenidos en ${prov}`,
    `Escalador 4K de baja latencia para ${town} con sincronización sincrónica de red en ${prov}`,
    `Control de pantalla para ${town} con interfaz Novastar certificada para directos en ${prov}`
  ];

  const ledItem: LocalizedArsenalItem = {
    id: `led-${slug}`,
    name: ledText.split(':')[0] || `Pantallas LED ${town}`,
    category: 'Pantallas LED',
    tagline: ledText,
    recommendedFor: pick(slug, 52, ledRecPool),
    priceDisplay: `${125 + (getHash(slug, 44) % 4) * 10} € / m²`,
    priceNumeric: 125 + (getHash(slug, 44) % 4) * 10,
    specs: [
      pick(slug, 75, ledSpec1Pool),
      pick(slug, 76, ledSpec2Pool),
      pick(slug, 77, ledSpec3Pool),
      pick(slug, 78, ledSpec4Pool)
    ],
    badge: `ALTO BRILLO ${town.toUpperCase()}`,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'
  };

  // RF item (25 variantes)
  const itemRfPool = [
    `Rack de microfonía Shure Axient Digital en ${town}: conmutación automática ante ondas 5G en ${town} para directos en ${prov}.`,
    `Micrófonos inalámbricos Sennheiser EW-DX en ${town}: rango de 134 dB con enlace encriptado en ${town} para eventos en ${prov}.`,
    `Microfonía Shure QLX-D Beta 87A en ${town}: rechazo milimétrico de acoples en ${town} para discursos solemnes en ${prov}.`,
    `Diademas invisibles DPA 4066 en ${town}: captación natural sin obstrucción en ${town} para ponencias en ${prov}.`,
    `Micrófonos de solapa omnidireccionales en ${town}: enlace digital UHF libre de cortes en ${town} para oradores en ${prov}.`,
    `Microfonía de mano Shure KSM9 en ${town}: patrón conmutable para vocalistas en ${town} en recitales de ${prov}.`,
    `Antenas helicoidales RF Venue en ${town}: cobertura sin zonas de sombra a 100 metros en ${town} para recintos de ${prov}.`,
    `Micrófonos de atril Shure Microflex en ${town}: cuello de cisne flexible e inmunidad celular en ${town} para plenos en ${prov}.`,
    `Sistema inalámbrico de instrumentos en ${town}: petacas de baja latencia en ${town} para música en directo en ${prov}.`,
    `Receptores Dante multicanal en ${town}: ruteo por cable de red sin zumbidos en ${town} para audio limpio en ${prov}.`,
    `Micrófonos de diadema Sennheiser HSP4 en ${town}: cápsula resistente al sudor en ${town} para animadores en ${prov}.`,
    `Microfonía de mano Neumann KK205 en ${town}: calidez de estudio legendaria en ${town} para galas exclusivas en ${prov}.`,
    `Micrófonos de superficie Shure Beta 91A en ${town}: captación discreta de sobremesa en ${town} para firmas solemnes en ${prov}.`,
    `Sistema de conferencias Bosch Dicentis en ${town}: turnos de palabra y votación en ${town} para asambleas en ${prov}.`,
    `Receptores cuádruples Shure en ${town}: cuatro canales en rack con escaneo en ${town} de frecuencias en ${prov}.`,
    `Micrófonos de cañón Sennheiser MKH416 en ${town}: alta directividad en ${town} para entrevistas y vídeos en ${prov}.`,
    `Petacas inalámbricas Shure AD1 en ${town}: chasis metálico compacto con litio inteligente en ${town} para directos en ${prov}.`,
    `Distribuidor de antena activo Shure en ${town}: amplificación RF y reparto cuádruple en ${town} para estabilidad en ${prov}.`,
    `Micrófonos para instrumentos DPA 4099 en ${town}: pinzas específicas para cuerdas en ${town} en recitales de ${prov}.`,
    `Sistema in-ear Sennheiser EW IEM en ${town}: monitorización personal inalámbrica en ${town} sin cables de suelo en ${prov}.`,
    `Microfonía vintage años 50 en ${town}: diseño retro con cápsula moderna en ${town} para bodas temáticas en ${prov}.`,
    `Micrófonos estéreo Rode NT4 en ${town}: grabación ambiental fiel de coros en ${town} para conciertos en ${prov}.`,
    `Petacas de transmisión DPA d:fine en ${town}: ligereza absoluta en ${town} para discursos dinámicos en ${prov}.`,
    `Micrófonos de condensador AKG C414 en ${town}: versatilidad tímbrica en ${town} para grabaciones selectas en ${prov}.`,
    `Rack de 8 canales Shure Axient en ${town}: redundancia con salto de frecuencia en milisegundos en ${town} para ${prov}.`
  ];
  const rfText = pick(slug, 12, itemRfPool);

  const rfRecPool = [
    `Maestros de ceremonias en ${town}, oficiantes y ponentes de galas en ${prov}.`,
    `Votos matrimoniales emotivos en ${town} y lecturas de ceremonia en fincas de ${prov}.`,
    `Solistas vocales en ${town} y grupos de directos que actúan ante el público de ${prov}.`,
    `Plenos municipales en ${town}, debates y asambleas plenarias oficiales en ${prov}.`,
    `Ruedas de prensa en ${town} y transmisiones con cámaras en vivo en ${prov}.`,
    `Presentadores de galas en ${town} y animadores que se mueven entre el público en ${prov}.`,
    `Monologuistas cómicos en ${town} y actores de teatro con movilidad por escenario en ${prov}.`,
    `Directivos en ${town} y directores generales en reuniones anuales de accionistas en ${prov}.`,
    `Oficiantes religiosos en ${town} y oradores en capillas o espacios abiertos de ${prov}.`,
    `Subastas benéficas en ${town} y dinamizadores de eventos sociales de gala en ${prov}.`,
    `Conferenciantes magistrales en ${town} y ponentes en auditorios universitarios de ${prov}.`,
    `Entrevistadores en ${town} y moderadores de mesas redondas sectoriales en ${prov}.`,
    `Músicos de cuerda y viento en ${town} con microfonía miniatura para directos en ${prov}.`,
    `Animadores de baile en ${town} con diademas fijas resistentes al sudor en ${prov}.`,
    `Presentaciones de producto en ${town} con oradores que precisan manos libres en ${prov}.`,
    `Bodas temáticas en ${town} con micrófonos vintage de aspecto clásico en ${prov}.`,
    `Actos militares solemnes en ${town} y conmemoraciones cívicas en plazas de ${prov}.`,
    `Graduaciones escolares en ${town} y entrega de diplomas con atril microfonado en ${prov}.`,
    `Ceremonias de bienvenida en ${town} y discursos de apertura en congresos de ${prov}.`,
    `Orquestas y bandas en ${town} que exigen canales limpios de transmisión en ${prov}.`,
    `Gobernantes locales en ${town} y autoridades civiles en visitas oficiales en ${prov}.`,
    `Guías turísticos en ${town} y coordinadores de visitas a edificios históricos en ${prov}.`,
    `Locutores de radio en ${town} y comentaristas de directos transmitidos desde ${prov}.`,
    `Lectores poéticos en ${town} y cantantes solistas en acústicos íntimos de ${prov}.`,
    `Debates televisivos en ${town} y foros ciudadanos con microfonía compartida en ${prov}.`
  ];

  const rfSpec1Pool = [
    `Cápsula profesional Shure Beta 87A en ${town} con rechazo milimétrico de acoples en ${prov}`,
    `Cápsula condensador supercardioide en ${town} con aislamiento de ruido ambiente en ${prov}`,
    `Cápsula dinámica Shure SM58 en ${town} con suspensión neumática anti-impactos en ${prov}`,
    `Cápsula de mano Neumann en ${town} con calidez tímbrica de estudio para voces de ${prov}`,
    `Cápsula vocal Shure KSM9 en ${town} con patrón polar conmutable para directos en ${prov}`,
    `Cápsula Sennheiser e945 en ${town} con corte de agudos cristalino para oradores en ${prov}`,
    `Cápsula con rejilla de acero endurecido en ${town} con filtro antipop integrado en ${prov}`,
    `Cápsula miniatura de condensador en ${town} con respuesta plana y transparente en ${prov}`,
    `Cápsula Shure Beta 58A en ${town} con imán de neodimio para alta salida en ${prov}`,
    `Cápsula electret de diadema en ${town} con protección frente a saliva y viento en ${prov}`,
    `Cápsula supercardioide estrecha en ${town} que evita enganches acústicos en ${prov}`,
    `Cápsula con diafragma doble en ${town} para supresión total del efecto proximidad en ${prov}`,
    `Cápsula condensador vocal en ${town} con rango dinámico de 120 dB para cantantes en ${prov}`,
    `Cápsula optimizada para palabra en ${town} con realce de presencia en frecuencias medias en ${prov}`,
    `Cápsula de mano profesional en ${town} con soporte elástico interno anti-manipulación en ${prov}`,
    `Cápsula de micrófono Shure en ${town} con atenuación de graves para discursos limpios en ${prov}`,
    `Cápsula Sennheiser de solapa en ${town} con patrón omnidireccional discreto en ${prov}`,
    `Cápsula de transmisión digital en ${town} sin compresión ni pérdidas de detalle en ${prov}`,
    `Cápsula resistente al viento en ${town} con pantalla de espuma de alta densidad en ${prov}`,
    `Cápsula con imán de alta eficiencia en ${town} para captación fiel en auditorios de ${prov}`,
    `Cápsula vocal conmutable en ${town} para adaptarse a conferencias o canto en ${prov}`,
    `Cápsula miniatura DPA en ${town} con soporte ergonómico casi imperceptible en ${prov}`,
    `Cápsula con blindaje magnético en ${town} que cancela zumbidos de transformadores en ${prov}`,
    `Cápsula Shure para atril en ${town} con cuello flexible de doble articulación en ${prov}`,
    `Cápsula de alta gama acústica en ${town} calibrada para fidelidad oratoria en ${prov}`
  ];

  const rfSpec2Pool = [
    `Antenas directivas tipo pala en ${town} con cobertura segura a 100 metros en ${prov}`,
    `Antenas helicoidales RF Venue en ${town} sin zonas de sombra ni caídas de señal en ${prov}`,
    `Distribuidor de antenas activo en ${town} con filtrado selectivo de banda en ${prov}`,
    `Receptores Diversity en ${town} con doble antena conmutando sin clics en ${prov}`,
    `Antenas polarizadas circularmente en ${town} inmunes a giros del micrófono en ${prov}`,
    `Pértigas de antena elevadas en ${town} con línea de visión despejada al escenario en ${prov}`,
    `Amplificadores de línea de antena en ${town} compensando pérdidas de cable en ${prov}`,
    `Antenas omnidireccionales en ${town} para cobertura envolvente en salas amplias de ${prov}`,
    `Sistema True Diversity en ${town} analizando continuamente la mejor señal de ${prov}`,
    `Antenas con filtro paso banda en ${town} bloqueando interferencias de telefonía en ${prov}`,
    `Distribución cuádruple de antena en ${town} alimentando racks completos sin pérdida en ${prov}`,
    `Antenas de perfil bajo en ${town} instaladas con total discreción visual en ${prov}`,
    `Recepción RF de alta sensibilidad en ${town} cubriendo fincas de gran extensión en ${prov}`,
    `Antenas en trípode homologado en ${town} con cableado coaxial de baja atenuación en ${prov}`,
    `Escaneo de espectro en ${town} para posicionar antenas en el lóbulo óptimo en ${prov}`,
    `Antenas compactas con preamplificador en ${town} para enlaces a larga distancia en ${prov}`,
    `Sistema de antena remota en ${town} que asegura enlace continuo tras paredes en ${prov}`,
    `Receptores inalámbricos en ${town} con conmutación digital a nivel de milisegundo en ${prov}`,
    `Antenas helicoidales de alta ganancia en ${town} para directos en pistas exteriores de ${prov}`,
    `Mástiles de recepción técnica en ${town} orientados al área de oradores de ${prov}`,
    `Distribución activa de señal RF en ${town} garantizando margen de señal sobre ruido en ${prov}`,
    `Antenas sintonizadas en ${town} para la banda UHF autorizada por telecomunicaciones en ${prov}`,
    `Receptores de doble sintonizador en ${town} con rechazo de multi-trayecto en ${prov}`,
    `Antenas de varilla reforzadas en ${town} para cabinas móviles y directos ágiles en ${prov}`,
    `Cobertura de radiofrecuencia en ${town} garantizada sin cortes a lo largo del recinto en ${prov}`
  ];

  const rfSpec3Pool = [
    `Ruteo digital por cable de red Dante hacia ${town} con latencia sub-milisegundo en ${prov}`,
    `Integración directa en red Dante para ${town} con audio digital a 24 bits y 48 kHz en ${prov}`,
    `Protocolo de red EtherCON para ${town} conectando receptores y mesa de mezclas en ${prov}`,
    `Conexión Dante primaria y secundaria hacia ${town} con redundancia física total en ${prov}`,
    `Transmisión de audio IP hacia ${town} libre de ruidos de inducción electromagnética en ${prov}`,
    `Ruteo multicanal Dante para ${town} con control de niveles desde software central en ${prov}`,
    `Enlace Gigabit de audio digital hacia ${town} evitando mangueras pesadas de cobre en ${prov}`,
    `Sincronización digital PTP en ${town} con precisión de microsegundos para directos de ${prov}`,
    `Matriz de conmutación Dante para ${town} con enrutamiento de canales en 1 clic en ${prov}`,
    `Conectividad de red blindada hacia ${town} con aislamiento galvánico de tierra en ${prov}`,
    `Protocolo Dante homologado para ${town} con compatibilidad AES67 entre equipos de ${prov}`,
    `Transmisión IP transparente hacia ${town} con cero compresión analógica en ${prov}`,
    `Red de audio profesional para ${town} con switches gestionados y QoS priorizado en ${prov}`,
    `Enlace de red dedicado hacia ${town} sin compartir tráfico con redes ajenas en ${prov}`,
    `Receptores Shure en red Dante para ${town} con monitorización de baterías por software en ${prov}`,
    `Cables de categoría 6 apantallados hacia ${town} con fundas de alta resistencia en ${prov}`,
    `Canales de audio digitalizados para ${town} con relación señal-ruido superior a 120 dB en ${prov}`,
    `Infraestructura Dante integrada para ${town} que agiliza el soundcheck del evento en ${prov}`,
    `Ruteo punto a punto sobre IP hacia ${town} con latencia inaudible para los asistentes en ${prov}`,
    `Distribución de audio en red hacia ${town} con envío simultáneo a PA y grabación en ${prov}`,
    `Conexión de red EtherCON estanca para ${town} protegiendo tomas frente a tirones en ${prov}`,
    `Topología de red redundante para ${town} garantizando continuidad si cae una línea en ${prov}`,
    `Monitoreo por software en tiempo real para ${town} con telemetría de espectro en ${prov}`,
    `Enrutamiento de microfonía por Dante hacia ${town} facilitando cambios en la escaleta en ${prov}`,
    `Plataforma de audio IP para ${town} con soporte oficial de Productora EAR en ${prov}`
  ];

  const rfSpec4Pool = [
    `Baterías de litio inteligentes Shure SB900 en ${town} con 11 horas de autonomía en ${prov}`,
    `Acumuladores recargables en ${town} con indicación de tiempo restante en minutos en ${prov}`,
    `Estación de carga rápida en ${town} con baterías de repuesto listas para tu fiesta en ${prov}`,
    `Alimentación por litio de alta densidad en ${town} asegurando cobertura de toda la velada en ${prov}`,
    `Baterías con circuito de protección térmica en ${town} garantizando cero interrupciones en ${prov}`,
    `Módulos de energía Shure en ${town} con recarga en baúl de transporte para el evento de ${prov}`,
    `Autonomía continua de 11 horas en ${town} sin necesidad de cambiar pilas en directo en ${prov}`,
    `Telemetría de batería en ${town} transmitida a la pantalla del receptor en cabina en ${prov}`,
    `Pilas recargables de litio para ${town} con cero efecto memoria y máxima durabilidad en ${prov}`,
    `Cargadores inteligentes en ${town} que monitorizan temperatura y ciclos de carga en ${prov}`,
    `Respaldo de baterías secundarias en ${town} preparadas para galas de larga duración en ${prov}`,
    `Baterías profesionales para micrófonos en ${town} con contactos dorados autolimpiables en ${prov}`,
    `Gestión energética optimizada en ${town} que extiende la duración durante los discursos en ${prov}`,
    `Acumuladores de litio para oradores en ${town} con indicador LED de estado de carga en ${prov}`,
    `Baterías inteligentes en ${town} que avisan en mesa cuando restan 60 minutos en ${prov}`,
    `Módulos de recarga múltiple en ${town} asegurando microfonía lista para cada orador en ${prov}`,
    `Alimentación de transmisores en ${town} con litio industrial resistente a descargas en ${prov}`,
    `Autonomía energética garantizada en ${town} para cubrir ceremonia, cóctel y banquete en ${prov}`,
    `Baterías ecológicas de ciclo largo en ${town} reemplazando pilas alcalinas desechables en ${prov}`,
    `Circuito de energía estable en ${town} que mantiene la potencia RF constante hasta el final en ${prov}`,
    `Baterías con bloqueo de extracción accidental en ${town} para tranquilidad del orador en ${prov}`,
    `Juegos completos de baterías cargadas en ${town} custodiados por el técnico in situ en ${prov}`,
    `Alimentación ininterrumpida de transmisores en ${town} probada en banco de test de ${prov}`,
    `Acumuladores Shure originales en ${town} con garantía de funcionamiento continuo en ${prov}`,
    `Reserva de energía en ${town} con baterías auxiliares de cambio rápido en cabina en ${prov}`
  ];

  const rfItem: LocalizedArsenalItem = {
    id: `rf-${slug}`,
    name: rfText.split(':')[0] || `Microfonía Shure ${town}`,
    category: 'Microfonía & RF',
    tagline: rfText,
    recommendedFor: pick(slug, 53, rfRecPool),
    priceDisplay: `Desde ${240 + (getHash(slug, 45) % 4) * 25} €`,
    priceNumeric: 240 + (getHash(slug, 45) % 4) * 25,
    specs: [
      pick(slug, 79, rfSpec1Pool),
      pick(slug, 80, rfSpec2Pool),
      pick(slug, 81, rfSpec3Pool),
      pick(slug, 82, rfSpec4Pool)
    ],
    badge: `RF BLINDADA ${town.toUpperCase()}`,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop'
  };

  // Optional item (25 variantes)
  const itemOptPool = [
    `Focos Wash LED Robe Robin en ${town}: mezcla de color RGBW y zoom en ${town} para iluminación perimetral en ${prov}.`,
    `Cabezas móviles Martin ERA 300 en ${town}: efectos de gobos y haces beam en ${town} para la pista de baile en ${prov}.`,
    `Consola de sonido digital Yamaha QL5 en ${town}: 64 canales con previo Rupert Neve en ${town} y pantalla táctil en ${prov}.`,
    `Escenario modular Layher homologado en ${town}: suelo fenólico antideslizante en ${town} con certificado de carga en ${prov}.`,
    `Guirnaldas festoon de microbombilla en ${town}: ambiente decorativo vintage de 2.700K en ${town} para jardines de ${prov}.`,
    `Focos a batería Chauvet Freedom Par en ${town}: iluminación sin cables en ${town} para claustros y murallas en ${prov}.`,
    `Mesa de mezclas Behringer WING en ${town}: enrutamiento de 48 canales en ${town} con emulaciones vintage en ${prov}.`,
    `Generador insonorizado Honda EU70is en ${town}: suministro ultrasilencioso de 7.000W en ${town} para exteriores de ${prov}.`,
    `Torres elevadoras VMB con bloqueo en ${town}: estructura visada en ${town} para volado de altavoces en ${prov}.`,
    `Tarimas escénicas Nivtec 2x1m en ${town}: montaje rápido con barandillas en ${town} para festejos y galas en ${prov}.`,
    `Focos Par LED Cameo Zenit W600 en ${town}: bañadores arquitectónicos con viseras en ${town} para fachadas de ${prov}.`,
    `Consola de sonido Allen & Heath SQ-5 en ${town}: procesado FPGA a 96 kHz en ${town} con 48 canales para directos en ${prov}.`,
    `Puente de trusses Prolyte H30V en ${town}: estructura volada para focos y pantallas en ${town} con factor de carga en ${prov}.`,
    `Máquina de humo denso Chauvet Nimbus en ${town}: efecto de nube baja con hielo seco en ${town} para bailes en ${prov}.`,
    `Cabezas móviles Clay Paky Sharpy en ${town}: haz concentrado de gran alcance en ${town} para espectáculos en ${prov}.`,
    `Cañón de seguimiento LED Robert Juliat en ${town}: haz regulable con operador en ${town} para destacar protagonistas en ${prov}.`,
    `Focos de recorte ETC Source Four en ${town}: proyección nítida de logotipos en ${town} y monogramas en ${prov}.`,
    `Mesa de luces Chamsys MagicQ en ${town}: control de escenas DMX complejas en ${town} sincronizadas con música en ${prov}.`,
    `Estructura ground support de 4 columnas en ${town}: pórtico autoportante en ${town} para pantallas gigantes en ${prov}.`,
    `Distribuidores de corriente CETAC 32A en ${town}: protecciones térmicas individuales en ${town} con voltímetros en ${prov}.`,
    `Básculas de celda de carga en ${town}: medición continua de peso en estructuras voladas en ${town} para seguridad en ${prov}.`,
    `Focos de batería Astera Titan Tube en ${town}: tubos inalámbricos con efectos de píxel mapping en ${town} para ${prov}.`,
    `Generador de efectos de chispas frías en ${town}: fuegos no pirotécnicos seguros en ${town} para interiores en ${prov}.`,
    `Consola de mezcla Soundcraft Si Impact en ${town}: grabación multitrack directa en ${town} para eventos de ${prov}.`,
    `Escaleras y rampas para escenario en ${town}: pasarelas homologadas con barandilla en ${town} conforme a normativa en ${prov}.`
  ];
  const optText = pick(slug, 13, itemOptPool);

  const optRecPool = [
    `Ambientación arquitectónica en ${town} y realce lumínico de fachadas históricas en ${prov}.`,
    `Zonas de barra libre en ${town} y pistas de baile nocturnas con efectos dinámicos en ${prov}.`,
    `Jardines históricos en ${town} y patios interiores que exigen iluminación cálida en ${prov}.`,
    `Estructuras escénicas voladas en ${town} con cálculo visado de carga estática en ${prov}.`,
    `Efectos visuales especiales en ${town} para el primer baile nupcial y momentos cumbre en ${prov}.`,
    `Claustros monumentales en ${town} iluminados con focos a batería sin cables por el suelo en ${prov}.`,
    `Escenarios para directos en ${town} con puentes de truss homologados y focos robotizados en ${prov}.`,
    `Cenas de gala en ${town} con iluminación cenital suave y regulable sobre mesas en ${prov}.`,
    `Pasarelas de moda en ${town} con candilejas y focos de recorte de temperatura neutra en ${prov}.`,
    `Inauguraciones comerciales en ${town} con cañones de luz hacia el cielo y haces beam en ${prov}.`,
    `Fincas rústicas en ${town} decoradas con guirnaldas microbombilla de estilo vintage en ${prov}.`,
    `Festivales al aire libre en ${town} con torres elevadoras de seguridad y focos wash en ${prov}.`,
    `Recepciones oficiales en ${town} con baños de color corporativo en columnas y paredes en ${prov}.`,
    `Atriles presidenciales en ${town} iluminados sin sombras para fotografía y vídeo en ${prov}.`,
    `Presentaciones de vehículos en ${town} con perfiles de luz blanca fría resaltando líneas en ${prov}.`,
    `Bodas civiles en ${town} con pasillos de luz tenue y arcos iluminados para ceremonias en ${prov}.`,
    `Plazas mayores en ${town} con iluminación escenográfica potente para conciertos en ${prov}.`,
    `Fiestas temáticas en ${town} con efectos de luz negra ultravioleta y máquinas de humo en ${prov}.`,
    `Salones de hotel en ${town} transformados en ambientes de club mediante focos beam en ${prov}.`,
    `Terrazas de cóctel en ${town} con bañadores LED suaves que acompañan la puesta de sol en ${prov}.`,
    `Galas benéficas en ${town} con gobos personalizados proyectando el emblema en muros de ${prov}.`,
    `Espacios industriales en ${town} convertidos en recintos de eventos mediante focos LED en ${prov}.`,
    `Carapas nupciales en ${town} con cortinas de microled y arañas colgantes iluminadas en ${prov}.`,
    `Congresos profesionales en ${town} con tarimas escénicas iluminadas con foco cenital en ${prov}.`,
    `Veladas de gala en ${town} con efectos de chispas frías y humo bajo para el brindis en ${prov}.`
  ];

  const optSpec1Pool = [
    `Control inalámbrico W-DMX en ${town} evitando tendidos aéreos de cables en ${prov}`,
    `Transmisión DMX inalámbrica en ${town} con salto de frecuencia automático en ${prov}`,
    `Protocolo Wireless DMX en ${town} con enlace blindado inmune a saturación wifi en ${prov}`,
    `Mesa de control de luces en ${town} gestionando escenas mediante antenas W-DMX en ${prov}`,
    `Receptores W-DMX integrados en ${town} en cada foco para posicionamiento libre en ${prov}`,
    `Control lumínico remoto en ${town} con alcance de 200 metros por radiofrecuencia en ${prov}`,
    `Enlace DMX sin cables en ${town} que preserva la estética del recinto sin canaletas en ${prov}`,
    `Sincronización inalámbrica en ${town} entre mesa de luces y focos a batería en ${prov}`,
    `Emisor W-DMX sueco en ${town} garantizando respuesta inmediata de escenas en ${prov}`,
    `Ruteo DMX sin cables para ${town} con codificación digital libre de retardos en ${prov}`,
    `Transmisor de iluminación en ${town} operando en banda de 2.4 GHz segura en ${prov}`,
    `Control lumínico inalámbrico en ${town} que agiliza cambios de posición durante la gala de ${prov}`,
    `Antenas DMX directivas en ${town} asegurando enlace a través de vegetación en ${prov}`,
    `Módulos inalámbricos W-DMX en ${town} con protocolo G5 de última generación en ${prov}`,
    `Gestión de focos por radio en ${town} permitiendo iluminar árboles distantes en ${prov}`,
    `Control inalámbrico de robótica en ${town} con movimientos suaves y coordinados en ${prov}`,
    `Enlace DMX sin tendidos para ${town} facilitando el paso despejado de invitados en ${prov}`,
    `Sincronía de color inalámbrica en ${town} cambiando atmósferas con un solo toque en ${prov}`,
    `Protocolo W-DMX certificado en ${town} conforme a directiva europea de radio en ${prov}`,
    `Mando de iluminación inalámbrico en ${town} para que el técnico module luz desde pista en ${prov}`,
    `Control por radiofrecuencia DMX en ${town} con cero cables por zonas de tránsito en ${prov}`,
    `Transmisión inalámbrica de datos lumínicos en ${town} con respaldo por cable si se precisa en ${prov}`,
    `Recepción W-DMX estanca en ${town} permitiendo ubicar focos bajo lluvia ligera en ${prov}`,
    `Sistema inalámbrico de luces en ${town} con batería interna para total independencia en ${prov}`,
    `Control lumínico por W-DMX en ${town} asegurando rapidez de montaje y discreción en ${prov}`
  ];

  const optSpec2Pool = [
    `Conectores estancos Neutrik PowerCON True1 en ${town} con bloqueo de seguridad en ${prov}`,
    `Conexiones de corriente estancas IP65 en ${town} que impiden desconexiones por tirones en ${prov}`,
    `Tomas PowerCON True1 blindadas en ${town} aptas para conectar bajo carga en ${prov}`,
    `Tendido de iluminación en ${town} con cableado de goma vulcanizada H07RN-F en ${prov}`,
    `Conectores profesionales con cierre de bayoneta en ${town} para suministro seguro en ${prov}`,
    `Bases PowerCON estancas en ${town} que protegen los focos frente al rocío nocturno en ${prov}`,
    `Mangueras de interconexión eléctrica en ${town} con conectores certificados Neutrik en ${prov}`,
    `Conexionado con sellado estanco en ${town} conforme a directiva de intemperie en ${prov}`,
    `Tomas de corriente robustas en ${town} que evitan cortocircuitos por humedad en ${prov}`,
    `Enchufes industriales con protección térmica en ${town} para focos de gran potencia en ${prov}`,
    `Conectores PowerCON True1 de alta resistencia en ${town} para escenarios de ${prov}`,
    `Tiradas de alimentación con clavijas estancas en ${town} distribuidas por el jardín de ${prov}`,
    `Bases de corriente con enclavamiento en ${town} que aseguran servicio continuo en ${prov}`,
    `Conexiones eléctricas herméticas en ${town} certificadas para uso público en ${prov}`,
    `Mangueras ignífugas con PowerCON en ${town} protegiendo cada foco perimetral en ${prov}`,
    `Conectores Neutrik True1 para ${town} diseñados para resistir pisadas accidentales en ${prov}`,
    `Tomas estancas de alimentación en ${town} que garantizan cero saltos de diferencial en ${prov}`,
    `Conexionado modular encadenable en ${town} con tomas de entrada y salida seguras en ${prov}`,
    `Cables de distribución eléctrica en ${town} con terminales prensados y sellados en ${prov}`,
    `Conectores con junta tórica estanca en ${town} para iluminación arquitectónica en ${prov}`,
    `Bases industriales de corriente en ${town} aisladas de zonas húmedas del terreno en ${prov}`,
    `Tomas True1 autorizadas en ${town} para desconexión rápida si fuera requerido en ${prov}`,
    `Conexionado eléctrico estanco para ${town} con cables libres de halógenos en ${prov}`,
    `Clavijas profesionales PowerCON en ${town} con carcasa termoplástica irrompible en ${prov}`,
    `Conectores de red eléctrica en ${town} verificados con comprobador de tensión en ${prov}`
  ];

  const optSpec3Pool = [
    `Distribución eléctrica con diferencial de 30 mA en ${town} y protección magnetotérmica en ${prov}`,
    `Cuadro de acometida con disyuntores individuales en ${town} para cada fase en ${prov}`,
    `Protección térmica calibrada en ${town} para evitar sobrecargas en la instalación de ${prov}`,
    `Líneas de corriente independientes en ${town} separando iluminación de la red de sonido en ${prov}`,
    `Distribuidor CETAC 32A en ${town} con voltímetros digitales supervisando fases en ${prov}`,
    `Acometida con diferencial supersensibilizado en ${town} protegiendo a los asistentes en ${prov}`,
    `Cuadro de distribución portátil en ${town} con tomas Schuko y CETAC protegidas en ${prov}`,
    `Protección diferencial de 30 mA clase A en ${town} inmune a parásitos de fuentes conmutadas en ${prov}`,
    `Reparto equilibrado de cargas en ${town} entre las tres fases de la finca de ${prov}`,
    `Disyuntores magnetotérmicos de curva C en ${town} soportando el arranque de focos en ${prov}`,
    `Cuadro eléctrico de seguridad en ${town} con parada de emergencia tipo seta en ${prov}`,
    `Líneas eléctricas con conductor de tierra física en ${town} verificadas antes de la gala en ${prov}`,
    `Protección individual por canal en ${town} asegurando que un fallo no apague el resto en ${prov}`,
    `Distribuidor de baja tensión en ${town} con envolvente de goma aislante antichoque en ${prov}`,
    `Acometida eléctrica profesional en ${town} coordinada con los técnicos del espacio en ${prov}`,
    `Protecciones térmicas dimensionadas en ${town} para consumo continuo durante toda la noche en ${prov}`,
    `Cuadro con diferencial regulable en ${town} adaptado a la selectividad de la finca en ${prov}`,
    `Distribución con pasacables de goma en ${town} protegiendo líneas frente a vehículos en ${prov}`,
    `Instalación eléctrica certificada en ${town} con informe de mediciones previas en ${prov}`,
    `Control de consumo en amperios en ${town} visualizado en display digital en ${prov}`,
    `Protección magneto-diferencial en ${town} en cada una de las líneas de luces de ${prov}`,
    `Cuadro con interruptor de corte general en ${town} accesible al operador en cabina en ${prov}`,
    `Distribuidor eléctrico homologado en ${town} conforme al Reglamento Electrotécnico de ${prov}`,
    `Líneas con fusibles rápidos de protección en ${town} resguardando electrónica sensible en ${prov}`,
    `Instalación con doble aislamiento en ${town} garantizando máxima seguridad en ${prov}`
  ];

  const optSpec4Pool = [
    `Estructura visada en ${town} conforme a directiva técnica de espectáculos públicos en ${prov}`,
    `Montaje de truss certificado en ${town} con cálculo de cargas estáticas y dinámicas en ${prov}`,
    `Torres elevadoras con bloqueo mecánico en ${town} homologadas por el colegio de ingenieros en ${prov}`,
    `Eslingas de acero de seguridad en ${town} duplicadas en cada foco suspendido en ${prov}`,
    `Certificación de solidez estructural en ${town} firmada para eventos multitudinarios en ${prov}`,
    `Trusses de aluminio extrusionado en ${town} con certificados de prueba de carga en ${prov}`,
    `Protocolo de seguridad laboral en ${town} con arneses y líneas de vida en montaje en ${prov}`,
    `Estructura escénica con coeficientes de seguridad en ${town} superando directivas de ${prov}`,
    `Inspección técnica visual en ${town} de pasadores y bulones antes de elevar cargas en ${prov}`,
    `Tarimas escénicas Nivtec en ${town} con capacidad de carga de 750 kg/m² visada en ${prov}`,
    `Anclajes de seguridad certificados en ${town} lastrados con dados de hormigón en ${prov}`,
    `Montaje conforme a normativa europea EN 13782 en ${town} para estructuras temporales en ${prov}`,
    `Doble cable de retención de acero en ${town} en todos los elementos volados sobre cabezas en ${prov}`,
    `Plan de montaje y desmontaje seguro en ${town} registrado para el evento de ${prov}`,
    `Estructura de ground support en ${town} con frenos mecánicos redundantes en ${prov}`,
    `Certificado de ignifugación de lonas en ${town} y telas escénicas M1 en ${prov}`,
    `Torres de elevación con nivelación milimétrica en ${town} sobre patas extensibles en ${prov}`,
    `Memoria técnica visada para ${town} disponible para inspecciones municipales de ${prov}`,
    `Sistemas de bloqueo de caída libre en ${town} integrados en los cabrestantes de ${prov}`,
    `Supervisión por técnico de prevención en ${town} durante izado de focos en ${prov}`,
    `Cálculo de empuje del viento en ${town} para puentes de luces instalados en exteriores de ${prov}`,
    `Barandillas perimetrales homologadas en ${town} para tarimas con altura superior a 50 cm en ${prov}`,
    `Seguro de responsabilidad civil de 1.000.000 € cubriendo el montaje en ${town} (${prov})`,
    `Verificación de pares de apriete en ${town} con llave dinamométrica en uniones en ${prov}`,
    `Certificado de fin de montaje en ${town} extendido por el responsable técnico en ${prov}`
  ];

  const fourthItem: LocalizedArsenalItem = {
    id: `opt-${slug}`,
    name: optText.split(':')[0] || `Iluminación & Estructuras ${town}`,
    category: 'Iluminación & Estructuras',
    tagline: optText,
    recommendedFor: pick(slug, 54, optRecPool),
    priceDisplay: `Desde ${260 + (getHash(slug, 46) % 4) * 20} €`,
    priceNumeric: 260 + (getHash(slug, 46) % 4) * 20,
    specs: [
      pick(slug, 83, optSpec1Pool),
      pick(slug, 84, optSpec2Pool),
      pick(slug, 85, optSpec3Pool),
      pick(slug, 86, optSpec4Pool)
    ],
    badge: `HOMOLOGADO ${town.toUpperCase()}`,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'
  };

  return [audioItem, ledItem, rfItem, fourthItem];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERADOR COMBINATORIO DE FAQS (SLOT-BASED SYNTHESIS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function buildLocalizedFaqs(
  slug: string,
  townName: string,
  provinceName: string,
  archetype: PopulationArchetype,
  highway: string,
  maxDbLimit: number,
  recommendedVehicle: string,
  distanceKm: number,
  transitMinutes: number,
  watts: number,
  pax: number
): LocalizedFAQ[] {
  const town = townName;
  const prov = provinceName;
  const km = distanceKm;
  const min = transitMinutes;
  const db = maxDbLimit;

  // Q1 & A1 (Logística)
  const q1Pool = [
    `¿Cómo se organiza el transporte y la entrega técnica hasta ${town}?`,
    `¿Cuál es el itinerario y los tiempos de llegada previstos hacia ${town}?`,
    `¿De qué manera arriba el convoy técnico de Productora EAR a ${town}?`,
    `¿Cómo se coordina el despacho logístico de equipos hacia ${town}?`,
    `¿Qué margen de horario se planifica para la descarga en ${town}?`,
    `¿Cómo accede el furgón de material a los recintos de ${town}?`,
    `¿Qué ruta por autovía sigue el vehículo asignado a ${town}?`,
    `¿Cómo se garantiza la puntualidad del transporte hacia ${town}?`,
    `¿Qué vehículo y equipo humano realiza el traslado hasta ${town}?`,
    `¿Cómo se gestiona el flete de pantallas y sonido hacia ${town}?`,
    `¿Con cuánta antelación se posiciona el material técnico en ${town}?`,
    `¿Cómo se protege la carga durante el trayecto por carretera a ${town}?`,
    `¿Cuál es el protocolo de llegada y montaje en el espacio de ${town}?`,
    `¿Cómo se cubre el trayecto directo desde la central hasta ${town}?`,
    `¿Qué previsiones de tráfico se calculan para el flete a ${town}?`,
    `¿Cómo se realiza la descarga técnica en fincas y recintos de ${town}?`,
    `¿Quién conduce y supervisa el convoy audiovisual con destino a ${town}?`,
    `¿Cómo se gestiona el acceso rodado para el montaje en ${town}?`,
    `¿Qué tiempos de tránsito se estiman por autovía hacia ${town}?`,
    `¿Cómo se coordinan las entregas de sonido y pantallas en ${town}?`,
    `¿Qué medidas de seguridad vial se aplican en la ruta a ${town}?`,
    `¿Cómo se programa el viaje técnico para estar a tiempo en ${town}?`,
    `¿Qué operativa de flete directo se activa para tu evento en ${town}?`,
    `¿Cómo se asegura una llegada sin demoras a las fincas de ${town}?`,
    `¿Cuál es el procedimiento de transporte propio hacia ${town}?`
  ];
  const q1 = pick(slug, 61, q1Pool);

  const faqTransPool = [
    `Transporte a ${town}: Despachamos un ${recommendedVehicle} que recorre ${km} km por la ${highway} en ${min} minutos hasta ${town}.`,
    `Itinerario hacia ${town}: El traslado directo desde centralita cubre ${km} km por la ${highway} en ${min} minutos a ${town}.`,
    `Desplazamiento a ${town}: Fletamos un ${recommendedVehicle} que enlaza por la autovía ${highway} en ${min} minutos hacia ${town}.`,
    `Logística hacia ${town}: El material arriba con margen tras recorrer ${km} km por la ${highway} en vehículo hacia ${town}.`,
    `Descarga en ${town}: Accedemos a la zona técnica del espacio tras un viaje de ${min} minutos por la ${highway} a ${town}.`,
    `Ruta de entrega en ${town}: Cubrimos los ${km} km por la ${highway} con seguimiento GPS continuo hasta la llegada a ${town}.`,
    `Puntualidad en ${town}: El convoy técnico sale con tiempo para completar ${km} km por la ${highway} en ${min} minutos a ${town}.`,
    `Flota hacia ${town}: Empleamos un ${recommendedVehicle} adaptado para recorrer ${km} km por la ${highway} con seguridad a ${town}.`,
    `Acceso a ${town}: Planificamos la descarga previa en el recinto tras viajar ${min} minutos por la ${highway} hacia ${town}.`,
    `Conducción a ${town}: Nuestro chófer profesional cubre ${km} km por la vía ${highway} respetando horarios de montaje en ${town}.`,
    `Flete de equipos para ${town}: El vehículo acondicionado arriba en ${min} minutos circulando por la ${highway} para descargar en ${town}.`,
    `Horarios de llegada en ${town}: Posicionamos los equipos con antelación tras recorrer ${km} km por la ${highway} hacia ${town}.`,
    `Vehículo asignado a ${town}: Desplazamos nuestro ${recommendedVehicle} que enlaza por la ${highway} en ${min} minutos con ${town}.`,
    `Seguridad en ruta hacia ${town}: La carga viaja con seguro a todo riesgo durante los ${km} km por la ${highway} a ${town}.`,
    `Tiempo de tránsito para ${town}: Estimamos ${min} minutos de conducción por la ${highway} para cubrir ${km} km sin demoras a ${town}.`,
    `Protocolo de viaje a ${town}: El chófer sigue la autovía ${highway} garantizando que el material llegue protegido a ${town}.`,
    `Operativa logística en ${town}: La entrega se realiza sin transbordos desde Méntrida cubriendo ${km} km por la ${highway} a ${town}.`,
    `Descarga técnica en ${town}: El furgón accede a la zona autorizada tras recorrer ${km} km por la ${highway} hacia ${town}.`,
    `Margen de montaje en ${town}: Salimos con tiempo extra para cubrir los ${km} km por la ${highway} en ${min} minutos a ${town}.`,
    `Itinerario rápido hacia ${town}: La autovía ${highway} nos permite conectar los ${km} km de distancia en ${min} minutos a ${town}.`,
    `Entrega garantizada en ${town}: Coordinamos el despacho de material por la ${highway} para arribar en ${min} minutos a ${town}.`,
    `Seguimiento del convoy a ${town}: Puedes consultar la posición del vehículo durante los ${km} km de ruta por la ${highway} a ${town}.`,
    `Transporte directo para ${town}: El ${recommendedVehicle} viaja en exclusiva para tu evento cubriendo ${km} km por la ${highway} a ${town}.`,
    `Descarga protegida en ${town}: El material se introduce con ruedas antihuella tras viajar ${min} minutos por la ${highway} a ${town}.`,
    `Puntualidad técnica hacia ${town}: Aseguramos que la dotación esté en el espacio recorriendo ${km} km por la ${highway} a ${town}.`
  ];
  const a1 = pick(slug, 14, faqTransPool);

  // Q2 & A2 (Acústica)
  const q2Pool = [
    `¿Cómo se calibra la potencia sonora y el límite de decibelios en ${town}?`,
    `¿Qué ajuste acústico se aplica para cumplir normativas de ruidos en ${town}?`,
    `¿Cómo garantizan que los ${watts} W se escuchen nítidos sin quejas en ${town}?`,
    `¿Qué control sonométrico in situ protege el evento en ${town}?`,
    `¿Cómo se regula el volumen musical para no exceder los ${db} dB en ${town}?`,
    `¿De qué forma se distribuye la presión sonora para ${pax} comensales en ${town}?`,
    `¿Qué protocolo de ecualización y fase se realiza en la sala de ${town}?`,
    `¿Cómo se orientan los altavoces para contener el sonido dentro de ${town}?`,
    `¿Qué limitador homologado se programa en la mesa de mezclas en ${town}?`,
    `¿Cómo se evita la fatiga auditiva de los asistentes durante la gala en ${town}?`,
    `¿Qué mediciones sonométricas en fachada se realizan en ${town}?`,
    `¿Cómo se consigue pegada en la pista de baile respetando el descanso en ${town}?`,
    `¿Qué tecnología DSP se utiliza para recortar frecuencias molestas en ${town}?`,
    `¿Cómo se comprueba que el nivel de audio no rebase ${db} dB en ${town}?`,
    `¿Qué ajuste de graves cardioides se instala en el recinto de ${town}?`,
    `¿Cómo se asegura que las voces y discursos lleguen claros en ${town}?`,
    `¿Qué certificación técnica acústica acompaña el montaje en ${town}?`,
    `¿Cómo se modula el sonido al entrar en la franja horaria nocturna en ${town}?`,
    `¿Qué analizador RTA se emplea para afinar los altavoces en ${town}?`,
    `¿Cómo se controla la reverberación en salones con techos altos en ${town}?`,
    `¿Qué margen de decibelios se programa en el procesador de ${town}?`,
    `¿Cómo se calibra el tiro sonoro para cubrir exactamente a ${pax} personas en ${town}?`,
    `¿Qué supervisión continua del volumen ejerce el técnico en ${town}?`,
    `¿Cómo se previene cualquier sanción administrativa por ruidos en ${town}?`,
    `¿De qué manera se logra un sonido envolvente y elegante en ${town}?`
  ];
  const q2 = pick(slug, 62, q2Pool);

  const faqSoundPool = [
    `Control acústico en ${town}: Dimensionamos ${watts} W para ${pax} personas limitando la salida a ${db} dB en ${town} (${prov}).`,
    `Potencia y ruidos en ${town}: Calibramos ${watts} vatios de sonido orientable ajustando el techo a ${db} dB en ${town}.`,
    `Decibelios en ${town}: El limitador digital frena el volumen en ${db} dB mientras los ${watts} W aseguran pegada en ${town}.`,
    `Ajuste sonométrico en ${town}: Verificamos que los ${watts} vatios repartidos entre ${pax} comensales no rebasen ${db} dB en ${town}.`,
    `Normativa de sonido en ${town}: Suministramos ${watts} W regulados electrónicamente bajo la cota oficial de ${db} dB en ${town}.`,
    `Presión sonora en ${town}: El aforo de ${pax} asistentes disfruta de ${watts} vatios claros contenidos en ${db} dB en ${town}.`,
    `Calibración RTA en ${town}: Alineamos los ${watts} W de los altavoces de forma que la medición en ${town} se mantenga bajo ${db} dB.`,
    `Emisión musical en ${town}: La dinámica de ${watts} vatios opera con limitador automático que protege el descanso a ${db} dB en ${town}.`,
    `Cobertura en decibelios para ${town}: Garantizamos inteligibilidad vocal con ${watts} W respetando el marco de ${db} dB en ${town}.`,
    `Protección sonométrica en ${town}: El técnico monitoriza la salida de ${watts} vatios para salvaguardar el límite de ${db} dB en ${town}.`,
    `Ajuste de volumen en ${town}: El sistema reparte ${watts} W de presión homogénea conteniendo los picos en ${db} dB en ${town}.`,
    `Respeto vecinal en ${town}: Configuramos subgraves para proyectar ${watts} vatios al centro sin superar ${db} dB en fachada en ${town}.`,
    `Límite de decibelios para ${town}: La mesa digital incorpora limitador visado que bloquea la salida al llegar a ${db} dB en ${town}.`,
    `Equilibrio acústico en ${town}: La potencia de ${watts} W cubre a los ${pax} comensales con sonido limpio acotado a ${db} dB en ${town}.`,
    `Medición en linde de ${town}: Realizamos un test previo con sonómetro integrador confirmando lecturas menores a ${db} dB en ${town}.`,
    `Salida sónica para ${town}: Los ${watts} vatios entregan gran pegada rítmica sin quebrantar los ${db} dB legales en ${town}.`,
    `Certificado acústico en ${town}: El montaje se acompaña de memoria técnica que acredita el respeto al tope de ${db} dB en ${town}.`,
    `Dinámica musical en ${town}: Conseguimos máxima presencia de voz con ${watts} W manteniendo la presión bajo ${db} dB en ${town}.`,
    `Atenuación nocturna en ${town}: Al entrar en franja de descanso nocturno, el técnico ajusta los filtros a ${db} dB en ${town}.`,
    `Presión en pista de ${town}: Diseñamos un tiro corto con ${watts} vatios que concentra energía sin rebasar ${db} dB en ${town}.`,
    `Cumplimiento de ordenanza en ${town}: La dotación de ${watts} W opera con limitador homologado para no sobrepasar ${db} dB en ${town}.`,
    `Frecuencias graves en ${town}: Alineamos los retardos para evitar cancelaciones entregando ${watts} vatios acotados a ${db} dB en ${town}.`,
    `Potencia auditiva en ${town}: Suministramos ${watts} W RMS para ${pax} personas supervisando en sonómetro ${db} dB en ${town}.`,
    `Claridad sonora para ${town}: El procesador DSP ecualiza en tiempo real los ${watts} vatios respetando ${db} dB en ${town}.`,
    `Control de decibelios en ${town}: La tranquilidad de la finca se apoya en un límite automático de ${db} dB para ${watts} W en ${town}.`
  ];
  const a2 = pick(slug, 15, faqSoundPool);

  // Q3 & A3 (Electricidad)
  const q3Pool = [
    `¿Qué requisitos de acometida eléctrica demandan pantallas y sonido en ${town}?`,
    `¿Puede operar la instalación técnica con enchufes convencionales en ${town}?`,
    `¿Cómo se distribuyen las líneas de corriente en los espacios de ${town}?`,
    `¿Qué protecciones con diferencial y magnetotérmico se usan en ${town}?`,
    `¿Cuánta potencia en vatios consume el montaje completo en ${town}?`,
    `¿Cómo se evitan sobrecargas en el cuadro eléctrico de la finca en ${town}?`,
    `¿Qué tomas industriales CETAC o Schuko se necesitan en ${town}?`,
    `¿Cómo se aísla la corriente del sonido de la iluminación en ${town}?`,
    `¿Qué estabilidad ante caídas de tensión garantizan las fuentes en ${town}?`,
    `¿Cómo se canalizan los cables de alimentación en las zonas de paso de ${town}?`,
    `¿Qué comprobaciones de toma de tierra realiza el instalador en ${town}?`,
    `¿Cómo opera el equipamiento si la finca tiene poca potencia en ${town}?`,
    `¿Qué cuadros de distribución propios aporta Productora EAR en ${town}?`,
    `¿Cómo se protege el tendido eléctrico frente a rocío nocturno en ${town}?`,
    `¿Qué consumo eléctrico eficiente consiguen las etapas Clase D en ${town}?`,
    `¿Cómo se reparten las cargas en tres fases en recintos de ${town}?`,
    `¿Qué filtros de red absorben microcortes eléctricos en ${town}?`,
    `¿Cómo se instalan los pasacables de seguridad para peatones en ${town}?`,
    `¿Qué tipo de mangueras ignífugas se tienden hasta el escenario de ${town}?`,
    `¿Cómo se previene cualquier zumbido de masa en los altavoces de ${town}?`,
    `¿Qué protecciones térmicas individuales lleva cada línea en ${town}?`,
    `¿Cómo se alimenta la pantalla LED sin interferir en el audio de ${town}?`,
    `¿Qué conectores PowerCON estancos se emplean para los directos en ${town}?`,
    `¿Cómo se revisa el voltaje fase-neutro antes de encender los equipos en ${town}?`,
    `¿De qué forma se garantiza un suministro energético continuo en ${town}?`
  ];
  const q3 = pick(slug, 63, q3Pool);

  const faqElecPool = [
    `Conexión eléctrica en ${town}: Operamos con cuadros trifásicos CETAC o tomas Schuko protegidas por diferencial en ${town} (${prov}).`,
    `Requisitos energéticos en ${town}: Los equipos de bajo consumo requieren en ${town} dos líneas independientes de 16A con tierra.`,
    `Protección de corriente en ${town}: Instalamos cuadros de acometida con magnetotérmicos en ${town} que evitan sobrecargas en la red.`,
    `Suministro eléctrico en ${town}: Las fuentes con PFC garantizan estabilidad en ${town} ante oscilaciones de voltaje en ${prov}.`,
    `Acometida en ${town}: Adaptamos el conexionado tanto a tomas de 32A como a enchufes de 230V con seguridad en ${town}.`,
    `Distribución de fases en ${town}: Separamos la alimentación de sonido de la iluminación para eliminar ruidos en ${town}.`,
    `Potencia demandada en ${town}: La tecnología LED y amplificación Clase D consume hasta 50% menos electricidad en ${town}.`,
    `Seguridad eléctrica en ${town}: Cada línea dispone en ${town} de diferencial calibrado de 30 mA para protección de asistentes.`,
    `Tendido energético en ${town}: Las mangueras de corriente se canalizan por pasos protegidos en ${town} conforme a directiva.`,
    `Tensión estable en ${town}: Nuestros filtros de red absorben microcortes en ${town} asegurando funcionamiento continuo en ${prov}.`,
    `Consumo eléctrico en ${town}: Un montaje medio requiere apenas 3.500 vatios en ${town} gracias a etapas de alta eficiencia.`,
    `Cuadro de distribución para ${town}: Aportamos distribuidor propio en ${town} con diferencial y tomas auxiliares para el evento.`,
    `Toma de tierra en ${town}: Comprobamos la resistencia de tierra del recinto para garantizar cero zumbidos en ${town} (${prov}).`,
    `Alimentación de pantallas en ${town}: Los lienzos led se alimentan por líneas directas en ${town} con protección de sobretensión.`,
    `Conectores homologados en ${town}: Empleamos tomas PowerCON True1 estancas en ${town} que impiden desconexiones accidentales.`,
    `Estabilidad energética en ${town}: Las fuentes conmutadas en ${town} soportan oscilaciones sin alterar la salida de sonido en ${prov}.`,
    `Líneas independientes en ${town}: Canalizamos el alumbrado decorativo por fase separada en ${town} del rack de sonido profesional.`,
    `Enchufes disponibles en ${town}: Nos adaptamos a cualquier instalación existente en ${town} usando adaptadores cetac y bases schuko.`,
    `Seguridad para comensales en ${town}: Las acometidas se protegen en ${town} con envolventes aislantes y canaletas de suelo.`,
    `Revisión previa en ${town}: El instalador mide voltajes fase-neutro en ${town} antes de energizar los procesadores acústicos.`,
    `Protección térmica en ${town}: Los cuadros cuentan con disyuntores en ${town} que soportan el pico de encendido de pantallas.`,
    `Compatibilidad en ${town}: Si el recinto en ${town} tiene poca potencia contratada, modulamos la demanda de luz sin disparar el ICP.`,
    `Líneas de audio limpias en ${town}: El aislamiento galvánico de cajas DI en ${town} evita bucles de masa con tomas lejanas.`,
    `Distribución trifásica en ${town}: Para montajes mayores repartimos el consumo en tomas CETAC 32A de cinco polos en ${town}.`,
    `Alimentación ininterrumpida en ${town}: Disponemos de sistemas SAI auxiliares en ${town} para la mesa digital y microfonía.`
  ];
  const a3 = pick(slug, 16, faqElecPool);

  // Q4 & A4 (Reserva y Fianza)
  const q4Pool = [
    `¿Cómo se asegura la reserva oficial y el precio cerrado para ${town}?`,
    `¿Cuál es el procedimiento de fianza y bloqueo en calendario para ${town}?`,
    `¿Qué garantías contractuales aporta el depósito de 100 euros en ${town}?`,
    `¿Cómo se formaliza la contratación del Arsenal Audiovisual en ${town}?`,
    `¿Qué protección Price-Lock congela las tarifas pactadas para ${town}?`,
    `¿Cómo se deduce la señal de 100 € del presupuesto total de ${town}?`,
    `¿Qué comprobante criptográfico SHA-256 se genera al reservar en ${town}?`,
    `¿Cómo se asegura que no doblen la fecha de tu evento en ${town}?`,
    `¿Qué pasos online se siguen para confirmar el alquiler técnico en ${town}?`,
    `¿Con cuánta rapidez queda validada la fianza con tarjeta para ${town}?`,
    `¿Cómo se asigna el técnico de cabina tras formalizar la fianza en ${town}?`,
    `¿Qué condiciones de cancelación protegen tu depósito de reserva en ${town}?`,
    `¿Cómo se ratifica el contrato mercantil de servicios técnicos en ${town}?`,
    `¿Qué validez legal tiene la confirmación digital de fianza en ${town}?`,
    `¿Cómo se aparta el material con números de serie en almacén para ${town}?`,
    `¿Qué factura proforma con desglose de IVA se emite al reservar en ${town}?`,
    `¿Cómo se garantiza que no existan costes imprevistos de transporte en ${town}?`,
    `¿Qué seguridad bancaria ofrece la pasarela Stripe para tu fianza en ${town}?`,
    `¿Cómo se liquida el importe restante del alquiler pactado en ${town}?`,
    `¿Qué plazo de congelación de tarifa se aplica antes de abonar la señal en ${town}?`,
    `¿Cómo se acredita la exclusividad de fecha para tu celebración en ${town}?`,
    `¿Qué soporte telefónico directo acompaña la contratación en ${town}?`,
    `¿Cómo se confirman los datos de acceso y horarios de descarga en ${town}?`,
    `¿Qué ventajas aporta formalizar la fianza con suficiente antelación en ${town}?`,
    `¿De qué forma queda blindada la llegada de los equipos a tu fiesta en ${town}?`
  ];
  const q4 = pick(slug, 64, q4Pool);

  const faqLockPool = [
    `Reserva y fianza para ${town}: Abonando 100 euros en Stripe se bloquea la fecha con precio cerrado y SHA-256 en ${town}.`,
    `Procedimiento de contratación en ${town}: El depósito de 100 euros congela el inventario en ${town} y se descuenta del total.`,
    `Garantía de fecha en ${town}: Formalizas la reserva oficial con 100 € de señal en pasarela segura con Price-Lock en ${town}.`,
    `Bloqueo de presupuesto para ${town}: El pago de 100 euros de fianza garantiza en ${town} que no existan sobrecostes imprevistos.`,
    `Compromiso de servicio en ${town}: El abono de 100 € en Stripe activa reserva de equipos en ${town} y asigna técnico de cabina.`,
    `Confirmación inmediata en ${town}: Recibes tu contrato oficial con identificador único tras abonar 100 euros de fianza para ${town}.`,
    `Seguridad de reserva en ${town}: Protegemos tu celebración en ${town} sellando la fecha en calendario tras el pago de 100 €.`,
    `Depósito de reserva para ${town}: La fianza de 100 euros en Stripe asegura en ${town} la disponibilidad del Arsenal Audiovisual.`,
    `Contrato digital en ${town}: La contratación se completa en ${town} al formalizar 100 € de señal congelando tarifas aprobadas.`,
    `Tranquilidad contractual en ${town}: El depósito de 100 euros garantiza en ${town} la presencia técnica y material en exclusiva.`,
    `Fianza de seguridad para ${town}: Con solo 100 euros de fianza bloqueas el material y garantizas la tarifa para ${town}.`,
    `Reserva en firme para ${town}: El pago seguro de 100 € activa la orden de transporte en ${town} y reserva equipo en sistema.`,
    `Congelación de tarifas en ${town}: Aseguramos que el precio no varíe tras formalizar el depósito de 100 euros para ${town}.`,
    `Bloqueo de calendario en ${town}: Tus fechas quedan blindadas en ${town} mediante 100 € de señal que generan justificante oficial.`,
    `Liquidación transparente para ${town}: Los 100 euros de depósito se restan del importe facturado con 21% de IVA en ${town}.`,
    `Reserva con tarjeta en ${town}: Abonando 100 euros en nuestra web proteges el día de tu evento en ${town} con certificado oficial.`,
    `Garantía Price-Lock en ${town}: Respaldamos tu presupuesto en ${town} con señal de 100 € que impide revisiones de precio por fecha.`,
    `Disponibilidad técnica para ${town}: La fianza de 100 euros vincula el equipo técnico y pantallas asignadas a tu evento en ${town}.`,
    `Seguridad para tu boda en ${town}: El abono de 100 € en Stripe formaliza la reserva en ${town} con confirmación inmediata por correo.`,
    `Compromiso sin sorpresas en ${town}: Sellamos el acuerdo técnico en ${town} tras recibir 100 euros de señal con condiciones claras.`,
    `Orden de carga para ${town}: Al pagar 100 € de fianza, el material queda apartado en almacén para la fecha de tu evento en ${town}.`,
    `Contratación con respaldo en ${town}: Los 100 euros de señal garantizan la asistencia de nuestro técnico y entrega puntual en ${town}.`,
    `Fianza protegida para ${town}: Tu depósito de 100 € queda custodiado por pasarela bancaria oficial hasta ejecutar el servicio en ${town}.`,
    `Formalización rápida en ${town}: En dos minutos completas la fianza de 100 euros y recibes el contrato firmado para ${town}.`,
    `Bloqueo exclusivo de fecha en ${town}: El ingreso de 100 € de señal asegura que no aceptemos otros eventos en tu franja en ${town}.`
  ];
  const a4 = pick(slug, 17, faqLockPool);

  return [
    { category: 'logistica', question: q1, answer: a1 },
    { category: 'acustica', question: q2, answer: a2 },
    { category: 'electricidad', question: q3, answer: a3 },
    { category: 'reserva', question: q4, answer: a4 }
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESOLUTOR PRINCIPAL DE ARSENAL POR POBLACIÓN (SSOT)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function resolveArsenalPoblacion(rawSlug: string): ArsenalPoblacionProfile {
  const cleanSlug = (rawSlug || 'madrid')
    .toLowerCase()
    .trim()
    .replace(/^alquiler-/, '')
    .replace(/^arsenal-/, '');

  // 1. Buscar en la base de datos de municipios
  let municipality = MUNICIPALITIES_DATABASE.find(m => m.slug.toLowerCase() === cleanSlug);

  if (!municipality) {
    const byName = MUNICIPALITIES_DATABASE.find(m => 
      m.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === cleanSlug.replace(/-/g, ' ')
    );
    municipality = byName;
  }

  // Fallback seguro si no existe en la base de 250
  if (!municipality) {
    const formattedName = cleanSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    municipality = {
      id: cleanSlug,
      name: formattedName,
      slug: cleanSlug,
      province: 'Madrid',
      provinceSlug: 'madrid',
      autonomousCommunity: 'Comunidad de Madrid',
      tier: 2,
      population: 45000,
      hasFincas: true,
      hasPatronalEvents: true,
      searchIntentScore: 85
    };
  }

  // 2. Resolver arquetipo y orden DOM
  const archetype = resolveArchetype(municipality);
  const seed = hashString(municipality.slug);
  const layoutOrder = LAYOUT_VARIANTS[seed % LAYOUT_VARIANTS.length];

  // 3. Obtener distancia y coordenadas
  const provCoord = PROVINCE_COORDINATES[municipality.province] || PROVINCE_COORDINATES['Madrid'];
  const baseKm = provCoord.defaultKmFromMentrida || 54;
  const kmAdjustment = municipality.isCoreHub ? -8 : 12;
  const distanceKm = Math.max(15, baseKm + (seed % 20) - 10 + kmAdjustment);

  // 4. Datos de ruta y vehículos
  const { highway, transitMinutes, recommendedVehicle } = resolveHighwayAndTransit(municipality.slug, municipality.province, distanceKm);
  const isZonaCeroMentrida = distanceKm <= 55 || archetype === 'zona_cero_toledo';
  const maxDbLimit = archetype === 'historica_destino' ? 75 : (archetype === 'fiestas_patronales_b2g' ? 88 : 80);

  // Métricas dinámicas por municipio (Diferenciadas por seed)
  const pax = 110 + (seed % 14) * 20; // 110 a 370 personas
  const watts = pax * 12; // 12 W/pax riguroso

  // 5. Narrativas y copys únicos (>90% diferenciación)
  const narratives = buildUniqueNarratives(
    municipality.name,
    municipality.province,
    archetype,
    distanceKm,
    highway,
    recommendedVehicle,
    maxDbLimit,
    municipality.slug,
    watts,
    pax,
    transitMinutes
  );

  // 6. Hardwares y FAQs personalizadas con slug para garantizar <10% solapamiento
  const items = buildLocalizedHardware(
    municipality.slug, 
    municipality.name, 
    municipality.province, 
    highway, 
    maxDbLimit,
    watts,
    pax
  );

  const faqs = buildLocalizedFaqs(
    municipality.slug,
    municipality.name,
    municipality.province,
    archetype,
    highway,
    maxDbLimit,
    recommendedVehicle,
    distanceKm,
    transitMinutes,
    watts,
    pax
  );

  // 7. Metadatos SEO limpios
  const metaTitle = `${narratives.h1} | Productora EAR`;
  const metaDescription = `${narratives.leadParagraph.slice(0, 150)}... Alquiler directo en ${municipality.name} con reserva garantizada de 100 €, rider 12 W/pax y asistencia técnica in situ.`;
  const canonicalUrl = `https://productoraear.com/alquiler/${municipality.slug}`;

  return {
    slug: municipality.slug,
    poblacionName: municipality.name,
    provinceName: municipality.province,
    autonomousCommunity: municipality.autonomousCommunity,
    archetype,
    layoutOrder,
    distanceKm,
    transitMinutes,
    mainAccessHighway: highway,
    recommendedVehicle,
    maxDbLimit,
    isZonaCeroMentrida,
    h1: narratives.h1,
    h2Subtitle: narratives.h2Subtitle,
    heroBadge: narratives.heroBadge,
    leadParagraph: narratives.leadParagraph,
    secondaryParagraph: narratives.secondaryParagraph,
    tertiaryParagraph: narratives.tertiaryParagraph,
    technicalPackName: narratives.technicalPackName,
    technicalPackSummary: narratives.technicalPackSummary,
    items,
    faqs,
    metaTitle,
    metaDescription,
    canonicalUrl
  };
}
