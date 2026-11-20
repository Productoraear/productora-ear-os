/**
 * ════════════════════════════════════════════════════════════════════════════
 * GENERIC CONCIERGE AGENT — UN SOLO MOTOR, N ENTIDADES (MULTI-TENANT)
 * ════════════════════════════════════════════════════════════════════════════
 * Prohibido crear un agente hardcodeado por gremio (uno para fincas, otro para
 * DJ, otro para tartas): N procesos × M peticiones = coste y deriva de política.
 * Aquí hay UN runtime que se HIDRATA:
 *
 *   providerProfile (slug / category / stripeAccountId)
 *        ├─► ServiceOffer[]         (catálogo polimórfico, céntimos)
 *        └─► LeadDeferredDemand[]   (libreta de peticiones satélite)
 *                ▲                        │
 *        rol + herramientas + guion ──────┘
 *
 * Lo que produce `hydrateProviderAgentContext`:
 *   · `role`          → «Maître de X» (entidad con ancla) / «Conserje».
 *   · `tools`         → subconjunto REAL del manifiesto MCP según el ancla
 *                       (nunca inventa una herramienta que no exista).
 *   · `systemPrompt`  → contexto de entidad + guion del Maître (FASE 3) cuando
 *                       el turno contiene una demanda satélite.
 *   · `replenishment` → apertura post-conversión (FASE 4) si hay libreta.
 *
 * INVARIANTES:
 *   · INV-20: `select` quirúrgico en las tres consultas; cero payload bloat.
 *   · SEC-2 (default-deny): sin `slug` resoluble NO hay agente
 *     (`multiTenant:false`) y el llamante cae al concierge genérico.
 *   · AF-1: si la DB no responde se devuelve `mode:"SIMULADO"` + `hydrated:false`
 *     y el prompt declara que el catálogo no está disponible.
 *   · Cero teléfonos de proveedor en el prompt.
 *
 * MÓDULO DE SERVIDOR (Prisma).
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { classifyDbFailure } from '@/lib/db/dbFailureClassifier';
import { isConciergeToolName, type ConciergeToolName } from '@/lib/mcp/concierge-tools';
import {
  DEFERRED_DEMAND_LABELS,
  detectDeferredDemand,
  isDeferredDemandCategory,
  type DeferredDemandCategory,
} from '@/lib/concierge/deferred-demand';
import {
  buildConcentricRefusalScript,
  buildPostConversionScript,
  isSatelliteDemand,
} from '@/lib/concierge/sovereign-script';

/** Gremio de la oferta que representa el ANCLA comercial de la entidad. */
export type AnchorCategory = 'BASE' | 'MUSIC' | 'GASTRO_EXTRA' | 'PHOTO' | 'TRANSPORT' | 'DECORATION';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Carga tipada (INV-20: `select` explícito en cada consulta)                 */
/* ──────────────────────────────────────────────────────────────────────────── */

const PROVIDER_SELECT = {
  id: true,
  slug: true,
  name: true,
  companyName: true,
  category: true,
  city: true,
  province: true,
  status: true,
  claimStatus: true,
  stripeAccountId: true,
} as const satisfies Prisma.providerProfileSelect;

const OFFER_SELECT = {
  id: true,
  code: true,
  name: true,
  category: true,
  priceInCents: true,
  depositInCents: true,
  currency: true,
  unitLabel: true,
  isAnchor: true,
} as const satisfies Prisma.ServiceOfferSelect;

const DEMAND_SELECT = {
  id: true,
  category: true,
  rawPrompt: true,
  status: true,
} as const satisfies Prisma.LeadDeferredDemandSelect;

type ProviderRow = Prisma.providerProfileGetPayload<{ select: typeof PROVIDER_SELECT }>;
type OfferRow = Prisma.ServiceOfferGetPayload<{ select: typeof OFFER_SELECT }>;
type DemandRow = Prisma.LeadDeferredDemandGetPayload<{ select: typeof DEMAND_SELECT }>;

export interface HydratedOffer {
  readonly code: string;
  readonly name: string;
  readonly category: string;
  readonly priceEur: number;
  readonly depositEur: number | null;
  readonly unitLabel: string | null;
  readonly isAnchor: boolean;
}

export interface HydratedDeferredDemand {
  readonly id: string;
  readonly category: DeferredDemandCategory | null;
  readonly label: string;
  readonly status: string;
}

/** Céntimos → euros con dos decimales exactos (250050 ⇒ 2500.5). */
function centsToEur(cents: number): number {
  return Math.round(cents) / 100;
}

export interface ProviderAgentContext {
  /** `true` ⇔ existe entidad real en la ruta (multi-tenant activo). */
  readonly multiTenant: boolean;
  readonly hydrated: boolean;
  readonly mode: 'REAL' | 'SIMULADO';
  readonly source: 'live' | 'static';
  readonly providerId: string | null;
  readonly providerSlug: string | null;
  readonly providerName: string | null;
  readonly gremio: string | null;
  /** `true` ⇔ la entidad puede recibir pagos (Stripe Connect configurado). */
  readonly acceptsStripe: boolean;
  readonly role: string;
  readonly anchorOffer: HydratedOffer | null;
  readonly satelliteOffers: readonly HydratedOffer[];
  /** Herramientas MCP permitidas para ESTA hidratación (subconjunto real). */
  readonly tools: readonly ConciergeToolName[];
  readonly deferredDemand: {
    readonly detected: boolean;
    readonly category: DeferredDemandCategory | null;
    readonly label: string | null;
    readonly satellite: boolean;
    readonly sanitizedPrompt: string;
  };
  readonly deferredDemands: readonly HydratedDeferredDemand[];
  readonly systemPrompt: string;
  /** Apertura post-conversión (FASE 4). `null` si no hay libreta. */
  readonly replenishment: string | null;
  readonly error: string | null;
}

export interface HydrateProviderAgentInput {
  /** Slug de la entidad en la ruta (`/proveedores/<slug>`). */
  readonly providerSlug: string | null;
  /** Mensaje del turno: el motor extrae de él la demanda satélite. */
  readonly message: string;
  /** Sesión de conversación: clave de la libreta. */
  readonly sessionId: string;
}

/**
 * Herramientas del manifiesto visibles para la hidratación. Solo nombres que
 * existen en `CONCIERGE_TOOL_NAMES`; el resto se descarta (cero invención).
 */
function selectTools(anchorPresent: boolean): readonly ConciergeToolName[] {
  const base: string[] = [
    'consultar_proveedor',
    'verificar_fecha',
    'simular_presupuesto',
    'auditar_rider_acustico',
    // Herramientas de captura y repliegue (FASE 2).
    'stash_deferred_demand',
    'get_stashed_demands',
  ];
  if (anchorPresent) base.push('preparar_price_lock');
  return base.filter((name: string): name is ConciergeToolName => isConciergeToolName(name));
}

/** Ficha mínima legible del catálogo: nombre · precio · unidad?. */
function describeOffer(offer: HydratedOffer): string {
  const price: string = `${offer.priceEur.toFixed(2).replace('.', ',')} €`;
  const unit: string = offer.unitLabel !== null && offer.unitLabel.length > 0 ? `/${offer.unitLabel}` : '';
  return `${offer.name} (${price}${unit})`;
}

function buildSystemPrompt(input: {
  readonly providerName: string;
  readonly gremio: string | null;
  readonly municipality: string | null;
  readonly anchorOffer: HydratedOffer | null;
  readonly satelliteOffers: readonly HydratedOffer[];
  readonly role: string;
  readonly catalogAvailable: boolean;
  readonly deferredDemand: ProviderAgentContext['deferredDemand'];
  readonly refusedScript: string | null;
}): string {
  const lines: string[] = [
    `Eres ${input.role} de Productora EAR OS. Atiendes la ficha de ${input.providerName}` +
      `${input.municipality !== null ? ` (${input.municipality})` : ''}` +
      `${input.gremio !== null ? ` · gremio: ${input.gremio}` : ''}.`,
    'DIRECTIVA INMUTABLE:',
    '1. Hablas SOLO de esta entidad y de su catálogo. No ofreces el roster propio como sustituto del ancla.',
    '2. PROHIBIDO inventar precios, aforos, disponibilidad o condiciones que no figuren en el catálogo.',
    '3. CERO teléfonos o emails de la entidad en el chat. Canal oficial: ' + CENTRALITA_EAR_OS + '.',
    '4. CONVERSIÓN CONCÉNTRICA: el ancla (fecha + propuesta principal) se cierra PRIMERO; ' +
      'los servicios ajenos se aplazan en la libreta y se repliegan DESPUÉS.',
  ];

  if (!input.catalogAvailable) {
    lines.push('CATÁLOGO NO DISPONIBLE (modo declarado): no cites importes; cierra la cita con el equipo.');
  } else {
    lines.push(
      `ANCLA COMERCIAL: ${input.anchorOffer !== null ? describeOffer(input.anchorOffer) : 'pendiente de confirmar con la entidad'}.`,
    );
    lines.push(
      input.satelliteOffers.length > 0
        ? `Ofertas satélite reales: ${input.satelliteOffers.map(describeOffer).join(' · ')}.`
        : 'Sin ofertas satélite publicadas: si el cliente pide una, se aplaza en la libreta.',
    );
  }

  if (input.deferredDemand.detected && input.refusedScript !== null) {
    lines.push(
      `DEMANDA SATÉLITE DETECTADA (${input.deferredDemand.label ?? 'servicio complementario'}): ` +
        'llama a `stash_deferred_demand` y responde con este guion, sin añadir ni quitar compromisos:',
      `«${input.refusedScript}»`,
    );
  }

  return lines.join('\n');
}

/**
 * Hidrata el ÚNICO motor agéntico para la entidad activa en la ruta.
 *
 * Fail-closed (SEC-2): sin slug, con slug desconocido o con la base de datos
 * caída devuelve un contexto NEUTRAL (`multiTenant:false`, `hydrated:false`)
 * que el llamante usa para caer al concierge genérico. Nunca un «agente» que
 * inventa un catálogo inexistente.
 */
export async function hydrateProviderAgentContext(input: HydrateProviderAgentInput): Promise<ProviderAgentContext> {
  const slug: string = typeof input.providerSlug === 'string' ? input.providerSlug.trim() : '';
  const detection = detectDeferredDemand(input.message);

  const neutral = (error: string | null): ProviderAgentContext => ({
    multiTenant: false,
    hydrated: false,
    mode: 'SIMULADO',
    source: 'static',
    providerId: null,
    providerSlug: slug.length > 0 ? slug : null,
    providerName: null,
    gremio: null,
    acceptsStripe: false,
    role: 'Conserje de la red EAR OS',
    anchorOffer: null,
    satelliteOffers: [],
    tools: [],
    deferredDemand: {
      detected: detection.detected,
      category: detection.category,
      label: detection.label,
      satellite: detection.detected,
      sanitizedPrompt: detection.sanitizedPrompt,
    },
    deferredDemands: [],
    systemPrompt: '',
    replenishment: null,
    error,
  });

  if (slug.length === 0) return neutral('PROVIDER_SLUG_REQUIRED');

  let provider: ProviderRow | null;
  let offers: readonly OfferRow[];
  let demands: readonly DemandRow[];

  try {
    provider = await prisma.providerProfile.findUnique({ where: { slug }, select: PROVIDER_SELECT });
    if (provider === null) return neutral('PROVIDER_NOT_FOUND');

    offers = await prisma.serviceOffer.findMany({
      where: { providerId: provider.id, isActive: true },
      select: OFFER_SELECT,
      orderBy: [{ isAnchor: 'desc' }, { sortOrder: 'asc' }],
      take: 24,
    });

    demands = await prisma.leadDeferredDemand.findMany({
      where: { sessionId: input.sessionId, providerId: provider.id, status: { in: ['STASHED', 'PRESENTED'] } },
      select: DEMAND_SELECT,
      orderBy: { createdAt: 'asc' },
      take: 12,
    });
  } catch (error: unknown) {
    const report = classifyDbFailure(error);
    console.warn(`[GENERIC_AGENT] hidratación no disponible · slug=${slug} · kind=${report.kind}`);
    return neutral(`HYDRATION_FAILED: ${report.kind}`);
  }

  const displayName: string =
    provider.companyName !== null && provider.companyName.trim().length > 0
      ? provider.companyName.trim()
      : provider.name !== null && provider.name.trim().length > 0
        ? provider.name.trim()
        : slug;

  const hydratedOffers: readonly HydratedOffer[] = offers.map(toHydratedOffer);
  const anchorOffer: HydratedOffer | null =
    hydratedOffers.find((offer: HydratedOffer) => offer.isAnchor) ?? hydratedOffers[0] ?? null;
  const satelliteOffers: readonly HydratedOffer[] = hydratedOffers.filter(
    (offer: HydratedOffer) => anchorOffer === null || offer.code !== anchorOffer.code,
  );

  const gremio: string | null = String(provider.category);

  // Demanda satélite: solo si el gremio pedido NO es el de la entidad.
  const satellite: boolean = detection.detected && detection.category !== null
    ? isSatelliteDemand(detection.category, gremio)
    : false;

  const role: string = anchorOffer !== null ? `Maître de ${displayName}` : `Conserje de ${displayName}`;

  const refusedScript: string | null =
    satellite && detection.category !== null
      ? buildConcentricRefusalScript({
          requestedLabel: DEFERRED_DEMAND_LABELS[detection.category],
          providerName: displayName,
          anchorOfferName: anchorOffer?.name ?? null,
          depositCents: anchorOffer?.depositEur !== null && anchorOffer?.depositEur !== undefined
            ? Math.round(anchorOffer.depositEur * 100)
            : null,
        })
      : null;

  const hydratedDemands: readonly HydratedDeferredDemand[] = demands.map((row: DemandRow) => ({
    id: row.id,
    category: isDeferredDemandCategory(row.category) ? row.category : null,
    label: isDeferredDemandCategory(row.category) ? DEFERRED_DEMAND_LABELS[row.category] : row.category,
    status: row.status,
  }));

  const replenishment: string | null =
    hydratedDemands.length > 0
      ? buildPostConversionScript({
          providerName: displayName,
          anchorOfferName: anchorOffer?.name ?? null,
          demands: hydratedDemands.map((demand: HydratedDeferredDemand) => ({
            category: demand.category ?? '',
            rawPrompt: '',
          })),
        })
      : null;

  const systemPrompt: string = buildSystemPrompt({
    providerName: displayName,
    gremio,
    municipality: provider.city ?? provider.province ?? null,
    anchorOffer,
    satelliteOffers,
    role,
    catalogAvailable: hydratedOffers.length > 0,
    deferredDemand: {
      detected: detection.detected,
      category: detection.category,
      label: detection.label,
      satellite,
      sanitizedPrompt: detection.sanitizedPrompt,
    },
    refusedScript,
  });

  return {
    multiTenant: true,
    hydrated: true,
    mode: 'REAL',
    source: 'live',
    providerId: provider.id,
    providerSlug: provider.slug,
    providerName: displayName,
    gremio,
    acceptsStripe: provider.stripeAccountId !== null && provider.stripeAccountId.trim().length > 0,
    role,
    anchorOffer,
    satelliteOffers,
    tools: selectTools(anchorOffer !== null),
    deferredDemand: {
      detected: detection.detected,
      category: detection.category,
      label: detection.label,
      satellite,
      sanitizedPrompt: detection.sanitizedPrompt,
    },
    deferredDemands: hydratedDemands,
    systemPrompt,
    replenishment,
    error: null,
  };
}

function toHydratedOffer(row: OfferRow): HydratedOffer {
  return {
    code: row.code,
    name: row.name,
    category: row.category,
    priceEur: centsToEur(row.priceInCents),
    depositEur: row.depositInCents === null ? null : centsToEur(row.depositInCents),
    unitLabel: row.unitLabel,
    isAnchor: row.isAnchor,
  };
}
