import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EVIDENCE LEDGER — Lectura y validación del registro de pruebas (.clinerules §1 · EP-4)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de verdad de la página U13 `/confianza`: cada fila del ledger es
 * una promesa con su estado y su prueba. Este módulo NO inventa filas, NO
 * rellena huecos y NO aprueba nada por defecto.
 *
 * Reglas duras implementadas aquí (§3 AF-1/AF-5 · EP-1/EP-2):
 *  · Vocabulario de estado CERRADO a cuatro palabras. Cualquier otra se degrada
 *    a `SIN_EVIDENCIA` y se reporta como anomalía (nunca "OK por defecto").
 *  · Una fila `VERIFICADO` exige la quíntupla completa: `cmd`, `exit=0`,
 *    `url` https, `sha256` hex de 64 y `ts` ISO-8601. Si falta algo, la fila se
 *    DEGRADA a `SOSPECHOSO` en tiempo de lectura y se explica el motivo.
 *  · Una fila sin `id` o sin `ts` no se publica: se cuenta como anomalía.
 *  · `supersedes` implementa el append-only: la última línea de un `id` es la
 *    vigente; las anteriores pasan al historial. Un `supersedes` hacia OTRO id
 *    retira la cadena entera de ese id (renombrado seguro).
 *
 * Nada de esto se ejecuta en el cliente: el build lee el fichero, calcula su
 * `sha256` y la página se prerenderiza. Cero JavaScript enviado al navegador.
 * ════════════════════════════════════════════════════════════════════════════
 */

export const EVIDENCE_STATES = ['VERIFICADO', 'SOSPECHOSO', 'FACHADA', 'SIN_EVIDENCIA'] as const;

export type EvidenceState = (typeof EVIDENCE_STATES)[number];

/** Ruta canónica del ledger, relativa a la raíz del repo. */
export const LEDGER_RELATIVE_PATH = '.antigravity/evidence/ledger.jsonl';

/** Orden de gravedad para renderizar: lo peor primero, nunca lo verde primero. */
export const STATE_SEVERITY: Readonly<Record<EvidenceState, number>> = {
  FACHADA: 0,
  SOSPECHOSO: 1,
  SIN_EVIDENCIA: 2,
  VERIFICADO: 3,
};

const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const SHA256_HEX = /^[0-9a-f]{64}$/;

export interface EvidenceClaim {
  /** Identificador estable de la promesa (EP-1 `CLAIM{id}`). */
  id: string;
  /** Qué se promete, en lenguaje de negocio. `null` = fila sin descripción. */
  promise: string | null;
  state: EvidenceState;
  cmd: string | null;
  exit: number | null;
  url: string | null;
  sha256: string | null;
  bytes: number | null;
  httpStatus: number | null;
  ts: string | null;
  note: string | null;
  supersedes: string | null;
  /** `true` si el validador rebajó el estado declarado (jamás se publica tal cual). */
  downgraded: boolean;
  downgradeReason: string | null;
}

export interface LedgerAnomaly {
  /** Número de línea (1-based) dentro del `.jsonl`. */
  line: number;
  reason: string;
  excerpt: string;
}

export interface EvidenceLedger {
  /** AF-1: ¿se llegó a leer el ledger en este build? */
  probed: boolean;
  /** AF-1: origen real del dato. */
  source: 'live' | 'missing' | 'unreadable';
  /** AF-1/AF-2: `REAL` solo si las filas salen de un fichero leído en disco. */
  mode: 'REAL' | 'SIMULADO';
  ledgerPath: string;
  ledgerSha256: string | null;
  ledgerBytes: number | null;
  /** Fecha de la evidencia más reciente registrada (derivada, no `now()`). */
  ledgerUpdatedAt: string | null;
  activeClaims: EvidenceClaim[];
  retiredClaims: EvidenceClaim[];
  anomalies: LedgerAnomaly[];
  counts: Record<EvidenceState, number>;
  /** `true` si el deploy debe bloquearse (§4: una FACHADA en el ledger lo bloquea). */
  deployBlocked: boolean;
  blockReasons: string[];
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asText(source: JsonRecord, key: string): string | null {
  const value = source[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNumber(source: JsonRecord, key: string): number | null {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function emptyCounts(): Record<EvidenceState, number> {
  return { VERIFICADO: 0, SOSPECHOSO: 0, FACHADA: 0, SIN_EVIDENCIA: 0 };
}

function normalizeState(raw: string | null): EvidenceState | null {
  if (raw === null) return null;
  const candidate = raw.trim().toUpperCase();
  return (EVIDENCE_STATES as readonly string[]).includes(candidate)
    ? (candidate as EvidenceState)
    : null;
}

interface ParsedRow {
  claim: EvidenceClaim | null;
  anomaly: LedgerAnomaly | null;
}

/**
 * Convierte una línea del `.jsonl` en una fila publicable o en una anomalía.
 * Estrategia ante la duda: degradar y avisar, nunca aprobar.
 */
function parseLine(rawLine: string, line: number): ParsedRow {
  const excerpt = rawLine.slice(0, 160);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawLine) as unknown;
  } catch {
    return { claim: null, anomaly: { line, reason: 'JSON inválido: la fila no es parseable', excerpt } };
  }

  if (!isRecord(parsed)) {
    return { claim: null, anomaly: { line, reason: 'La fila no es un objeto JSON', excerpt } };
  }

  const id = asText(parsed, 'id') ?? asText(parsed, 'claim');
  const ts = asText(parsed, 'ts');
  if (id === null) {
    return { claim: null, anomaly: { line, reason: 'Fila sin `id`/`claim`: no identificable, no se publica', excerpt } };
  }
  if (ts === null) {
    return { claim: null, anomaly: { line, reason: 'Fila ' + id + ' sin `ts`: sin fecha no es prueba (EP-1)', excerpt } };
  }

  const declaredState = asText(parsed, 'state');
  const normalized = normalizeState(declaredState);
  const reasons: string[] = [];
  let state: EvidenceState;

  if (normalized === null) {
    state = 'SIN_EVIDENCIA';
    reasons.push('estado "' + (declaredState ?? '') + '" fuera del vocabulario cerrado (EP-2)');
  } else {
    state = normalized;
  }

  const cmd = asText(parsed, 'cmd');
  const exit = asNumber(parsed, 'exit');
  const url = asText(parsed, 'url');
  const sha256 = asText(parsed, 'sha256');
  const httpStatus = asNumber(parsed, 'httpStatus');

  if (state === 'VERIFICADO') {
    const missing: string[] = [];
    if (cmd === null) missing.push('cmd');
    if (exit === null) missing.push('exit');
    if (url === null) missing.push('url');
    if (sha256 === null) missing.push('sha256');
    if (missing.length > 0) reasons.push('quintupla incompleta (falta ' + missing.join(', ') + ')');
    if (exit !== null && exit !== 0) reasons.push('exit=' + exit + ' (un VERIFICADO exige Exit Code 0)');
    if (url !== null && !url.startsWith('https://')) reasons.push('url no https: se mide sobre el host final (G-6)');
    if (sha256 !== null && !SHA256_HEX.test(sha256)) reasons.push('sha256 no es un hex de 64 caracteres');
    if (httpStatus !== null && httpStatus !== 200) reasons.push('httpStatus=' + httpStatus);
    if (!ISO_TS.test(ts)) reasons.push('ts no es ISO-8601 en UTC');
    if (reasons.length > 0) state = 'SOSPECHOSO';
  }

  const claim: EvidenceClaim = {
    id,
    promise: asText(parsed, 'promise'),
    state,
    cmd,
    exit,
    url,
    sha256,
    bytes: asNumber(parsed, 'bytes'),
    httpStatus,
    ts,
    note: asText(parsed, 'note'),
    supersedes: asText(parsed, 'supersedes'),
    downgraded: reasons.length > 0,
    downgradeReason: reasons.length > 0 ? reasons.join(' · ') : null,
  };

  return { claim, anomaly: null };
}

function compareClaims(left: EvidenceClaim, right: EvidenceClaim): number {
  const bySeverity = STATE_SEVERITY[left.state] - STATE_SEVERITY[right.state];
  if (bySeverity !== 0) return bySeverity;
  return left.id.localeCompare(right.id);
}

function buildLedger(params: {
  bundle: Buffer | null;
  source: EvidenceLedger['source'];
  readError?: string;
}): EvidenceLedger {
  const { bundle, source, readError } = params;
  const counts = emptyCounts();
  const anomalies: LedgerAnomaly[] = [];
  const blockReasons: string[] = [];
  const allClaims: EvidenceClaim[] = [];

  if (readError !== undefined) {
    anomalies.push({ line: 0, reason: readError, excerpt: LEDGER_RELATIVE_PATH });
  }

  if (bundle !== null) {
    const text = bundle.toString('utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((rawLine, index) => {
      const trimmed = rawLine.trim();
      if (trimmed.length === 0) return;
      const { claim, anomaly } = parseLine(trimmed, index + 1);
      if (anomaly !== null) anomalies.push(anomaly);
      if (claim !== null) allClaims.push(claim);
    });
  }

  // Resolución append-only (EP-4) en dos pasos, sin romper el caso `X supersedes X`:
  //   1. Por id, gana SIEMPRE la última ocurrencia del fichero (el ledger solo crece,
  //      así que la última línea es la más reciente). Las anteriores son historial.
  //   2. Un `supersedes` dirigido a un id DISTINTO retira toda la cadena de ese id
  //      (permite renombrar una promesa: `U1` → `U14`). Un `supersedes` sobre el
  //      propio id no puede retirar la fila que lo declara: sería autodestrucción.
  const lastIndexById = new Map<string, number>();
  allClaims.forEach((claim, index) => lastIndexById.set(claim.id, index));

  const retiredIds = new Set<string>();
  for (const claim of allClaims) {
    if (claim.supersedes !== null && claim.supersedes !== claim.id) retiredIds.add(claim.supersedes);
  }

  const activeClaims: EvidenceClaim[] = [];
  const retiredClaims: EvidenceClaim[] = [];
  allClaims.forEach((claim, index) => {
    const isLatestForId = lastIndexById.get(claim.id) === index;
    if (isLatestForId && !retiredIds.has(claim.id)) activeClaims.push(claim);
    else retiredClaims.push(claim);
  });
  activeClaims.sort(compareClaims);
  retiredClaims.sort(compareClaims);

  for (const claim of activeClaims) counts[claim.state] += 1;

  const facades = activeClaims.filter((claim) => claim.state === 'FACHADA').map((claim) => claim.id);
  if (facades.length > 0) {
    blockReasons.push('FACHADA activa en el ledger: ' + facades.join(', ') + ' (§4 · el deploy queda bloqueado)');
  }
  const incomplete = activeClaims.filter((claim) => claim.downgraded).map((claim) => claim.id);
  if (incomplete.length > 0) {
    blockReasons.push('Quintupla incompleta, fila degradada automáticamente: ' + incomplete.join(', '));
  }
  if (anomalies.length > 0) {
    blockReasons.push(anomalies.length + ' anomalía(s) de formato en el ledger: el registro no es fiable');
  }
  if (source !== 'live') {
    blockReasons.push('Ledger no leído (' + source + '): la página no puede afirmar nada');
  }

  const updatedAt = activeClaims.reduce<string | null>((latest, claim) => {
    if (claim.ts === null) return latest;
    if (latest === null) return claim.ts;
    return claim.ts > latest ? claim.ts : latest;
  }, null);

  return {
    probed: source === 'live',
    source,
    mode: source === 'live' ? 'REAL' : 'SIMULADO',
    ledgerPath: LEDGER_RELATIVE_PATH,
    ledgerSha256: bundle === null ? null : createHash('sha256').update(bundle).digest('hex'),
    ledgerBytes: bundle === null ? null : bundle.length,
    ledgerUpdatedAt: updatedAt,
    activeClaims,
    retiredClaims,
    anomalies,
    counts,
    deployBlocked: blockReasons.length > 0,
    blockReasons,
  };
}

/**
 * Lee el ledger desde disco (build time). Nunca lanza: si el fichero falta o no
 * se puede leer, devuelve un ledger vacío que declara `probed:false` para que la
 * página lo diga en voz alta en lugar de mostrar un verde tranquilizador.
 */
export function readEvidenceLedger(rootDir: string = process.cwd()): EvidenceLedger {
  try {
    const bundle = readFileSync(path.join(rootDir, LEDGER_RELATIVE_PATH));
    return buildLedger({ bundle, source: 'live' });
  } catch (error) {
    const code = isRecord(error) && typeof error.code === 'string' ? error.code : 'UNKNOWN';
    if (code === 'ENOENT') {
      return buildLedger({ bundle: null, source: 'missing' });
    }
    const detail = error instanceof Error ? error.message : String(error);
    return buildLedger({
      bundle: null,
      source: 'unreadable',
      readError: 'No se pudo leer el ledger (' + code + '): ' + detail,
    });
  }
}
