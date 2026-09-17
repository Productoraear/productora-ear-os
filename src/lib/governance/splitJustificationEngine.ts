/**
 * 🛡️ SPLIT JUSTIFICATION ENGINE — JUSTIFICADOR INTERACTIVO DEL SPLIT SOBERANO 80/10/10
 * ---------------------------------------------------------------------
 * Motor de gobernanza económica, jurídica y social. Demuestra de forma
 * matemática por qué el Split Soberano (80% Artista / 10% EAR OS / 10%
 * VIMUME) es un modelo ético, deducible y no comparable con la comisión
 * parasitaria del 20%-50% de un mánager o agencia tradicional.
 *
 * Reglas SSOT inmutables:
 *  - Tarifa Base Solista (Edwin Agudelo): 350,00 €.
 *  - 80% Artista Ejecutor / 10% EAR OS / 10% VIMUME (Impacto Social).
 *  - Ley 49/2002: hasta 80% deducible en IRPF (primeros 250 €) y 40-50%
 *    en Impuesto de Sociedades mediante Certificado Modelo 182 AEAT.
 *  - Retorno social contrastado SROI: 4,85x.
 */

export type SplitActor = 'artista' | 'earOs' | 'vimume';

export interface SplitBreakdown {
  artista: number;
  earOs: number;
  vimume: number;
  total: number;
  invariantOk: boolean; // artista + earOs + vimume === total
}

export interface FiscalBenefit {
  aportacionVimume: number; // 10% del presupuesto dedicado al impacto social
  deduccionIrpf: number; // hasta 80% de los primeros 250 € (persona física)
  deduccionIrpfCap: number; // tope legal de la deducción en IRPF
  deduccionSociedades: number; // 40%-50% en Impuesto de Sociedades
  costeRealIrpf: number; // aportación - deducción IRPF
  costeRealSociedades: number; // aportación - deducción Sociedades
  sroiGenerado: number; // aportación * 4.85
}

export interface TraditionalManagerComparison {
  presupuesto: number;
  managerPct: number; // comisión tradicional (0.20 a 0.50)
  comisionManager: number;
  artistaNetManager: number;
  artistaNetSovereign: number;
  ventajaSoberanaEur: number;
  ventajaSoberanaPct: number;
  veredicto: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  source: string;
}

export interface SplitJustificationReport {
  presupuesto: number;
  split: SplitBreakdown;
  fiscal: FiscalBenefit;
  comparativa: TraditionalManagerComparison;
  argumentosJuridicos: string[];
  impactoSocial: ImpactMetric[];
  sello: string;
  emitidoEn: string;
}

export const SOVEREIGN_SPLIT_RATIOS = {
  artista: 0.8,
  earOs: 0.1,
  vimume: 0.1,
} as const;

export const SROI_MULTIPLIER = 4.85;

export const LEY_49_2002 = {
  irpfDeductionRate: 0.8,
  irpfCapEur: 250,
  sociedadesDeductionRate: 0.45, // 40%-50%, tomamos 45% como punto medio operativo
} as const;

export const CLINICAL_IMPACT = {
  reduccionPsicofarmacosPct: 74,
  reduccionAgitacionPct: 38.2,
  protocolo: 'Estimulación Gamma 40 Hz (Protocolo VIMUME)',
} as const;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Calcula el desglose soberano exacto y verifica el invariante 80/10/10. */
export function calculateSplitBreakdown(budget: number): SplitBreakdown {
  const total = round2(Math.max(0, budget));
  const artista = round2(total * SOVEREIGN_SPLIT_RATIOS.artista);
  const earOs = round2(total * SOVEREIGN_SPLIT_RATIOS.earOs);
  const vimume = round2(total * SOVEREIGN_SPLIT_RATIOS.vimume);
  const invariantOk = round2(artista + earOs + vimume) === total;

  return { artista, earOs, vimume, total, invariantOk };
}

/** Calcula el retorno fiscal real del 10% dedicado a VIMUME (Ley 49/2002). */
export function calculateFiscalBenefit(aportacionVimume: number): FiscalBenefit {
  const aportacion = round2(Math.max(0, aportacionVimume));

  const baseIrpf = Math.min(aportacion, LEY_49_2002.irpfCapEur);
  const deduccionIrpf = round2(baseIrpf * LEY_49_2002.irpfDeductionRate);
  const deduccionSociedades = round2(
    aportacion * LEY_49_2002.sociedadesDeductionRate,
  );

  return {
    aportacionVimume: aportacion,
    deduccionIrpf,
    deduccionIrpfCap: LEY_49_2002.irpfCapEur,
    deduccionSociedades,
    costeRealIrpf: round2(aportacion - deduccionIrpf),
    costeRealSociedades: round2(aportacion - deduccionSociedades),
    sroiGenerado: round2(aportacion * SROI_MULTIPLIER),
  };
}

/**
 * Compara el Split Soberano frente a la comisión parasitaria de un mánager
 * tradicional (20%-50%). Demuestra que el artista retiene más al descontarse
 * únicamente un 10% social deducible, en lugar de un canon de intermediación.
 */
export function compareWithTraditionalManager(
  budget: number,
  managerPct = 0.3,
): TraditionalManagerComparison {
  const presupuesto = round2(Math.max(0, budget));
  const pctClamp = Math.max(0.2, Math.min(0.5, managerPct));
  const comisionManager = round2(presupuesto * pctClamp);
  const artistaNetManager = round2(presupuesto - comisionManager);
  const artistaNetSovereign = round2(
    presupuesto * SOVEREIGN_SPLIT_RATIOS.artista,
  );
  const ventajaSoberanaEur = round2(
    artistaNetSovereign - artistaNetManager,
  );
  const ventajaSoberanaPct = round2(
    (ventajaSoberanaEur / Math.max(presupuesto, 1)) * 100,
  );

  return {
    presupuesto,
    managerPct: pctClamp,
    comisionManager,
    artistaNetManager,
    artistaNetSovereign,
    ventajaSoberanaEur,
    ventajaSoberanaPct,
    veredicto:
      ventajaSoberanaEur >= 0
        ? 'El Split Soberano entrega más al artista y convierte el coste en dividendo social deducible.'
        : 'Revisar configuración: la comisión referencial supera la retención soberana.',
  };
}

export const SPLIT_LEGAL_ARGUMENTS: string[] = [
  'Ley 49/2002 de Mecenazgo: hasta el 80% deducible en IRPF (primeros 250 €) y 40-50% en Impuesto de Sociedades mediante Certificado Modelo 182 AEAT.',
  'El 10% VIMUME no es canon: es una aportación con retorno fiscal, certificado de impacto RSC/ESG y SROI contrastado de 4,85x.',
  'El 10% EAR OS cubre infraestructura real: pasarela Stripe Price-Lock SHA-256, telemetría, captación pSEO y soporte continuo. Cero cuotas fijas.',
  'El 80% del artista es retribución digna inmediata, sin intermediarios opacos ni exclusividades parasitarias.',
  'Directivas UE 2019/790 y 2022/2065: transparencia contractual y remuneración adecuada y proporcionada de autores y artistas.',
];

export const SPLIT_IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Desescalada de psicofármacos',
    value: `${CLINICAL_IMPACT.reduccionPsicofarmacosPct}%`,
    source: 'Protocolo Gamma 40 Hz en residencias',
  },
  {
    label: 'Reducción de agitación (CMAI)',
    value: `${CLINICAL_IMPACT.reduccionAgitacionPct}%`,
    source: 'Intervención neuroacústica no farmacológica',
  },
  {
    label: 'Retorno social de cada euro',
    value: `${SROI_MULTIPLIER}x`,
    source: 'Fondo Split Soberano / VIMUME',
  },
];

/** Genera el informe completo de justificación para un presupuesto dado. */
export function generateSplitJustification(
  budget: number,
  managerPct = 0.3,
): SplitJustificationReport {
  const presupuesto = round2(Math.max(0, budget));
  const split = calculateSplitBreakdown(presupuesto);
  const fiscal = calculateFiscalBenefit(split.vimume);

  return {
    presupuesto,
    split,
    fiscal,
    comparativa: compareWithTraditionalManager(presupuesto, managerPct),
    argumentosJuridicos: SPLIT_LEGAL_ARGUMENTS,
    impactoSocial: SPLIT_IMPACT_METRICS,
    sello: 'Certificado por EAR OS · Governance Engine · Split Soberano 80/10/10',
    emitidoEn: new Date().toISOString(),
  };
}