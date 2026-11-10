/**
 * Resolución de alias `@/...` y `next/...` para ejecutar módulos de `src/` en Node.
 * ---------------------------------------------------------------------------
 * Los handlers de Next 16 importan con `@/lib/...` y `next/server`. Cuando un
 * arnés necesita ejecutar EL CÓDIGO REAL del handler (no una copia), ambos
 * especificadores deben resolverse igual que en el build.
 *
 * `next/server` no se resuelve con el loader ESM de este repositorio (proyecto
 * `"type": "module"` + paquete `next` sin `exports` para ese subpath): se
 * cortocircuita al fichero físico que resuelve `require` y se carga como
 * CommonJS, exactamente como haría el runtime de Node de Next.
 *
 * Uso:  node --import ./scripts/lib/ts-alias-loader.mjs <script>
 * Debug: EAR_LOADER_DEBUG=1
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const resolveFromRoot = createRequire(path.join(ROOT, 'package.json')).resolve;
const CANDIDATES = ['', '.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx', '/index.js'];
const DEBUG = process.env.EAR_LOADER_DEBUG === '1';

function debug(line) {
  if (DEBUG) process.stderr.write(`[alias-loader] ${line}\n`);
}

function toUrl(absolutePath) {
  return pathToFileURL(absolutePath).href;
}

export async function resolve(specifier, context, nextResolve) {
  debug(`resolve ${specifier}`);

  if (specifier.startsWith('@/')) {
    const base = path.join(ROOT, 'src', specifier.slice(2));
    for (const suffix of CANDIDATES) {
      const candidate = `${base}${suffix}`;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        debug(`  alias -> ${candidate}`);
        return { url: toUrl(candidate), shortCircuit: true };
      }
    }
  }

  if (specifier.startsWith('next/')) {
    try {
      const physical = resolveFromRoot(specifier);
      debug(`  next -> ${physical}`);
      return { url: toUrl(physical), shortCircuit: true, format: 'commonjs' };
    } catch (reason) {
      debug(`  next NOT FOUND: ${reason instanceof Error ? reason.message : String(reason)}`);
    }
  }

  return nextResolve(specifier, context);
}

/** Los `.js` de `next` son CommonJS aunque se consuman desde un proyecto ESM. */
export async function load(url, context, nextLoad) {
  if (url.includes('/node_modules/next/') && url.endsWith('.js')) {
    return nextLoad(url, { ...context, format: 'commonjs' });
  }
  return nextLoad(url, context);
}
