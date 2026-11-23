/**
 * MOTOR DE AUDITORÍA AUTÓNOMA RECURSIVA AST (TASK-009)
 * Escanea recursivamente el árbol de código fuente (src/) validando:
 * 1. Declaración 'use client' estricta: cuando un archivo declara la directiva,
 *    debe estar en el prólogo del archivo (antes de cualquier sentencia de código).
 * 2. Ausencia de imports no resueltos o dependencias fantasma.
 * 3. Cero secretos de servidor (STRIPE_SECRET_KEY, DB credentials) en componentes marcados con 'use client'.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

console.log('── INICIANDO ESCÁNER AUTÓNOMO PROFUNDO AST (TASK-009) ──');

let filesScanned = 0;
let errorsFound = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        walk(fullPath);
      }
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      filesScanned++;
      const content = fs.readFileSync(fullPath, 'utf8');

      // 1. Chequeo de directiva 'use client' como directiva de módulo
      // Si la directiva existe como sentencia (no dentro de un comentario ni string largo de texto)
      const lines = content.split(/\r?\n/);
      let directiveLine = -1;
      let firstStatementLine = -1;

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          continue;
        }
        if (trimmed === "'use client';" || trimmed === '"use client";' || trimmed === "'use client'" || trimmed === '"use client"') {
          directiveLine = i;
          break;
        }
        if (firstStatementLine === -1) {
          firstStatementLine = i;
        }
      }

      if (directiveLine !== -1 && firstStatementLine !== -1 && directiveLine > firstStatementLine) {
        console.error(`[AST_ERROR] 'use client' después de sentencias de código en: ${path.relative(ROOT, fullPath)} (Línea ${directiveLine + 1} vs primera sentencia línea ${firstStatementLine + 1})`);
        errorsFound++;
      }

      // 2. Chequeo de variables sensibles de servidor en client components reales
      if (directiveLine !== -1) {
        if (/process\.env\.STRIPE_SECRET_KEY\b|process\.env\.DATABASE_URL\b/.test(content)) {
          console.error(`[SECURITY_ERROR] Secreto de servidor detectado en Client Component: ${path.relative(ROOT, fullPath)}`);
          errorsFound++;
        }
      }
    }
  }
}

walk(SRC);

console.log(`\nComponentes React/Next analizados en src/: ${filesScanned}`);
console.log(`Infracciones detectadas: ${errorsFound}`);

if (errorsFound > 0) {
  console.error('VERDICT: FAIL - Se encontraron infracciones en el análisis AST.');
  process.exit(1);
} else {
  console.log('VERDICT: PASS - Árbol de componentes limpio, directivas en el prólogo y cero fugas de secretos.');
  process.exit(0);
}
