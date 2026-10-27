#!/usr/bin/env node
/**
 * RECONCILIADOR DE INTEGRIDAD DE PARTICIONES EDGE (ANTIGRAVITY OMEGA S-CLASS)
 * ============================================================================
 * Repara de forma DETERMINISTA la deriva entre los chunks publicados en
 * `public/data/providers/` y su manifiesto (`manifest.json`).
 *
 * Motivo: scripts de post-proceso (`absorb_html_vault.cjs`,
 * `refine_fincas_provinces.cjs`) reescriben particiones en sitio con
 * `JSON.stringify(..., null, 2)` (pretty-print) o añaden campos, sin re-split
 * ni refresco de SHA-256. Resultado real detectado en HEAD 0245e491a:
 *   - `finca.json` (1045,3 KB) rompía el presupuesto de 900 KB.
 *   - `sha256` del manifiesto NO coincidía con el fichero en disco.
 *   - `_meta.publishable` (12.987) no cuadraba con los chunks reales (13.094).
 *
 * Garantías:
 *   1. CERO pérdida de datos: solo se re-empaquetan los registros YA publicados.
 *   2. CERO invención: no se crean, enriquecen ni borran proveedores.
 *   3. Presupuesto idéntico al generador canónico (`build_lean_verified_edge.cjs`).
 *   4. Salida minificada (una sola línea) para maximizar el presupuesto útil.
 *   5. Idempotente: si ya cumple presupuesto + SHA-256, no escribe nada.
 *   6. Duplicados intra-gremio: deduplicados por `id` (primer registro gana).
 *   7. Duplicados inter-gremio: NO se tocan, se reportan como hallazgo P1.
 *
 * Uso:
 *   node scripts/resplit_edge_partition.cjs finca
 *   node scripts/resplit_edge_partition.cjs --all
 *   node scripts/resplit_edge_partition.cjs --all --dry-run
 *
 * Exit code: 0 si todas las particiones quedan íntegras, 1 en caso contrario.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const EDGE_DIR = path.join(ROOT, 'public', 'data', 'providers');
const MANIFEST_PATH = path.join(EDGE_DIR, 'manifest.json');
const MAX_FILE_BYTES = Number(process.env.EDGE_MAX_FILE_BYTES) || 900 * 1024;

/** Nombre canónico de chunk: `<categoria>.json`, `<categoria>__2.json`, ... */
function chunkFileName(category, index) {
  return index === 1 ? `${category}.json` : `${category}__${index}.json`;
}

/** Telemetría derivada de un conjunto de registros (mismas claves que el generador). */
function telemetryOf(records) {
  let withPhone = 0;
  let verified = 0;
  let withGeo = 0;
  let withRating = 0;
  let withSocial = 0;
  for (const record of records) {
    if (record.phone || record.telephone) withPhone += 1;
    if (record.verified === true) verified += 1;
    if (typeof record.lat === 'number' && typeof record.lng === 'number') withGeo += 1;
    if (typeof record.rating === 'number') withRating += 1;
    if (record.instagram || record.facebook) withSocial += 1;
  }
  return { withPhone, verified, withGeo, withRating, withSocial };
}

/** Empaqueta registros en chunks respetando MAX_FILE_BYTES (algoritmo del generador). */
function planChunks(category, records) {
  const chunks = [];
  let bucket = [];
  let bytes = 2; // corchetes
  let index = 1;

  const flush = () => {
    if (bucket.length === 0) return;
    const payload = JSON.stringify(bucket);
    const payloadBytes = Buffer.byteLength(payload, 'utf8');
    if (payloadBytes > MAX_FILE_BYTES) {
      throw new Error(
        `[${category}] ${chunkFileName(category, index)} excede el presupuesto (${payloadBytes} B)`,
      );
    }
    chunks.push({
      file: chunkFileName(category, index),
      count: bucket.length,
      bytes: payloadBytes,
      sha256: crypto.createHash('sha256').update(payload).digest('hex'),
      payload,
    });
    bucket = [];
    bytes = 2;
    index += 1;
  };

  for (const record of records) {
    const size = Buffer.byteLength(JSON.stringify(record), 'utf8') + (bucket.length ? 1 : 0);
    if (bucket.length > 0 && bytes + size > MAX_FILE_BYTES) flush();
    bucket.push(record);
    bytes += size;
  }
  flush();
  return chunks;
}

/**
 * Reúne los chunks reales de un gremio en disco (base + numerados ascendentes).
 * Los chunks huérfanos (no declarados en el manifiesto) se incorporan para no
 * perder registros; los declarados pero ausentes son un error duro.
 */
function collectChunkFiles(category, manifestEntry) {
  const escape = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const numberedRe = new RegExp(`^${escape}__(\\d+)\\.json$`);
  const onDisk = fs
    .readdirSync(EDGE_DIR)
    .map((name) => {
      if (name === `${category}.json`) return { name, index: 1 };
      const match = name.match(numberedRe);
      return match ? { name, index: Number(match[1]) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.name);

  const declared = Array.isArray(manifestEntry && manifestEntry.chunks) ? manifestEntry.chunks : [];
  const missing = declared.filter((file) => !fs.existsSync(path.join(EDGE_DIR, file)));
  if (missing.length > 0) {
    throw new Error(`[${category}] chunks declarados pero ausentes: ${missing.join(', ')}`);
  }
  const orphaned = onDisk.filter((file) => !declared.includes(file));
  return { files: onDisk, declared, orphaned };
}

/**
 * Reconcilia un gremio: deduplica por id, re-empaqueta y refresca el manifiesto.
 * @param {string} category
 * @param {{ manifest: any, dryRun?: boolean, dropIds?: Set<string> }} context
 */
function resplitPartition(category, context) {
  const manifest = context.manifest;
  const dryRun = context.dryRun === true;
  const dropIds = context.dropIds instanceof Set ? context.dropIds : new Set();
  const entry = manifest[category];
  if (!entry || typeof entry !== 'object') {
    throw new Error(`[${category}] no existe en manifest.json`);
  }

  const collected = collectChunkFiles(category, entry);
  const records = [];
  const seenIds = new Set();
  let duplicates = 0;
  /** @type {string[]} */
  const droppedForeign = [];

  for (const file of collected.files) {
    const parsed = JSON.parse(fs.readFileSync(path.join(EDGE_DIR, file), 'utf8'));
    if (!Array.isArray(parsed)) throw new Error(`[${category}] ${file} no contiene un array`);
    for (const record of parsed) {
      const id = record && record.id ? String(record.id) : null;
      if (id && dropIds.has(id)) {
        droppedForeign.push(id);
        continue;
      }
      if (id && seenIds.has(id)) {
        duplicates += 1;
        continue;
      }
      if (id) seenIds.add(id);
      records.push(record);
    }
  }

  const chunks = planChunks(category, records);
  const totalBytes = chunks.reduce((acc, chunk) => acc + chunk.bytes, 0);
  const previousChunks = Array.isArray(entry.chunks) ? entry.chunks : [];
  const staleFiles = collected.files.filter((file) => !chunks.some((chunk) => chunk.file === file));
  const diskMatchesPlan =
    collected.files.length === chunks.length &&
    chunks.every((chunk) => {
      const full = path.join(EDGE_DIR, chunk.file);
      if (!fs.existsSync(full)) return false;
      const onDisk = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
      return onDisk === chunk.sha256;
    });
  const alreadyCompliant =
    diskMatchesPlan &&
    previousChunks.length === chunks.length &&
    previousChunks.every((file, i) => file === chunks[i].file) &&
    Array.isArray(entry.sha256) &&
    entry.sha256.length === chunks.length &&
    entry.sha256.every((hash, i) => hash === chunks[i].sha256) &&
    entry.count === records.length &&
    staleFiles.length === 0;

  if (!dryRun && !alreadyCompliant) {
    for (const chunk of chunks) {
      const full = path.join(EDGE_DIR, chunk.file);
      const current = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
      const currentHash = current === null
        ? null
        : crypto.createHash('sha256').update(current).digest('hex');
      if (currentHash !== chunk.sha256) fs.writeFileSync(full, chunk.payload, 'utf8');
    }
    for (const stale of staleFiles) {
      fs.unlinkSync(path.join(EDGE_DIR, stale));
    }
  }

  const maxChunkBytes = Math.max(...chunks.map((chunk) => chunk.bytes));
  manifest[category] = {
    ...entry,
    count: records.length,
    publishable: records.length,
    overflow: 0,
    sizeKB: Number((totalBytes / 1024).toFixed(1)),
    chunks: chunks.map((chunk) => chunk.file),
    sha256: chunks.map((chunk) => chunk.sha256),
    ...telemetryOf(records),
  };

  return {
    category,
    changed: !alreadyCompliant,
    records: records.length,
    declaredBefore: typeof entry.count === 'number' ? entry.count : null,
    chunks: chunks.length,
    chunksBefore: previousChunks.length,
    maxChunkKB: Number((maxChunkBytes / 1024).toFixed(1)),
    totalKB: Number((totalBytes / 1024).toFixed(1)),
    duplicatesDropped: duplicates,
    droppedForeign,
    orphanedChunks: collected.orphaned,
    staleChunks: staleFiles,
    withinBudget: maxChunkBytes <= MAX_FILE_BYTES,
  };
}

/** Detecta identidades publicadas en más de un gremio (riesgo de doorway / P1). */
function crossGremioDuplicates(manifest) {
  const owners = new Map();
  for (const category of partitionCategories(manifest)) {
    const entry = manifest[category];
    if (!entry || !Array.isArray(entry.chunks)) continue;
    for (const file of entry.chunks) {
      const full = path.join(EDGE_DIR, file);
      if (!fs.existsSync(full)) continue;
      for (const record of JSON.parse(fs.readFileSync(full, 'utf8'))) {
        if (!record || !record.id) continue;
        const id = String(record.id);
        const list = owners.get(id) || [];
        if (!list.includes(category)) list.push(category);
        owners.set(id, list);
      }
    }
  }
  const duplicates = [];
  for (const [id, categories] of owners.entries()) {
    if (categories.length > 1) duplicates.push({ id, categories });
  }
  return duplicates;
}

const TELEMETRY_KEYS = ['publishable', 'withPhone', 'verified', 'withGeo', 'withRating', 'withSocial'];

/** Gremios reales del CDN: los que declaran `sha256` en el manifiesto. */
function partitionCategories(manifest) {
  return Object.keys(manifest).filter(
    (key) => key !== '_meta' && Array.isArray(manifest[key].sha256),
  );
}

/** Índice id -> gremios donde está publicado realmente (solo gremios reales). */
function indexPublishedIds(manifest) {
  const index = new Map();
  for (const category of partitionCategories(manifest)) {
    const entry = manifest[category];
    for (const file of entry.chunks) {
      const full = path.join(EDGE_DIR, file);
      if (!fs.existsSync(full)) continue;
      for (const record of JSON.parse(fs.readFileSync(full, 'utf8'))) {
        if (!record || !record.id) continue;
        const id = String(record.id);
        const owners = index.get(id) || new Set();
        owners.add(category);
        index.set(id, owners);
      }
    }
  }
  return index;
}

/**
 * Gremio canónico por id según el mapa de identidad del pipeline
 * (`reports/PROVIDER_IDENTITY_MAP.json`). Sin artefacto, no se aplica la regla.
 */
function loadCanonicalOwners() {
  const mapPath = path.join(ROOT, 'reports', 'PROVIDER_IDENTITY_MAP.json');
  const owners = new Map();
  if (!fs.existsSync(mapPath)) return owners;
  const parsed = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const list = Array.isArray(parsed.providers) ? parsed.providers : Array.isArray(parsed) ? parsed : [];
  for (const provider of list) {
    if (!provider || !provider.vendorId || !provider.category) continue;
    owners.set(`v-${provider.vendorId}`, String(provider.category));
  }
  return owners;
}

/**
 * Plan de purga de copias fuera de gremio canónico. Solo actúa con doble
 * evidencia: (1) el id está publicado en 2+ gremios reales y (2) el mapa de
 * identidad lo asigna a uno de ellos. Nunca borra la copia canónica.
 */
function planForeignDrops(manifest) {
  const index = indexPublishedIds(manifest);
  const owners = loadCanonicalOwners();
  const plan = new Map();
  const dropped = [];
  for (const [id, categories] of index.entries()) {
    if (categories.size < 2) continue;
    const canonical = owners.get(id);
    if (!canonical || !categories.has(canonical)) continue;
    for (const category of categories) {
      if (category === canonical) continue;
      const set = plan.get(category) || new Set();
      set.add(id);
      plan.set(category, set);
      dropped.push({ id, dropFrom: category, canonical });
    }
  }
  return { plan, dropped };
}

function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const all = argv.includes('--all');
  const enforceUniqueness = argv.includes('--enforce-uniqueness');
  const targets = argv.filter((arg) => !arg.startsWith('--'));

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifiesto no encontrado: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const real = partitionCategories(manifest);
  const categories = all ? real : targets;
  if (categories.length === 0) {
    console.error('❌ Indica al menos una categoría o usa --all');
    process.exit(1);
  }
  const notPartition = categories.filter((category) => !real.includes(category));
  if (notPartition.length > 0) {
    console.error(
      `❌ No son particiones de gremio (artefacto derivado o inexistente): ${notPartition.join(', ')}`,
    );
    process.exit(1);
  }

  const { plan, dropped } = enforceUniqueness
    ? planForeignDrops(manifest)
    : { plan: new Map(), dropped: [] };

  const results = categories.map((category) =>
    resplitPartition(category, { manifest, dryRun, dropIds: plan.get(category) || new Set() }),
  );

  const totals = { publishable: 0, withPhone: 0, verified: 0, withGeo: 0, withRating: 0, withSocial: 0 };
  for (const category of partitionCategories(manifest)) {
    const entry = manifest[category];
    if (!entry || typeof entry.count !== 'number') continue;
    totals.publishable += entry.count;
    for (const key of TELEMETRY_KEYS.slice(1)) {
      totals[key] += typeof entry[key] === 'number' ? entry[key] : 0;
    }
  }
  const metaDrift = TELEMETRY_KEYS.filter((key) => manifest._meta[key] !== totals[key]);
  if (!dryRun && metaDrift.length > 0) {
    manifest._meta = { ...manifest._meta, ...totals, generatedAt: new Date().toISOString() };
  }

  if (!dryRun) {
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }

  const duplicates = crossGremioDuplicates(manifest);
  const failures = results.filter((result) => !result.withinBudget);

  console.log(
    JSON.stringify(
      {
        doctrine: 'EDGE_PARTITION_INTEGRITY_RECONCILED',
        dryRun,
        maxFileKB: Math.round(MAX_FILE_BYTES / 1024),
        repaired: results.filter((result) => result.changed).map((result) => result.category),
        unchanged: results.filter((result) => !result.changed).map((result) => result.category),
        droppedForeignRecords: results.flatMap((result) =>
          result.droppedForeign.map((id) => ({ id, from: result.category })),
        ),
        enforcedUniqueness: enforceUniqueness ? dropped : [],
        metaDrift,
        metaCounts: totals.publishable,
        crossGremioDuplicateCount: duplicates.length,
        crossGremioDuplicates: duplicates.slice(0, 10),
        budgetViolations: failures.map((result) => result.category),
        details: results,
      },
      null,
      2,
    ),
  );

  process.exit(failures.length > 0 ? 1 : 0);
}

module.exports = { resplitPartition, crossGremioDuplicates, planChunks, MAX_FILE_BYTES };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
