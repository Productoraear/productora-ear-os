/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR POLIMÓRFICO DE RESOLUCIÓN DE ENTIDADES & FILTRO HALCÓN · S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Desacopla tajantemente las invariantes globales del sistema (Zona Cero SSOT)
 * de los atributos particulares de cada proveedor, recinto o artista.
 * Aplica el principio de Ley del Paciente Cero (AGENTS.md § 3) y el Filtro
 * Halcón de erradicación de adjetivos vacíos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  LOGISTICA_EUR_PER_KM,
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
import type { CeoOperationalDimensionId } from '@/lib/compiler/ceo-operational-matrix';

/**
 * 1. INVARIANTES GLOBALES DEL SISTEMA (Inviolables desde ear-os-ssot.ts)
 */
export interface GlobalSystemInvariants {
  readonly splitSoberanoFormatted: string;
  readonly fianzaPriceLockEur: number;
  readonly techoB2gLcspEur: number;
  readonly limiteB2gLegalEur: number;
  readonly costeAlergenosEur: number;
  readonly limiteAcusticoLegalDb: number;
  readonly sha256ConstitutionalHash: string;
}

export const GLOBAL_SYSTEM_INVARIANTS: GlobalSystemInvariants = Object.freeze({
  splitSoberanoFormatted: `Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista / ${Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR OS / ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME`,
  fianzaPriceLockEur: DEPOSITO_STRIPE_EUR,
  techoB2gLcspEur: AJUSTE_PREVENTIVO_B2G_EUR,
  limiteB2gLegalEur: LIMITE_B2G_LCSP_EUR,
  costeAlergenosEur: 0.0,
  limiteAcusticoLegalDb: LIMITE_SPL_DB,
  sha256ConstitutionalHash: 'cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b',
});

/**
 * Tipo y atributos de Entidad Resuelta
 */
export type EntityKind =
  | 'FINCA_OTZARRETA'
  | 'ARTISTA_EDWIN_AGUDELO'
  | 'PROVEEDOR_HOMOLOGADO'
  | 'B2G_ADMINISTRACION'
  | 'SISTEMA_CORPORATIVO';

export interface ResolvedEntityContext {
  readonly entityId: string;
  readonly displayName: string;
  readonly kind: EntityKind;
  readonly isOtzarreta: boolean;
  readonly isEdwinAgudelo: boolean;
  readonly specificInvariants: readonly string[];
  readonly menuDetails?: readonly { readonly name: string; readonly priceEur: number | null }[];
  readonly pricingFloorEur?: number;
  readonly pricingStandardEur?: number;
  readonly kmIncluded?: number;
  readonly kmSurchargeRateEur?: number;
  readonly locationBase?: string;
  readonly acousticLimitDb?: number;
  readonly parkingSpaces?: number;
  readonly legalProvenance: string;
}

/**
 * Catálogo canónico de entidades conocidas para resolución
 */
export const KNOWN_ENTITIES: readonly { readonly id: string; readonly name: string; readonly kind: EntityKind }[] = Object.freeze([
  { id: 'otzarreta', name: 'Restaurante Otzarreta (Eduardo Martínez)', kind: 'FINCA_OTZARRETA' },
  { id: 'edwin-agudelo', name: 'Edwin Agudelo (Solista de Gala e78903)', kind: 'ARTISTA_EDWIN_AGUDELO' },
  { id: 'catalogo-luces', name: 'Catálogo Oficial Iluminación 2026', kind: 'PROVEEDOR_HOMOLOGADO' },
  { id: 'ayuntamiento-b2g', name: 'Administración Pública / Festejos B2G', kind: 'B2G_ADMINISTRACION' },
  { id: 'productora-ear-global', name: 'Infraestructura Federada EAR OS', kind: 'SISTEMA_CORPORATIVO' },
]);

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

/**
 * 2. RESOLUCIÓN DINÁMICA DE ENTIDAD (Entity Resolver Polimórfico)
 * Garantiza que NUNCA se hereden menús de Otzarreta a otros proveedores.
 */
export function resolveEntityContext(
  entityId?: string,
  role?: CeoOperationalDimensionId
): ResolvedEntityContext {
  const normalizedId = (entityId || '').trim().toLowerCase();

  // Caso A: Paciente Cero Otzarreta (Finca / Hostelería)
  if (
    normalizedId === 'otzarreta' ||
    normalizedId === 'ezkertza-berria' ||
    normalizedId === 'eduardo-martinez' ||
    (!entityId && role === 'HOSTELERIA_FINCAS')
  ) {
    const menus = OTZARRETA_WEDDING_MENUS.map((m) => ({
      name: m.name,
      priceEur: m.priceEur,
    }));

    return {
      entityId: 'otzarreta',
      displayName: 'Restaurante Otzarreta / Caserío Ezkertza Berria (Derio · Bizkaia)',
      kind: 'FINCA_OTZARRETA',
      isOtzarreta: true,
      isEdwinAgudelo: false,
      specificInvariants: [
        `Menús Oficiales 2026 cerrados: de ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 145)} a ${formatOtzarretaMenuPrice(OTZARRETA_WEDDING_MENUS[3]?.priceEur ?? 185)} + IVA`,
        'Protocolo celíacos e intolerancias a 0,00 € sin suplemento de partida',
        'Párking privado vigilado: 120 plazas gratuitas en Caserío Derio',
        `Blindaje acústico legal: < ${LIMITE_SPL_DB} dB SPL (Ley 37/2003)`,
        'Exclusividad comarcal blindada de 100 km de no-competencia (Regla 91)',
      ],
      menuDetails: menus,
      acousticLimitDb: LIMITE_SPL_DB,
      parkingSpaces: 120,
      locationBase: 'Derio (Bizkaia · comarca Txorierri)',
      legalProvenance: 'Dossier Oficial PDF Menús Bodas 2026 — Eduardo Martínez',
    };
  }

  // Caso B: Paciente Cero Edwin Agudelo (Solista de Gala e78903)
  if (
    normalizedId === 'edwin-agudelo' ||
    normalizedId === 'e78903' ||
    normalizedId === 'solista' ||
    normalizedId === 'solista-gala' ||
    (!entityId && role === 'ARTISTAS_ESCENARIO')
  ) {
    return {
      entityId: 'e78903',
      displayName: 'Edwin Agudelo · Solista de Gala (Paciente Cero e78903)',
      kind: 'ARTISTA_EDWIN_AGUDELO',
      isOtzarreta: false,
      isEdwinAgudelo: true,
      specificInvariants: [
        `Suelo canónico inviolable: ${formatEur(TARIFA_BASE_SOLISTA_EUR)} (con cupón de afiliado a < 100 km)`,
        `Tarifa estándar mínima de catálogo: ${formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (${SOLISTA_KM_INCLUIDOS} km incluidos)`,
        `Suplemento de kilometraje adicional: ${formatEur(LOGISTICA_EUR_PER_KM)} / km excedente desde base Méntrida`,
        'Rider técnico: Toma trifásica 32A CEE / 400V o monofásica dedicada 16A Schuko',
        'Cobertura federal garantizada en las 52 provincias españolas',
      ],
      pricingFloorEur: TARIFA_BASE_SOLISTA_EUR,
      pricingStandardEur: TARIFA_ESTANDAR_SOLISTA_EUR,
      kmIncluded: SOLISTA_KM_INCLUIDOS,
      kmSurchargeRateEur: LOGISTICA_EUR_PER_KM,
      locationBase: 'Hub Logístico Méntrida (Toledo)',
      legalProvenance: 'ear-os-ssot.ts (Cláusula Paciente Cero e78903)',
    };
  }

  // Caso C: B2G Administración Pública
  if (normalizedId === 'ayuntamiento-b2g' || (!entityId && role === 'B2G_AYUNTAMIENTOS')) {
    return {
      entityId: 'ayuntamiento-b2g',
      displayName: 'Administración Pública / Festejos Patronales (B2G)',
      kind: 'B2G_ADMINISTRACION',
      isOtzarreta: false,
      isEdwinAgudelo: false,
      specificInvariants: [
        `Techo preventivo de adjudicación directa: ${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} + IVA (Art. 118 LCSP)`,
        `Límite legal estricto de contrato menor de servicios: ${formatEur(LIMITE_B2G_LCSP_EUR)}`,
        'Facturación electrónica oficial contra códigos DIR3 a través de FACe',
        'Póliza de Responsabilidad Civil de 1.000.000 € y certificados tributarios al corriente',
        'Memoria técnica y económica administrativa en < 72h',
      ],
      legalProvenance: 'Ley 9/2017 de Contratos del Sector Público (LCSP)',
    };
  }

  // Caso D: Proveedor / Empresa General (Aislamiento Total: ¡CERO MENÚS OTZARRETA!)
  return {
    entityId: normalizedId || 'proveedor-general',
    displayName: normalizedId ? `Proveedor Homologado [${normalizedId.toUpperCase()}]` : 'Red Soberana de Proveedores EAR',
    kind: 'PROVEEDOR_HOMOLOGADO',
    isOtzarreta: false,
    isEdwinAgudelo: false,
    specificInvariants: [
      'Tarifas y condiciones económicas particulares definidas en su panel privado',
      'Despacho condicionado a categoría de suscripción (SOVEREIGN / CLAIMED)',
      'Ficha de homologación técnica de 380 campos canónicos tipados',
      'Devolución de fianza Stripe en 48h tras parte técnico de desmontaje sin incidencias',
      'Split Soberano 80/10/10 en transacciones procesadas vía Stripe Connect',
    ],
    legalProvenance: 'Registro Soberano de Proveedores EAR OS (Ficha Aislada)',
  };
}

/**
 * 3. FILTRO HALCÓN S-CLASS (Purga Automática de Adjetivos Vacíos)
 */
export const BANNED_SLOP_ADJECTIVES: readonly string[] = Object.freeze([
  'mágico',
  'mágica',
  'mágicos',
  'mágicas',
  'apasionado',
  'apasionada',
  'apasionados',
  'apasionadas',
  'único en su clase',
  'única en su clase',
  'único',
  'única',
  'líder en su clase',
  'líder en el mercado',
  'líder del sector',
  'líder indiscutible',
  'espectacular',
  'espectaculares',
  'increíble',
  'increíbles',
  'maravilloso',
  'maravillosa',
  'maravillosos',
  'maravillosas',
  'exclusivísimo',
  'exclusivísima',
  'fascinante',
  'fascinantes',
  'inolvidable',
  'inolvidables',
]);

export interface FalconFilterResult {
  readonly filteredText: string;
  readonly purgedAdjectives: readonly string[];
  readonly isAristocratic: boolean;
  readonly scarcityApplied: boolean;
  readonly tokenEconomySummary: string;
}

export function applyFalconFilter(rawText: string): FalconFilterResult {
  if (!rawText || !rawText.trim()) {
    return {
      filteredText: '',
      purgedAdjectives: [],
      isAristocratic: true,
      scarcityApplied: true,
      tokenEconomySummary: 'Texto vacío, sin purga requerida.',
    };
  }

  let text = rawText;
  const purged: string[] = [];

  for (const adjective of BANNED_SLOP_ADJECTIVES) {
    const regex = new RegExp(`\\b${adjective}\\b`, 'gi');
    if (regex.test(text)) {
      purged.push(adjective);
      text = text.replace(regex, '');
    }
  }

  // Limpiar dobles espacios causados por la purga
  text = text.replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();

  // Asegurar principio de escasez real (1 evento por día)
  const hasScarcity = /1\s*evento\s*(por|al)\s*d[ií]a/i.test(text);
  if (!hasScarcity && text.length > 50) {
    text += ' (Principio de excelencia: solo 1 evento por día en recinto para asegurar exclusividad total).';
  }

  return {
    filteredText: text,
    purgedAdjectives: purged,
    isAristocratic: true,
    scarcityApplied: true,
    tokenEconomySummary: `Purgados ${purged.length} adjetivos vacíos de marketing. Tono aristocrático y escasez real (1 evento/día) aplicados.`,
  };
}
