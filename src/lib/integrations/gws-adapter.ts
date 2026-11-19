/**
 * ════════════════════════════════════════════════════════════════════════════
 * GOOGLE WORKSPACE ADAPTER (`gws` CLI + CLOUD CONSOLE OAUTH2) (M2)
 * ════════════════════════════════════════════════════════════════════════════
 * Server-only (`node:child_process`, `node:fs`, `node:path`).
 * Cero imports estáticos de `@googleworkspace/cli` o `googleapis`.
 * Fail-closed: `503 UNCONFIGURED` sin credenciales, `403 GWS_SCOPE_VIOLATION`
 * ante scopes fuera de mínimo privilegio y `403 HITL_BLOCKED` sin aprobación
 * humana en mutaciones o umbrales constitucionales (`AGENTS.md` §2).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { execFile } from 'node:child_process';
import { existsSync as fsExistsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { z } from 'zod';

import {
  ADAPTER_TIMEOUT_MS,
  type AdapterEnvelope,
  type AdapterReadiness,
  type AdapterTransport,
  type EnvSource,
  type HitlActionKind,
  type HitlGateDecision,
  createAdapterFetchTransport,
  effectiveAdapterSignal,
  envelopeError,
  envelopeHitlBlocked,
  envelopeOk,
  envelopeUnconfigured,
  evaluateHitlPolicyGate,
  parseStrictWithSchema,
  readEnvVar,
} from './adapter-contract';

const execFileAsync = promisify(execFile);

export const GWS_ADAPTER_ID = 'gws' as const;

export const GWS_ALLOWED_SCOPE_ALLOWLIST = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events',
] as const;

export type GwsAllowedScope = (typeof GWS_ALLOWED_SCOPE_ALLOWLIST)[number];

const SHORT_TO_CANONICAL_SCOPE: Readonly<Record<string, GwsAllowedScope>> = {
  'gmail.readonly': 'https://www.googleapis.com/auth/gmail.readonly',
  'gmail.compose': 'https://www.googleapis.com/auth/gmail.compose',
  'drive.file': 'https://www.googleapis.com/auth/drive.file',
  documents: 'https://www.googleapis.com/auth/documents',
  spreadsheets: 'https://www.googleapis.com/auth/spreadsheets',
  'calendar.events': 'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly':
    'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose':
    'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/drive.file':
    'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents':
    'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets':
    'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events':
    'https://www.googleapis.com/auth/calendar.events',
};

const SAFE_BIN_RE = /^[a-zA-Z0-9_.\-\\/: ]+$/;
const SAFE_RESOURCE_ID_RE = /^[a-zA-Z0-9._\-@]{1,128}$/;

export const GWS_ACTION_VALUES = [
  'gmail.messages.list',
  'gmail.messages.get',
  'gmail.drafts.create',
  'gmail.drafts.send',
  'drive.files.list',
  'drive.files.create_app_file',
  'docs.document.get',
  'docs.document.create',
  'docs.vimume_clinical_export',
  'docs.b2g_contract_export',
  'spreadsheets.values.get',
  'spreadsheets.values.append',
  'calendar.events.list',
  'calendar.events.create_draft',
  'calendar.events.invite_external',
  'contracts.auto_close_without_bilateral_consent',
] as const;

export type GwsAction = (typeof GWS_ACTION_VALUES)[number];

export const gwsExecuteInputSchema = z
  .object({
    action: z.enum(GWS_ACTION_VALUES),
    scopes: z.array(z.string().trim().min(1)).min(1),
    params: z.record(z.string(), z.unknown()).default({}),
    hitlApproved: z.boolean().optional().default(false),
    hitlReviewerId: z.string().trim().min(1).max(128).optional(),
    estimatedAmountEur: z.number().nonnegative().optional(),
    containsClinicalVimume: z.boolean().optional().default(false),
    bilateralConsentConfirmed: z.boolean().optional().default(false),
    transportPreference: z
      .enum(['auto', 'cli', 'oauth_rest'])
      .optional()
      .default('auto'),
    contextSummary: z.string().max(400).optional(),
  })
  .strict();

export type GwsExecuteInput = z.infer<typeof gwsExecuteInputSchema>;

const googleOAuthTokenResponseSchema = z
  .object({
    access_token: z.string().min(1),
    expires_in: z.number().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
  })
  .strict();

const gwsStructuredResultSchema = z.record(z.string(), z.unknown());

export interface GwsExecutionResult {
  readonly adapterId: typeof GWS_ADAPTER_ID;
  readonly action: GwsAction;
  readonly transportUsed: 'cli' | 'oauth_rest';
  readonly scopes: readonly GwsAllowedScope[];
  readonly payload: Readonly<Record<string, unknown>>;
  readonly executedAt: string;
}

export interface GwsCliRequest {
  readonly binPath: string;
  readonly args: readonly string[];
  readonly env: EnvSource;
  readonly timeoutMs: number;
}

export interface GwsCliResponse {
  readonly stdout: string;
  readonly stderr: string;
}

export type GwsCliRunner = (request: GwsCliRequest) => Promise<GwsCliResponse>;

export interface GwsProbeDeps {
  readonly existsSync?: (targetPath: string) => boolean;
  readonly commandExists?: (binName: string) => boolean;
  readonly rootDir?: string;
}

export interface GwsAdapterOptions {
  readonly env?: EnvSource;
  readonly transport?: AdapterTransport;
  readonly cliRunner?: GwsCliRunner;
  readonly probeDeps?: GwsProbeDeps;
  readonly now?: () => Date;
  readonly deadline?: Date;
}

export function defaultCommandExists(
  binName: string,
  env: EnvSource = process.env,
  existsFn: (targetPath: string) => boolean = fsExistsSync,
  platform: NodeJS.Platform = process.platform,
): boolean {
  if (!SAFE_BIN_RE.test(binName)) return false;
  const lower = binName.toLowerCase();
  if (platform === 'win32' && (lower.endsWith('.cmd') || lower.endsWith('.bat'))) {
    return false;
  }
  if (path.isAbsolute(binName) || binName.includes('/') || binName.includes('\\')) {
    return existsFn(binName);
  }
  const pathEnv = readEnvVar(env, 'PATH') || readEnvVar(env, 'Path');
  if (!pathEnv) return false;
  const dirs = pathEnv.split(path.delimiter).filter((d) => d.length > 0);

  if (platform !== 'win32') {
    for (const dir of dirs) {
      if (existsFn(path.join(dir, binName))) return true;
    }
    return false;
  }

  const hasRunnableWinExt =
    lower.endsWith('.exe') ||
    lower.endsWith('.com') ||
    lower.endsWith('.js') ||
    lower.endsWith('.mjs') ||
    lower.endsWith('.cjs');
  if (hasRunnableWinExt) {
    for (const dir of dirs) {
      if (existsFn(path.join(dir, binName))) return true;
    }
    return false;
  }

  const exts = (readEnvVar(env, 'PATHEXT') || '.EXE;.COM')
    .split(';')
    .map((e) => e.trim())
    .filter((e) => {
      const norm = e.toLowerCase();
      return norm.length > 0 && norm !== '.cmd' && norm !== '.bat';
    });

  for (const dir of dirs) {
    for (const ext of exts) {
      if (existsFn(path.join(dir, `${binName}${ext}`))) return true;
      const lowerExt = ext.toLowerCase();
      if (lowerExt !== ext && existsFn(path.join(dir, `${binName}${lowerExt}`))) {
        return true;
      }
    }
  }
  return false;
}

export type GwsScopeValidation =
  | { readonly ok: true; readonly scopes: readonly GwsAllowedScope[] }
  | { readonly ok: false; readonly rejected: readonly string[]; readonly reason: string };

/**
 * Cortafuegos estricto de scopes GWS: rechaza cualquier scope amplio o fuera
 * de la lista cerrada de mínimo privilegio (`mail.google.com`, `gmail.modify`,
 * `gmail.send`, `drive` completo, `calendar` completo, `admin.*`, `cloud-platform`).
 */
export function validateGwsScopes(scopes: readonly string[]): GwsScopeValidation {
  if (!Array.isArray(scopes) || scopes.length === 0) {
    return {
      ok: false,
      rejected: [],
      reason: 'Debe especificarse al menos un scope GWS de mínimo privilegio.',
    };
  }
  const normalized: GwsAllowedScope[] = [];
  const rejected: string[] = [];

  for (const raw of scopes) {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    const mapped = SHORT_TO_CANONICAL_SCOPE[trimmed];
    if (!mapped) {
      rejected.push(trimmed || '<empty>');
    } else if (!normalized.includes(mapped)) {
      normalized.push(mapped);
    }
  }

  if (rejected.length > 0) {
    return {
      ok: false,
      rejected,
      reason: `Scope(s) GWS prohibidos o fuera de mínimo privilegio: ${rejected.join(', ')}`,
    };
  }

  return { ok: true, scopes: normalized };
}

function readConfiguredEnvScopes(env: EnvSource): GwsScopeValidation | null {
  const raw = readEnvVar(env, 'GWS_ALLOWED_SCOPES') || readEnvVar(env, 'GWS_SCOPES');
  if (!raw) return null;
  const list = raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return validateGwsScopes(list);
}

interface GwsResolvedMode {
  readonly oauthReady: boolean;
  readonly cliReady: boolean;
  readonly cliBin: string;
  readonly missingVars: readonly string[];
  readonly scopeValidation: GwsScopeValidation | null;
}

function resolveGwsMode(
  env: EnvSource,
  deps: GwsProbeDeps = {},
): GwsResolvedMode {
  const existsFn = deps.existsSync ?? fsExistsSync;
  const rootDir = deps.rootDir ?? process.cwd();
  const cmdExists =
    deps.commandExists ?? ((bin: string) => defaultCommandExists(bin, env, existsFn));

  const clientId = readEnvVar(env, 'GOOGLE_WORKSPACE_CLIENT_ID');
  const clientSecret = readEnvVar(env, 'GOOGLE_WORKSPACE_CLIENT_SECRET');
  const refreshToken = readEnvVar(env, 'GOOGLE_WORKSPACE_REFRESH_TOKEN');

  const missingOauth: string[] = [];
  if (!clientId) missingOauth.push('GOOGLE_WORKSPACE_CLIENT_ID');
  if (!clientSecret) missingOauth.push('GOOGLE_WORKSPACE_CLIENT_SECRET');
  if (!refreshToken) missingOauth.push('GOOGLE_WORKSPACE_REFRESH_TOKEN');
  const oauthReady = missingOauth.length === 0;

  const cliBin = readEnvVar(env, 'GWS_CLI_BIN') || 'gws';
  const credsPath = readEnvVar(env, 'GWS_CREDENTIALS_PATH');
  const tokenPath = readEnvVar(env, 'GWS_TOKEN_PATH');

  const resolveFile = (p: string): boolean => {
    if (!p) return false;
    const abs = path.isAbsolute(p) ? p : path.resolve(rootDir, p);
    return existsFn(abs);
  };

  const hasLocalOAuthFiles = resolveFile(tokenPath) || resolveFile(credsPath);
  const lowerCliBin = cliBin.toLowerCase();
  const isDisallowedWinShim =
    process.platform === 'win32' &&
    (lowerCliBin.endsWith('.cmd') || lowerCliBin.endsWith('.bat'));
  const cliExists = !isDisallowedWinShim && SAFE_BIN_RE.test(cliBin) && cmdExists(cliBin);
  const cliReady = cliExists && (hasLocalOAuthFiles || oauthReady);

  const scopeValidation = readConfiguredEnvScopes(env);

  return {
    oauthReady,
    cliReady,
    cliBin,
    missingVars: oauthReady || cliReady ? [] : missingOauth,
    scopeValidation,
  };
}

export function checkGwsReadiness(
  env: EnvSource = process.env,
  deps: GwsProbeDeps = {},
): AdapterReadiness {
  const resolved = resolveGwsMode(env, deps);
  const hasInvalidEnvScopes =
    resolved.scopeValidation !== null && !resolved.scopeValidation.ok;
  const configured = !hasInvalidEnvScopes && (resolved.oauthReady || resolved.cliReady);

  const notes: string[] = [];
  if (resolved.oauthReady) notes.push('oauth_rest=ready');
  if (resolved.cliReady) notes.push(`cli=ready(${resolved.cliBin})`);
  if (!resolved.oauthReady && !resolved.cliReady) {
    notes.push('Faltan credenciales OAuth2 de Cloud Console o binario gws CLI configurado.');
  }
  if (resolved.scopeValidation && !resolved.scopeValidation.ok) {
    notes.push(`GWS_SCOPE_VIOLATION: ${resolved.scopeValidation.reason}`);
  }

  return {
    adapterId: GWS_ADAPTER_ID,
    configured,
    mode: configured ? 'READY' : 'UNCONFIGURED',
    missingVars: resolved.missingVars,
    details: notes.join(' | '),
  };
}

export function evaluateGwsHitlGate(input: GwsExecuteInput): HitlGateDecision {
  let actionKind: HitlActionKind = 'read_only';

  if (input.action === 'contracts.auto_close_without_bilateral_consent') {
    actionKind = 'contract_close';
  } else if (
    input.action === 'docs.vimume_clinical_export' ||
    input.containsClinicalVimume
  ) {
    actionKind = 'vimume_clinical';
  } else if (input.action === 'docs.b2g_contract_export') {
    actionKind = 'b2g_contract';
  } else if (
    input.action === 'gmail.drafts.send' ||
    input.action === 'calendar.events.invite_external'
  ) {
    actionKind = 'mutating_action';
  } else if (
    input.action === 'gmail.drafts.create' ||
    input.action === 'drive.files.create_app_file' ||
    input.action === 'docs.document.create' ||
    input.action === 'spreadsheets.values.append' ||
    input.action === 'calendar.events.create_draft'
  ) {
    // Borradores internos son 60_SEMI_AUTO salvo que lleven importe alto o revisión explícita.
    actionKind = 'draft_compose';
  }

  const requiresReviewerId =
    actionKind === 'mutating_action' ||
    actionKind === 'vimume_clinical' ||
    actionKind === 'b2g_contract';
  const effectiveApproval = requiresReviewerId
    ? input.hitlApproved === true &&
      typeof input.hitlReviewerId === 'string' &&
      input.hitlReviewerId.trim().length > 0
    : input.hitlApproved;

  return evaluateHitlPolicyGate({
    actionKind,
    amountEur: input.estimatedAmountEur ?? null,
    bilateralConsentConfirmed: input.bilateralConsentConfirmed,
    humanApproved: effectiveApproval,
    contextSummary: input.contextSummary ?? `GWS action=${input.action}`,
  });
}

async function runDefaultGwsCli(request: GwsCliRequest): Promise<GwsCliResponse> {
  if (!SAFE_BIN_RE.test(request.binPath)) {
    throw new Error('Ruta de binario GWS inválida.');
  }
  const lower = request.binPath.toLowerCase();
  if (process.platform === 'win32' && (lower.endsWith('.cmd') || lower.endsWith('.bat'))) {
    throw new Error(
      'Ejecución directa de scripts .cmd/.bat bloqueada (shell: false obligatorio); usa binario .exe o script .js.',
    );
  }

  const isJsEntry =
    lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs');
  const command = isJsEntry ? process.execPath : request.binPath;
  const args = isJsEntry ? [request.binPath, ...request.args] : [...request.args];

  const nodeEnv =
    request.env.NODE_ENV === 'production' ||
    request.env.NODE_ENV === 'test' ||
    request.env.NODE_ENV === 'development'
      ? request.env.NODE_ENV
      : process.env.NODE_ENV;
  const childEnv: NodeJS.ProcessEnv = { NODE_ENV: nodeEnv };
  for (const [k, v] of Object.entries(request.env)) {
    if (typeof v === 'string' && k !== 'NODE_ENV') childEnv[k] = v;
  }

  const result = await execFileAsync(command, args, {
    shell: false,
    windowsHide: true,
    timeout: request.timeoutMs,
    maxBuffer: 1024 * 1024,
    env: childEnv,
  });

  return {
    stdout: String(result.stdout ?? ''),
    stderr: String(result.stderr ?? ''),
  };
}

function buildGwsCliArgs(
  input: GwsExecuteInput,
  scopes: readonly GwsAllowedScope[],
): readonly string[] {
  const [service, resource, verb] = input.action.split('.');
  return [
    service ?? 'gmail',
    resource ?? 'messages',
    verb ?? 'list',
    '--format',
    'json',
    '--scopes',
    scopes.join(','),
    '--params',
    JSON.stringify(input.params),
  ];
}

function safeResourceId(raw: unknown, fallback?: string): string | null {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (
      trimmed !== '.' &&
      trimmed !== '..' &&
      !trimmed.includes('..') &&
      SAFE_RESOURCE_ID_RE.test(trimmed)
    ) {
      return encodeURIComponent(trimmed);
    }
  }
  return fallback ? encodeURIComponent(fallback) : null;
}

function resolveGoogleRestCall(
  input: GwsExecuteInput,
  impersonatedUser: string,
): { readonly method: 'GET' | 'POST'; readonly url: string; readonly body: string | null } | null {
  const userSeg = safeResourceId(impersonatedUser, 'me') ?? 'me';
  const p = input.params;

  switch (input.action) {
    case 'gmail.messages.list': {
      const maxResults =
        typeof p.maxResults === 'number' && p.maxResults >= 1 && p.maxResults <= 100
          ? Math.floor(p.maxResults)
          : 10;
      return {
        method: 'GET',
        url: `https://gmail.googleapis.com/gmail/v1/users/${userSeg}/messages?maxResults=${maxResults}`,
        body: null,
      };
    }
    case 'gmail.messages.get': {
      const msgId = safeResourceId(p.messageId);
      if (!msgId) return null;
      return {
        method: 'GET',
        url: `https://gmail.googleapis.com/gmail/v1/users/${userSeg}/messages/${msgId}`,
        body: null,
      };
    }
    case 'gmail.drafts.create':
      return {
        method: 'POST',
        url: `https://gmail.googleapis.com/gmail/v1/users/${userSeg}/drafts`,
        body: JSON.stringify(p),
      };
    case 'gmail.drafts.send':
      return {
        method: 'POST',
        url: `https://gmail.googleapis.com/gmail/v1/users/${userSeg}/drafts/send`,
        body: JSON.stringify(p),
      };
    case 'drive.files.list': {
      const pageSize =
        typeof p.pageSize === 'number' && p.pageSize >= 1 && p.pageSize <= 100
          ? Math.floor(p.pageSize)
          : 20;
      return {
        method: 'GET',
        url: `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}`,
        body: null,
      };
    }
    case 'drive.files.create_app_file':
      return {
        method: 'POST',
        url: 'https://www.googleapis.com/drive/v3/files',
        body: JSON.stringify(p),
      };
    case 'docs.document.get': {
      const docId = safeResourceId(p.documentId);
      if (!docId) return null;
      return {
        method: 'GET',
        url: `https://docs.googleapis.com/v1/documents/${docId}`,
        body: null,
      };
    }
    case 'docs.document.create':
    case 'docs.vimume_clinical_export':
    case 'docs.b2g_contract_export':
      return {
        method: 'POST',
        url: 'https://docs.googleapis.com/v1/documents',
        body: JSON.stringify(p),
      };
    case 'spreadsheets.values.get': {
      const sheetId = safeResourceId(p.spreadsheetId);
      const range = typeof p.range === 'string' && p.range.trim().length > 0 ? p.range.trim() : 'A1:Z50';
      if (!sheetId) return null;
      return {
        method: 'GET',
        url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`,
        body: null,
      };
    }
    case 'spreadsheets.values.append': {
      const sheetId = safeResourceId(p.spreadsheetId);
      const range = typeof p.range === 'string' && p.range.trim().length > 0 ? p.range.trim() : 'A1';
      if (!sheetId) return null;
      return {
        method: 'POST',
        url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
        body: JSON.stringify(p),
      };
    }
    case 'calendar.events.list': {
      const calId = safeResourceId(p.calendarId, 'primary') ?? 'primary';
      return {
        method: 'GET',
        url: `https://www.googleapis.com/calendar/v3/calendars/${calId}/events`,
        body: null,
      };
    }
    case 'calendar.events.create_draft':
      return {
        method: 'POST',
        url: `https://www.googleapis.com/calendar/v3/calendars/${safeResourceId(p.calendarId, 'primary') ?? 'primary'}/events`,
        body: JSON.stringify(p),
      };
    case 'calendar.events.invite_external':
      return {
        method: 'POST',
        url: `https://www.googleapis.com/calendar/v3/calendars/${safeResourceId(p.calendarId, 'primary') ?? 'primary'}/events?sendUpdates=all`,
        body: JSON.stringify(p),
      };
    case 'contracts.auto_close_without_bilateral_consent':
      return null;
  }
}

export async function executeGwsAction(
  rawInput: unknown,
  options: GwsAdapterOptions = {},
): Promise<AdapterEnvelope<GwsExecutionResult>> {
  const env = options.env ?? process.env;
  const nowFn = options.now ?? (() => new Date());

  // 1. Validación estricta Zod de entrada
  const parsedInput = parseStrictWithSchema(gwsExecuteInputSchema, rawInput);
  if (!parsedInput.ok) {
    return envelopeError(400, 'GWS_INVALID_INPUT', parsedInput.error);
  }
  const input = parsedInput.data;

  // 2. Cortafuegos de scopes (entrada y subconjunto permitido por entorno)
  const scopeCheck = validateGwsScopes(input.scopes);
  if (!scopeCheck.ok) {
    return envelopeError(403, 'GWS_SCOPE_VIOLATION', scopeCheck.reason);
  }
  const envScopes = readConfiguredEnvScopes(env);
  if (envScopes && !envScopes.ok) {
    return envelopeError(403, 'GWS_SCOPE_VIOLATION', envScopes.reason);
  }
  if (envScopes && envScopes.ok) {
    const disallowedByEnv = scopeCheck.scopes.filter(
      (scope) => !envScopes.scopes.includes(scope),
    );
    if (disallowedByEnv.length > 0) {
      return envelopeError(
        403,
        'GWS_SCOPE_VIOLATION',
        `Scope(s) GWS fuera del subconjunto permitido por entorno: ${disallowedByEnv.join(', ')}`,
      );
    }
  }

  // 3. Puerta constitucional HITL (AGENTS.md §2)
  const hitlDecision = evaluateGwsHitlGate(input);
  if (!hitlDecision.allowed) {
    return envelopeHitlBlocked(hitlDecision);
  }

  // 4. Readiness fail-closed (503 UNCONFIGURED si no hay CLI ni OAuth)
  const resolved = resolveGwsMode(env, options.probeDeps);
  const readiness = checkGwsReadiness(env, options.probeDeps);
  if (!readiness.configured) {
    return envelopeUnconfigured(readiness);
  }

  const clientId = readEnvVar(env, 'GOOGLE_WORKSPACE_CLIENT_ID');
  const clientSecret = readEnvVar(env, 'GOOGLE_WORKSPACE_CLIENT_SECRET');
  const refreshToken = readEnvVar(env, 'GOOGLE_WORKSPACE_REFRESH_TOKEN');
  const impersonatedUser = readEnvVar(env, 'GWS_IMPERSONATED_USER') || 'me';
  const knownSecrets = [clientSecret, refreshToken].filter((s) => s.length > 0);

  const useCli =
    input.transportPreference === 'cli'
      ? resolved.cliReady
      : input.transportPreference === 'oauth_rest'
        ? false
        : resolved.cliReady && !resolved.oauthReady;

  if (useCli) {
    const cliRunner = options.cliRunner ?? runDefaultGwsCli;
    try {
      const cliRes = await cliRunner({
        binPath: resolved.cliBin,
        args: buildGwsCliArgs(input, scopeCheck.scopes),
        env,
        timeoutMs: ADAPTER_TIMEOUT_MS,
      });
      const parsedJson = JSON.parse(cliRes.stdout) as unknown;
      const validated = parseStrictWithSchema(gwsStructuredResultSchema, parsedJson);
      if (!validated.ok) {
        return envelopeError(
          502,
          'GWS_INVALID_PAYLOAD',
          `Respuesta CLI GWS inválida: ${validated.error}`,
          knownSecrets,
        );
      }
      const data: GwsExecutionResult = {
        adapterId: GWS_ADAPTER_ID,
        action: input.action,
        transportUsed: 'cli',
        scopes: scopeCheck.scopes,
        payload: validated.data,
        executedAt: nowFn().toISOString(),
      };
      return envelopeOk(data, {
        adapterId: GWS_ADAPTER_ID,
        action: input.action,
        transportUsed: 'cli',
        scopes: scopeCheck.scopes,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return envelopeError(502, 'GWS_CLI_ERROR', msg, knownSecrets);
    }
  }

  if (!resolved.oauthReady) {
    return envelopeUnconfigured(readiness);
  }

  const restCall = resolveGoogleRestCall(input, impersonatedUser);
  if (!restCall) {
    return envelopeError(
      400,
      'GWS_MISSING_RESOURCE_ID',
      `Parámetros insuficientes o inválidos para la acción GWS ${input.action}.`,
      knownSecrets,
    );
  }

  const transport = options.transport ?? createAdapterFetchTransport();
  let accessToken = '';

  try {
    const tokenBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString();

    const tokenRes = await transport.send({
      url: 'https://oauth2.googleapis.com/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: tokenBody,
      signal: effectiveAdapterSignal(options.deadline, nowFn, ADAPTER_TIMEOUT_MS),
    });

    if (tokenRes.status === 401 || tokenRes.status === 403) {
      return envelopeError(
        403,
        'GWS_OAUTH_UNAUTHORIZED',
        `OAuth2 rechazado con estado ${tokenRes.status}.`,
        knownSecrets,
      );
    }
    if (tokenRes.status < 200 || tokenRes.status >= 300) {
      return envelopeError(
        502,
        'GWS_OAUTH_UPSTREAM_ERROR',
        `Fallo en intercambio OAuth2 (HTTP ${tokenRes.status}): ${tokenRes.text}`,
        knownSecrets,
      );
    }

    const tokenParsed = parseStrictWithSchema(
      googleOAuthTokenResponseSchema,
      JSON.parse(tokenRes.text) as unknown,
    );
    if (!tokenParsed.ok) {
      return envelopeError(
        502,
        'GWS_OAUTH_INVALID_PAYLOAD',
        `Payload OAuth2 inválido: ${tokenParsed.error}`,
        knownSecrets,
      );
    }
    accessToken = tokenParsed.data.access_token;
    const allSecrets = [...knownSecrets, accessToken];

    const apiRes = await transport.send({
      url: restCall.url,
      method: restCall.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...(restCall.body !== null ? { 'Content-Type': 'application/json' } : {}),
      },
      body: restCall.body,
      signal: effectiveAdapterSignal(options.deadline, nowFn, ADAPTER_TIMEOUT_MS),
    });

    if (apiRes.status === 401 || apiRes.status === 403) {
      return envelopeError(
        403,
        'GWS_API_UNAUTHORIZED',
        `Google API rechazó la operación (HTTP ${apiRes.status}).`,
        allSecrets,
      );
    }
    if (apiRes.status < 200 || apiRes.status >= 300) {
      return envelopeError(
        502,
        'GWS_API_UPSTREAM_ERROR',
        `Google API devolvió HTTP ${apiRes.status}: ${apiRes.text}`,
        allSecrets,
      );
    }

    const payloadParsed = parseStrictWithSchema(
      gwsStructuredResultSchema,
      JSON.parse(apiRes.text) as unknown,
    );
    if (!payloadParsed.ok) {
      return envelopeError(
        502,
        'GWS_INVALID_PAYLOAD',
        `Respuesta JSON de Google API inválida: ${payloadParsed.error}`,
        allSecrets,
      );
    }

    const resultData: GwsExecutionResult = {
      adapterId: GWS_ADAPTER_ID,
      action: input.action,
      transportUsed: 'oauth_rest',
      scopes: scopeCheck.scopes,
      payload: payloadParsed.data,
      executedAt: nowFn().toISOString(),
    };

    return envelopeOk(resultData, {
      adapterId: GWS_ADAPTER_ID,
      action: input.action,
      transportUsed: 'oauth_rest',
      scopes: scopeCheck.scopes,
    });
  } catch (err: unknown) {
    const allSecrets = accessToken ? [...knownSecrets, accessToken] : knownSecrets;
    const msg = err instanceof Error ? err.message : String(err);
    const code =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AdapterTimeoutError')
        ? 'GWS_TIMEOUT'
        : 'GWS_TRANSPORT_ERROR';
    return envelopeError(502, code, msg, allSecrets);
  }
}
