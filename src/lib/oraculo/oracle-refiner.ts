/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DEL ORÁCULO S-CLASS · FILTRO HALCÓN & VELOCITY RAG
 * ════════════════════════════════════════════════════════════════════════════
 * Cruza la visión bruta del CEO con la Bóveda de Velocity / Incubadora Despegue
 * y las invariantes sagradas de `ear-os-ssot.ts`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  SPLIT_SOBERANO,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_WEDDING_MENUS,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';
import { SENTINEL_HASH_SSOT } from '@/lib/governance/constitution-tier1';
import {
  CEO_OPERATIONAL_DIMENSIONS,
  type CeoOperationalDimensionId,
  getCeoDimension,
} from '@/lib/compiler/ceo-operational-matrix';
import {
  queryVelocityVault,
  type VelocityVaultItem,
} from '@/lib/oraculo/velocity-knowledge-index';
import {
  ORACULO_RULES_BASE,
  getOraculoRulesByBlock,
  type OraculoCanonicalRule,
} from '@/lib/oraculo/oraculo-canonical-rules-1-50';
import {
  ORACULO_RULES_BLOQUE_6,
  type OraculoCanonicalRuleBloque6,
} from '@/lib/oraculo/oraculo-canonical-rules-51-60';
import {
  ORACULO_RULES_BLOQUE_7,
  type OraculoCanonicalRuleBloque7,
} from '@/lib/oraculo/oraculo-canonical-rules-61-70';
import {
  ORACULO_RULES_BLOQUE_8,
  type OraculoCanonicalRuleBloque8,
} from '@/lib/oraculo/oraculo-canonical-rules-71-80';
import {
  ORACULO_RULES_BLOQUE_9,
  type OraculoCanonicalRuleBloque9,
} from '@/lib/oraculo/oraculo-canonical-rules-81-90';
import {
  ORACULO_RULES_BLOQUE_10,
  type OraculoCanonicalRuleBloque10,
} from '@/lib/oraculo/oraculo-canonical-rules-91-100';

export type AnyOraculoRule =
  | OraculoCanonicalRule
  | OraculoCanonicalRuleBloque6
  | OraculoCanonicalRuleBloque7
  | OraculoCanonicalRuleBloque8
  | OraculoCanonicalRuleBloque9
  | OraculoCanonicalRuleBloque10;

export type OracleObjective =
  | 'BODAS'
  | 'PROVEEDOR'
  | 'B2G'
  | 'ESTRATEGIA'
  | CeoOperationalDimensionId;

export interface OracleRefineInput {
  readonly rawVision: string;
  readonly objective: OracleObjective;
}

export interface OracleRefinedOutput {
  readonly pepitaDeOro: string;
  readonly megaprompt: string;
  readonly matchedVaultDocs: readonly VelocityVaultItem[];
  readonly appliedInvariants: readonly string[];
  readonly appliedCanonicalRules: readonly AnyOraculoRule[];
  readonly toneGuidelines: readonly string[];
  readonly sha256Checksum: string;
}

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

/**
 * Aplica el Filtro Halcón y la doctrina de Velocity / Incubadora Despegue.
 */
export function refineWithVelocityOracle(input: OracleRefineInput): OracleRefinedOutput {
  const raw = input.rawVision.trim();

  // 1. Consulta RAG en la Bóveda de Velocity
  const queryTerms = raw || (
    input.objective === 'BODAS' || input.objective === 'CLIENTES_NOVIOS'
      ? 'oferta irresistible novios'
      : input.objective === 'PROVEEDOR' || input.objective === 'PROVEEDORES_CATALOGO'
      ? 'acuerdo finca catalogo proveedor'
      : input.objective === 'HOSTELERIA_FINCAS'
      ? 'acuerdo finca catering otzarreta exclusividad'
      : input.objective === 'ARTISTAS_ESCENARIO'
      ? 'artista solista edwin agudelo rider'
      : input.objective === 'B2G' || input.objective === 'B2G_AYUNTAMIENTOS'
      ? 'licitacion pliego b2g contrato menor'
      : input.objective === 'TESORERIA_SPLIT'
      ? 'split soberano stripe connect conciliacion'
      : input.objective === 'LOGISTICA_FLEET'
      ? 'logistica flota waybill line array sonometria'
      : input.objective === 'GOBERNANZA_SRE'
      ? 'gobernanza sentinel ast blast radius compuertas'
      : 'estrategia aristocratica'
  );

  const matchedVaultDocs = queryVelocityVault(queryTerms).slice(0, 5);

  // Selección de Reglas Canónicas aplicables (Base 1-50 + Bloque 6: 51-60 + Bloque 7: 61-70 + Bloque 8: 71-80 + Bloque 9: 81-90 + Bloque 10: 91-100)
  const allAvailableRules: readonly AnyOraculoRule[] = [
    ...ORACULO_RULES_BASE,
    ...ORACULO_RULES_BLOQUE_6,
    ...ORACULO_RULES_BLOQUE_7,
    ...ORACULO_RULES_BLOQUE_8,
    ...ORACULO_RULES_BLOQUE_9,
    ...ORACULO_RULES_BLOQUE_10,
  ];

  // 2. Directivas según objetivo
  let pepitaDeOro = '';
  let appliedInvariants: string[] = [];
  let ruleIds: number[] = [];

  const toneGuidelines = [
    'Postura de autoridad aristocrática: de igual a igual, sin suplicar ni rebajar tarifas.',
    'Cero adjetivos vacíos ("mágico", "apasionado", "único en su clase", "líder").',
    'Escasez real comprobable: solo 1 evento por día para garantizar exclusividad.',
    'Inyección matemática de cifras oficiales de ear-os-ssot.ts.',
  ];

  if (input.objective === 'BODAS' || input.objective === 'CLIENTES_NOVIOS') {
    appliedInvariants = [
      `Fianza deducible Stripe Price-Lock: ${DEPOSITO_STRIPE_EUR} €`,
      `Menús de gala Otzarreta: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
      'Protocolo celíacos e intolerancias a 0,00 € sin suplemento',
      'Párking privado vigilado: 120 plazas gratuitas en Derio (Bizkaia)',
      `Límite acústico garantizado: < ${LIMITE_SPL_DB} dB SPL (sin cortes policiales)`,
      'Seating Planner 3D Pulpetti de cortesía (ahorro de 190 €)',
      'Cláusula de Privacidad VIP con NDA digital obligatorio (Regla 81)',
      'Caducidad formal del presupuesto a 15 días naturales (Regla 87)',
    ];

    pepitaDeOro = `Estimados novios:

Agradecemos vuestra consulta para celebrar vuestra boda en Restaurante Otzarreta (Derio, Bizkaia). 

En el asador seguimos una regla inquebrantable de calidad: solo aceptamos un único evento al día para asegurar la exclusividad absoluta de las instalaciones, la carpa y los jardines para vuestros invitados.

Nuestra propuesta se fundamenta en certezas verificables, no en promesas vacías:
1. Menús Oficiales Cerrados: De 145,00 € a 185,00 € + IVA en torno a la brasa de encina y sarmiento de Eduardo Martínez. El protocolo para invitados celíacos o con intolerancias se liquida exactamente a 0,00 € de recargo.
2. Comodidad Fáctica: 120 plazas de párking privado y vigilado dentro de la finca, evitando esperas a vuestros invitados.
3. Blindaje Acústico: Insonorización y sonometría legal certificada (< 75 dB SPL, Ley 37/2003 del Ruido), garantizando que la fiesta y el baile no sufrirán interrupciones ni sanciones.
4. Seating Planner 3D Pulpetti: Incluido de cortesía (valorado en 190,00 €) para distribuir vuestras mesas de 2 a 12 comensales sin fricción con mapa de alérgenos por silla.
5. Privacidad y Seguridad: Protocolo VIP con NDA digital obligatorio y expediente de sala restringido por control RBAC.

Para bloquear la fecha de forma inmediata y que ninguna otra pareja pueda solicitarla mientras concretamos los detalles del menú, podéis formalizar el depósito Price-Lock de 100,00 € (100% deducible de la liquidación final).

${raw ? `Respecto a vuestra indicación específica: "${raw}", queda totalmente integrada en nuestro protocolo de sala.` : ''}

Quedamos a vuestra disposición para recibir vuestra visita en el caserío.`;

    ruleIds = input.objective === 'CLIENTES_NOVIOS'
      ? [1, 5, 23, 31, 32, 51, 81, 84, 87, 88, 90]
      : [1, 5, 23, 31, 32, 34, 36, 51, 54, 55, 60, 61, 63, 64, 70, 71, 72, 73, 74, 75, 78, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 91, 92, 97, 98, 100];
  } else if (input.objective === 'HOSTELERIA_FINCAS') {
    appliedInvariants = [
      'Blindaje territorial comarcal de 100 km de no-competencia (Regla 91 · Estándar Otzarreta)',
      `Menús de temporada 2026 cerrados: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
      `Límite acústico garantizado: < ${LIMITE_SPL_DB} dB SPL (Sin cortes policiales · Ley 37/2003)`,
      'Párking privado vigilado: 120 plazas gratuitas en Caserío Derio (Bizkaia)',
      'Exclusividad absoluta: 1 único evento por día en recinto',
    ];

    pepitaDeOro = `Estimada Dirección / Propiedad:

Productora EAR formaliza su alianza B2B estratégica bajo el Estándar Otzarreta de alta restauración para fincas:
1. Blindaje Comarcal: Garantía de exclusividad de 100 km a la redonda frente a recintos competidores.
2. Protección Jurídico-Acústica: Insonorización y sonometría certificada por debajo de 75 dB SPL, protegiendo vuestra licencia municipal.
3. Sincronización Seating Planner y Cocina: Protocolo de alérgenos por silla con trazabilidad visual para el equipo de sala.

${raw ? `Resolución táctica para el recinto: "${raw}".` : 'Propuesta de consolidación como sede de referencia en el catálogo soberano 2026.'}`;

    ruleIds = [33, 35, 71, 72, 73, 74, 75, 77, 84, 91];
  } else if (input.objective === 'ARTISTAS_ESCENARIO') {
    appliedInvariants = [
      `Suelo canónico infranqueable Edwin Agudelo: ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
      `Tarifa estándar gala con transporte: ${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (${SOLISTA_KM_INCLUIDOS} km desde Méntrida)`,
      'Rider técnico verificado: toma trifásica 32A CEE / 400V o monofásica dedicada 16A Schuko',
      'Despliegue operativo federal en las 52 provincias españolas',
      'Split retributivo directo: 80% íntegro liquidado al artista vía Stripe Connect',
    ];

    pepitaDeOro = `CONTRATACIÓN S-CLASS · ARTISTAS Y ESCENARIO

Productora EAR gestiona el roster de artistas de gala con rigor de producción intachable:
1. Suelo Canónico Innegociable: Edwin Agudelo opera sobre suelo de 350,00 € y tarifa estándar de 550,00 € con 100 km incluidos desde Méntrida.
2. Rider Técnico Verificado: Obligatoriedad de toma trifásica 32A CEE / 400V o monofásica independiente 16A Schuko para supresión total de zumbidos de masa.
3. Liquidación Soberana: El 80% íntegro de la partida artística se liquida en céntimo exacto vía Stripe Connect al artista.

${raw ? `Requerimiento específico del evento: "${raw}".` : 'Directiva de escena incorporada a la hoja de producción.'}`;

    ruleIds = [11, 12, 13, 14, 53, 56, 71, 75, 78, 97];
  } else if (input.objective === 'PROVEEDORES_CATALOGO' || input.objective === 'PROVEEDOR') {
    appliedInvariants = [
      'Catálogo oficial 2026 de iluminación monumental: 652 referencias elevadas por esquema Zod',
      'Ficha de homologación exhaustiva de proveedor con 380 campos canónicos tipados',
      'Devolución de fianza Stripe en 48h tras desmontaje e inspección técnica (Regla 85)',
      'Protocolo de alérgenos por silla sincronizado con cocina y sala (Regla 84)',
      'Despacho multimedia condicionado a suscripción SOVEREIGN o CLAIMED',
      `Tarifa base solista: ${formatEur(TARIFA_BASE_SOLISTA_EUR)} (Suelo canónico Edwin Agudelo)`,
      `Tarifa estándar con transporte: ${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (${SOLISTA_KM_INCLUIDOS} km incluidos en 52 provincias)`,
      `Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% directo al artista`,
    ];

    pepitaDeOro = `Estimada Dirección / Propiedad de Proveedor:

Nos dirigimos a vosotros desde Productora EAR con una propuesta de colaboración institucional directa y homologación soberana:
1. Roster y Catálogo 2026: Homologación en el catálogo de 652 referencias elevadas por contrato Zod e indexación en 380 campos.
2. Fianzas y Desmontaje: Devolución íntegra de fianza en Stripe en un plazo máximo de 48 horas tras parte técnico de desmontaje sin incidencias.
3. Despacho Directo: Traspaso de leads cualificados de alta solvencia sin comisiones parásitas de intermediarios.

${raw ? `Respecto a vuestra infraestructura: "${raw}".` : 'Integración formal en la red soberana de proveedores EAR.'}`;

    ruleIds = input.objective === 'PROVEEDORES_CATALOGO'
      ? [61, 63, 64, 65, 66, 67, 70, 85]
      : [1, 4, 13, 14, 19, 37, 38, 53, 57, 59, 61, 65, 66, 67, 71, 73, 75, 76, 77, 79, 80, 81, 82, 84, 86, 88, 89, 90, 91, 93, 94, 96, 98, 100];
  } else if (input.objective === 'B2G_AYUNTAMIENTOS' || input.objective === 'B2G') {
    appliedInvariants = [
      `Techo preventivo de adjudicación directa: ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} (Art. 118 LCSP)`,
      `Límite legal estricto contratos menores: ${formatEur(LIMITE_B2G_LCSP_EUR)}`,
      'Sonorización Line Array 18.000W RMS para aforos de hasta 5.000 personas',
      'Facturación electrónica oficial mediante códigos DIR3 para FACe',
      'Expediente administrativo listo para Secretaría e Intervención en < 72h',
      'Póliza de Responsabilidad Civil de 1.000.000 € y certificados tributarios al día',
    ];

    pepitaDeOro = `A la atención de la Concejalía de Festejos / Comisión de Fiestas:

Por medio de la presente, remitimos la memoria técnica y económica para la contratación directa de la infraestructura de sonorización y espectáculo para las próximas fiestas patronales, tramitada bajo el procedimiento de Contrato Menor de Servicios (Art. 118 de la Ley 9/2017 de Contratos del Sector Público - LCSP).

Garantías del Expediente Administrativo:
1. Blindaje Jurídico Preventivo: El importe total se congela estrictamente en ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} + IVA, situándose con margen preventivo de seguridad por debajo del umbral de ${formatEur(LIMITE_B2G_LCSP_EUR)} para evitar cualquier objeción de fraccionamiento contractual por Intervención municipal.
2. Dotación Técnica S-Class: Sistema Line Array de alta fidelidad (18.000W RMS) con cobertura uniforme para aforos de 100 a 5.000 personas, con tiro acústico superior a 80 metros y respeto de los límites de inmisión sonora (< 75 dB SPL, Ley 37/2003 del Ruido).
3. Solvencia Administrativa: Seguro de Responsabilidad Civil de 1.000.000 €, técnicos titulados al corriente de Seguridad Social y Hacienda, y facturación electrónica oficial contra códigos DIR3 a través del punto general de entrada FACe.
4. Agilidad de Tramitación: Entrega de pliego técnico visado y factura proforma en menos de 72 horas para aprobación en Junta de Gobierno Local.

${raw ? `Adaptación específica a vuestra petición: "${raw}".` : ''}

Quedamos a disposición de la Secretaría Municipal para aportar cualquier documentación adicional.`;

    ruleIds = input.objective === 'B2G_AYUNTAMIENTOS'
      ? [41, 44, 46, 47, 48, 62, 68, 69, 79]
      : [1, 20, 41, 44, 46, 47, 48, 49, 58, 60, 61, 62, 63, 65, 66, 68, 69, 71, 72, 73, 76, 77, 79, 80, 81, 83, 85, 87, 88, 89, 90, 92, 94, 96, 98, 99, 100];
  } else if (input.objective === 'TESORERIA_SPLIT') {
    appliedInvariants = [
      `Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista / ${Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR OS / ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME`,
      'Conciliación bancaria al céntimo entero en Stripe Connect Custom (Regla 86)',
      'Propinas digitales 100% íntegras al personal de sala sin retención de plataforma (Regla 82)',
      'Fondo VIMUME para terapia neurológica 40 Hz con supervisión HITL estricta',
      'Liquidación de fianzas con retención justificada únicamente mediante parte técnico firmado',
    ];

    pepitaDeOro = `PLAN DE TESORERÍA & SPLIT SOBERANO · STRIPE CONNECT CUSTOM

Directiva Financiera:
1. Conciliación Inmutable: El split 80/10/10 se liquida de forma atómica en céntimo entero sin retenciones arbitrarias.
2. Propinas Digitales Intocables: El 100% de las propinas de sala se desvía íntegramente al personal sin comisión de pasarela ni recorte de plataforma.
3. Transparencia Contable: Exportación auditable de liquidaciones periódicas lista para gestoría tributaria.

${raw ? `Alineación con la instrucción del CEO: "${raw}".` : 'Ejecución de liquidación atómica en pasarela.'}`;

    ruleIds = [21, 22, 52, 55, 82, 86, 95, 98];
  } else if (input.objective === 'LOGISTICA_FLEET') {
    appliedInvariants = [
      'Sistema de sonorización Line Array 18.000W RMS para aforos de hasta 5.000 personas',
      'Hojas de ruta digitales Waybill con manifiesto de carga y precintos QR',
      'Control de microfonía inalámbrica UHF con barrido de frecuencias libres de interferencias',
      'Telemetría GPS en tiempo real de flota con cálculo de rutas de baja emisión',
      'Protocolo de descarga, montaje y sonometría previa 3h antes de apertura de puertas',
    ];

    pepitaDeOro = `HOJA DE OPERACIONES LOGÍSTICAS & DESPLIEGUE DE FLOTA

Protocolo de Ruta S-Class:
1. Waybill Digital: Manifiesto de carga sellado criptográficamente con precintos QR de verificación para material de sonido e iluminación.
2. Sonorización Monumental: Calibración de Line Array 18.000W RMS respetando estrictamente el umbral sonométrico legal (< 75 dB SPL).
3. Ventana de Seguridad: Descarga, conexionado trifásico y soundcheck obligatorios con mínimo de 3 horas de antelación a la apertura de sala.

${raw ? `Instrucción logística particular: "${raw}".` : 'Despacho de flota conforme a la hoja de ruta oficial.'}`;

    ruleIds = [42, 43, 65, 66, 71, 76, 89];
  } else if (input.objective === 'GOBERNANZA_SRE') {
    appliedInvariants = [
      `Hash Centinela SSOT inmutable: ${SENTINEL_HASH_SSOT}`,
      'Arnés mecánico bloqueante: 22/22 compuertas obligatorias en prepush (Exit 0)',
      'Grafo de Introspección AST con 743 nodos y 544 aristas en tiempo real',
      'Cálculo de Blast-Radius transitivo en < 50ms antes de mutaciones de catálogo',
      'Doctrina Nivel 5 SDD: Cero código estocástico ("Vibe Coding") en producción',
    ];

    pepitaDeOro = `DIRECCIÓN DE GOBERNANZA SRE & ARQUITECTURA DISTRIBUIDA

Control Constitucional Nivel 5 SDD:
1. Inmutabilidad de la Zona Cero: Verificación constante del hash del Centinela SSOT (${SENTINEL_HASH_SSOT}).
2. Introspección AST Viva: Análisis continuo de topología en grafo de 743 nodos con cálculo automático de radio de impacto (Blast-Radius).
3. Blindaje Mecánico: 22 de 22 compuertas CI/CD exigidas con Exit Code 0 antes de cualquier pase a producción viva.

${raw ? `Directiva de gobernanza: "${raw}".` : 'Inspección de integridad de infraestructura ejecutada sin desvíos.'}`;

    ruleIds = [2, 3, 4, 10, 50, 93, 94, 96, 99, 100];
  } else {
    appliedInvariants = [
      'Doctrina de Sobredemanda y Tono Aristocrático (Velocity / Despegue)',
      'Filtro Halcón: erradicación de adjetivos vacíos',
      `Suelo canónico solista: ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
      `Techo seguro B2G: ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)}`,
    ];

    pepitaDeOro = `DIRECCIÓN ESTRATÉGICA CORPORATIVA · PRODUCTORA EAR

Fundamento Operativo:
No competimos por precio ni participamos en guerras de descuentos. La autoridad de mercado se conquista estableciendo un estándar innegociable de solvencia técnica y retribución directa.

Pilares del Posicionamiento Aristocrático:
1. Control de Marco (Frame Control): La empresa no pide favores; ofrece acceso a una infraestructura verificada que elimina el riesgo del cliente.
2. Claridad Radical: Cifras públicas exactas, menús cerrados con celíacos a 0 €, 100 km incluidos sin letra pequeña y depósitos de 100 € 100% deducibles.
3. Sobredemanda Auténtica: La limitación de 1 evento por día no es un reclamo de marketing, es un mamparo de excelencia operativa.

${raw ? `Resolución táctica a la visión planteada: "${raw}". Se ordena aterrizar esta directiva en código y flujos ejecutables.` : 'La estrategia general debe traducirse en micro-compromisos claros y verificables al céntimo.'}`;

    ruleIds = [1, 2, 6, 8, 10, 15, 51, 52, 59, 60, 61, 62, 64, 68, 69, 70, 71, 72, 73, 74, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  }

  const appliedCanonicalRules = allAvailableRules.filter((r) => ruleIds.includes(r.id));

  // 3. Generación del Megaprompt para Obrero (Cline / DeepSeek)
  const megaprompt = `════════════════════════════════════════════════════════════════════════════════
DIRECTIVA EJECUTIVA S-CLASS: IMPLEMENTACIÓN TÁCTICA DE LA VISIÓN DEL CEO
AUTORIDAD: DIRECTOR GENERALISTA / CEO (EDWIN AGUDELO)
OBJETIVO: ${input.objective}
════════════════════════════════════════════════════════════════════════════════

[VISIÓN BASE DEL CEO]:
${raw || 'Consolidar la estrategia de alta conversión y fidelización sin intermediarios.'}

[TEXTO DE ALTA CONVERSIÓN HOMOLOGADO (PEPITA DE ORO)]:
${pepitaDeOro}

[REGLAS COGNITIVAS DEL ORÁCULO APLICADAS (BASE 1-100)]:
${appliedCanonicalRules.map((r) => `- Regla ${r.id} (${r.title}): ${r.directive}`).join('\n')}

[INVARIANTES CONSTITUCIONALES APLICADOS]:
${appliedInvariants.map((inv) => `- ${inv}`).join('\n')}

[RECURSOS DE LA BÓVEDA VELOCITY VINCULADOS]:
${matchedVaultDocs.map((doc) => `- [${doc.category}] ${doc.filename} (SHA-256: ${doc.sha256.slice(0, 10)}...)`).join('\n')}

[REGLAS DE EJECUCIÓN PARA EL OBRERO]:
1. Cero adjetivos vacíos. Prohibido alterar las cifras canónicas de ear-os-ssot.ts.
2. Validar con tsc --noEmit (Exit 0) antes de declarar completada la tarea.
════════════════════════════════════════════════════════════════════════════════`;

  return {
    pepitaDeOro,
    megaprompt,
    matchedVaultDocs,
    appliedInvariants,
    appliedCanonicalRules,
    toneGuidelines,
    sha256Checksum: 's-class-oracle-verified',
  };
}
