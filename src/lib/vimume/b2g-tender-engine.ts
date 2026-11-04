import { createHash } from 'crypto';
import {
  getClinicalJustificationText,
  getLegalLcspJustificationText,
  getSroiJustificationText,
  getTechnicalRiderJustificationText
} from '@/lib/constants/vimume-100-levels';
import {
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  SAFE_LCSP_CEILING_EUR,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
  VAT_RATE,
  WATTS_PER_PAX
} from '@/lib/constants/ear-os-ssot';
import {
  buildN8nWebhookUrl,
  dispatchToN8n,
  getDeadLetterQueue,
  type N8nDispatchResult
} from '@/lib/services/n8n-dispatcher';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR B2G VIMUME — LICITACIÓN MENOR + DOSSIER NEUROACÚSTICO + CERTIFICADO RSC
 * ════════════════════════════════════════════════════════════════════════════
 * Capas (de abajo arriba) y su fuente única de verdad:
 *  1. SSOT monetario      → `@/lib/constants/ear-os-ssot` (INV-01…INV-04, INV-10).
 *  2. Split 80/10/10      → `SPLIT_SOBERANO`    · `computeSplitSoberano()`.
 *  3. Techo Art. 118 LCSP → `SAFE_LCSP_CEILING_EUR` (14.250,00 €) · `evaluateLicitacionB2G()`.
 *  4. Rider acústico      → `LIMITE_SPL_DB` / `WATTS_PER_PAX` · `evaluateAcousticRider()`.
 *  5. Fiscalidad          → Ley 49/2002 art. 20 · `computeLey492002Deduction()`.
 *  6. Idempotencia        → `buildCertificateIdempotencyKey()` (determinista, sin reloj).
 *  7. Entrega             → `dispatchToN8n()` (3 reintentos + Dead Letter Queue visible).
 *
 * Reglas que este módulo NO puede romper:
 *  · Ninguna cifra monetaria comercial se escribe a mano: se DERIVA del SSOT.
 *    (`B2G_PRESETS` eran 4.200 / 8.400 / 2.800 / 14.250 € literales; hoy son
 *     `sesiones × TARIFA_BASE_SOLISTA_EUR` y el techo preventivo del SSOT, con
 *     idéntico resultado numérico para no alterar la oferta publicada.)
 *  · Idempotencia real: N reintentos con la misma referencia producen **1 fila**
 *    (`CERTIFICATE_LEDGER`), porque la clave se deriva del contenido de negocio y
 *    nunca de `Date.now()` ni de `Math.random()` (INV-08).
 *  · Alcance declarado, no fingido: el ledger y la DLQ son `process-local`
 *    (no sobreviven a un redeploy ni se comparten entre réplicas). Se publica
 *    como campo `scope` en cada respuesta (AF-1/AF-2).
 *  · Cero PII en el payload del webhook: el contacto viaja como `contactRef`
 *    (SHA-256 truncado), nunca como email/teléfono en claro (INV-14).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Ruta pública donde se consultan la DLQ y las métricas del ledger. */
export const VIMUME_RSC_TELEMETRY_URL = '/api/vimume/rsc-certificate?scope=telemetry';

/**
 * Contrato de retorno único de todo motor/route/server-action.
 * Nunca se lanza una excepción cruda hacia el borde (defensa en profundidad).
 */
export interface EngineResult<T> {
  ok: boolean;
  error?: string;
  data?: T;
}

/** Redondeo monetario canónico (2 decimales, sin deriva de coma flotante). */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Redondeo de tipos efectivos (4 decimales). */
export function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

/** SHA-256 en hexadecimal sobre UTF-8. Única función de huella del módulo. */
export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Serialización JSON CANÓNICA (claves ordenadas, recursiva, `undefined` fuera).
 * Necesaria para que `payloadSha256` sea reproducible por el receptor: un hash
 * que cambia según el orden de las claves no es una prueba, es ruido.
 */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
}

/**
 * Ratio SROI declarado por la doctrina (AGENTS.md §10: «SROI 4.85x»).
 * Es una AFIRMACIÓN con fuente, no una constante del SSOT monetario: por eso se
 * publica con `provenance` en cada dossier (AF-4 · una cifra debe rastrearse).
 */
export const SROI_RATIO = 4.85;

/** Fuente citable del ratio SROI. */
export const SROI_PROVENANCE = 'AGENTS.md §10 · Impacto Social (SROI 4,85x)';

/** Objetivo de trabajo del protocolo 40 Hz dentro de la banda de confort. */
export const SPL_OBJETIVO_PROTOCOLO_40HZ_DB = 72;

/**
 * Banda de confort acústico exigida en residencias de mayores (AGENTS.md §3 ·
 * Rider acústico: 65-75 dBA para VIMUME). Fuera de la banda no se homologa la
 * sesión: ni por exceso (fatiga auditiva) ni por defecto (no hay estímulo).
 * El techo es `LIMITE_SPL_DB` del SSOT, no un número escrito a mano.
 */
export const RANGO_CONFORT_SPL_DB = Object.freeze({ min: 65, max: LIMITE_SPL_DB });

export interface B2GTenderInput {
  entityName: string; // Ej: "Ayuntamiento de Toledo"
  department: string; // Ej: "Concejalía de Asuntos Sociales y Tercera Edad"
  cif?: string;
  dir3Code?: string; // Código DIR3 municipal (obligatorio para oferta B2G, ver evaluateLicitacionB2G)
  programPreset: VimumeProgramPreset;
  customBudget?: number;
  targetCentresCount?: number;
  contactPerson?: string;
  contactEmail?: string;
}

export interface B2GTenderOutput {
  expedienteId: string;
  timestamp: string;
  sha256Hash: string;
  financialSummary: {
    baseBudget: number;
    vatAmount: number; // IVA del SSOT (VAT_RATE), nunca un 0,21 literal
    totalBudget: number;
    isLCSPCompliant: boolean; // Valor estimado < 15.000 € (Art. 118.1 LCSP)
    adjustedCeilingApplied: boolean;
    sroiRatio: number;
    sroiProvenance: string;
    baseLegalTecho: string;
    socialReturnEuroValue: number;
    splitDistribution: {
      artistNet80: number;
      infrastructure10: number;
      vimumeResearch10: number;
    };
  };
  sections: {
    justificacionJuridicaLCSP: string;
    fundamentacionNeuroclinica: string;
    desgloseSROI: string;
    prescripcionesTecnicas: string;
    fichaIntervencionMunicipal: string;
    dossierCompletoMarkdown: string;
  };
}

/** Identificadores de programa VIMUME (taxonomía, no dinero). */
export const VIMUME_PRESET_IDS = [
  'PILOTO_TRIMESTRAL',
  'ANTI_SOLEDAD_SENIOR',
  'GALA_MAYOR',
  'PLAN_ANUAL_TECHO'
] as const;

export type VimumeProgramPreset = (typeof VIMUME_PRESET_IDS)[number];

/** Type-guard de borde: la API recibe strings, nunca un tipo confiable. */
export function isVimumeProgramPreset(value: string): value is VimumeProgramPreset {
  return (VIMUME_PRESET_IDS as readonly string[]).includes(value);
}

/**
 * Tarifa unitaria de sesión. Nace del SSOT; jamás de un array paralelo (INV-10).
 * `TARIFA_BASE_SOLISTA_EUR` = 350,00 €.
 */
const TARIFA_SESION_EUR: number = TARIFA_BASE_SOLISTA_EUR;

/** Precio de un paquete = sesiones × tarifa de sesión del SSOT. */
function priceFromSessions(sessions: number): number {
  return round2(sessions * TARIFA_SESION_EUR);
}

function sessionRule(sessions: number): string {
  return `${sessions} sesiones × ${TARIFA_SESION_EUR.toFixed(2)} € (TARIFA_BASE_SOLISTA_EUR del SSOT)`;
}

export interface VimumeProgramPresetConfig {
  readonly name: string;
  readonly description: string;
  /** Número de sesiones del paquete (dato estructural, no monetario). */
  readonly sessions: number;
  /** Centros de referencia del despliegue. */
  readonly centres: number;
  /** Presupuesto base derivado del SSOT (IVA excluido). */
  readonly basePrice: number;
  /** Fórmula legible que justifica `basePrice` (trazabilidad AF-4). */
  readonly pricingRule: string;
}

/**
 * Catálogo de programas. Los precios NO se escriben: se derivan.
 * Resultado numérico idéntico al publicado antes (4.200 / 8.400 / 2.800 / 14.250 €).
 */
export const B2G_PRESETS: Readonly<Record<VimumeProgramPreset, VimumeProgramPresetConfig>> =
  Object.freeze({
    PILOTO_TRIMESTRAL: Object.freeze({
      name: 'Piloto Trimestral Envejecimiento Activo (5 Centros)',
      description:
        'Programa de choque neuroacústico y música biográfica de 12 semanas en residencias municipales.',
      sessions: 12,
      centres: 5,
      basePrice: priceFromSessions(12),
      pricingRule: sessionRule(12)
    } satisfies VimumeProgramPresetConfig),
    ANTI_SOLEDAD_SENIOR: Object.freeze({
      name: 'Programa Semestral Anti-Soledad no Deseada',
      description:
        'Intervención continuada para la mitigación del aislamiento afectivo en centros residenciales y de día.',
      sessions: 24,
      centres: 8,
      basePrice: priceFromSessions(24),
      pricingRule: sessionRule(24)
    } satisfies VimumeProgramPresetConfig),
    GALA_MAYOR: Object.freeze({
      name: 'Gala Institucional & Homenaje Memoria Viva (Día del Mayor)',
      description:
        'Espectáculo participativo en directo de alta fidelidad con tenor y ensamble instrumental.',
      sessions: 8,
      centres: 1,
      basePrice: priceFromSessions(8),
      pricingRule: sessionRule(8)
    } satisfies VimumeProgramPresetConfig),
    PLAN_ANUAL_TECHO: Object.freeze({
      name: 'Plan Anual de Cohesión Social y Neuroacústica (Techo Art. 118 LCSP)',
      description:
        'Despliegue integral en la red pública municipal ajustado al 95% del límite de Contrato Menor.',
      sessions: Math.floor(SAFE_LCSP_CEILING_EUR / TARIFA_SESION_EUR),
      centres: 12,
      basePrice: SAFE_LCSP_CEILING_EUR,
      pricingRule: `Techo preventivo Art. 118 LCSP (${SAFE_LCSP_CEILING_EUR.toFixed(2)} €, 95 % del límite legal) con ${Math.floor(SAFE_LCSP_CEILING_EUR / TARIFA_SESION_EUR)} sesiones de referencia`
    } satisfies VimumeProgramPresetConfig)
  });

/** Techo legal del contrato menor (Art. 118.1 LCSP · valor estimado IVA excluido). */
const MAX_LCSP_MINOR_CONTRACT_LIMIT = LIMITE_B2G_LCSP_EUR;

/** Techo preventivo del 95 % (14.250,00 €): ningún importe lo supera. */
const SAFE_LCSP_CEILING = SAFE_LCSP_CEILING_EUR;

/** Base legal citable del techo, sin repetir cifras a mano. */
const BASE_LEGAL_TECHO = `Art. 118.1 LCSP — el valor estimado del contrato menor debe ser inferior a ${MAX_LCSP_MINOR_CONTRACT_LIMIT.toFixed(2)} € (IVA excluido).`;

/**
 * Desglose del Split Soberano en euros. Única fuente: `SPLIT_SOBERANO` del SSOT
 * (80 % artista / 10 % EAR OS / 10 % VIMUME). Prohibido recalcularlo en paralelo.
 *
 * El residuo de redondeo (≤ 0,01 €) se absorbe en el tramo del artista para que
 * los tres importes reconstruyan SIEMPRE la base al céntimo (con 3.333,33 €, el
 * 10 %+10 % redondea a 333,33 € y el artista recibe 2.666,67 € en lugar de
 * 2.666,66 €). Se documenta porque altera el 80 % nominal en un céntimo: una
 * auditoría no debe llevarse la sorpresa, debe leerlo aquí.
 */
function splitAmounts(baseEur: number): { artista: number; earOs: number; vimume: number } {
  const earOs = round2(baseEur * SPLIT_SOBERANO.earOs);
  const vimume = round2(baseEur * SPLIT_SOBERANO.vimume);
  const artista = round2(baseEur - earOs - vimume);

  return { artista, earOs, vimume };
}

/** Parámetros de emisión determinista (el certificado reutiliza expediente y fecha). */
export interface TenderEmissionOptions {
  expedienteId?: string;
  issuedAt?: string;
}

export function generateVimumeTender(
  input: B2GTenderInput,
  options: TenderEmissionOptions = {}
): B2GTenderOutput {
  const presetConfig = B2G_PRESETS[input.programPreset] ?? B2G_PRESETS.PILOTO_TRIMESTRAL;

  const requestedBudget =
    input.customBudget !== undefined && Number.isFinite(input.customBudget) && input.customBudget > 0
      ? input.customBudget
      : presetConfig.basePrice;

  let rawBudget = round2(requestedBudget);
  let adjustedCeilingApplied = false;
  if (rawBudget >= MAX_LCSP_MINOR_CONTRACT_LIMIT) {
    rawBudget = SAFE_LCSP_CEILING;
    adjustedCeilingApplied = true;
  }

  const vatAmount = round2(rawBudget * VAT_RATE);
  const totalBudget = round2(rawBudget + vatAmount);
  const socialReturnEuroValue = round2(rawBudget * SROI_RATIO);

  const split = splitAmounts(rawBudget);
  const artistNet80 = split.artista;
  const infrastructure10 = split.earOs;
  const vimumeResearch10 = split.vimume;

  const timestamp = options.issuedAt ?? new Date().toISOString();
  const expedienteId =
    options.expedienteId ??
    `EXP-VIM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const clinicalText = getClinicalJustificationText();
  const legalText = getLegalLcspJustificationText();
  const sroiText = getSroiJustificationText();
  const riderText = getTechnicalRiderJustificationText();

  const justificacionJuridicaLCSP = `
## 1. MARCO JURÍDICO Y ADJUDICACIÓN DIRECTA (ART. 118.1 LCSP)

**Órgano Contratante:** ${input.entityName} — ${input.department}
**Código DIR3:** ${input.dir3Code || 'POR_DETERMINAR'}
**Naturaleza del Expediente:** Contrato Menor de Servicios (Art. 118.1 Ley 9/2017 LCSP)
**Presupuesto Base de Licitación:** ${rawBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (IVA excluido)
**IVA (${(VAT_RATE * 100).toFixed(0)}%):** ${vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
**Importe Total Expediente:** ${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
${adjustedCeilingApplied ? `
> **[ALERTA TÉCNICA CONTROL LCSP]:** El importe introducido sobrepasaba el techo de ${MAX_LCSP_MINOR_CONTRACT_LIMIT.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €. Se ha reajustado automáticamente al 95% del límite legal (${SAFE_LCSP_CEILING.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €) para asegurar la adjudicación directa mediante Contrato Menor.` : ''}

### Codificación CPV Homologada:
- **CPV Principal 85320000-8:** Servicios Sociales (Atención sociosanitaria a la tercera edad y prevención de la dependencia).
- **CPV Secundario 92300000-4:** Servicios de Entretenimiento (Conciertos en directo y producción artística especializada).

### Fundamentación Legal & Exclusividad Singular:
1. Conforme al Art. 118.1 de la LCSP, el presente contrato no alcanza ${MAX_LCSP_MINOR_CONTRACT_LIMIT.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € de valor estimado (IVA excluido), requiriendo únicamente la aprobación del gasto, la incorporación de la factura electrónica vía FACe y la justificación de la necesidad.
2. La singularidad técnica del **Proyecto VIMUME** (propiedad de Productora EAR / Edwin Agudelo) radica en la integración de interpretación vocal profesional de tenor en directo con protocolos neuroacústicos calibrados a <75 dB SPL, no existiendo alternativa idéntica en el mercado público.
${legalText}
`.trim();

  const fundamentacionNeuroclinica = `
## 2. EVIDENCE-BASED HEALTHCARE: EVIDENCIA CLÍNICA Y NEUROCIENTÍFICA VIMUME

El programa **${presetConfig.name}** basa su efectividad en más de 3.200 evidencias documentadas sobre estimulación sonora y memoria musical autobiográfica.

### Resumen de Evidencia Neuroclínica Incorporada:
- **Estudios MIT (Picower Institute, 2016-2024):** Modulación de ondas Gamma a 40 Hz para la estimulación de la actividad microglial y la reducción de placas de proteína amiloide en hipocampo.
- **Särkämö et al. (2014) / Gómez Gallego (2013):** La música biográfica personalizada mejora significativamente la orientación temporoespacial y reduce los trastornos conductuales (agitación, deambulación nocturna) en pacientes con escalas MMSE de 10 a 24 y GDS 4-6.
- **Reducción del Consumo Farmacológico:** Disminución documentada de hasta un 35% en la prescripción de ansiolíticos y benzodiacepinas de rescate tras 8 semanas de protocolo neuroacústico.
- **Alineación OMS (2021-2030):** Enmarcado en la *Década del Envejecimiento Saludable*, promoviendo la desinstitucionalización afectiva y la atención centrada en la persona.

${clinicalText}
`.trim();

  const desgloseSROI = `
## 3. AUDITORÍA FINANCIERA Y VALORACIÓN DE IMPACTO SOCIAL (SROI)

El presupuesto asignado a **${input.entityName}** cuenta con trazabilidad económica y social auditada:

### Indicadores de Retorno Social de la Inversión (SROI):
- **Ratio SROI Declarado:** **${SROI_RATIO.toFixed(2).replace('.', ',')}x** (Por cada 1,00 € invertido por la Administración Pública se documentan ${SROI_RATIO.toFixed(2).replace('.', ',')} € de retorno social tangible). Fuente: ${SROI_PROVENANCE}.
- **Valor Social Retornado a la Comunidad:** **${socialReturnEuroValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €** en concepto de bienestar percibido por familiares, alivio de sobrecarga en cuidadores y reducción de costes asistenciales.

### Desglose del Split Soberano Transparente (80 / 10 / 10):
- **80% Retribución Directa a Músicos & Artistas:** ${artistNet80.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (Dignificación salarial directa sin intermediarios opacos).
- **10% Infraestructura & Logística S-Class:** ${infrastructure10.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (Logística desde Méntrida, seguros y mantenimiento electroacústico).
- **10% Fondo de Investigación VIMUME Senior:** ${vimumeResearch10.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (Reinversión en R+D neuroacústico para centros públicos).

${sroiText}
`.trim();

  const prescripcionesTecnicas = `
## 4. PRESCRIPCIONES TÉCNICAS Y PROTOCOLO ACÚSTICO GERIÁTRICO S-CLASS

Para garantizar la seguridad y confort auditivo de los usuarios en centros de mayores, la ejecución se rige por las siguientes especificaciones innegociables:

### 1. Control Estricto de Presión Sonora (<${LIMITE_SPL_DB} dB SPL):
- Límite máximo infranqueable de volumen calibrado a **<${LIMITE_SPL_DB} dB SPL** (banda de confort ${RANGO_CONFORT_SPL_DB.min}-${RANGO_CONFORT_SPL_DB.max} dBA) en sala para prevenir sobreestimulación o hiperacusia en residentes con demencias avanzadas.
- Telemetría de monitorización activa mediante sonometría en tiempo real.

### 2. Equipamiento Electroacústico Homologado:
- **Cálculo Acústico:** ${WATTS_PER_PAX} W de potencia electroacústica por persona (sistemas con dispersión vertical controlada).
- **Microfonía Inalámbrica de Alta Fidelidad:** cápsulas de condensador de patrón cardioide y receptores digitales de banda libre para máxima claridad vocal sin distorsión armónica (equipos homologados; se detalla la referencia exacta en la ficha técnica del contrato).

### 3. Garantías de Cobertura Legal:
- Póliza de Responsabilidad Civil General y de Explotación por valor de **1.000.000,00 €** para trabajos en recintos municipales e institucionales.
- Certificados de corriente de pago en la Seguridad Social (TC1/TC2) y Agencia Tributaria.

${riderText}
`.trim();

  const fichaIntervencionMunicipal = `
## 5. FICHA TÉCNICA PARA INTERVENCIÓN Y SECRETARÍA MUNICIPAL

**Expediente:** ${expedienteId}
**Órgano Proponente:** ${input.department}
**Entidad Beneficiaria:** ${input.entityName}
**Proveedor Único Homologado:** Productora EAR (Edwin Agudelo)
**Facturación Electrónica:** Obligatoria vía FACe con inyección de código DIR3 (${input.dir3Code ? input.dir3Code.trim().toUpperCase() : 'NO_DECLARADO — la oferta no puede presentarse sin DIR3: evaluateLicitacionB2G() la bloquea'})

**Resumen de la Adjudicación:**
- Presupuesto Base: ${rawBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- IVA (${(VAT_RATE * 100).toFixed(0)}%): ${vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- Importe Total Expediente: ${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- Estado Cumplimiento LCSP: **CONFORME ART. 118.1 LCSP (valor estimado ${rawBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € < ${MAX_LCSP_MINOR_CONTRACT_LIMIT.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €)**
- Base legal aplicada: ${BASE_LEGAL_TECHO}
`.trim();

  const dossierCompletoMarkdown = `
# EXPEDIENTE INSTITUCIONAL B2G — PROYECTO VIMUME
**Nº Expediente:** ${expedienteId}  
**Fecha de Emisión:** ${new Date(timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}  
**Cliente:** ${input.entityName} (${input.department})  

---

${justificacionJuridicaLCSP}

---

${fundamentacionNeuroclinica}

---

${desgloseSROI}

---

${prescripcionesTecnicas}

---

${fichaIntervencionMunicipal}

---
`.trim();

  // Prueba de integridad REPRODUCIBLE: se hashea el núcleo de negocio, nunca el
  // reloj. Un hash que cambia en cada lectura del mismo expediente no prueba
  // nada; sólo decora. (Antes: `${expedienteId}-${entityName}-${budget}-${timestamp}`.)
  const sha256Hash = sha256Hex(
    stableStringify({
      engine: 'vimume-b2g-tender',
      entity: input.entityName.trim(),
      department: input.department.trim(),
      cif: input.cif?.trim().toUpperCase() ?? null,
      dir3Code: input.dir3Code?.trim().toUpperCase() ?? null,
      preset: input.programPreset,
      baseBudget: rawBudget,
      vatAmount,
      totalBudget,
      split,
      vatRate: VAT_RATE,
      sroiRatio: SROI_RATIO
    })
  );

  return {
    expedienteId,
    timestamp,
    sha256Hash,
    financialSummary: {
      baseBudget: rawBudget,
      vatAmount,
      totalBudget,
      isLCSPCompliant: rawBudget < MAX_LCSP_MINOR_CONTRACT_LIMIT,
      adjustedCeilingApplied,
      sroiRatio: SROI_RATIO,
      sroiProvenance: SROI_PROVENANCE,
      baseLegalTecho: BASE_LEGAL_TECHO,
      socialReturnEuroValue,
      splitDistribution: {
        artistNet80,
        infrastructure10,
        vimumeResearch10
      }
    },
    sections: {
      justificacionJuridicaLCSP,
      fundamentacionNeuroclinica,
      desgloseSROI,
      prescripcionesTecnicas,
      fichaIntervencionMunicipal,
      dossierCompletoMarkdown: dossierCompletoMarkdown + `\n\n\`\`\`\nSHA-256 PROOF: ${sha256Hash}\n\`\`\``
    }
  };
}

export function runVimumeTenderDiagnostics(): {
  status: 'SUCCESS' | 'FAILURE';
  testsPassed: number;
  totalTests: number;
  logs: string[];
} {
  const logs: string[] = [];
  let testsPassed = 0;
  const totalTests = 4;

  try {
    const tender1 = generateVimumeTender({
      entityName: "Ayuntamiento de Prueba",
      department: "Concejalía de Festejos y Bienestar",
      dir3Code: "L0100000",
      programPreset: "PILOTO_TRIMESTRAL"
    });

    if (tender1.financialSummary.baseBudget === 4200 && tender1.financialSummary.isLCSPCompliant) {
      testsPassed++;
      logs.push("✅ Test 1: Preset PILOTO_TRIMESTRAL generado correctamente (4.200 €).");
    } else {
      logs.push("❌ Test 1: Fallo en cálculo de presupuesto base.");
    }

    const tender2 = generateVimumeTender({
      entityName: "Diputación Provincial",
      department: "Servicios Sociales",
      dir3Code: "L0200000",
      programPreset: "PLAN_ANUAL_TECHO",
      customBudget: 18000
    });

    if (tender2.financialSummary.baseBudget === SAFE_LCSP_CEILING && tender2.financialSummary.adjustedCeilingApplied) {
      testsPassed++;
      logs.push("✅ Test 2: Techo Art. 118 LCSP ajustado automáticamente a 14.250 € ante input de 18.000 €.");
    } else {
      logs.push("❌ Test 2: Fallo en control de techo del Art. 118 LCSP.");
    }

    if (tender1.sha256Hash && tender1.sha256Hash.length === 64) {
      testsPassed++;
      logs.push(`✅ Test 3: Firma SHA-256 emitida válidamente (${tender1.sha256Hash.substring(0, 16)}...).`);
    } else {
      logs.push("❌ Test 3: Hash SHA-256 malformado o ausente.");
    }

    if (tender1.sections.fundamentacionNeuroclinica.includes("MIT") && tender1.sections.desgloseSROI.includes("4,85x")) {
      testsPassed++;
      logs.push("✅ Test 4: Evidencia clínica RAG y ratio SROI inyectados con éxito.");
    } else {
      logs.push("❌ Test 4: Error en inyección ontológica de datos.");
    }

    return {
      status: testsPassed === totalTests ? 'SUCCESS' : 'FAILURE',
      testsPassed,
      totalTests,
      logs
    };
  } catch (error) {
    logs.push(`❌ Excepción durante diagnóstico: ${error instanceof Error ? error.message : String(error)}`);
    return {
      status: 'FAILURE',
      testsPassed,
      totalTests,
      logs
    };
  }
}

// ════════════════════════════════════════════════════════════════════════════
// CAPA 5 · FISCALIDAD — LEY 49/2002 (arts. 20 y 25) · MODELO 182 AEAT
// ════════════════════════════════════════════════════════════════════════════
// `UMBRAL_LEGAL_PRIMER_TRAMO_EUR` es un umbral de DERECHO POSITIVO (250 € en el
// art. 20.1), no una tarifa comercial: no vive en el SSOT de precios ni puede
// confundirse con uno. INV-10 protege los precios de negocio; esto es la ley.
// ════════════════════════════════════════════════════════════════════════════

export const DONOR_TYPES = ['PERSONA_FISICA', 'PERSONA_JURIDICA'] as const;

export type DonorType = (typeof DONOR_TYPES)[number];

export function isDonorType(value: string): value is DonorType {
  return (DONOR_TYPES as readonly string[]).includes(value);
}

export const LEY_49_2002 = Object.freeze({
  /** Art. 20.1 Ley 49/2002: primer tramo de la deducción en IRPF. */
  umbralPrimerTramoEur: 250,
  tipoPfPrimerTramo: 0.8,
  tipoPfResto: 0.4,
  tipoPfRestoRecurrente: 0.45,
  tipoPj: 0.4,
  tipoPjRecurrente: 0.5,
  modeloAeat: '182' as const,
  fuente:
    'Ley 49/2002 de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo (arts. 20 y 25, redacción RDL 17/2020) · Modelo 182 AEAT'
});

/**
 * Cortafuegos operativo (no legal): evita que un error de tecleo de siete cifras
 * se convierta en un certificado de mecenazgo. Se declara como límite de
 * validación, nunca como límite de la ley.
 */
export const LIMITE_OPERATIVO_DONATIVO_EUR = 1_000_000;

export interface Ley492002DeductionInput {
  donativoEur: number;
  donorType: DonorType;
  /** Donaciones a la misma entidad por importe igual o superior durante ≥ 3 años. */
  recurring: boolean;
}

export interface Ley492002Tramo {
  concepto: string;
  base: number;
  tipo: number;
  deduccion: number;
}

export interface Ley492002DeductionOutput {
  donativoEur: number;
  donorType: DonorType;
  recurring: boolean;
  tramos: Ley492002Tramo[];
  deduccionTotal: number;
  tipoEfectivo: number;
  modeloAeat: '182';
  baseLegal: string;
  fuente: string;
  /** Sin donativo puro no hay deducción del art. 20 (patrocinio = art. 25). */
  naturalezaRequerida: 'DONATIVO_PURO';
  advertencias: string[];
  disclaimer: string;
  sha256Hash: string;
}

// ════ FIN CABECERA FISCAL ════

/**
 * Calcula la deducción fiscal del donante conforme al art. 20 de la Ley 49/2002.
 * · Persona física: 80 % sobre los primeros 250 € + 40 % del resto (45 % si recurrente).
 * · Persona jurídica (IS): 40 % (50 % si recurrente).
 * NO calcula límites sobre base liquidable/impobible: dependen de la situación
 * fiscal del donante y se declaran explícitamente como no computados (JUR-1).
 */
export function computeLey492002Deduction(
  input: Ley492002DeductionInput
): EngineResult<Ley492002DeductionOutput> {
  const donativo = round2(Number(input.donativoEur));

  if (!Number.isFinite(donativo) || donativo <= 0) {
    return {
      ok: false,
      error: 'DONATIVO_INVALIDO: el importe del donativo debe ser mayor que 0,00 €.'
    };
  }
  if (donativo > LIMITE_OPERATIVO_DONATIVO_EUR) {
    return {
      ok: false,
      error: `DONATIVO_FUERA_DE_RANGO: el importe supera el cortafuegos operativo de ${LIMITE_OPERATIVO_DONATIVO_EUR.toLocaleString('es-ES')} €. Revisa el dato antes de emitir un certificado de mecenazgo.`
    };
  }
  if (!isDonorType(input.donorType)) {
    return {
      ok: false,
      error: 'DONANTE_INVALIDO: el tipo de donante debe ser PERSONA_FISICA o PERSONA_JURIDICA.'
    };
  }

  const tramos: Ley492002Tramo[] = [];

  if (input.donorType === 'PERSONA_FISICA') {
    const basePrimerTramo = round2(Math.min(donativo, LEY_49_2002.umbralPrimerTramoEur));
    tramos.push({
      concepto: `IRPF · primer tramo (hasta ${LEY_49_2002.umbralPrimerTramoEur.toFixed(2)} €)`,
      base: basePrimerTramo,
      tipo: LEY_49_2002.tipoPfPrimerTramo,
      deduccion: round2(basePrimerTramo * LEY_49_2002.tipoPfPrimerTramo)
    });

    const baseResto = round2(donativo - basePrimerTramo);
    if (baseResto > 0) {
      const tipoResto = input.recurring ? LEY_49_2002.tipoPfRestoRecurrente : LEY_49_2002.tipoPfResto;
      tramos.push({
        concepto: input.recurring
          ? 'IRPF · resto (donante recurrente: misma entidad ≥ 3 años)'
          : 'IRPF · resto',
        base: baseResto,
        tipo: tipoResto,
        deduccion: round2(baseResto * tipoResto)
      });
    }
  } else {
    const tipo = input.recurring ? LEY_49_2002.tipoPjRecurrente : LEY_49_2002.tipoPj;
    tramos.push({
      concepto: input.recurring
        ? 'Impuesto sobre Sociedades (donante recurrente: misma entidad ≥ 3 años)'
        : 'Impuesto sobre Sociedades',
      base: donativo,
      tipo,
      deduccion: round2(donativo * tipo)
    });
  }

  const deduccionTotal = round2(tramos.reduce((sum, tramo) => sum + tramo.deduccion, 0));

  const output: Ley492002DeductionOutput = {
    donativoEur: donativo,
    donorType: input.donorType,
    recurring: input.recurring,
    tramos,
    deduccionTotal,
    tipoEfectivo: round4(deduccionTotal / donativo),
    modeloAeat: LEY_49_2002.modeloAeat,
    baseLegal:
      'Art. 20 Ley 49/2002 (redacción RDL 17/2020): 80 % sobre los primeros 250 € y 40 % sobre el resto en IRPF (45 % si recurrente); 40 % en IS (50 % si recurrente).',
    fuente: LEY_49_2002.fuente,
    naturalezaRequerida: 'DONATIVO_PURO',
    advertencias: [
      'La deducción del art. 20 exige DONATIVO PURO: si existe contraprestación publicitaria (patrocinio), tributa por el art. 25 como gasto deducible y NO genera esta deducción.',
      'El límite legal de la deducción se aplica sobre la base liquidable (IRPF) o la base imponible (IS) del donante y NO se computa en este certificado.',
      'El certificado no sustituye al asesoramiento fiscal del donante ni la presentación del Modelo 182 por la entidad beneficiaria.'
    ],
    disclaimer:
      'Programa de estimulación neuroacústica no farmacológica: no es tratamiento médico ni promesa terapéutica (JUR-3).',
    sha256Hash: ''
  };

  output.sha256Hash = sha256Hex(
    stableStringify({
      engine: 'ley-49-2002',
      donativoEur: output.donativoEur,
      donorType: output.donorType,
      recurring: output.recurring,
      tramos: output.tramos,
      deduccionTotal: output.deduccionTotal,
      modeloAeat: output.modeloAeat
    })
  );

  return { ok: true, data: output };
}

// ════════════════════════════════════════════════════════════════════════════
// CAPA 4 · RIDER ACÚSTICO — PROTOCOLO 40 Hz NO INVASIVO (< 75 dB SPL · 12 W/pax)
// ════════════════════════════════════════════════════════════════════════════

export interface RiderAcustico {
  splDb: number;
  wattsPorPax: number;
}

/** Rider canónico: ambos valores nacen del SSOT, jamás de un literal. */
export const RIDER_ACUSTICO_VIMUME: RiderAcustico = Object.freeze({
  splDb: LIMITE_SPL_DB,
  wattsPorPax: WATTS_PER_PAX
});

export interface AcousticRiderInput {
  splDb: number;
  asistentes: number;
  protocolo40Hz?: boolean;
}

export type AcousticVerdict = 'HOMOLOGADO' | 'RECHAZADO_SOBRE_LIMITE' | 'RECHAZADO_FUERA_CONFORT';

export interface AcousticRiderOutput extends RiderAcustico {
  asistentes: number;
  potenciaRequeridaW: number;
  rangoConfortDb: { min: number; max: number };
  veredicto: AcousticVerdict;
  motivo: string | null;
  protocolo40Hz: boolean;
  baseTecnica: string;
  sha256Hash: string;
}

/**
 * Homologa (o rechaza) el rider acústico de una sesión.
 * Caso límite exigido: SPL > `LIMITE_SPL_DB` ⇒ rechazo técnico razonado, nunca
 * un aviso cosmético. Por debajo de la banda tampoco se homologa: sin presión
 * sonora no hay estímulo neuroacústico, y venderlo sería una fachada clínica.
 */
export function evaluateAcousticRider(input: AcousticRiderInput): EngineResult<AcousticRiderOutput> {
  const splDb = Number(input.splDb);
  const asistentes = Math.trunc(Number(input.asistentes));

  if (!Number.isFinite(splDb) || splDb <= 0) {
    return {
      ok: false,
      error: 'SPL_INVALIDO: la presión sonora declarada debe ser un número mayor que 0 dB SPL.'
    };
  }
  if (!Number.isFinite(asistentes) || asistentes <= 0) {
    return {
      ok: false,
      error: 'ASISTENTES_INVALIDO: el aforo declarado debe ser un entero mayor que 0.'
    };
  }
  if (asistentes > 5000) {
    return {
      ok: false,
      error: 'AFORO_FUERA_DE_RANGO: el protocolo VIMUME se homologa hasta 5.000 asistentes por sesión. Divide el despliegue en sesiones.'
    };
  }

  const potenciaRequeridaW = asistentes * WATTS_PER_PAX;
  const protocolo40Hz = input.protocolo40Hz ?? true;
  const baseTecnica = `Ley 37/2003 del Ruido · OMS ICOPE · banda de confort ${RANGO_CONFORT_SPL_DB.min}-${RANGO_CONFORT_SPL_DB.max} dBA`;

  let veredicto: AcousticVerdict = 'HOMOLOGADO';
  let motivo: string | null = null;

  if (splDb > LIMITE_SPL_DB) {
    veredicto = 'RECHAZADO_SOBRE_LIMITE';
    motivo =
      `La presión sonora declarada (${splDb} dB SPL) supera el límite de salud pública de ${LIMITE_SPL_DB} dB SPL. ` +
      'En residencias de mayores el exceso acústico provoca hiperacusia, fatiga auditiva y desorientación: ' +
      'la sesión no se homologa. Reduce la calibración a la banda ' +
      `${RANGO_CONFORT_SPL_DB.min}-${RANGO_CONFORT_SPL_DB.max} dBA y vuelve a solicitar el certificado.`;
  } else if (splDb < RANGO_CONFORT_SPL_DB.min) {
    veredicto = 'RECHAZADO_FUERA_CONFORT';
    motivo =
      `La presión sonora declarada (${splDb} dB SPL) queda por debajo de la banda de confort ` +
      `(${RANGO_CONFORT_SPL_DB.min}-${RANGO_CONFORT_SPL_DB.max} dBA). Sin presión sonora suficiente no hay ` +
      'estímulo neuroacústico verificable: no se emite certificado de impacto.';
  }

  const output: AcousticRiderOutput = {
    splDb,
    wattsPorPax: WATTS_PER_PAX,
    asistentes,
    potenciaRequeridaW,
    rangoConfortDb: { min: RANGO_CONFORT_SPL_DB.min, max: RANGO_CONFORT_SPL_DB.max },
    veredicto,
    motivo,
    protocolo40Hz,
    baseTecnica,
    sha256Hash: ''
  };

  output.sha256Hash = sha256Hex(
    stableStringify({
      engine: 'vimume-acoustic-rider',
      splDb: output.splDb,
      wattsPorPax: output.wattsPorPax,
      asistentes: output.asistentes,
      potenciaRequeridaW: output.potenciaRequeridaW,
      veredicto: output.veredicto,
      protocolo40Hz: output.protocolo40Hz
    })
  );

  if (veredicto !== 'HOMOLOGADO') {
    return { ok: false, error: `${veredicto}: ${motivo ?? ''}`.trim() };
  }

  return { ok: true, data: output };
}

// ════════════════════════════════════════════════════════════════════════════
// CAPA 2 · SPLIT SOBERANO 80/10/10 — SIEMPRE EN SERVIDOR, SIEMPRE DEL SSOT
// ════════════════════════════════════════════════════════════════════════════

export interface SplitSoberanoBreakdown {
  base: number;
  artista: number;
  earOs: number;
  vimume: number;
  moneda: 'EUR';
  ratios: { artista: number; earOs: number; vimume: number };
  fuente: string;
  sha256Hash: string;
}

/**
 * Desglose en euros del reparto 80/10/10. Es el único lugar del sistema donde
 * se materializa el split: cualquier componente que lo recalcule por su cuenta
 * está creando una segunda verdad (prohibido por la orden del CEO, punto 5).
 */
export function computeSplitSoberano(baseEur: number): EngineResult<SplitSoberanoBreakdown> {
  const base = round2(Number(baseEur));

  if (!Number.isFinite(base) || base <= 0) {
    return {
      ok: false,
      error: 'BASE_INVALIDA: el importe base del split debe ser mayor que 0,00 €.'
    };
  }

  const partes = splitAmounts(base);
  const suma = round2(partes.artista + partes.earOs + partes.vimume);

  if (suma !== base) {
    // Invariante contable: si los tres tramos no reconstruyen la base, no se
    // publica el desglose (preferimos fallar a mostrar euros que no cuadran).
    return {
      ok: false,
      error: `SPLIT_INCONSISTENTE: la suma de tramos (${suma.toFixed(2)} €) no reconstruye la base (${base.toFixed(2)} €).`
    };
  }

  const output: SplitSoberanoBreakdown = {
    base,
    artista: partes.artista,
    earOs: partes.earOs,
    vimume: partes.vimume,
    moneda: 'EUR',
    ratios: {
      artista: SPLIT_SOBERANO.artista,
      earOs: SPLIT_SOBERANO.earOs,
      vimume: SPLIT_SOBERANO.vimume
    },
    fuente: 'src/lib/constants/ear-os-ssot.ts → SPLIT_SOBERANO (80/10/10)',
    sha256Hash: ''
  };

  output.sha256Hash = sha256Hex(stableStringify({ engine: 'split-soberano', ...output, sha256Hash: undefined }));

  return { ok: true, data: output };
}

// ════════════════════════════════════════════════════════════════════════════
// CAPA 3 · CONTRATO MENOR B2G — TECHO PREVENTIVO ART. 118.1 LCSP
// ════════════════════════════════════════════════════════════════════════════

/** Contrato de datos exigido para una licitación menor. */
export interface LicitacionB2G {
  importe: number;
  /** Techo preventivo del SSOT (14.250,00 €). Ningún importe lo supera. */
  limite: number;
  /** Referencia del pliego adjunto. Sin pliego no hay oferta: no se inventa. */
  pliego: string;
}

export interface LicitacionB2GInput {
  importe: number;
  pliego?: string;
  dir3Code?: string;
}

/** Un código DIR3 tiene 9 caracteres alfanuméricos (ej. L01180734). */
export const DIR3_PATTERN = /^[A-Z0-9]{9}$/;

export function isDir3Code(value: string): boolean {
  return DIR3_PATTERN.test(value.trim().toUpperCase());
}

/**
 * Valida una licitación menor ANTES de emitir oferta.
 * Estrategia de recuperación: sin pliego se EXIGE el pliego (no se inventa) y
 * sin DIR3 no se presenta oferta (la factura electrónica vía FACe es requisito).
 */
export function evaluateLicitacionB2G(input: LicitacionB2GInput): EngineResult<LicitacionB2G> {
  const importe = round2(Number(input.importe));
  const pliego = (input.pliego ?? '').trim();
  const dir3 = (input.dir3Code ?? '').trim().toUpperCase();

  if (!Number.isFinite(importe) || importe <= 0) {
    return {
      ok: false,
      error: 'IMPORTE_INVALIDO: el importe de la licitación debe ser mayor que 0,00 €.'
    };
  }
  if (pliego.length < 8) {
    return {
      ok: false,
      error:
        'PLIEGO_REQUERIDO: adjunta la referencia del pliego (mínimo 8 caracteres). ' +
        'Este motor no redacta pliegos ni inventa condiciones: sin documento de origen no hay oferta.'
    };
  }
  if (!isDir3Code(dir3)) {
    return {
      ok: false,
      error:
        'DIR3_REQUERIDO: el código DIR3 del órgano contratante (9 caracteres alfanuméricos) es obligatorio ' +
        'para la factura electrónica vía FACe. Solicítalo a la Alcaldía/Intervención antes de presentar la oferta.'
    };
  }
  if (importe > SAFE_LCSP_CEILING_EUR) {
    return {
      ok: false,
      error:
        `TECHO_PREVENTIVO_EXCEDIDO: ${importe.toFixed(2)} € supera el techo preventivo de ` +
        `${SAFE_LCSP_CEILING_EUR.toFixed(2)} € (95 % del límite de ${MAX_LCSP_MINOR_CONTRACT_LIMIT.toFixed(2)} € del Art. 118.1 LCSP). ` +
        'No se emite adjudicación por contrato menor por encima de ese techo: reajusta el importe o tramita el expediente por procedimiento abierto.'
    };
  }

  return {
    ok: true,
    data: {
      importe,
      limite: SAFE_LCSP_CEILING_EUR,
      pliego
    }
  };
}

// ════════════════════════════════════════════════════════════════════════════
// CAPAS 6-7 · IDEMPOTENCIA + CERTIFICADO RSC → WEBHOOK n8n
// ════════════════════════════════════════════════════════════════════════════
// INV-08: N reintentos con la MISMA referencia producen 1 fila. La garantía se
// apoya en tres decisiones, no en una promesa:
//   a) la clave se deriva del contenido de negocio (nunca del reloj ni del azar);
//   b) el certificado se compone UNA vez y se guarda; los reintentos LEEN;
//   c) las peticiones concurrentes con la misma clave se colapsan en la misma
//      promesa (`INFLIGHT`), sin ventana de carrera entre `get` y `set`.
// Alcance declarado: `process-local`. Un redeploy vacía el ledger. Se publica en
// cada respuesta para no vender una durabilidad que no existe (AF-1).
// ════════════════════════════════════════════════════════════════════════════

export const VIMUME_RSC_WEBHOOK_SLUG = 'vimume-clinical-report' as const;

export const RSC_CHANNELS = ['B2G', 'RSC'] as const;

export type RscChannel = (typeof RSC_CHANNELS)[number];

export function isRscChannel(value: string): value is RscChannel {
  return (RSC_CHANNELS as readonly string[]).includes(value);
}

/** Aforo de referencia de una sala de estimulación (dato operativo, no monetario). */
export const ASISTENTES_POR_SESION_POR_DEFECTO = 30;

export interface RscCertificateRequest {
  channel: RscChannel;
  entityName: string;
  department?: string;
  cif?: string;
  dir3Code?: string;
  pliegoRef?: string;
  programPreset: VimumeProgramPreset;
  customBudget?: number;
  targetCentresCount?: number;
  asistentesPorSesion?: number;
  donorType?: DonorType;
  recurring?: boolean;
  splDbPropuesto?: number;
  contactEmail?: string;
  contactPerson?: string;
}

/**
 * Referencia de contacto con MINIMIZACIÓN EN ORIGEN (SEC-8 · RGPD art. 5).
 * El email no se guarda, no se registra y no viaja al webhook: sólo su huella.
 */
export interface RscContactReference {
  contactRef: string | null;
  contactDomain: string | null;
  policy: 'contact-by-reference';
  nota: string;
}

export function buildContactReference(email?: string): RscContactReference {
  const clean = (email ?? '').trim().toLowerCase();
  const atIndex = clean.lastIndexOf('@');

  if (clean.length === 0 || atIndex <= 0 || atIndex === clean.length - 1) {
    return {
      contactRef: null,
      contactDomain: null,
      policy: 'contact-by-reference',
      nota: 'Sin contacto declarado: el expediente se tramita por el canal WhatsApp oficial del sitio.'
    };
  }

  return {
    contactRef: sha256Hex(`vimume-rsc:${clean}`).slice(0, 16),
    contactDomain: clean.slice(atIndex + 1),
    policy: 'contact-by-reference',
    nota: 'El email se convierte en huella SHA-256 de 64 bits: no se almacena ni se transmite en claro.'
  };
}

// ════ FIN BLOQUE CONTACTO ════

export interface VimumeRscDelivery {
  delivered: boolean;
  status: number | null;
  attempts: number;
  lastError: string | null;
  /** `SIMULADO` sólo en el diagnóstico interno: la API siempre entrega en REAL. */
  mode: 'REAL' | 'SIMULADO';
  dlqVisibleAt: typeof VIMUME_RSC_TELEMETRY_URL;
}

export interface VimumeRscScope {
  ledger: 'process-local';
  dlq: 'process-local';
  note: string;
}

export interface VimumeRscCertificate {
  expedienteId: string;
  idempotencyKey: string;
  payloadSha256: string;
  hashSpec: string;
  issuedAt: string;
  channel: RscChannel;
  entity: {
    name: string;
    department: string | null;
    cif: string | null;
    dir3Code: string | null;
    pliegoRef: string | null;
  };
  contact: RscContactReference;
  program: {
    preset: VimumeProgramPreset;
    name: string;
    sessions: number;
    centres: number;
    asistentesPorSesion: number;
    pricingRule: string;
  };
  tender: B2GTenderOutput | null;
  financials: B2GTenderOutput['financialSummary'] | null;
  donation: { importeEur: number; ivaAplicable: false; nota: string } | null;
  split: SplitSoberanoBreakdown;
  fiscal: Ley492002DeductionOutput | null;
  acoustic: AcousticRiderOutput;
  licitacion: LicitacionB2G | null;
  dossierMarkdown: string;
  documentacionRequerida: string[];
  delivery: VimumeRscDelivery;
  dispatches: number;
  idempotentReplay: boolean;
  scope: VimumeRscScope;
}

interface LedgerRecord {
  certificate: VimumeRscCertificate;
  payload: Record<string, unknown>;
}

/** Ledger de certificados: exactamente 1 fila por `idempotencyKey` (INV-08). */
const CERTIFICATE_LEDGER = new Map<string, LedgerRecord>();

/** Peticiones en vuelo: colapsa duplicados concurrentes en una sola ejecución. */
const INFLIGHT = new Map<string, Promise<EngineResult<VimumeRscCertificate>>>();

const RSC_METRICS = {
  issued: 0,
  replays: 0,
  rejections: 0,
  dispatches: 0,
  dispatchFailures: 0
};

const SCOPE: VimumeRscScope = {
  ledger: 'process-local',
  dlq: 'process-local',
  note: 'Ledger y Dead Letter Queue viven en memoria del proceso: se reinician en cada redeploy y no se comparten entre réplicas. La versión durable (tabla con índice único sobre idempotency_key) es el siguiente paso del roadmap.'
};

function normalizeToken(value?: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim().toUpperCase();
}

/**
 * Clave de idempotencia DETERMINISTA. Dos peticiones que describen el mismo
 * negocio (mismo ente, mismo programa, mismo importe, mismo rider) producen la
 * misma clave aunque cambien mayúsculas, espacios o el orden de los campos.
 */
export function buildCertificateIdempotencyKey(request: RscCertificateRequest): string {
  const budget =
    typeof request.customBudget === 'number' &&
    Number.isFinite(request.customBudget) &&
    request.customBudget > 0
      ? round2(request.customBudget)
      : null;

  return sha256Hex(
    stableStringify({
      engine: 'vimume-rsc-certificate',
      channel: request.channel,
      entity: normalizeToken(request.entityName),
      department: normalizeToken(request.department),
      cif: normalizeToken(request.cif),
      dir3: normalizeToken(request.dir3Code),
      pliego: normalizeToken(request.pliegoRef),
      preset: request.programPreset,
      budget,
      centres: request.targetCentresCount ?? null,
      pax: request.asistentesPorSesion ?? null,
      donorType: request.donorType ?? null,
      recurring: request.recurring ?? null,
      spl: request.splDbPropuesto ?? SPL_OBJETIVO_PROTOCOLO_40HZ_DB
    })
  );
}

/** Contrato del hash de payload, verificable por el receptor del webhook. */
const PAYLOAD_HASH_SPEC =
  'sha256(stableStringify(payload sin {payloadSha256, hashSpec, issuedAt}))';

interface RscDossierParams {
  expedienteId: string;
  issuedAt: string;
  entityName: string;
  department: string | null;
  cif: string | null;
  contactRef: string | null;
  programName: string;
  programSessions: number;
  programCentres: number;
  asistentesPorSesion: number;
  importeEur: number;
  fiscal: Ley492002DeductionOutput | null;
  split: SplitSoberanoBreakdown;
  acoustic: AcousticRiderOutput;
}

function formatEur(value: number): string {
  return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Dossier de impacto neuroacústico 40 Hz + certificado de mecenazgo (canal RSC).
 * Cada cifra se imprime desde su motor de origen; ninguna se teclea aquí.
 */
function buildRscDossierMarkdown(params: RscDossierParams): string {
  const tramos = params.fiscal
    ? params.fiscal.tramos
        .map(
          (tramo) =>
            `| ${tramo.concepto} | ${formatEur(tramo.base)} € | ${(tramo.tipo * 100).toFixed(0)} % | ${formatEur(tramo.deduccion)} € |`
        )
        .join('\n')
    : '| — | — | — | — |';

  const deduccionTotal = params.fiscal ? formatEur(params.fiscal.deduccionTotal) : '0,00';
  const tipoEfectivo = params.fiscal ? (params.fiscal.tipoEfectivo * 100).toFixed(2) : '0,00';

  return `
# CERTIFICADO DE IMPACTO SOCIAL Y MECENAZGO — PROGRAMA VIMUME 40 Hz

**Nº Expediente:** ${params.expedienteId}
**Fecha de Emisión:** ${new Date(params.issuedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
**Entidad Colaboradora:** ${params.entityName}${params.department ? ` (${params.department})` : ''}
**CIF:** ${params.cif ?? 'no declarado'}
**Referencia de contacto (huella):** ${params.contactRef ?? 'sin contacto declarado'}

---

## 1. OBJETO DEL CERTIFICADO

Documento acreditativo de la aportación destinada al programa **${params.programName}**, consistente en
${params.programSessions} sesiones de estimulación neuroacústica no farmacológica en ${params.programCentres} centro(s),
con un aforo de referencia de ${params.asistentesPorSesion} personas por sesión.

**Naturaleza del programa:** estimulación neuroacústica y música autobiográfica. No es un tratamiento médico,
no sustituye la atención sanitaria y no constituye promesa terapéutica alguna. El beneficio declarado es
bienestar emocional y reducción de la agitación observada, dentro de una línea de investigación no farmacológica.

## 2. IMPORTE Y DESGLOSE

- **Importe aportado (donativo):** ${formatEur(params.importeEur)} €
- **IVA:** no aplicable. El donativo no constituye entrega de bienes ni prestación de servicios a título oneroso
  y, por tanto, queda fuera del ámbito de la Ley 37/1992 del IVA.
- **Trazabilidad:** el importe nace de la tarifa del SSOT y del programa seleccionado; no se introduce a mano en ningún componente.

### Reparto 80/10/10 (calculado en servidor)

| Concepto | Porcentaje | Importe |
| --- | --- | --- |
| Artista ejecutor | ${(params.split.ratios.artista * 100).toFixed(0)} % | ${formatEur(params.split.artista)} € |
| Infraestructura EAR OS | ${(params.split.ratios.earOs * 100).toFixed(0)} % | ${formatEur(params.split.earOs)} € |
| Fondo VIMUME (impacto social) | ${(params.split.ratios.vimume * 100).toFixed(0)} % | ${formatEur(params.split.vimume)} € |
| **Total** | **100 %** | **${formatEur(params.split.base)} €** |

## 3. DEDUCCIÓN FISCAL — LEY 49/2002 · MODELO ${params.fiscal ? params.fiscal.modeloAeat : '182'} AEAT

| Tramo | Base | Tipo | Deducción |
| --- | --- | --- | --- |
${tramos}

- **Deducción total estimada:** ${deduccionTotal} € (tipo efectivo ${tipoEfectivo} %)
- **Base legal:** ${params.fiscal ? params.fiscal.baseLegal : 'no aplicable'}
- **Fuente:** ${params.fiscal ? params.fiscal.fuente : LEY_49_2002.fuente}

${params.fiscal ? params.fiscal.advertencias.map((advertencia) => `> ${advertencia}`).join('\n>\n') : ''}

## 4. PROTOCOLO ACÚSTICO 40 Hz (LEY 37/2003 DEL RUIDO)

- **Presión sonora homologada:** ${params.acoustic.splDb} dB SPL
- **Banda de confort:** ${params.acoustic.rangoConfortDb.min}-${params.acoustic.rangoConfortDb.max} dBA
- **Potencia electroacústica:** ${params.acoustic.wattsPorPax} W por persona → ${params.acoustic.potenciaRequeridaW} W para ${params.acoustic.asistentes} asistentes
- **Veredicto:** ${params.acoustic.veredicto}
- **Base técnica:** ${params.acoustic.baseTecnica}

## 5. ALCANCE Y LÍMITES DE ESTE DOCUMENTO

1. Acredita la aportación y su reparto; no acredita por sí mismo el derecho a deducir: el límite legal se aplica
   sobre la base liquidable (IRPF) o la base imponible (IS) del donante y debe validarlo su asesor fiscal.
2. El certificado exige **donativo puro**. Un patrocinio con contraprestación publicitaria tributa por el art. 25
   de la Ley 49/2002 como gasto deducible y no genera la deducción del art. 20.
3. Programa de estimulación, no tratamiento médico.

---
\`\`\`
EXPEDIENTE: ${params.expedienteId}
SPL: ${params.acoustic.splDb} dB SPL · W/Pax: ${params.acoustic.wattsPorPax}
SHA-256 RIDER: ${params.acoustic.sha256Hash}
SHA-256 SPLIT: ${params.split.sha256Hash}
SHA-256 FISCAL: ${params.fiscal ? params.fiscal.sha256Hash : 'no aplicable'}
\`\`\`
`.trim();
}

// ════ FIN DOSSIER RSC ════

interface FinancialCore {
  licitacion: LicitacionB2G | null;
  tender: B2GTenderOutput | null;
  financials: B2GTenderOutput['financialSummary'] | null;
  donation: { importeEur: number; ivaAplicable: false; nota: string } | null;
  fiscal: Ley492002DeductionOutput | null;
  baseSplit: number;
}

/**
 * Núcleo financiero del certificado. B2G (contrato menor, IVA aplicable) y RSC
 * (donativo puro, sin IVA) son regímenes jurídicos DISTINTOS: mezclarlos sería
 * un error de derecho, no un detalle de presentación.
 */
function computeFinancialCore(
  request: RscCertificateRequest,
  preset: VimumeProgramPresetConfig,
  expedienteId: string,
  issuedAt: string
): EngineResult<FinancialCore> {
  const importeSolicitado =
    typeof request.customBudget === 'number' &&
    Number.isFinite(request.customBudget) &&
    request.customBudget > 0
      ? round2(request.customBudget)
      : preset.basePrice;

  if (request.channel === 'B2G') {
    const verdict = evaluateLicitacionB2G({
      importe: importeSolicitado,
      pliego: request.pliegoRef,
      dir3Code: request.dir3Code
    });

    if (!verdict.ok || !verdict.data) {
      return { ok: false, error: verdict.error ?? 'VALIDACION: licitación no válida.' };
    }

    const tender = generateVimumeTender(
      {
        entityName: request.entityName.trim(),
        department: request.department?.trim() ?? 'Órgano contratante',
        cif: request.cif?.trim(),
        dir3Code: verdict.data.pliego ? request.dir3Code?.trim().toUpperCase() : undefined,
        programPreset: request.programPreset,
        customBudget: verdict.data.importe,
        targetCentresCount: request.targetCentresCount
      },
      { expedienteId, issuedAt }
    );

    return {
      ok: true,
      data: {
        licitacion: verdict.data,
        tender,
        financials: tender.financialSummary,
        donation: null,
        fiscal: null,
        baseSplit: tender.financialSummary.baseBudget
      }
    };
  }

  const donorType: DonorType = request.donorType ?? 'PERSONA_JURIDICA';
  const deduction = computeLey492002Deduction({
    donativoEur: importeSolicitado,
    donorType,
    recurring: request.recurring ?? false
  });

  if (!deduction.ok || !deduction.data) {
    return { ok: false, error: deduction.error ?? 'DONATIVO_INVALIDO: no se pudo calcular la deducción.' };
  }

  return {
    ok: true,
    data: {
      licitacion: null,
      tender: null,
      financials: null,
      donation: {
        importeEur: importeSolicitado,
        ivaAplicable: false,
        nota: 'El donativo puro no está sujeto a IVA (Ley 37/1992). Si existe contraprestación publicitaria deja de ser donativo y tributa por el art. 25 de la Ley 49/2002.'
      },
      fiscal: deduction.data,
      baseSplit: importeSolicitado
    }
  };
}

// ════ FIN NÚCLEO FINANCIERO ════

/** Documentación exigida antes de presentar oferta o emitir certificado. */
export function buildDocumentacionRequerida(channel: RscChannel): string[] {
  if (channel === 'B2G') {
    return [
      'Pliego, memoria o referencia documental del gasto (el motor exige su referencia: no la inventa)',
      'Código DIR3 del órgano contratante para la factura electrónica vía FACe',
      'Factura electrónica presentada por FACe',
      'Certificados de corriente de pago con AEAT y Seguridad Social',
      'Póliza de responsabilidad civil de explotación vigente',
      'Valor estimado del contrato por debajo del techo preventivo del Art. 118.1 LCSP'
    ];
  }
  return [
    'Donativo puro, sin contraprestación publicitaria (art. 20 Ley 49/2002)',
    'Certificado de mecenazgo emitido por la entidad beneficiaria',
    'Modelo 182 AEAT (lo presenta la entidad beneficiaria, no el donante)',
    'Justificante de la transferencia con referencia del expediente',
    'Validación del límite legal de la deducción por el asesor fiscal del donante'
  ];
}

/** Disclaimers no negociables (JUR-1 · JUR-3 · AF-2). */
export function buildDisclaimers(): string[] {
  return [
    'Programa de estimulación neuroacústica no farmacológica: no es tratamiento médico ni promesa terapéutica.',
    'El reparto 80/10/10 y los importes se calculan en servidor desde el SSOT; ningún componente los recalcula.',
    'La entrega al webhook es idempotente: reintentos con la misma referencia no duplican el certificado.',
    'La cola de muertos es visible en ' + VIMUME_RSC_TELEMETRY_URL + ' (requiere credencial de cron).'
  ];
}

// ════ FIN DOCUMENTACIÓN REQUERIDA ════

interface ComposedCertificate {
  certificate: VimumeRscCertificate;
  payload: Record<string, unknown>;
}

/**
 * Compone el certificado completo. Función pura respecto a la red: no despacha,
 * no escribe en el ledger y no mira el reloj (la fecha entra por parámetro, de
 * modo que una repetición con la misma clave produce byte a byte lo mismo).
 */
function composeCertificate(
  request: RscCertificateRequest,
  idempotencyKey: string,
  issuedAt: string
): EngineResult<ComposedCertificate> {
  const entityName = (request.entityName ?? '').trim();

  if (!isRscChannel(request.channel)) {
    return { ok: false, error: `VALIDACION: canal desconocido (${String(request.channel)}). Admitidos: ${RSC_CHANNELS.join(', ')}.` };
  }
  if (entityName.length < 3) {
    return { ok: false, error: 'VALIDACION: el nombre de la entidad debe tener al menos 3 caracteres.' };
  }
  if (!isVimumeProgramPreset(request.programPreset)) {
    return {
      ok: false,
      error: `VALIDACION: programa desconocido (${String(request.programPreset)}). Admitidos: ${VIMUME_PRESET_IDS.join(', ')}.`
    };
  }

  const preset = B2G_PRESETS[request.programPreset];
  const asistentes = Math.trunc(request.asistentesPorSesion ?? ASISTENTES_POR_SESION_POR_DEFECTO);

  // El rider acústico se homologa ANTES de calcular dinero: si la sesión no es
  // segura, no hay certificado que emitir (caso límite > 75 dB SPL).
  const acousticResult = evaluateAcousticRider({
    splDb: request.splDbPropuesto ?? SPL_OBJETIVO_PROTOCOLO_40HZ_DB,
    asistentes,
    protocolo40Hz: true
  });

  if (!acousticResult.ok || !acousticResult.data) {
    return { ok: false, error: acousticResult.error ?? 'SPL_INVALIDO: no se pudo homologar el rider acústico.' };
  }

  const acoustic = acousticResult.data;
  const expedienteId = `EXP-VIM-${idempotencyKey.slice(0, 10).toUpperCase()}`;
  const contact = buildContactReference(request.contactEmail);

  const core = computeFinancialCore(request, preset, expedienteId, issuedAt);
  if (!core.ok || !core.data) {
    return { ok: false, error: core.error ?? 'VALIDACION: no se pudo calcular el núcleo financiero.' };
  }

  const splitResult = computeSplitSoberano(core.data.baseSplit);
  if (!splitResult.ok || !splitResult.data) {
    return { ok: false, error: splitResult.error ?? 'BASE_INVALIDA: no se pudo calcular el split.' };
  }

  const split = splitResult.data;
  const centres = request.targetCentresCount ?? preset.centres;

  const dossierMarkdown = core.data.tender
    ? core.data.tender.sections.dossierCompletoMarkdown
    : buildRscDossierMarkdown({
        expedienteId,
        issuedAt,
        entityName,
        department: request.department?.trim() ?? null,
        cif: request.cif?.trim().toUpperCase() ?? null,
        contactRef: contact.contactRef,
        programName: preset.name,
        programSessions: preset.sessions,
        programCentres: centres,
        asistentesPorSesion: acoustic.asistentes,
        importeEur: core.data.donation?.importeEur ?? split.base,
        fiscal: core.data.fiscal,
        split,
        acoustic
      });

  const documentacionRequerida = buildDocumentacionRequerida(request.channel);
  const disclaimers = buildDisclaimers();

  const entity = {
    name: entityName,
    department: request.department?.trim() ?? null,
    cif: request.cif?.trim().toUpperCase() ?? null,
    dir3Code: request.dir3Code?.trim().toUpperCase() ?? null,
    pliegoRef: request.pliegoRef?.trim() ?? null
  };

  const program = {
    preset: request.programPreset,
    name: preset.name,
    sessions: preset.sessions,
    centres,
    asistentesPorSesion: acoustic.asistentes,
    pricingRule: preset.pricingRule
  };

  const payloadCore: Record<string, unknown> = {
    schemaVersion: '1.0.0',
    type: 'vimume.rsc.certificate',
    engine: 'vimume-b2g-tender-engine',
    expedienteId,
    idempotencyKey,
    channel: request.channel,
    entity,
    contact,
    program,
    financials: core.data.financials,
    donation: core.data.donation,
    split,
    fiscal: core.data.fiscal,
    acoustic,
    licitacion: core.data.licitacion,
    tenderSha256: core.data.tender ? core.data.tender.sha256Hash : null,
    dossierSha256: sha256Hex(dossierMarkdown),
    provenance: {
      ssot: 'src/lib/constants/ear-os-ssot.ts',
      engine: 'src/lib/vimume/b2g-tender-engine.ts',
      sroi: SROI_PROVENANCE,
      fiscal: LEY_49_2002.fuente,
      acoustic: acoustic.baseTecnica,
      lcsp: BASE_LEGAL_TECHO
    },
    disclaimers
  };

  const payloadSha256 = sha256Hex(stableStringify(payloadCore));

  const payload: Record<string, unknown> = {
    ...payloadCore,
    payloadSha256,
    hashSpec: PAYLOAD_HASH_SPEC,
    issuedAt,
    dossierMarkdown
  };

  const certificate: VimumeRscCertificate = {
    expedienteId,
    idempotencyKey,
    payloadSha256,
    hashSpec: PAYLOAD_HASH_SPEC,
    issuedAt,
    channel: request.channel,
    entity,
    contact,
    program,
    tender: core.data.tender,
    financials: core.data.financials,
    donation: core.data.donation,
    split,
    fiscal: core.data.fiscal,
    acoustic,
    licitacion: core.data.licitacion,
    dossierMarkdown,
    documentacionRequerida,
    // Estado neutro: lo completa `issueVimumeRscCertificate` tras el despacho.
    delivery: {
      delivered: false,
      status: null,
      attempts: 0,
      lastError: null,
      mode: 'REAL',
      dlqVisibleAt: VIMUME_RSC_TELEMETRY_URL
    },
    dispatches: 0,
    idempotentReplay: false,
    scope: SCOPE
  };

  return { ok: true, data: { certificate, payload } };
}

export interface IssueCertificateOptions {
  /** Sólo diagnóstico interno: no toca la red y lo declara como SIMULADO (AF-2). */
  skipNetwork?: boolean;
  /** Fecha inyectable para pruebas deterministas del ledger. */
  issuedAt?: string;
}

/**
 * Entrega el certificado al webhook `vimume-clinical-report`.
 * `dispatchToN8n` ya reintenta 3 veces con backoff y encola en la DLQ al fallar:
 * aquí sólo se traduce ese resultado a un campo observable del certificado.
 */
async function deliverCertificate(
  certificate: VimumeRscCertificate,
  payload: Record<string, unknown>,
  options: IssueCertificateOptions
): Promise<void> {
  certificate.dispatches += 1;
  RSC_METRICS.dispatches += 1;

  if (options.skipNetwork) {
    certificate.delivery = {
      delivered: false,
      status: null,
      attempts: 0,
      lastError: 'NETWORK_SKIPPED_DIAGNOSTIC',
      mode: 'SIMULADO',
      dlqVisibleAt: VIMUME_RSC_TELEMETRY_URL
    };
    return;
  }

  try {
    const result: N8nDispatchResult = await dispatchToN8n(VIMUME_RSC_WEBHOOK_SLUG, payload);

    certificate.delivery = {
      delivered: result.delivered,
      status: result.status,
      attempts: result.attempts,
      lastError: result.lastError,
      mode: 'REAL',
      dlqVisibleAt: VIMUME_RSC_TELEMETRY_URL
    };

    if (!result.delivered) {
      RSC_METRICS.dispatchFailures += 1;
    }
  } catch (reason) {
    RSC_METRICS.dispatchFailures += 1;
    certificate.delivery = {
      delivered: false,
      status: null,
      attempts: 1,
      lastError: reason instanceof Error ? reason.message : String(reason),
      mode: 'REAL',
      dlqVisibleAt: VIMUME_RSC_TELEMETRY_URL
    };
  }
}

/**
 * Emite (o devuelve) el certificado RSC. IDEMPOTENTE por construcción:
 *  · misma clave + certificado ya emitido  → devuelve la fila existente (replay);
 *  · misma clave + petición en vuelo       → se cuelga de la misma promesa;
 *  · misma clave + nunca vista             → compone, entrega y guarda 1 fila.
 * Nunca lanza: todo error se devuelve como `{ ok:false, error }`.
 */
export async function issueVimumeRscCertificate(
  request: RscCertificateRequest,
  options: IssueCertificateOptions = {}
): Promise<EngineResult<VimumeRscCertificate>> {
  try {
    const idempotencyKey = buildCertificateIdempotencyKey(request);

    const stored = CERTIFICATE_LEDGER.get(idempotencyKey);
    if (stored) {
      RSC_METRICS.replays += 1;
      return { ok: true, data: { ...stored.certificate, idempotentReplay: true } };
    }

    const inflight = INFLIGHT.get(idempotencyKey);
    if (inflight) {
      RSC_METRICS.replays += 1;
      const shared = await inflight;
      if (!shared.ok || !shared.data) {
        return shared;
      }
      return { ok: true, data: { ...shared.data, idempotentReplay: true } };
    }

    const task = (async (): Promise<EngineResult<VimumeRscCertificate>> => {
      const issuedAt = options.issuedAt ?? new Date().toISOString();
      const composed = composeCertificate(request, idempotencyKey, issuedAt);

      if (!composed.ok || !composed.data) {
        RSC_METRICS.rejections += 1;
        return { ok: false, error: composed.error ?? 'CERTIFICADO_NO_EMITIDO: la composición falló sin motivo declarado.' };
      }

      const { certificate, payload } = composed.data;
      await deliverCertificate(certificate, payload, options);
      CERTIFICATE_LEDGER.set(idempotencyKey, { certificate, payload });
      RSC_METRICS.issued += 1;

      return { ok: true, data: certificate };
    })();

    INFLIGHT.set(idempotencyKey, task);

    try {
      return await task;
    } finally {
      INFLIGHT.delete(idempotencyKey);
    }
  } catch (reason) {
    RSC_METRICS.rejections += 1;
    return {
      ok: false,
      error: `CERTIFICADO_NO_EMITIDO: ${reason instanceof Error ? reason.message : String(reason)}`
    };
  }
}

/**
 * Reintenta la entrega de un certificado ya emitido SIN crear otra fila.
 * Es el botón de reintento del operador y la prueba viva de INV-08: `dispatches`
 * sube, `CERTIFICATE_LEDGER.size` no.
 */
export async function retryVimumeCertificate(
  idempotencyKey: string,
  options: IssueCertificateOptions = {}
): Promise<EngineResult<VimumeRscCertificate>> {
  try {
    const key = (idempotencyKey ?? '').trim().toLowerCase();

    if (!/^[0-9a-f]{64}$/.test(key)) {
      return {
        ok: false,
        error: 'VALIDACION: la clave de idempotencia debe ser un SHA-256 hexadecimal de 64 caracteres.'
      };
    }

    const stored = CERTIFICATE_LEDGER.get(key);
    if (!stored) {
      return {
        ok: false,
        error:
          'EXPEDIENTE_NO_ENCONTRADO: no hay certificado emitido con esa clave en este proceso. ' +
          'El ledger es process-local y se reinicia en cada redeploy; vuelve a emitir el certificado para regenerarlo.'
      };
    }

    await deliverCertificate(stored.certificate, stored.payload, options);

    return { ok: true, data: { ...stored.certificate, idempotentReplay: true } };
  } catch (reason) {
    return {
      ok: false,
      error: `REINTENTO_FALLIDO: ${reason instanceof Error ? reason.message : String(reason)}`
    };
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TELEMETRÍA FORENSE — LEDGER + COLA DE MUERTOS VISIBLE (directiva 9)
// ════════════════════════════════════════════════════════════════════════════

export interface VimumeRscDeadLetterView {
  slug: string;
  attempts: number;
  lastError: string;
  ts: string;
  idempotencyKey: string | null;
  expedienteId: string | null;
}

export interface VimumeRscTelemetry {
  ok: true;
  probed: true;
  source: 'live';
  mode: 'REAL';
  checkedAt: string;
  scope: VimumeRscScope;
  ledger: {
    certificates: number;
    issuances: number;
    replays: number;
    rejections: number;
    dispatches: number;
    dispatchFailures: number;
    deliveredCount: number;
    pendingDelivery: number;
    /** Huella del conjunto ordenado de claves: detecta borrado o inyección. */
    fingerprint: string;
  };
  webhook: { slug: typeof VIMUME_RSC_WEBHOOK_SLUG; url: string };
  dlqCount: number;
  dlq: VimumeRscDeadLetterView[];
}

/**
 * Instantánea de telemetría. NUNCA devuelve el payload de un evento caído:
 * la DLQ es compartida con otros workflows (b2b-quote, call-center-intake) cuyos
 * cuerpos pueden contener datos personales. Aquí sólo se publican metadatos
 * (slug, intentos, error, fecha) y las claves del certificado VIMUME (INV-14).
 */
export function getVimumeRscTelemetry(): VimumeRscTelemetry {
  const certificates = [...CERTIFICATE_LEDGER.values()].map((record) => record.certificate);
  const orderedKeys = [...CERTIFICATE_LEDGER.keys()].sort();

  const deadLetters: VimumeRscDeadLetterView[] = getDeadLetterQueue().map((entry) => {
    const isVimume = entry.slug === VIMUME_RSC_WEBHOOK_SLUG;
    const payload = isVimume ? entry.payload : null;
    const idempotencyKey =
      payload && typeof payload.idempotencyKey === 'string' ? payload.idempotencyKey : null;
    const expedienteId =
      payload && typeof payload.expedienteId === 'string' ? payload.expedienteId : null;

    return {
      slug: entry.slug,
      attempts: entry.attempts,
      lastError: entry.lastError,
      ts: entry.ts,
      idempotencyKey,
      expedienteId
    };
  });

  return {
    ok: true,
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    scope: SCOPE,
    ledger: {
      certificates: CERTIFICATE_LEDGER.size,
      issuances: RSC_METRICS.issued,
      replays: RSC_METRICS.replays,
      rejections: RSC_METRICS.rejections,
      dispatches: RSC_METRICS.dispatches,
      dispatchFailures: RSC_METRICS.dispatchFailures,
      deliveredCount: certificates.filter((certificate) => certificate.delivery.delivered).length,
      pendingDelivery: certificates.filter((certificate) => !certificate.delivery.delivered).length,
      fingerprint: sha256Hex(orderedKeys.join('|'))
    },
    webhook: {
      slug: VIMUME_RSC_WEBHOOK_SLUG,
      url: buildN8nWebhookUrl(VIMUME_RSC_WEBHOOK_SLUG)
    },
    dlqCount: deadLetters.length,
    dlq: deadLetters
  };
}

// ════════════════════════════════════════════════════════════════════════════
// CATÁLOGO PÚBLICO — LA UI NO TECLEA PRECIOS (INV-10)
// ════════════════════════════════════════════════════════════════════════════

export interface VimumeRscCataloguePreset {
  id: VimumeProgramPreset;
  name: string;
  description: string;
  sessions: number;
  centres: number;
  basePrice: number;
  pricingRule: string;
}

export interface VimumeRscCatalogue {
  ok: true;
  probed: true;
  source: 'ssot-derived';
  mode: 'REAL';
  checkedAt: string;
  presets: VimumeRscCataloguePreset[];
  channels: { id: RscChannel; label: string; description: string; ivaAplicable: boolean }[];
  fiscal: {
    fuente: string;
    modeloAeat: string;
    umbralPrimerTramoEur: number;
    tipos: {
      pfPrimerTramo: number;
      pfResto: number;
      pfRestoRecurrente: number;
      pj: number;
      pjRecurrente: number;
    };
  };
  acoustic: {
    rangoConfortDb: { min: number; max: number };
    splObjetivoDb: number;
    limiteSplDb: number;
    wattsPorPax: number;
  };
  lcsp: { techoPreventivoEur: number; limiteLegalEur: number; baseLegal: string };
  split: { ratios: { artista: number; earOs: number; vimume: number }; fuente: string };
  webhook: { slug: typeof VIMUME_RSC_WEBHOOK_SLUG; url: string };
  defaults: { splDbPropuesto: number; asistentesPorSesion: number };
  provenance: { ssot: string; engine: string };
  disclaimers: string[];
  documentacion: { B2G: string[]; RSC: string[] };
}

/**
 * Catálogo que consume la interfaz. Existe para que el componente NO escriba ni
 * un solo precio: los importes salen de aquí, es decir, del SSOT, y cualquier
 * cambio de tarifa se propaga sin tocar el JSX.
 */
export function getVimumeRscCatalogue(): VimumeRscCatalogue {
  return {
    ok: true,
    probed: true,
    source: 'ssot-derived',
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    presets: VIMUME_PRESET_IDS.map((id) => {
      const preset = B2G_PRESETS[id];
      return {
        id,
        name: preset.name,
        description: preset.description,
        sessions: preset.sessions,
        centres: preset.centres,
        basePrice: preset.basePrice,
        pricingRule: preset.pricingRule
      };
    }),
    channels: [
      {
        id: 'B2G',
        label: 'Contrato menor B2G (Art. 118.1 LCSP)',
        description:
          'Ayuntamientos y entidades públicas. Exige código DIR3 y referencia documental del gasto; no admite importes por encima del techo preventivo.',
        ivaAplicable: true
      },
      {
        id: 'RSC',
        label: 'Patrocinio RSC / mecenazgo (Ley 49/2002)',
        description:
          'Empresas y donantes privados. Donativo puro sin contraprestación publicitaria; genera certificado de mecenazgo y Modelo 182.',
        ivaAplicable: false
      }
    ],
    fiscal: {
      fuente: LEY_49_2002.fuente,
      modeloAeat: LEY_49_2002.modeloAeat,
      umbralPrimerTramoEur: LEY_49_2002.umbralPrimerTramoEur,
      tipos: {
        pfPrimerTramo: LEY_49_2002.tipoPfPrimerTramo,
        pfResto: LEY_49_2002.tipoPfResto,
        pfRestoRecurrente: LEY_49_2002.tipoPfRestoRecurrente,
        pj: LEY_49_2002.tipoPj,
        pjRecurrente: LEY_49_2002.tipoPjRecurrente
      }
    },
    acoustic: {
      rangoConfortDb: { min: RANGO_CONFORT_SPL_DB.min, max: RANGO_CONFORT_SPL_DB.max },
      splObjetivoDb: SPL_OBJETIVO_PROTOCOLO_40HZ_DB,
      limiteSplDb: LIMITE_SPL_DB,
      wattsPorPax: WATTS_PER_PAX
    },
    lcsp: {
      techoPreventivoEur: SAFE_LCSP_CEILING_EUR,
      limiteLegalEur: LIMITE_B2G_LCSP_EUR,
      baseLegal: BASE_LEGAL_TECHO
    },
    split: {
      ratios: {
        artista: SPLIT_SOBERANO.artista,
        earOs: SPLIT_SOBERANO.earOs,
        vimume: SPLIT_SOBERANO.vimume
      },
      fuente: 'src/lib/constants/ear-os-ssot.ts → SPLIT_SOBERANO'
    },
    webhook: {
      slug: VIMUME_RSC_WEBHOOK_SLUG,
      url: buildN8nWebhookUrl(VIMUME_RSC_WEBHOOK_SLUG)
    },
    defaults: {
      splDbPropuesto: SPL_OBJETIVO_PROTOCOLO_40HZ_DB,
      asistentesPorSesion: ASISTENTES_POR_SESION_POR_DEFECTO
    },
    provenance: {
      ssot: 'src/lib/constants/ear-os-ssot.ts',
      engine: 'src/lib/vimume/b2g-tender-engine.ts'
    },
    disclaimers: buildDisclaimers(),
    documentacion: {
      B2G: buildDocumentacionRequerida('B2G'),
      RSC: buildDocumentacionRequerida('RSC')
    }
  };
}

// ════════════════════════════════════════════════════════════════════════════
// DIAGNÓSTICO EJECUTABLE — LA PRUEBA, NO LA PROMESA
// ════════════════════════════════════════════════════════════════════════════

/** Vacía el ledger y las métricas. SÓLO diagnóstico: nunca en producción. */
export function resetVimumeRscLedger(): void {
  CERTIFICATE_LEDGER.clear();
  INFLIGHT.clear();
  RSC_METRICS.issued = 0;
  RSC_METRICS.replays = 0;
  RSC_METRICS.rejections = 0;
  RSC_METRICS.dispatches = 0;
  RSC_METRICS.dispatchFailures = 0;
}

export interface VimumeRscDiagnosticReport {
  status: 'SUCCESS' | 'FAILURE';
  testsPassed: number;
  totalTests: number;
  logs: string[];
  checkedAt: string;
}

/**
 * Ocho pruebas que se ejecutan de verdad y devuelven un veredicto máquina.
 * Se corre en modo `skipNetwork` (declarado SIMULADO) para que el diagnóstico no
 * dispare certificados reales al webhook de producción.
 */
export async function runVimumeRscDiagnostics(): Promise<VimumeRscDiagnosticReport> {
  const logs: string[] = [];
  let testsPassed = 0;
  const totalTests = 8;
  const checkedAt = new Date().toISOString();

  const check = (condition: boolean, okMessage: string, koMessage: string): void => {
    if (condition) {
      testsPassed += 1;
      logs.push(`✅ ${okMessage}`);
    } else {
      logs.push(`❌ ${koMessage}`);
    }
  };

  const baseRequest: RscCertificateRequest = {
    channel: 'RSC',
    entityName: 'Fundación Banco Ejemplo',
    department: 'RSC y Mecenazgo',
    cif: 'G00000000',
    programPreset: 'PILOTO_TRIMESTRAL',
    customBudget: 4200,
    targetCentresCount: 5,
    asistentesPorSesion: 30,
    donorType: 'PERSONA_JURIDICA',
    recurring: false,
    splDbPropuesto: 72
  };

  try {
    resetVimumeRscLedger();

    // 1 · Los cuatro paquetes se derivan del SSOT (0 precios literales · INV-10).
    check(
      B2G_PRESETS.PILOTO_TRIMESTRAL.basePrice === 12 * TARIFA_BASE_SOLISTA_EUR &&
        B2G_PRESETS.ANTI_SOLEDAD_SENIOR.basePrice === 24 * TARIFA_BASE_SOLISTA_EUR &&
        B2G_PRESETS.GALA_MAYOR.basePrice === 8 * TARIFA_BASE_SOLISTA_EUR &&
        B2G_PRESETS.PLAN_ANUAL_TECHO.basePrice === SAFE_LCSP_CEILING_EUR,
      'Test 1: los 4 presupuestos se derivan de TARIFA_BASE_SOLISTA_EUR y del techo del SSOT.',
      'Test 1: algún preset no nace del SSOT (precio hardcodeado).'
    );

    // 2 · Techo preventivo Art. 118.1 LCSP.
    const dentroTecho = evaluateLicitacionB2G({
      importe: SAFE_LCSP_CEILING_EUR,
      pliego: 'EXP-PLIEGO-2026-001',
      dir3Code: 'L01180734'
    });
    const fueraTecho = evaluateLicitacionB2G({
      importe: SAFE_LCSP_CEILING_EUR + 550,
      pliego: 'EXP-PLIEGO-2026-001',
      dir3Code: 'L01180734'
    });
    check(
      dentroTecho.ok &&
        dentroTecho.data !== undefined &&
        dentroTecho.data.limite === SAFE_LCSP_CEILING_EUR &&
        !fueraTecho.ok,
      `Test 2: ${SAFE_LCSP_CEILING_EUR.toFixed(2)} € pasa y un importe superior se bloquea con aviso legal.`,
      'Test 2: el techo preventivo del Art. 118.1 LCSP no bloquea correctamente.'
    );

    // 3 · Sin pliego y sin DIR3 no hay oferta (el motor no inventa datos).
    const sinPliego = evaluateLicitacionB2G({ importe: 3000, dir3Code: 'L01180734' });
    const sinDir3 = evaluateLicitacionB2G({ importe: 3000, pliego: 'EXP-PLIEGO-2026-001' });
    check(
      !sinPliego.ok &&
        sinPliego.error !== undefined &&
        sinPliego.error.startsWith('PLIEGO_REQUERIDO') &&
        !sinDir3.ok &&
        sinDir3.error !== undefined &&
        sinDir3.error.startsWith('DIR3_REQUERIDO'),
      'Test 3: sin pliego y sin DIR3 la oferta se rechaza (no hay datos inventados).',
      'Test 3: el motor emitió oferta sin pliego o sin DIR3.'
    );

    // 4 · Split 80/10/10 del SSOT, en euros y cuadrado contra la base.
    const split = computeSplitSoberano(4200);
    check(
      split.ok &&
        split.data !== undefined &&
        split.data.artista === 3360 &&
        split.data.earOs === 420 &&
        split.data.vimume === 420 &&
        split.data.artista + split.data.earOs + split.data.vimume === split.data.base,
      'Test 4: split 80/10/10 correcto (3.360,00 / 420,00 / 420,00 €) y suma exacta.',
      'Test 4: el split no cuadra con la base o con los ratios del SSOT.'
    );

    // 5 · Ley 49/2002: PF recurrente 537,50 € · PJ 400,00 € · PJ recurrente 500,00 €.
    const fiscalPf = computeLey492002Deduction({ donativoEur: 1000, donorType: 'PERSONA_FISICA', recurring: true });
    const fiscalPj = computeLey492002Deduction({ donativoEur: 1000, donorType: 'PERSONA_JURIDICA', recurring: false });
    const fiscalPjRec = computeLey492002Deduction({ donativoEur: 1000, donorType: 'PERSONA_JURIDICA', recurring: true });
    check(
      fiscalPf.data !== undefined &&
        fiscalPf.data.deduccionTotal === 537.5 &&
        fiscalPj.data !== undefined &&
        fiscalPj.data.deduccionTotal === 400 &&
        fiscalPjRec.data !== undefined &&
        fiscalPjRec.data.deduccionTotal === 500,
      'Test 5: deducción Ley 49/2002 correcta (PF recurrente 537,50 €; PJ 400,00 €; PJ recurrente 500,00 €).',
      'Test 5: la deducción fiscal no coincide con el art. 20 de la Ley 49/2002.'
    );

    // 6 · Rider acústico: > 75 dB SPL se rechaza; 72 dB se homologa.
    const sobreLimite = evaluateAcousticRider({ splDb: 78, asistentes: 30 });
    const homologado = evaluateAcousticRider({ splDb: 72, asistentes: 30 });
    check(
      !sobreLimite.ok &&
        homologado.ok &&
        homologado.data !== undefined &&
        homologado.data.potenciaRequeridaW === 30 * WATTS_PER_PAX &&
        homologado.data.wattsPorPax === WATTS_PER_PAX,
      `Test 6: 78 dB SPL rechazado por salud pública; 72 dB homologado con ${30 * WATTS_PER_PAX} W para 30 asistentes.`,
      'Test 6: el rider acústico no rechaza el exceso o no calcula 12 W/pax.'
    );

    // 7 · Idempotencia: 3 emisiones con la misma referencia ⇒ 1 fila (INV-08).
    const emision1 = await issueVimumeRscCertificate(baseRequest, { skipNetwork: true });
    const emision2 = await issueVimumeRscCertificate(baseRequest, { skipNetwork: true });
    const emision3 = await issueVimumeRscCertificate(baseRequest, { skipNetwork: true });
    const telemetry = getVimumeRscTelemetry();
    check(
      emision1.ok &&
        emision1.data !== undefined &&
        emision2.ok &&
        emision2.data !== undefined &&
        emision2.data.idempotentReplay === true &&
        emision3.ok &&
        emision3.data !== undefined &&
        emision3.data.expedienteId === emision1.data.expedienteId &&
        telemetry.ledger.certificates === 1,
      `Test 7: 3 reintentos con la misma referencia producen 1 fila (replays=${telemetry.ledger.replays}).`,
      `Test 7: se duplicó la fila ante reintentos (filas=${telemetry.ledger.certificates}).`
    );

    // 8 · Normalización de la clave + reintento sin fila nueva.
    const variante = await issueVimumeRscCertificate(
      { ...baseRequest, entityName: '  fundación   BANCO ejemplo  ' },
      { skipNetwork: true }
    );
    const claveDistinta = buildCertificateIdempotencyKey({ ...baseRequest, programPreset: 'GALA_MAYOR' });
    const reintento = emision1.data
      ? await retryVimumeCertificate(emision1.data.idempotencyKey, { skipNetwork: true })
      : { ok: false, error: 'SIN_CLAVE' };
    const telemetryFinal = getVimumeRscTelemetry();
    check(
      variante.ok &&
        variante.data !== undefined &&
        emision1.data !== undefined &&
        variante.data.idempotencyKey === emision1.data.idempotencyKey &&
        claveDistinta !== emision1.data.idempotencyKey &&
        reintento.ok &&
        telemetryFinal.ledger.certificates === 1 &&
        telemetryFinal.ledger.dispatches >= 2,
      'Test 8: la clave ignora mayúsculas/espacios, cambia con el programa y el reintento no crea fila.',
      'Test 8: la clave de idempotencia no normaliza o el reintento duplicó la fila.'
    );

    resetVimumeRscLedger();

    return {
      status: testsPassed === totalTests ? 'SUCCESS' : 'FAILURE',
      testsPassed,
      totalTests,
      logs,
      checkedAt
    };
  } catch (reason) {
    logs.push(`❌ Excepción durante el diagnóstico: ${reason instanceof Error ? reason.message : String(reason)}`);
    return { status: 'FAILURE', testsPassed, totalTests, logs, checkedAt };
  }
}
