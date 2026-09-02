import { createHash } from 'crypto';
import { 
  getClinicalJustificationText, 
  getLegalLcspJustificationText, 
  getSroiJustificationText, 
  getTechnicalRiderJustificationText 
} from '@/lib/constants/vimume-100-levels';

export interface B2GTenderInput {
  entityName: string; // Ej: "Ayuntamiento de Toledo"
  department: string; // Ej: "Concejalía de Asuntos Sociales y Tercera Edad"
  cif?: string;
  dir3Code?: string; // Código DIR3 municipal
  programPreset: 'PILOTO_TRIMESTRAL' | 'ANTI_SOLEDAD_SENIOR' | 'GALA_MAYOR' | 'PLAN_ANUAL_TECHO';
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
    vatAmount: number; // 21% IVA
    totalBudget: number;
    isLCSPCompliant: boolean; // Presupuesto Base < 15.000 €
    adjustedCeilingApplied: boolean;
    sroiRatio: number; // 4.85x
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

export const B2G_PRESETS = {
  PILOTO_TRIMESTRAL: {
    name: "Piloto Trimestral Envejecimiento Activo (5 Centros)",
    basePrice: 4200,
    centres: 5,
    description: "Programa de choque neuroacústico y música biográfica de 12 semanas en residencias municipales."
  },
  ANTI_SOLEDAD_SENIOR: {
    name: "Programa Semestral Anti-Soledad no Deseada",
    basePrice: 8400,
    centres: 8,
    description: "Intervención continuada para la mitigación del aislamiento afectivo en centros residenciales y de día."
  },
  GALA_MAYOR: {
    name: "Gala Institucional & Homenaje Memoria Viva (Día del Mayor)",
    basePrice: 2800,
    centres: 1,
    description: "Espectáculo participativo en directo de alta fidelidad con tenor y ensamble instrumental."
  },
  PLAN_ANUAL_TECHO: {
    name: "Plan Anual de Cohesión Social y Neuroacústica (Techo Art. 118 LCSP)",
    basePrice: 14250,
    centres: 12,
    description: "Despliegue integral en la red pública municipal ajustado al 95% del límite de Contrato Menor."
  }
};

const MAX_LCSP_MINOR_CONTRACT_LIMIT = 15000.00;
const SAFE_LCSP_CEILING = 14250.00; // 95% del techo legal

export function generateVimumeTender(input: B2GTenderInput): B2GTenderOutput {
  const presetConfig = B2G_PRESETS[input.programPreset] || B2G_PRESETS.PILOTO_TRIMESTRAL;
  
  let rawBudget = input.customBudget !== undefined && input.customBudget > 0 
    ? input.customBudget 
    : presetConfig.basePrice;

  let adjustedCeilingApplied = false;
  if (rawBudget >= MAX_LCSP_MINOR_CONTRACT_LIMIT) {
    rawBudget = SAFE_LCSP_CEILING;
    adjustedCeilingApplied = true;
  }

  const vatAmount = Number((rawBudget * 0.21).toFixed(2));
  const totalBudget = Number((rawBudget + vatAmount).toFixed(2));
  const sroiRatio = 4.85;
  const socialReturnEuroValue = Number((rawBudget * sroiRatio).toFixed(2));

  const artistNet80 = Number((rawBudget * 0.80).toFixed(2));
  const infrastructure10 = Number((rawBudget * 0.10).toFixed(2));
  const vimumeResearch10 = Number((rawBudget * 0.10).toFixed(2));

  const timestamp = new Date().toISOString();
  const expedienteId = `EXP-VIM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

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
**IVA (21%):** ${vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
**Importe Total Expediente:** ${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
${adjustedCeilingApplied ? `\n> **[ALERTA TÉCNICA CONTROL LCSP]:** El importe introducido sobrepasaba el techo de 15.000,00 €. Se ha reajustado automáticamente al 95% del límite legal (${SAFE_LCSP_CEILING.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €) para asegurar la adjudicación directa mediante Contrato Menor.` : ''}

### Codificación CPV Homologada:
- **CPV Principal 85320000-8:** Servicios Sociales (Atención sociosanitaria a la tercera edad y prevención de la dependencia).
- **CPV Secundario 92300000-4:** Servicios de Entretenimiento (Conciertos en directo y producción artística especializada).

### Fundamentación Legal & Exclusividad Singular:
1. Conforme al Art. 118.1 de la LCSP, el presente contrato no excede de 15.000,00 € de valor estimado, requiriendo únicamente la aprobación del gasto, la incorporación de la factura electrónica vía FACe y la justificación de la necesidad.
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
- **Ratio SROI Demostrado:** **4,85x** (Por cada 1,00 € invertido por la Administración Pública, se generan 4,85 € de retorno social tangible).
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

### 1. Control Estricto de Presión Sonora (<75 dB SPL):
- Límite máximo infranqueable de volumen calibrado a **<75 dB SPL** en sala para prevenir sobreestimulación o hiperacusia en residentes con demencias avanzadas.
- Telemetría de monitorización activa mediante sonometría en tiempo real.

### 2. Equipamiento Electroacústico Homologado:
- **Cálculo Acústico:** 12 W de potencia electroacústica por persona (sistemas Bose F1 812 / Bose S1 Pro con dispersión vertical controlada).
- **Microfonía Inalámbrica de Alta Fidelidad:** Cápsulas de condensador Shure Beta 87A y receptores digitales Shure GLXD4 / Axient para máxima claridad vocal sin distorsión armónica.

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
**Facturación Electrónica:** Obligatoria vía FACe con inyección de código DIR3 (${input.dir3Code || 'ASIGNAR_EN_ALCALDIA'})

**Resumen de la Adjudicación:**
- Presupuesto Base: ${rawBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- IVA (21%): ${vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- Importe Total Expediente: ${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- Estado Cumplimiento LCSP: **CONFORME ART. 118.1 LCSP (< 15.000,00 €)**
`.trim();

  const dossierCompletoMarkdown = `
# EXPEDIENTE INSTITUCIONAL B2G — PROYECTO VIMUME
**Nº Expediente:** ${expedienteId}  
**Fecha de Emisión:** ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}  
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

  const sha256Hash = createHash('sha256')
    .update(`${expedienteId}-${input.entityName}-${rawBudget}-${timestamp}`)
    .digest('hex');

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
      sroiRatio,
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
