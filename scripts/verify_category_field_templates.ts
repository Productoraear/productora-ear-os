/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE PLANTILLAS DE FICHA POR CATEGORÍA
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica, contra el catálogo SSOT (`src/lib/providers/provider-field-catalog.ts`):
 *   1. Cada categoría tiene ≥ 300 campos editables (umbral de dominio).
 *   2. Cero claves duplicadas (ni en el núcleo ni dentro de una categoría).
 *   3. Toda clave está namespaceda (`prefijo.campo`) y en minúsculas ASCII.
 *   4. Ningún campo `sensitive` es `publicVisible` (fail-closed).
 *   5. Todo `group` existe en `PROVIDER_FIELD_GROUPS` y tiene orden canónico.
 *   6. Los 12 gremios están cubiertos y sus alias resuelven a sí mismos.
 *
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_category_field_templates.ts
 * Exit 0 ⇔ todo verde. Exit 1 ⇔ cualquier violación (imprime el detalle).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  CORE_FIELDS,
  PROVIDER_CATEGORY_BLUEPRINTS,
  PROVIDER_FIELD_GROUPS,
  PROVIDER_FIELD_GROUP_ORDER,
  PROVIDER_FIELD_MIN_PER_CATEGORY,
  buildProviderFieldSet,
  getProviderFieldCatalogStats,
  resolveProviderFieldCategory,
  type ProviderFieldCategoryKey,
  type ProviderFieldDef,
} from '../src/lib/providers/provider-field-catalog';

const KEY_RE: RegExp = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/;
const failures: string[] = [];
const notes: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

const groupIds = new Set<string>(PROVIDER_FIELD_GROUPS.map((group) => group.id));

function auditField(def: ProviderFieldDef, scope: string): void {
  if (!KEY_RE.test(def.key)) {
    fail(`[${scope}] clave no namespaceda: "${def.key}"`);
  }
  if (!groupIds.has(def.group)) {
    fail(`[${scope}] grupo inexistente "${def.group}" en la clave "${def.key}"`);
  }
  if (typeof PROVIDER_FIELD_GROUP_ORDER[def.group] !== 'number') {
    fail(`[${scope}] grupo sin orden canónico "${def.group}" (clave "${def.key}")`);
  }
  if (def.sensitive === true && def.publicVisible === true) {
    fail(`[${scope}] campo sensible marcado público: "${def.key}"`);
  }
  if (def.type === 'select' && (def.options === undefined || def.options.length === 0)) {
    fail(`[${scope}] select sin opciones: "${def.key}"`);
  }
  if (def.label.trim().length === 0) {
    fail(`[${scope}] etiqueta vacía en "${def.key}"`);
  }
}

// ── Núcleo común ───────────────────────────────────────────────────────────
const coreKeys = new Set<string>();
for (const def of CORE_FIELDS) {
  auditField(def, 'CORE');
  if (coreKeys.has(def.key)) fail(`[CORE] clave duplicada: "${def.key}"`);
  coreKeys.add(def.key);
}
if (CORE_FIELDS.length < 200) {
  fail(`[CORE] sólo ${CORE_FIELDS.length} campos: el núcleo común exige ≥ 200`);
}

// ── Categorías ─────────────────────────────────────────────────────────────
const stats = getProviderFieldCatalogStats();
const categories = Object.keys(PROVIDER_CATEGORY_BLUEPRINTS) as ProviderFieldCategoryKey[];

for (const category of categories) {
  const blueprint = PROVIDER_CATEGORY_BLUEPRINTS[category];
  if (blueprint.key !== category) {
    fail(`[${category}] blueprint con clave inconsistente: "${blueprint.key}"`);
  }
  if (blueprint.blocks.length === 0) {
    fail(`[${category}] sin bloques de categoría`);
  }

  const localKeys = new Set<string>(coreKeys);
  for (const def of blueprint.blocks.flat()) {
    auditField(def, category);
    if (localKeys.has(def.key)) fail(`[${category}] clave duplicada: "${def.key}"`);
    localKeys.add(def.key);
  }

  const total = stats.perCategory[category];
  if (total < PROVIDER_FIELD_MIN_PER_CATEGORY) {
    fail(`[${category}] ${total} campos < ${PROVIDER_FIELD_MIN_PER_CATEGORY} exigidos`);
  }

  const resolved = resolveProviderFieldCategory(category);
  if (resolved !== category) {
    fail(`[${category}] su propia clave resuelve a "${resolved}"`);
  }
  for (const alias of blueprint.aliases) {
    const aliasResolved = resolveProviderFieldCategory(alias);
    if (aliasResolved !== category) {
      fail(`[${category}] alias "${alias}" resuelve a "${aliasResolved}"`);
    }
  }

  const fieldSet = buildProviderFieldSet(category);
  const publicCount = fieldSet.filter((def) => def.publicVisible === true).length;
  const sensitiveCount = fieldSet.filter((def) => def.sensitive === true).length;
  notes.push(
    `${category.padEnd(12)} ${String(total).padStart(4)} campos · ${String(publicCount).padStart(3)} públicos · ${String(sensitiveCount).padStart(2)} sensibles · ${blueprint.blocks.length} bloques`,
  );
}

if (categories.length !== 12) {
  fail(`Se esperaban 12 gremios, hay ${categories.length}`);
}
if (new Set(categories).size !== categories.length) {
  fail('Hay claves de categoría repetidas');
}

// ── Alias globalmente inequívocos ──────────────────────────────────────────
const aliasOwner = new Map<string, ProviderFieldCategoryKey>();
for (const category of categories) {
  for (const alias of PROVIDER_CATEGORY_BLUEPRINTS[category].aliases) {
    const previous = aliasOwner.get(alias);
    if (previous !== undefined && previous !== category) {
      fail(`alias "${alias}" reclamado por "${previous}" y por "${category}"`);
    }
    aliasOwner.set(alias, category);
  }
}

// ── Informe ────────────────────────────────────────────────────────────────
console.log('[FIELD-TEMPLATES] Estado del catálogo de fichas por categoría');
console.log(`[FIELD-TEMPLATES] Núcleo común: ${stats.coreFields} campos · ${categories.length} gremios`);
for (const line of notes) console.log(`  · ${line}`);

if (failures.length > 0) {
  console.error(`\n[FIELD-TEMPLATES] ❌ ${failures.length} violación(es):`);
  for (const message of failures) console.error(`   - ${message}`);
  process.exit(1);
}

console.log(
  `\n[FIELD-TEMPLATES] ✅ 0 duplicados · 0 sensibles públicos · ≥${PROVIDER_FIELD_MIN_PER_CATEGORY} campos por gremio`,
);
process.exit(0);
