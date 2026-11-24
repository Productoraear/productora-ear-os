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
// 4. FUNCIÓN VALIDATRIZ TRANSDUCTIVA UNIVERSAL
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
