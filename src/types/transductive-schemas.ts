/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTRATOS TRANSDUCTIVOS DE ESQUEMA (SCHEMA LIFTING TIER-1) · EAR OS S-CLASS
 * ────────────────────────────────────────────────────────────────────────────
 * Doctrina de Convección Ascendente:
 * Ningún dataset JSON, CSV o configuración estática puede existir como texto
 * plano ciego. Todo activo debe poseer un contrato estricto de esquema tipado
 * en compilación y tiempo de ejecución (Zod / TypeScript strict).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

// ============================================================================
// 1. ESQUEMA TRANSDUCTIVO: CATÁLOGO ILUMINACIÓN NAVIDEÑA (652 REFERENCIAS)
// ============================================================================

export const LucesNavidadItemSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional().default('Iluminación Monumental'),
  targetSector: z.string().optional(),
  description: z.string().min(1),
  priceNumeric: z.number().nonnegative(),
  priceDisplay: z.string().min(1),
  unitType: z.string().optional().default('unidad'),
  powerWatts: z.union([z.number(), z.string()]).nullable().optional(),
  weightKg: z.union([z.number(), z.string()]).nullable().optional(),
  voltage: z.string().optional().default('230V / 24V'),
  dimensions: z.string().optional().default('Ver catálogo técnico'),
  ledColor: z.string().optional().default('LED Blanco'),
  ipRating: z.string().optional().default('IP65 / IP44'),
  material: z.string().optional().default('Aluminio'),
  specialTransport: z.boolean().default(false),
  hasVideo: z.boolean().default(false),
  cataloguePage: z.number().int().positive().optional().default(1),
  provider: z.string().optional().default('División Alumbrado Monumental · Productora EAR'),
  canonicalUrl: z.string().optional(),
  image: z.string().min(1),
  pageImage: z.string().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().default('EUR'),
  price_lock_deposit: z.number().nonnegative().optional().default(100),
  smart_lock_validity: z.string().optional().default('72h'),
  art_118_lcsp_compliant: z.boolean().optional().default(true),
});

export type LucesNavidadItem = z.infer<typeof LucesNavidadItemSchema>;
export const LucesNavidadDatasetSchema = z.array(LucesNavidadItemSchema);
export type LucesNavidadDataset = z.infer<typeof LucesNavidadDatasetSchema>;

// ============================================================================
// 2. ESQUEMA TRANSDUCTIVO: OPORTUNIDADES B2G & RADAR DE LICITACIONES
// ============================================================================

export const B2GOpportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  municipality: z.string().optional(),
  budgetEur: z.number().optional(),
  expediente: z.string().optional(),
  deadline: z.string().optional(),
  art118Compliant: z.boolean().optional().default(true),
  status: z.string().optional().default('OPEN'),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export type B2GOpportunity = z.infer<typeof B2GOpportunitySchema>;
export const B2GOpportunitiesDatasetSchema = z.union([
  z.array(B2GOpportunitySchema),
  z.record(z.string(), z.unknown()),
]);

// ============================================================================
// 3. ESQUEMA TRANSDUCTIVO: FRAMEWORKS ESTRATÉGICOS & ORÁCULO INTENT-DAG
// ============================================================================

export const StrategicFrameworkItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  domain: z.string().optional(),
  pillars: z.array(z.string()).optional(),
  directives: z.array(z.string()).optional(),
}).passthrough();

export type StrategicFrameworkItem = z.infer<typeof StrategicFrameworkItemSchema>;

export const IntentDAGItemSchema = z.object({
  id: z.string().optional(),
  intent: z.string().optional(),
  handler: z.string().optional(),
  confidence: z.number().optional(),
  requiresHitl: z.boolean().optional(),
}).passthrough();

// ============================================================================
// 4. CONTRATOS TRANSDUCTIVOS: MANDATO BEZOS & MARKETPLACE DESACOPLADO
// ============================================================================

/**
 * Contrato de Menú Gastronómico / Restauración (Estándar Otzarreta)
 * Principio: Alérgenos y celíacos a coste CERO (0,00 €).
 */
export const MenuContractSchema = z.object({
  id: z.string().min(1),
  asin: z.string().regex(/^EAR-ASIN-FNC-[A-Z0-9_-]+$/),
  name: z.string().min(1),
  priceEur: z.number().positive(),
  celiacAllergensCostEur: z.number().refine((val) => val === 0, {
    message: 'Violación Constitucional: Los alérgenos y opciones para celíacos deben ser a coste 0 €.',
  }),
  minPax: z.number().int().positive().default(50),
  maxPax: z.number().int().positive().default(350),
  drinksIncluded: z.boolean().default(true),
  midnightSnackIncluded: z.boolean().default(true),
  dietaryCoverage: z.array(z.string()).default(['Celiacos', 'Vegetarianos', 'Veganos', 'Intolerancias']),
  verifiedSeason: z.number().int().default(2026),
});

export type MenuContract = z.infer<typeof MenuContractSchema>;

/**
 * Contrato de Contratación Artística (Estándar Edwin Agudelo e78903)
 */
export const ArtistBookingContractSchema = z.object({
  id: z.string().min(1),
  asin: z.string().regex(/^EAR-ASIN-ART-[A-Z0-9_-]+$/),
  artistName: z.string().min(1),
  tarifaBaseEur: z.number().min(350),
  kmIncluidos: z.number().min(0).default(100),
  recargoKmExcedenteEur: z.number().min(0).default(1.5),
  riderPotenciaKw: z.number().positive().default(1.5),
  sonidoPropioBose: z.boolean().default(true),
  splitSoberano: z.object({
    artista: z.number().default(0.8),
    earOs: z.number().default(0.1),
    vimume: z.number().default(0.1),
  }),
});

export type ArtistBookingContract = z.infer<typeof ArtistBookingContractSchema>;

/**
 * Contrato de Bloqueo de Fecha & Fianza Deducible (Airbnb Trust Model)
 * Principio: Depósito deducible inmutable de 100,00 € con firma eIDAS.
 */
export const ReservationDateLockContractSchema = z.object({
  asin: z.string().min(1),
  entityName: z.string().min(1),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha debe tener formato YYYY-MM-DD' }),
  depositoEur: z.number().refine((val) => val === 100, {
    message: 'El depósito Price-Lock de reserva debe ser exactamente 100,00 €.',
  }),
  eidasSignatureSha256: z.string().length(64),
  status: z.enum(['HELD', 'CONFIRMED', 'SETTLED']).default('HELD'),
  customerReference: z.string().min(1),
});

export type ReservationDateLockContract = z.infer<typeof ReservationDateLockContractSchema>;

/**
 * Contrato de Conformidad Acústica Ley 37/2003
 * Principio: Techo infranqueable de 75 dB(A).
 */
export const AcousticComplianceContractSchema = z.object({
  asin: z.string().min(1),
  venueOrActName: z.string().min(1),
  maxSplDb: z.number().max(75, {
    message: 'Violación Ley 37/2003: El nivel de presión sonora no puede superar los 75 dB(A).',
  }),
  limiterCertified: z.boolean().default(true),
  normativa: z.literal('Ley 37/2003 del Ruido'),
  timestampCalibration: z.string().optional(),
});

export type AcousticComplianceContract = z.infer<typeof AcousticComplianceContractSchema>;

/**
 * Contrato de Hoja de Ruta Logística (Uber Fleet Dispatch)
 * Principio: Montaje 2 horas antes con check eléctrico garantizado.
 */
export const FleetWaybillContractSchema = z.object({
  serviceId: z.string().min(1),
  asin: z.string().min(1),
  destinationMunicipality: z.string().min(1),
  province: z.string().min(1),
  distanceKm: z.number().min(0),
  logisticsCostEur: z.number().min(0),
  setupHoursPrior: z.number().min(2, {
    message: 'El protocolo de gala exige montaje mínimo 2 horas antes de apertura.',
  }),
  electricalSupply: z.enum(['TRIFASICA_32A', 'TRIFASICA_63A', 'MONOFASICA_16A']),
  acousticCheckDone: z.boolean().default(true),
  contingencyUnitAvailable: z.boolean().default(true),
  vanAssignedPlate: z.string().optional(),
});

export type FleetWaybillContract = z.infer<typeof FleetWaybillContractSchema>;

/**
 * Contrato de Garantía de Ejecución de Gala ("Fulfillment by EAR OS")
 */
export const SovereignFulfillmentGuaranteeSchema = z.object({
  asin: z.string().min(1),
  entityName: z.string().min(1),
  setup2hPriorVerified: z.literal(true),
  acousticUnder75Db: z.literal(true),
  electricalRiderVerified: z.literal(true),
  provincesCoverage52: z.literal(true),
  sha256Proof: z.string().length(64),
  status: z.enum(['VERIFIED_CANONICAL', 'PENDING_DISPATCH', 'EXECUTED']).default('VERIFIED_CANONICAL'),
});

export type SovereignFulfillmentGuarantee = z.infer<typeof SovereignFulfillmentGuaranteeSchema>;

/**
 * Contrato de Puntuación de Algoritmo de Compatibilidad ("Buy Box" S-Class)
 * Ecuación: Score = (ProximidadKm * 0.4) + (FiabilidadTecnica * 0.3) + (RespetoTarifasSSOT * 0.3)
 */
export const BuyBoxCompatibilityRequestSchema = z.object({
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  province: z.string().min(1),
  guestCount: z.number().int().positive().default(120),
  budgetEur: z.number().positive().default(25000),
  preferredCategory: z.enum(['fincas', 'artistas', 'produccion', 'all']).default('all'),
});

export type BuyBoxCompatibilityRequest = z.infer<typeof BuyBoxCompatibilityRequestSchema>;

export const BuyBoxScoredEntitySchema = z.object({
  asin: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  province: z.string().min(1),
  is1pAnchor: z.boolean().default(false),
  proximityKm: z.number().min(0),
  proximityScore: z.number().min(0).max(1),
  technicalReliabilityScore: z.number().min(0).max(1),
  ssotRateRespectScore: z.number().min(0).max(1),
  compositeScore: z.number().min(0).max(1),
  compatibilityPercentage: z.number().min(0).max(100),
  rank: z.number().int().positive(),
  matchReasons: z.array(z.string()),
});

export type BuyBoxScoredEntity = z.infer<typeof BuyBoxScoredEntitySchema>;

// ============================================================================
// 5. FUNCIÓN VALIDATRIZ TRANSDUCTIVA UNIVERSAL
// ============================================================================

export interface DatasetValidationResult<T> {
  success: boolean;
  itemCount: number;
  data?: T;
  errors?: string[];
  durationMs: number;
}

/**
 * Valida mecánicamente cualquier dataset plano contra su contrato Zod.
 * Cumple el principio de elevación transductiva sin admitir texto ciego.
 */
export function validateTransductiveDataset<T>(
  data: unknown,
  schema: z.ZodType<T>,
  datasetName: string = 'Dataset'
): DatasetValidationResult<T> {
  const start = performance.now();
  const parsed = schema.safeParse(data);
  const durationMs = performance.now() - start;

  if (parsed.success) {
    const count = Array.isArray(parsed.data) ? parsed.data.length : 1;
    return {
      success: true,
      itemCount: count,
      data: parsed.data,
      durationMs: Math.round(durationMs * 100) / 100,
    };
  }

  const errorMessages = parsed.error.issues.slice(0, 10).map(
    (issue) => `[${datasetName}] Ruta ${issue.path.join('.')}: ${issue.message}`
  );

  return {
    success: false,
    itemCount: 0,
    errors: errorMessages,
    durationMs: Math.round(durationMs * 100) / 100,
  };
}
