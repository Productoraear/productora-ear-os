/**
 * ════════════════════════════════════════════════════════════════════════════
 * PROVIDER PROFILE STORE — ESCRITURA REAL DE LA FICHA DE 380 CAMPOS
 * ════════════════════════════════════════════════════════════════════════════
 * Persiste la ficha editable del proveedor en PostgreSQL 16 (`ProviderProfileField`,
 * `ProviderPaymentMethod`, `ProviderPaymentRequestLog`) con estas garantías:
 *   1. SÓLO se aceptan claves presentes en el catálogo SSOT de la categoría
 *      (`provider-field-catalog.ts`). Una clave inventada se rechaza, no se guarda.
 *   2. `@@unique([providerSlug, fieldKey])` ⇒ N guardados = 1 fila (idempotente).
 *   3. El valor se normaliza antes de escribir (booleanos `true|false`, listas por
 *      salto de línea, decimales con punto, longitud acotada).
 *   4. Los datos de cobro JAMÁS salen de aquí hacia la ficha pública: la ruta
 *      pública sólo los devuelve DESPUÉS de registrar un lead (`recordPaymentRequest`).
 *   5. Sólo servidor: importa Prisma. Nunca desde un Client Component.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from '@/lib/prisma';
import {
  buildProviderFieldSet,
  groupProviderFields,
  resolveProviderFieldCategory,
  type ProviderFieldCategoryKey,
  type ProviderFieldDef,
} from '@/lib/providers/provider-field-catalog';

const HARD_MAX_VALUE_CHARS = 8000;

export const PROVIDER_PAYMENT_METHOD_KINDS = [
  'bizum',
  'transferencia',
  'tarjeta',
  'paypal',
  'efectivo',
  'cripto_btc',
  'cripto_eth',
  'cripto_usdt',
  'otro',
] as const;

export type ProviderPaymentMethodKind = (typeof PROVIDER_PAYMENT_METHOD_KINDS)[number];

export interface ProviderPaymentMethodView {
  readonly kind: string;
  readonly label: string;
  readonly holder: string | null;
  /** Dato de cobro. Sólo visible en el panel admin autenticado. */
  readonly reference: string | null;
  readonly instructions: string | null;
  readonly isActive: boolean;
  readonly requiresLeadCapture: boolean;
  readonly sortOrder: number;
}

export interface ProviderProfileSnapshot {
  readonly providerSlug: string;
  readonly category: ProviderFieldCategoryKey;
  readonly values: Readonly<Record<string, string>>;
  /** Campos con valor no vacío. */
  readonly filled: number;
  /** Total de campos editables de la categoría (≥ 300). */
  readonly total: number;
  readonly paymentMethods: readonly ProviderPaymentMethodView[];
}

export interface SaveProfileResult {
  readonly written: number;
  readonly rejected: readonly string[];
  readonly filled: number;
  readonly total: number;
}

/** Slug/llave canónica del proveedor (`v-57523`, `otzarreta-finca`, ...). */
export function normalizeProviderSlug(value: unknown): string {
  const raw: string = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (raw.length === 0 || raw.length > 120) {
    throw new Error('PROVIDER_SLUG_INVALID');
  }
  return raw;
}

function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}

function normalizeDecimal(value: string): string {
  const cleaned = value.replace(/[\s€]/g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? String(parsed) : '';
}

/** Normaliza el valor ANTES de tocar la base de datos. */
export function normalizeFieldValue(def: ProviderFieldDef, raw: unknown): string {
  const text = stripControlChars(String(raw ?? '')).trim();
  if (text.length === 0) return '';

  switch (def.type) {
    case 'boolean': {
      const lowered = text.toLowerCase();
      if (['true', '1', 'si', 'sí', 'yes', 'on'].includes(lowered)) return 'true';
      if (['false', '0', 'no', 'off'].includes(lowered)) return 'false';
      return '';
    }
    case 'number':
    case 'currency':
    case 'percent':
      return normalizeDecimal(text);
    case 'list': {
      const items = text
        .split(/\r?\n|;/)
        .map((item) => stripControlChars(item).trim())
        .filter((item) => item.length > 0);
      return items.join('\n').slice(0, HARD_MAX_VALUE_CHARS);
    }
    case 'textarea':
      return text.slice(0, Math.min(def.maxLength ?? 6000, HARD_MAX_VALUE_CHARS));
    default:
      return text.slice(0, Math.min(def.maxLength ?? 400, HARD_MAX_VALUE_CHARS));
  }
}


/** Lee la ficha completa (valores + métodos de cobro) de un proveedor. */
export async function loadProviderProfile(
  providerSlugInput: unknown,
  categoryInput: unknown,
): Promise<ProviderProfileSnapshot> {
  const providerSlug = normalizeProviderSlug(providerSlugInput);
  const category = resolveProviderFieldCategory(categoryInput);
  const fieldSet = buildProviderFieldSet(category);

  const [rows, paymentRows] = await Promise.all([
    prisma.providerProfileField.findMany({
      where: { providerSlug },
      select: { fieldKey: true, valueText: true },
    }),
    prisma.providerPaymentMethod.findMany({
      where: { providerSlug },
      orderBy: [{ sortOrder: 'asc' }, { kind: 'asc' }],
      select: {
        kind: true,
        label: true,
        holder: true,
        reference: true,
        instructions: true,
        isActive: true,
        requiresLeadCapture: true,
        sortOrder: true,
      },
    }),
  ]);

  const validKeys = new Set(fieldSet.map((def) => def.key));
  const values: Record<string, string> = {};
  for (const row of rows) {
    if (!validKeys.has(row.fieldKey)) continue;
    if (row.valueText.trim().length === 0) continue;
    values[row.fieldKey] = row.valueText;
  }

  return {
    providerSlug,
    category,
    values,
    filled: Object.keys(values).length,
    total: fieldSet.length,
    paymentMethods: paymentRows.map((row) => ({
      kind: row.kind,
      label: row.label,
      holder: row.holder,
      reference: row.reference,
      instructions: row.instructions,
      isActive: row.isActive,
      requiresLeadCapture: row.requiresLeadCapture,
      sortOrder: row.sortOrder,
    })),
  };
}

/**
 * Upsert masivo de campos de la ficha. Idempotente: la MISMA entrada produce la
 * MISMA fila. Un valor vacío BORRA el campo (no deja filas fantasma).
 */
export async function saveProviderProfileValues(args: {
  providerSlug: unknown;
  category: unknown;
  values: Readonly<Record<string, unknown>>;
  updatedBy: string;
}): Promise<SaveProfileResult> {
  const providerSlug = normalizeProviderSlug(args.providerSlug);
  const category = resolveProviderFieldCategory(args.category);
  const fieldSet = buildProviderFieldSet(category);
  const total = fieldSet.length;
  const updatedBy = args.updatedBy.trim().slice(0, 120) || 'admin';

  const rejected: string[] = [];
  const prepared: { fieldKey: string; valueText: string }[] = [];

  for (const [rawKey, rawValue] of Object.entries(args.values)) {
    const def = fieldSet.find((candidate) => candidate.key === rawKey);
    if (def === undefined) {
      rejected.push(rawKey);
      continue;
    }
    prepared.push({ fieldKey: def.key, valueText: normalizeFieldValue(def, rawValue) });
  }

  const toWrite = prepared.filter((entry) => entry.valueText.length > 0);
  const toClear = prepared
    .filter((entry) => entry.valueText.length === 0)
    .map((entry) => entry.fieldKey);

  await prisma.$transaction([
    ...toWrite.map((entry) =>
      prisma.providerProfileField.upsert({
        where: { uniq_provider_field: { providerSlug, fieldKey: entry.fieldKey } },
        create: {
          providerSlug,
          fieldKey: entry.fieldKey,
          valueText: entry.valueText,
          category,
          updatedBy,
        },
        update: { valueText: entry.valueText, category, updatedBy },
      }),
    ),
    prisma.providerProfileField.deleteMany({
      where: { providerSlug, fieldKey: { in: toClear } },
    }),
  ]);

  const filled = await prisma.providerProfileField.count({
    where: { providerSlug, valueText: { not: '' } },
  });

  return { written: toWrite.length, rejected, filled, total };
}

/** Valida el medio de cobro declarado (nunca se guarda un `kind` inventado). */
function requirePaymentKind(value: unknown): ProviderPaymentMethodKind {
  const kind = String(value ?? '').trim().toLowerCase();
  const found = PROVIDER_PAYMENT_METHOD_KINDS.find((candidate) => candidate === kind);
  if (found === undefined) throw new Error('PAYMENT_KIND_INVALID');
  return found;
}

/** Crea o actualiza un método de cobro (idempotente por `(providerSlug, kind)`). */
export async function upsertProviderPaymentMethod(args: {
  providerSlug: unknown;
  kind: unknown;
  label: unknown;
  holder?: unknown;
  reference?: unknown;
  instructions?: unknown;
  isActive?: boolean;
  requiresLeadCapture?: boolean;
  sortOrder?: number;
  updatedBy: string;
}): Promise<ProviderPaymentMethodView> {
  const providerSlug = normalizeProviderSlug(args.providerSlug);
  const kind = requirePaymentKind(args.kind);
  const label = String(args.label ?? '').trim().slice(0, 80);
  if (label.length === 0) throw new Error('PAYMENT_LABEL_REQUIRED');

  const data = {
    label,
    holder: args.holder === undefined ? null : String(args.holder).trim().slice(0, 160) || null,
    reference:
      args.reference === undefined ? null : stripControlChars(String(args.reference)).trim().slice(0, 400) || null,
    instructions:
      args.instructions === undefined
        ? null
        : stripControlChars(String(args.instructions)).trim().slice(0, 2000) || null,
    isActive: args.isActive ?? true,
    requiresLeadCapture: args.requiresLeadCapture ?? true,
    sortOrder: Number.isFinite(args.sortOrder) ? Number(args.sortOrder) : 0,
    updatedBy: args.updatedBy.trim().slice(0, 120) || 'admin',
  };

  const row = await prisma.providerPaymentMethod.upsert({
    where: { uniq_provider_payment_kind: { providerSlug, kind } },
    create: { providerSlug, kind, ...data },
    update: data,
  });

  return {
    kind: row.kind,
    label: row.label,
    holder: row.holder,
    reference: row.reference,
    instructions: row.instructions,
    isActive: row.isActive,
    requiresLeadCapture: row.requiresLeadCapture,
    sortOrder: row.sortOrder,
  };
}

/** Activa/desactiva un método de cobro sin borrar el dato de cobro. */
export async function setProviderPaymentMethodActive(args: {
  providerSlug: unknown;
  kind: unknown;
  isActive: boolean;
  updatedBy: string;
}): Promise<number> {
  const providerSlug = normalizeProviderSlug(args.providerSlug);
  const kind = requirePaymentKind(args.kind);
  const result = await prisma.providerPaymentMethod.updateMany({
    where: { providerSlug, kind },
    data: { isActive: args.isActive, updatedBy: args.updatedBy.trim().slice(0, 120) || 'admin' },
  });
  return result.count;
}

/** Elimina un método de cobro. */
export async function deleteProviderPaymentMethod(args: {
  providerSlug: unknown;
  kind: unknown;
}): Promise<number> {
  const providerSlug = normalizeProviderSlug(args.providerSlug);
  const kind = requirePaymentKind(args.kind);
  const result = await prisma.providerPaymentMethod.deleteMany({ where: { providerSlug, kind } });
  return result.count;
}

/**
 * Oferta de cobro visible ANTES de capturar al cliente: tipo + etiqueta.
 * Nunca devuelve `reference` ni `holder`: el dato de cobro solo se entrega
 * con lead registrado (`recordPaymentRequest`).
 */
export interface PublicPaymentMethodOffer {
  readonly kind: string;
  readonly label: string;
  readonly requiresLeadCapture: boolean;
}

export async function listPublicPaymentMethodOffers(
  providerSlugInput: unknown,
): Promise<readonly PublicPaymentMethodOffer[]> {
  const providerSlug = normalizeProviderSlug(providerSlugInput);
  const rows = await prisma.providerPaymentMethod.findMany({
    where: { providerSlug, isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { kind: 'asc' }],
    select: { kind: true, label: true, requiresLeadCapture: true },
  });
  return rows.map((row) => ({
    kind: row.kind,
    label: row.label,
    requiresLeadCapture: row.requiresLeadCapture,
  }));
}

/**
 * Registra la solicitud de datos de cobro de un cliente (0 leads huérfanos) y
 * devuelve SÓLO los métodos activos que exigen captura previa ya cumplida.
 */
export async function recordPaymentRequest(args: {
  providerSlug: unknown;
  clientName: unknown;
  clientPhone: unknown;
  clientEmail?: unknown;
  methodKinds?: readonly string[];
  eventDate?: unknown;
  channel?: unknown;
}): Promise<{
  requestId: string;
  methods: readonly { kind: string; label: string; holder: string | null; reference: string | null; instructions: string | null }[];
}> {
  const providerSlug = normalizeProviderSlug(args.providerSlug);
  const clientName = stripControlChars(String(args.clientName ?? '')).trim().slice(0, 120);
  const clientPhone = stripControlChars(String(args.clientPhone ?? '')).trim().slice(0, 40);
  if (clientName.length < 2) throw new Error('CLIENT_NAME_REQUIRED');
  if (clientPhone.replace(/\D/g, '').length < 9) throw new Error('CLIENT_PHONE_REQUIRED');

  const requested = (args.methodKinds ?? []).map((kind) => requirePaymentKind(kind));
  const methods = await prisma.providerPaymentMethod.findMany({
    where: {
      providerSlug,
      isActive: true,
      ...(requested.length > 0 ? { kind: { in: requested } } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { kind: 'asc' }],
  });

  const row = await prisma.providerPaymentRequestLog.create({
    data: {
      providerSlug,
      clientName,
      clientPhone,
      clientEmail: args.clientEmail === undefined ? null : String(args.clientEmail).trim().slice(0, 160) || null,
      methodKinds: methods.map((method) => method.kind).join(','),
      eventDate: args.eventDate === undefined ? null : String(args.eventDate).trim().slice(0, 40) || null,
      channel: args.channel === undefined ? 'ficha' : String(args.channel).trim().slice(0, 40) || 'ficha',
    },
    select: { id: true },
  });

  return {
    requestId: row.id,
    methods: methods.map((method) => ({
      kind: method.kind,
      label: method.label,
      holder: method.holder,
      reference: method.reference,
      instructions: method.instructions,
    })),
  };
}

/** Marca la solicitud como entregada a n8n (DLQ si falla: queda `false`). */
export async function markPaymentRequestDelivered(requestId: string): Promise<void> {
  await prisma.providerPaymentRequestLog.update({
    where: { id: requestId },
    data: { deliveredN8n: true },
  });
}

// ════════════════════════════════════════════════════════════════════════════
// PROYECCIÓN PÚBLICA — sólo lo que el proveedor marcó publicable
// ════════════════════════════════════════════════════════════════════════════

export interface PublicFieldValue {
  readonly key: string;
  readonly label: string;
  readonly type: string;
  readonly value: string;
  readonly items: readonly string[];
}

export interface PublicProfilePair {
  readonly question: string;
  readonly answer: string;
}

export interface PublicProfileSection {
  readonly id: string;
  readonly title: string;
  /** Pares pregunta/respuesta (sólo grupos `faq` y `objeciones`). */
  readonly pairs: readonly PublicProfilePair[];
  readonly fields: readonly PublicFieldValue[];
}

function toItems(type: string, value: string): readonly string[] {
  if (type !== 'list') return [];
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function buildPairs(
  groupId: string,
  values: ReadonlyMap<string, string>,
): readonly PublicProfilePair[] {
  const prefix = groupId === 'faq' ? 'faq.' : 'obj.';
  const questionSuffix = groupId === 'faq' ? 'pregunta' : 'objecion';
  const pairs: PublicProfilePair[] = [];
  for (let index = 1; index <= 6; index += 1) {
    const question = values.get(`${prefix}${index}.${questionSuffix}`);
    const answer = values.get(`${prefix}${index}.respuesta`);
    if (question === undefined || question.trim().length === 0) continue;
    pairs.push({ question, answer: answer ?? '' });
  }
  return pairs;
}

/**
 * Secciones publicables de la ficha: SÓLO campos `publicVisible` y NO
 * `sensitive` con valor real. Un grupo sin valores no genera sección (cero
 * ficha vacía, cero placeholder). Los grupos sin `publicSection` no salen.
 */
export async function loadPublicProviderProfile(
  providerSlugInput: unknown,
  categoryInput: unknown,
): Promise<readonly PublicProfileSection[]> {
  const providerSlug = normalizeProviderSlug(providerSlugInput);
  const category = resolveProviderFieldCategory(categoryInput);
  const fieldSet = buildProviderFieldSet(category);
  const rows = await prisma.providerProfileField.findMany({
    where: { providerSlug },
    select: { fieldKey: true, valueText: true },
  });

  const values = new Map<string, string>();
  for (const row of rows) {
    const text = row.valueText.trim();
    if (text.length > 0) values.set(row.fieldKey, text);
  }

  const byGroup = new Map<string, PublicFieldValue[]>();
  for (const def of fieldSet) {
    if (def.publicVisible !== true || def.sensitive === true) continue;
    const value = values.get(def.key);
    if (value === undefined) continue;
    if (def.group === 'faq' || def.group === 'objeciones') continue;
    const bucket = byGroup.get(def.group);
    const entry: PublicFieldValue = {
      key: def.key,
      label: def.label,
      type: def.type,
      value,
      items: toItems(def.type, value),
    };
    if (bucket === undefined) byGroup.set(def.group, [entry]);
    else bucket.push(entry);
  }

  const sections: PublicProfileSection[] = [];
  for (const group of groupProviderFields(fieldSet)) {
    if (group.group.publicSection === null) continue;
    const isPairGroup = group.group.id === 'faq' || group.group.id === 'objeciones';
    const pairs = isPairGroup ? buildPairs(group.group.id, values) : [];
    const fields = byGroup.get(group.group.id) ?? [];
    if (pairs.length === 0 && fields.length === 0) continue;
    sections.push({
      id: group.group.id,
      title: group.group.publicSection,
      pairs,
      fields,
    });
  }

  return sections;
}
