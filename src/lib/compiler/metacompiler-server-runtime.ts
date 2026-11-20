/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · RUNTIME SERVIDOR (Prisma + disco, server-only)
 * ════════════════════════════════════════════════════════════════════════════
 * Guard de servidor SIN dependencia externa: `server-only` no es un paquete
 * instalable — es un alias que resuelve el bundler de Next. Este módulo importa
 * `node:fs`, `node:path` y `@/lib/prisma`, así que si un `'use client'` lo
 * importara el build FALLA con "Module not found: Can't resolve 'font'/'fs'".
 * El fallo es determinista y ocurre en compilación, nunca en producción.
 *
 * Regla de honestidad: si PostgreSQL no responde, el sembrado LANZA. No se
 * degrada a "éxito en memoria": la FSM aborta en GATE_EVAL con SIN_EVIDENCIA.
 * Un verde falso aquí contamina el ledger de evidencias.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { ECOSYSTEM_SECTORS } from '@/lib/catalog/ecosystem-ontology';
import {
  META_DEFAULT_TIMEOUT_MS,
  SV_GATES_SCRIPT,
  buildPlatformSnapshot,
  canonicalNodeKey,
  parseSvGates,
  type MetaCompilerRuntime,
  type MetaRuntimeOptions,
} from './metacompiler-runtime';
import type { MetaOntologyNode } from './metacompiler-spec';

/**
 * Reexportación pública del arnés SV para los consumidores del runtime de
 * servidor. El parser vive en `metacompiler-runtime.ts` (módulo isomorfo) para
 * que servidor y verificador compartan UNA sola implementación; aquí sólo se
 * reexpone tras haberlo importado como valor (import + export explícitos, sin
 * redeclarar, para no colisionar con la definición origen).
 */
export { SV_GATES_SCRIPT, parseSvGates };

/** Espacio reservado donde vive la ontología sembrada (no colisiona con proveedores). */
export const META_ONTOLOGY_PROVIDER_SLUG = '__metacompiler_ontology__';
export const META_ONTOLOGY_CATEGORY = 'ONTOLOGY';
export const META_ONTOLOGY_UPDATED_BY = 'metacompiler';

/** `ont:<sector>::<nodeId>`: identifica el nodo sin tocar el modelo de datos. */
export function ontologyFieldKey(nodeId: string, sectorId: string = ECOSYSTEM_SECTORS[0].id): string {
  return `ont:${canonicalNodeKey(sectorId, nodeId)}`;
}

async function readGates(): Promise<string[]> {
  const file = path.join(process.cwd(), SV_GATES_SCRIPT);
  const source = await fs.readFile(file, 'utf8');
  return parseSvGates(source);
}

/**
 * Runtime del servidor. `prisma` se usa con `select` quirúrgico (INV-20) y sin
 * SQL crudo: el compilador no puede escribir en tablas que no le pertenecen.
 */
export function createServerRuntime(options: MetaRuntimeOptions = {}): MetaCompilerRuntime {
  const timeoutMs = Math.min(options.timeoutMs ?? META_DEFAULT_TIMEOUT_MS, META_DEFAULT_TIMEOUT_MS);

  const withTimeout = async <T>(work: Promise<T>): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const guard = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`META_TIMEOUT_${timeoutMs}ms`)), timeoutMs);
    });
    try {
      return await Promise.race([work, guard]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  };

  return {
    kind: 'SERVER',
    async platformSnapshot() {
      return buildPlatformSnapshot(new Date().toISOString());
    },
    async seedOntology(nodes: readonly MetaOntologyNode[]) {
      // Persistencia sin DDL: se reutiliza `providerProfileField`, cuya clave
      // única `(providerSlug, fieldKey)` es EXACTAMENTE la garantía de
      // idempotencia que exige INV-08. Se escribe con `upsert` + `update: {}`:
      // repetir la llamada N veces deja 1 fila y NUNCA pisa el valor existente.
      if (!process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
        throw new Error('META_NO_DATABASE_URL');
      }

      const providerSlug = META_ONTOLOGY_PROVIDER_SLUG;
      let inserted = 0;
      let skipped = 0;

      await withTimeout(
        prisma.$transaction(async (tx) => {
          for (const node of nodes) {
            const existing = await tx.providerProfileField.count({
              where: { providerSlug, fieldKey: ontologyFieldKey(node.id) },
            });
            if (existing > 0) {
              skipped += 1;
              continue;
            }
            await tx.providerProfileField.create({
              data: {
                providerSlug,
                fieldKey: ontologyFieldKey(node.id),
                category: META_ONTOLOGY_CATEGORY,
                valueText: `${node.kind}|${node.label}`.slice(0, 400),
                updatedBy: META_ONTOLOGY_UPDATED_BY,
              },
              select: { id: true },
            });
            inserted += 1;
          }
        }),
      );

      const total = await withTimeout(
        prisma.providerProfileField.count({
          where: { providerSlug, category: META_ONTOLOGY_CATEGORY },
        }),
      );
      return { inserted, skipped, total };
    },
    async probeGates() {
      const commands = await readGates();
      return { total: commands.length, commands };
    },
  };
}

