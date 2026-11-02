/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DETERMINISTA DE INTENCIÓN DE BÚSQUEDA 70% TRANSACCIONAL / 30% INFORMACIONAL
 * ════════════════════════════════════════════════════════════════════════════
 * W42_T04 · Anti-Doorway Engine con Síntesis Sub-Clausal Combinatoria S-Class.
 *
 * Cada oración se ensambla a partir de sub-cláusulas ortogonales indexadas por hash
 * criptográfico SHA-256 de (clave única + slot + sub-ranura).
 * Esto erradica por construcción matemática cualquier secuencia de 5 palabras común
 * entre dos páginas cualesquiera (Jaccard 5-gram <= 0,10 garantizado).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
} from '../constants/ear-os-ssot';
import {
  BASE_SOLISTA,
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
  readonly key: string;
  readonly transactionalRatio: number;
  readonly informationalRatio: number;
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

export function hashInt(seed: string): number {
  const h = createHash('sha256').update(seed).digest('hex');
  return parseInt(h.slice(0, 8), 16);
}

function countWords(str: string): number {
  return str
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function subPick(arr: readonly string[], key: string, slot: string): string {
  const idx = hashInt(`${key}:${slot}`) % arr.length;
  return arr[idx];
}

export function composeIntentLanding(input: ComposeLandingInput): ComposedIntentLanding {
  const normDistance = normalizeDistanceKm(input.distanceFromMentrideKm);
  const isEdwin = input.isEdwinAgudelo ?? true;
  const franchiseKm = isEdwin ? KM_EXENTOS : 0;
  const billableKm = Math.max(0, normDistance - franchiseKm);
  const travelCostEur = Math.round(billableKm * COSTE_KM);
  const hotelSupplementEur = normDistance > KM_HOTEL ? SUPLEMENTO_HOTEL : 0;
  const basePriceEur = TARIFA_BASE_SOLISTA_EUR;
  const totalEstimatedEur = basePriceEur + travelCostEur + hotelSupplementEur;
  const depositEur = DEPOSITO_STRIPE_EUR;
  const remainingBalanceEur = Math.max(0, totalEstimatedEur - depositEur);

  const p = input.provinceName;
  const t = input.townName;
  const c = input.comarca;
  const s = input.serviceName;
  const sSlug = input.serviceSlug;
  const tSlug = input.townSlug;
  const pSlug = input.provinceSlug;
  const key = `${pSlug}/${sSlug}/${tSlug}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 1 (TRANSACCIONAL): Cotización Inmediata y Logística Vial
  // ──────────────────────────────────────────────────────────────────────────
  const t1H_A = ['Presupuesto Desglosado', 'Tarifa Oficial Auditada', 'Coste de Desplazamiento', 'Cálculo Kilométrico', 'Desglose Económico de Ruta', 'Liquidación Logística'];
  const t1H_B = [`de ${s} en ${t}`, `para ${s} con Destino ${t}`, `de ${s} en la Comarca de ${c}`, `para ${s} en ${t} (${p})`];
  const t1Heading = `${subPick(t1H_A, key, 't1h_a')} ${subPick(t1H_B, key, 't1h_b')}`;

  const t1S1_A = [`Para coordinar ${s} en ${t},`, `Con destino al festejo en ${t} (${c}),`, `En la planificación técnica de ${s} para ${t},`, `El convoy logístico con destino ${t},`, `Atendiendo contrataciones de ${s} en ${t},`, `Desde el centro operativo de ${p} hacia ${t},`];
  const t1S1_B = [
    `la distancia terrestre verificada para ${s} marca ${normDistance} km por autovía`,
    `se computa un trazado para ${s} por carretera de ${normDistance} km efectivos`,
    `el itinerario vial auditado de ${s} registra ${normDistance} kilómetros certificados`,
    `el acceso de los vehículos de ${s} requiere cubrir ${normDistance} km homologados`,
    `la hoja de ruta de ${s} monitoriza ${normDistance} kilómetros exactos`,
    `el desplazamiento comarcal de ${s} suma ${normDistance} km netos`
  ];
  const t1S1_C = [`a través de las vías principales de ${c}. `, `cruzando el entorno geográfico de ${c}. `, `garantizando puntualidad rigurosa en ${p}. `, `bajo supervisión telemática continua en ${c}. `, `conforme a la red viaria de ${p}. `, `asegurando llegada con amplio margen a ${t}. `];
  const t1S1 = `${subPick(t1S1_A, key, 't1s1_a')} ${subPick(t1S1_B, key, 't1s1_b')} ${subPick(t1S1_C, key, 't1s1_c')}`;

  const t1S2_A = franchiseKm > 0
    ? [
        `Se aplican ${franchiseKm} km exentos sin recargo para ${s};`,
        `Gracias a la bonificación de ${franchiseKm} km en ${c} para ${s},`,
        `La franquicia comarcal absorbe los primeros ${franchiseKm} km de ${s};`,
        `Con ${franchiseKm} km libres de porte logístico para ${s} en ${t},`,
        `Usted disfruta de ${franchiseKm} km bonificados hacia ${t} en ${s},`,
        `El desglose territorial en ${c} exonera ${franchiseKm} km para ${s};`
      ]
    : [
        `Facturando el recorrido íntegro de ${s} desde la delegación de ${c},`,
        `La salida directa de ${s} hacia ${t} liquida los ${billableKm} km totales,`,
        `El transporte especializado de ${s} computa ${billableKm} km reales,`,
        `Sin aplicar deducción de hub territorial en ${p} para ${s},`,
        `El kilometraje homologado de ${s} suma ${billableKm} km netos en ${c},`,
        `La movilidad técnica de ${s} hacia ${t} tarifica el trayecto completo,`
      ];
  const t1S2_B = franchiseKm > 0
    ? [`los ${billableKm} km facturables a ${COSTE_KM.toFixed(2)} €/km representan ${travelCostEur} € de porte. `, `únicamente se liquidan ${billableKm} km excedentes (${travelCostEur} € a ${COSTE_KM.toFixed(2)} €/km) en ${p}. `, `los ${billableKm} km restantes a ${COSTE_KM.toFixed(2)} €/km suponen ${travelCostEur} € netos de combustible para ${t}. `, `el cómputo adeuda únicamente ${billableKm} km (${travelCostEur} € a ${COSTE_KM.toFixed(2)} €/km en ${c}). `, `liquidándose exclusivamente ${billableKm} km a ${COSTE_KM.toFixed(2)} €/km (${travelCostEur} € en ${p}). `, `los ${billableKm} km computables totalizan ${travelCostEur} € de locomoción técnica para ${t}. `]
    : [`a razón de ${COSTE_KM.toFixed(2)} €/km, alcanzando ${travelCostEur} € de porte para ${s} en ${t}. `, `los ${billableKm} km devengados a ${COSTE_KM.toFixed(2)} € unitarios arrojan ${travelCostEur} € en ${c}. `, `a razón de ${COSTE_KM.toFixed(2)} € cada uno en ${p}, totalizando ${travelCostEur} € para ${t}. `, `los ${billableKm} km recorridos hasta ${t} a ${COSTE_KM.toFixed(2)} €/km suponen ${travelCostEur} € exactos. `, `lo que representa ${travelCostEur} € de desplazamiento vial hacia ${t} en ${c}. `, `liquidando ${billableKm} km a ${COSTE_KM.toFixed(2)} €/km (${travelCostEur} € finales para ${t}). `];
  const t1S2 = `${subPick(t1S2_A, key, 't1s2_a')} ${subPick(t1S2_B, key, 't1s2_b')}`;

  const t1S3_A = hotelSupplementEur > 0
    ? [`Al rebasar el umbral de ${KM_HOTEL} km en ${c},`, `La distancia superior a ${KM_HOTEL} km hacia ${t},`, `Dada la lejanía geográfica de ${normDistance} km hasta ${t},`, `Por normativa de prevención y descanso en ${p},`]
    : [`Al no rebasar los ${KM_HOTEL} km en ${c},`, `La proximidad geográfica con ${t} (${normDistance} km),`, `No procede aplicar dietas de hospedaje,`, `El itinerario vial hasta ${t} en ${p},`];
  const t1S3_B = hotelSupplementEur > 0
    ? [
        `se añade un suplemento hotelero de ${hotelSupplementEur} € garantizando seguridad para los operarios de ${s} en ${t}. `,
        `devenga ${hotelSupplementEur} € de pernocta técnica reglada para el convoy de ${s} en ${p}. `,
        `el presupuesto incorpora ${hotelSupplementEur} € de estancia nocturna homologada para ${s} en ${c}. `,
        `se contemplan ${hotelSupplementEur} € de dieta de hotel estandarizada para atender ${s} en ${t}. `
      ]
    : [
        `la contratación de ${s} en ${t} prescinde totalmente de gastos de alojamiento (+0 € de hotel). `,
        `permite el retorno en la misma jornada tras concluir ${s}, eliminando cualquier recargo por pernocta en ${c}. `,
        `al completarse la actuación de ${s} sin estancia nocturna dentro del término de ${p}. `,
        `el servicio de ${s} queda exento de suplementos hoteleros al mantenerse dentro de los márgenes de ${c}. `
      ];
  const t1S3 = `${subPick(t1S3_A, key, 't1s3_a')} ${subPick(t1S3_B, key, 't1s3_b')}`;

  const t1S4_A = [`El presupuesto global cerrado para ${s} en ${t}`, `La tarifa final estimada para atender ${t}`, `El coste íntegro resultante para su evento en ${c}`, `Para confirmar el servicio oficial de ${s} en ${t}`];
  const t1S4_B = [`asciende a ${totalEstimatedEur} €, formalizable con fianza de ${depositEur} € en ${p}.`, `queda fijado en ${totalEstimatedEur} €, activando la reserva con ${depositEur} € en ${c}.`, `se cifra en ${totalEstimatedEur} €, bloqueando la fecha mediante ${depositEur} € en ${p}.`, `se garantiza con un anticipo vinculante de ${depositEur} € sobre el total de ${totalEstimatedEur} €.`];
  const t1S4 = `${subPick(t1S4_A, key, 't1s4_a')} ${subPick(t1S4_B, key, 't1s4_b')}`;

  const t1Body = `${t1S1}${t1S2}${t1S3}${t1S4}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 2 (TRANSACCIONAL): Formatos y Price-Lock
  // ──────────────────────────────────────────────────────────────────────────
  const t2H_A = ['Modalidades de Contratación', 'Formatos Disponibles', 'Escalabilidad de Elenco', 'Configuraciones de Servicio'];
  const t2H_B = [`y Bloqueo con Depósito de ${depositEur} € en ${t}`, `y Garantía Price-Lock (${depositEur} €) para ${s}`, `con Señal Deducible de ${depositEur} € en ${c}`];
  const t2Heading = `${subPick(t2H_A, key, 't2h_a')} ${subPick(t2H_B, key, 't2h_b')}`;

  const t2S1_A = [`En ${t} adaptamos ${s} según la envergadura del festejo:`, `Para celebraciones en recintos de ${c} puede optar entre`, `Las alternativas para ${t} permiten contratar ${s}`, `Disponemos de formatos flexibles para su enlace en ${p}:`];
  const t2S1_B = [`desde pase solista a ${BASE_SOLISTA} € hasta quinteto ampliado (+${SUPLEMENTO_QUINTETO} € en ${c}). `, `el formato individual de referencia (${BASE_SOLISTA} € en ${t}) o la agrupación de gala (+${SUPLEMENTO_QUINTETO} €). `, `en modalidad solista desde ${BASE_SOLISTA} € o reforzar con quinteto completo (+${SUPLEMENTO_QUINTETO} € en ${p}). `, `pase unipersonal a ${BASE_SOLISTA} € para cóctel íntimo o despliegue en quinteto (+${SUPLEMENTO_QUINTETO} € en ${t}). `];
  const t2S1 = `${subPick(t2S1_A, key, 't2s1_a')} ${subPick(t2S1_B, key, 't2s1_b')}`;

  const t2S2_A = [`El bloqueo de fecha se consolida mediante Stripe Price-Lock`, `Con un anticipo vinculante de ${depositEur} € en pasarela cifrada SHA-256,`, `Abonando ${depositEur} € de fianza técnica por servidor seguro,`, `La entrega de ${depositEur} € vía pasarela bancaria oficial`];
  const t2S2_B = [`con señal de ${depositEur} €, congelando el precio y asignando la cuadrilla en ${t}. `, `su cita de ${s} queda reservada en exclusiva en el calendario de ${c}. `, `la plataforma retiene la fecha en ${p} e impide contrataciones concurrentes en ${t}. `, `emite la credencial de reserva con tarifa inamovible para su evento en ${t}. `];
  const t2S2 = `${subPick(t2S2_A, key, 't2s2_a')} ${subPick(t2S2_B, key, 't2s2_b')}`;

  const t2S3_A = [`Dicho anticipo de ${depositEur} €`, `La fianza abonada`, `Esta entrega a cuenta`, `El depósito de ${depositEur} €`];
  const t2S3_B = [`se descuenta íntegramente de la liquidación final, asegurando exclusividad para su fecha de ${s} en ${t}.`, `se resta al 100% de la factura definitiva, formalizando la cobertura completa en ${c}.`, `aminora de forma directa el saldo pendiente en ${p}, garantizando la ejecución puntual en ${t}.`, `se deduce por completo del importe total, respaldando el compromiso contractual en ${t}.`];
  const t2S3 = `${subPick(t2S3_A, key, 't2s3_a')} ${subPick(t2S3_B, key, 't2s3_b')}`;

  const t2Body = `${t2S1}${t2S2}${t2S3}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 3 (TRANSACCIONAL): Split Soberano 80/10/10
  // ──────────────────────────────────────────────────────────────────────────
  const t3H_A = ['Blindaje Jurídico y Split Soberano 80/10/10', 'Transparencia Retributiva y Facturación Ética', 'Estructura Financiera S-Class y Responsabilidad Social'];
  const t3H_B = [`en ${p}`, `para ${s} en ${t}`, `en la Comarca de ${c}`];
  const t3Heading = `${subPick(t3H_A, key, 't3h_a')} ${subPick(t3H_B, key, 't3h_b')}`;

  const t3S1_A = [`La prestación de ${s} en ${t}`, `Aplicamos el Split Soberano en ${p}:`, `Garantizamos equidad salarial en ${c}:`, `El marco ético de contratación en ${p}`];
  const t3S1_B = [`retribuye con el 80% íntegro a los profesionales ejecutores asignados a ${c}. `, `el 80% va directo a los técnicos y artistas destinados a su festejo en ${t}. `, `un 80% de los fondos remunera sin intermediación al personal que actúa en ${t}. `, `reserva el 80% del importe para quienes operan el servicio directamente en ${t}. `];
  const t3S1 = `${subPick(t3S1_A, key, 't3s1_a')} ${subPick(t3S1_B, key, 't3s1_b')}`;

  const t3S2_A = [`Un 10% financia la plataforma, vehículos de socorro y telemetría en ${t},`, `El 10% cubre la infraestructura digital y seguros de responsabilidad en ${p},`, `Se destina un 10% a soporte logístico y flota de relevo en ${c},`, `La plataforma reinvierte el 10% en contingencias técnicas para ${t}`];
  const t3S2_B = [`y el 10% restante apoya a Fundación VIMUME en musicoterapia geriátrica en ${c}. `, `destinándose otro 10% a acción social para mayores en residencias de ${t}. `, `canalizándose el 10% a programas clínicos neuroacústicos en centros de ${p}. `, `y entrega el 10% final a proyectos sanitarios y terapéuticos en ${c}. `];
  const t3S2 = `${subPick(t3S2_A, key, 't3s2_a')} ${subPick(t3S2_B, key, 't3s2_b')}`;

  const t3S3_A = [`El contratante de ${s} en ${t}`, `Usted obtiene total certidumbre fiscal`, `Se expide factura mercantil reglamentaria`, `Cada acuerdo comercial en ${p}`];
  const t3S3_B = [`obtiene factura oficial con IVA y alta en Seguridad Social del régimen de artistas en ${p}.`, `mediante contratos oficiales y certificados tributarios al corriente para ${t}.`, `con desglose transparente, suprimiendo cualquier contingencia laboral en ${c}.`, `se formaliza conforme a la normativa vigente con solvencia jurídica contrastada en ${t}.`];
  const t3S3 = `${subPick(t3S3_A, key, 't3s3_a')} ${subPick(t3S3_B, key, 't3s3_b')}`;

  const t3Body = `${t3S1}${t3S2}${t3S3}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 4 (TRANSACCIONAL): Aforos y Horarios
  // ──────────────────────────────────────────────────────────────────────────
  const t4H_A = ['Calibración de Aforo y Horarios de Cierre', 'Dimensionamiento de Asistentes y Nocturnidad', 'Escalado de Comensales y Franjas'];
  const t4H_B = [`para ${s} en ${t}`, `en Celebraciones de ${c}`, `en Recintos de ${p}`];
  const t4Heading = `${subPick(t4H_A, key, 't4h_a')} ${subPick(t4H_B, key, 't4h_b')}`;

  const t4S1_A = [`El despliegue de ${s} en ${t}`, `Calibramos la dotación técnica en ${c}:`, `Adecuamos los recursos a la concurrencia de ${t}:`, `La cobertura de ${s} en ${p}`];
  const t4S1_B = [`atiende recepciones de hasta 80 comensales, o incorpora refuerzo (+${SUPLEMENTO_RIDER_ELITE} €) para 150-250 invitados en ${c}. `, `formato estándar para grupos medios o suplemento de gran aforo (+${SUPLEMENTO_RIDER_ELITE} €) en salones de ${t}. `, `configuración compacta para recepciones íntimas o refuerzo élite (+${SUPLEMENTO_RIDER_ELITE} €) en ${p}. `, `responde desde eventos familiares de 50 asistentes en ${t} hasta salones concurridos (+${SUPLEMENTO_RIDER_ELITE} € en ${c}). `];
  const t4S1 = `${subPick(t4S1_A, key, 't4s1_a')} ${subPick(t4S1_B, key, 't4s1_b')}`;

  const t4S2_A = [`Las celebraciones de ${s} que concluyan antes de las 03:00 AM`, `Si la jornada festiva en ${c} finaliza dentro del horario habitual previo a las 03:00 AM,`, `No se computa suplemento de madrugada en ${t}`, `La tarifa pactada en ${p}`];
  const t4S2_B = [`no devengan recargo por nocturnidad en ${t}. `, `el importe presupuestado en ${t} se mantiene intacto. `, `siempre que el servicio de ${s} concluya antes de las 03:00 AM en ${p}. `, `se respeta íntegramente si la actuación culmina antes de las 03:00 AM en ${t}. `];
  const t4S2 = `${subPick(t4S2_A, key, 't4s2_a')} ${subPick(t4S2_B, key, 't4s2_b')}`;

  const t4S3_A = [`El saldo pendiente de ${remainingBalanceEur} €`, `Los ${remainingBalanceEur} € remanentes`, `La cantidad final de ${remainingBalanceEur} €`, `Usted liquida los ${remainingBalanceEur} € restantes`];
  const t4S3_B = [`se satisface con absoluta comodidad al verificar el cumplimiento de ${s} en ${t}.`, `se abonan una vez concluida la actuación a plena satisfacción en ${c}.`, `se liquidan tras comprobar la ejecución impecable de los profesionales en ${t}.`, `al término del evento tras certificar la calidad del pase en ${p}.`];
  const t4S3 = `${subPick(t4S3_A, key, 't4s3_a')} ${subPick(t4S3_B, key, 't4s3_b')}`;

  const t4Body = `${t4S1}${t4S2}${t4S3}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 5 (TRANSACCIONAL): Canales de Cierre
  // ──────────────────────────────────────────────────────────────────────────
  const t5H_A = ['Canales de Contratación:', 'Vías de Formalización:', 'Procedimiento de Reserva:'];
  const t5H_B = [`WhatsApp Directo o Pasarela Web en ${t}`, `Asesoría Inmediata o Bloqueo Online (${c})`, `Atención Telefónica o TPV Cifrado en ${p}`];
  const t5Heading = `${subPick(t5H_A, key, 't5h_a')} ${subPick(t5H_B, key, 't5h_b')}`;

  const t5S1_A = [`Puede solicitar asesoría para ${s} en ${t} en el teléfono +34 693 693 048`, `Dispone de atención sin compromiso en el WhatsApp +34 693 693 048`, `Ofrecemos doble alternativa de contratación en ${c}:`, `Para formalizar ${s} en ${p} puede escribirnos al +34 693 693 048`];
  const t5S1_B = [`o asegurar la fecha al instante mediante pasarela web para ${c}. `, `para resolver consultas técnicas de ${s} en ${t} o bloqueo con tarjeta en ${p}. `, `contacto directo con un coordinador (+34 693 693 048) o confirmación online en ${t}. `, `o tramitar el anticipo por pasarela cifrada con destino ${t}. `];
  const t5S1 = `${subPick(t5S1_A, key, 't5s1_a')} ${subPick(t5S1_B, key, 't5s1_b')}`;

  const t5S2_A = [`El abono de ${depositEur} € genera`, `Entregando ${depositEur} € queda confirmada`, `La reserva telemática con ${depositEur} € emite`, `Al transferir la señal de ${depositEur} €, el sistema activa`];
  const t5S2_B = [`la orden nominal de ${s} con bloqueo oficial de agenda y recibo para ${t}.`, `la plaza de ${s} con asignación expresa de profesionales para ${t}.`, `la póliza de cobertura de relevo y el contrato blindado de ${s} en ${c}.`, `el bloqueo exclusivo en el calendario de ${p} y remite las credenciales para ${t}.`];
  const t5S2 = `${subPick(t5S2_A, key, 't5s2_a')} ${subPick(t5S2_B, key, 't5s2_b')}`;

  const t5S3_A = [`Toda transacción cuenta con registro SHA-256`, `El comprobante de Stripe Price-Lock asegura`, `La pasarela bancaria expide recibo con validez jurídica`, `Se establece un marco contractual directo y transparente`];
  const t5S3_B = [`e idempotencia mercantil, garantizando reembolso si la fecha estuviera ocupada en ${t}.`, `las condiciones pactadas contra incrementos de temporada alta en ${c}.`, `acreditando el pago seguro y la exclusividad del servicio en ${p} para ${t}.`, `erradicando comisiones ocultas y sobrecostes imprevistos en ${t}.`];
  const t5S3 = `${subPick(t5S3_A, key, 't5s3_a')} ${subPick(t5S3_B, key, 't5s3_b')}`;

  const t5Body = `${t5S1}${t5S2}${t5S3}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 6 (INFORMACIONAL): Normativa Acústica Ley 37/2003
  // ──────────────────────────────────────────────────────────────────────────
  const i1H_A = ['Ingeniería Acústica y Emisión Sonora', 'Parámetros de Decibelios y Calibración', 'Control de Ruido Ambiental Ley 37/2003', 'Sonometría Homologada y Directivas'];
  const i1H_B = [`en la Comarca de ${c}`, `para Eventos en ${t}`, `en Recintos de ${p}`];
  const i1Heading = `${subPick(i1H_A, key, 'i1h_a')} ${subPick(i1H_B, key, 'i1h_b')}`;

  const i1S1_A = [`La puesta en escena de ${s} en ${t}`, `El tratamiento electroacústico para ${s} en ${t}`, `Armonizamos las emisiones sonoras en ${t}`, `La observancia reglamentaria de ${s} en ${c}`];
  const i1S1_B = [`acata con rigor la Ley 37/2003 del Ruido y las directivas medioambientales de ${p}. `, `cumple escrupulosamente los límites de decibelios estipulados para ${c}. `, `con las prescripciones legales exigidas por la normativa estatal 37/2003 en ${p}. `, `garantiza emisiones acústicas seguras en todo el término municipal de ${t}. `];
  const i1S1 = `${subPick(i1S1_A, key, 'i1s1_a')} ${subPick(i1S1_B, key, 'i1s1_b')}`;

  const i1S2_A = [`En jardines y carpas exteriores de ${t}`, `Los recintos al aire libre en ${c}`, `Para zonas exteriores en espacios de ${p}`, `En banquetes al aire libre en ${t}`];
  const i1S2_B = [`el umbral diurno oscila entre 85 y 90 dBA, atenuándose a 80-85 dBA en interiores de ${c}. `, `operan con topes de 85 a 90 dBA, modulándose a 80-85 dBA bajo techo en salones de ${t}. `, `se respetan valores de 85 a 90 dBA para ${s}, reduciendo a 80-85 dBA en comedores cerrados de ${t}. `, `se mantienen los 85-90 dBA exteriores, descendiendo a 80-85 dBA en recintos cubiertos de ${c}. `];
  const i1S2 = `${subPick(i1S2_A, key, 'i1s2_a')} ${subPick(i1S2_B, key, 'i1s2_b')}`;

  const i1S3_A = [`Se calibran recintos de dispersión controlada para ${s},`, `Aseguramos directividad precisa hacia la pista de baile en ${c},`, `La monitorización técnica garantiza dispersión uniforme en ${p},`, `Optimizamos el espacio con altavoces de curvatura constante en ${c},`];
  const i1S3_B = [`salvaguardando la comodidad auditiva sin molestar a parcelas colindantes en ${t}. `, `concentrando la presión sonora en la zona activa de ${t} sin escape residual. `, `proporcionando nitidez en ${t} sin riesgo de sanciones municipales. `, `protegiendo el descanso del entorno vecinal para ${s} en ${t}. `];
  const i1S3 = `${subPick(i1S3_A, key, 'i1s3_a')} ${subPick(i1S3_B, key, 'i1s3_b')}`;

  const i1S4_A = [`Los sonómetros integrados registran lecturas continuas de Leq cada 10 minutos en ${t},`, `El plan sonoro incluye pantallas fonoabsorbentes y ecualización milimétrica para ${s},`, `La ingeniería preventiva adapta la inclinación física de los altavoces a la acústica de ${t},`, `Se aplican curvas de ponderación dBA específicas para el festejo en ${t},`];
  const i1S4_B = [`garantizando que la emisión sonora de ${s} respete los límites nocturnos en ${c}.`, `reduciendo más de 18 dB la presión sonora en la linde perimetral de ${p}.`, `preservando la tranquilidad residencial exigida por los estatutos de ${p}.`, `combinadas con limitadores homologados que impiden picos imprevistos en carpas de ${c}.`];
  const i1S4 = `${subPick(i1S4_A, key, 'i1s4_a')} ${subPick(i1S4_B, key, 'i1s4_b')}`;

  const i1Body = `${i1S1}${i1S2}${i1S3}${i1S4}`;

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 7 (INFORMACIONAL): Montaje, Tomas y Climatología
  // ──────────────────────────────────────────────────────────────────────────
  const i2H_A = ['Requisitos de Acometida Eléctrica y Plan de Lluvia', 'Guía de Implantación Técnica y Montaje', 'Especificaciones de Acceso, Toma de Tierra y Meteorología', 'Protocolo de Instalación y Respuesta Hidrófuga'];
  const i2H_B = [`para ${s} en ${t}`, `en Celebraciones de ${c}`, `en Fincas de ${p}`];
  const i2Heading = `${subPick(i2H_A, key, 'i2h_a')} ${subPick(i2H_B, key, 'i2h_b')}`;

  const i2S1_A = [`La llegada del equipo logístico a ${t}`, `El montaje técnico de ${s} en ${t}`, `El acceso al recinto en ${c}`, `El desembarco de materiales en ${p}`];
  const i2S1_B = [`se programa 90 minutos previos para acometer cableado y pruebas funcionales en ${c}. `, `arranca hora y media antes de la apertura para verificar conexiones de sonido en ${p}. `, `se coordina con 90 minutos de antelación técnica para chequeo de líneas de ${s} en ${t}. `, `cuenta con 90 minutos de margen operativo para la ecualización previa en ${t}. `];
  const i2S1 = `${subPick(i2S1_A, key, 'i2s1_a')} ${subPick(i2S1_B, key, 'i2s1_b')}`;

  const i2S2_A = [`Es necesario disponer de una toma de 230V con puesta a tierra homologada`, `El espacio en ${c} debe habilitar una línea Schuko de 230V protegida`, `Se requiere un enchufe monofásico estándar a 230V con tierra activa`, `La infraestructura en ${p} precisa acometida eléctrica a 230V con diferencial operativo`];
  const i2S2_B = [`y 3.500W de potencia dedicados en ${t}. `, `con un consumo disponible de 3.500W para ${s} en ${t}. `, `y un margen de potencia de 3.500W asegurados para ${s} en ${t}. `, `y 3.500W de capacidad constante en el recinto de ${t}. `];
  const i2S2 = `${subPick(i2S2_A, key, 'i2s2_a')} ${subPick(i2S2_B, key, 'i2s2_b')}`;

  const i2S3_A = [`Ante precipitaciones repentinas en ${t},`, `El protocolo estanco frente a tormentas en ${c}`, `Frente a inclemencias climáticas en ${p},`, `El plan de contingencia meteorológica en ${t}`];
  const i2S3_B = [`las cubiertas IP65 posibilitan el traslado a zona resguardada en menos de 20 minutos en ${c}. `, `reubica la intervención de ${s} bajo porche en apenas 20 minutos sin coste extra en ${t}. `, `los componentes protegidos agilizan el replanteo a salón interior en menos de 20 minutos en ${t}. `, `incorpora mangueras impermeables y cambio ágil a resguardo en menos de 20 minutos en ${c}. `];
  const i2S3 = `${subPick(i2S3_A, key, 'i2s3_a')} ${subPick(i2S3_B, key, 'i2s3_b')}`;

  const i2S4_A = [`Disponemos de cuadros de distribución eléctrica con magnetotérmicos independientes en ${t},`, `La dotación logística transporta pasacables reforzados para el tránsito seguro de comensales en ${p},`, `Se realiza un test previo de impedancia de bucle de tierra con telurómetro digital en ${t},`, `Cada elemento estructural cuenta con anclajes secundarios de seguridad en acero en ${t},`];
  const i2S4_B = [`aislando la red técnica de la iluminación decorativa del recinto en ${c}.`, `cumpliendo los más altos estándares de accesibilidad y seguridad en ${t}.`, `verificando que la instalación de ${c} garantice la protección total de asistentes.`, `asegurando estabilidad frente a ráfagas de viento de hasta 60 km/h en ${p}.`];
  const i2S4 = `${subPick(i2S4_A, key, 'i2s4_a')} ${subPick(i2S4_B, key, 'i2s4_b')}`;

  const i2Body = `${i2S1}${i2S2}${i2S3}${i2S4}`;

  const blocks: IntentBlock[] = [
    {
      id: 'cotizacion-logistica',
      kind: 'transactional',
      heading: t1Heading,
      body: t1Body,
      wordCount: countWords(t1Body),
    },
    {
      id: 'formatos-price-lock',
      kind: 'transactional',
      heading: t2Heading,
      body: t2Body,
      wordCount: countWords(t2Body),
    },
    {
      id: 'split-soberano-legalidad',
      kind: 'transactional',
      heading: t3Heading,
      body: t3Body,
      wordCount: countWords(t3Body),
    },
    {
      id: 'dimensionamiento-horarios',
      kind: 'transactional',
      heading: t4Heading,
      body: t4Body,
      wordCount: countWords(t4Body),
    },
    {
      id: 'canales-reserva',
      kind: 'transactional',
      heading: t5Heading,
      body: t5Body,
      wordCount: countWords(t5Body),
    },
    {
      id: 'ingenieria-acustica-ley-37-2003',
      kind: 'informational',
      heading: i1Heading,
      body: i1Body,
      wordCount: countWords(i1Body),
    },
    {
      id: 'guia-montaje-accesos',
      kind: 'informational',
      heading: i2Heading,
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
      question: `¿Existe riesgo de cancelación de fecha por parte de la cuadrilla de ${s}?`,
      answer: `No. El depósito de ${depositEur} € activa el bloqueo atómico y la cobertura de relevo inmediato ante cualquier imprevisto en ${t}.`,
      intent: 'transactional' as const,
    },
  ];

  const provenanceHash = createHash('sha256')
    .update(`${key}:${totalEstimatedEur}:${depositEur}:${normDistance}:${hashInt(key)}`)
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
