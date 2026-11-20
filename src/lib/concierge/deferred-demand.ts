/**
 * ════════════════════════════════════════════════════════════════════════════
 * LIBRETA DE DEMANDA DIFERIDA — CAPTURA CONCÉNTRICA Y REPLIEGUE POST-ANCLA
 * ════════════════════════════════════════════════════════════════════════════
 * Problema de negocio: en la ficha de un proveedor (una finca, un catering) el
 * cliente pide un servicio AJENO (fotógrafo, DJ, autobús). Si el agente ignora
 * la petición, se pierde la venta; si la persigue antes del ancla, distrae al
 * cliente de la decisión que sí cierra (fecha + propuesta principal). La
 * conversión es CONCÉNTRICA: primero el ancla, después el satélite.
 *
 * Dos motores en este módulo:
 *   1. EXTRACCIÓN (pura, sin I/O): `detectDeferredDemand` / `normalizeDemandPrompt`
 *      → cero red, cero DB, testeable en arnés con Exit Code medido.
 *   2. PERSISTENCIA (DB): `stashDeferredDemand` / `getStashedDemands` /
 *      `replenishAfterAnchor` sobre `LeadDeferredDemand` (Prisma, INV-20
 *      `select` quirúrgico).
 *
 * INVARIANTES:
 *   · INV-14 / `redactPii`: el prompt se redacta ANTES de tocar la base de datos
 *     (email, DNI/NIE, IBAN fuera) y se trunca a `MAX_DEMAND_PROMPT_CHARS`.
 *   · Idempotencia de turno: la clave es `@@unique([sessionId, providerId,
 *     category, promptFingerprint])`; repetir la misma petición reutiliza la fila
 *     (`created:false`) y NO se incrementa dos veces.
 *   · AF-1 / AF-5: si la base de datos no está disponible, la herramienta
 *     devuelve `mode:"SIMULADO"` + `persisted:false`. NUNCA `ok:true` fingiendo
 *     una escritura. Cero `ok:true` sin fila confirmada.
 *   · Cero PII en logs: solo se registran `id`, `category` y el motivo.
 *
 * MÓDULO DE SERVIDOR (Prisma). No importar desde Client Components.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';

import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { redactPii } from '@/lib/mcp/concierge-policy';
import { classifyDbFailure } from '@/lib/db/dbFailureClassifier';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Vocabulario CERRADO (SEC-4: cero cadenas libres hacia la base de datos)     */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Gremios lógicos que puede pedir un cliente como servicio satélite. */
export const DEFERRED_DEMAND_CATEGORIES = ['MUSIC', 'GASTRO_EXTRA', 'PHOTO', 'TRANSPORT', 'DECORATION'] as const;

export type DeferredDemandCategory = (typeof DEFERRED_DEMAND_CATEGORIES)[number];

/** Ciclo de vida de la libreta: nace STASHED y solo el ancla la presenta. */
export const DEFERRED_DEMAND_STATUSES = ['STASHED', 'PRESENTED', 'CONVERTED', 'DISMISSED'] as const;

export type DeferredDemandStatus = (typeof DEFERRED_DEMAND_STATUSES)[number];

/**
 * NORMALIZA EL CÓDIGO DE UN FALLO DE BASE DE DATOS (coherencia AF-1).
 *
 * Por qué existe: `PrismaClientInitializationError` real trae `code` y
 * `errorCode` en `undefined` — el motor ya no emite `P1001` cuando el host no
 * responde. Consecuencia medida: `classifyDbFailure` deducía
 * `kind:"DB_UNREACHABLE"` (correcto) pero `code:"UNKNOWN"` (inútil), y una
 * telemetría que dice «no persistido · UNKNOWN» no permite remediar nada.
 *
 * Regla: si el código de máquina es `UNKNOWN`, se publica la NATURALEZA
 * deducida (`DB_UNREACHABLE`, `DB_SCHEMA_MISSING`...). Si el motor sí emitió un
 * código (`P2021`, `28P01`, `P2003`...), ese código MANDA: es el que el
 * operador puede buscar en la documentación.
 *
 * Cero datos personales: solo se copia el enum de naturaleza, jamás el mensaje.
 */
export function resolveDbFailureCode(error: unknown): string {
  const report = classifyDbFailure(error);
  const rawCode: string =
    typeof (error as { code?: unknown }).code === 'string' ? String((error as { code?: unknown }).code) : report.code;
  if (rawCode.trim().length > 0 && rawCode !== 'UNKNOWN') return rawCode;
  return report.kind === 'DB_UNKNOWN' ? 'UNKNOWN' : report.kind;
}

export function isDeferredDemandCategory(value: unknown): value is DeferredDemandCategory {
  return typeof value === 'string' && (DEFERRED_DEMAND_CATEGORIES as readonly string[]).includes(value);
}

/** Tope de caracteres del deseo guardado: corta volcados y payload bloat. */
export const MAX_DEMAND_PROMPT_CHARS = 400;

/** Tope de peticiones devueltas por repliegue: el agente no puede enumerar 200. */
export const MAX_DEFERRED_DEMANDS_RETURNED = 12;

/** Etiqueta humana de cada gremio para el guion del Maître (cero jerga técnica). */
export const DEFERRED_DEMAND_LABELS: Readonly<Record<DeferredDemandCategory, string>> = Object.freeze({
  MUSIC: 'música en directo o DJ',
  GASTRO_EXTRA: 'gastronomía complementaria (tartas, barra libre, aperitivos)',
  PHOTO: 'fotografía y vídeo',
  TRANSPORT: 'transporte de invitados',
  DECORATION: 'decoración y flores',
});


/* ──────────────────────────────────────────────────────────────────────────── */
/* 1 · EXTRACCIÓN PURA (sin I/O)                                              */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Patrones de necesidad satélite. El orden importa: la primera coincidencia gana
 * y decide el gremio. Todos son sustantivos de SERVICIO, no de producto: así
 * «chuletón de 1 kg» (menú del ancla) no se confunde con una petición ajena.
 */
const CATEGORY_PATTERNS: ReadonlyArray<{ readonly category: DeferredDemandCategory; readonly pattern: RegExp }> =
  Object.freeze([
    {
      category: 'PHOTO',
      pattern:
        /\b(fot[oó]graf[oa]s?|fotograf[ií]as?|v[ií]deo|v[ií]deos|vide[oó]graf[oa]s?|vide[oó]grafo|fot[oó]mat[oó]n|drone|c[aá]mara|book\s+de\s+boda)\b/,
    },
    {
      category: 'MUSIC',
      pattern:
        /\b(dj|djs|disco\s*m[oó]vil|disc[oó]movil|mariachi|mariachis|orquesta|grupo\s+musical|m[uú]sica\s+en\s+directo|violinista|cuarteto|saxofonista|pianista|solista|tenor|cantante)\b/,
    },
    {
      category: 'TRANSPORT',
      pattern:
        /\b(autob[uú]s|autobuses|autocar|autocares|microb[uú]s|microbuses|traslado\s+de\s+invitados|transporte\s+de\s+invitados|limusina|guagua)\b/,
    },
    {
      category: 'DECORATION',
      pattern:
        /\b(decoraci[oó]n|florister[ií]a|florista|flores|centros\s+de\s+mesa|iluminaci[oó]n\s+ambiental|arco\s+floral|escenograf[ií]a)\b/,
    },
    {
      category: 'GASTRO_EXTRA',
      pattern:
        /\b(tarta|tartas|tarta\s+de\s+boda|barra\s+libre|open\s+bar|c[oó]ctel(?:es)?\s+de\s+bienvenida|aperitivos|picoteo|food\s*truck|mesa\s+dulce|mesa\s+de\s+quesos|chocolater[ií]a|pasteler[ií]a)\b/,
    },
  ]);

/**
 * Una frase es DEMANDA SATÉLITE solo si nombra un gremio AJENO. Devuelve el
 * gremio detectado o `null`. La primera coincidencia gana (orden declarado).
 */
export function detectDeferredCategory(message: string): DeferredDemandCategory | null {
  if (typeof message !== 'string') return null;
  const text: string = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const { category, pattern } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category;
  }
  return null;
}

/**
 * Normaliza el deseo para el fingerprint: minúsculas, sin acentos, espacios
 * colapsados y sin puntuación. Dos turnos idénticos ⇒ mismo hash ⇒ misma fila.
 */
export function normalizeDemandPrompt(prompt: string): string {
  return String(prompt ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_DEMAND_PROMPT_CHARS);
}

/** SHA-256 del prompt normalizado: clave de idempotencia junto a `sessionId`. */
export function demandFingerprint(prompt: string): string {
  return createHash('sha256').update(normalizeDemandPrompt(prompt)).digest('hex');
}

export interface DeferredDemandDetection {
  readonly detected: boolean;
  readonly category: DeferredDemandCategory | null;
  readonly label: string | null;
  /** Necesidad redactada de PII y truncada. Cadena vacía si no se detecta. */
  readonly sanitizedPrompt: string;
  readonly fingerprint: string | null;
}

/**
 * Detección completa de un turno: gremio + prompt seguro + fingerprint.
 * Función PURA: el arnés de certificación la ejecuta sin base de datos.
 */
export function detectDeferredDemand(message: string): DeferredDemandDetection {
  const category: DeferredDemandCategory | null = detectDeferredCategory(message);
  if (category === null) {
    return { detected: false, category: null, label: null, sanitizedPrompt: '', fingerprint: null };
  }
  const sanitizedPrompt: string = redactPii(String(message ?? '').trim()).slice(0, MAX_DEMAND_PROMPT_CHARS);
  return {
    detected: true,
    category,
    label: DEFERRED_DEMAND_LABELS[category],
    sanitizedPrompt,
    fingerprint: demandFingerprint(sanitizedPrompt),
  };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* 2 · PERSISTENCIA (DB)                                                      */
/* ──────────────────────────────────────────────────────────────────────────── */

export interface StashDeferredDemandInput {
  readonly sessionId: string;
  readonly providerId: string;
  readonly category: DeferredDemandCategory;
  readonly prompt: string;
}

export interface DeferredDemandRecord {
  readonly id: string;
  readonly sessionId: string;
  readonly providerId: string;
  readonly category: string;
  readonly rawPrompt: string;
  readonly status: string;
  readonly presentedAt: string | null;
  readonly createdAt: string;
}

export type StashOutcome =
  | {
      readonly ok: true;
      readonly persisted: true;
      readonly mode: 'REAL';
      /** `true` si la fila es nueva; `false` si ya existía (idempotencia). */
      readonly created: boolean;
      readonly record: DeferredDemandRecord;
    }
  | {
      readonly ok: false;
      readonly persisted: false;
      readonly mode: 'SIMULADO';
      readonly created: false;
      readonly record: null;
      /** Código accionable (`DB_UNREACHABLE`, `P2021`, `PROVIDER_NOT_FOUND`...). */
      readonly errorCode: string;
      readonly error: string;
    };

/** `select` quirúrgico reutilizado por todas las lecturas (INV-20). */
const DEFERRED_DEMAND_SELECT = {
  id: true,
  sessionId: true,
  providerId: true,
  category: true,
  rawPrompt: true,
  status: true,
  presentedAt: true,
  createdAt: true,
} as const satisfies Prisma.LeadDeferredDemandSelect;

type DeferredDemandRow = Prisma.LeadDeferredDemandGetPayload<{ select: typeof DEFERRED_DEMAND_SELECT }>;

function toRecord(row: DeferredDemandRow): DeferredDemandRecord {
  return {
    id: row.id,
    sessionId: row.sessionId,
    providerId: row.providerId,
    category: row.category,
    rawPrompt: row.rawPrompt,
    status: row.status,
    presentedAt: row.presentedAt === null ? null : row.presentedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * Guarda la necesidad complementaria. Silencioso por diseño: si falla, NO rompe
 * la conversación, pero lo DECLARA (`mode:"SIMULADO"`, `persisted:false`).
 *
 * Idempotencia: primero busca la fila por la clave natural (las 4 columnas del
 * `@@unique`); si no existe, crea. N turnos idénticos ⇒ 1 fila.
 * Un `providerId` inexistente devuelve `errorCode:"PROVIDER_NOT_FOUND"` en
 * lugar de propagar el `P2003` crudo.
 */
export async function stashDeferredDemand(input: StashDeferredDemandInput): Promise<StashOutcome> {
  const prompt: string = redactPii(String(input.prompt ?? '').trim()).slice(0, MAX_DEMAND_PROMPT_CHARS);
  if (prompt.length === 0) {
    return {
      ok: false,
      persisted: false,
      mode: 'SIMULADO',
      created: false,
      record: null,
      errorCode: 'EMPTY_PROMPT',
      error: 'La petición está vacía: no hay necesidad que aplazar.',
    };
  }

  const promptFingerprint: string = demandFingerprint(prompt);

  try {
    const existing = await prisma.leadDeferredDemand.findUnique({
      where: {
        uniq_deferred_demand_turn: {
          sessionId: input.sessionId,
          providerId: input.providerId,
          category: input.category,
          promptFingerprint,
        },
      },
      select: DEFERRED_DEMAND_SELECT,
    });

    if (existing !== null) {
      return { ok: true, persisted: true, mode: 'REAL', created: false, record: toRecord(existing) };
    }

    const created = await prisma.leadDeferredDemand.create({
      data: {
        sessionId: input.sessionId,
        providerId: input.providerId,
        category: input.category,
        rawPrompt: prompt,
        promptFingerprint,
        status: 'STASHED',
      },
      select: DEFERRED_DEMAND_SELECT,
    });

    return { ok: true, persisted: true, mode: 'REAL', created: true, record: toRecord(created) };
  } catch (error: unknown) {
    const report = classifyDbFailure(error);
    const rawCode: string = resolveDbFailureCode(error);
    const errorCode: string = rawCode === 'P2003' ? 'PROVIDER_NOT_FOUND' : rawCode;
    // INV-14: solo identificadores y el código de fallo. Cero datos del cliente.
    console.warn(
      `[DEFERRED_DEMAND] stash no persistido · provider=${input.providerId} · code=${errorCode} · kind=${report.kind}`,
    );
    return {
      ok: false,
      persisted: false,
      mode: 'SIMULADO',
      created: false,
      record: null,
      errorCode,
      error:
        errorCode === 'PROVIDER_NOT_FOUND'
          ? 'La entidad indicada no existe: la petición no se pudo vincular.'
          : `Persistencia no disponible (${report.kind}).`,
    };
  }
}

export type StashedDemandsRead =
  | {
      readonly ok: true;
      readonly source: 'live';
      readonly mode: 'REAL';
      readonly demands: readonly DeferredDemandRecord[];
    }
  | {
      readonly ok: false;
      readonly source: 'static';
      readonly mode: 'SIMULADO';
      readonly demands: readonly DeferredDemandRecord[];
      readonly errorCode: string;
      readonly error: string;
    };

/**
 * Devuelve los deseos aplazados de una sesión (opcionalmente acotados a una
 * entidad). SOLO LECTURA: no marca nada como presentado. El repliegue real se
 * sella en `replenishAfterAnchor` para que `presentedAt` sea prueba de cobro.
 */
export async function getStashedDemands(
  sessionId: string,
  providerId?: string,
  limit: number = MAX_DEFERRED_DEMANDS_RETURNED,
): Promise<StashedDemandsRead> {
  const take: number = Math.min(Math.max(Math.trunc(limit), 1), MAX_DEFERRED_DEMANDS_RETURNED);
  try {
    const rows = await prisma.leadDeferredDemand.findMany({
      where: {
        sessionId,
        ...(providerId !== undefined ? { providerId } : {}),
        status: { in: ['STASHED', 'PRESENTED'] },
      },
      select: DEFERRED_DEMAND_SELECT,
      orderBy: { createdAt: 'asc' },
      take,
    });
    return { ok: true, source: 'live', mode: 'REAL', demands: rows.map(toRecord) };
  } catch (error: unknown) {
    const report = classifyDbFailure(error);
    console.warn(`[DEFERRED_DEMAND] lectura no disponible · session=${sessionId.slice(0, 8)} · kind=${report.kind}`);
    return {
      ok: false,
      source: 'static',
      mode: 'SIMULADO',
      demands: [],
      errorCode: resolveDbFailureCode(error),
      error: `Libreta no disponible (${report.kind}).`,
    };
  }
}

export type AnchorReplenishment =
  | {
      readonly ok: true;
      readonly mode: 'REAL';
      readonly presented: readonly DeferredDemandRecord[];
    }
  | {
      readonly ok: false;
      readonly mode: 'SIMULADO';
      readonly presented: readonly DeferredDemandRecord[];
      readonly errorCode: string;
      readonly error: string;
    };

/**
 * REPLIEGUE POST-CONVERSIÓN (FASE 4). Se invoca SOLO cuando el ancla ya está
 * cobrada (`checkout.session.completed` con la fianza). Marca STASHED →
 * PRESENTED, sella `presentedAt`, guarda `anchorSessionId` y devuelve la lista
 * para que el agente abra el diálogo.
 *
 * `updateMany` filtrado por `status:'STASHED'` es idempotente: un reintento de
 * Stripe no duplica la presentación ni resucita peticiones ya convertidas.
 */
export async function replenishAfterAnchor(input: {
  readonly sessionId: string;
  readonly providerId: string;
  readonly anchorSessionId?: string;
}): Promise<AnchorReplenishment> {
  try {
    const pending = await prisma.leadDeferredDemand.findMany({
      where: { sessionId: input.sessionId, providerId: input.providerId, status: 'STASHED' },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
      take: MAX_DEFERRED_DEMANDS_RETURNED,
    });

    if (pending.length === 0) {
      return { ok: true, mode: 'REAL', presented: [] };
    }

    const ids: string[] = pending.map((row: { id: string }) => row.id);

    await prisma.leadDeferredDemand.updateMany({
      where: { id: { in: ids }, status: 'STASHED' },
      data: {
        status: 'PRESENTED',
        presentedAt: new Date(),
        ...(input.anchorSessionId !== undefined ? { anchorSessionId: input.anchorSessionId } : {}),
      },
    });

    const presented = await prisma.leadDeferredDemand.findMany({
      where: { id: { in: ids } },
      select: DEFERRED_DEMAND_SELECT,
      orderBy: { createdAt: 'asc' },
    });

    return { ok: true, mode: 'REAL', presented: presented.map(toRecord) };
  } catch (error: unknown) {
    const report = classifyDbFailure(error);
    console.warn(`[DEFERRED_DEMAND] repliegue no persistido · provider=${input.providerId} · kind=${report.kind}`);
    return {
      ok: false,
      mode: 'SIMULADO',
      presented: [],
      errorCode: resolveDbFailureCode(error),
      error: `Repliegue no disponible (${report.kind}).`,
    };
  }
}

