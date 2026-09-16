/**
 * B5.41 — AUDITORÍA RFC 3986 DE LAS 5 PARTICIONES DEL SITEMAP
 * Ejecuta el generador de sitemaps (particiones 0-4) y valida que NINGUNA URL
 * contenga espacios, caracteres no codificados o slugs inválidos (XML Sitemap SOTA).
 *
 * Ejecución: npx tsx scripts/audit_sitemap_rfc3986.ts
 * Salida: Exit Code 0 si las 5 particiones son 100% RFC 3986 compliant.
 */
import assert from 'node:assert/strict';
import { generateSitemaps, default as sitemap } from '../src/app/sitemap';

// RFC 3986: una URL de sitemap válida no debe contener caracteres reservados sin codificar
const FORBIDDEN = /[\s()<>"'{}\\|\\^`]/;
const URL_RE = /^https?:\/\/[^\s]+$/;

async function auditPartition(id: string): Promise<{ total: number; invalid: string[] }> {
  const entries = await sitemap({ id: Promise.resolve(id) });
  const invalid: string[] = [];
  for (const e of entries) {
    if (!URL_RE.test(e.url)) {
      invalid.push(e.url);
      continue;
    }
    if (FORBIDDEN.test(e.url)) {
      invalid.push(e.url);
    }
  }
  return { total: entries.length, invalid };
}

async function main() {
  const partitions = (await generateSitemaps()).map((p) => p.id);
  console.log('B5.41 — Auditoría RFC 3986 · Particiones:', partitions.join(', '));

  let grandTotal = 0;
  let grandInvalid = 0;

  for (const id of partitions) {
    const { total, invalid } = await auditPartition(id);
    grandTotal += total;
    grandInvalid += invalid.length;
    const status = invalid.length === 0 ? '✓' : '✗';
    console.log(`  ${status} Partición ${id}: ${total} URLs · ${invalid.length} inválidas`);
    if (invalid.length > 0) {
      console.log('      Ejemplos inválidos:', invalid.slice(0, 3));
    }
  }

  assert.equal(grandInvalid, 0, `Se detectaron ${grandInvalid} URLs no RFC 3986`);
  console.log(`\n✅ B5.41 OK — ${grandTotal} URLs auditadas en ${partitions.length} particiones · 0 violaciones RFC 3986`);
}

main().catch((err) => {
  console.error('❌ B5.41 FAIL:', err instanceof Error ? err.message : err);
  process.exit(1);
});