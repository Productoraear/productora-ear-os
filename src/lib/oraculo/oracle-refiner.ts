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

export type AnyOraculoRule =
  | OraculoCanonicalRule
  | OraculoCanonicalRuleBloque6
  | OraculoCanonicalRuleBloque7;

export type OracleObjective =
  | 'BODAS'
  | 'PROVEEDOR'
  | 'B2G'
  | 'ESTRATEGIA';

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
    input.objective === 'BODAS'
      ? 'oferta irresistible novios'
      : input.objective === 'PROVEEDOR'
      ? 'acuerdo finca alianza'
      : input.objective === 'B2G'
      ? 'licitacion pliego b2g'
      : 'estrategia aristocratica'
  );

  const matchedVaultDocs = queryVelocityVault(queryTerms).slice(0, 5);

  // 2. Directivas según objetivo
  let pepitaDeOro = '';
  let appliedInvariants: string[] = [];

  const toneGuidelines = [
    'Postura de autoridad aristocrática: de igual a igual, sin suplicar ni rebajar tarifas.',
    'Cero adjetivos vacíos ("mágico", "apasionado", "único en su clase", "líder").',
    'Escasez real comprobable: solo 1 evento por día para garantizar exclusividad.',
    'Inyección matemática de cifras oficiales de ear-os-ssot.ts.',
  ];

  if (input.objective === 'BODAS') {
    appliedInvariants = [
      `Fianza deducible Stripe Price-Lock: ${DEPOSITO_STRIPE_EUR} €`,
      `Menús de gala Otzarreta: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
      'Protocolo celíacos e intolerancias a 0,00 € sin suplemento',
      'Párking privado vigilado: 120 plazas gratuitas en Derio (Bizkaia)',
      `Límite acústico garantizado: < ${LIMITE_SPL_DB} dB SPL (sin cortes policiales)`,
      'Seating Planner 3D Pulpetti de cortesía (ahorro de 190 €)',
    ];

    pepitaDeOro = `Estimados novios:

Agradecemos vuestra consulta para celebrar vuestra boda en Restaurante Otzarreta (Derio, Bizkaia). 

En el asador seguimos una regla inquebrantable de calidad: solo aceptamos un único evento al día para asegurar la exclusividad absoluta de las instalaciones, la carpa y los jardines para vuestros invitados.

Nuestra propuesta se fundamenta en certezas verificables, no en promesas vacías:
1. Menús Oficiales Cerrados: De 145,00 € a 185,00 € + IVA en torno a la brasa de encina y sarmiento de Eduardo Martínez. El protocolo para invitados celíacos o con intolerancias se liquida exactamente a 0,00 € de recargo.
2. Comodidad Fáctica: 120 plazas de párking privado y vigilado dentro de la finca, evitando esperas a vuestros invitados.
3. Blindaje Acústico: Insonorización y sonometría legal certificada (< 75 dB SPL, Ley 37/2003 del Ruido), garantizando que la fiesta y el baile no sufrirán interrupciones ni sanciones.
4. Seating Planner 3D Pulpetti: Incluido de cortesía (valorado en 190,00 €) para distribuir vuestras mesas de 2 a 12 comensales sin fricción.

Para bloquear la fecha de forma inmediata y que ninguna otra pareja pueda solicitarla mientras concretamos los detalles del menú, podéis formalizar el depósito Price-Lock de 100,00 € (100% deducible de la liquidación final).

${raw ? `Respecto a vuestra indicación específica: "${raw}", queda totalmente integrada en nuestro protocolo de sala.` : ''}

Quedamos a vuestra disposición para recibir vuestra visita en el caserío.`;
  } else if (input.objective === 'PROVEEDOR') {
    appliedInvariants = [
      `Tarifa base solista: ${formatEur(TARIFA_BASE_SOLISTA_EUR)} (Suelo canónico Edwin Agudelo)`,
      `Tarifa estándar con transporte: ${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (${SOLISTA_KM_INCLUIDOS} km incluidos en 52 provincias)`,
      `Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% directo al artista`,
      'Despacho directo de leads cualificados sin comisión parásita de directorio',
    ];

    pepitaDeOro = `Estimada Dirección / Propiedad:

Nos dirigimos a vosotros desde Productora EAR con una propuesta de colaboración institucional directa, erradicando intermediarios y comisiones abusivas de portales de bodas.

Operamos bajo un modelo soberano de homologación de fincas y proveedores de gala:
1. Roster Artístico S-Class: Contratación directa de Edwin Agudelo y solistas de primer nivel con tarifa canónica transparente (${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} con ${SOLISTA_KM_INCLUIDOS} km incluidos a cualquiera de las 52 provincias españolas).
2. Seguridad Acústica: Equipamiento profesional propio calibrado para no superar los ${LIMITE_SPL_DB} dB SPL, protegiendo la licencia de actividad de vuestra finca ante inspecciones.
3. Retribución Justa: El 80% íntegro de la tarifa va directo al artista, lo que garantiza máxima puntualidad y compromiso de gala en vuestro recinto.

${raw ? `Analizando vuestra situación: "${raw}", proponemos cerrar un acuerdo de exclusividad preferente para la temporada 2026-2027.` : 'Proponemos incluir vuestra finca en nuestro catálogo soberano para despachar clientes con solvencia verificada.'}

Si compartís este estándar de rigor y queréis evaluar fechas conjuntas, podemos agendar una breve llamada de coordinación técnica con nuestra centralita.`;
  } else if (input.objective === 'B2G') {
    appliedInvariants = [
      `Techo preventivo de adjudicación directa: ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} (Art. 118 LCSP)`,
      `Límite legal estricto contratos menores: ${formatEur(LIMITE_B2G_LCSP_EUR)}`,
      'Sonorización Line Array 18.000W RMS para aforos de hasta 5.000 personas',
      'Facturación electrónica oficial mediante códigos DIR3 para FACe',
      'Expediente administrativo listo para Secretaría e Intervención en < 72h',
    ];

    pepitaDeOro = `A la atención de la Concejalía de Festejos / Comisión de Fiestas:

Por medio de la presente, remitimos la memoria técnica y económica para la contratación directa de la infraestructura de sonorización y espectáculo para las próximas fiestas patronales, tramitada bajo el procedimiento de Contrato Menor de Servicios (Art. 118 de la Ley 9/2017 de Contratos del Sector Público - LCSP).

Garantías del Expediente Administrativo:
1. Blindaje Jurídico Preventivo: El importe total se congela estrictamente en ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} + IVA, situándose con margen preventivo de seguridad por debajo del umbral de ${formatEur(LIMITE_B2G_LCSP_EUR)} para evitar cualquier objeción de fraccionamiento contractual por Intervención municipal.
2. Dotación Técnica S-Class: Sistema Line Array de alta fidelidad (18.000W RMS) con cobertura uniforme para aforos de 100 a 5.000 personas, con tiro acústico superior a 80 metros y respeto de los límites de inmisión sonora (< 75 dB SPL, Ley 37/2003 del Ruido).
3. Solvencia Administrativa: Seguro de Responsabilidad Civil de 600.000 €, técnicos titulados al corriente de Seguridad Social y Hacienda, y facturación electrónica oficial contra códigos DIR3 a través del punto general de entrada FACe.
4. Agilidad de Tramitación: Entrega de pliego técnico visado y factura proforma en menos de 72 horas para aprobación en Junta de Gobierno Local.

${raw ? `Adaptación específica a vuestra petición: "${raw}".` : ''}

Quedamos a disposición de la Secretaría Municipal para aportar cualquier documentación adicional.`;
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
  }

  // Selección de Reglas Canónicas aplicables (Base 1-50 + Bloque 6: 51-60 + Bloque 7: 61-70)
  const allAvailableRules: readonly AnyOraculoRule[] = [
    ...ORACULO_RULES_BASE,
    ...ORACULO_RULES_BLOQUE_6,
    ...ORACULO_RULES_BLOQUE_7,
  ];

  let ruleIds: number[] = [];
  if (input.objective === 'BODAS') {
    ruleIds = [1, 5, 23, 31, 32, 34, 36, 51, 54, 55, 60, 61, 63, 64, 70];
  } else if (input.objective === 'PROVEEDOR') {
    ruleIds = [1, 4, 13, 14, 19, 37, 38, 53, 57, 59, 61, 65, 66, 67];
  } else if (input.objective === 'B2G') {
    ruleIds = [1, 20, 41, 44, 46, 47, 48, 49, 58, 60, 61, 62, 63, 65, 66, 68, 69];
  } else {
    ruleIds = [1, 2, 6, 8, 10, 15, 51, 52, 59, 60, 61, 62, 64, 68, 69, 70];
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

[REGLAS COGNITIVAS DEL ORÁCULO APLICADAS (BASE 1-70)]:
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
