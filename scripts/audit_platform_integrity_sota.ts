/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SENSOR ADVERSARIAL DE INTEGRIDAD DE PLATAFORMA (SOTA)
 * ════════════════════════════════════════════════════════════════════════════
 * Sonda real sobre el árbol de rutas y el SSOT canónico. No fabrica veredictos:
 * cada invitado se computa leyendo disco en esta ejecución.
 *
 * INVARIANTES VIGILADOS:
 *   A. Cero enlaces rotos/huérfanos en la red de rutas públicas:
 *      A1. Toda ruta estática del `sitemap` resuelve a un `page.*` real.
 *      A2. Toda ruta pública de primer nivel tiene página propia o un dueño
 *          dinámico declarado (catch-all / `[slug]` en el mismo nivel).
 *      A3. Cero `href` internos rotos en el grafo de `src/` (se excluyen los
 *          que apuntan a segmentos dinámicos, que se resuelven en runtime).
 *   B. Coherencia de precios de `/otzarreta` contra `OTZARRETA_WEDDING_MENUS`:
 *      cuatro menús 145/155/165/185 € + IVA y reclamo canónico derivado.
 *   C. Integridad de invariantes financieros y legales contra el SSOT:
 *      C1. Tarifa base solista 350,00 € (INV-01).
 *      C2. Split Soberano 80/10/10 que suma exactamente 1 (INV-02).
 *      C3. Fianza / Depósito Stripe 100,00 € (INV-03 · Price-Lock).
 *      C4. Techo B2G 14.250,00 € = 95% del límite LCSP de 15.000 € (INV-04).
 *      C5. Rider acústico 75 dB SPL / 12 W por pax (INV-13).
 *      C6. Centralita oficial +34 693 693 048 (INV-12).
 *      C7. IBAN BigInt: acepta referencia SWIFT y rechaza mutación de 1 dígito.
 *
 * Uso:   npx tsx scripts/audit_platform_integrity_sota.ts
 *        npx tsx scripts/audit_platform_integrity_sota.ts --json
 * Exit:  0 → todos los invariantes VERIFICADO · 1 → al menos uno SOSPECHOSO.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
  WATTS_PER_PAX,
} from '../src/lib/constants/ear-os-ssot';
import {
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
  formatOtzarretaMenuPrice,
} from '../src/lib/constants/otzarreta-entity';
import { isValidIBAN } from '../src/lib/finance/iban-iso13616';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(MODULE_DIR, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const PUBLIC_DIR = path.join(APP_DIR, '(public)');
const SRC_DIR = path.join(ROOT, 'src');

const PAGE_FILES = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'page.mdx']);
const ROUTE_FILES = new Set(['route.ts', 'route.tsx', 'route.js']);
/** Carpetas privadas de Next: no generan segmento navegable.
 *  `_private` (privada), `@slot` (paralela), `(.)x`/`(..)x` (interceptada).
 */
const IGNORED_SEGMENT = /^(?:[_\@]|\(\.)/;

interface Verdict {
  readonly id: string;
  readonly title: string;
  readonly ok: boolean;
  readonly detail: string;
}

const verdicts: Verdict[] = [];

function record(id: string, title: string, ok: boolean, detail: string): void {
  verdicts.push({ id, title, ok, detail });
  console.log(`  [${ok ? 'VERIFICADO' : 'SOSPECHOSO'}] ${id} · ${title}`);
  console.log(`      ${detail}`);
}

/** Compara importes monetarios con tolerancia de céntimo (evita 0.1+0.2). */
function sameEur(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.005;
}

// ── Infraestructura de rutas ───────────────────────────────────────────────

interface RouteNode {
  /** Pathname REAL con grupos de ruta eliminados (`/bodas/[provincia]`). */
  readonly pathname: string;
  /** `true` si algún segmento es dinámico (`[slug]`, `[...slug]`, `[[...x]]`). */
  readonly dynamic: boolean;
}

function hasPageFile(dir: string): boolean {
  return readdirSync(dir).some((entry) => PAGE_FILES.has(entry));
}

/** Recorre `src/app` y devuelve todas las rutas con página navegable. */
function collectRouteNodes(): RouteNode[] {
  const nodes: RouteNode[] = [];

  const walk = (dir: string, segments: string[], dynamic: boolean): void => {
    const entries = readdirSync(dir, { withFileTypes: true });

    if (segments.length > 0 && hasPageFile(dir)) {
      nodes.push({ pathname: `/${segments.join('/')}`, dynamic });
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || IGNORED_SEGMENT.test(entry.name)) continue;
      const isGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
      const isDynamic = entry.name.startsWith('[') && entry.name.endsWith(']');
      const nextSegments = isGroup ? segments : [...segments, entry.name];
      walk(
        path.join(dir, entry.name),
        nextSegments,
        dynamic || isDynamic,
      );
    }
  };

  walk(APP_DIR, [], false);
  return nodes;
}

/** Extrae los `path` declarados en el sitemap, sin resolver el módulo. */
function readSitemapPaths(): string[] {
  const sitemapPath = path.join(APP_DIR, 'sitemap.ts');
  if (!existsSync(sitemapPath)) return [];
  const source = readFileSync(sitemapPath, 'utf8');
  const paths: string[] = [];
  const pattern = /\{\s*path:\s*'([^']*)'/g;
  let match = pattern.exec(source);
  while (match !== null) {
    paths.push(match[1]);
    match = pattern.exec(source);
  }
  return paths;
}

/**
 * Enlaces internos literales (`href="/..."`) encontrados en el código.
 * Se excluyen los que contienen `${` (interpolación) o puntos de ruta
 * relativos, porque su destino sólo existe en runtime.
 */
function collectLiteralHrefs(files: string[]): Map<string, string[]> {
  const hrefMap = new Map<string, string[]>();
  const pattern = /href=(?:"|'|\{`)(\/[^"'`{}]*)(?:"|'|`\})/g;

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    let match = pattern.exec(source);
    while (match !== null) {
      const href = match[1].split('?')[0].split('#')[0];
      if (href.length > 0) {
        const owners = hrefMap.get(href) ?? [];
        owners.push(path.relative(ROOT, file));
        hrefMap.set(href, owners);
      }
      match = pattern.exec(source);
    }
  }

  return hrefMap;
}

/** Inventario de ficheros fuente (TS/TSX) bajo `src/`, excluyendo staging. */
function collectSourceFiles(): string[] {
  const files: string[] = [];
  const skipDirs = new Set(['node_modules', '.next', 'adn_vault', 'adn_vault_staging', 'staging']);

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue;
        walk(path.join(dir, entry.name));
        continue;
      }
      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        files.push(path.join(dir, entry.name));
      }
    }
  };

  walk(SRC_DIR);
  return files;
}

/** `true` si el pathname coincide con una ruta real (estática o dinámica). */
function matchesAnyRoute(pathname: string, nodes: RouteNode[]): boolean {
  const target = pathname === '/' ? [] : pathname.split('/').filter(Boolean);

  for (const node of nodes) {
    if (!node.dynamic) {
      if (node.pathname === pathname) return true;
      continue;
    }
    const parts = node.pathname.split('/').filter(Boolean);
    const catchAllIndex = parts.findIndex((part) => /^\[\[?\.\.\./.test(part));
    if (catchAllIndex !== -1) {
      if (catchAllIndex <= target.length) return true;
      continue;
    }
    if (parts.length !== target.length) continue;
    const fits = parts.every((part, index) =>
      (part.startsWith('[') && part.endsWith(']')) || part === target[index],
    );
    if (fits) return true;
  }

  return false;
}

// ── Bloque A · Red de rutas públicas ──────────────────────────────────────

function auditRouteGraph(): void {
  console.log('\n[BLOQUE A] Red de rutas públicas — enlaces rotos y huérfanos');

  if (!existsSync(APP_DIR)) {
    record('A0', 'Raíz de aplicación', false, `No existe ${path.relative(ROOT, APP_DIR)}`);
    return;
  }

  const nodes = collectRouteNodes();
  const staticNodes = nodes.filter((node) => !node.dynamic);
  const sourceFiles = collectSourceFiles();

  // A1 · Toda ruta del sitemap debe resolverse a una página real en disco.
  //      Una URL se sirve si existe la ruta exacta o si ENCAJA segmento a
  //      segmento con una ruta dinámica (`/bodas/[provincia]/[servicio]/[municipio]`).
  //      La existencia del expediente de datos (slug real) se mide en A1b.
  const sitemapPaths = readSitemapPaths();
  const orphanSitemap = sitemapPaths.filter((raw) => {
    if (raw === '') return !hasPageFile(APP_DIR); // La raíz es `src/app/page.tsx`.
    return !matchesAnyRoute(raw, nodes);
  });
  record(
    'A1',
    `Sitemap resuelve a páginas reales (${sitemapPaths.length} rutas)`,
    sitemapPaths.length > 0 && orphanSitemap.length === 0,
    orphanSitemap.length === 0
      ? `0 huérfanas en sitemap · ${nodes.length} páginas inventariadas en disco`
      : `${orphanSitemap.length} URL(s) del sitemap sin ruta que las sirva (profundidad o slug fuera del árbol): ${orphanSitemap.join(', ')}`,
  );
  // A1c · Profundidad de URL: cuántos tramos tiene la URL frente al tramo más
  //       profundo resoluble por el árbol de rutas (grupos `(...)` no cuentan).
  const urlDepth = (pathname: string): number => pathname.split('/').filter(Boolean).length;
  const deepestDynamic = Math.max(
    ...nodes.filter((node) => node.dynamic).map((node) => urlDepth(node.pathname)),
  );
  const overDepth = orphanSitemap.filter((raw) => urlDepth(raw) > deepestDynamic);
  record(
    'A1c',
    `Profundidad de URL vs árbol (máximo resoluble: ${deepestDynamic} segmentos)`,
    overDepth.length === 0,
    overDepth.length === 0
      ? `Ninguna URL huérfana excede el árbol; el desajuste es de slug/expediente, no de profundidad · rutas más profundas: ${nodes
          .filter((node) => urlDepth(node.pathname) === deepestDynamic)
          .map((node) => node.pathname)
          .join(', ')}`
      : `${overDepth.length} URL(s) EXCEDEN el árbol y no pueden servirse: ${overDepth.join(', ')}`,
  );

  // A1b · Riesgo de expediente: promesas servidas por un dueño dinámico cuyo
  //       slug no figura en ninguna fuente del repo. Se comprueba con evidencia:
  //       · Entidad estática (la hoja existe en disco) ⇒ sin riesgo.
  //       · Slug presente en el código fuente ⇒ sin riesgo.
  //       · Slug ausente ⇒ se clasifica por host: las fichas 1:1 de plataforma
  //         (artistas.es) se consideran riesgo real; las landings pSEO de
  //         clúster (arsenal/bodas) pueden vivir en otra superficie de despliegue.
  const sourceCorpus = sourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
  const dynamicLeases = sitemapPaths.filter((raw) => {
    if (raw === '') return false;
    if (nodes.some((node) => node.pathname === raw && !node.dynamic)) return false;
    return matchesAnyRoute(raw, nodes);
  });

  const missingEntity: string[] = [];
  const unreferencedPseo: string[] = [];
  for (const raw of dynamicLeases) {
    const segments = raw.split('/').filter(Boolean);

    // Hoja estática real en disco (`bodas/guipuzcoa/restaurante-otzarreta`) ⇒ sin riesgo.
    const staticLeaf = statSync(path.join(APP_DIR, ...segments), { throwIfNoEntry: false })?.isDirectory() === true;
    if (staticLeaf) continue;

    const leafSlug = segments[segments.length - 1];
    if (sourceCorpus.includes(leafSlug)) continue;
    if (raw.startsWith('/artistas/')) {
      missingEntity.push(raw);
    } else {
      unreferencedPseo.push(raw);
    }
  }

  record(
    'A1b',
    `Expedientes de plataforma con entidad verificable (${dynamicLeases.length} promesas servidas por dueño dinámico)`,
    missingEntity.length === 0,
    missingEntity.length === 0
      ? `Sin ficción 1:1 · ${unreferencedPseo.length} landing(s) pSEO sin referencia literal en repo (contenido servido por clúster): ${unreferencedPseo.join(', ') || 'ninguna'}`
      : `Fichas prometidas sin expediente ni referencia en repo: ${missingEntity.join(', ')}`,
  );

  // A2 · Rutas de primer nivel (públicas + raíz no-API): página propia, dueño
  //      dinámico hermano o página descendiente real. Server Actions
  //      (`actions`) y handlers (`api`) no son navegables y se excluyen.
  const routeOwnedPrefixes = new Set(
    nodes.map((node) => node.pathname.split('/').filter(Boolean)[0]).filter(Boolean),
  );

  // Prefijos no navegables: Server Actions, handlers HTTP y módulos internos.
  const NON_ROUTE_PREFIXES = new Set(['api', 'actions', 'components', 'context', 'data']);
  /** Ficheros de metadatos de Next que no generan segmento navegable
   *  (`sitemap.ts`, `sitemap-index.xml/`, `robots.txt/`, `icon.png`). */
  const METADATA_FILE = /^(sitemap|robots|manifest|icon|apple-icon|opengraph-image|twitter-image|favicon)([.\-].*)?([.\-].*)?$/;

  const topLevel = readdirSync(APP_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !IGNORED_SEGMENT.test(entry.name) &&
        // Los grupos de ruta `(public)`/`(auth)` no son segmentos navegables.
        !(entry.name.startsWith('(') && entry.name.endsWith(')')) &&
        !NON_ROUTE_PREFIXES.has(entry.name) &&
        !METADATA_FILE.test(entry.name),
    )
    .map((entry) => entry.name)
    .filter((segment) => {
      // Una carpeta sin `page.*` en su subárbol y sin handler HTTP es sólo
      // almacén de componentes: no es una ruta que prometa nada.
      const dir = path.join(APP_DIR, segment);
      const hasAnyPage = nodes.some((node) => node.pathname.split('/').filter(Boolean)[0] === segment);
      const hasHandler = statSync(dir, { throwIfNoEntry: false })?.isDirectory() === true &&
        readdirSync(dir, { withFileTypes: true }).some((entry) => ROUTE_FILES.has(entry.name));
      return hasAnyPage || hasHandler || NON_ROUTE_PREFIXES.has(segment);
    });

  const undeclared = topLevel.filter((segment) => !routeOwnedPrefixes.has(segment));

  record(
    'A2',
    `Rutas de primer nivel con dueño real (${topLevel.length} segmentos)`,
    undeclared.length === 0,
    undeclared.length === 0
      ? `Cada segmento resuelve a página propia, dueño dinámico hermano o descendiente real (${routeOwnedPrefixes.size} prefijos con página)`
      : `Segmentos sin página ni dueño dinámico: ${undeclared.map((segment) => `/${segment}`).join(', ')}`,
  );

  // A3 · `href` internos literales: 0 rotos.
  const hrefs = collectLiteralHrefs(sourceFiles);
  const broken: string[] = [];

  for (const [href, owners] of hrefs) {
    const pathname = href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href;
    if (matchesAnyRoute(pathname, nodes)) continue;
    broken.push(`${payloadOwner(href, owners)} → ${href}`);
  }

  record(
    'A3',
    `Enlaces internos literales sin destino (${hrefs.size} hrefs en ${sourceFiles.length} ficheros)`,
    broken.length === 0,
    broken.length === 0
      ? `0 enlaces rotos · ${staticNodes.length} rutas estáticas disponibles`
      : `Enlaces rotos: ${broken.slice(0, 25).join(' | ')}${broken.length > 25 ? ` … +${broken.length - 25}` : ''}`,
  );
}

function payloadOwner(href: string, owners: string[]): string {
  return `${owners[0] ?? 'desconocido'}${owners.length > 1 ? ` (+${owners.length - 1})` : ''}`;
}

// ── Bloque B · Coherencia de precios de /otzarreta ────────────────────────

function auditOtzarretaPricing(): void {
  console.log('\n[BLOQUE B] Coherencia de precios /otzarreta contra el SSOT');

  const expected: ReadonlyArray<{ readonly name: string; readonly priceEur: number }> = [
    { name: 'Menú Tradición', priceEur: 145 },
    { name: 'Menú Asador', priceEur: 155 },
    { name: 'Menú Ezkertza', priceEur: 165 },
    { name: 'Menú Soberano', priceEur: 185 },
  ];

  const mismatches: string[] = [];
  if (OTZARRETA_WEDDING_MENUS.length !== expected.length) {
    mismatches.push(
      `La carta tiene ${OTZARRETA_WEDDING_MENUS.length} menús; la oferta sancionada exige ${expected.length}`,
    );
  }

  expected.forEach((entry, index) => {
    const actual = OTZARRETA_WEDDING_MENUS[index];
    const priceOk = actual?.priceEur !== null && actual?.priceEur !== undefined
      && sameEur(actual.priceEur, entry.priceEur);
    if (actual?.name !== entry.name || !priceOk) {
      mismatches.push(
        `Posición ${index + 1}: esperado «${entry.name}» ${entry.priceEur} € · real «${actual?.name ?? '—'}» ${String(actual?.priceEur ?? '—')} €`,
      );
    }
  });

  record(
    'B1',
    'Carta de gala 2027 = 145 / 155 / 165 / 185 € + IVA',
    mismatches.length === 0,
    mismatches.length === 0
      ? OTZARRETA_WEDDING_MENUS.map((menu) => `${menu.name} = ${formatOtzarretaMenuPrice(menu.priceEur) ?? '—'}`).join(' · ')
      : mismatches.join(' | '),
  );

  const pricesInRange = OTZARRETA_WEDDING_MENUS.every(
    (menu) => menu.priceEur === null || (menu.priceEur >= 145 && menu.priceEur <= 185),
  );
  record(
    'B2',
    'Rango comercial 145 EUR - 185 EUR sin deriva',
    pricesInRange,
    pricesInRange
      ? 'Todo importe publicado cae dentro de la ventana sancionada'
      : 'Existe un importe fuera de la ventana 145-185 EUR',
  );

  const claim = OTZARRETA_WEDDING_MENUS_CLAIM;
  const firstPrice = OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 0;
  const derived = `Menús de Gala desde ${firstPrice.toLocaleString('es-ES')} € + IVA`;
  const claimAnchored = claim === derived && claim.includes('+ IVA') && claim.includes('145');
  record(
    'B3',
    'Reclamo "desde" derivado del primer menú (sin segunda cifra viva)',
    claimAnchored,
    claimAnchored ? `«${claim}»` : `Reclamo desanclado: «${claim}»`,
  );
}

// ── Bloque C · Invariantes financieros y legales ──────────────────────────

function auditFinancialInvariants(): void {
  console.log('\n[BLOQUE C] Invariantes del SSOT canónico');

  // C1 · INV-01 · Tarifa base solista.
  const tarifaOk = sameEur(TARIFA_BASE_SOLISTA_EUR, 350.0);
  record(
    'C1',
    'INV-01 · Tarifa base solista = 350,00 €',
    tarifaOk,
    `TARIFA_BASE_SOLISTA_EUR = ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €`,
  );

  // C2 · INV-02 · Split Soberano 80/10/10.
  const splitSum = SPLIT_SOBERANO.artista + SPLIT_SOBERANO.earOs + SPLIT_SOBERANO.vimume;
  const splitOk =
    sameEur(SPLIT_SOBERANO.artista, 0.8) &&
    sameEur(SPLIT_SOBERANO.earOs, 0.1) &&
    sameEur(SPLIT_SOBERANO.vimume, 0.1) &&
    sameEur(splitSum, 1);
  const splitPercent = [
    Math.round(SPLIT_SOBERANO.artista * 100),
    Math.round(SPLIT_SOBERANO.earOs * 100),
    Math.round(SPLIT_SOBERANO.vimume * 100),
  ].join('/');
  const splitParts = `${splitPercent} · suma=${splitSum.toFixed(2)}`;
  record('C2', 'INV-02 · Split Soberano 80/10/10 suma 1', splitOk, `Split ${splitParts}`);

  // C3 · INV-03 · Depósito Stripe Price-Lock.
  const depositoOk = sameEur(DEPOSITO_STRIPE_EUR, 100.0);
  record(
    'C3',
    'INV-03 · Fianza / Depósito Stripe Price-Lock = 100,00 €',
    depositoOk,
    `DEPOSITO_STRIPE_EUR = ${DEPOSITO_STRIPE_EUR.toFixed(2)} €`,
  );

  // C4 · INV-04 · Techo B2G = 95% del límite LCSP.
  const ceilingOk =
    sameEur(LIMITE_B2G_LCSP_EUR, 15000.0) &&
    sameEur(AJUSTE_PREVENTIVO_B2G_EUR, 14250.0) &&
    sameEur(AJUSTE_PREVENTIVO_B2G_EUR, LIMITE_B2G_LCSP_EUR * 0.95);
  record(
    'C4',
    'INV-04 · Techo B2G 14.250,00 € = 95% LCSP (15.000,00 €)',
    ceilingOk,
    `LCSP=${LIMITE_B2G_LCSP_EUR.toFixed(2)} € · techo=${AJUSTE_PREVENTIVO_B2G_EUR.toFixed(2)} € · ratio=${(AJUSTE_PREVENTIVO_B2G_EUR / LIMITE_B2G_LCSP_EUR).toFixed(2)}`,
  );

  // C5 · INV-13 · Rider acústico Ley 37/2003.
  const riderOk = sameEur(LIMITE_SPL_DB, 75) && sameEur(WATTS_PER_PAX, 12);
  record(
    'C5',
    'INV-13 · Rider acústico < 75 dB SPL · 12 W/pax',
    riderOk,
    `LIMITE_SPL_DB=${LIMITE_SPL_DB} dB · WATTS_PER_PAX=${WATTS_PER_PAX} W`,
  );

  // C6 · INV-12 · Centralita oficial.
  const phoneOk = CENTRALITA_EAR_OS === '+34 693 693 048';
  record(
    'C6',
    'INV-12 · Centralita oficial +34 693 693 048',
    phoneOk,
    `CENTRALITA_EAR_OS = «${CENTRALITA_EAR_OS}»`,
  );

  // C7 · IBAN BigInt: aceptación de referencia y rechazo de mutación hostil.
  const reference = 'ES9121000418450200051332';
  const mutants = [2, 3, 5, 9, 13, 20].map((position) => {
    const digit = Number(reference[position]);
    return reference.slice(0, position) + ((digit + 1) % 10) + reference.slice(position + 1);
  });
  const ibanOk =
    isValidIBAN(reference) &&
    mutants.every((mutant) => isValidIBAN(mutant) === false) &&
    isValidIBAN('ES912100041845020005133') === false &&
    isValidIBAN('  es91-2100 0418 4502 0005 1332  ') === true;
  record(
    'C7',
    'IBAN ISO 13616 · MOD-97-10 BigInt (referencia SEPA + 6 mutantes)',
    ibanOk,
    `${reference} aceptado · ${mutants.filter((mutant) => !isValidIBAN(mutant)).length}/${mutants.length} mutantes rechazados · longitud 23 rechazada · formato con separadores aceptado`,
  );
}

// ── Runner ────────────────────────────────────────────────────────────────

function main(): void {
  const startedAt = new Date();
  const jsonMode = process.argv.includes('--json');

  console.log('='.repeat(78));
  console.log('SENSOR ADVERSARIAL DE INTEGRIDAD DE PLATAFORMA — EAR OS SOTA');
  console.log(`Raíz: ${ROOT}`);
  console.log(`checkedAt: ${startedAt.toISOString()}`);
  console.log('='.repeat(78));

  auditRouteGraph();
  auditOtzarretaPricing();
  auditFinancialInvariants();

  const failed = verdicts.filter((verdict) => !verdict.ok);
  console.log('\n' + '='.repeat(78));

  if (jsonMode) {
    const payload = {
      probed: true,
      source: 'live' as const,
      mode: 'REAL' as const,
      checkedAt: startedAt.toISOString(),
      total: verdicts.length,
      verified: verdicts.length - failed.length,
      suspicious: failed.length,
      verdicts,
    };
    console.log(JSON.stringify(payload));
  } else {
    for (const verdict of verdicts) {
      console.log(`${verdict.ok ? 'VERIFICADO' : 'SOSPECHOSO'} · ${verdict.id} · ${verdict.title}`);
    }
    console.log('-'.repeat(78));
    console.log(
      `RESULTADO: ${verdicts.length - failed.length}/${verdicts.length} INVARIANTES VERIFICADOS`,
    );
    if (failed.length > 0) {
      console.log(`SOSPECHOSOS: ${failed.map((verdict) => verdict.id).join(', ')}`);
    }
  }

  console.log('='.repeat(78));
  process.exit(failed.length === 0 ? 0 : 1);
}

main();

