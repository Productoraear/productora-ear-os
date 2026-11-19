/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — OPAQUE-BOX E2E HELPERS (DOMINO MASTER PLAN SUITE)
 * ════════════════════════════════════════════════════════════════════════════
 * Browserless Node v26+ ESM test harness using `tsx/esm/api` (`tsImport`),
 * direct Next.js App Router handler invocation (`new Request(...)`),
 * Windows-safe `spawnSync` (`cmd.exe /c npm` or direct `node`/`graphify`),
 * and non-crashing `runCase(...)` test isolation.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, '..', '..');

export const KNOWN_GOOD_SSOT_HASH =
  'cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b';

export const GWS_LEAST_PRIVILEGE_SCOPES = Object.freeze([
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar.events',
]);

export const GWS_SHORT_SCOPE_TOKENS = Object.freeze([
  'gmail.readonly',
  'gmail.compose',
  'drive.file',
  'documents',
  'spreadsheets',
  'calendar.events',
]);

export const REQUIRED_OTZARRETA_AREAS = Object.freeze([
  'derio',
  'bilbao',
  'loiu',
  'sondika',
  'zamudio',
  'lezama',
  'mungia',
  'uribe kosta',
  'bizkaia central',
]);

export const FORBIDDEN_OTZARRETA_TOKENS_RE =
  /zarautz|zarauz|gipuzkoa|guipuzcoa|guipúzcoa|zizurkil|santa[\s-]*clara|20800|943[\s-]*131[\s-]*243|943131243|getariako/i;

export const SSRF_UNSAFE_URLS = Object.freeze([
  'http://example.com/a.jpg',
  'https://127.0.0.1/a.jpg',
  'https://169.254.169.254/latest/meta-data',
  'https://10.0.0.1/a.jpg',
  'https://192.168.1.10/a.jpg',
  'https://172.16.0.1/a.jpg',
  'https://localhost/a.jpg',
  'https://[::1]/a.jpg',
  'https://[::ffff:127.0.0.1]/a.jpg',
  'https://[fe80::1]/a.jpg',
  'https://0.0.0.0/a.jpg',
  'https://2130706433/a.jpg',
  'https://metadata.google.internal/computeMetadata/v1/',
  'https://user:pass@example.com/a.jpg',
  'https://example.com:8443/a.jpg',
  'file:///etc/passwd',
  'javascript:alert(1)',
]);

export function stripOtzarretaPurgeClauses(text) {
  return String(text ?? '')
    .replace(
      /\b(?:eliminando|purga(?:ndo|r)?|erradicando|sin\s+(?:conflaci[oó]n(?:es)?|referencias?|menci[oó]n(?:es)?|ubicaci[oó]n(?:es)?|anclaje|rastro)|cero\s+(?:conflaci[oó]n(?:es)?|referencias?|menci[oó]n(?:es)?)|no\s+(?:contienen?|ubique|conflacion[ae]?))(?:(?:\s+(?:con|de|en|a|o|y|ni)\s+|\s*[,()\/]\s*|\s+)(?:zarautz|zarauz|gipuzkoa|guipuzcoa|guipúzcoa|zizurkil|santa[\s-]*clara|20800|943[\s-]*131[\s-]*243|943131243|getariako))+/gi,
      ' ',
    )
    .replace(
      /(?:(?:de|desde|antes)\s+)?\b(?:zarautz|zarauz|gipuzkoa|guipuzcoa|guipúzcoa|zizurkil)\s*(?:->|→)\s*(?:derio|bizkaia)\b|\b(?:de|desde|antes)\s+(?:zarautz|zarauz|gipuzkoa|guipuzcoa|guipúzcoa|zizurkil)\s+(?:a|hacia)\s+(?:derio|bizkaia)\b/gi,
      ' ',
    );
}

const cmdCache = new Map();

export function repoPath(relPath) {
  return path.resolve(ROOT, relPath);
}

export function fileExists(relPath) {
  try {
    return fs.existsSync(repoPath(relPath));
  } catch {
    return false;
  }
}

export function readText(relPath) {
  const abs = repoPath(relPath);
  if (!fs.existsSync(abs)) {
    return { exists: false, content: '', bytes: 0, error: `Missing file: ${relPath}` };
  }
  try {
    const content = fs.readFileSync(abs, 'utf8');
    return { exists: true, content, bytes: Buffer.byteLength(content, 'utf8'), error: null };
  } catch (err) {
    return {
      exists: false,
      content: '',
      bytes: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function readJson(relPath) {
  const res = readText(relPath);
  if (!res.exists) {
    return { exists: false, data: null, content: '', error: res.error };
  }
  try {
    const data = JSON.parse(res.content);
    return { exists: true, data, content: res.content, error: null };
  } catch (err) {
    return {
      exists: true,
      data: null,
      content: res.content,
      error: `Invalid JSON in ${relPath}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export function walkFiles(relDir, extensions = null) {
  const absDir = repoPath(relDir);
  if (!fs.existsSync(absDir)) return [];
  const results = [];
  const skip = new Set(['node_modules', '.next', '.git', 'dist', 'coverage']);

  function visit(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(full);
      } else if (entry.isFile()) {
        if (!extensions || extensions.has(path.extname(entry.name).toLowerCase())) {
          results.push(path.relative(ROOT, full).replace(/\\/g, '/'));
        }
      }
    }
  }

  visit(absDir);
  return results;
}

export function normText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function stripCodeComments(source) {
  return String(source ?? '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:\\"'`])\/\/.*$/gm, '$1 ');
}

let cachedTsImport = null;

export async function tryImportTs(repoRelPath) {
  const abs = repoPath(repoRelPath);
  if (!fs.existsSync(abs)) {
    return {
      ok: false,
      missing: true,
      mod: null,
      error: new Error(`Missing module: ${repoRelPath}`),
    };
  }
  try {
    if (!cachedTsImport) {
      const api = await import('tsx/esm/api');
      cachedTsImport = api.tsImport;
    }
    const mod = await cachedTsImport(pathToFileURL(abs).href, import.meta.url);
    return { ok: true, missing: false, mod, error: null };
  } catch (err) {
    return {
      ok: false,
      missing: false,
      mod: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

export async function invokeRoute(
  repoRelPath,
  method = 'GET',
  { url = 'http://127.0.0.1:3007/', body = undefined, headers = undefined } = {},
) {
  const imp = await tryImportTs(repoRelPath);
  if (!imp.ok) {
    return {
      ok: false,
      missing: imp.missing,
      status: 0,
      headers: null,
      text: '',
      json: null,
      error: imp.error?.message || `Cannot import ${repoRelPath}`,
    };
  }
  const handler = imp.mod?.[method];
  if (typeof handler !== 'function') {
    return {
      ok: false,
      missing: false,
      status: 0,
      headers: null,
      text: '',
      json: null,
      error: `Route ${repoRelPath} does not export ${method} handler`,
    };
  }
  try {
    const reqInit = { method, headers };
    if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
      reqInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    const req = new Request(url, reqInit);
    const response = await handler(req);
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return {
      ok: true,
      missing: false,
      status: response.status,
      headers: response.headers,
      text,
      json,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      missing: false,
      status: 500,
      headers: null,
      text: '',
      json: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function minimalWinEnv() {
  return {
    PATH: process.env.PATH || process.env.Path || '',
    SystemRoot: process.env.SystemRoot || 'C:\\Windows',
    TEMP: process.env.TEMP || '',
    TMP: process.env.TMP || '',
  };
}

export function runCmd(
  cmd,
  args = [],
  { timeoutMs = 60_000, env = null, replaceEnv = false, cacheKey = null, stripWinEnv = false } = {},
) {
  const fullCacheKey = cacheKey
    ? `${cacheKey}::${cmd}::${JSON.stringify(args)}::${JSON.stringify(env ?? null)}::${Boolean(replaceEnv)}::${Boolean(stripWinEnv)}`
    : null;
  if (fullCacheKey && cmdCache.has(fullCacheKey)) {
    return cmdCache.get(fullCacheKey);
  }

  let execBin = cmd;
  let execArgs = [...args];
  if (process.platform === 'win32' && cmd === 'npm') {
    execBin = process.env.ComSpec || 'cmd.exe';
    execArgs = ['/d', '/s', '/c', 'npm', ...args];
  }

  let spawnEnv;
  if (replaceEnv) {
    const base = stripWinEnv ? {} : minimalWinEnv();
    spawnEnv = { ...base };
    if (env && typeof env === 'object') {
      for (const [k, v] of Object.entries(env)) {
        if (v === undefined) delete spawnEnv[k];
        else spawnEnv[k] = v;
      }
    }
  } else {
    spawnEnv = env ? { ...process.env, ...env } : process.env;
  }

  const started = Date.now();
  const res = spawnSync(execBin, execArgs, {
    cwd: ROOT,
    shell: false,
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 16 * 1024 * 1024,
    env: spawnEnv,
    windowsHide: true,
  });
  const durationMs = Date.now() - started;
  const timedOut = Boolean(res.error && res.error.code === 'ETIMEDOUT');

  const out = {
    status: res.status ?? (timedOut ? 124 : 1),
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    timedOut,
    durationMs,
    error: res.error ? res.error.message : null,
  };

  if (fullCacheKey) {
    cmdCache.set(fullCacheKey, out);
  }
  return out;
}

export function runTsInline(
  scriptBody,
  { env = null, replaceEnv = true, inheritProcessEnv = false, timeoutMs = 30_000 } = {},
) {
  const cli = repoPath('node_modules/tsx/dist/cli.mjs');
  const effectiveReplaceEnv = inheritProcessEnv ? false : replaceEnv;
  const childEnv = effectiveReplaceEnv
    ? { ...minimalWinEnv(), ...(env || {}) }
    : env || {};
  return runCmd(process.execPath, [cli, '-e', scriptBody], {
    timeoutMs,
    replaceEnv: effectiveReplaceEnv,
    env: childEnv,
  });
}

export function assert(cond, message) {
  if (!cond) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEqual(actual, expected, label = 'Value mismatch') {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertIncludes(haystack, needle, label = 'Expected substring') {
  const h = String(haystack ?? '');
  if (!h.includes(needle)) {
    throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
  }
}

export function assertMatch(value, regex, label = 'Pattern mismatch') {
  const s = String(value ?? '');
  if (!regex.test(s)) {
    throw new Error(`${label}: ${JSON.stringify(s.slice(0, 180))} did not match ${regex}`);
  }
}

export function assertNoSecretsOrPii(text, forbiddenTokens, label = 'Leak detected') {
  const s = String(text ?? '');
  const sLower = s.toLowerCase();
  const sCompact = s.replace(/[\s\-().]/g, '');
  for (const token of forbiddenTokens) {
    if (!token) continue;
    const tStr = String(token);
    const tLower = tStr.toLowerCase();
    const tEncoded = encodeURIComponent(tStr);
    const tEncodedLower = tEncoded.toLowerCase();
    const isPhoneCandidate = /^[\d\s+\-().]{9,}$/.test(tStr);
    const tDigits = isPhoneCandidate ? tStr.replace(/\D/g, '') : '';
    if (
      s.includes(tStr) ||
      sLower.includes(tLower) ||
      s.includes(tEncoded) ||
      sLower.includes(tEncodedLower) ||
      (tDigits.length >= 9 && sCompact.includes(tDigits))
    ) {
      throw new Error(`${label}: raw secret/PII token leaked (${tStr.slice(0, 6)}...)`);
    }
  }
}

export const assertNoPiiOrSecrets = assertNoSecretsOrPii;

export function assertAdapterReadiness(r, expectedConfigured) {
  assert(r && typeof r === 'object', 'AdapterReadiness must be an object');
  assert(typeof r.adapterId === 'string' && r.adapterId.length > 0, 'adapterId must be non-empty string');
  assert(typeof r.configured === 'boolean', 'configured must be boolean');
  assertEqual(
    r.mode,
    r.configured ? 'READY' : 'UNCONFIGURED',
    `mode mismatch for ${r.adapterId}`,
  );
  assert(Array.isArray(r.missingVars), `missingVars must be array for ${r.adapterId}`);
  if (expectedConfigured !== undefined) {
    assertEqual(r.configured, expectedConfigured, `configured mismatch for ${r.adapterId}`);
  }
  if (!r.configured) {
    assert(r.missingVars.length > 0, `missingVars must be non-empty when ${r.adapterId} is UNCONFIGURED`);
  } else {
    assertEqual(r.missingVars.length, 0, `missingVars must be empty when ${r.adapterId} is READY`);
  }
}

export function assertAdapterEnvelope(env, expected = {}) {
  assert(env && typeof env === 'object', 'AdapterEnvelope must be an object');
  assert(typeof env.ok === 'boolean', 'AdapterEnvelope.ok must be boolean');
  assert(
    ['REAL', 'UNCONFIGURED', 'HITL_BLOCKED', 'ERROR'].includes(env.mode),
    `Invalid AdapterEnvelope.mode: ${JSON.stringify(env.mode)}`,
  );
  assertEqual(env.probed, true, 'AdapterEnvelope.probed must be true');
  assert(
    [200, 400, 403, 503, 502].includes(env.statusCode),
    `Invalid AdapterEnvelope.statusCode: ${JSON.stringify(env.statusCode)}`,
  );
  assert('data' in env, 'AdapterEnvelope must include data field');
  if (!env.ok) {
    assertEqual(env.data, null, 'AdapterEnvelope.data must be null when ok=false');
  }
  assertMatch(env.evidenceSha256, /^[a-f0-9]{64}$/i, 'AdapterEnvelope.evidenceSha256');
  if (expected.ok !== undefined) assertEqual(env.ok, expected.ok, 'envelope.ok');
  if (expected.mode !== undefined) assertEqual(env.mode, expected.mode, 'envelope.mode');
  if (expected.statusCode !== undefined) {
    assertEqual(env.statusCode, expected.statusCode, 'envelope.statusCode');
  }
}

export function assertHitlDecision(dec, expected = {}) {
  assert(dec && typeof dec === 'object', 'HitlGateDecision must be an object');
  assert(typeof dec.allowed === 'boolean', 'HitlGateDecision.allowed must be boolean');
  assert(
    ['5_HITL_TOTAL', '25_REVIEW', '60_SEMI_AUTO', '90_AUTO', '0_FORBIDDEN'].includes(dec.tier),
    `Invalid HitlGateDecision.tier: ${JSON.stringify(dec.tier)}`,
  );
  assert(typeof dec.reason === 'string' && dec.reason.trim().length > 0, 'HitlGateDecision.reason must be non-empty');
  if (expected.allowed !== undefined) assertEqual(dec.allowed, expected.allowed, 'HitlGateDecision.allowed');
  if (expected.tier !== undefined) assertEqual(dec.tier, expected.tier, 'HitlGateDecision.tier');
}

export function findExportedFn(mod, exactNames = [], fallbackRe = null, label = 'exported function') {
  if (!mod || typeof mod !== 'object') {
    throw new Error(`Module not loaded when resolving ${label}`);
  }
  for (const name of exactNames) {
    if (typeof mod[name] === 'function') return mod[name];
  }
  if (fallbackRe) {
    for (const [key, val] of Object.entries(mod)) {
      if (typeof val === 'function' && fallbackRe.test(key)) return val;
    }
  }
  throw new Error(
    `Missing contracted ${label} (tried: ${exactNames.join(', ')}; available exports: ${Object.keys(mod).join(', ')})`,
  );
}

function safeFormatLogArg(arg) {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) {
    const cause = arg.cause ? ` | cause: ${safeFormatLogArg(arg.cause)}` : '';
    return `${arg.stack || arg.message || String(arg)}${cause}`;
  }
  try {
    const seen = new WeakSet();
    return JSON.stringify(arg, (_k, val) => {
      if (val instanceof Error) {
        return val.stack || val.message || String(val);
      }
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    });
  } catch {
    return String(arg);
  }
}

export async function captureConsole(fn) {
  const logs = [];
  const origLog = console.log;
  const origWarn = console.warn;
  const origErr = console.error;
  const origInfo = console.info;
  const origDebug = console.debug;
  const origStdoutWrite = process.stdout.write.bind(process.stdout);
  const origStderrWrite = process.stderr.write.bind(process.stderr);

  const push = (kind) => (...args) => {
    logs.push(`${kind}: ${args.map(safeFormatLogArg).join(' ')}`);
  };
  const pushStream = (kind) => (chunk, encoding, cb) => {
    const str =
      typeof chunk === 'string'
        ? chunk
        : Buffer.isBuffer(chunk)
          ? chunk.toString(typeof encoding === 'string' ? encoding : 'utf8')
          : String(chunk);
    logs.push(`${kind}: ${str}`);
    if (typeof encoding === 'function') encoding();
    else if (typeof cb === 'function') cb();
    return true;
  };

  console.log = push('LOG');
  console.warn = push('WARN');
  console.error = push('ERR');
  console.info = push('INFO');
  console.debug = push('DEBUG');
  process.stdout.write = pushStream('STDOUT');
  process.stderr.write = pushStream('STDERR');
  try {
    const result = await fn();
    return { result, captured: logs.join('\n') };
  } finally {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origErr;
    console.info = origInfo;
    console.debug = origDebug;
    process.stdout.write = origStdoutWrite;
    process.stderr.write = origStderrWrite;
  }
}

export async function withMockFetch(handler, fn) {
  const origFetch = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    return await fn();
  } finally {
    globalThis.fetch = origFetch;
  }
}

export async function runCase(id, tier, area, title, fn) {
  const start = Date.now();
  try {
    await fn();
    return {
      id,
      tier,
      area,
      title,
      status: 'PASS',
      durationMs: Date.now() - start,
      reason: 'OK',
    };
  } catch (err) {
    return {
      id,
      tier,
      area,
      title,
      status: 'FAIL',
      durationMs: Date.now() - start,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
