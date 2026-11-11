/**
 * ════════════════════════════════════════════════════════════════════════════
 * PUENTE FORMULARIO ↔ CONCIERGE (ORDEN 2026-11-11 §1 y §3)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el asistente respondía «no puedo ver las casillas» porque el
 * estado del formulario vivía aislado en la memoria de un componente React.
 * Este módulo define el CONTRATO único —puro, serializable, sin `node:fs`— que
 * viaja del formulario al endpoint MCP y de la ficha al formulario.
 *
 * DOS DIRECCIONES:
 *   1. Ficha → formulario (`buildProviderFunnelHref`): inyecta `providerId`,
 *      `slug`, categoría y servicios en la URL de la simulación, y genera el
 *      enlace prellenado de WhatsApp con la centralita oficial.
 *   2. Formulario → concierge (`FormSnapshot`): las casillas marcadas viajan en
 *      cada mensaje para que el agente cotice y alterne proveedores sin perder
 *      el desglose.
 *
 * REGLAS DURAS:
 *   · Cero importes en `float`: los servicios cruzan la frontera en CÉNTIMOS.
 *   · El teléfono sale SIEMPRE de `ear-os-ssot.ts` (INV-12), nunca literal.
 *   · Módulo puro: lo importan Client Components y Route Handlers por igual.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import type { ServiceNode } from '@/lib/budget/service-tree-engine';

/* ──────────────────────────────────────────────────────────────────────────── */
/* 1 · Ficha → formulario (embudo transaccional)                               */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Ruta canónica de la calculadora. `/calculadora` queda como alias 301. */
export const CANONICAL_QUOTE_PATH: string = '/presupuesto';

/** Servicio ofertado en una ficha de proveedor (base del árbol). */
export interface FichaService {
  readonly id: string;
  readonly label: string;
  /** Precio unitario en céntimos enteros. */
  readonly unitPriceCents: number;
}

/** Contexto de embudo que la ficha inyecta en la simulación. */
export interface ProviderFunnelContext {
  readonly providerId: string;
  readonly providerSlug: string;
  readonly providerName: string;
  /** Categoría canónica de macro-partida (`BudgetCategoryId`). */
  readonly category: string;
  readonly services: readonly FichaService[];
}

/** Resultado del embudo: URL de simulación + URL de WhatsApp, ambas verificables. */
export interface ProviderFunnelLinks {
  /** `/presupuesto?providerId=…&slug=…&category=…&servicios=…` */
  readonly simulationHref: string;
  /** `https://wa.me/…?text=…` con la centralita oficial del SSOT. */
  readonly whatsappHref: string;
  /** Céntimos totales de los servicios preseleccionados (0 si no hay). */
  readonly preselectedCents: number;
}

/** Dígitos E.164 de la centralita, sin símbolos (`wa.me` exige sólo dígitos). */
export function centralitaDigits(): string {
  return CENTRALITA_EAR_OS.replace(/\D/g, '');
}

/**
 * Codifica los servicios en un token compacto `id:cents,id:cents`.
 * Los ids con `:` se descartan antes de codificar (no se puede servir un
 * servicio que la propia codificación corrompería).
 */
export function encodeFichaServices(services: readonly FichaService[]): string {
  return services
    .filter((service: FichaService) => !service.id.includes(':') && service.unitPriceCents >= 0)
    .map((service: FichaService) => `${service.id}:${service.unitPriceCents}`)
    .join(',');
}

/** Lee el token compacto. Ignora segmentos inválidos; nunca lanza por bits basura. */
export function decodeFichaServices(raw: string | null | undefined): readonly FichaService[] {
  if (typeof raw !== 'string' || raw.length === 0) return [];
  const out: FichaService[] = [];
  for (const chunk of raw.split(',')) {
    const [id, cents] = chunk.split(':');
    if (typeof id !== 'string' || id.length === 0) continue;
    const value: number = Number(cents);
    if (!Number.isInteger(value) || value < 0) continue;
    out.push({ id, label: id, unitPriceCents: value });
  }
  return out;
}

/**
 * Construye el embudo completo de una ficha de proveedor.
 * Toda ficha/landing pSEO puede llamar a esto y obtener dos salidas válidas:
 * la simulación prellenada y el WhatsApp con el mismo contexto.
 */
export function buildProviderFunnelHref(context: ProviderFunnelContext): ProviderFunnelLinks {
  const services: readonly FichaService[] = context.services;
  const preselectedCents: number = services.reduce(
    (sum: number, service: FichaService) => sum + service.unitPriceCents,
    0,
  );

  const params: URLSearchParams = new URLSearchParams({
    providerId: context.providerId,
    slug: context.providerSlug,
    category: context.category,
  });
  if (services.length > 0) {
    params.set('servicios', encodeFichaServices(services));
    params.set('base', String(preselectedCents / 100));
  }

  const message: string =
    `Hola, quiero cotizar ${context.providerName}. ` +
    (services.length > 0
      ? `Servicios preseleccionados: ${services.map((s: FichaService) => s.label).join(', ')}. `
      : '') +
    'Vengo de la ficha de vuestra web.';

  return {
    simulationHref: `${CANONICAL_QUOTE_PATH}?${params.toString()}`,
    whatsappHref: `https://wa.me/${centralitaDigits()}?text=${encodeURIComponent(message)}`,
    preselectedCents,
  };
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* 2 · Formulario → concierge (estado real de las casillas)                    */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Fila mínima que el formulario comparte con el agente. */
export interface FormSnapshotItem {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
  readonly selected: boolean;
  readonly providerId: string | null;
}

/**
 * Instantánea del formulario. Es lo que el agente recibe en cada mensaje para
 * cotizar sin perder el desglose y poder alternar proveedores.
 */
export interface FormSnapshot {
  readonly totalCents: number;
  readonly selectedServices: readonly FormSnapshotItem[];
  /** Macro-partidas congeladas 🔒 (ids canónicos). */
  readonly lockedCategories: readonly string[];
  /** Proveedor en cuya ficha está el usuario, si aplica. */
  readonly providerId: string | null;
}

/** Instantánea vacía: el punto de partida honesto (cero casillas, cero €). */
export function emptyFormSnapshot(): FormSnapshot {
  return { totalCents: 0, selectedServices: [], lockedCategories: [], providerId: null };
}

/** Σ de las casillas MARCADAS (céntimos enteros). */
export function selectedServicesCents(snapshot: FormSnapshot): number {
  return snapshot.selectedServices
    .filter((item: FormSnapshotItem) => item.selected)
    .reduce((sum: number, item: FormSnapshotItem) => sum + item.unitPriceCents * item.quantity, 0);
}

/**
 * Convierte la instantánea en nodos del árbol de servicios.
 * Único punto de traducción: aquí se garantiza que el agente y el planner
 * hablan EXACTAMENTE del mismo árbol (cero divergencia de desglose).
 */
export function snapshotToServiceNodes(
  snapshot: FormSnapshot,
  categoryFor: (item: FormSnapshotItem) => ServiceNode['category'],
): readonly ServiceNode[] {
  return snapshot.selectedServices.map((item: FormSnapshotItem) => ({
    id: item.id,
    category: categoryFor(item),
    label: item.label,
    unitPriceCents: item.unitPriceCents,
    quantity: item.quantity,
    providerId: item.providerId,
    providerSlug: item.providerId,
    selected: item.selected,
  }));
}

/** Resumen de una línea para el prompt del agente (cero PII, cero teléfonos). */
export function describeSnapshot(snapshot: FormSnapshot): string {
  const marked: readonly FormSnapshotItem[] = snapshot.selectedServices.filter(
    (item: FormSnapshotItem) => item.selected,
  );
  if (marked.length === 0) {
    return 'FORMULARIO: sin casillas marcadas (0,00 €).';
  }
  const detail: string = marked
    .map((item: FormSnapshotItem) => `${item.label} ×${String(item.quantity)}`)
    .join(', ');
  return (
    `FORMULARIO: ${String(marked.length)} casilla(s) marcada(s) — ${detail}. ` +
    `Total casillas: ${(selectedServicesCents(snapshot) / 100).toFixed(2)} €.`
  );
}

