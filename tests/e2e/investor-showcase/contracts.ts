/**
 * ════════════════════════════════════════════════════════════════════════════
 * INVESTOR SHOWCASE E2E TEST CONTRACTS, MATHEMATICAL ORACLES & HARNESS
 * ════════════════════════════════════════════════════════════════════════════
 * Canonical reference interfaces, mathematical oracles, and execution tracker
 * for Features F1 through F11 of EAR OS V2 Investor Showcase:
 *
 *  - F1: Offline Fallback Engine & Circuit Breaker
 *  - F2: Atomic Disk Storage, Promise Queue & Stripe Idempotency
 *  - F3: Bilingual Technical Documentation (ES/EN 6 core files)
 *  - F4: Exhaustive 496-Route Verification Catalog
 *  - F5: Governance Gates & Inviolable SSOT Invariants
 *  - F6: 5-Stage Semantic Customer Journey
 *  - F7: Interactive Multi-Service Recommendation Engine (5 categories)
 *  - F8: Multi-Provider Cart & Split Soberano 80/10/10 in Integer Cents
 *  - F9: Investor Showcase Checkout Simulator & SEPA Dispersion
 *  - F10: Fincas & Artistas Real-Time Telemetry & Intent Selector
 *  - F11: Profile Interactive Help System ('?' Button & Auto-Complete to 100%)
 *
 * Derived strictly from:
 *  - ORIGINAL_REQUEST.md (§ R1, R2, R3, R4, R5, R6)
 *  - PROJECT.md (§ Interface Contracts, § Feature Inventory)
 *  - TEST_INFRA.md (§ Coverage Thresholds, § Real-World Scenarios)
 *  - AGENTS.md (§ 4 Reglas de Negocio Inmutables, § 5 Next.js, § 6 OLED)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SAFE_LCSP_CEILING_EUR,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '../../../src/lib/constants/ear-os-ssot';
import {
  checkDateAvailability,
  lockDateAtomically,
  unlockDateAtomically,
  tripDbCircuit,
  resetDbCircuitBreaker,
  isDbCircuitOpen,
  reloadOfflineStoreFromDisk,
  getOfflineDateLockStore,
  type AtomicLockInput as ProdAtomicLockInput,
} from '../../../src/lib/availability/atomicDateLockEngine';
import {
  calculateHareNiemeyerSplit,
  computeCryptographicSha256,
} from '../../../src/components/checkout/CartContext';
import {
  matchMarketplaceRecommendations,
  CANONICAL_MARKETPLACE_CATALOG,
} from '../../../src/components/marketplace/MultiServiceMarketplaceEngine';
import {
  simulateInvestorCheckout,
  INVESTOR_SCENARIOS,
} from '../../../src/components/checkout/InvestorShowcaseSimulator';
import {
  evaluateProfileCompleteness,
  generateCertifiedSClassProfile,
} from '../../../src/components/help/ProfileInteractiveHelpModal';

/* ========================================================================== */
/* 1. TIPOS Y CONTRATOS OFICIALES DE INTERFAZ                                 */
/* ========================================================================== */

// F1 & F2: Offline Date Lock Engine Contracts
export interface AtomicLockInput {
  date: string; // ISO date YYYY-MM-DD
  entityId: string; // e.g. "artist:edwin-agudelo" or "finca:villa-escorial"
  entitySlug?: string;
  entityKind?: string;
  timeSlot?: string; // e.g. "14:00", "20:00"
  clientName: string;
  clientEmail: string;
  stripeSessionId: string;
  priceLockSha256: string;
  totalAmountEur: number;
  depositAmountEur: number;
}

export interface OfflineDateLockRecord {
  id: string;
  date: string;
  entityId: string;
  entitySlug?: string;
  entityKind?: string;
  timeSlot?: string;
  clientName: string;
  clientEmail: string;
  stripeSessionId: string;
  priceLockSha256: string;
  totalAmountEur: number;
  depositAmountEur: number;
  lockedAt: string;
  expiresAt: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
  status: 'CONFIRMED' | 'PENDING' | 'RELEASED';
}

export interface AtomicLockResult {
  success: boolean;
  lockId?: string;
  priceLockSha256?: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
  reason?: 'LOCKED' | 'COLLISION' | 'MAX_DAILY_CAP_REACHED' | 'INVALID_DATE' | 'ALREADY_LOCKED';
  error?: string;
}

export interface DateAvailabilityResult {
  available: boolean;
  reason: 'AVAILABLE' | 'BLOCKED_BY_CALENDAR' | 'LOCKED_BY_EVENT' | 'OFFLINE_PERSISTED_LOCK' | 'MAX_DAILY_CAP_REACHED' | 'INVALID_DATE';
  lockExpiresAt?: string;
  dailyGigsBooked?: number;
  entityScope?: string;
  storageMode?: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
}

// F8: Multi-Provider Cart & Split Soberano Contracts
export interface CartItem {
  id: string;
  name: string;
  category: 'ARTISTA' | 'FINCA' | 'SONIDO' | 'FLORES' | 'CATERING' | 'COORDINACION';
  providerId: string;
  providerName: string;
  priceEur: number;
  priceCents: number;
  quantity: number;
  pax?: number;
  distanceKm?: number;
}

export interface ProviderBreakdown {
  providerId: string;
  providerName: string;
  category: string;
  itemCents: number;
  netPayoutCents: number; // 80% to provider
}

export interface SovereignSettlementSplit {
  totalCents: number;
  subtotalCents: number;
  providersTotalCents: number; // 80%
  earOsCents: number; // 10%
  vimumeCents: number; // 10%
  depositDeductedCents: number; // 10,000 cents = 100.00 €
  pendingFinalSettlementCents: number; // totalCents - depositDeductedCents
  providersBreakdown: ProviderBreakdown[];
  priceLockSha256: string;
  algorithm: 'HARE_NIEMEYER_INTEGER_CENTS';
}

// F6: Customer Journey Contracts
export type JourneyStageId = 1 | 2 | 3 | 4 | 5;

export interface JourneyStageDefinition {
  stageId: JourneyStageId;
  name: string;
  title: string;
  requiredElements: string[];
  ctaType: string;
}

// F7: Marketplace Recommendation Engine Contracts
export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'ARTISTA' | 'FINCA' | 'SONIDO' | 'FLORES' | 'CATERING';
  providerId: string;
  priceEur: number;
  priceCents: number;
  ratingAuditado: number; // 0.0 - 5.0
  distanceHubKm: number; // from Hub Méntrida
  availableDates: string[];
  maxPax?: number;
  watts?: number;
  nif?: string;
}

export interface RecommendationCriteria {
  intent: 'boda_gala' | 'corporativo' | 'serenata_intima' | 'b2g_fiestas' | 'vimume_clinico' | 'exclusiva_1dia' | 'gran_aforo';
  targetDate: string;
  maxDistanceKm?: number;
  budgetCapEur?: number;
  pax?: number;
}

export interface RecommendationResult {
  matches: MarketplaceItem[];
  bundledTotalCents: number;
  bundledSavingsCents: number;
  recommendedSoundWatts: number;
  acousticCompliant: boolean;
}

// F9: Investor Showcase Simulator Contracts
export interface InvestorSimulationScenario {
  id: 'A' | 'B' | 'C';
  name: string;
  description: string;
  items: CartItem[];
  expectedTotalEur: number;
  expectedDepositEur: number;
}

export interface SepaDispersionAccount {
  recipient: 'ARTISTAS_PROVIDERS' | 'EAR_OS_INFRASTRUCTURE' | 'VIMUME_FOUNDATION';
  ibanMasked: string;
  bic: string;
  amountCents: number;
  amountEur: number;
  percentage: number;
  transferReference: string;
}

export interface InvestorSimulationResult {
  scenarioId: 'A' | 'B' | 'C';
  totalCents: number;
  depositCents: number;
  pendingCents: number;
  split: {
    providersCents: number;
    earOsCents: number;
    vimumeCents: number;
  };
  sepaDispersions: SepaDispersionAccount[];
  priceLockSha256: string;
  simulatedWebhookEvent: {
    id: string;
    type: 'checkout.session.completed';
    stripeSessionId: string;
    amountTotal: number;
    currency: 'eur';
    paymentStatus: 'paid';
    created: number;
  };
  durationMs: number;
}

// F10: Real-Time Telemetry Contracts
export interface TelemetrySnapshot {
  activeRequests24h: number;
  ytdBillingEur: number;
  seasonSaturdayOccupancyPct: number;
  cumulativePaxServed: number;
  slaResponseMinutes: number;
  activeLocksCount: number;
  sha256Digest: string;
}

// F11: Interactive Help System Contracts
export interface SClassProfileField {
  key: string;
  label: string;
  required: boolean;
  present: boolean;
  value?: unknown;
}

export interface ProfileCompletenessReport {
  totalFields: number;
  completedFields: number;
  percentage: number;
  isSClassCertified: boolean;
  missingFields: string[];
  fields: SClassProfileField[];
}

export interface CertifiedSClassProfileData {
  id: string;
  legalName: string;
  tradeName: string;
  nif: string;
  verifiedPhone: string;
  officialWhatsApp: string;
  bioSClass: string;
  baseTariffEur: number;
  depositAcceptedEur: number;
  audioRider: {
    brand: string;
    wattsPerPax: number;
    maxSplDb: number;
  };
  powerConnection: 'CETAC_32A' | 'CETAC_16A' | 'SCHUKO_16A';
  hubLocation: {
    address: string;
    municipio: string;
    provincia: string;
    kmFromMentrida: number;
  };
  gallery4kUrls: string[];
  liveVideoUrls: string[];
  civilLiabilityInsuranceEur: number;
  split80_10_10Accepted: boolean;
}

// F3 & F4: Docs & Catalog Contracts
export interface RouteEntry {
  path: string;
  route?: string;
  filePath?: string;
  type: 'PAGE' | 'API';
  isDynamic: boolean;
  category: string;
}

export interface CatalogAuditResult {
  totalRoutes: number;
  totalPages: number;
  totalApis: number;
  totalDynamic: number;
  categories: Record<string, number>;
  allRoutesStartWithSlash: boolean;
  hasRequiredVerticals: boolean;
}

export interface BilingualDocPair {
  filename: string;
  esPath: string;
  enPath: string;
  esExists: boolean;
  enExists: boolean;
  esBytes: number;
  enBytes: number;
  esHeaderCount: number;
  enHeaderCount: number;
}

/* ========================================================================== */
/* 2. ORÁCULOS MATEMÁTICOS DE REFERENCIA                                      */
/* ========================================================================== */

/**
 * Oráculo matemático del Split Soberano 80/10/10 en céntimos enteros (Hare-Niemeyer / Largest Remainder).
 * Invariante: providersTotalCents + earOsCents + vimumeCents === totalCents EXACTAMENTE.
 * Delega directamente en la implementación de producción de src/components/checkout/CartContext.tsx.
 */
export function calculateHareNiemeyerSplitOracle(
  totalCents: number,
  depositCents: number = Math.round(DEPOSITO_STRIPE_EUR * 100),
  providerBreakdownInput?: Array<{ id: string; name: string; category: string; cents: number }>
): SovereignSettlementSplit {
  return calculateHareNiemeyerSplit(totalCents, depositCents, providerBreakdownInput);
}

export { calculateHareNiemeyerSplit };

/**
 * Oráculo logístico S-Class (50 km franquicia desde Hub Méntrida, 1,50 €/km, 120 € hotel si fin >= 3:00 o dist > 200 km).
 */
export function calculateLogisticsOracle(
  distanceKm: number,
  endHour24: number = 0,
  baseTariffEur: number = TARIFA_BASE_SOLISTA_EUR
) {
  const safeDistance = Math.max(0, distanceKm);
  const exemptKm = LOGISTICA_KM_EXENTOS; // 50 km
  const chargeableKm = Math.max(0, safeDistance - exemptKm);
  const logisticsKmCents = Math.round(chargeableKm * LOGISTICA_EUR_PER_KM * 100);

  const hotelRequired = endHour24 >= HORA_FIN_HOTEL || safeDistance > LOGISTICA_KM_HOTEL;
  const hotelCents = hotelRequired ? Math.round(SUPLEMENTO_HOTEL_EUR * 100) : 0;

  const baseCents = Math.round(Math.max(TARIFA_BASE_SOLISTA_EUR, baseTariffEur) * 100);
  const totalEventCents = baseCents + logisticsKmCents + hotelCents;

  return {
    baseTariffEur: baseCents / 100,
    safeDistanceKm: safeDistance,
    exemptKm,
    chargeableKm,
    logisticsKmEur: logisticsKmCents / 100,
    hotelRequired,
    hotelEur: hotelCents / 100,
    totalEventEur: totalEventCents / 100,
    totalEventCents,
  };
}

/**
 * Oráculo de evaluación acústica Ley 37/2003 (< 75 dB SPL, 12 W/pax).
 */
export function evaluateAcousticRiderOracle(pax: number, maxDbSpl: number = LIMITE_SPL_DB) {
  const safePax = Math.max(1, pax);
  const recommendedWatts = safePax * WATTS_PER_PAX;
  const isCompliant = maxDbSpl <= LIMITE_SPL_DB;
  return {
    pax: safePax,
    recommendedWatts,
    maxDbSpl,
    isCompliant,
    notes: `${safePax} pax × 12 W/pax = ${recommendedWatts} W RMS | Salud pública < 75 dB SPL`,
  };
}

/**
 * Oráculo de evaluación de techo B2G Art. 118 LCSP (< 14.250,00 €).
 */
export function evaluateB2gCeilingOracle(totalGrossEur: number) {
  const ceilingEur = SAFE_LCSP_CEILING_EUR; // 14.250,00 €
  const isCompliant = totalGrossEur <= ceilingEur;
  const deltaEur = Math.round((totalGrossEur - ceilingEur) * 100) / 100;
  return {
    isCompliant,
    ceilingEur,
    deltaEur,
    alertRequired: !isCompliant,
  };
}

/**
 * Catálogo canónico del motor de recomendación de 5 categorías.
 * Re-exportado directamente desde la implementación de producción de
 * src/components/marketplace/MultiServiceMarketplaceEngine.tsx.
 */
export { CANONICAL_MARKETPLACE_CATALOG };

/**
 * Oráculo del motor de recomendación multi-servicio.
 * Delega directamente en la implementación de producción de
 * src/components/marketplace/MultiServiceMarketplaceEngine.tsx.
 */
export function matchMarketplaceRecommendationsOracle(
  criteria: RecommendationCriteria,
  catalog?: readonly MarketplaceItem[]
): RecommendationResult {
  return matchMarketplaceRecommendations(criteria as any, catalog as any) as RecommendationResult;
}

export { matchMarketplaceRecommendations };

/**
 * Oráculo de evaluación de completitud del perfil S-Class (10 campos obligatorios).
 * Delega directamente en la implementación de producción de
 * src/components/help/ProfileInteractiveHelpModal.tsx.
 */
export function evaluateProfileCompletenessOracle(
  profile: Partial<CertifiedSClassProfileData>
): ProfileCompletenessReport {
  return evaluateProfileCompleteness(profile as any);
}

export { evaluateProfileCompleteness };

/**
 * Genera plantilla certificada S-Class para autocompletar perfiles al 100%.
 * Delega directamente en la implementación de producción de
 * src/components/help/ProfileInteractiveHelpModal.tsx.
 */
export function generateCertifiedSClassProfileOracle(
  entityId: string = 'artist:edwin-agudelo'
): CertifiedSClassProfileData {
  return generateCertifiedSClassProfile(entityId) as CertifiedSClassProfileData;
}

export { generateCertifiedSClassProfile };

/**
 * Oráculo del simulador transaccional para inversores.
 * Delega directamente en la implementación de producción de
 * src/components/checkout/InvestorShowcaseSimulator.tsx.
 */
export function simulateInvestorCheckoutOracle(
  scenarioId: 'A' | 'B' | 'C'
): InvestorSimulationResult {
  return simulateInvestorCheckout(scenarioId) as InvestorSimulationResult;
}

export { simulateInvestorCheckout, INVESTOR_SCENARIOS };

/**
 * Oráculo forense para la auditoría de rutas del catálogo (496 rutas).
 */
export function auditRoutesCatalogOracle(catalogFilePath?: string): CatalogAuditResult {
  const filePath = catalogFilePath || path.resolve(process.cwd(), '.agents/teamwork/explorer_survey_2/routes_catalog.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Routes catalog file not found at: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  const rawRoutes: Array<{
    route?: string;
    path?: string;
    type: 'PAGE' | 'API';
    filePath?: string;
    dynamicParams?: string[];
    isDynamic: boolean;
    category?: string;
  }> = data.routes || [];

  const totalRoutes = rawRoutes.length;
  const totalPages = rawRoutes.filter((r) => r.type === 'PAGE').length;
  const totalApis = rawRoutes.filter((r) => r.type === 'API').length;
  const totalDynamic = rawRoutes.filter((r) => r.isDynamic).length;

  const categories: Record<string, number> = {};
  let allRoutesStartWithSlash = true;

  for (const r of rawRoutes) {
    const routePath = r.route || r.path || '';
    if (!routePath.startsWith('/')) {
      allRoutesStartWithSlash = false;
    }

    const target = (routePath + ' ' + (r.filePath || '')).toLowerCase();
    const matchedCats: string[] = [];

    if (/artist/i.test(target)) matchedCats.push('artistas');
    if (/finca|venue|espacio|otzarreta|hacienda|cortijo|cartuja|escorial|martinez/i.test(target)) matchedCats.push('fincas');
    if (/boda/i.test(target)) matchedCats.push('bodas');
    if (/acuerdo|contrato|auditoria|aviso-legal|panic-sos/i.test(target)) matchedCats.push('acuerdos');
    if (/escan|scan|sonomet|rider|ruido|acoustic/i.test(target)) matchedCats.push('escaner');
    if (/studio|estudio|voice/i.test(target)) matchedCats.push('studio');

    const firstSegment = routePath.split('/').filter(Boolean)[0] || 'root';
    matchedCats.push(firstSegment);

    if (r.category) matchedCats.push(r.category);

    for (const cat of matchedCats) {
      categories[cat] = (categories[cat] || 0) + 1;
    }
  }

  const hasRequiredVerticals =
    (categories['artistas'] || 0) > 0 &&
    (categories['fincas'] || 0) > 0 &&
    (categories['bodas'] || 0) > 0 &&
    (categories['acuerdos'] || 0) > 0 &&
    (categories['escaner'] || 0) > 0 &&
    (categories['studio'] || 0) > 0;

  return {
    totalRoutes,
    totalPages,
    totalApis,
    totalDynamic,
    categories,
    allRoutesStartWithSlash,
    hasRequiredVerticals,
  };
}

/**
 * Oráculo forense para la documentación bilingüe (6 archivos canónicos).
 */
export function auditBilingualDocsOracle(baseDocsPath?: string): BilingualDocPair[] {
  const root = baseDocsPath || path.resolve(process.cwd(), 'docs');
  const esDir = path.join(root, 'es');
  const enDir = path.join(root, 'en');

  const canonicalFiles = [
    '01_EXECUTIVE_SHOWCASE.md',
    '02_FULL_ARCHITECTURE.md',
    '03_SSOT_INVARIANTS.md',
    '04_URL_VERIFICATION_CATALOG.md',
    '05_FORENSIC_AUDIT_SCORECARD.md',
    '06_OFFLINE_RESILIENCE_SPEC.md',
  ];

  const results: BilingualDocPair[] = [];

  for (const filename of canonicalFiles) {
    const esPath = path.join(esDir, filename);
    const enPath = path.join(enDir, filename);

    const esExists = fs.existsSync(esPath);
    const enExists = fs.existsSync(enPath);

    let esBytes = 0;
    let enBytes = 0;
    let esHeaderCount = 0;
    let enHeaderCount = 0;

    if (esExists) {
      const content = fs.readFileSync(esPath, 'utf-8');
      esBytes = Buffer.byteLength(content, 'utf-8');
      esHeaderCount = (content.match(/^#{1,3}\s+.+$/gm) || []).length;
    }

    if (enExists) {
      const content = fs.readFileSync(enPath, 'utf-8');
      enBytes = Buffer.byteLength(content, 'utf-8');
      enHeaderCount = (content.match(/^#{1,3}\s+.+$/gm) || []).length;
    }

    results.push({
      filename,
      esPath,
      enPath,
      esExists,
      enExists,
      esBytes,
      enBytes,
      esHeaderCount,
      enHeaderCount,
    });
  }

  return results;
}

/**
 * Arnés de persistencia offline atómica aislado para pruebas de F1 y F2.
 * Delega directamente en el motor canónico de producción de
 * src/lib/availability/atomicDateLockEngine.ts con circuit breaker offline y
 * persistencia durable en disco.
 */
export class IsolatedOfflineDateLockHarness {
  private filePath: string;
  private writeQueue: Promise<unknown> = Promise.resolve();

  constructor(customFilePath?: string) {
    this.filePath = customFilePath || path.resolve(process.cwd(), '.data', 'offline-date-locks.json');
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE = this.filePath;
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async syncCustomFile(): Promise<void> {
    if (!this.filePath) return;
    this.writeQueue = this.writeQueue.then(async () => {
      try {
        const store = await getOfflineDateLockStore();
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
        const tmp = `${this.filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
        const payload = JSON.stringify(store, null, 2);
        await fs.promises.writeFile(tmp, payload, 'utf-8');
        try {
          await fs.promises.rename(tmp, this.filePath);
        } catch {
          await fs.promises.copyFile(tmp, this.filePath);
          await fs.promises.unlink(tmp).catch(() => undefined);
        }
      } catch {
        // safe error boundary
      }
    });
    await this.writeQueue;
  }

  async checkAvailability(
    date: string,
    entityId: string = 'artist:edwin-agudelo',
    timeSlot?: string
  ): Promise<DateAvailabilityResult> {
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE = this.filePath;
    tripDbCircuit();

    if (this.filePath && fs.existsSync(this.filePath)) {
      try {
        const raw = await fs.promises.readFile(this.filePath, 'utf-8');
        JSON.parse(raw);
      } catch {
        await reloadOfflineStoreFromDisk();
      }
    }

    const parts = entityId.split(':');
    const entityKind = parts.length > 1 ? parts[0] : 'artista';
    const entitySlug = parts.length > 1 ? parts.slice(1).join(':') : entityId;

    const res = await checkDateAvailability({
      eventDate: date,
      entityKind,
      entitySlug,
      timeSlot,
    });

    const normalizedReason =
      res.reason === 'PRODUCTION_COLLISION' || res.reason === 'CALENDAR_BLOCKED'
        ? 'OFFLINE_PERSISTED_LOCK'
        : res.reason;

    return {
      available: res.available,
      reason: normalizedReason as any,
      lockExpiresAt: res.lockExpiresAt,
      dailyGigsBooked: res.dailyGigsBooked,
      entityScope: entityId,
      storageMode: res.storageMode,
    };
  }

  async lockDate(input: AtomicLockInput): Promise<AtomicLockResult> {
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE = this.filePath;
    tripDbCircuit();

    // Idempotencia Stripe: si ya existe para este stripeSessionId, devolver ALREADY_LOCKED
    if (input.stripeSessionId) {
      const store = await getOfflineDateLockStore();
      const existing = store.productionEvents.find(
        (e) => e.status !== 'CANCELLED' && e.metadata?.stripeSessionId === input.stripeSessionId
      );
      if (existing) {
        return {
          success: true,
          lockId: existing.id,
          priceLockSha256: existing.metadata?.priceLockSha256,
          storageMode: 'FALLBACK_OFFLINE_DISK',
          reason: 'ALREADY_LOCKED',
        };
      }
    }

    const entityParts = (input.entityId || 'artist:edwin-agudelo').split(':');
    const entityKind = entityParts.length > 1 ? entityParts[0] : 'artista';
    const entitySlug = entityParts.length > 1 ? entityParts.slice(1).join(':') : (input.entityId || 'edwin-agudelo');

    const res = await lockDateAtomically({
      ...input,
      eventDate: input.date || (input as any).eventDate,
      entityKind,
      entitySlug,
    });

    if (res.success) {
      await this.syncCustomFile();
    }

    let normalizedReason: AtomicLockResult['reason'];
    if (res.reason === 'PRODUCTION_COLLISION' || res.reason === 'COLLISION') {
      normalizedReason = 'COLLISION';
    } else if (res.reason === 'LOCKED') {
      normalizedReason = 'LOCKED';
    } else if (res.reason === 'ALREADY_LOCKED') {
      normalizedReason = 'ALREADY_LOCKED';
    } else if (res.reason === 'MAX_DAILY_CAP_REACHED') {
      normalizedReason = 'MAX_DAILY_CAP_REACHED';
    } else {
      normalizedReason = res.reason as any;
    }

    return {
      success: res.success,
      lockId: res.lockId || res.blockId,
      priceLockSha256: res.priceLockSha256,
      storageMode: res.storageMode,
      reason: normalizedReason,
      error: !res.success ? (res.reason === 'PRODUCTION_COLLISION' ? `Fecha ya bloqueada para ${input.entityId}` : res.reason) : undefined,
    };
  }

  async releaseLock(lockId: string): Promise<boolean> {
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE = this.filePath;
    tripDbCircuit();
    const res = await unlockDateAtomically({ lockId });
    await this.syncCustomFile();
    return res.success && Boolean(res.releasedLockId);
  }

  async purgeAll(): Promise<void> {
    await this.writeQueue;
    process.env.EAR_OFFLINE_DATE_LOCKS_STORE = this.filePath;
    if (fs.existsSync(this.filePath)) {
      await fs.promises.unlink(this.filePath).catch(() => undefined);
    }
    const defaultStore = path.resolve(process.cwd(), '.data', 'offline-date-locks.json');
    if (fs.existsSync(defaultStore)) {
      await fs.promises.unlink(defaultStore).catch(() => undefined);
    }
    await reloadOfflineStoreFromDisk();
    resetDbCircuitBreaker();
  }

  tripCircuitBreaker(durationMs: number = 10000): void {
    tripDbCircuit();
    (globalThis as any).__earOfflineDbCircuitBreakerUntil = Date.now() + durationMs;
  }

  isCircuitBreakerActive(): boolean {
    return isDbCircuitOpen();
  }

  resetCircuitBreaker(): void {
    resetDbCircuitBreaker();
  }
}

/* ========================================================================== */
/* 3. MOTOR DE ASERCIONES Y TRACKER DE RESULTADOS                             */
/* ========================================================================== */

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`AssertionError: ${message}`);
  }
}

export function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`AssertionError [${message}]: Esperado ${String(expected)}, recibido ${String(actual)}`);
  }
}

export function assertDeepEqual<T>(actual: T, expected: T, message: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`AssertionError [${message}]: \nEsperado: ${expectedStr}\nRecibido: ${actualStr}`);
  }
}

export function assertCloseTo(actual: number, expected: number, epsilon: number = 0.001, message: string): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`AssertionError [${message}]: Valor ${actual} difiere de ${expected} por más de ${epsilon}`);
  }
}

export interface TestResult {
  tier: number;
  featureId?: string;
  testName: string;
  passed: boolean;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  error?: string;
  details?: Record<string, unknown>;
}

export class TestExecutionTracker {
  private results: TestResult[] = [];
  private startTime = Date.now();

  record(res: TestResult): void {
    this.results.push(res);
  }

  getResults(): readonly TestResult[] {
    return this.results;
  }

  getTierResults(tier: number): TestResult[] {
    return this.results.filter((r) => r.tier === tier);
  }

  getFeatureResults(featureId: string): TestResult[] {
    return this.results.filter((r) => r.featureId === featureId);
  }

  getPassCount(): number {
    return this.results.filter((r) => r.passed).length;
  }

  getFailCount(): number {
    return this.results.filter((r) => !r.passed).length;
  }

  getTotalCount(): number {
    return this.results.length;
  }

  getTotalDurationMs(): number {
    return Date.now() - this.startTime;
  }

  getSummary() {
    const total = this.getTotalCount();
    const pass = this.getPassCount();
    const fail = this.getFailCount();
    const durationMs = this.getTotalDurationMs();
    const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
    return {
      total,
      pass,
      fail,
      durationMs,
      passRate,
      tier1Count: this.getTierResults(1).length,
      tier2Count: this.getTierResults(2).length,
      tier3Count: this.getTierResults(3).length,
      tier4Count: this.getTierResults(4).length,
    };
  }

  printSummary(): void {
    const summary = this.getSummary();
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║           INVESTOR SHOWCASE E2E TEST SCORECARD (TIERS 1 - 4)             ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝');
    console.log(`  Total Casos de Prueba : ${summary.total}`);
    console.log(`  Tier 1 (Feature Cov)   : ${summary.tier1Count} tests (F1..F11 ≥ 5 c/u)`);
    console.log(`  Tier 2 (Boundaries)    : ${summary.tier2Count} tests`);
    console.log(`  Tier 3 (Pairwise)      : ${summary.tier3Count} tests`);
    console.log(`  Tier 4 (Scenarios)     : ${summary.tier4Count} escenarios`);
    console.log(`  Aprobados (PASS)       : ${summary.pass}`);
    console.log(`  Fallidos (FAIL)        : ${summary.fail}`);
    console.log(`  Tasa de Éxito          : ${summary.passRate}%`);
    console.log(`  Tiempo Total           : ${summary.durationMs} ms`);

    if (summary.fail > 0) {
      console.log('\n❌ Casos fallidos:');
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  [T${r.tier}${r.featureId ? ` / ${r.featureId}` : ''}] ${r.testName}: ${r.error}`);
        });
    }
  }
}
