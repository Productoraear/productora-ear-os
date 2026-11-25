/**
 * Canonical Entity ASIN Helper (pure, node:crypto-free, client & server safe).
 *
 * Resolves deterministic EAR-ASIN identifiers for artists, fincas/venues,
 * and 3P directory providers while preserving explicit ASINs from
 * `fichas_index.json` (`EAR-ASIN-GEN-*`) and 1P anchors from `asin-standard.ts`.
 */

import { ANCHOR_1P_ASINS, EarAsinSchema } from '@/lib/catalog/asin-standard';

export type EntityAsinKind = 'artist' | 'finca' | 'provider';

const KIND_PREFIX: Readonly<Record<EntityAsinKind, 'ART' | 'FIN' | 'PRV'>> = Object.freeze({
  artist: 'ART',
  finca: 'FIN',
  provider: 'PRV',
});

const EAR_ASIN_INLINE_RE = /\b(EAR-ASIN-[A-Z]{3}-[A-Z0-9_-]{3,64})\b/i;
const EAR_ASIN_TAG_RE = /\[Ref:\s*(EAR-ASIN-[A-Z]{3}-[A-Z0-9_-]{3,64})\]/i;
const EAR_ASIN_PARAM_RE = /(?:^|[?&])ref=(EAR-ASIN-[A-Z]{3}-[A-Z0-9_-]{3,64})/i;

function normalizeAnchorSlug(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function sanitizeAsinSlug(raw: string): string {
  const cleaned = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

  if (cleaned.length >= 3) {
    return cleaned;
  }
  const padded = `${cleaned || 'ENT'}-EAR`.replace(/^-+/, '');
  return padded.length >= 3 ? padded.slice(0, 64) : 'EAR-001';
}

export function isValidEarAsin(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return EarAsinSchema.safeParse(value.trim().toUpperCase()).success;
}

export function extractEarAsinFromText(text: string): string | null {
  if (typeof text !== 'string' || text.trim().length === 0) return null;
  const tagMatch = text.match(EAR_ASIN_TAG_RE);
  if (tagMatch?.[1]) {
    const candidate = tagMatch[1].trim().toUpperCase();
    if (isValidEarAsin(candidate)) return candidate;
  }
  const paramMatch = text.match(EAR_ASIN_PARAM_RE);
  if (paramMatch?.[1]) {
    const candidate = paramMatch[1].trim().toUpperCase();
    if (isValidEarAsin(candidate)) return candidate;
  }
  const inlineMatch = text.match(EAR_ASIN_INLINE_RE);
  if (inlineMatch?.[1]) {
    const candidate = inlineMatch[1].trim().toUpperCase();
    if (isValidEarAsin(candidate)) return candidate;
  }
  return null;
}

export function resolveEntityAsin(
  kind: EntityAsinKind,
  slug: string,
  explicitAsin?: string | null,
): string {
  if (typeof explicitAsin === 'string' && explicitAsin.trim().length > 0) {
    const normalizedExplicit = explicitAsin.trim().toUpperCase();
    if (EarAsinSchema.safeParse(normalizedExplicit).success) {
      return normalizedExplicit;
    }
  }

  const anchorProbe = normalizeAnchorSlug(slug);

  if (
    kind === 'artist' &&
    (anchorProbe === 'edwin-agudelo' ||
      anchorProbe === 'e78903' ||
      anchorProbe === 'productora-ear')
  ) {
    return ANCHOR_1P_ASINS.EDWIN_AGUDELO;
  }

  if (
    kind === 'finca' &&
    (anchorProbe === 'otzarreta' ||
      anchorProbe === 'restaurante-otzarreta' ||
      anchorProbe === 'restaurante-eduardo-martinez' ||
      anchorProbe === 'ezkertza-berria' ||
      anchorProbe === 'restaurante-ezkertza-berria' ||
      anchorProbe === 'restaurante-otzarreta-32714' ||
      anchorProbe === 'v-32714' ||
      anchorProbe === '32714')
  ) {
    return ANCHOR_1P_ASINS.OTZARRETA;
  }

  const prefix = KIND_PREFIX[kind];
  const safeSlug = sanitizeAsinSlug(slug);
  const candidate = `EAR-ASIN-${prefix}-${safeSlug}`;

  if (EarAsinSchema.safeParse(candidate).success) {
    return candidate;
  }
  return `EAR-ASIN-${prefix}-CATALOG`;
}
