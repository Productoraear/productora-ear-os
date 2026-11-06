/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T03 · BANCO DE MÚSICOS & ARTISTAS CERTIFICADOS "DIAMANTE ROJO"
 * ════════════════════════════════════════════════════════════════════════════
 * Registro estricto con trazabilidad y procedencia obligatoria (provenance).
 * Solo pueden figurar artistas que hayan completado su ciclo y cuenten con
 * evidencia verificada en disco o declaración formal del CEO (Zona Cero).
 *
 * DOCTRINA INNEGOCIABLE:
 * - Cero inclusiones fantasma: sin procedencia verificada, el registro se rechaza.
 * - Edwin Agudelo figura como el Artista Fundador #01 con sello S-Class y
 *   tarifa base inmutable de 350,00 € (SSOT).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

export type CertificationProvenance = 'DECLARADO_CEO' | 'EVIDENCIA_LEDGER' | 'HOMOLOGACION_HISTORICA';

export interface DiamanteRojoArtist {
  readonly id: string;
  readonly stageName: string;
  readonly realName: string;
  readonly slug: string;
  readonly disciplines: readonly string[];
  readonly baseFeeEur: number;
  readonly riderHomologated: boolean;
  readonly acousticStandard: string; // ej: "Ley 37/2003 (< 75 dB SPL, 12 W/pax)"
  readonly certifiedAt: string;
  readonly provenance: CertificationProvenance;
  readonly certifiedBy: string;
  readonly meritTrackCompleted: 'track66' | 'track99' | 'fundador_panteon';
  readonly badgeLabel: string;
  readonly verifiedPhoneMasked: string;
}

export const DIAMANTE_ROJO_REGISTRY: readonly DiamanteRojoArtist[] = Object.freeze([
  {
    id: 'dr-001-edwin-agudelo',
    stageName: 'Edwin Agudelo • Tenor Solista',
    realName: 'Edwin Agudelo',
    slug: 'edwin-agudelo',
    disciplines: ['Tenor Lírico', 'Show Imperial Mariachi', 'Balada & Bolero de Gala'],
    baseFeeEur: TARIFA_BASE_SOLISTA_EUR, // 350.00 € inmutable
    riderHomologated: true,
    acousticStandard: 'Bose F1 Model 812 · 12 W/pax (< 75 dB SPL)',
    certifiedAt: '2026-01-01T00:00:00.000Z',
    provenance: 'DECLARADO_CEO',
    certifiedBy: 'DIRECCIÓN_GENERAL_EAR_OS',
    meritTrackCompleted: 'fundador_panteon',
    badgeLabel: 'Artista Diamante Rojo #01 · Fundador',
    verifiedPhoneMasked: '+34 693 *** 048',
  },
]);

/**
 * Validador estricto del registro: rechaza cualquier candidato sin procedencia
 */
export function validateCertifiedArtistEntry(artist: Partial<DiamanteRojoArtist>): {
  isValid: boolean;
  error?: string;
} {
  if (!artist.slug || !artist.stageName) {
    return { isValid: false, error: 'Identidad de artista incompleta' };
  }
  if (!artist.provenance || !['DECLARADO_CEO', 'EVIDENCIA_LEDGER', 'HOMOLOGACION_HISTORICA'].includes(artist.provenance)) {
    return { isValid: false, error: 'Rechazado: procedencia (provenance) no declarada o inválida' };
  }
  if (typeof artist.baseFeeEur !== 'number' || artist.baseFeeEur < TARIFA_BASE_SOLISTA_EUR) {
    return { isValid: false, error: `Tarifa inferior al suelo canónico de ${TARIFA_BASE_SOLISTA_EUR} €` };
  }
  return { isValid: true };
}

/**
 * Lista los artistas certificados para el Matcher y el Directorio
 */
export function listCertified(): readonly DiamanteRojoArtist[] {
  return DIAMANTE_ROJO_REGISTRY;
}

export function listDiamanteRojoCertified(): readonly DiamanteRojoArtist[] {
  return DIAMANTE_ROJO_REGISTRY;
}
