/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE CARRITO DE EVENTO COMPLETO · EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte un briefing (provincia, invitados, presupuesto, fecha) en un
 * carrito multi-proveedor:
 *   122 servicios del catálogo → match ≥75 % contra el Data Lake real →
 *   carrito agrupado por proveedor único → garantía de reserva por proveedor.
 *
 * DINERO: aquí NO se inventa ningún precio de venta. La única cifra que este
 * motor puede cobrar es la GARANTÍA DE RESERVA (1 € por proveedor), un gatillo
 * técnico de bloqueo de agenda. El depósito comercial S-Class (100 €) y el
 * split 80/10/10 viven en `ear-os-ssot.ts` y no se tocan.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { EdgeProviderRecord } from '@/lib/providers/edge-partition-loader';
import { buildEntityCalendarHref } from '@/lib/calendar/entity-calendar-engine';
import {
  EVENT_SERVICE_CATALOG,
  catalogCoverage,
  type EventProviderCategory,
  type EventServiceDefinition,
} from '@/lib/events/event-service-catalog';
import {
  PROVIDER_MATCH_THRESHOLD,
  matchServiceToProviders,
  type EventBrief,
  type ProviderMatch,
} from '@/lib/events/event-provider-matcher';

/**
 * Gatillo de reserva por proveedor (simulación de cobro 1 €).
 * NO es el depósito comercial de 100 € del SSOT: es la garantía mínima que
 * bloquea la franja de agenda de cada proveedor del carrito.
 */
export const EVENT_DEPOSIT_UNIT_EUR = 1;
export const EVENT_DEPOSIT_UNIT_CENTS = Math.round(EVENT_DEPOSIT_UNIT_EUR * 100);

export interface EventCartLine {
  readonly service: EventServiceDefinition;
  readonly match: ProviderMatch | null;
  readonly score: number;
  readonly included: boolean;
}

export interface EventCartProvider {
  readonly provider: EdgeProviderRecord;
  readonly kind: string;
  readonly services: readonly EventServiceDefinition[];
  readonly bestScore: number;
  readonly depositCents: number;
  readonly calendarHref: string;
  readonly icalHref: string;
}

export interface EventCartTotals {
  readonly services: number;
  readonly covered: number;
  readonly gaps: number;
  readonly coveragePercent: number;
  readonly essentialTotal: number;
  readonly essentialCovered: number;
  readonly essentialCoveragePercent: number;
  readonly uniqueProviders: number;
  readonly depositUnitCents: number;
  readonly totalDepositCents: number;
  readonly marketReferenceEur: number;
}

export interface EventCart {
  readonly brief: EventBrief;
  readonly threshold: number;
  readonly lines: readonly EventCartLine[];
  readonly gaps: readonly EventServiceDefinition[];
  readonly providers: readonly EventCartProvider[];
  readonly totals: EventCartTotals;
  readonly coverageByCategory: Readonly<Record<EventProviderCategory, number>>;
}

/** Construye el carrito completo del evento. */
export function buildEventCart(
  brief: EventBrief,
  providers: readonly EdgeProviderRecord[],
  options?: { services?: readonly EventServiceDefinition[] },
): EventCart {
  const services = options?.services ?? EVENT_SERVICE_CATALOG;

  const lines: EventCartLine[] = services.map((service) => {
    const match = matchServiceToProviders(service, providers, brief);
    return {
      service,
      match,
      score: match?.score ?? 0,
      included: Boolean(match && match.passesThreshold),
    };
  });

  const includedLines = lines.filter((line) => line.included && line.match);
  const gaps = lines.filter((line) => !line.included).map((line) => line.service);

  // Agrupación por proveedor único: un mismo proveedor cubre N partidas y se
  // cobra UNA sola garantía (evita duplicar el gatillo de 1 €).
  const providerMap = new Map<
    string,
    { provider: EdgeProviderRecord; services: EventServiceDefinition[]; bestScore: number }
  >();

  for (const line of includedLines) {
    const match = line.match;
    if (!match) continue;
    const key = match.provider.slug;
    const existing = providerMap.get(key);
    if (existing) {
      existing.services.push(line.service);
      existing.bestScore = Math.max(existing.bestScore, line.score);
    } else {
      providerMap.set(key, {
        provider: match.provider,
        services: [line.service],
        bestScore: line.score,
      });
    }
  }

  const cartProviders: EventCartProvider[] = Array.from(providerMap.values())
    .sort((a, b) => b.bestScore - a.bestScore)
    .map((entry) => {
      const kind = entry.services[0]?.calendarKind ?? 'servicios';
      return {
        provider: entry.provider,
        kind,
        services: entry.services,
        bestScore: entry.bestScore,
        depositCents: EVENT_DEPOSIT_UNIT_CENTS,
        calendarHref: buildEntityCalendarHref(kind, entry.provider.slug, {
          date: brief.eventDate,
          timeSlot: brief.timeSlot,
          intent: 'bloquear',
        }),
        icalHref: `/api/calendar/${kind}/${encodeURIComponent(entry.provider.slug)}/ical`,
      };
    });

  const essentialServices = services.filter((service) => service.essential);
  const essentialCovered = essentialServices.filter((service) =>
    lines.some((line) => line.service.id === service.id && line.included),
  ).length;

  const covered = includedLines.length;
  const totals: EventCartTotals = {
    services: services.length,
    covered,
    gaps: gaps.length,
    coveragePercent: services.length === 0 ? 0 : Math.round((covered / services.length) * 100),
    essentialTotal: essentialServices.length,
    essentialCovered,
    essentialCoveragePercent:
      essentialServices.length === 0
        ? 0
        : Math.round((essentialCovered / essentialServices.length) * 100),
    uniqueProviders: cartProviders.length,
    depositUnitCents: EVENT_DEPOSIT_UNIT_CENTS,
    totalDepositCents: cartProviders.length * EVENT_DEPOSIT_UNIT_CENTS,
    marketReferenceEur: includedLines.reduce(
      (sum, line) => sum + line.service.marketReferenceEur,
      0,
    ),
  };

  return {
    brief,
    threshold: PROVIDER_MATCH_THRESHOLD,
    lines,
    gaps,
    providers: cartProviders,
    totals,
    coverageByCategory: catalogCoverage(),
  };
}

/** Serializa el carrito a un payload JSON-safe (sin clases ni Map). */
export function toEventCartJson(cart: EventCart): Record<string, unknown> {
  return {
    brief: cart.brief,
    threshold: cart.threshold,
    totals: cart.totals,
    coverageByCategory: cart.coverageByCategory,
    providers: cart.providers.map((entry) => ({
      slug: entry.provider.slug,
      name: entry.provider.name,
      category: entry.provider.category,
      province: entry.provider.province,
      municipality: entry.provider.municipality,
      verified: entry.provider.verified,
      rating: entry.provider.rating,
      kind: entry.kind,
      bestScore: entry.bestScore,
      depositCents: entry.depositCents,
      calendarHref: entry.calendarHref,
      icalHref: entry.icalHref,
      services: entry.services.map((service) => ({
        id: service.id,
        name: service.name,
        phase: service.phase,
        essential: service.essential,
        marketReferenceEur: service.marketReferenceEur,
      })),
    })),
    lines: cart.lines.map((line) => ({
      serviceId: line.service.id,
      service: line.service.name,
      category: line.service.providerCategory,
      phase: line.service.phase,
      essential: line.service.essential,
      included: line.included,
      score: line.score,
      providerSlug: line.match?.provider.slug ?? null,
      providerName: line.match?.provider.name ?? null,
      reasons: line.match?.reasons ?? [],
      warnings: line.match?.warnings ?? [],
    })),
    gaps: cart.gaps.map((service) => ({
      id: service.id,
      name: service.name,
      category: service.providerCategory,
      essential: service.essential,
    })),
  };
}
