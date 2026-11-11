#!/usr/bin/env node
/**
 * verify_route_segment_config.cjs — GATE DE ROUTE-SEGMENT-CONFIG (P0 BUILD)
 *
 * Causa raiz medida del fallo de Coolify ("/bin/sh -c npm run build" exit code: 1):
 *   src/app/api/career/connect/[platform]/route.ts:21
 *   src/app/api/career/callback/[platform]/route.ts:17
 * ambos hacian `export { dynamic, runtime };` a partir de otro modulo.
 *
 * Next 16 analiza el route-segment-config de forma ESTATICA en compilacion, asi
 * que un reexport desde otro fichero es ilegal y aborta `next build` con:
 *   "The exported configuration object in a source file needs to have a very
 *    specific format from which some properties can be statically parsed".
 *
 * Este gate detecta ese patron en < 1 s (frente a ~12 min de build) y bloquea el
 * deploy antes de que el VPS de 1 vCPU gaste su unico nucleo.
 *
 * Exit 0 = limpio. Exit 1 = hay reexports ilegales (bloquea push/deploy).
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");

// Reexpresiones prohibidas del route-segment-config.
const CONFIG_KEYS = ["dynamic", "runtime", "revalidate", "fetchCache", "dynamicParams", "preferredRegion", "maxDuration"];
const REEXPORT_RE = new RegExp(`export\\s*\\{[^}]*\\b(${CONFIG_KEYS.join("|")})\\b[^}]*\\}`, "g");
const REEXPORT_FROM_RE = new RegExp(`export\\s*\\*\\s*from`, "g");
const IMPORT_AND_REEXPORT_RE = new RegExp(`^import\\s*\\{([^}]*)\\}\\s*from`, "m");

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && /\.(t|j)sx?$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error(`ROUTE_SEGMENT_CONFIG=ERROR src/app no existe en ${ROOT}`);
    process.exitCode = 1;
    return;
  }

  const files = walk(APP_DIR, []);
  const violations = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);

    lines.forEach((line, i) => {
      // Ignora comentarios de linea completos.
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;

      REEXPORT_RE.lastIndex = 0;
      const m = REEXPORT_RE.exec(line);
      if (m) {
        violations.push({
          file: rel,
          line: i + 1,
          rule: "reexport_route_segment_config",
          detail: trimmed,
          fix: `Sustituir por 'export const ${m[1]} = <literal>;' declarado en este mismo fichero`,
        });
      }

      // `export * from` propaga implicitamente el config del modulo origen.
      REEXPORT_FROM_RE.lastIndex = 0;
      if (REEXPORT_FROM_RE.test(line) && /\/(route|layout)$|\/route'|\/route"/.test(src)) {
        violations.push({
          file: rel,
          line: i + 1,
          rule: "star_reexport",
          detail: trimmed,
          fix: "Evitar `export *` en modulos de ruta; reexportar handlers explicitos",
        });
      }
    });

    // Un `import { dynamic }` que ademas se reexporta por lista corta.
    const imp = IMPORT_AND_REEXPORT_RE.exec(src);
    if (imp && CONFIG_KEYS.some((k) => new RegExp(`\\b${k}\\b`).test(imp[1])) && /export\s*\{/.test(src)) {
      const hasDirectConfig = CONFIG_KEYS.some((k) => new RegExp(`^export\\s+const\\s+${k}\\s*=`, "m").test(src));
      if (!hasDirectConfig) {
        // Se reporta solo si no hay declaracion local (la local es la correcta).
        const importLine = src.slice(0, imp.index).split(/\r?\n/).length;
        violations.push({
          file: rel,
          line: importLine,
          rule: "imported_config_without_local_declaration",
          detail: imp[0].trim(),
          fix: "Declarar el config localmente con literales estaticos",
        });
      }
    }
  }

  console.log(`ROUTE_SEGMENT_CONFIG_SCANNED=${files.length} FILES`);
  if (violations.length === 0) {
    console.log("ROUTE_SEGMENT_CONFIG=PASS VIOLATIONS=0");
    process.exitCode = 0;
    return;
  }

  for (const v of violations) {
    console.log(`FAIL  ${v.file}:${v.line}  [${v.rule}]  ${v.detail}`);
    console.log(`      FIX: ${v.fix}`);
  }
  console.log("");
  console.log(`ROUTE_SEGMENT_CONFIG=FAIL VIOLATIONS=${violations.length}`);
  process.exitCode = 1;
}

main();
