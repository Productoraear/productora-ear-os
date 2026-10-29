/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🧪 VERIFICACIÓN FORENSE — GROUNDING REAL DE FICHAS DE PROVEEDOR (W43)
 * ════════════════════════════════════════════════════════════════════════════
 * Reproduce el fallo reportado: el Concierge y el Call Center hablaban de
 * proveedores A CIEGAS (sin ficha, inventando o dando largas).
 *
 * Esta prueba importa los MÓDULOS REALES (no réplicas) y exige:
 *   1. Store cargado desde los artefactos de `public/data/fichas/`.
 *   2. Resolución determinista por clave, vendorId, slug, ruta interna y URL
 *      de ficha `...--e<id>` → SIEMPRE la misma ficha.
 *   3. Anti-SSRF: `fichaProvider.ts` no abre URLs (cero `fetch`).
 *   4. Teléfono FAIL-CLOSED: el prompt jamás transporta el número verificado.
 *   5. `/proveedores/<x>` produce `PageContext.kind === 'provider'` con hechos
 *      citables y peaje soberano.
 *   6. Anti-ceguera invertida: una ruta inexistente NO inventa (bloque vacío).
 *   7. Provenance: el prefijo `ph` del índice coincide con el hash del gold.
 *
 * Uso:    npx --no-install tsx scripts/verify_ficha_grounding.ts
 * Coste:  $0,00 (cero red).
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  extractFichaVendorId,
  findFichaByKey,
  findFichaBySlug,
  findFichaByVendorId,
  getFichaStoreStats,
  normalizeFichaSlug,
  resolveFichaFromUrlOrText,
} from '../src/lib/providers/fichaProvider';
import {
  buildFichaFacts,
  buildFichaMissing,
  type ProviderFicha,
  type ProviderFichaGoldFile,
  type ProviderFichaIndexFile,
} from '../src/lib/providers/providerFichaTypes';
import { buildPageContextBlock, resolvePageContext } from '../src/lib/agents/pageContext';

interface CaseResult {
  readonly section: string;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];
const CENTRALITA_DIGITS = '693693048';
const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'fichas');

function check(section: string, name: string, ok: boolean, detail: string): void {
  cases.push({ section, name, ok, detail });
}

function readJson<T>(fileName: string): T | null {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    console.error('[verify:fichas] JSON ilegible', filePath, error);
    return null;
  }
}

const goldFile: ProviderFichaGoldFile | null = readJson<ProviderFichaGoldFile>('fichas_gold.json');
const indexFile: ProviderFichaIndexFile | null = readJson<ProviderFichaIndexFile>('fichas_index.json');

function isPublishable(ficha: ProviderFicha): boolean {
  return ficha.phone !== null && ficha.phone.length >= 9 && ficha.phone !== CENTRALITA_DIGITS;
}

/* ── A. Store real cargado en proceso ─────────────────────────────────────── */
const stats = getFichaStoreStats();
check(
  'A. Store',
  'Artefactos presentes y store cargado en el proceso',
  stats.loaded && stats.entries >= 2000 && stats.gold >= 1 && stats.verified >= 1,
  `entries=${String(stats.entries)} · gold=${String(stats.gold)} · verified=${String(stats.verified)} · loaded=${String(stats.loaded)}`,
);

const goldFichas: readonly ProviderFicha[] = goldFile === null ? [] : goldFile.fichas;
check(
  'A. Store',
  'Gold en disco coincide con el store (misma fuente)',
  goldFile !== null && goldFile.counts.gold === stats.gold && stats.gold === goldFichas.length,
  `disco.gold=${String(goldFile?.counts.gold ?? -1)} · store.gold=${String(stats.gold)} · cargadas=${String(goldFichas.length)}`,
);

const first: ProviderFicha | undefined = goldFichas[0];
if (first === undefined) {
  check('A. Store', 'Hay al menos una ficha gold para auditar', false, 'fichas_gold.json vacío');
} else {
  check(
    'A. Store',
    'Ficha gold con nombre y provenanceHash SHA-256 completo',
    first.name.length > 1 && /^[a-f0-9]{64}$/.test(first.provenanceHash),
    `${first.key} · ${first.name} · hash=${first.provenanceHash.slice(0, 16)}…`,
  );
  check(
    'A. Store',
    'verified ⇔ teléfono publicable (≠ centralita, ≥9 dígitos) en TODO el gold',
    goldFichas.every((ficha: ProviderFicha) => ficha.verified === isPublishable(ficha)),
    `violaciones=${String(goldFichas.filter((ficha: ProviderFicha) => ficha.verified !== isPublishable(ficha)).length)}`,
  );
}

/* ── B. Resolución determinista multi-formato (muestras reales) ───────────── */
const samples: readonly ProviderFicha[] = goldFichas.slice(0, 6);
let resolvedOk = 0;
let resolvedTotal = 0;
for (const ficha of samples) {
  const vendorId: string | null = ficha.vendorId;
  const attempts: Array<{ readonly label: string; readonly value: string }> = [
    { label: 'clave', value: ficha.key },
    { label: 'ruta interna por clave', value: `/proveedores/${ficha.key}` },
    {
      label: 'URL de ficha --e<id>',
      value: vendorId === null ? '' : `https://www.bodas.net/proveedores/finca-x--e${vendorId}`,
    },
    { label: 'slug', value: ficha.slug },
    { label: 'ruta interna por slug', value: `/proveedores/${ficha.slug}` },
  ];
  for (const attempt of attempts) {
    if (attempt.value.length === 0) continue;
    resolvedTotal += 1;
    const resolved: ProviderFicha | null = resolveFichaFromUrlOrText(attempt.value);
    const ok: boolean = resolved !== null && resolved.key === ficha.key;
    if (ok) resolvedOk += 1;
    check(
      'B. Resolución',
      `${ficha.key} ← ${attempt.label}`,
      ok,
      `${attempt.value} → ${resolved === null ? 'null' : resolved.key}`,
    );
  }
  if (vendorId !== null) {
    check(
      'B. Resolución',
      `${ficha.key} ← findFichaByVendorId("${vendorId}")`,
      findFichaByVendorId(vendorId)?.key === ficha.key,
      String(findFichaByVendorId(vendorId)?.key ?? 'null'),
    );
  }
}
check(
  'B. Resolución',
  'Cobertura de resolución sobre muestras reales (100 %)',
  resolvedTotal > 0 && resolvedOk === resolvedTotal,
  `${String(resolvedOk)}/${String(resolvedTotal)}`,
);

if (first !== undefined) {
  check(
    'B. Resolución',
    'findFichaByKey / findFichaBySlug devuelven la misma ficha',
    findFichaByKey(first.key)?.key === first.key && findFichaBySlug(first.slug)?.key === first.key,
    `key→${String(findFichaByKey(first.key)?.key ?? 'null')} · slug→${String(findFichaBySlug(first.slug)?.key ?? 'null')}`,
  );
  check(
    'B. Resolución',
    'URL bodas.net: vendorId extraído sin abrir la URL',
    first.vendorId !== null &&
      extractFichaVendorId(`https://www.bodas.net/proveedores/finca-x--e${first.vendorId}`) === first.vendorId,
    String(first.vendorId ?? 'null'),
  );
}
check(
  'B. Resolución',
  'Slug determinista (acentos y símbolos normalizados)',
  normalizeFichaSlug('Finca  El Roble, S.L.') === 'finca-el-roble-s-l',
  normalizeFichaSlug('Finca  El Roble, S.L.'),
);

/* ── C. Anti-SSRF: el resolver JAMÁS abre la URL ──────────────────────────── */
const providerSource: string = fs.readFileSync(
  path.join(process.cwd(), 'src', 'lib', 'providers', 'fichaProvider.ts'),
  'utf8',
);
check(
  'C. Anti-SSRF',
  'fichaProvider.ts no contiene fetch/http.get/net.connect',
  !/\bfetch\s*\(|\bhttps?\.(get|request)\s*\(|\bnet\.connect\s*\(/.test(providerSource),
  'sólo node:fs + node:path',
);
check(
  'C. Anti-SSRF',
  'URL de dominio ajeno sin coincidencia → null (no inventa)',
  resolveFichaFromUrlOrText('https://evil.test/proveedores/no-existe-zzz--e1') === null,
  String(resolveFichaFromUrlOrText('https://evil.test/proveedores/no-existe-zzz--e1')),
);
check(
  'C. Anti-SSRF',
  'Entradas hostiles acotadas sin excepción',
  resolveFichaFromUrlOrText('') === null &&
    resolveFichaFromUrlOrText(null) === null &&
    resolveFichaFromUrlOrText(`/proveedores/${'a'.repeat(5000)}`) === null,
  'vacío/null/desbordamiento → null',
);

/* ── D. Teléfono FAIL-CLOSED (anti-picaresca) ─────────────────────────────── */
let phoneLeaks = 0;
const verifiedSamples: readonly ProviderFicha[] = goldFichas
  .filter((ficha: ProviderFicha) => ficha.verified && ficha.phone !== null)
  .slice(0, 20);
for (const ficha of verifiedSamples) {
  const blind: string = buildFichaFacts(ficha).join(' ');
  if (ficha.phone !== null && blind.includes(ficha.phone)) phoneLeaks += 1;
}
check(
  'D. Anti-picaresca',
  'buildFichaFacts sin opciones NO escribe el teléfono verificado',
  verifiedSamples.length > 0 && phoneLeaks === 0,
  `muestras=${String(verifiedSamples.length)} · fugas=${String(phoneLeaks)}`,
);
if (first !== undefined && first.phone !== null) {
  const exposed: string = buildFichaFacts(first, { exposePhone: true }).join(' ');
  check(
    'D. Anti-picaresca',
    'buildFichaFacts({exposePhone:true}) sí expone (UI interna)',
    exposed.includes(first.phone),
    `${first.key} · teléfono presente=${String(exposed.includes(first.phone))}`,
  );
}
check(
  'D. Anti-picaresca',
  'buildFichaMissing declara lo no certificado (nunca vacío)',
  first !== undefined &&
    buildFichaMissing(first).length >= 2 &&
    buildFichaMissing(first).includes('disponibilidad real de la fecha'),
  first === undefined ? 'sin ficha' : buildFichaMissing(first).join('; '),
);

/* ── E. PageContext: /proveedores/<x> deja de ser ciego ───────────────────── */
if (first !== undefined) {
  const byKey = resolvePageContext({ pathname: `/proveedores/${first.key}` });
  const byKeyBlock: string = buildPageContextBlock(byKey);
  check(
    'E. PageContext',
    'kind === "provider" con nombre real de la ficha',
    byKey.kind === 'provider' && byKey.name === first.name,
    `${byKey.kind} · ${byKey.name}`,
  );
  check(
    'E. PageContext',
    'Hechos citables > 0 en el contexto',
    byKey.facts.length > 0,
    `hechos=${String(byKey.facts.length)}`,
  );
  check(
    'E. PageContext',
    'Bloque de prompt contiene la ficha y el peaje soberano',
    byKeyBlock.includes(first.name) &&
      byKeyBlock.includes('Conserjería EAR OS') &&
      byKeyBlock.includes('FICHA VERIFICADA'),
    `longitud=${String(byKeyBlock.length)}`,
  );
  check(
    'E. PageContext',
    'El bloque NUNCA transporta el teléfono verificado',
    first.phone === null || !byKeyBlock.includes(first.phone),
    first.phone === null ? 'sin teléfono publicable' : `teléfono ${String(first.phone).slice(0, 2)}***`,
  );

  const vendorId: string | null = first.vendorId;
  if (vendorId !== null) {
    const byPastedUrl = resolvePageContext({
      message: `¿qué sabes de este proveedor? https://www.bodas.net/proveedores/finca-x--e${vendorId}`,
    });
    check(
      'E. PageContext',
      'URL de ficha pegada en el mensaje → misma entidad (message-url)',
      byPastedUrl.kind === 'provider' && byPastedUrl.name === first.name && byPastedUrl.source === 'message-url',
      `${byPastedUrl.kind} · ${byPastedUrl.source} · ${byPastedUrl.name}`,
    );
  }
}

/* ── F. Anti-ceguera invertida: ruta inexistente NO inventa ───────────────── */
const unknownProvider = resolvePageContext({ pathname: '/proveedores/proveedor-fantasma-zzz' });
check(
  'F. Anti-invención',
  'Ruta de proveedor inexistente → kind "none" y bloque vacío',
  unknownProvider.kind === 'none' && buildPageContextBlock(unknownProvider) === '',
  `${unknownProvider.kind} · bloque=${String(buildPageContextBlock(unknownProvider).length)}`,
);

/* ── G. Provenance y presupuesto de tamaño ────────────────────────────────── */
const goldByKey = new Map<string, ProviderFicha>(goldFichas.map((ficha: ProviderFicha) => [ficha.key, ficha]));
let provenanceChecks = 0;
let provenanceBad = 0;
const indexEntries = indexFile === null ? [] : indexFile.entries;
for (const entry of indexEntries) {
  const gold: ProviderFicha | undefined = goldByKey.get(entry.key);
  if (gold === undefined) continue;
  provenanceChecks += 1;
  if (!gold.provenanceHash.startsWith(entry.ph)) provenanceBad += 1;
}
check(
  'G. Provenance',
  'Prefijo `ph` del índice coincide con provenanceHash del gold',
  provenanceChecks > 0 && provenanceBad === 0,
  `comparadas=${String(provenanceChecks)} · discrepancias=${String(provenanceBad)}`,
);
check(
  'G. Provenance',
  'Conteos de índice y gold coherentes',
  indexFile !== null &&
    indexFile.counts.entries === indexEntries.length &&
    indexFile.counts.gold === stats.gold &&
    indexFile.counts.verified === stats.verified,
  `index.entries=${String(indexFile?.counts.entries ?? -1)} · index.gold=${String(indexFile?.counts.gold ?? -1)} · index.verified=${String(indexFile?.counts.verified ?? -1)}`,
);

const BUDGET_BYTES = 1024 * 1024;
const sizes: Array<{ readonly name: string; readonly bytes: number }> = ['fichas_gold.json', 'fichas_index.json'].map(
  (name: string) => {
    const filePath: string = path.join(DATA_DIR, name);
    return { name, bytes: fs.existsSync(filePath) ? fs.statSync(filePath).size : Number.MAX_SAFE_INTEGER };
  },
);
check(
  'G. Provenance',
  'Presupuesto < 1 MB por artefacto',
  sizes.every((item) => item.bytes < BUDGET_BYTES),
  sizes.map((item) => `${item.name}=${(item.bytes / 1024).toFixed(1)}KB`).join(' · '),
);

/* ── H. Saneado de metadatos: 0 basura de scraping en el prompt ───────────── */
interface AuditReportShape {
  readonly invariants?: Record<string, number>;
}

const reportFile: AuditReportShape | null = readJson<AuditReportShape>('fichas_audit_report.json');
const invariants: Record<string, number> = reportFile?.invariants ?? {};

check(
  'H. Metadatos',
  'Informe de auditoría declara 0 categorías de scraping y 0 provincias no canónicas',
  invariants.junkCategories === 0 && invariants.nonCanonicalProvinces === 0,
  `junkCategories=${String(invariants.junkCategories)} · nonCanonicalProvinces=${String(invariants.nonCanonicalProvinces)}`,
);

// Re-derivación INDEPENDIENTE: tabla propia de 52 provincias (no se importa la
// del builder) + blocklist propia de artefactos de scraping.
const CANONICAL_PROVINCES: readonly string[] = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
  'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta',
  'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid',
  'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
  'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
];
const JUNK_TOKENS: readonly string[] = ['foto', 'fotos', 'galeria', 'ver', 'mapa', 'web', 'opiniones', 'contacto'];

const badProvinces: readonly ProviderFicha[] = goldFichas.filter(
  (ficha: ProviderFicha) => ficha.province.length > 0 && !CANONICAL_PROVINCES.includes(ficha.province),
);
check(
  'H. Metadatos',
  'Toda provincia publicada pertenece a la lista canónica (ni códigos ISO sueltos ni minúsculas)',
  goldFichas.length > 0 && badProvinces.length === 0,
  `no-canónicas=${String(badProvinces.length)} · muestra=${badProvinces.slice(0, 3).map((ficha: ProviderFicha) => `${ficha.key}:${ficha.province}`).join(',') || '∅'}`,
);

const badCategories: readonly ProviderFicha[] = goldFichas.filter((ficha: ProviderFicha) => {
  const value: string = ficha.category;
  if (value.length === 0) return false;
  if (JUNK_TOKENS.includes(value.toLowerCase())) return true;
  return !/^[\p{L}][\p{L} -]+$/u.test(value);
});
check(
  'H. Metadatos',
  'Toda categoría publicada es texto legible (cero artefactos de scraping tipo "foto")',
  goldFichas.length > 0 && badCategories.length === 0,
  `ilegibles=${String(badCategories.length)} · muestra=${badCategories.slice(0, 3).map((ficha: ProviderFicha) => `${ficha.key}:${ficha.category}`).join(',') || '∅'}`,
);

const emptySuffixes: readonly ProviderFicha[] = goldFichas.filter((ficha: ProviderFicha) =>
  buildFichaFacts(ficha, { exposePhone: false }).some((fact: string) => fact.includes('()') || fact.includes(' — .')),
);
check(
  'H. Metadatos',
  'El prompt no imprime etiquetas vacías (ni "()" ni ubicaciones fantasma)',
  goldFichas.length > 0 && emptySuffixes.length === 0,
  `fichas con etiqueta vacía=${String(emptySuffixes.length)}`,
);

/* ── Cierre: resumen y código de salida ───────────────────────────────────── */
const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
for (const item of cases) {
  if (!item.ok) console.error(`❌ [${item.section}] ${item.name} — ${item.detail}`);
}
console.log(
  JSON.stringify(
    {
      verifier: 'verify_ficha_grounding',
      total: cases.length,
      passed: cases.length - failed.length,
      failed: failed.length,
      sections: Array.from(new Set(cases.map((item: CaseResult) => item.section))),
      store: stats,
      exit: failed.length === 0 ? 0 : 1,
    },
    null,
    2,
  ),
);
process.exit(failed.length === 0 ? 0 : 1);

