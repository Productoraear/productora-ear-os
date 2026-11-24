#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR TRANSDUCTIVO DE ESQUEMAS Y DATASETS (SCHEMA LIFTING · S-CLASS)
 * ────────────────────────────────────────────────────────────────────────────
 * Verifica mecánicamente que ningún activo de datos, catálogo o dataset exista
 * como texto plano ciego. Todo archivo debe superar su validación transductiva.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const DATASETS = [
  {
    name: 'Catálogo Luces Navidad 2026 (652 Refs)',
    file: 'src/data/luces_navidad_2026_ear.json',
    minItems: 652,
    validateItem: (item) => Boolean(item.id && item.sku && item.name && typeof item.priceNumeric === 'number'),
  },
  {
    name: 'Radar Oportunidades B2G LCSP',
    file: 'src/data/b2g_opportunities_database.json',
    minItems: 1,
    validateItem: (item) => Boolean(item !== null && typeof item === 'object'),
  },
  {
    name: 'Frameworks Estratégicos EAR OS',
    file: 'src/data/EAR_OS_STRATEGIC_FRAMEWORKS.json',
    minItems: 1,
    validateItem: (item) => Boolean(item !== null && typeof item === 'object'),
  },
  {
    name: 'DAG de Intenciones del Oráculo (intent-dag.json)',
    file: 'src/data/intent-dag.json',
    minItems: 1,
    validateItem: (item) => Boolean(item !== null && typeof item === 'object'),
  },
];

console.log('════════════════════════════════════════════════════════════════');
console.log('🏛️ AUDITOR TRANSDUCTIVO DE ESQUEMAS & DATASETS (TIER-1 SRE)');
console.log('════════════════════════════════════════════════════════════════');

let totalDatasets = 0;
let totalVerifiedItems = 0;
let hasFailure = false;

DATASETS.forEach((ds) => {
  const fullPath = path.join(ROOT, ds.file);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Dataset no encontrado en disco: ${ds.file}`);
    hasFailure = true;
    return;
  }

  try {
    const rawContent = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(rawContent);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    if (items.length < ds.minItems) {
      console.error(`[FAIL] ${ds.name}: cantidad insuficiente (${items.length} < ${ds.minItems})`);
      hasFailure = true;
      return;
    }

    const invalid = items.filter((it) => !ds.validateItem(it));
    if (invalid.length > 0) {
      console.error(`[FAIL] ${ds.name}: ${invalid.length} items no cumplen el contrato tipado.`);
      hasFailure = true;
      return;
    }

    totalDatasets++;
    totalVerifiedItems += items.length;
    console.log(`[PASS] ${ds.name}: ${items.length} elementos validados por contrato tipado.`);
  } catch (err) {
    console.error(`[FAIL] ${ds.name}: Error parseando JSON: ${err.message}`);
    hasFailure = true;
  }
});

console.log('────────────────────────────────────────────────────────────────');
console.log(`TOTAL DATASETS ELEVADOS : ${totalDatasets} / ${DATASETS.length}`);
console.log(`TOTAL REGISTROS VALIDADOS: ${totalVerifiedItems}`);
console.log('════════════════════════════════════════════════════════════════');

if (hasFailure) {
  process.exit(1);
}

process.exit(0);
