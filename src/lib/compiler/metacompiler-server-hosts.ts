/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · ANFITRIÓN DE SERVIDOR PARA LAS CAPACIDADES MCP
 * ════════════════════════════════════════════════════════════════════════════
 * Implementa las tres capacidades privilegiadas que el router JSON-RPC declara
 * como opcionales. Todas nacen CERRADAS (SEC-1) y todas son verificables:
 *
 *   createMutationHost()      → mutación AST real sobre `ecosystem-ontology.ts`
 *                               con escritura ATÓMICA y verificada por hash.
 *   createDeployHost(seals)   → webhook de Coolify sólo si existe la variable de
 *                               entorno y el sello fue SEALED en esta sesión.
 *   createConnectorStateStore → persistencia del estado de los 5 conectores en
 *                               `providerProfileField` (cero DDL nueva).
 *
 * Regla de honestidad heredada: si falta el dato (webhook, DB, fichero), la
 * capacidad responde "no configurado"; jamás simula el efecto.
 *
 * Server-only por construcción: importa `node:fs`, `node:path` y `@/lib/prisma`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import {
  applyMutations,
  collectSyntaxErrors,
  collectTranspileErrors,
  type AstMutation,
} from './ast-mutator';
import {
  META_ONTOLOGY_CATEGORY,
  META_ONTOLOGY_UPDATED_BY,
  ontologyFieldKey,
} from './metacompiler-server-runtime';
import {
  buildDefaultConnectorState,
  evaluateConnectorMatrix,
  normaliseConnectorState,
  type ConnectorState,
} from './connector-matrix';
import { sha256OfText } from './metacompiler-hash';

/** Ruta canónica del fichero que la mutación puede tocar. Nada fuera de aquí. */
export const ONTOLOGY_FILE = 'src/lib/catalog/ecosystem-ontology.ts';

function absoluteOntologyPath(): string {
  return path.join(process.cwd(), ONTOLOGY_FILE);
}

/**
 * Host de mutación AST. El fichero se RESUELVE y se comprueba que queda dentro
 * del árbol del proyecto (defensa en profundidad contra traversal, aunque la
 * ruta es una constante: una constante puede volverse variable en un refactor).
 */
export function createMutationHost() {
  const file = ONTOLOGY_FILE;
  const absolute = path.resolve(absoluteOntologyPath());
  const rootPrefix = path.resolve(process.cwd()) + path.sep;

  return {
    file,
    async mutate(input: {
      readonly id: string;
      readonly label: string;
      readonly href: string;
      readonly sector: string;
      readonly dryRun: boolean;
    }) {
      if (!absolute.startsWith(rootPrefix)) {
        throw new Error('META_MUTATION_PATH_ESCAPE');
      }
      const source = await fs.readFile(absolute, 'utf8');
      const mutation: AstMutation = {
        kind: 'ONTOLOGY_NODE_ADD',
        target: input.id,
        label: input.label,
        href: input.href,
        sector: input.sector,
      };
      const result = applyMutations(source, [mutation], path.basename(absolute));

      // Doble juicio de sintaxis ANTES de escribir: parser + transpilador.
      const transpileErrors = collectTranspileErrors(result.mutated, path.basename(absolute));
      const safeToWrite =
        result.ok && result.syntaxErrors.length === 0 && transpileErrors.length === 0;

      let wrote = false;
      if (!input.dryRun && safeToWrite && result.changed) {
        // Escritura atómica: archivo temporal + rename. Un corte a mitad no deja
        // el fichero fuente truncado (el rename es atómico en el SO).
        const temp = `${absolute}.tmp-${sha256OfText(result.mutated).slice(0, 12)}`;
        await fs.writeFile(temp, result.mutated, 'utf8');
        await fs.rename(temp, absolute);
        wrote = true;
      }

      return {
        ok: safeToWrite,
        changed: result.changed,
        wrote,
        sourceSha256: result.sourceSha256,
        mutatedSha256: result.mutatedSha256,
        applied: result.applied.map((entry) => `${entry.status}:${entry.target}:${entry.detail}`),
        rejected: result.rejected.map((entry) => `${String(entry.code)}:${entry.target}:${entry.detail}`),
        syntaxErrors: [...result.syntaxErrors, ...transpileErrors],
      };
    },
  };
}

/** Comprueba que el fichero fuente parsea: sonda de salud del árbol. */
export async function probeOntologySyntax(): Promise<{
  readonly ok: boolean;
  readonly bytes: number;
  readonly sha256: string;
  readonly errors: readonly string[];
}> {
  const source = await fs.readFile(absoluteOntologyPath(), 'utf8');
  const errors = [...collectSyntaxErrors(source), ...collectTranspileErrors(source)];
  return {
    ok: errors.length === 0,
    bytes: Buffer.byteLength(source, 'utf8'),
    sha256: sha256OfText(source),
    errors,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Host de despliegue (default-deny)
// ─────────────────────────────────────────────────────────────────────────────

/** Variable de entorno canónica del webhook de Coolify. Cero valores por defecto. */
export const COOLIFY_WEBHOOK_ENV = 'COOLIFY_DEPLOY_WEBHOOK';

/** Techo de espera del webhook (INV-17). */
const DEPLOY_TIMEOUT_MS = 8000;

/**
 * Host de despliegue. `isSealed` recibe el conjunto de sellos SEALED emitidos
 * por el compilador en ESTA sesión de proceso: un hash inventado no despliega.
 * Sin `AbortController` no hay despliegue (INV-17).
 */
export function createDeployHost(sealedHashes: Iterable<string>) {
  const webhook = (process.env[COOLIFY_WEBHOOK_ENV] ?? '').trim();
  const allowed = new Set(sealedHashes);
  return {
    configured: webhook.length > 0,
    isSealed(sealHash: string): boolean {
      return allowed.has(sealHash);
    },
    async trigger() {
      if (webhook.length === 0) {
        return { dispatched: false, detail: `${COOLIFY_WEBHOOK_ENV} no definido.` };
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), DEPLOY_TIMEOUT_MS);
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'ear-os-metacompiler', dispatchedAt: new Date().toISOString() }),
          signal: controller.signal,
        });
        return {
          dispatched: response.ok,
          detail: `HTTP ${response.status}`,
        };
      } catch (error: unknown) {
        const detail = error instanceof Error ? error.message : 'error de red';
        return { dispatched: false, detail: `Webhook fallido: ${detail}` };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistencia del estado de los 5 conectores (cero DDL nueva)
// ─────────────────────────────────────────────────────────────────────────────

export const CONNECTOR_STATE_PROVIDER_SLUG = '__metacompiler_connectors__';
/**
 * Clave dentro del slug. Se construye con `ontologyFieldKey` (helper compartido)
 * para que la forma `ont:<sector>::<slug>` no diverja del sembrado de ontología:
 * dos formatos de clave en la misma tabla serían dos verdades.
 */
export const CONNECTOR_STATE_FIELD_KEY = ontologyFieldKey(CONNECTOR_STATE_PROVIDER_SLUG);

/** ¿Hay base de datos configurada en este proceso? (sonda, no suposición) */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL);
}

export interface ConnectorStateStore {
  readonly kind: 'DATABASE' | 'UNAVAILABLE';
  load(now: string): Promise<{ readonly state: ConnectorState; readonly persisted: boolean }>;
  save(state: ConnectorState): Promise<{ readonly persisted: boolean; readonly detail: string }>;
}

/**
 * Store sobre `providerProfileField`. La clave única `(providerSlug, fieldKey)`
 * garantiza que N escrituras ⇒ 1 fila (INV-08), sin migración de esquema.
 * Si no hay DATABASE_URL devuelve `UNAVAILABLE`: la UI lo declara y nunca
 * presenta un estado guardado que en realidad sólo vivía en memoria.
 */
export function createConnectorStateStore(): ConnectorStateStore {
  if (!isDatabaseConfigured()) {
    return {
      kind: 'UNAVAILABLE',
      async load(now: string) {
        return { state: buildDefaultConnectorState(now), persisted: false };
      },
      async save() {
        return { persisted: false, detail: 'Sin DATABASE_URL: estado no persistido.' };
      },
    };
  }

  return {
    kind: 'DATABASE',
    async load(now: string) {
      const row = await prisma.providerProfileField.findUnique({
        where: {
          uniq_provider_field: {
            providerSlug: CONNECTOR_STATE_PROVIDER_SLUG,
            fieldKey: CONNECTOR_STATE_FIELD_KEY,
          },
        },
        select: { valueText: true },
      });
      if (row === null) {
        return { state: buildDefaultConnectorState(now), persisted: false };
      }
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(row.valueText);
      } catch {
        parsed = null;
      }
      return { state: normaliseConnectorState(parsed, now), persisted: true };
    },
    async save(state: ConnectorState) {
      await prisma.providerProfileField.upsert({
        where: {
          uniq_provider_field: {
            providerSlug: CONNECTOR_STATE_PROVIDER_SLUG,
            fieldKey: CONNECTOR_STATE_FIELD_KEY,
          },
        },
        create: {
          providerSlug: CONNECTOR_STATE_PROVIDER_SLUG,
          fieldKey: CONNECTOR_STATE_FIELD_KEY,
          category: META_ONTOLOGY_CATEGORY,
          valueText: JSON.stringify(state),
          updatedBy: META_ONTOLOGY_UPDATED_BY,
        },
        update: { valueText: JSON.stringify(state), updatedBy: META_ONTOLOGY_UPDATED_BY },
        select: { id: true },
      });
      return { persisted: true, detail: 'Estado de conectores persistido.' };
    },
  };
}

/** Matriz evaluada + estado + evidencia de persistencia, en una sola lectura. */
export async function readConnectorMatrix(now: string) {
  const store = createConnectorStateStore();
  const loaded = await store.load(now);
  return {
    store: store.kind,
    persisted: loaded.persisted,
    state: loaded.state,
    matrix: evaluateConnectorMatrix(loaded.state, now),
  };
}

