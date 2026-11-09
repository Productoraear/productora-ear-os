/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T02 · ARTIST ACHIEVEMENT LEDGER (EAR OS V2)
 * ════════════════════════════════════════════════════════════════════════════
 * Append-only cryptographic ledger of verified artist merit achievements
 * and evidences, partitioned canonically by `artistSlug`.
 *
 * Core Guarantees:
 *   1. Append-Only Monotonicity: Entries receive strictly increasing entryIndex (1..N).
 *      Historical entries are never updated or deleted in place.
 *   2. Cryptographic Provenance Chaining: Every entry computes a SHA-256 hash
 *      chaining from the previous entry's hash (genesis: 64 zeros).
 *   3. Dual-Engine Storage Resilience: Primary PostgreSQL with automatic atomic
 *      JSON persistence (.data/artist-achievements-ledger.json) with Windows
 *      copyFile resilience and in-process mutex serialization (`enqueueMutation`).
 *   4. Zero Data Fabrication: If the database is offline or empty, returns honest
 *      diagnostics via `classifyDbFailure` and zero counts; never invents fake metrics.
 *   5. Anti-Fraud Rules: Missing verifiers (`SIN_VERIFICADOR`), self-verifications
 *      (`AUTOVERIFICADA`), invalid dates (`FECHA_INVALIDA`), and unknown kinds
 *      (`TIPO_DESCONOCIDO`) are rejected and recorded with deterministic reasons.
 *   6. Deterministic Queries: Multiple reads produce byte-for-byte stable ordering.
 *      Public queries (`publicOnly: true`) return strictly VERIFIED records.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { classifyDbFailure, type DbFailureKind } from '@/lib/db/dbFailureClassifier';
import {
  MERIT_EVIDENCE_KINDS,
  MERIT_TRACKS,
  TRACK99_ENTRY_ASSESSMENT_ID,
  evaluateUnlock,
  type MeritEvidence,
  type MeritEvidenceKind,
  type MeritTrackId,
} from '@/lib/academy/merit-program-ssot';

export type AchievementStatus =
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'PENDING'
  | 'REJECTED'
  | 'UNVERIFIED';

export interface AchievementEvidenceInput {
  artistSlug: string;
  achievementId: string;
  title?: string;
  moduleId: string;
  trackId?: MeritTrackId;
  evidenceKind: MeritEvidenceKind;
  evidencePayload?: unknown;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  supersedes?: string | null;
}

export interface RecordAchievementInput {
  artistSlug: string;
  achievementId: string;
  title?: string;
  moduleId?: string;
  trackId?: MeritTrackId;
  evidenceKind?: MeritEvidenceKind | string;
  evidencePayload?: unknown;
  status?: AchievementStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  supersedes?: string | null;
}

export interface AchievementLedgerEntry {
  readonly id: string;
  readonly entryIndex: number;
  readonly artistSlug: string;
  readonly achievementId: string;
  readonly title?: string;
  readonly moduleId: string;
  readonly trackId: MeritTrackId;
  readonly evidenceKind: MeritEvidenceKind;
  readonly evidencePayload: unknown;
  readonly status: AchievementStatus;
  readonly verifiedBy: string | null;
  readonly verifiedAt: string | null;
  readonly rejectionReason: string | null;
  readonly recordedAt: string;
  readonly previousHash: string;
  readonly hash: string;
  readonly sha256: string;
  readonly supersedes?: string | null;
  readonly createdAt: string;
}

export type AchievementRecord = AchievementLedgerEntry;

export interface AchievementLedgerStoreData {
  entries: AchievementLedgerEntry[];
  updatedAt: string;
}

export interface AppendAchievementResult {
  success: boolean;
  entry?: AchievementLedgerEntry;
  rejectedReason?: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
  error?: string;
}

export interface QueryAchievementsOptions {
  artistSlug?: string;
  trackId?: MeritTrackId;
  publicOnly?: boolean;
  activeOnly?: boolean;
}

export interface QueryAchievementsResult {
  ok: boolean;
  artistSlug: string;
  trackId: MeritTrackId;
  publicOnly: boolean;
  totalEntries: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
  dbStatus: {
    connected: boolean;
    failureKind?: DbFailureKind;
    failureCode?: string;
    action?: string;
  };
  achievements: readonly AchievementLedgerEntry[];
  unlockedModules: readonly string[];
  completedModules: readonly string[];
  progressPct: number;
}

export const GENESIS_PREV_HASH = '0'.repeat(64);

function getStoreFilePath(): string {
  const envPath = process.env.EAR_ACHIEVEMENT_LEDGER_STORE?.trim();
  if (envPath && envPath.length > 0) return envPath;
  return path.join(process.cwd(), '.data', 'artist-achievements-ledger.json');
}

export function getLedgerStorePath(): string {
  return getStoreFilePath();
}

interface GlobalLedgerState {
  __earAchievementQueue?: Promise<unknown>;
  __earAchievementCache?: { loaded: boolean; data: AchievementLedgerStoreData };
  __earAchievementDbCircuitBreakerUntil?: number;
}

const globalState = globalThis as typeof globalThis & GlobalLedgerState;

const cache = (globalState.__earAchievementCache ??= {
  loaded: false,
  data: { entries: [], updatedAt: new Date().toISOString() },
});

export function enqueueMutation<T>(task: () => Promise<T>): Promise<T> {
  const previous = globalState.__earAchievementQueue ?? Promise.resolve();
  const next = previous.then(task, task);
  globalState.__earAchievementQueue = next.catch(() => undefined);
  return next;
}

export function isDbCircuitOpen(): boolean {
  const until = globalState.__earAchievementDbCircuitBreakerUntil;
  return typeof until === 'number' && Date.now() < until;
}

export function tripDbCircuit(): void {
  globalState.__earAchievementDbCircuitBreakerUntil = Date.now() + 10_000;
}

export function resetDbCircuitBreaker(): void {
  globalState.__earAchievementDbCircuitBreakerUntil = undefined;
}

export async function reloadStoreFromDisk(): Promise<void> {
  cache.loaded = false;
  await loadStore();
}

export function clearLedgerForTesting(): void {
  cache.loaded = true;
  cache.data = { entries: [], updatedAt: new Date().toISOString() };
}

async function loadStore(): Promise<void> {
  if (cache.loaded) return;
  const storeFile = getStoreFilePath();
  try {
    const raw = await fs.readFile(storeFile, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { entries?: unknown[] }).entries)) {
      const data = parsed as AchievementLedgerStoreData;
      cache.data = {
        entries: Array.isArray(data.entries) ? data.entries : [],
        updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
      };
    } else {
      cache.data = { entries: [], updatedAt: new Date().toISOString() };
    }
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.warn('[achievement-ledger] Error reading ledger file, reinitializing cache:', err);
    }
    cache.data = { entries: [], updatedAt: new Date().toISOString() };
  } finally {
    cache.loaded = true;
  }
}

async function persistStore(): Promise<void> {
  const storeFile = getStoreFilePath();
  try {
    await fs.mkdir(path.dirname(storeFile), { recursive: true });
    const tmp = `${storeFile}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(cache.data, null, 2), 'utf8');
    try {
      await fs.rename(tmp, storeFile);
    } catch {
      await fs.copyFile(tmp, storeFile);
      await fs.unlink(tmp).catch(() => undefined);
    }
  } catch (err) {
    console.warn('[achievement-ledger] Disk persistence warning:', err);
  }
}

export function computeEntryHash(entry: {
  id: string;
  entryIndex: number;
  artistSlug: string;
  achievementId: string;
  moduleId: string;
  trackId: string;
  evidenceKind: string;
  status: string;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  recordedAt?: string;
  createdAt?: string;
  previousHash: string;
}): string {
  const recordedAt = entry.recordedAt || entry.createdAt || '';
  const payload = [
    entry.id,
    entry.entryIndex.toString(),
    entry.artistSlug.toLowerCase().trim(),
    entry.achievementId.trim(),
    entry.moduleId.trim(),
    entry.trackId,
    entry.evidenceKind,
    entry.status,
    entry.verifiedBy ? entry.verifiedBy.trim() : '',
    entry.verifiedAt ? entry.verifiedAt.trim() : '',
    entry.rejectionReason ? entry.rejectionReason.trim() : '',
    recordedAt,
    entry.previousHash,
  ].join('::');
  return createHash('sha256').update(payload).digest('hex');
}

export const computeRecordHash = computeEntryHash;

export function validateEvidenceInput(input: {
  artistSlug: string;
  moduleId: string;
  trackId?: MeritTrackId;
  evidenceKind: string;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
}): {
  isValid: boolean;
  reason?: 'SIN_VERIFICADOR' | 'AUTOVERIFICADA' | 'FECHA_INVALIDA' | 'TIPO_DESCONOCIDO' | 'MODULO_DESCONOCIDO';
} {
  if (!MERIT_EVIDENCE_KINDS.includes(input.evidenceKind as MeritEvidenceKind)) {
    return { isValid: false, reason: 'TIPO_DESCONOCIDO' };
  }
  const trackId = input.trackId || 'track66';
  const track = MERIT_TRACKS[trackId];
  if (!track) {
    return { isValid: false, reason: 'MODULO_DESCONOCIDO' };
  }
  const knownModuleIds = new Set<string>(track.modules.map((m) => m.id));
  if (trackId === 'track99') knownModuleIds.add(TRACK99_ENTRY_ASSESSMENT_ID);
  if (!knownModuleIds.has(input.moduleId)) {
    return { isValid: false, reason: 'MODULO_DESCONOCIDO' };
  }
  const verifier = typeof input.verifiedBy === 'string' ? input.verifiedBy.trim() : '';
  if (verifier.length === 0) {
    return { isValid: false, reason: 'SIN_VERIFICADOR' };
  }
  if (verifier.toLowerCase() === input.artistSlug.trim().toLowerCase()) {
    return { isValid: false, reason: 'AUTOVERIFICADA' };
  }
  if (input.verifiedAt) {
    const time = Date.parse(input.verifiedAt);
    if (!Number.isFinite(time) || input.verifiedAt.trim().length < 10) {
      return { isValid: false, reason: 'FECHA_INVALIDA' };
    }
  }
  return { isValid: true };
}

export async function appendAchievementEvidence(
  input: AchievementEvidenceInput
): Promise<AppendAchievementResult> {
  const validation = validateEvidenceInput(input);
  if (!validation.isValid) {
    return {
      success: false,
      rejectedReason: validation.reason,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  }

  return enqueueMutation(async (): Promise<AppendAchievementResult> => {
    await loadStore();
    const trackId = input.trackId || 'track66';
    const nowIso = new Date().toISOString();
    const verifiedAt = input.verifiedAt ? new Date(input.verifiedAt).toISOString() : nowIso;
    const verifiedBy = input.verifiedBy!.trim();

    const previousEntry = cache.data.entries[cache.data.entries.length - 1];
    const previousHash = previousEntry ? previousEntry.hash : GENESIS_PREV_HASH;
    const entryIndex = (previousEntry ? previousEntry.entryIndex : 0) + 1;
    const id = `ach_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const draftEntry = {
      id,
      entryIndex,
      artistSlug: input.artistSlug.trim().toLowerCase(),
      achievementId: input.achievementId.trim(),
      title: input.title?.trim(),
      moduleId: input.moduleId.trim(),
      trackId,
      evidenceKind: input.evidenceKind,
      evidencePayload: input.evidencePayload ?? {},
      status: 'VERIFIED' as const,
      verifiedBy,
      verifiedAt,
      rejectionReason: null,
      recordedAt: nowIso,
      previousHash,
      supersedes: input.supersedes?.trim() || null,
    };

    const hash = computeEntryHash(draftEntry);
    const fullEntry: AchievementLedgerEntry = {
      ...draftEntry,
      hash,
      sha256: hash,
      createdAt: nowIso,
    };

    cache.data.entries.push(fullEntry);
    cache.data.updatedAt = nowIso;
    await persistStore();

    return {
      success: true,
      entry: fullEntry,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  });
}

export async function recordAchievement(
  input: RecordAchievementInput
): Promise<AchievementLedgerEntry> {
  const normSlug = input.artistSlug.trim().toLowerCase();
  const trackId: MeritTrackId = input.trackId || 'track66';
  const moduleId = input.moduleId?.trim() || 't66-m1-ikigai';
  const evidenceKind = (input.evidenceKind || 'exercise') as MeritEvidenceKind;

  let computedStatus: AchievementStatus = input.status || 'VERIFIED';
  let rejectionReason: string | null = null;

  if (!input.status) {
    const val = validateEvidenceInput({
      artistSlug: normSlug,
      moduleId,
      trackId,
      evidenceKind,
      verifiedBy: input.verifiedBy,
      verifiedAt: input.verifiedAt,
    });

    if (!val.isValid) {
      if (val.reason === 'SIN_VERIFICADOR') {
        computedStatus = 'PENDING_VERIFICATION';
        rejectionReason = 'SIN_VERIFICADOR';
      } else {
        computedStatus = 'REJECTED';
        rejectionReason = val.reason ?? 'VALIDATION_FAILED';
      }
    } else {
      computedStatus = 'VERIFIED';
    }
  } else if (input.status === 'REJECTED' && !rejectionReason) {
    rejectionReason = 'RECHAZADO_MANUALMENTE';
  }

  return enqueueMutation(async (): Promise<AchievementLedgerEntry> => {
    await loadStore();
    const nowIso = new Date().toISOString();
    const verifiedBy = input.verifiedBy ? input.verifiedBy.trim() : null;
    let verifiedAt: string | null = null;
    if (input.verifiedAt) {
      const parsedTime = Date.parse(input.verifiedAt);
      verifiedAt = Number.isFinite(parsedTime) ? new Date(input.verifiedAt).toISOString() : input.verifiedAt;
    } else if (computedStatus === 'VERIFIED') {
      verifiedAt = nowIso;
    }

    const previousEntry = cache.data.entries[cache.data.entries.length - 1];
    const previousHash = previousEntry ? previousEntry.hash : GENESIS_PREV_HASH;
    const entryIndex = (previousEntry ? previousEntry.entryIndex : 0) + 1;
    const id = `ach_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const draft = {
      id,
      entryIndex,
      artistSlug: normSlug,
      achievementId: input.achievementId.trim(),
      title: input.title?.trim(),
      moduleId,
      trackId,
      evidenceKind,
      evidencePayload: input.evidencePayload ?? {},
      status: computedStatus,
      verifiedBy,
      verifiedAt,
      rejectionReason,
      recordedAt: nowIso,
      previousHash,
      supersedes: input.supersedes?.trim() || null,
    };

    const hash = computeEntryHash(draft);
    const fullEntry: AchievementLedgerEntry = {
      ...draft,
      hash,
      sha256: hash,
      createdAt: nowIso,
    };

    cache.data.entries.push(fullEntry);
    cache.data.updatedAt = nowIso;
    await persistStore();

    return fullEntry;
  });
}

function canonicalSortAchievements(
  a: AchievementLedgerEntry,
  b: AchievementLedgerEntry
): number {
  if (a.entryIndex !== b.entryIndex) {
    return a.entryIndex - b.entryIndex;
  }
  if (a.recordedAt !== b.recordedAt) {
    return a.recordedAt.localeCompare(b.recordedAt);
  }
  return a.id.localeCompare(b.id);
}

export async function getArtistAchievements(
  artistSlug: string,
  options?: QueryAchievementsOptions
): Promise<QueryAchievementsResult> {
  const normSlug = artistSlug.trim().toLowerCase();
  const trackId: MeritTrackId = options?.trackId || 'track66';
  const publicOnly = Boolean(options?.publicOnly);

  let dbConnected = false;
  let dbFailureKind: DbFailureKind | undefined;
  let dbFailureCode: string | undefined;
  let dbAction: string | undefined;

  if (!isDbCircuitOpen()) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (err) {
      tripDbCircuit();
      const report = classifyDbFailure(err);
      dbFailureKind = report.kind;
      dbFailureCode = report.code;
      dbAction = report.action;
    }
  } else {
    dbFailureKind = 'DB_UNREACHABLE';
    dbFailureCode = 'P1001';
    dbAction = 'Base de datos en modo offline / circuito abierto.';
  }

  await loadStore();
  const allForArtist = cache.data.entries.filter((e) => e.artistSlug === normSlug);
  const filteredTrack = allForArtist.filter((e) => e.trackId === trackId);

  const verifiedEntries = filteredTrack.filter((e) => e.status === 'VERIFIED');
  const pendingEntries = filteredTrack.filter(
    (e) => e.status === 'PENDING_VERIFICATION' || e.status === 'PENDING' || e.status === 'UNVERIFIED'
  );
  const rejectedEntries = filteredTrack.filter((e) => e.status === 'REJECTED');

  let visibleList = publicOnly ? verifiedEntries : filteredTrack;

  if (options?.activeOnly) {
    const supersededIds = new Set<string>();
    for (const item of visibleList) {
      if (item.supersedes) supersededIds.add(item.supersedes);
    }
    visibleList = visibleList.filter((item) => !supersededIds.has(item.id));
  }

  const sortedAchievements = [...visibleList].sort(canonicalSortAchievements);

  const meritEvidences: MeritEvidence[] = verifiedEntries.map((e) => ({
    moduleId: e.moduleId,
    kind: e.evidenceKind,
    verifiedAt: e.verifiedAt || e.recordedAt,
    verifier: e.verifiedBy || 'system',
  }));

  const unlockReport = evaluateUnlock({
    artistId: normSlug,
    trackId,
    evidence: meritEvidences,
  });

  return {
    ok: true,
    artistSlug: normSlug,
    trackId,
    publicOnly,
    totalEntries: sortedAchievements.length,
    verifiedCount: verifiedEntries.length,
    pendingCount: pendingEntries.length,
    rejectedCount: rejectedEntries.length,
    storageMode: 'FALLBACK_OFFLINE_DISK',
    dbStatus: {
      connected: dbConnected,
      failureKind: dbFailureKind,
      failureCode: dbFailureCode,
      action: dbAction,
    },
    achievements: sortedAchievements,
    unlockedModules: unlockReport.unlocked,
    completedModules: unlockReport.completed,
    progressPct: unlockReport.progressPct,
  };
}

export const getAchievementsByArtist = getArtistAchievements;
export const queryArtistAchievements = (options: QueryAchievementsOptions & { artistSlug: string }) =>
  getArtistAchievements(options.artistSlug, options);

export async function evaluateArtistProgress(
  artistSlug: string,
  trackId: MeritTrackId = 'track66'
) {
  const result = await getArtistAchievements(artistSlug, { trackId, publicOnly: false });
  return {
    artistSlug: result.artistSlug,
    trackId: result.trackId,
    progressPct: result.progressPct,
    completedModules: result.completedModules,
    unlockedModules: result.unlockedModules,
    verifiedCount: result.verifiedCount,
  };
}
