/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTRATO DE FICHA DE PROVEEDOR — SSOT DE TIPOS (W43 GROUNDING EXTREME)
 * ════════════════════════════════════════════════════════════════════════════
 * Espejo exacto de lo que emite `scripts/build_provider_fichas.cjs`.
 * Este módulo es PURO (cero `node:fs`, cero `next/*`): lo pueden importar
 * Server Components, Client Components y scripts de auditoría sin arrastrar
 * el sistema de ficheros al bundle del navegador.
 *
 * DOCTRINA (§4bis · CERO FACHADAS):
 *   · `verified:true` SOLO con teléfono real publicable (≥9 dígitos, nunca la
 *     centralita +34 693 693 048, nunca placeholder).
 *   · `phone` es `null` cuando el número no es publicable: la ficha NUNCA
 *     transporta un teléfono que no pueda mostrarse.
 *   · `provenanceHash` (SHA-256) sella el contenido: cero alucinación (§17).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Origen del dato: índice HTML absorbido y/o registro canónico depurado. */
export type ProviderFichaSource = 'catalogo_html' | 'providers_canonical';

/** Cómo se resolvió la pareja catálogo ↔ canónico en el join determinista. */
export type ProviderFichaMatchMode = 'vendorId' | 'slug' | 'name' | 'unmatched';

/** Ficha completa (artefacto `fichas_gold.json`). */
export interface ProviderFicha {
  readonly key: string;
  readonly vendorId: string | null;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string;
  readonly municipality: string;
  /** Dígitos E.164 sin `+`. `null` si no hay teléfono publicable. */
  readonly phone: string | null;
  readonly priceEur: number | null;
  readonly priceRange: string;
  readonly rating: number | null;
  readonly reviewsCount: number | null;
  readonly description: string;
  readonly image: string;
  readonly profileUrl: string;
  readonly web: string;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly sources: readonly ProviderFichaSource[];
  readonly matchMode: ProviderFichaMatchMode;
  /** §4bis: true ⇔ teléfono real publicable. */
  readonly verified: boolean;
  readonly completeness: number;
  readonly provenanceHash: string;
}

/** Entrada compacta (artefacto `fichas_index.json`, < 1 MB). */
export interface ProviderFichaIndexEntry {
  readonly key: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly province: string;
  readonly municipality: string;
  readonly phone: string | null;
  readonly priceEur: number | null;
  readonly rating: number | null;
  readonly verified: boolean;
  readonly completeness: number;
  /** Prefijo (16 hex) del `provenanceHash`: puntero verificable, no hash completo. */
  readonly ph: string;
}

export interface ProviderFichaCounts {
  readonly catalogEntries: number;
  readonly canonicalEntries: number;
  readonly fichas: number;
  readonly gold: number;
  readonly groundable: number;
  readonly verified: number;
  readonly duplicatesMerged: number;
  readonly joinModes: Readonly<Record<ProviderFichaMatchMode, number>>;
}

export interface ProviderFichaSourceRef {
  readonly path: string;
  readonly sha256: string;
  readonly entries: number;
}

export interface ProviderFichaGoldFile {
  readonly schemaVersion: string;
  readonly thresholds: { readonly goldMinCompleteness: number };
  readonly sources: {
    readonly catalogoHtml: ProviderFichaSourceRef;
    readonly canonical: ProviderFichaSourceRef;
  };
  readonly counts: ProviderFichaCounts;
  readonly fichas: readonly ProviderFicha[];
}

export interface ProviderFichaIndexFile {
  readonly schemaVersion: string;
  readonly counts: {
    readonly entries: number;
    readonly gold: number;
    readonly verified: number;
    readonly groundable: number;
  };
  readonly entries: readonly ProviderFichaIndexEntry[];
}

// ─── Ayudas puras de presentación ───────────────────────────────────────────

const EURO_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function formatFichaEuro(value: number): string {
  return EURO_FORMATTER.format(value);
}

/** Eleva una entrada de índice a ficha completa (campos ausentes vacíos). */
export function entryToFicha(entry: ProviderFichaIndexEntry): ProviderFicha {
  return {
    key: entry.key,
    vendorId: entry.key.startsWith('v-') ? entry.key.slice(2) : null,
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    province: entry.province,
    municipality: entry.municipality,
    phone: entry.phone,
    priceEur: entry.priceEur,
    priceRange: '',
    rating: entry.rating,
    reviewsCount: null,
    description: '',
    image: '',
    profileUrl: '',
    web: '',
    lat: null,
    lng: null,
    sources: ['catalogo_html'],
    matchMode: 'vendorId',
    verified: entry.verified,
    completeness: entry.completeness,
    provenanceHash: entry.ph,
  };
}

/**
 * Hechos citables derivados EXCLUSIVAMENTE de los campos presentes.
 * Regla de oro: si el dato es `null`, no se emite frase (cero relleno).
 *
 * `exposePhone` es FAIL-CLOSED: por defecto el número verificado NO se escribe
 * en el prompt (anti-picaresca: la línea del proveedor se entrega al cerrar la
 * reserva, no en el chat). Sólo la UI interna puede pedir la exposición.
 */
export function buildFichaFacts(
  ficha: ProviderFicha,
  options?: { readonly exposePhone?: boolean },
): readonly string[] {
  const exposePhone: boolean = options?.exposePhone === true;
  const facts: string[] = [];
  const location: string = [ficha.municipality, ficha.province]
    .filter((part: string) => part.length > 0)
    .join(' · ');
  const suffix: string = ficha.category.length > 0 ? ` (${ficha.category})` : '';

  if (ficha.name.length > 0) {
    facts.push(
      location.length > 0
        ? `Proveedor: ${ficha.name}${suffix} — ${location}.`
        : `Proveedor: ${ficha.name}${suffix}.`,
    );
  }

  if (ficha.priceEur !== null && ficha.priceEur > 0) {
    facts.push(`Tarifa publicada en su ficha: desde ${formatFichaEuro(ficha.priceEur)}.`);
  } else if (ficha.priceRange.length > 0) {
    facts.push(`Rango de precio publicado en su ficha: ${ficha.priceRange}.`);
  }

  if (ficha.rating !== null && ficha.rating > 0) {
    const reviews: string =
      ficha.reviewsCount !== null && ficha.reviewsCount > 0
        ? ` sobre ${String(ficha.reviewsCount)} valoraciones`
        : '';
    facts.push(`Valoración publicada: ${ficha.rating.toFixed(1)}/5${reviews}.`);
  }

  if (ficha.description.length > 0) {
    facts.push(`Descripción del proveedor: ${ficha.description}`);
  }

  facts.push(
    ficha.verified && ficha.phone !== null
      ? exposePhone
        ? `Teléfono verificado y publicable: +${ficha.phone}.`
        : 'Teléfono verificado en la ficha de origen; se entrega al confirmar la reserva (no se publica en el chat).'
      : 'Sin teléfono verificado en origen: el canal válido es la Conserjería EAR OS.',
  );

  return facts;
}

/** Datos que la ficha NO certifica y deben cerrarse con el proveedor. */
export function buildFichaMissing(ficha: ProviderFicha): readonly string[] {
  const missing: string[] = [];
  if (ficha.priceEur === null && ficha.priceRange.length === 0) missing.push('tarifa real del servicio');
  if (ficha.rating === null) missing.push('valoraciones independientes');
  if (ficha.municipality.length === 0) missing.push('municipio de cobertura');
  missing.push('disponibilidad real de la fecha', 'condiciones de desplazamiento y montaje');
  return missing;
}

