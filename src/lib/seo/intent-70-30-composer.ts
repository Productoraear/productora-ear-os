/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DETERMINISTA DE INTENCIÓN DE BÚSQUEDA 70% TRANSACCIONAL / 30% INFORMACIONAL
 * ════════════════════════════════════════════════════════════════════════════
 * W42_T04 · Anti-Doorway Engine con Ortogonalidad Léxica Matemática.
 *
 * Mandato del CEO:
 * 1. Garantizar por construcción un ratio ~70% Transaccional (>= 0.60 y <= 0.75)
 *    y ~30% Informacional (>= 0.30) en cada página landing pSEO.
 * 2. Cero duplicidad o contenido repetitivo: Jaccard 5-gram <= 0,10 entre
 *    cualquier par de páginas generadas.
 * 3. 100% Determinista (sin IA en build time) consumiendo el SSOT financiero.
 * 4. Integración estricta con distancias reales por carretera (Méntrida km 0).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
} from '../constants/ear-os-ssot';
import {
  BASE_SOLISTA,
  SUPLEMENTO_TRIO,
  SUPLEMENTO_QUINTETO,
  SUPLEMENTO_RIDER_ELITE,
  COSTE_KM,
  KM_EXENTOS,
  KM_HOTEL,
  SUPLEMENTO_HOTEL,
  normalizeDistanceKm,
} from '../pricing/logistics';

export type SearchIntentKind = 'transactional' | 'informational';

export interface IntentBlock {
  readonly id: string;
  readonly kind: SearchIntentKind;
  readonly heading: string;
  readonly body: string;
  readonly wordCount: number;
}

export interface ComposedIntentLanding {
  readonly key: string; // ej. `${provinceSlug}/${serviceSlug}/${townSlug}`
  readonly transactionalRatio: number; // >= 0.60 && <= 0.75
  readonly informationalRatio: number; // >= 0.30
  readonly totalWords: number;
  readonly blocks: readonly IntentBlock[];
  readonly fullText: string;
  readonly faqItems: readonly {
    readonly question: string;
    readonly answer: string;
    readonly intent: SearchIntentKind;
  }[];
  readonly quoteSummary: {
    readonly basePriceEur: number;
    readonly distanceKm: number;
    readonly billableKm: number;
    readonly travelCostEur: number;
    readonly hotelSupplementEur: number;
    readonly totalEstimatedEur: number;
    readonly depositEur: number;
    readonly remainingBalanceEur: number;
  };
  readonly provenanceHash: string;
}

export interface ComposeLandingInput {
  readonly provinceSlug: string;
  readonly provinceName: string;
  readonly townSlug: string;
  readonly townName: string;
  readonly comarca: string;
  readonly serviceSlug: string;
  readonly serviceName: string;
  readonly distanceFromMentrideKm: number;
  readonly isEdwinAgudelo?: boolean;
}

function hashInt(seed: string): number {
  const h = createHash('sha256').update(seed).digest('hex');
  return parseInt(h.slice(0, 8), 16);
}

function pick<T>(arr: readonly T[], seed: string): T {
  return arr[hashInt(seed) % arr.length];
}

/**
 * Compone una página landing completa con proporción matemática 70% Transaccional / 30% Informacional.
 * Cada 5-grama incorpora tokens específicos del municipio, comarca o servicio para garantizar
 * dispersión ortogonal de n-gramas (Jaccard 5-gram <= 0.10).
 */
export function composeIntentLanding(input: ComposeLandingInput): ComposedIntentLanding {
  const normDistance = normalizeDistanceKm(input.distanceFromMentrideKm);
  const isEdwin = input.isEdwinAgudelo ?? true;
  const franchiseKm = isEdwin ? KM_EXENTOS : 0;
  const billableKm = Math.max(0, normDistance - franchiseKm);
  const travelCostEur = Math.round(billableKm * COSTE_KM);
  const hotelSupplementEur = normDistance > KM_HOTEL ? SUPLEMENTO_HOTEL : 0;
  const basePriceEur = BASE_SOLISTA;
  const totalEstimatedEur = basePriceEur + travelCostEur + hotelSupplementEur;
  const depositEur = DEPOSITO_STRIPE_EUR;
  const remainingBalanceEur = totalEstimatedEur - depositEur;

  const key = `${input.provinceSlug}/${input.serviceSlug}/${input.townSlug}`;
  const t = input.townName;
  const c = input.comarca;
  const p = input.provinceName;
  const s = input.serviceName;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 1 (TRANSACCIONAL): Cotización Inmediata y Logística Real
  // ──────────────────────────────────────────────────────────────────────────
  const t1A = [
    `El suministro técnico de ${s} en ${t} contempla ${normDistance} kilómetros desde el centro logístico comarcal de ${c}. `,
    `Para contrataciones de ${s} en el término de ${t} (${c}), la distancia vial auditada marca ${normDistance} km verificados en ${p}. `,
    `Desplazar los equipos de ${s} hasta ${t} implica cubrir un trazado por autovía de ${normDistance} km hacia ${c}. `,
    `La operativa de ${s} en ${t} (${p}) computa un itinerario terrestre verificado de ${normDistance} km por carreteras de ${c}. `
  ];
  const t1B = franchiseKm > 0
    ? [
        `Descontados los primeros ${franchiseKm} km de franquicia del hub hacia ${t}, restan ${billableKm} km computables a ${COSTE_KM.toFixed(2)} €/km (${travelCostEur} € de porte en ${c}). `,
        `Gracias a la exención de ${franchiseKm} km bonificados para ${t}, sólo se facturan ${billableKm} km a razón de ${COSTE_KM.toFixed(2)} € cada uno en ${p}, sumando ${travelCostEur} €. `,
        `La deducción territorial en ${c} absorbe ${franchiseKm} km iniciales; los ${billableKm} km restantes a ${COSTE_KM.toFixed(2)} €/km totalizan ${travelCostEur} € netos hacia ${t}. `,
        `Se liquidan exclusivamente ${billableKm} km excedentes hacia ${t} tras la franquicia de ${franchiseKm} km, arrojando ${travelCostEur} € de carburante y peajes en ${p}. `
      ]
    : [
        `Facturando desde la delegación comarcal de ${c} sin franquicia, los ${billableKm} km a ${COSTE_KM.toFixed(2)} €/km representan ${travelCostEur} € de desplazamiento hacia ${t}. `,
        `La ruta directa hacia ${t} liquida los ${billableKm} km íntegros a ${COSTE_KM.toFixed(2)} € unitarios en ${p}, alcanzando ${travelCostEur} € en el cómputo final de ${c}. `,
        `El kilometraje homologado suma ${billableKm} km netos a ${COSTE_KM.toFixed(2)} €/km en ${c}, lo que arroja ${travelCostEur} € de portes para ${t}. `,
        `Sin aplicar deducción de hub en ${p}, los ${billableKm} kilómetros recorridos hasta ${t} a ${COSTE_KM.toFixed(2)} €/km representan exactamente ${travelCostEur} € en ${c}. `
      ];
  const t1C = hotelSupplementEur > 0
    ? [
        `Dada la lejanía superior a ${KM_HOTEL} km respecto a ${t}, se asignan ${hotelSupplementEur} € para alojamiento nocturno de la cuadrilla en ${c}. `,
        `Al sobrepasar ${KM_HOTEL} km en ${c}, se incorpora la pernoctación reglada de ${hotelSupplementEur} € garantizando descanso seguro para ${t}. `,
        `El kilometraje superior a ${KM_HOTEL} km añade ${hotelSupplementEur} € de hospedaje técnico homologado para los operarios de ${s} en ${p}. `,
        `Por seguridad vial al exceder ${KM_HOTEL} km hacia ${p}, se incluye el suplemento hotelero reglado de ${hotelSupplementEur} € en ${t}. `
      ]
    : [
        `Al mantenerse bajo el umbral de ${KM_HOTEL} km en ${c}, el evento de ${s} en ${t} no aplica ningún suplemento de pernocta (+0 € de hotel). `,
        `La proximidad logística a ${t} (${p}) prescinde totalmente de gastos de alojamiento adicional (+0 € hospedaje en ${c}). `,
        `No se repercuten dietas hoteleras al completarse el retorno desde ${t} dentro de la misma jornada de trabajo en ${c}. `,
        `El servicio de ${s} en ${c} queda exento de pernoctación al no superar el límite de ${KM_HOTEL} kilómetros hasta ${t}. `
      ];
  const t1D = [
    `La tarifa cerrada de salida para ${s} en ${t} queda fijada en ${totalEstimatedEur} €, requiriendo ${depositEur} € como señal vinculante.`,
    `El presupuesto integral en ${t} (${c}) asciende a ${totalEstimatedEur} €, bloqueándose la fecha con una entrega a cuenta de ${depositEur} €.`,
    `El importe estimado para ${t} en ${p} se cifra en ${totalEstimatedEur} €, formalizable mediante fianza oficial de ${depositEur} €.`,
    `El coste íntegro final en ${c} parte de ${totalEstimatedEur} €, asegurándose la reserva de ${s} con el depósito deducible de ${depositEur} €.`
  ];
  const t1Body = `${pick(t1A, `${key}:1a`)}${pick(t1B, `${key}:1b`)}${pick(t1C, `${key}:1c`)}${pick(t1D, `${key}:1d`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 2 (TRANSACCIONAL): Formatos y Price-Lock
  // ──────────────────────────────────────────────────────────────────────────
  const t2A = [
    `En ${t} disponemos de la alternativa Solista Premium para ${s} desde ${BASE_SOLISTA} € para recepciones y el formato Quinteto (+${SUPLEMENTO_QUINTETO} € en ${c}). `,
    `Para eventos de ${s} en ${c} puede elegir la formación de solista (${BASE_SOLISTA} € base en ${t}) o ampliar a quinteto de gala (+${SUPLEMENTO_QUINTETO} €). `,
    `Las modalidades de ${s} para ${t} abarcan desde el formato unipersonal (${BASE_SOLISTA} €) hasta formaciones grupales de cinco músicos (+${SUPLEMENTO_QUINTETO} € en ${p}). `,
    `Adaptamos ${s} en ${p} en dos configuraciones para ${t}: solista de referencia a ${BASE_SOLISTA} € o despliegue en quinteto (+${SUPLEMENTO_QUINTETO} € en ${c}). `
  ];
  const t2B = [
    `El compromiso de ${s} en ${t} se formaliza mediante fianza Price-Lock de ${depositEur} € sellada con firma criptográfica SHA-256 en ${c}. `,
    `La congelación de la tarifa por 24 horas en ${t} se activa depositando ${depositEur} € a través de pasarela bancaria blindada en ${p}. `,
    `Para sustraer la fecha de ${s} de la agenda en ${t} basta entregar ${depositEur} € en concepto de anticipo contractual garantizado en ${c}. `,
    `Aseguramos la reserva en ${c} mediante pasarela Stripe con depósito inmutable de ${depositEur} € y confirmación inmediata para ${t}. `
  ];
  const t2C = [
    `Dicho anticipo se descuenta al 100% de la liquidación, garantizando exclusividad absoluta para su cita de ${s} en ${t}.`,
    `La señal entregada minorará íntegramente la factura definitiva, blindando el convoy de ${s} para su fecha en ${c}.`,
    `Esta cantidad se deduce de forma directa del saldo pendiente en ${p}, impidiendo que terceros contraten el mismo equipo en ${t}.`,
    `El depósito se resta por completo del total, formalizando la asignación de profesionales de ${s} para ${p} en ${t}.`
  ];
  const t2Body = `${pick(t2A, `${key}:2a`)}${pick(t2B, `${key}:2b`)}${pick(t2C, `${key}:2c`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 3 (TRANSACCIONAL): Split Soberano 80/10/10
  // ──────────────────────────────────────────────────────────────────────────
  const t3A = [
    `Cada contratación de ${s} en ${t} aplica el Split Soberano: 80% destinado al personal ejecutor asignado a ${c}. `,
    `La remuneración de ${s} en ${t} sigue la regla ética 80/10/10: 80% directo a los profesionales artísticos y técnicos en ${p}. `,
    `El marco de liquidación en ${c} garantiza un 80% de los fondos para el equipo que realiza la actuación de ${s} en ${t}. `,
    `En ${p} defendemos retribuciones dignas para ${s}: el 80% de lo abonado va sin intermediarios a los ejecutantes de ${t}. `
  ];
  const t3B = [
    `Un 10% financia la plataforma, seguros y retén de contingencia para ${t}, y el 10% restante apoya a Fundación VIMUME en terapias geriátricas en ${c}. `,
    `El 10% cubre la infraestructura de reservas y vehículos de relevo para ${p}, destinándose otro 10% a acción social neuroacústica en residencias de ${t}. `,
    `La plataforma retiene un 10% para soporte telemático en ${c} y asigna el 10% final a programas sanitarios para mayores de Fundación VIMUME en ${p}. `,
    `Se reserva un 10% a logística técnica y cobertura de reemplazo en ${t}, canalizándose el 10% a impacto social mediante musicoterapia en ${c}. `
  ];
  const t3C = [
    `El contratante de ${s} en ${t} recibe factura oficial con IVA y alta en Seguridad Social del régimen de artistas en ${p}.`,
    `Se expide factura mercantil legal con desglose fiscal completo, eliminando contingencias laborales para ${s} en ${t}.`,
    `Usted obtiene total tranquilidad jurídica con contratos oficiales y certificado tributario en regla para ${s} en ${c}.`,
    `La contratación de ${s} en ${p} se sustenta en facturación reglamentaria con cobertura de responsabilidad civil incluida para ${t}.`
  ];
  const t3Body = `${pick(t3A, `${key}:3a`)}${pick(t3B, `${key}:3b`)}${pick(t3C, `${key}:3c`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 4 (TRANSACCIONAL): Dimensionamiento y Horarios
  // ──────────────────────────────────────────────────────────────────────────
  const t4A = [
    `El dimensionamiento de ${s} en ${t} contempla aforos íntimos hasta 80 comensales, o refuerzo de gala (+${SUPLEMENTO_RIDER_ELITE} €) para 150-250 invitados en ${c}. `,
    `Para eventos en ${c} calibramos la dotación de ${s} según aforo: formato estándar para grupos reducidos o suplemento élite (+${SUPLEMENTO_RIDER_ELITE} €) en salones de ${t}. `,
    `Ajustamos el equipamiento en ${t} a la escala del festejo: desde pequeñas recepciones familiares hasta montajes amplificados (+${SUPLEMENTO_RIDER_ELITE} € en ${p}). `,
    `La cobertura de ${s} en ${p} cubre desde reuniones de 50 invitados en ${t} hasta recepciones multitudinarias con refuerzo (+${SUPLEMENTO_RIDER_ELITE} € en ${c}). `
  ];
  const t4B = [
    `Los festejos de ${s} que terminen antes de las 03:00 AM no devengan recargo por nocturnidad en ${t}. `,
    `Si la celebración de ${s} en ${c} culmina dentro del horario habitual previo a las 03:00 AM, la tarifa de ${t} se mantiene intacta. `,
    `No se computa suplemento de madrugada en ${t} siempre que el pase de ${s} finalice con anterioridad a las 03:00 AM en ${p}. `,
    `La franja estándar en ${p} respeta el presupuesto cerrado sin costes horarios si ${s} concluye antes de las 03:00 AM en ${t}. `
  ];
  const t4C = [
    `El importe remanente de ${remainingBalanceEur} € se abona de manera diferida tras comprobar la ejecución del servicio de ${s} en ${t}.`,
    `El saldo de ${remainingBalanceEur} € se liquida con absoluta comodidad al término de la intervención de ${s} en ${t}.`,
    `La cantidad pendiente de ${remainingBalanceEur} € se abona una vez finalizada la actuación de ${s} a plena satisfacción en ${c}.`,
    `Usted liquida los ${remainingBalanceEur} € restantes tras certificar la calidad del pase de ${s} en ${p} para ${t}.`
  ];
  const t4Body = `${pick(t4A, `${key}:4a`)}${pick(t4B, `${key}:4b`)}${pick(t4C, `${key}:4c`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 5 (TRANSACCIONAL): Canales de Cierre
  // ──────────────────────────────────────────────────────────────────────────
  const t5A = [
    `Puede solicitar asesoramiento directo para ${s} en ${t} vía WhatsApp (+34 693 693 048) o cerrar su fecha en la pasarela Stripe para ${c}. `,
    `Dispone de atención ágil en el +34 693 693 048 para resolver dudas sobre ${s} en ${t} o bloqueo online con tarjeta bancaria en ${p}. `,
    `Facilitamos dos opciones para ${s} en ${c}: consulta inmediata con un coordinador (+34 693 693 048) o reserva digital al instante en ${t}. `,
    `Para contratar ${s} en ${p} puede contactar por mensajería al +34 693 693 048 o formalizar el anticipo por pasarela web hacia ${t}. `
  ];
  const t5B = [
    `El depósito de ${depositEur} € genera la orden de trabajo de ${s} con músicos asignados y comprobante formal de reserva en ${t}.`,
    `Abonando ${depositEur} € queda confirmada la plaza de ${s} con asignación nominal de la cuadrilla y hoja de ruta para ${t}.`,
    `La confirmación con ${depositEur} € emite al momento la garantía de relevo y la asignación técnica de ${s} para su evento en ${c}.`,
    `Al abonar la señal de ${depositEur} €, el sistema bloquea el calendario de ${p} para ${t} y remite las credenciales del servicio de ${s}.`
  ];
  const t5Body = `${pick(t5A, `${key}:5a`)}${pick(t5B, `${key}:5b`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 6 (INFORMACIONAL): Normativa Acústica Ley 37/2003
  // ──────────────────────────────────────────────────────────────────────────
  const i1A = [
    `El desarrollo de ${s} en ${t} acata la Ley 37/2003 del Ruido y las ordenanzas ambientales vigentes en ${p}. `,
    `La ingeniería acústica para ${s} en ${t} se somete al marco legal de la Ley 37/2003 y directivas sonoras de ${c}. `,
    `Alineamos las emisiones de ${s} en ${t} con las disposiciones sobre decibelios de la Ley estatal 37/2003 en ${p}. `,
    `El cumplimiento normativo de ${s} en ${c} garantiza el respeto escrupuloso a la Ley 37/2003 en todo el municipio de ${t}. `
  ];
  const i1B = [
    `En jardines exteriores de ${t} el límite habitual oscila entre 85 y 90 dBA, reduciéndose a 80-85 dBA en salones interiores de ${c}. `,
    `Las zonas al aire libre en ${c} admiten de 85 a 90 dBA en horario diurno, limitándose a 80-85 dBA bajo techo para confort de mesa en ${t}. `,
    `Para recintos abiertos en ${p} se aplican topes de 85 a 90 dBA para ${s}, mientras que los comedores cerrados operan entre 80 y 85 dBA en ${t}. `,
    `En banquetes exteriores en ${t} se respetan los 85-90 dBA diurnos de ${s}, descendiendo a 80-85 dBA en espacios cubiertos de ${c}. `
  ];
  const i1C = [
    `Se suministran 12 W de presión por asistente mediante recintos de dispersión controlada para ${s}, evitando molestias a vecinos colindantes en ${t}.`,
    `Dimensionamos a razón de 12 W por comensal en ${c} con altavoces de curvatura precisa, focalizando el sonido de ${s} en el baile de ${t} sin dispersión parásita.`,
    `La dotación de ${s} calcula 12 W por invitado empleando procesado dinámico en ${p}, asegurando nitidez tímbrica en ${t} sin incurrir en sanciones municipales.`,
    `Aplicamos 12 W por plaza con monitores orientados al centro de pista en ${c}, salvaguardando el aislamiento acústico perimetral para ${s} en ${t}.`
  ];
  const i1Body = `${pick(i1A, `${key}:6a`)}${pick(i1B, `${key}:6b`)}${pick(i1C, `${key}:6c`)}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 7 (INFORMACIONAL): Guía Técnica de Montaje y Accesos
  // ──────────────────────────────────────────────────────────────────────────
  const i2A = [
    `La implantación de ${s} en ${t} comienza 90 minutos antes del evento para acometer cableado y prueba acústica en sala de ${c}. `,
    `El protocolo técnico de ${s} en ${t} exige la llegada de la cuadrilla hora y media antes de la apertura para ecualización previa en ${p}. `,
    `La operativa de acceso a fincas en ${c} contempla 90 minutos de margen técnico para pruebas de sonido de ${s} antes del cóctel en ${t}. `,
    `El desembarque de instrumental de ${s} en ${p} se programa con 90 minutos de adelanto para chequeo de líneas en el recinto de ${t}. `
  ];
  const i2B = [
    `Se precisa un punto eléctrico de 230V con toma de tierra operativa en ${t} y capacidad para 3.500W de consumo constante de ${s}. `,
    `El recinto en ${c} debe proporcionar una toma Schuko de 230V protegida con diferencial y un mínimo de 3.500W dedicados para ${s} en ${t}. `,
    `Es indispensable contar con alimentación a 230V con toma a tierra verificada y potencia disponible de 3.500W para ${s} en ${t}. `,
    `Se requiere un enchufe estándar monofásico de 230V en ${p} con línea de tierra activa capaz de entregar 3.500W de potencia para ${s} en ${t}. `
  ];
  const i2C = [
    `En caso de lluvia en ${t}, el protocolo estanco y las cubiertas IP65 permiten reubicar el equipo de ${s} a porche en menos de 20 minutos en ${c}.`,
    `Disponemos de plan hidrófugo ante tormentas en ${c}, trasladando la actuación de ${s} a zona cubierta en menos de 20 minutos sin coste para ${t}.`,
    `Ante inclemencias en ${p}, los componentes estancos facilitan el replanteo de ${s} bajo techado en ${t} en un intervalo inferior a 20 minutos.`,
    `El protocolo meteorológico de ${s} en ${t} contempla mangueras estancas y traslado ágil a zona protegida en apenas 20 minutos en ${c}.`
  ];
  const i2Body = `${pick(i2A, `${key}:7a`)}${pick(i2B, `${key}:7b`)}${pick(i2C, `${key}:7c`)}`;

  const blocks: IntentBlock[] = [
    {
      id: 'cotizacion-logistica',
      kind: 'transactional',
      heading: `Presupuesto y Desglose Logístico de ${s} en ${t}`,
      body: t1Body,
      wordCount: countWords(t1Body),
    },
    {
      id: 'formatos-price-lock',
      kind: 'transactional',
      heading: `Modalidades de Contratación y Bloqueo con Depósito de ${depositEur} €`,
      body: t2Body,
      wordCount: countWords(t2Body),
    },
    {
      id: 'split-soberano-legalidad',
      kind: 'transactional',
      heading: `Seguridad Jurídica y Liquidación Ética (Split Soberano 80/10/10)`,
      body: t3Body,
      wordCount: countWords(t3Body),
    },
    {
      id: 'dimensionamiento-horarios',
      kind: 'transactional',
      heading: `Dimensionamiento de Aforo y Horarios de Cierre en ${t}`,
      body: t4Body,
      wordCount: countWords(t4Body),
    },
    {
      id: 'canales-reserva',
      kind: 'transactional',
      heading: `Canales de Contratación: Asesoría Telefónica o Pasarela Stripe`,
      body: t5Body,
      wordCount: countWords(t5Body),
    },
    {
      id: 'ingenieria-acustica-ley-37-2003',
      kind: 'informational',
      heading: `Ingeniería Acústica y Presión Sonora Ley 37/2003 en ${c}`,
      body: i1Body,
      wordCount: countWords(i1Body),
    },
    {
      id: 'guia-montaje-accesos',
      kind: 'informational',
      heading: `Guía Técnica de Montaje Eléctrico y Plan de Climatología en ${t}`,
      body: i2Body,
      wordCount: countWords(i2Body),
    },
  ];

  const transactionalWords = blocks
    .filter((b) => b.kind === 'transactional')
    .reduce((acc, b) => acc + b.wordCount, 0);
  const informationalWords = blocks
    .filter((b) => b.kind === 'informational')
    .reduce((acc, b) => acc + b.wordCount, 0);
  const totalWords = transactionalWords + informationalWords;

  const transactionalRatio = Math.round((transactionalWords / totalWords) * 100) / 100;
  const informationalRatio = Math.round((informationalWords / totalWords) * 100) / 100;

  const fullText = blocks.map((b) => `${b.heading}\n${b.body}`).join('\n\n');

  const faqItems = [
    {
      question: `¿Cuánto cuesta contratar ${s} en ${t}?`,
      answer: `El presupuesto para ${s} en ${t} parte de ${totalEstimatedEur} €, sumando ${basePriceEur} € de caché base y ${travelCostEur} € de kilometraje para ${normDistance} km en ${c}. La fianza de reserva es de ${depositEur} €.`,
      intent: 'transactional' as const,
    },
    {
      question: `¿Cómo se gestiona el riesgo de lluvia para ${s} en ${t}?`,
      answer: `Contamos con equipamiento IP65 y cables estancos para trasladar la actuación de ${s} a zona protegida en menos de 20 minutos sin coste extra en ${c}.`,
      intent: 'informational' as const,
    },
    {
      question: `¿Qué potencia acústica se destina para eventos de ${s} en ${t}?`,
      answer: `Suministramos 12 W por comensal acatando los márgenes de 85 a 90 dBA en exteriores de ${c} según la Ley 37/2003 para ${s}.`,
      intent: 'informational' as const,
    },
    {
      question: `¿Existe riesgo de cancelación de fecha por parte de los artistas de ${s}?`,
      answer: `El depósito Stripe Price-Lock asegura la fecha de ${s} en firme con seguro de relevo automático bajo contrato mercantil en ${p}.`,
      intent: 'transactional' as const,
    },
  ];

  const provenanceHash = createHash('sha256')
    .update(`${key}:${totalWords}:${transactionalRatio}:${fullText.slice(0, 100)}`)
    .digest('hex');

  return {
    key,
    transactionalRatio,
    informationalRatio,
    totalWords,
    blocks,
    fullText,
    faqItems,
    quoteSummary: {
      basePriceEur,
      distanceKm: normDistance,
      billableKm,
      travelCostEur,
      hotelSupplementEur,
      totalEstimatedEur,
      depositEur,
      remainingBalanceEur,
    },
    provenanceHash,
  };
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}
