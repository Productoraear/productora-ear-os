/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SIMULADOR UNIVERSAL DE PROVEEDORES & MATCHING ELÁSTICO (±5%..±20%)
 * ════════════════════════════════════════════════════════════════════════════
 * Motor único, puro y determinista (importable desde Server y Client Components)
 * que adapta el cálculo financiero, logístico, acústico y de encaje presupuestario
 * a los datos reales de cualquier ficha de proveedor del ecosistema:
 *   · Fincas / Restaurantes / Catering → por comensales (pax) y cubierto/menú,
 *     conectado al 50% del Motor Magia Negra (`espacio_banquete`).
 *   · Música / Artistas / DJ / Sonido → por formato/pases, logística S-Class
 *     (1,50 €/km > 50 km, hotel 120 € > 200 km o cierre >= 03:00) y rider
 *     acústico 12 W/pax (< 75 dB SPL Ley 37/2003), conectado al 15% (`musica_produccion`).
 *   · Fotografía / Vídeo / Dron → packs y horas de cobertura (`foto_video` 15%).
 *   · Moda / Estilismo / Transporte (`estilismo` 10%).
 *   · Decoración / Flores / Wedding Planner (`decoracion_flores` 10%).
 *
 * Incluye:
 *   · Slider de Tolerancia Elástica (±5%, ±10%, ±15%, ±20%).
 *   · Bloqueo de fecha con depósito deducible de 100 € (`DEPOSITO_STRIPE_EUR`).
 *   · Desglose transparente del Split Soberano 80/10/10 (`SPLIT_SOBERANO`).
 *   · Ficha operativa lista para Conserjería WhatsApp (+34 693 693 048) con
 *     ventana máxima de validación de pago de 2 horas.
 *
 * Cero `any`, cero floats en la ruta crítica (cálculo en céntimos enteros).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import {
  centsToEur,
  createAllocation,
  eurToCents,
  type BudgetCategoryId,
} from '@/lib/budget/budget-allocator-engine';

export type ElasticTolerancePct = 5 | 10 | 15 | 20;

export const ELASTIC_TOLERANCE_STEPS: readonly ElasticTolerancePct[] = Object.freeze([5, 10, 15, 20]);

export type ProviderSimulatorArchetype =
  | 'banquete_finca'
  | 'musica_produccion'
  | 'foto_video'
  | 'estilismo_transporte'
  | 'decoracion_planning';

export type ElasticMatchVerdict =
  | 'ENCAJE_EXACTO'
  | 'ENCAJE_ELASTICO'
  | 'FUERA_DE_RANGO';

export interface ProviderMenuOption {
  readonly id: string;
  readonly name: string;
  readonly pricePerPaxEur: number;
  readonly description?: string;
}

export interface UniversalProviderMetadata {
  readonly id?: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string;
  readonly headquartersAddress?: string | null;
  readonly basePriceEur?: number | null;
  readonly freeKm?: number | null;
  readonly kmRateEur?: number | null;
  readonly hotelSupplementEur?: number | null;
  readonly minPax?: number | null;
  readonly maxPax?: number | null;
  readonly menus?: readonly ProviderMenuOption[];
}

export interface UniversalSimulationParams {
  readonly provider: UniversalProviderMetadata;
  readonly guestsPax: number;
  readonly coupleTotalBudgetEur: number;
  readonly tolerancePct: ElasticTolerancePct;
  readonly distanceKm?: number;
  readonly durationHours?: number;
  readonly endHour24?: number;
  readonly selectedMenuIndex?: number;
  readonly eventDate?: string;
}

export interface SovereignSplitBreakdown {
  readonly provider80Cents: number;
  readonly earOs10Cents: number;
  readonly vimume10Cents: number;
  readonly provider80Eur: number;
  readonly earOs10Eur: number;
  readonly vimume10Eur: number;
}

export interface AcousticAndLogisticsReport {
  readonly appliesLogistics: boolean;
  readonly originLabel: string;
  readonly freeKmIncluded: number;
  readonly kmRateEur: number;
  readonly distanceKm: number;
  readonly billableKm: number;
  readonly travelCostEur: number;
  readonly hotelRequired: boolean;
  readonly hotelSupplementEur: number;
  readonly wattsRequired: number;
  readonly maxSplDb: number;
}

export interface BudgetElasticFitReport {
  readonly budgetCategoryId: BudgetCategoryId;
  readonly budgetCategoryLabel: string;
  readonly canonicalShareWeightPct: number;
  readonly canonicalAllocatedEur: number;
  readonly elasticCeilingEur: number;
  readonly tolerancePct: ElasticTolerancePct;
  readonly utilizationPctOfCategory: number;
  readonly capacityFits: boolean;
  readonly verdict: ElasticMatchVerdict;
  readonly verdictLabel: string;
}

export interface UniversalSimulationResult {
  readonly archetype: ProviderSimulatorArchetype;
  readonly archetypeLabel: string;
  readonly unitLabel: string;
  readonly unitBasePriceEur: number;
  readonly priceProvenance: 'DATO_VERIFICADO_FICHA' | 'REFERENCIA_SECTOR_SSOT';
  readonly subtotalServiceEur: number;
  readonly totalEstimatedCents: number;
  readonly totalEstimatedEur: number;
  readonly depositLockEur: number;
  readonly remainingAfterDepositEur: number;
  readonly split: SovereignSplitBreakdown;
  readonly acousticLogistics: AcousticAndLogisticsReport;
  readonly elasticFit: BudgetElasticFitReport;
  readonly signatureHash: string;
  readonly whatsappBriefText: string;
  readonly whatsappConciergeUrl: string;
}

/** Determina el arquetipo de simulación a partir de la categoría del proveedor. */
export function resolveProviderArchetype(categoryRaw: string): {
  readonly archetype: ProviderSimulatorArchetype;
  readonly archetypeLabel: string;
  readonly budgetCategoryId: BudgetCategoryId;
  readonly budgetCategoryLabel: string;
  readonly weightPct: number;
} {
  const norm = (categoryRaw || '').toLowerCase().trim();

  if (
    norm.includes('finca') ||
    norm.includes('catering') ||
    norm.includes('restaurante') ||
    norm.includes('masia') ||
    norm.includes('masía') ||
    norm.includes('caserio') ||
    norm.includes('caserío') ||
    norm.includes('hacienda') ||
    norm.includes('castillo') ||
    norm.includes('hotel') ||
    norm.includes('banquete') ||
    norm.includes('bodega') ||
    norm.includes('espacio')
  ) {
    return {
      archetype: 'banquete_finca',
      archetypeLabel: 'Banquete, Finca & Gastronomía',
      budgetCategoryId: 'espacio_banquete',
      budgetCategoryLabel: 'Espacio / Banquete (50% Motor Magia Negra)',
      weightPct: 50,
    };
  }

  if (
    norm.includes('music') ||
    norm.includes('músic') ||
    norm.includes('mariachi') ||
    norm.includes('artista') ||
    norm.includes('dj') ||
    norm.includes('sonido') ||
    norm.includes('audiovisual') ||
    norm.includes('orquesta') ||
    norm.includes('banda') ||
    norm.includes('animacion') ||
    norm.includes('animación')
  ) {
    return {
      archetype: 'musica_produccion',
      archetypeLabel: 'Música en Vivo, DJ & Producción Acústica',
      budgetCategoryId: 'musica_produccion',
      budgetCategoryLabel: 'Música y Producción (15% Motor Magia Negra)',
      weightPct: 15,
    };
  }

  if (
    norm.includes('foto') ||
    norm.includes('video') ||
    norm.includes('vídeo') ||
    norm.includes('dron') ||
    norm.includes('fotomaton') ||
    norm.includes('fotomatón')
  ) {
    return {
      archetype: 'foto_video',
      archetypeLabel: 'Fotografía, Cine Nupcial & Dron',
      budgetCategoryId: 'foto_video',
      budgetCategoryLabel: 'Foto y Vídeo (15% Motor Magia Negra)',
      weightPct: 15,
    };
  }

  if (
    norm.includes('moda') ||
    norm.includes('vestido') ||
    norm.includes('novia') ||
    norm.includes('novio') ||
    norm.includes('belleza') ||
    norm.includes('maquillaje') ||
    norm.includes('peluquer') ||
    norm.includes('transporte') ||
    norm.includes('coche') ||
    norm.includes('autobus') ||
    norm.includes('autobús') ||
    norm.includes('joyer')
  ) {
    return {
      archetype: 'estilismo_transporte',
      archetypeLabel: 'Estilismo, Moda & Logística de Invitados',
      budgetCategoryId: 'estilismo',
      budgetCategoryLabel: 'Estilismo y Transporte (10% Motor Magia Negra)',
      weightPct: 10,
    };
  }

  return {
    archetype: 'decoracion_planning',
    archetypeLabel: 'Decoración Floral, Wedding Planner & Servicios',
    budgetCategoryId: 'decoracion_flores',
    budgetCategoryLabel: 'Decoración y Coordinación (10% Motor Magia Negra)',
    weightPct: 10,
  };
}

/** Hash FNV-1a 64-bit determinista (puro JS, apto para cliente y servidor). */
function computeDeterministicSignature(payload: string): string {
  let h1 = 0xdeadbeef ^ payload.length;
  let h2 = 0x41c6ce57 ^ payload.length;
  for (let i = 0; i < payload.length; i += 1) {
    const ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `EAR-SIM-${hex1}${hex2}`.toUpperCase();
}

/** Calcula el Split Soberano 80/10/10 exacto al céntimo sin pérdida de redondeo. */
export function computeSovereignSplitCents(totalCents: number): SovereignSplitBreakdown {
  const safeCents = Math.max(0, Math.round(totalCents));
  const provider80Cents = Math.round(safeCents * SPLIT_SOBERANO.artista);
  const earOs10Cents = Math.round(safeCents * SPLIT_SOBERANO.earOs);
  const vimume10Cents = safeCents - provider80Cents - earOs10Cents;

  return {
    provider80Cents,
    earOs10Cents,
    vimume10Cents,
    provider80Eur: centsToEur(provider80Cents),
    earOs10Eur: centsToEur(earOs10Cents),
    vimume10Eur: centsToEur(vimume10Cents),
  };
}

/** Ejecuta la simulación universal adaptada a los metadatos de la ficha activa. */
export function simulateUniversalProviderQuote(
  params: UniversalSimulationParams,
): UniversalSimulationResult {
  const { provider } = params;
  const guestsPax = Math.max(10, Math.min(1200, Math.round(params.guestsPax || 120)));
  const coupleTotalBudgetEur = Math.max(1500, Math.round(params.coupleTotalBudgetEur || 22000));
  const tolerancePct: ElasticTolerancePct = ELASTIC_TOLERANCE_STEPS.includes(params.tolerancePct)
    ? params.tolerancePct
    : 10;
  const distanceKm = Math.max(0, Math.round(params.distanceKm ?? 25));
  const durationHours = Math.max(1, Math.min(12, Math.round(params.durationHours ?? 3)));
  const endHour24 = params.endHour24 ?? 2;

  const meta = resolveProviderArchetype(provider.category);
  const hasVerifiedBasePrice =
    typeof provider.basePriceEur === 'number' &&
    Number.isFinite(provider.basePriceEur) &&
    provider.basePriceEur > 0;

  let unitBasePriceEur = 0;
  let unitLabel = '';
  let subtotalServiceEur = 0;
  let priceProvenance: 'DATO_VERIFICADO_FICHA' | 'REFERENCIA_SECTOR_SSOT' = hasVerifiedBasePrice
    ? 'DATO_VERIFICADO_FICHA'
    : 'REFERENCIA_SECTOR_SSOT';

  const menus = provider.menus ?? [];
  const chosenMenu =
    menus.length > 0
      ? menus[Math.min(Math.max(0, params.selectedMenuIndex ?? 0), menus.length - 1)]
      : undefined;

  if (meta.archetype === 'banquete_finca') {
    if (chosenMenu && chosenMenu.pricePerPaxEur > 0) {
      unitBasePriceEur = chosenMenu.pricePerPaxEur;
      unitLabel = `Menú ${chosenMenu.name} (€/comensal)`;
      priceProvenance = 'DATO_VERIFICADO_FICHA';
      subtotalServiceEur = Math.round(unitBasePriceEur * guestsPax);
    } else if (hasVerifiedBasePrice && provider.basePriceEur !== null && provider.basePriceEur !== undefined) {
      // Si el basePrice es <= 300 suele ser precio por cubierto; si es > 300 es alquiler de espacio o paquete base
      if (provider.basePriceEur <= 350) {
        unitBasePriceEur = provider.basePriceEur;
        unitLabel = 'Cubierto base ficha (€/comensal)';
        subtotalServiceEur = Math.round(unitBasePriceEur * guestsPax);
      } else {
        unitBasePriceEur = provider.basePriceEur;
        unitLabel = 'Canon de espacio + banquete estimado';
        subtotalServiceEur = Math.round(unitBasePriceEur);
      }
    } else {
      // Referencia honesta declarada cuando la ficha aún no tiene menú verificado
      unitBasePriceEur = 95;
      unitLabel = 'Cubierto de referencia sectorial (€/comensal)';
      subtotalServiceEur = Math.round(unitBasePriceEur * guestsPax);
    }
  } else if (meta.archetype === 'musica_produccion') {
    unitBasePriceEur =
      hasVerifiedBasePrice && provider.basePriceEur
        ? provider.basePriceEur
        : TARIFA_BASE_SOLISTA_EUR;
    unitLabel = hasVerifiedBasePrice
      ? 'Caché base verificado en ficha'
      : 'Tarifa Base Solista SSOT (350 €)';
    const extraHours = Math.max(0, durationHours - 2);
    subtotalServiceEur = Math.round(unitBasePriceEur + extraHours * 90);
  } else if (meta.archetype === 'foto_video') {
    unitBasePriceEur =
      hasVerifiedBasePrice && provider.basePriceEur ? provider.basePriceEur : 1450;
    unitLabel = hasVerifiedBasePrice
      ? 'Pack documental verificado en ficha'
      : 'Cobertura documental completa (referencia)';
    const extraHours = Math.max(0, durationHours - 6);
    subtotalServiceEur = Math.round(unitBasePriceEur + extraHours * 120);
  } else {
    unitBasePriceEur =
      hasVerifiedBasePrice && provider.basePriceEur ? provider.basePriceEur : 850;
    unitLabel = hasVerifiedBasePrice
      ? 'Tarifa base verificada en ficha'
      : 'Partida base estimada del gremio';
    subtotalServiceEur = Math.round(unitBasePriceEur);
  }

  // Regla de Origen S-Class (AGENTS.md §4):
  // Hub Méntrida (50 km exentos + 1,50 €/km) aplica EXCLUSIVAMENTE a Edwin Agudelo / Productora EAR.
  // Para cualquier otro proveedor, la logística se calcula desde la sede registrada en su ficha.
  const isEdwinOrProductoraEar = /edwin|agudelo|productora\s*ear/i.test(
    `${provider.id || ''} ${provider.slug || ''} ${provider.name || ''}`,
  );
  const originLabel = isEdwinOrProductoraEar
    ? 'Hub Méntrida (Exclusivo Edwin Agudelo)'
    : provider.headquartersAddress && provider.headquartersAddress.trim().length > 0
      ? `Sede en ${provider.headquartersAddress.trim()}`
      : `Sede Registrada en ${provider.province || 'Origen'}`;

  const freeKmIncluded = isEdwinOrProductoraEar
    ? LOGISTICA_KM_EXENTOS
    : typeof provider.freeKm === 'number' && provider.freeKm >= 0
      ? provider.freeKm
      : 30;
  const kmRateEur = isEdwinOrProductoraEar
    ? LOGISTICA_EUR_PER_KM
    : typeof provider.kmRateEur === 'number' && provider.kmRateEur >= 0
      ? provider.kmRateEur
      : 1.2;
  const customHotelSupplement =
    typeof provider.hotelSupplementEur === 'number' && provider.hotelSupplementEur >= 0
      ? provider.hotelSupplementEur
      : SUPLEMENTO_HOTEL_EUR;

  const appliesLogistics = meta.archetype === 'musica_produccion';
  const billableKm = appliesLogistics ? Math.max(0, distanceKm - freeKmIncluded) : 0;
  const travelCostEur = appliesLogistics ? Math.round(billableKm * kmRateEur) : 0;
  const hotelRequired =
    appliesLogistics &&
    (distanceKm > LOGISTICA_KM_HOTEL || (endHour24 >= HORA_FIN_HOTEL && endHour24 <= 7));
  const hotelSupplementEur = hotelRequired ? customHotelSupplement : 0;
  const wattsRequired = guestsPax * WATTS_PER_PAX;

  const totalEstimatedEur = subtotalServiceEur + travelCostEur + hotelSupplementEur;
  const totalEstimatedCents = eurToCents(totalEstimatedEur);
  const depositLockEur = DEPOSITO_STRIPE_EUR;
  const remainingAfterDepositEur = Math.max(0, totalEstimatedEur - depositLockEur);

  const split = computeSovereignSplitCents(totalEstimatedCents);

  // Encaje con Motor Magia Negra (50/15/15/10/10) + Tolerancia Elástica (±5..±20%)
  const allocation = createAllocation(coupleTotalBudgetEur);
  const canonicalCategoryCents = allocation.amountsCents[meta.budgetCategoryId];
  const canonicalAllocatedEur = centsToEur(canonicalCategoryCents);
  const elasticCeilingCents = Math.round(canonicalCategoryCents * (1 + tolerancePct / 100));
  const elasticCeilingEur = centsToEur(elasticCeilingCents);

  const utilizationPctOfCategory =
    canonicalCategoryCents > 0
      ? Math.round((totalEstimatedCents / canonicalCategoryCents) * 100)
      : 100;

  // Verificación elástica de aforo si la ficha declara maxPax / minPax
  const maxPaxAllowed =
    typeof provider.maxPax === 'number' && provider.maxPax > 0
      ? Math.round(provider.maxPax * (1 + tolerancePct / 100))
      : 9999;
  const minPaxAllowed =
    typeof provider.minPax === 'number' && provider.minPax > 0
      ? Math.round(provider.minPax * (1 - tolerancePct / 100))
      : 1;
  const capacityFits = guestsPax >= minPaxAllowed && guestsPax <= maxPaxAllowed;

  let verdict: ElasticMatchVerdict = 'ENCAJE_EXACTO';
  let verdictLabel = 'Encaje 100% dentro de la partida canónica';

  if (!capacityFits) {
    verdict = 'FUERA_DE_RANGO';
    verdictLabel = `Aforo (${guestsPax} pax) fuera del rango elástico (±${tolerancePct}%)`;
  } else if (totalEstimatedCents <= canonicalCategoryCents) {
    verdict = 'ENCAJE_EXACTO';
    verdictLabel = `Encaje Óptimo (${utilizationPctOfCategory}% de la partida ${meta.weightPct}%)`;
  } else if (totalEstimatedCents <= elasticCeilingCents) {
    verdict = 'ENCAJE_ELASTICO';
    verdictLabel = `Encaje Elástico aprobado dentro del margen +${tolerancePct}%`;
  } else {
    verdict = 'FUERA_DE_RANGO';
    verdictLabel = `Supera el techo elástico (+${tolerancePct}%) en ${Math.round(totalEstimatedEur - elasticCeilingEur)} €`;
  }

  const signatureHash = computeDeterministicSignature(
    `${provider.slug}|${guestsPax}|${totalEstimatedCents}|${depositLockEur}|${tolerancePct}`,
  );

  const dateLine = params.eventDate ? params.eventDate : 'Fecha a confirmar en calendario';

  const whatsappBriefText = [
    `📋 *SIMULACIÓN OFICIAL EAR OS · ${signatureHash}*`,
    `⏳ *Condición de Firma:* Bloqueo de agenda y contrato tras validar depósito (${depositLockEur},00 € deducibles) en ventana máxima de 2 h.`,
    '',
    `*1 · PROVEEDOR Y SEDE DE ORIGEN*`,
    `${provider.name} (${provider.category}) · ${originLabel}`,
    '',
    `*2 · FECHA E INVITADOS*`,
    `${dateLine} · ${guestsPax} invitados (${wattsRequired} W / < ${LIMITE_SPL_DB} dB SPL Ley 37/2003)`,
    '',
    `*3 · DESGLOSE ECONÓMICO (${priceProvenance})*`,
    `• ${unitLabel}: ${unitBasePriceEur} €`,
    appliesLogistics ? `• Logística desde ${originLabel} (${distanceKm} km, ${billableKm} km facturables a ${kmRateEur.toFixed(2).replace('.', ',')} €/km): ${travelCostEur} €` : '',
    hotelRequired ? `• Suplemento pernocta S-Class: ${hotelSupplementEur} €` : '',
    `• *TOTAL ESTIMADO: ${totalEstimatedEur} €*`,
    `• Depósito Price-Lock (100% deducible): ${depositLockEur} €`,
    `• Restante en el evento: ${remainingAfterDepositEur} €`,
    '',
    `*4 · ENCAJE MOTOR MAGIA NEGRA (±${tolerancePct}%)*`,
    `Partida ${meta.budgetCategoryLabel}: ${canonicalAllocatedEur} € (Techo elástico: ${elasticCeilingEur} €) → ${verdictLabel}`,
  ]
    .filter(Boolean)
    .join('\n');

  const cleanPhone = CENTRALITA_EAR_OS.replace(/\D/g, '');
  const whatsappConciergeUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappBriefText)}`;

  return {
    archetype: meta.archetype,
    archetypeLabel: meta.archetypeLabel,
    unitLabel,
    unitBasePriceEur,
    priceProvenance,
    subtotalServiceEur,
    totalEstimatedCents,
    totalEstimatedEur,
    depositLockEur,
    remainingAfterDepositEur,
    split,
    acousticLogistics: {
      appliesLogistics,
      originLabel,
      freeKmIncluded,
      kmRateEur,
      distanceKm,
      billableKm,
      travelCostEur,
      hotelRequired,
      hotelSupplementEur,
      wattsRequired,
      maxSplDb: LIMITE_SPL_DB,
    },
    elasticFit: {
      budgetCategoryId: meta.budgetCategoryId,
      budgetCategoryLabel: meta.budgetCategoryLabel,
      canonicalShareWeightPct: meta.weightPct,
      canonicalAllocatedEur,
      elasticCeilingEur,
      tolerancePct,
      utilizationPctOfCategory,
      capacityFits,
      verdict,
      verdictLabel,
    },
    signatureHash,
    whatsappBriefText,
    whatsappConciergeUrl,
  };
}

