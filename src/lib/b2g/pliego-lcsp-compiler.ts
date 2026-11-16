/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — COMPILADOR DE PLIEGO MENOR ART. 118 LCSP (<15.000 €)
 * ════════════════════════════════════════════════════════════════════════════
 * Memoria técnica justificativa para contratación directa en el Sector Público:
 *  - Ley 9/2017 de Contratos del Sector Público (LCSP).
 *  - Justificación de la necesidad y no fraccionamiento del objeto del contrato.
 *  - Certificación de solvencia técnica, rider acústico y compromiso VIMUME.
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';

export interface PliegoLcspInput {
  expedienteNumber?: string;
  ayuntamientoName: string;
  concejalía: string;
  dir3Code: string;
  eventName: string;
  eventDate: string;
  serviceDescription: string;
  baseAmountEur: number;
  vatRatePercent?: number;
  contractorName: string;
  contractorCif: string;
  contractorAddress: string;
}

export interface PliegoLcspDocument {
  expedienteNumber: string;
  header: {
    ayuntamiento: string;
    concejalia: string;
    dir3: string;
  };
  objectContract: {
    title: string;
    description: string;
    date: string;
  };
  economicBreakdown: {
    baseAmountEur: number;
    vatRatePercent: number;
    vatAmountEur: number;
    totalContractEur: number;
    isUnderMinorLimit: boolean; // Must be true (< 15.000 €)
  };
  legalClauses: string[];
  contractor: {
    name: string;
    cif: string;
    address: string;
  };
  sha256Seal: string;
  compiledAt: string;
}

export function compilePliegoMenorLcsp(input: PliegoLcspInput): PliegoLcspDocument {
  const vatRate = input.vatRatePercent ?? 21;
  const vatAmountEur = Math.round((input.baseAmountEur * (vatRate / 100)) * 100) / 100;
  const totalContractEur = Math.round((input.baseAmountEur + vatAmountEur) * 100) / 100;

  const expedienteNumber = input.expedienteNumber ?? `EXP-LCSP-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  const legalClauses = [
    'Conformidad con el Artículo 118 de la Ley 9/2017 (LCSP) para contratos menores de servicios cuyo valor estimado es inferior a 15.000,00 euros.',
    'Declaración expresa de que el contratista no ha suscrito más contratos menores que individual o conjuntamente superen la cifra fijada legalmente.',
    'Certificación de hallarse al corriente en el cumplimiento de las obligaciones tributarias con la AEAT y con la Seguridad Social.',
    'Compromiso de cumplimiento de la normativa acústica vigente (Ley 37/2003 del Ruido) y limitador sonométrico homologado ≤ 75 dB SPL en recintos públicos.',
    'Cláusula de Retorno Social VIMUME: Adhesión al programa de impacto sociocultural y accesibilidad universal.'
  ];

  const hashContent = `${expedienteNumber}:${input.ayuntamientoName}:${input.baseAmountEur}:${input.contractorCif}:${input.eventDate}`;
  const sha256Seal = crypto.createHash('sha256').update(hashContent).digest('hex');

  return {
    expedienteNumber,
    header: {
      ayuntamiento: input.ayuntamientoName,
      concejalia: input.concejalía,
      dir3: input.dir3Code
    },
    objectContract: {
      title: input.eventName,
      description: input.serviceDescription,
      date: input.eventDate
    },
    economicBreakdown: {
      baseAmountEur: input.baseAmountEur,
      vatRatePercent: vatRate,
      vatAmountEur,
      totalContractEur,
      isUnderMinorLimit: input.baseAmountEur < 15000
    },
    legalClauses,
    contractor: {
      name: input.contractorName,
      cif: input.contractorCif,
      address: input.contractorAddress
    },
    sha256Seal,
    compiledAt: new Date().toISOString()
  };
}
