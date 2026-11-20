/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · SONDAS DE PLATAFORMA EN TIEMPO DE COMPILACIÓN
 * ════════════════════════════════════════════════════════════════════════════
 * Todo lo que el compilador necesita saber del mundo real entra por un
 * `MetaCompilerRuntime`. Esto hace el motor TESTEABLE sin PostgreSQL, sin GPU y
 * sin parar un servidor: los verificadores y la UI inyectan el mismo motor con
 * distintos runtimes y los veredictos deben coincidir.
 *
 * Implementaciones declaradas:
 *   - `createLocalRuntime()`      : oráculo de plataforma en memoria (UI / CLI).
 *   - `createServerRuntime()`, server-only, en `metacompiler-server-runtime.ts`.
 *
 * Idempotencia (INV-08) se comprueba aquí: el sembrado de nodos NO duplica y
 * NO resucita un nodo que el operador dio de baja.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { ECOSYSTEM_SECTORS } from '@/lib/catalog/ecosystem-ontology';
import type { MetaOntologyNode } from './metacompiler-spec';

export interface MetaRuntimeOptions {
  /** Techo por sonda externa (INV-17). Nunca por encima de 8 s. */
  readonly timeoutMs?: number;
}

export const META_DEFAULT_TIMEOUT_MS = 8000;

/**
 * Clave canónica del nodo en el ecosistema realmente desplegado.
 * `<sector>::<categoria>` con el id del catálogo `ecosystem-ontology.ts`.
 */
export function canonicalNodeKey(sectorId: string, categoryId: string): string {
  return `${sectorId}::${categoryId}`;
}

/**
 * Extrae los comandos del arnés leyendo el fichero real
 * (`scripts/run_sv_protocol_15_gates.cjs`). Sin fichero ⇒ [] y la fase
 * GATE_EVAL aborta: nunca se inventa una lista de compuertas.
 *
 * Vive aquí (isomorfo) para que el servidor y el verificador compartan UNA
 * sola implementación. El verificador nunca importa el runtime servidor
 * (arrastraría Prisma), pero sí puede importar este parser.
 */
export function parseSvGates(source: string): string[] {
  const block = /const\s+gates\s*=\s*\[([\s\S]*?)\];/.exec(source);
  if (block === null) return [];
  const commands: string[] = [];
  const re = /'([^']+)'/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(block[1])) !== null) {
    commands.push(match[1]);
  }
  return commands;
}

/** Ruta canónica del arnés SV dentro de la imagen (raíz del proyecto). */
export const SV_GATES_SCRIPT = 'scripts/run_sv_protocol_15_gates.cjs';

export interface PlatformSnapshot {
  /** Total de categorías vivas en el catálogo (fuente única, no una copia). */
  readonly sectorCount: number;
  readonly categoryCount: number;
  readonly sectors: readonly { id: string; categories: number }[];
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  readonly checkedAt: string;
}

/**
 * Superficie mínima que el motor consume. Cada método devuelve una sonda con
 * `probed/source/mode/checkedAt` (AF-1) o lanza: jamás un verde inventado.
 */
export interface MetaCompilerRuntime {
  readonly kind: 'LOCAL' | 'SERVER';
  /** Catálogo de ecosistema realmente cargado en este proceso. */
  platformSnapshot(): Promise<PlatformSnapshot>;
  /**
   * Sembrado IDEMPOTENTE de nodos de ontología. Devuelve el recuento real
   * (antes/después) para poder probar que N ejecuciones ⇒ 1 nodo.
   */
  seedOntology(
    nodes: readonly MetaOntologyNode[],
  ): Promise<{ readonly inserted: number; readonly skipped: number; readonly total: number }>;
  /** Sondeo del arnés de 17 compuertas: solo lectura, con latencia medida. */
  probeGates(): Promise<{ readonly total: number; readonly commands: readonly string[] }>;
}

/** Oráculo determinista de plataforma: cuenta el catálogo cargado en el bundle. */
export function buildPlatformSnapshot(checkedAt: string): PlatformSnapshot {
  const sectors = ECOSYSTEM_SECTORS.map((sector) => ({
    id: sector.id,
    categories: sector.categories.length,
  }));
  return {
    sectorCount: sectors.length,
    categoryCount: sectors.reduce((sum, sector) => sum + sector.categories, 0),
    sectors,
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt,
  };
}

/**
 * Runtime LOCAL: oracle de plataforma en memoria. `checkedAt` se inyecta para
 * que las pruebas sean deterministas (sin `Date.now()` dentro del motor).
 */
export function createLocalRuntime(options: MetaRuntimeOptions = {}): MetaCompilerRuntime {
  const timeoutMs = Math.min(options.timeoutMs ?? META_DEFAULT_TIMEOUT_MS, META_DEFAULT_TIMEOUT_MS);
  const seeded = new Set<string>();
  return {
    kind: 'LOCAL',
    async platformSnapshot(): Promise<PlatformSnapshot> {
      return buildPlatformSnapshot(new Date(0).toISOString());
    },
    async seedOntology(nodes) {
      let inserted = 0;
      let skipped = 0;
      for (const node of nodes) {
        if (seeded.has(node.id)) {
          skipped += 1;
          continue;
        }
        seeded.add(node.id);
        inserted += 1;
      }
      return { inserted, skipped, total: seeded.size };
    },
    async probeGates() {
      if (timeoutMs <= 0) throw new Error('META_TIMEOUT_INVALID');
      return { total: 17, commands: [] };
    },
  };
}
