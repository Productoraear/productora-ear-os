/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR FORENSE — MATRIZ DE TRAZABILIDAD DE CTAs (Ω-REAL, CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el 29/10/2026 el CEO reportó capas flotantes solapadas en
 * móvil (Urgencias 24h, VIP, selector OLED/Airbnb, barra verde legacy) y un CTA
 * «Reservar Actuación VIP» de aspecto inerte. Nada de eso se ve con `tsc`: hace
 * falta un auditor que recorra el DOM declarado y exija destino real.
 *
 * Qué mide (100% estático, coste de red 0,00 €):
 *   1. SUPERFICIES DE VIEWPORT: toda capa `fixed` anclada al borde inferior debe
 *      declarar breakpoint (`lg:hidden` = sólo móvil · `hidden lg:*` = sólo
 *      escritorio), ser consciente del dock (`--ear-dock-h`) o ser overlay
 *      `inset-0`. Sin gate ⇒ `UNCONTROLLED_FIXED_SURFACE` (solape garantizado).
 *   2. CTAs CON DESTINO REAL: cada `<Link>`/`<a href>` debe resolver a una ruta
 *      existente en disco (`src/app/**` con page.tsx o route.ts), a protocolo
 *      válido (`tel:`, `mailto:`, https) o a expresión cableada. `href="#"`,
 *      `href=""` o ruta inexistente ⇒ `DEAD_HREF`.
 *   3. HANDLERS HUÉRFANOS: `<button>` comercial sin `onClick`, sin
 *      `type="submit"`/`form` ni `aria-controls` ⇒ `DEAD_BUTTON`.
 *      `<div|span onClick>` sin `role="button"` ⇒ `DIV_CLICK`.
 *   4. PARIDAD SSOT: los importes canónicos (350 · 100 · 14.250 · 15.000 ·
 *      1,50 · 120) sólo pueden nacer de `ear-os-ssot.ts` en la ruta de venta.
 *   5. CERROJOS DE LA MISIÓN: selector de diseño fuera de móvil, navbar opaca,
 *      padding superior del hero, CTA VIP cableado y barra verde erradicada.
 *
 * Alcance declarado (honesto, sin bolsillos ocultos):
 *   · ANCHORS: `src/app/**` + `src/components/home/**` + `src/components/mariachi/**`
 *   · INTERACTIVOS Y SUPERFICIES: shell montado (BFS de imports desde
 *     `src/app/layout.tsx` + `src/app/page.tsx`) + los mismos directorios home.
 *   · Los anclas muertas FUERA del alcance comercial no bloquean: se reportan
 *     como `debt` con su recuento exacto. Nunca se disfrazan de verde.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/audit_cta_trace_matrix.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/audit_cta_trace_matrix.ts --verbose
 *
 * Salida: `reports/FORENSIC_CTA_TRACE_MATRIX.json`
 * Exit: 0 = 0 violaciones · 1 = violaciones · 2 = error de entorno.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  LOGISTICA_EUR_PER_KM,
  SUPLEMENTO_HOTEL_EUR,
  SPLIT_SOBERANO,
} from '../src/lib/constants/ear-os-ssot';

/* ─────────────────────────── Infraestructura ─────────────────────────────── */

const REPO_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const APP_DIR = path.join(REPO_ROOT, 'src', 'app');
const REPORT_DIR = path.join(REPO_ROOT, 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'FORENSIC_CTA_TRACE_MATRIX.json');
const VERBOSE = process.argv.includes('--verbose');

const ANCHOR_ROOTS: readonly string[] = [
  APP_DIR,
  path.join(REPO_ROOT, 'src', 'components', 'home'),
  path.join(REPO_ROOT, 'src', 'components', 'mariachi'),
];

const INTERACTIVE_EXTRA_ROOTS: readonly string[] = [
  path.join(REPO_ROOT, 'src', 'components', 'home'),
  path.join(REPO_ROOT, 'src', 'components', 'mariachi'),
];

const SHELL_ENTRYPOINTS: readonly string[] = [
  path.join(APP_DIR, 'layout.tsx'),
  path.join(APP_DIR, 'page.tsx'),
];

/** Léxico comercial: sólo estos CTAs exigen handler sí o sí. */
const COMMERCIAL_LEXICON =
  /(reserv|bloque|fianza|dep[oó]sito|presupuest|cotiz|contrat|comprar|pagar|llamar|whatsapp|urgencia|\bvip\b|dossier|solicit|tramitar|conocer|ver proveedores|asesor|tarifa|precio)/i;

/** Importes canónicos: deben provenir del SSOT, jamás de un literal suelto. */
const CANONICAL_MONEY: ReadonlyArray<{ label: string; value: number; literals: readonly string[] }> = [
  { label: 'TARIFA_BASE_SOLISTA_EUR', value: TARIFA_BASE_SOLISTA_EUR, literals: ['350', '350,00'] },
  { label: 'DEPOSITO_STRIPE_EUR', value: DEPOSITO_STRIPE_EUR, literals: ['100', '100,00'] },
  { label: 'AJUSTE_PREVENTIVO_B2G_EUR', value: AJUSTE_PREVENTIVO_B2G_EUR, literals: ['14.250', '14250', '14250,00'] },
  { label: 'LIMITE_B2G_LCSP_EUR', value: LIMITE_B2G_LCSP_EUR, literals: ['15.000', '15000', '15000,00'] },
  { label: 'LOGISTICA_EUR_PER_KM', value: LOGISTICA_EUR_PER_KM, literals: ['1,50'] },
  { label: 'SUPLEMENTO_HOTEL_EUR', value: SUPLEMENTO_HOTEL_EUR, literals: ['120'] },
];

const SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'] as const;
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

/* ─────────────────────────── Tipos del informe ───────────────────────────── */

type Severity = 'violation' | 'debt';

interface CtaTrace {
  file: string;
  line: number;
  kind: 'anchor' | 'button' | 'clickable-div';
  label: string;
  target: string;
  trace: string;
  status: 'WIRED' | 'WARN' | 'VIOLATION' | 'DEBT';
  notes: string[];
}

interface SurfaceTrace {
  file: string;
  line: number;
  surface: string;
  gate: string;
  status: 'GATED' | 'VIOLATION';
}

interface Violation {
  code: string;
  severity: Severity;
  file: string;
  line: number;
  detail: string;
}

interface GateCheck {
  id: string;
  title: string;
  ok: boolean;
  evidence: string;
}

const ctaTraces: CtaTrace[] = [];
const surfaces: SurfaceTrace[] = [];
const violations: Violation[] = [];

/* ───────────────────────────── Utilidades FS ─────────────────────────────── */

function rel(abs: string): string {
  return path.relative(REPO_ROOT, abs).split(path.sep).join('/');
}

function readSource(file: string): string {
  return readFileSync(file, 'utf8');
}

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) continue;
      walk(abs, out);
    } else if (SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      out.push(abs);
    }
  }
  return out;
}

function lineOf(source: string, index: number): number {
  let line = 1;
  const limit = Math.min(index, source.length);
  for (let i = 0; i < limit; i += 1) {
    if (source[i] === '\n') line += 1;
  }
  return line;
}

/**
 * Blanquea comentarios JSX (`{/* … *\/}`) y de bloque conservando longitud y
 * saltos de línea: así no se confunden ejemplos de `<Link>` escritos en prosa
 * con CTAs reales, y los números de línea del informe siguen siendo exactos.
 */
function stripComments(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    if (source.startsWith('{/*', i) || source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      for (let k = i; k < stop; k += 1) out += source[k] === '\n' ? '\n' : ' ';
      i = stop;
      continue;
    }
    out += source[i];
    i += 1;
  }
  return out;
}

/* ──────────────────────── Escáner de etiquetas JSX ───────────────────────── */

interface TagToken {
  name: string;
  attrs: string;
  closing: boolean;
  selfClosing: boolean;
  start: number;
  /** Etiquetas ancestro abiertas en el momento de encontrar esta. */
  ancestors: readonly string[];
}

/**
 * Recorre el fichero y devuelve las etiquetas JSX/HTML con su pila de ancestros.
 * No es un parser de AST completo (coste $0,00 y cero dependencias), pero
 * respeta cadenas y llaves para no partir expresiones como `onClick={() => x}`.
 */
function scanTags(source: string): TagToken[] {
  const tags: TagToken[] = [];
  const stack: string[] = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] !== '<') {
      i += 1;
      continue;
    }
    const closing = source[i + 1] === '/';
    const nameStart = closing ? i + 2 : i + 1;
    if (!/[A-Za-z]/.test(source[nameStart] ?? '')) {
      i += 1;
      continue;
    }
    let j = nameStart;
    while (j < source.length && /[A-Za-z0-9_.$:-]/.test(source[j] ?? '')) j += 1;
    const name = source.slice(nameStart, j);
    let depth = 0;
    let quote: string | null = null;
    let k = j;
    let wellFormed = false;
    while (k < source.length) {
      const c = source[k] ?? '';
      if (quote !== null) {
        if (c === quote && source[k - 1] !== '\\') quote = null;
        k += 1;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') {
        quote = c;
        k += 1;
        continue;
      }
      if (c === '{') {
        depth += 1;
        k += 1;
        continue;
      }
      if (c === '}') {
        depth = Math.max(0, depth - 1);
        k += 1;
        continue;
      }
      if (depth === 0 && c === '>') {
        wellFormed = true;
        break;
      }
      if (depth === 0 && c === '<') break;
      k += 1;
    }
    if (!wellFormed) {
      i += 1;
      continue;
    }
    const attrs = source.slice(j, k);
    const selfClosing = attrs.trimEnd().endsWith('/');
    const token: TagToken = {
      name,
      attrs,
      closing,
      selfClosing,
      start: i,
      ancestors: [...stack],
    };
    tags.push(token);
    if (closing) {
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s] === name) {
          stack.length = s;
          break;
        }
      }
    } else if (!selfClosing && !VOID_TAGS.has(name.toLowerCase())) {
      stack.push(name);
    }
    i = k + 1;
  }
  return tags;
}

/** Lee el valor crudo de un atributo preservando si es literal o expresión. */
function rawAttr(attrs: string, name: string): { raw: string; literal: string | null } | null {
  const pattern = new RegExp(`(?:^|\\s)${name}\\s*=`, 'm');
  const match = pattern.exec(attrs);
  if (match === null) return null;
  let cursor = match.index + match[0].length;
  while (cursor < attrs.length && /\s/.test(attrs[cursor] ?? '')) cursor += 1;
  const opener = attrs[cursor] ?? '';
  if (opener === '"' || opener === "'" || opener === '`') {
    const close = attrs.indexOf(opener, cursor + 1);
    const end = close === -1 ? attrs.length : close;
    const value = attrs.slice(cursor + 1, end);
    return { raw: value, literal: value };
  }
  if (opener === '{') {
    let depth = 0;
    let idx = cursor;
    for (; idx < attrs.length; idx += 1) {
      const c = attrs[idx] ?? '';
      if (c === '{') depth += 1;
      else if (c === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const value = attrs.slice(cursor + 1, idx).trim();
    return { raw: value, literal: value.startsWith('`') ? value.slice(1, -1) : null };
  }
  return { raw: opener, literal: null };
}

/** Texto visible inmediatamente posterior a la etiqueta (o `aria-label`). */
function labelOf(source: string, tag: TagToken): string {
  const aria = rawAttr(tag.attrs, 'aria-label');
  const ariaText = aria?.literal ?? aria?.raw ?? '';
  const after = source.slice(tag.start, Math.min(source.length, tag.start + 800));
  const textStart = after.indexOf('>');
  let text = textStart === -1 ? '' : after.slice(textStart + 1);
  const stop = text.search(/</);
  if (stop !== -1) text = text.slice(0, stop);
  text = text.replace(/\{[^{}]*\}/g, ' ').replace(/\s+/g, ' ').trim();
  const combined = [text, ariaText].filter((part) => part.length > 0).join(' · ');
  return combined.length > 0 ? combined.slice(0, 90) : '(sin texto)';
}
/* ───────────────────────── Índice real de rutas ──────────────────────────── */

interface RouteIndex {
  exact: Set<string>;
  dynamic: Array<{ pattern: string; catchAll: boolean }>;
}

function urlPathOf(file: string): string {
  const relative = path.relative(APP_DIR, file).split(path.sep).join('/');
  const segments = relative.split('/').slice(0, -1);
  const visible = segments.filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')) && seg.length > 0);
  const pattern = visible
    .map((seg) => (seg.startsWith('[[...') || seg.startsWith('[...') || seg.startsWith('[') ? '*' : seg))
    .join('/');
  return `/${pattern}`;
}

function collectRouteIndex(): RouteIndex {
  const exact = new Set<string>();
  const dynamic: Array<{ pattern: string; catchAll: boolean }> = [];
  for (const file of walk(APP_DIR)) {
    const base = path.basename(file);
    const isPage = /^page\.(tsx|ts|jsx|js)$/.test(base);
    const isRoute = /^route\.(tsx|ts|jsx|js)$/.test(base);
    if (!isPage && !isRoute) continue;
    const url = urlPathOf(file);
    const rawSegments = path.relative(APP_DIR, file).split(path.sep);
    const catchAll = rawSegments.some((seg) => seg.startsWith('[...') || seg.startsWith('[[...'));
    if (!url.includes('*')) {
      exact.add(url === '' ? '/' : url);
      continue;
    }
    dynamic.push({ pattern: url, catchAll });
  }
  return { exact, dynamic };
}

function splitPath(target: string): string[] {
  return target.split('/').filter((seg) => seg.length > 0);
}

function matchDynamic(pattern: string, segments: readonly string[]): 'full' | 'catchall' | null {
  const parts = splitPath(pattern);
  for (let idx = 0; idx < parts.length; idx += 1) {
    const part = parts[idx] ?? '';
    if (part === '*') {
      const isLast = idx === parts.length - 1;
      if (!isLast) return null;
      return idx <= segments.length ? 'catchall' : null;
    }
    if (segments[idx] !== part) return null;
  }
  return parts.length === segments.length ? 'full' : null;
}

type RouteResolution =
  | { kind: 'EXACT' }
  | { kind: 'DYNAMIC'; pattern: string }
  | { kind: 'CATCHALL'; pattern: string }
  | { kind: 'MISSING' };

function resolveRoute(target: string, index: RouteIndex): RouteResolution {
  const clean = target.split('?')[0]?.split('#')[0] ?? target;
  if (clean === '/' || clean === '') return index.exact.has('/') ? { kind: 'EXACT' } : { kind: 'MISSING' };
  if (index.exact.has(clean)) return { kind: 'EXACT' };
  const segments = splitPath(clean);
  for (const route of index.dynamic) {
    if (route.catchAll) continue;
    if (matchDynamic(route.pattern, segments) === 'full') return { kind: 'DYNAMIC', pattern: route.pattern };
  }
  for (const route of index.dynamic) {
    if (matchDynamic(route.pattern, segments) !== null) return { kind: 'CATCHALL', pattern: route.pattern };
  }
  return { kind: 'MISSING' };
}

/* ──────────────── Grafo de imports: shell realmente montado ──────────────── */

type PathMap = ReadonlyArray<readonly [string, readonly string[]]>;

function loadPathMap(): PathMap {
  try {
    const parsed = JSON.parse(readSource(path.join(REPO_ROOT, 'tsconfig.json'))) as {
      compilerOptions?: { paths?: Record<string, string[] | string> };
    };
    const raw = parsed.compilerOptions?.paths ?? {};
    return Object.entries(raw).map(([pattern, targets]) => {
      const list = Array.isArray(targets) ? targets : [targets];
      return [pattern, list] as const;
    });
  } catch {
    return [];
  }
}

const PATH_MAP = loadPathMap();

function candidateFiles(base: string): string[] {
  const out: string[] = [];
  for (const ext of SOURCE_EXTENSIONS) out.push(`${base}${ext}`);
  for (const ext of SOURCE_EXTENSIONS) out.push(path.join(base, `index${ext}`));
  return out;
}

function resolveImport(fromFile: string, spec: string): string | null {
  const bases: string[] = [];
  if (spec.startsWith('.')) {
    bases.push(path.resolve(path.dirname(fromFile), spec));
  } else {
    for (const [pattern, targets] of PATH_MAP) {
      const starAt = pattern.indexOf('*');
      if (starAt === -1) continue;
      const prefix = pattern.slice(0, starAt);
      const suffix = pattern.slice(starAt + 1);
      if (!spec.startsWith(prefix)) continue;
      if (suffix.length > 0 && !spec.endsWith(suffix)) continue;
      const wildcard = spec.slice(prefix.length, spec.length - suffix.length);
      for (const target of targets) {
        bases.push(path.resolve(REPO_ROOT, target.replace('*', wildcard)));
      }
      break;
    }
  }
  for (const base of bases) {
    for (const candidate of candidateFiles(base)) {
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

function importsOf(file: string): string[] {
  const source = readSource(file);
  const specs: string[] = [];
  const pattern = /(?:from\s+|import\s+|require\(\s*)['"]([^'"]+)['"]/g;
  let match = pattern.exec(source);
  while (match !== null) {
    const spec = match[1] ?? '';
    if (spec.length > 0) specs.push(spec);
    match = pattern.exec(source);
  }
  return specs;
}

function collectMountedShell(): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = SHELL_ENTRYPOINTS.filter((entry) => existsSync(entry));
  let guard = 0;
  while (queue.length > 0 && guard < 4000) {
    guard += 1;
    const current = queue.shift();
    if (current === undefined) break;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const spec of importsOf(current)) {
      const resolved = resolveImport(current, spec);
      if (resolved !== null && !visited.has(resolved)) queue.push(resolved);
    }
  }
  return visited;
}

/* ───────────────────────── Clasificación de destinos ─────────────────────── */

const EXTERNAL_PROTOCOL = /^(https?:\/\/|tel:|mailto:|sms:|whatsapp:|geo:|maps:)/i;

function normalizeAmount(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.includes(',')) {
    // Formato español: 14.250,00 → punto = millares, coma = decimales.
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    const last = parts[parts.length - 1] ?? '';
    // 14.250 → millares · 1.00 → decimal (jamás 100 €).
    if (parts.length > 2 || last.length === 3) cleaned = parts.join('');
  }
  const numeric = Number.parseFloat(cleaned);
  if (!Number.isFinite(numeric)) return raw;
  return String(numeric);
}

const CANONICAL_AMOUNTS = new Set(CANONICAL_MONEY.map((entry) => normalizeAmount(entry.literals[0] ?? '')));

function classifyHref(
  raw: string | null,
  literal: string | null,
  routes: RouteIndex,
): { trace: string; status: 'WIRED' | 'WARN' | 'VIOLATION'; notes: string[] } {
  if (raw === null) {
    return { trace: 'SIN_HREF', status: 'VIOLATION', notes: ['Ancla sin atributo href: clic muerto garantizado.'] };
  }
  if (literal === null) {
    if (raw.includes('/')) {
      const staticPrefix = raw.replace(/\$\{[^}]*\}/g, '').replace(/[`'"\s]/g, '');
      const candidate = staticPrefix.startsWith('/') ? staticPrefix.split('?')[0] ?? staticPrefix : '';
      if (candidate.length > 1) {
        const resolution = resolveRoute(candidate, routes);
        if (resolution.kind === 'EXACT') {
          return { trace: `EXPR→${candidate} (EXACT)`, status: 'WIRED', notes: ['Plantilla con prefijo verificable.'] };
        }
        if (resolution.kind !== 'MISSING') {
          return { trace: `EXPR→${candidate} (${resolution.kind})`, status: 'WARN', notes: ['Prefijo de plantilla dinámico.'] };
        }
        return {
          trace: `EXPR→${candidate} (MISSING)`,
          status: 'VIOLATION',
          notes: ['El prefijo estático de la plantilla no existe como ruta.'],
        };
      }
    }
    return { trace: `EXPR(${raw.slice(0, 60)})`, status: 'WARN', notes: ['Destino por expresión: requiere traza del dato de origen.'] };
  }
  const target = literal.trim();
  if (target.length === 0) {
    return { trace: 'HREF_VACIO', status: 'VIOLATION', notes: ['href="" recarga la misma página: clic muerto.'] };
  }
  if (target === '#') {
    return { trace: '#', status: 'VIOLATION', notes: ['href="#" es un placeholder de fachada.'] };
  }
  if (/^javascript:/i.test(target)) {
    return { trace: target, status: 'VIOLATION', notes: ['javascript: URL prohibida (CSP/ASVS).'] };
  }
  if (target.startsWith('#')) {
    return { trace: target, status: 'WARN', notes: ['Ancla interna: válida sólo si el id existe en el DOM.'] };
  }
  if (EXTERNAL_PROTOCOL.test(target)) {
    return { trace: target, status: 'WIRED', notes: ['Protocolo externo/teléfono válido.'] };
  }
  if (target.startsWith('/')) {
    const resolution = resolveRoute(target, routes);
    if (resolution.kind === 'EXACT') return { trace: `${target} → EXACT`, status: 'WIRED', notes: [] };
    if (resolution.kind === 'DYNAMIC') {
      return { trace: `${target} → ${resolution.pattern}`, status: 'WARN', notes: ['Ruta dinámica existente.'] };
    }
    if (resolution.kind === 'CATCHALL') {
      return { trace: `${target} → ${resolution.pattern}`, status: 'WARN', notes: ['Cae en catch-all: verificar contenido real.'] };
    }
    return {
      trace: `${target} → MISSING`,
      status: 'VIOLATION',
      notes: ['No existe page.tsx ni route.ts para esta ruta: 404 garantizado.'],
    };
  }
  if (/^(ftp|data|blob):/i.test(target)) {
    return { trace: target, status: 'WARN', notes: ['Esquema no comercial.'] };
  }
  return { trace: target, status: 'WARN', notes: ['Ruta relativa sin verificación estática.'] };
}


/* ─────────────────────────── Auditoría por fichero ───────────────────────── */

const BUTTON_WIRING =
  /(onClick|onPointerDown|onMouseDown|onSubmit|type\s*=\s*["']submit["']|formAction|form\s*=|aria-controls|popovertarget)/i;

function auditCtas(file: string, source: string, routes: RouteIndex, blocking: boolean): void {
  const tags = scanTags(stripComments(source));
  const severity: Severity = blocking ? 'violation' : 'debt';

  const push = (entry: CtaTrace, code: string, detail: string): void => {
    ctaTraces.push(entry);
    if (entry.status === 'VIOLATION' || entry.status === 'DEBT') {
      violations.push({
        code,
        severity: entry.status === 'DEBT' ? 'debt' : severity,
        file: entry.file,
        line: entry.line,
        detail,
      });
    }
  };

  for (const tag of tags) {
    if (tag.closing) continue;
    const line = lineOf(source, tag.start);

    if (tag.name === 'Link' || tag.name === 'a') {
      const href = rawAttr(tag.attrs, 'href');
      const verdict = classifyHref(href?.raw ?? null, href?.literal ?? null, routes);
      const nested = tag.ancestors.some((name) => name === 'Link' || name === 'a');
      const notes = [...verdict.notes];
      if (nested) notes.push('Ancla anidada dentro de otra ancla (DOM inválido).');
      const status: CtaTrace['status'] =
        verdict.status === 'VIOLATION' ? (blocking ? 'VIOLATION' : 'DEBT') : verdict.status;
      push(
        {
          file: rel(file),
          line,
          kind: 'anchor',
          label: labelOf(source, tag),
          target: verdict.trace,
          trace: verdict.status === 'WIRED' ? 'href verificado' : 'href no verificado',
          status: nested ? (blocking ? 'VIOLATION' : 'DEBT') : status,
          notes,
        },
        nested ? 'NESTED_ANCHOR' : 'DEAD_HREF',
        nested ? 'Ancla anidada en otra ancla.' : `Destino inerte: ${verdict.trace}`,
      );
      continue;
    }

    if (tag.name === 'button') {
      const wired = BUTTON_WIRING.test(tag.attrs) || tag.ancestors.includes('form');
      const label = labelOf(source, tag);
      if (wired) {
        ctaTraces.push({
          file: rel(file), line, kind: 'button', label,
          target: 'handler declarado', trace: 'handler verificado', status: 'WIRED', notes: [],
        });
      } else {
        const commercial = COMMERCIAL_LEXICON.test(label);
        push(
          {
            file: rel(file), line, kind: 'button', label,
            target: 'sin onClick/submit',
            trace: commercial ? 'handler ausente' : 'decorativo',
            status: commercial ? (blocking ? 'VIOLATION' : 'DEBT') : 'WARN',
            notes: commercial
              ? ['Botón comercial sin escritura ni navegación.']
              : ['Botón no comercial sin handler (aceptable si es estático).'],
          },
          'DEAD_BUTTON',
          `Botón «${label}» sin handler ni destino.`,
        );
      }
      continue;
    }

    if ((tag.name === 'div' || tag.name === 'span') && /\sonClick\s*=/.test(tag.attrs)) {
      const hasRole = /role\s*=\s*["']button["']/.test(tag.attrs);
      const hasKeyboard = /onKeyDown|onKeyUp|onKeyPress/.test(tag.attrs);
      push(
        {
          file: rel(file), line, kind: 'clickable-div', label: labelOf(source, tag),
          target: hasRole ? 'div[role=button]' : 'div sin role',
          trace: hasRole && hasKeyboard ? 'accesible' : 'accesibilidad incompleta',
          status: hasRole ? 'WARN' : blocking ? 'VIOLATION' : 'DEBT',
          notes: [
            'Prohibido <div onClick> sin role/teclado (Doctrina de Fricción Cero).',
            hasKeyboard ? 'Tiene teclado.' : 'Sin soporte de teclado.',
          ],
        },
        'DIV_CLICK',
        'Elemento clicable no semántico sin role="button".',
      );
    }
  }
}

/* ─────────────── Superficies de viewport (anti-solape móvil) ─────────────── */

const DESKTOP_GATE = /\bhidden\b[\s\S]*?\blg:(?:flex|block|grid|inline-flex|inline-block|contents)\b/;

function auditSurfaces(file: string, source: string): void {
  const tags = scanTags(stripComments(source));
  for (const tag of tags) {
    if (tag.closing) continue;
    const cls = rawAttr(tag.attrs, 'className')?.raw ?? '';
    if (!/\bfixed\b/.test(cls)) continue;
    const bottomAnchored = /(?:^|[\s"'`])(?:[\w-]+:)*bottom-(?:0(?![\d.])|\[|\d)/.test(cls);
    if (!bottomAnchored) continue;

    let gate = '';
    let status: SurfaceTrace['status'] = 'GATED';
    if (/\blg:hidden\b/.test(cls)) {
      gate = 'lg:hidden → sólo móvil';
    } else if (DESKTOP_GATE.test(cls)) {
      gate = 'hidden lg:* → sólo escritorio';
    } else if (cls.includes('--ear-dock-h')) {
      gate = 'dock-aware (--ear-dock-h)';
    } else if (/\binset-0\b/.test(cls) && !/\bbottom-0\b/.test(cls)) {
      gate = 'overlay inset-0';
    } else {
      gate = 'SIN GATE DE BREAKPOINT';
      status = 'VIOLATION';
      violations.push({
        code: 'UNCONTROLLED_FIXED_SURFACE',
        severity: 'violation',
        file: rel(file),
        line: lineOf(source, tag.start),
        detail: `Capa fija inferior sin breakpoint (solapa con el dock móvil): ${cls.slice(0, 120)}`,
      });
    }
    if (/25D366/i.test(cls) || /25D366/i.test(tag.attrs)) {
      violations.push({
        code: 'LEGACY_GREEN_BAR',
        severity: status === 'VIOLATION' ? 'violation' : 'debt',
        file: rel(file),
        line: lineOf(source, tag.start),
        detail: 'Superficie flotante con el verde legacy #25D366 (barra WhatsApp duplicada).',
      });
    }
    surfaces.push({
      file: rel(file),
      line: lineOf(source, tag.start),
      surface: path.basename(file),
      gate,
      status,
    });
  }
}

/* ─────────────────── Paridad de importes contra el SSOT ──────────────────── */

/**
 * Superficies donde un importe ES dinero (no copy): checkout, reservas, pagos,
 * precios, finanzas y Stripe. Ahí un literal es un fallo P0; en el resto del
 * repo (SEO, índices de búsqueda, gramática de voz) se declara deriva `debt`.
 */
const MONEY_ENGINE_HINT = /(^|\/)(reservar|checkout|payment|pricing|finance|stripe|quote|b2g)(\/|\.|$)/i;

function auditMoney(file: string, source: string, blocking: boolean): void {
  if (file.endsWith('ear-os-ssot.ts')) return;
  const clean = stripComments(source);
  const importsSsot = /ear-os-ssot/.test(clean);
  const seen = new Map<string, number>();
  const pattern = /(\d[\d.]*(?:,\d+)?)\s*€/g;
  let match = pattern.exec(clean);
  while (match !== null) {
    const amount = normalizeAmount(match[1] ?? '');
    if (CANONICAL_AMOUNTS.has(amount) && !seen.has(amount)) {
      seen.set(amount, lineOf(clean, match.index));
    }
    match = pattern.exec(clean);
  }
  if (importsSsot || seen.size === 0) return;
  const engine = MONEY_ENGINE_HINT.test(`/${rel(file)}`);
  for (const [amount, line] of seen.entries()) {
    violations.push(
      engine
        ? {
            code: 'PRICE_HARDCODED',
            severity: blocking ? 'violation' : 'debt',
            file: rel(file),
            line,
            detail: `Importe canónico ${amount} € como literal en superficie de dinero sin importar ear-os-ssot.ts.`,
          }
        : {
            code: 'PRICE_LITERAL_DRIFT',
            severity: 'debt',
            file: rel(file),
            line,
            detail: `Copia de importe canónico (${amount} €) fuera del SSOT: riesgo de deriva de copy.`,
          },
    );
  }
}

/* ─────────────────── CerrojOS de la misión (done_when real) ──────────────── */

const SRC_FILES = walk(path.join(REPO_ROOT, 'src'));

function findByName(name: string): string | null {
  const candidates = SRC_FILES.filter((file) => path.basename(file) === name);
  if (candidates.length === 0) return null;
  const score = (file: string): number => {
    const relative = rel(file);
    const inApp = relative.startsWith('src/app/') ? 0 : 10;
    const isVault = relative.includes('adn_vault') ? 5 : 0;
    return inApp + isVault + relative.split('/').length;
  };
  return [...candidates].sort((a, b) => score(a) - score(b))[0] ?? null;
}

function fileContains(name: string, needles: readonly string[]): { ok: boolean; evidence: string } {
  const file = findByName(name);
  if (file === null) return { ok: false, evidence: `${name} no existe en src/` };
  const source = readSource(file);
  const missing = needles.filter((needle) => !source.includes(needle));
  return {
    ok: missing.length === 0,
    evidence:
      missing.length === 0
        ? `${rel(file)} contiene ${needles.length}/${needles.length} marcadores`
        : `${rel(file)} carece de: ${missing.join(', ')}`,
  };
}

interface CtaHrefLiteral {
  file: string;
  line: number;
  value: string;
  resolution: RouteResolution['kind'];
}

function collectCtaHrefLiterals(routes: RouteIndex): CtaHrefLiteral[] {
  const found: CtaHrefLiteral[] = [];
  for (const file of SRC_FILES) {
    const source = readSource(file);
    if (!source.includes('ctaHref')) continue;
    const pattern = /ctaHref\s*:\s*['"`]([^'"`]+)['"`]/g;
    let match = pattern.exec(source);
    while (match !== null) {
      const value = match[1] ?? '';
      found.push({
        file: rel(file),
        line: lineOf(source, match.index),
        value,
        resolution: resolveRoute(value, routes).kind,
      });
      match = pattern.exec(source);
    }
  }
  return found;
}

function buildGates(routes: RouteIndex): GateCheck[] {
  const gates: GateCheck[] = [];

  const surfaceViolations = surfaces.filter((surface) => surface.status === 'VIOLATION');
  gates.push({
    id: 'G01_MOBILE_SINGLE_SURFACE',
    title: 'Superficie única del viewport: toda capa fija inferior declara su breakpoint',
    ok: surfaceViolations.length === 0,
    evidence:
      surfaceViolations.length === 0
        ? `${surfaces.length} capas fijas auditadas, ${surfaces.length} con gate explícito`
        : `${surfaceViolations.length} capas sin gate: ${surfaceViolations.map((s) => `${s.file}:${s.line}`).join(', ')}`,
  });

  const theme = fileContains('AirbnbThemeToggleFloating.tsx', [
    'min-width: 1024px',
    'matchMedia',
    'hidden',
    'lg:block',
    'data-ear-surface',
  ]);
  const hudGesture = fileContains('SovereignMobileHUD.tsx', ['canToggleTheme', 'startLongPress']);
  gates.push({
    id: 'G02_THEME_SELECTOR_NOT_ON_MOBILE',
    title: 'Selector OLED/Airbnb: triple cerrojo (env + matchMedia + CSS) y gesto HUD sellado',
    ok: theme.ok && hudGesture.ok,
    evidence: `${theme.evidence} · ${hudGesture.evidence}`,
  });

  const bifurcation = fileContains('SovereignEntryBifurcation.tsx', ['href={card.ctaHref}', 'focus-visible']);
  const hrefs = collectCtaHrefLiterals(routes);
  const brokenHrefs = hrefs.filter((entry) => entry.resolution === 'MISSING');
  gates.push({
    id: 'G03_VIP_CTA_WIRED',
    title: 'CTA «Reservar Actuación VIP» es ancla focusable con destino real',
    ok: bifurcation.ok && hrefs.length > 0 && brokenHrefs.length === 0,
    evidence: `${bifurcation.evidence} · ctaHref literales: ${hrefs.length}, roto(s): ${brokenHrefs.length}`,
  });

  const pageHeader = fileContains('page.tsx', ['bg-black/95', 'backdrop-blur-2xl']);
  const navbar = fileContains('SovereignNavbar.tsx', ['bg-black/95', 'backdrop-blur-2xl', 'border-b']);
  gates.push({
    id: 'G04_HEADER_OPAQUE',
    title: 'Cabecera opaca con blur (sin sangrado del hero al hacer scroll)',
    ok: pageHeader.ok && navbar.ok,
    evidence: `${pageHeader.evidence} · ${navbar.evidence}`,
  });

  const padding = fileContains('page.tsx', ['pt-28', 'pt-32']);
  gates.push({
    id: 'G05_HERO_TOP_PADDING',
    title: 'Padding superior del hero alineado con la cabecera fija',
    ok: padding.ok,
    evidence: padding.evidence,
  });

  const legacyPath = path.join(REPO_ROOT, 'src', 'app', 'components', 'public', 'ClickToCallBar.tsx');
  const legacyImports = SRC_FILES.filter((file) => readSource(file).includes('ClickToCallBar')).map(rel);
  const legacySurfaces = surfaces.filter((surface) => surface.file.includes('ClickToCallBar'));
  gates.push({
    id: 'G06_LEGACY_GREEN_BAR_ERADICATED',
    title: 'Barra verde legacy #25D366 eliminada y sin importadores',
    ok: !existsSync(legacyPath) && legacyImports.length === 0 && legacySurfaces.length === 0,
    evidence: !existsSync(legacyPath)
      ? `fichero eliminado · importadores: ${legacyImports.length}`
      : `fichero aún presente en ${rel(legacyPath)}`,
  });

  const splitSum = SPLIT_SOBERANO.artista + SPLIT_SOBERANO.earOs + SPLIT_SOBERANO.vimume;
  const ssotOk =
    TARIFA_BASE_SOLISTA_EUR === 350 &&
    DEPOSITO_STRIPE_EUR === 100 &&
    AJUSTE_PREVENTIVO_B2G_EUR === 14250 &&
    LIMITE_B2G_LCSP_EUR === 15000 &&
    Math.abs(splitSum - 1) < 1e-9;
  gates.push({
    id: 'G07_SSOT_INVARIANTS',
    title: 'Invariantes inmutables (350 · 100 · 14.250 · 15.000 · split 80/10/10)',
    ok: ssotOk,
    evidence: `tarifa=${TARIFA_BASE_SOLISTA_EUR} depósito=${DEPOSITO_STRIPE_EUR} b2g=${AJUSTE_PREVENTIVO_B2G_EUR}/${LIMITE_B2G_LCSP_EUR} split=${splitSum.toFixed(2)}`,
  });

  const priceViolations = violations.filter((v) => v.code === 'PRICE_HARDCODED' && v.severity === 'violation');
  const priceDrift = violations.filter((v) => v.code === 'PRICE_LITERAL_DRIFT');
  gates.push({
    id: 'G08_PRICE_PROVENANCE',
    title: 'Cero importes canónicos hardcodeados en superficies de dinero',
    ok: priceViolations.length === 0,
    evidence:
      priceViolations.length === 0
        ? `motores de dinero 100% SSOT · copias de copy declaradas como deuda: ${priceDrift.length}`
        : priceViolations.map((v) => `${v.file}:${v.line}`).join(', '),
  });

  return gates;
}

/* ─────────────────────────────── Ejecución ──────────────────────────────── */

interface ReportTotals {
  filesAnchors: number;
  filesShell: number;
  filesAuditedInteractive: number;
  routesExact: number;
  routesDynamic: number;
  ctas: number;
  ctasWired: number;
  ctasWarn: number;
  violations: number;
  debt: number;
  surfaces: number;
  surfacesGated: number;
}

function main(): void {
  const startedAt = Date.now();
  if (!existsSync(APP_DIR)) {
    console.error(`[Ω-CTA] ERROR DE ENTORNO: no existe ${rel(APP_DIR)}. Ejecuta desde la raíz del repo.`);
    process.exit(2);
  }

  const routes = collectRouteIndex();
  const shell = collectMountedShell();

  const anchorFiles = new Set<string>();
  for (const root of ANCHOR_ROOTS) for (const file of walk(root)) anchorFiles.add(file);

  const interactiveFiles = new Set<string>(shell);
  for (const root of INTERACTIVE_EXTRA_ROOTS) for (const file of walk(root)) interactiveFiles.add(file);

  for (const file of anchorFiles) {
    const source = readSource(file);
    const blocking = interactiveFiles.has(file);
    auditCtas(file, source, routes, blocking);
  }
  for (const file of interactiveFiles) {
    const source = readSource(file);
    auditSurfaces(file, source);
    auditMoney(file, source, true);
  }

  const gates = buildGates(routes);
  const blockingViolations = violations.filter((entry) => entry.severity === 'violation');
  const debtEntries = violations.filter((entry) => entry.severity === 'debt');
  const failedGates = gates.filter((gate) => !gate.ok);
  const verdict = blockingViolations.length === 0 && failedGates.length === 0 ? 'PASS' : 'FAIL';

  const blockingFiles = new Set(violations.filter((v) => v.severity === 'violation').map((v) => v.file));
  const matrix = ctaTraces.filter((entry) => entry.status !== 'WIRED' || blockingFiles.has(entry.file));

  const debtByCode = new Map<string, number>();
  for (const entry of debtEntries) debtByCode.set(entry.code, (debtByCode.get(entry.code) ?? 0) + 1);

  const totals: ReportTotals = {
    filesAnchors: anchorFiles.size,
    filesShell: shell.size,
    filesAuditedInteractive: interactiveFiles.size,
    routesExact: routes.exact.size,
    routesDynamic: routes.dynamic.length,
    ctas: ctaTraces.length,
    ctasWired: ctaTraces.filter((entry) => entry.status === 'WIRED').length,
    ctasWarn: ctaTraces.filter((entry) => entry.status === 'WARN').length,
    violations: blockingViolations.length,
    debt: debtEntries.length,
    surfaces: surfaces.length,
    surfacesGated: surfaces.filter((surface) => surface.status === 'GATED').length,
  };

  const report = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    generator: 'scripts/audit_cta_trace_matrix.ts',
    doctrine: 'Ω-Fricción Cero · Superficie Única del viewport · Cero fachadas en CTAs',
    scope: {
      anchors: ANCHOR_ROOTS.map((root) => rel(root)),
      interactive: ['shell montado desde src/app/layout.tsx + src/app/page.tsx', ...INTERACTIVE_EXTRA_ROOTS.map((root) => rel(root))],
      blockingRule:
        'Bloqueante = fichero dentro del shell montado o de los directorios comerciales. El resto se declara deuda con su recuento exacto.',
    },
    ssot: {
      source: 'src/lib/constants/ear-os-ssot.ts',
      TARIFA_BASE_SOLISTA_EUR,
      DEPOSITO_STRIPE_EUR,
      AJUSTE_PREVENTIVO_B2G_EUR,
      LIMITE_B2G_LCSP_EUR,
      LOGISTICA_EUR_PER_KM,
      SUPLEMENTO_HOTEL_EUR,
      SPLIT_SOBERANO,
    },
    gates,
    surfaces,
    totals,
    ctaMatrix: matrix,
    violations: blockingViolations,
    debtSummary: {
      total: debtEntries.length,
      byCode: Object.fromEntries([...debtByCode.entries()].sort((a, b) => b[1] - a[1])),
      samples: debtEntries.slice(0, 40),
    },
    verdict,
    durationMs: Date.now() - startedAt,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('');
  console.log('[Ω-CTA] MATRIZ FORENSE DE TRAZABILIDAD DE CTAs');
  console.log(`[Ω-CTA] Rutas exactas: ${totals.routesExact} · dinámicas: ${totals.routesDynamic}`);
  console.log(`[Ω-CTA] Ficheros de anclas: ${totals.filesAnchors} · shell montado: ${totals.filesShell} · interactivos auditados: ${totals.filesAuditedInteractive}`);
  console.log(`[Ω-CTA] CTAs: ${totals.ctas} (cableados ${totals.ctasWired} · avisos ${totals.ctasWarn})`);
  console.log(`[Ω-CTA] Superficies fijas inferiores: ${totals.surfaces} (con gate ${totals.surfacesGated})`);
  console.log('');
  for (const gate of gates) {
    console.log(`  ${gate.ok ? '✅' : '❌'} ${gate.id} — ${gate.title}`);
    console.log(`      ${gate.evidence}`);
  }
  console.log('');
  if (blockingViolations.length > 0) {
    console.log(`[Ω-CTA] ❌ VIOLACIONES BLOQUEANTES (${blockingViolations.length}):`);
    for (const entry of blockingViolations.slice(0, 60)) {
      console.log(`   · ${entry.code} ${entry.file}:${entry.line} — ${entry.detail}`);
      if (VERBOSE) console.log(`     ${JSON.stringify(entry)}`);
    }
  }
  console.log(`[Ω-CTA] Deuda fuera del alcance comercial: ${debtEntries.length} (no bloquea, declarada)`);
  console.log(`[Ω-CTA] Informe: ${rel(REPORT_FILE)} · ${report.durationMs} ms`);
  console.log(`[Ω-CTA] VEREDICTO: ${verdict}`);
  process.exit(verdict === 'PASS' ? 0 : 1);
}

main();

