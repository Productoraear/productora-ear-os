/**
 * Normaliza en disco todos los slugs opacos `prov-XXXX` de los catálogos de
 * proveedores a slugs semánticos `nombre-empresa-provincia`, conservando
 * `legacySlug` e `id` para redirecciones 301 desde Google Search Console.
 */
const fs = require('fs');
const path = require('path');

function slugifySegment(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function isOpaqueSlug(slug) {
  if (!slug || typeof slug !== 'string') return true;
  const norm = slug.trim().toLowerCase();
  if (!norm) return true;
  return /^(prov|vendor|v)-([a-z0-9]+-)*\d+$/i.test(norm) || /^\d+$/.test(norm);
}

function computeSemanticSlug(p, usedSlugs) {
  const current = typeof p.slug === 'string' ? p.slug.trim().toLowerCase() : '';
  if (current && !isOpaqueSlug(current)) {
    usedSlugs.add(current);
    return current;
  }

  const nameSlug = slugifySegment(p.name);
  if (!nameSlug || isOpaqueSlug(nameSlug)) {
    return current || slugifySegment(p.id);
  }

  let prov = '';
  if (typeof p.province === 'string' && p.province.trim()) {
    prov = p.province.trim();
  } else if (p.location && typeof p.location === 'object') {
    prov = p.location.province || p.location.city || '';
  }

  const provSlug = slugifySegment(prov);
  let base = nameSlug;
  if (provSlug && provSlug !== 'espana' && provSlug !== 'spain' && !base.endsWith(`-${provSlug}`) && !base.includes(`-${provSlug}-`)) {
    base = `${base}-${provSlug}`;
  }

  let candidate = base;
  if (usedSlugs.has(candidate)) {
    const idSuffix = slugifySegment(String(p.id || '').replace(/^prov-/i, ''));
    candidate = idSuffix ? `${base}-${idSuffix}` : `${base}-2`;
  }
  usedSlugs.add(candidate);
  return candidate;
}

function processArray(arr) {
  const used = new Set();
  // First pass: register existing non-opaque slugs
  for (const p of arr) {
    if (p && typeof p.slug === 'string' && !isOpaqueSlug(p.slug)) {
      used.add(p.slug.trim().toLowerCase());
    }
  }
  let updated = 0;
  for (const p of arr) {
    if (!p || typeof p !== 'object') continue;
    const oldSlug = typeof p.slug === 'string' ? p.slug.trim() : '';
    if (isOpaqueSlug(oldSlug)) {
      const nextSlug = computeSemanticSlug(p, used);
      if (nextSlug && nextSlug !== oldSlug) {
        if (oldSlug && !p.legacySlug) {
          p.legacySlug = oldSlug;
        }
        p.slug = nextSlug;
        if (p.atomic_specs && typeof p.atomic_specs === 'object' && isOpaqueSlug(p.atomic_specs.slug)) {
          p.atomic_specs.slug = nextSlug;
        }
        updated++;
      }
    }
  }
  return updated;
}

function processJsonFile(relPath) {
  const full = path.join(process.cwd(), relPath);
  if (!fs.existsSync(full)) return;
  const raw = fs.readFileSync(full, 'utf8');
  const data = JSON.parse(raw);
  let count = 0;
  if (Array.isArray(data)) {
    count = processArray(data);
  } else if (data && Array.isArray(data.providers)) {
    count = processArray(data.providers);
  } else if (data && Array.isArray(data.items)) {
    count = processArray(data.items);
  }
  if (count > 0) {
    fs.writeFileSync(full, JSON.stringify(data));
  } else {
    // Also ensure compact JSON if file exceeds 1MB
    const stat = fs.statSync(full);
    if (stat.size > 1000000) {
      fs.writeFileSync(full, JSON.stringify(data));
    }
  }
  console.log(`[SLUG_NORMALIZER] ${relPath} -> ${count} slugs normalizados`);
}

// 1. Curated & Public partitions
processJsonFile('src/data/curated_providers.json');

const pubDir = path.join(process.cwd(), 'public', 'data', 'providers');
if (fs.existsSync(pubDir)) {
  for (const file of fs.readdirSync(pubDir)) {
    if (file.endsWith('.json')) {
      processJsonFile(path.join('public', 'data', 'providers', file));
    }
  }
}

// 2. Main database (compact JSON to preserve size)
const mainDbPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
if (fs.existsSync(mainDbPath)) {
  const mainData = JSON.parse(fs.readFileSync(mainDbPath, 'utf8'));
  if (Array.isArray(mainData)) {
    const count = processArray(mainData);
    if (count > 0) {
      fs.writeFileSync(mainDbPath, JSON.stringify(mainData));
    }
    console.log(`[SLUG_NORMALIZER] src/data/all_providers_database.json -> ${count} slugs normalizados`);
  }
}
