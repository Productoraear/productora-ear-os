#!/usr/bin/env node
'use strict';

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * AUDIT_ADMIN_VANITY.CJS — S-CLASS ZERO-VANITY TELEMETRY AUDITOR
 * ════════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Honesto & Cero Fachadas (AF-1 / AF-5 / W48_T03):
 *   1. Verifica la existencia e integridad del canal canónico de telemetría:
 *      - src/lib/admin/metrics-provenance.ts
 *      - src/components/admin/MetricProvenanceBadge.tsx
 *   2. Verifica que las 5 vistas críticas de /admin integran MetricProvenanceBadge:
 *      - src/app/(admin)/admin/AdminDashboardClient.tsx
 *      - src/app/(admin)/admin/mailerfind/page.tsx
 *      - src/app/(admin)/admin/sourcing/page.tsx
 *      - src/app/(admin)/admin/directorio/page.tsx
 *      - src/app/(admin)/admin/calibrador-proveedores/page.tsx
 *   3. Audita que ninguna vista contenga números simulados huérfanos sin procedencia.
 *   4. Emite salida JSON de una línea apta para gate:prepush.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  'src/lib/admin/metrics-provenance.ts',
  'src/components/admin/MetricProvenanceBadge.tsx',
];

const TARGET_VIEWS = [
  'src/app/(admin)/admin/AdminDashboardClient.tsx',
  'src/app/(admin)/admin/mailerfind/page.tsx',
  'src/app/(admin)/admin/sourcing/page.tsx',
  'src/app/(admin)/admin/directorio/page.tsx',
  'src/app/(admin)/admin/calibrador-proveedores/page.tsx',
];

const ALLOWLIST_PATH = path.join(PROJECT_ROOT, '.antigravity', 'audit', 'admin_vanity_allowlist.json');

function main() {
  const errors = [];
  const orphans = [];

  // 1. Verificar archivos base de procedencia
  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(PROJECT_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Falta archivo obligatorio de procedencia: ${relPath}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    if (relPath.endsWith('metrics-provenance.ts')) {
      if (!content.includes('AdminMetric') || !content.includes('liveMetric') || !content.includes('staticMetric') || !content.includes('emptyMetric')) {
        errors.push(`metrics-provenance.ts no exporta las firmas canónicas exigidas`);
      }
    }
    if (relPath.endsWith('MetricProvenanceBadge.tsx')) {
      if (!content.includes('MetricProvenanceBadge')) {
        errors.push(`MetricProvenanceBadge.tsx no define el componente canónico`);
      }
      if (content.includes('use client') || content.includes('server-only')) {
        errors.push(`MetricProvenanceBadge debe ser componente presentacional puro (sin use client ni server-only)`);
      }
    }
  }

  // 2. Cargar allowlist
  let allowedNumbers = new Set();
  if (fs.existsSync(ALLOWLIST_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, 'utf8'));
      if (Array.isArray(parsed.allowedNumbers)) {
        allowedNumbers = new Set(parsed.allowedNumbers.map(Number));
      }
    } catch (e) {
      errors.push(`Error al leer allowlist: ${e.message}`);
    }
  }

  // 3. Auditar vistas de administración
  for (const relPath of TARGET_VIEWS) {
    const fullPath = path.join(PROJECT_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Falta vista requerida: ${relPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Debe importar MetricProvenanceBadge
    if (!content.includes('MetricProvenanceBadge')) {
      errors.push(`${relPath} no importa ni monta MetricProvenanceBadge`);
    }

    // Debe importar o enlazar helpers de procedencia o constantes SSOT
    const hasProvenance =
      content.includes('metrics-provenance') ||
      content.includes('liveMetric') ||
      content.includes('staticMetric') ||
      content.includes('emptyMetric') ||
      content.includes('providers-manifest') ||
      content.includes('macro-ecosystem-manifest');

    if (!hasProvenance) {
      errors.push(`${relPath} no conecta con el canal de procedencia ni manifiestos SSOT`);
    }

    // Comprobar si hay números en JSX sin procedencia
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Ignorar comentarios, estilos y clases Tailwind
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) return;
      if (line.includes('className=') && !line.includes('>{')) return;

      const numMatches = line.match(/>\s*([0-9]+(?:\.[0-9]+)?)\s*</g);
      if (numMatches) {
        for (const rawMatch of numMatches) {
          const num = Number(rawMatch.replace(/[^0-9.]/g, ''));
          if (!allowedNumbers.has(num)) {
            // Verificar si la línea contiene contexto de procedencia
            const isProvenanced =
              line.includes('MetricProvenanceBadge') ||
              line.includes('metric') ||
              line.includes('staticMetric') ||
              line.includes('liveMetric') ||
              line.includes('stats.') ||
              line.includes('format');

            if (!isProvenanced) {
              orphans.push({
                file: relPath,
                line: idx + 1,
                raw: line.trim(),
                unregisteredNumber: num
              });
            }
          }
        }
      }
    });
  }

  const ok = errors.length === 0 && orphans.length === 0;
  const result = {
    checked: TARGET_VIEWS.length + REQUIRED_FILES.length,
    files: TARGET_VIEWS,
    orphans,
    errors,
    ok
  };

  console.log(JSON.stringify(result));

  if (!ok) {
    process.exit(1);
  }
}

main();
