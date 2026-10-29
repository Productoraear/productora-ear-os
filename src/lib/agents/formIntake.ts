/**
 * ⚙️ MOTOR DE INGESTA DE FORMULARIOS — PUENTE FORMULARIO → AGENTE → n8n (P0)
 * ----------------------------------------------------------------------------
 * Sustituye el `fetch` ciego por una cascada real dentro de la flota Ω:
 *
 *   1. SANEADO hermético (tipos, longitudes, control chars, `<`/`>` fuera).
 *   2. GROUNDING SSOT: población → km (geo.ts) → cotización (pricing.ts) →
 *      rider acústico (pricing.ts). Nada de precios hardcodeados.
 *   3. CASCADA en `AgentBus`: agente de entrada + especialistas declarados en
 *      `INTAKE_ROUTES`. Cada salto queda en la traza devuelta al navegador.
 *   4. IDEMPOTENCIA: la misma `idempotencyKey` devuelve el mismo `intakeId` y
 *      `duplicate:true` (sin volver a despachar a n8n).
 *   5. LEDGER append-only en `.antigravity/form_intake_ledger.jsonl` con **hash**
 *      del contacto (nunca teléfono/email en claro → RGPD-safe).
 *
 * Coste de red: $0,00. Los agentes despachan a n8n en background (no bloquean).
 * ----------------------------------------------------------------------------
 */
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { createOmegaFleet } from './omegaFleet';
import { computeRider, computeSoloQuote } from './pricing';
import { DEFAULT_DISTANCE_KM, FINCA_DISTANCE_KM, resolveCityDistance } from './geo';
import { INTAKE_ROUTES, isIntakeFormType } from './formIntakeRoutes';
import type { AgentPayload, TraceEntry } from './agentBus';
import type { IntakeRoute, IntakeRouteStep } from './formIntakeRoutes';
import type {
  FormIntakeResult,
  IntakeFields,
  IntakeFormType,
  IntakeNextAction,
  IntakeQuote,
  IntakeStep,
} from './formIntakeTypes';

/** Flota compartida por el proceso (los handlers no guardan estado de request). */
const bus = createOmegaFleet();

const LEDGER_DIR: string = '.antigravity';
const LEDGER_FILE: string = 'form_intake_ledger.jsonl';
const MAX_TEXT_SHORT = 120;
const MAX_MESSAGE = 1200;
const DEDUPE_TTL_MS = 15 * 60_000;
const DEDUPE_MAX_ENTRIES = 256;

type DistanceSource = IntakeQuote['distanceSource'];

interface NormalizedFields {
  readonly clientName: string;
  readonly clientPhone: string;
  readonly clientEmail: string;
  readonly eventDate: string;
  readonly eventLocation: string;
  readonly explicitDistanceKm: number | null;
  readonly pax: number | null;
  readonly budgetEur: number | null;
  readonly endHour: number;
  readonly providerId: string;
  readonly providerName: string;
  readonly category: string;
  readonly company: string;
  readonly taxId: string;
  readonly website: string;
  readonly service: string;
  readonly message: string;
  readonly sourcePath: string;
  readonly locale: string;
  readonly artistName: string;
  readonly discipline: string;
  readonly socialFollowers: number;
  readonly monthlyListeners: number;
  readonly catalogSize: number;
  readonly sessions: number;
}

export type IntakeOutcome =
  | { readonly ok: true; readonly result: FormIntakeResult }
  | {
      readonly ok: false;
      readonly status: number;
      readonly error: string;
      readonly fields: readonly string[];
    };

/* ─────────────────────────── 1. SANEADO HERMÉTICO ─────────────────────────── */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Normaliza texto: fuera control chars y ángulos, colapsa espacios, trunca. */
function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanNumber(value: unknown, min: number, max: number): number | null {
  const parsed: number =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
}

function cleanPhone(value: unknown): string {
  const raw: string = cleanText(value, 32).replace(/[\s\-.()/]/g, '');
  return /^\+?\d{6,20}$/.test(raw) ? raw : '';
}

function cleanEmail(value: unknown): string {
  const raw: string = cleanText(value, 120).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw) ? raw : '';
}

function cleanDate(value: unknown): string {
  const raw: string = cleanText(value, 32);
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return '';
  const stamp: number = Date.parse(raw);
  if (!Number.isFinite(stamp)) return '';
  const year: number = new Date(stamp).getUTCFullYear();
  const current: number = new Date().getUTCFullYear();
  return year >= current - 1 && year <= current + 5 ? raw.slice(0, 10) : '';
}

function cleanIdempotencyKey(value: unknown): string {
  const raw: string = cleanText(value, 64);
  return /^[A-Za-z0-9:_-]{6,64}$/.test(raw) ? raw : '';
}

function normalizeFields(raw: unknown): NormalizedFields {
  const source: Record<string, unknown> = isRecord(raw) ? raw : {};
  return {
    clientName: cleanText(source.clientName, MAX_TEXT_SHORT),
    clientPhone: cleanPhone(source.clientPhone),
    clientEmail: cleanEmail(source.clientEmail),
    eventDate: cleanDate(source.eventDate),
    eventLocation: cleanText(source.eventLocation, MAX_TEXT_SHORT),
    explicitDistanceKm: cleanNumber(source.distanceKm, 0, 5000),
    pax: cleanNumber(source.pax, 0, 50_000),
    budgetEur: cleanNumber(source.budgetEur, 0, 5_000_000),
    endHour: cleanNumber(source.endHour, 0, 23) ?? 23,
    providerId: cleanText(source.providerId, 80),
    providerName: cleanText(source.providerName, MAX_TEXT_SHORT),
    category: cleanText(source.category, 60),
    company: cleanText(source.company, MAX_TEXT_SHORT),
    taxId: cleanText(source.taxId, 20).toUpperCase(),
    website: cleanText(source.website, 160),
    service: cleanText(source.service, 80),
    message: cleanText(source.message, MAX_MESSAGE),
    sourcePath: cleanText(source.sourcePath, 120),
    locale: cleanText(source.locale, 8),
    artistName: cleanText(source.artistName, MAX_TEXT_SHORT),
    discipline: cleanText(source.discipline, 60),
    socialFollowers: cleanNumber(source.socialFollowers, 0, 100_000_000) ?? 0,
    monthlyListeners: cleanNumber(source.monthlyListeners, 0, 100_000_000) ?? 0,
    catalogSize: cleanNumber(source.catalogSize, 0, 100_000) ?? 0,
    sessions: cleanNumber(source.sessions, 1, 52) ?? 1,
  };
}

function requiredValue(field: keyof IntakeFields, fields: NormalizedFields): boolean {
  switch (field) {
    case 'clientName':
      return fields.clientName.length >= 2;
    case 'clientPhone':
      return fields.clientPhone.length > 0;
    case 'clientEmail':
      return fields.clientEmail.length > 0;
    case 'eventDate':
      return fields.eventDate.length > 0;
    case 'eventLocation':
      return fields.eventLocation.length > 0;
    case 'pax':
      return fields.pax !== null && fields.pax > 0;
    case 'providerId':
      return fields.providerId.length > 0;
    case 'taxId':
      return fields.taxId.length > 0;
    default:
      return true;
  }
}

/* ────────────────────── 2. GROUNDING SSOT (km → € → dBA) ───────────────────── */

interface Grounding {
  readonly distanceKm: number;
  readonly distanceSource: DistanceSource;
  readonly city: string | null;
}

function groundDistance(route: IntakeRoute, fields: NormalizedFields): Grounding {
  if (fields.explicitDistanceKm !== null) {
    return { distanceKm: fields.explicitDistanceKm, distanceSource: 'explicit', city: null };
  }
  const cityHit: { city: string; distanceKm: number } | null = fields.eventLocation
    ? resolveCityDistance(fields.eventLocation.toLowerCase())
    : null;
  if (cityHit) return { distanceKm: cityHit.distanceKm, distanceSource: 'city', city: cityHit.city };
  const isVenue: boolean = /finca|boda|recinto|hacienda|masia|masía/i.test(
    `${fields.eventLocation} ${fields.category} ${fields.providerName}`,
  );
  if (isVenue || route.context === 'boda_exterior') {
    return { distanceKm: FINCA_DISTANCE_KM, distanceSource: 'category', city: null };
  }
  return { distanceKm: DEFAULT_DISTANCE_KM, distanceSource: 'default', city: null };
}

function buildQuote(route: IntakeRoute, fields: NormalizedFields, grounding: Grounding): IntakeQuote | null {
  if (!route.quotes) return null;
  const pax: number = fields.pax ?? 1;
  const breakdown = computeSoloQuote(grounding.distanceKm, fields.endHour);
  const rider = computeRider(route.context, pax);
  return {
    distanceKm: grounding.distanceKm,
    distanceSource: grounding.distanceSource,
    city: grounding.city,
    context: route.context,
    base: breakdown.base,
    logistica: breakdown.logistica,
    hotel: breakdown.hotel,
    total: breakdown.total,
    deposito: breakdown.deposito,
    restoTrasDeposito: breakdown.restoTrasDeposito,
    minDba: rider.minDba,
    maxDba: rider.maxDba,
    watts: rider.watts,
  };
}

function scoreIntake(fields: NormalizedFields, grounding: Grounding): number {
  let score = 0;
  if (fields.clientPhone) score += 25;
  if (fields.clientEmail) score += 15;
  if (fields.eventDate) score += 20;
  if (fields.eventLocation) score += 15;
  if (fields.pax !== null) score += 10;
  if (fields.budgetEur !== null) score += 15;
  if (grounding.distanceSource === 'city' || grounding.distanceSource === 'explicit') score += 5;
  return Math.min(100, score);
}

/* ────────────────────────── 3. PAYLOAD Y CASCADA ─────────────────────────── */

function buildPayload(
  intakeId: string,
  route: IntakeRoute,
  fields: NormalizedFields,
  grounding: Grounding,
): AgentPayload {
  const payload: Record<string, string | number | boolean> = {
    intakeId,
    formType: route.formType,
    source: `form:${route.formType}`,
    routeLabel: route.label,
    context: route.context,
    distanceKm: grounding.distanceKm,
    distanceSource: grounding.distanceSource,
    estimatedDistance: grounding.distanceSource === 'category' || grounding.distanceSource === 'default',
    pax: fields.pax ?? 1,
    endHour: fields.endHour,
    sessions: fields.sessions,
    socialFollowers: fields.socialFollowers,
    monthlyListeners: fields.monthlyListeners,
    catalogSize: fields.catalogSize,
  };
  const optional: Readonly<Record<string, string>> = {
    clientName: fields.clientName,
    clientPhone: fields.clientPhone,
    clientEmail: fields.clientEmail,
    eventDate: fields.eventDate,
    eventLocation: fields.eventLocation,
    city: grounding.city ?? '',
    providerId: fields.providerId,
    providerName: fields.providerName,
    category: fields.category,
    company: fields.company,
    taxId: fields.taxId,
    website: fields.website,
    service: fields.service,
    message: fields.message,
    sourcePath: fields.sourcePath,
    locale: fields.locale,
    artistName: fields.artistName,
    discipline: fields.discipline,
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value.length > 0) payload[key] = value;
  }
  if (fields.budgetEur !== null) payload.budgetEur = fields.budgetEur;
  return payload;
}

function toStep(entry: TraceEntry): IntakeStep {
  const agent = entry.message.to;
  const intent = entry.message.intent;
  if (entry.reply) {
    return { agent, intent, ok: entry.reply.ok, summary: cleanText(entry.reply.summary, 240) };
  }
  if (entry.rejected) {
    return { agent, intent, ok: false, summary: `BLOQUEADO POR EL BUS: ${entry.rejected}` };
  }
  return {
    agent,
    intent,
    ok: false,
    summary: `SIN RESPUESTA: ${cleanText(entry.error ?? 'UNKNOWN', 120)}`,
  };
}

async function runCascade(
  route: IntakeRoute,
  payload: AgentPayload,
  intakeId: string,
): Promise<readonly IntakeStep[]> {
  const steps: IntakeStep[] = [];
  const hops: readonly IntakeRouteStep[] = [
    { agent: route.entryAgent, intent: route.entryIntent },
    ...route.chain,
  ];
  for (const hop of hops) {
    const trace: TraceEntry[] = await bus.send(
      'omni-supervisor-daemon',
      hop.agent,
      hop.intent,
      payload,
      intakeId,
    );
    for (const entry of trace) steps.push(toStep(entry));
  }
  return steps;
}

/* ──────────────────────────── 4. IDEMPOTENCIA ────────────────────────────── */

interface CacheEntry {
  readonly result: FormIntakeResult;
  readonly at: number;
}

const recentIntakes = new Map<string, CacheEntry>();

function readCache(key: string): FormIntakeResult | null {
  const hit: CacheEntry | undefined = recentIntakes.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > DEDUPE_TTL_MS) {
    recentIntakes.delete(key);
    return null;
  }
  return hit.result;
}

function writeCache(key: string, result: FormIntakeResult): void {
  if (recentIntakes.size >= DEDUPE_MAX_ENTRIES) {
    const now: number = Date.now();
    for (const [cacheKey, entry] of recentIntakes) {
      if (now - entry.at > DEDUPE_TTL_MS) recentIntakes.delete(cacheKey);
    }
    if (recentIntakes.size >= DEDUPE_MAX_ENTRIES) {
      const oldest: string | undefined = recentIntakes.keys().next().value;
      if (oldest !== undefined) recentIntakes.delete(oldest);
    }
  }
  recentIntakes.set(key, { result, at: Date.now() });
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/* ───────────────────────────── 5. LEDGER (RGPD) ──────────────────────────── */

interface LedgerEntry {
  readonly at: string;
  readonly intakeId: string;
  readonly formType: IntakeFormType;
  readonly qualified: boolean;
  readonly score: number;
  readonly agentUsed: string;
  readonly agents: readonly string[];
  readonly distanceKm: number | null;
  readonly totalEur: number | null;
  readonly sourcePath: string;
  /** SHA-256 truncado del contacto: trazabilidad sin PII en claro. */
  readonly contactHash: string;
}

function ledgerWrite(entry: LedgerEntry): boolean {
  try {
    const dir: string = path.join(process.cwd(), LEDGER_DIR);
    mkdirSync(dir, { recursive: true });
    appendFileSync(path.join(dir, LEDGER_FILE), `${JSON.stringify(entry)}\n`, { encoding: 'utf8' });
    return true;
  } catch {
    return false;
  }
}

/* ──────────────────────────── 6. ACCIÓN DE CIERRE ────────────────────────── */

function whatsappHref(): string {
  return `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;
}

function formatEur(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

function nextActionFor(
  route: IntakeRoute,
  quote: IntakeQuote | null,
  qualified: boolean,
): IntakeNextAction {
  if (route.quotes && quote && qualified) {
    return {
      kind: 'stripe',
      label: `Bloquear la fecha con depósito de ${formatEur(quote.deposito)} € (100% deducible)`,
      href: '/reservar/solista',
    };
  }
  if (route.formType === 'provider_claim') {
    return { kind: 'whatsapp', label: 'Acelerar la verificación con producción', href: whatsappHref() };
  }
  return { kind: 'whatsapp', label: 'Hablar con producción por WhatsApp', href: whatsappHref() };
}

/* ───────────────────────────── 7. ENTRADA PÚBLICA ────────────────────────── */

type NormalizedRequest =
  | {
      readonly ok: true;
      readonly formType: IntakeFormType;
      readonly route: IntakeRoute;
      readonly fields: NormalizedFields;
      readonly idempotencyKey: string;
    }
  | {
      readonly ok: false;
      readonly status: number;
      readonly error: string;
      readonly fields: readonly string[];
    };

function normalizeIntake(raw: unknown): NormalizedRequest {
  if (!isRecord(raw)) {
    return { ok: false, status: 400, error: 'Cuerpo de la petición inválido.', fields: [] };
  }
  if (!isIntakeFormType(raw.formType)) {
    return {
      ok: false,
      status: 422,
      error: 'Tipo de formulario no reconocido por la flota.',
      fields: ['formType'],
    };
  }
  const formType: IntakeFormType = raw.formType;
  const route: IntakeRoute = INTAKE_ROUTES[formType];
  const fields: NormalizedFields = normalizeFields(raw.fields);
  const missing: string[] = route.requiredFields.filter(
    (field: keyof IntakeFields): boolean => !requiredValue(field, fields),
  );
  if (missing.length > 0) {
    return {
      ok: false,
      status: 422,
      error: 'Faltan datos obligatorios para cualificar la solicitud.',
      fields: missing,
    };
  }
  return { ok: true, formType, route, fields, idempotencyKey: cleanIdempotencyKey(raw.idempotencyKey) };
}

/**
 * Procesa un formulario completo: saneado → SSOT → flota → idempotencia → ledger.
 * Nunca lanza: cualquier fallo se devuelve como `{ ok:false }` tipado.
 */
export async function runFormIntake(raw: unknown): Promise<IntakeOutcome> {
  const normalized: NormalizedRequest = normalizeIntake(raw);
  if (!normalized.ok) {
    return { ok: false, status: normalized.status, error: normalized.error, fields: normalized.fields };
  }

  const { formType, route, fields, idempotencyKey } = normalized;
  const grounding: Grounding = groundDistance(route, fields);
  const contactHash: string = sha256(`${fields.clientPhone}|${fields.clientEmail}`).slice(0, 32);
  const contentHash: string = sha256(
    [
      formType,
      contactHash,
      fields.eventDate,
      fields.providerId,
      fields.eventLocation,
      fields.message,
      fields.sourcePath,
    ].join('|'),
  );
  const intakeId: string = idempotencyKey
    ? `fi_${sha256(`${formType}|${idempotencyKey}`).slice(0, 21)}`
    : `fi_${contentHash.slice(0, 21)}`;
  const dedupeKey: string = idempotencyKey
    ? `${formType}|key|${idempotencyKey}`
    : `${formType}|content|${contentHash}`;

  const cached: FormIntakeResult | null = readCache(dedupeKey);
  if (cached) return { ok: true, result: { ...cached, duplicate: true } };

  try {
    const quote: IntakeQuote | null = buildQuote(route, fields, grounding);
    const score: number = scoreIntake(fields, grounding);
    const qualified: boolean = score >= 50 && Boolean(fields.clientPhone || fields.clientEmail);
    const payload: AgentPayload = buildPayload(intakeId, route, fields, grounding);
    const steps: readonly IntakeStep[] = await runCascade(route, payload, intakeId);
    const timestamp: string = new Date().toISOString();

    const ledgered: boolean = ledgerWrite({
      at: timestamp,
      intakeId,
      formType,
      qualified,
      score,
      agentUsed: route.entryAgent,
      agents: steps.map((step: IntakeStep): string => step.agent),
      distanceKm: quote ? quote.distanceKm : null,
      totalEur: quote ? quote.total : null,
      sourcePath: fields.sourcePath,
      contactHash,
    });

    const result: FormIntakeResult = {
      intakeId,
      formType,
      qualified,
      score,
      agentUsed: route.entryAgent,
      headline: route.headline,
      steps,
      quote,
      nextAction: nextActionFor(route, quote, qualified),
      duplicate: false,
      ledgered,
      timestamp,
    };

    writeCache(dedupeKey, result);
    return { ok: true, result };
  } catch {
    return {
      ok: false,
      status: 503,
      error: 'La flota no pudo procesar la solicitud. Reintenta o escríbenos por WhatsApp.',
      fields: [],
    };
  }
}

/** Censo de rutas para `GET /api/agents/intake` (diagnóstico y auditoría). */
export function listIntakeRoutes(): readonly {
  readonly formType: IntakeFormType;
  readonly label: string;
  readonly entryAgent: string;
  readonly chain: readonly string[];
  readonly quotes: boolean;
}[] {
  return Object.values(INTAKE_ROUTES).map((route: IntakeRoute) => ({
    formType: route.formType,
    label: route.label,
    entryAgent: route.entryAgent,
    chain: route.chain.map((step: IntakeRouteStep): string => step.agent),
    quotes: route.quotes,
  }));
}
